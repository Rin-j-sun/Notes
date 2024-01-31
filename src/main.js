new Vue({
    el: '#app',
    data: {
        column1: [
            {
                title: 'Карточка 1',
                items: [{ text: 'Пункт 1', checked: false }, { text: 'Пункт 2', checked: false }, { text: 'Пункт 3', checked: false }],
                percentComplete: 0,
                date: '',
            },
            // Другие карточки для первого столбца
        ],
        column2: [
            {
                title: 'Карточка 4',
                items: [{ text: 'Пункт 1', checked: false }, { text: 'Пункт 2', checked: false }, { text: 'Пункт 3', checked: false }],
                percentComplete: 0,
                date: '',
            },
            // Другие карточки для второго столбца
        ],
        column3: [
            {
                title: 'Карточка 6',
                items: [{ text: 'Пункт 1', checked: false }, { text: 'Пункт 2', checked: false }, { text: 'Пункт 3', checked: false }],
                percentComplete: 0,
                date: '',
            },
            // Другие карточки для третьего столбца
        ],
        newCardTitle: '',
        newCardItems: [{ text: '' }],
    },
    methods: {
        addNewItem() {
            this.newCardItems.push({ text: '' });
        },
        createNewCard(column) {
            if (column === 1 && this.column1.length < 3) {
                this.column1.push({
                    title: this.newCardTitle,
                    items: this.newCardItems.map(item => ({ text: item.text, checked: false })),
                    percentComplete: 0,
                    date: '',
                });
            } else if (column === 2 && this.column2.length < 5) {
                this.column2.push({
                    title: this.newCardTitle,
                    items: this.newCardItems.map(item => ({ text: item.text, checked: false })),
                    percentComplete: 0,
                    date: '',
                });
            } else if (column === 3) {
                this.column3.push({
                    title: this.newCardTitle,
                    items: this.newCardItems.map(item => ({ text: item.text, checked: false })),
                    percentComplete: 0,
                    date: '',
                });
            }
            this.newCardTitle = '';
            this.newCardItems = [{ text: '' }];
        },
        updateCompletion(card, column) {
            // Логика для обновления процента выполнения и переноса карточек между столбцами
        },
    },
    watch: {
        column1: {
            handler() {
                for (const card of this.column1) {
                    this.updateCompletion(card, 'column1');
                }
            },
            deep: true,
        },
        column2: {
            handler() {
                for (const card of this.column2) {
                    this.updateCompletion(card, 'column2');
                }
            },
            deep: true,
        },
        column3: {
            handler() {
                for (const card of this.column3) {
                    this.updateCompletion(card, 'column3');
                }
            },
            deep: true,
        },
    },
});