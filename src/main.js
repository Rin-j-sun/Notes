const app = new Vue({
    el: "#app",
    data: {
        column1: [
            {
                title: "Карточка 1",
                items: [
                    { text: "Пункт 1", checked: false },
                    { text: "Пункт 2", checked: false },
                    { text: "Пункт 3", checked: false }
                ],
                percentComplete: 0,
                date: null
            }
        ],
        column2: [
            {
                title: "Карточка 2",
                items: [
                    { text: "Пункт 1", checked: false },
                    { text: "Пункт 2", checked: false },
                    { text: "Пункт 3", checked: false },
                    { text: "Пункт 4", checked: false },
                    { text: "Пункт 5", checked: false }
                ],
                percentComplete: 0,
                date: null
            }
        ],
        column3: []
    },
    methods: {
        updatePercentComplete(card) {
            let doneCount = 0;
            for (const item of card.items) {
                if (item.checked) {
                    doneCount++;
                }
            }
            card.percentComplete = (doneCount / card.items.length) * 100;
            if (card.percentComplete === 100) {
                card.date = new Date().toLocaleString();
            }
        },
        moveCardToNextColumn(card, currentColumn, nextColumn) {
            nextColumn.push(card);
            currentColumn.splice(currentColumn.indexOf(card), 1);
        }
    },
    watch: {
        column1: {
            handler() {
                const doneCardsCount = this.column2.filter(
                    (card) => card.percentComplete === 100
                ).length;
                if (doneCardsCount < this.column2.length) {
                    const inProgressCount = this.column1.filter(
                        (card) => card.percentComplete > 50
                    ).length;
                    if (inProgressCount > 0) {
                        this.column1 = [];
                    }
                }
            },
            deep: true
        },
        column2: {
            handler(newVal) {
                const inProgressCard = newVal.find(
                    (card) => card.percentComplete > 50
                );
                if (newVal.length === 5 && inProgressCard) {
                    this.moveCardToNextColumn(
                        inProgressCard,
                        this.column2,
                        this.column3
                    );
                }
            },
            deep: true
        }
    }
});