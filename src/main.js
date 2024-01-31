const app = new Vue({
    el: '#app',


    data: {
        // Заголовок карточки
        cardTitle: '',
        // Столбцы
        column1: [],
        column2: [],
        column3: []
    },
    // монтирование, отображение самих заметок
    mounted() {
        this.loadCards();
    },
    methods: {
        // создание заметки
        createCard() {
            if (column1 === 'column1' && this.column1.length >= 3) {
                alert('Достигнуто максимальное количество карточек в первом столбце.');
                return;
            }
            else {
            if (this.cardTitle !== '') {
                const newCard = {
                    id: Date.now(),
                    title: this.cardTitle,
                    // чек-боксы
                    items: [
                        { id: 1, text: '', completed: false },
                        { id: 2, text: '', completed: false },
                        { id: 3, text: '', completed: false }
                    ],
                    completedItems: 0,
                    completedDate: ''
                };

                this.column1.push(newCard);
                this.cardTitle = '';
                this.saveCards();
            }}
        },
        // Ещё функционал перемещения
        updateCardStatus() {
            this.column1.forEach(card => {
                // константы для определения границы перемещения
                const completedItems = card.items.filter(item => item.completed).length;
                const completionPercentage = (completedItems / card.items.length) * 100;

                // Когда больше 50% выполненеия
                if (completionPercentage >= 50) {
                    card.completedItems = completedItems;
                    this.column2.push(card);
                    this.column1 = this.column1.filter(c => c.id !== card.id);
                }
            });

            // Перемемещение из 2 столбца
            this.column2.forEach(card => {
                const completedItems = card.items.filter(item => item.completed).length;
                const completionPercentage = (completedItems / card.items.length) * 100;

                if (completionPercentage === 100) {
                    card.completedItems = completedItems;
                    card.completedDate = new Date().toLocaleString();
                    this.column3.push(card);
                    this.column2 = this.column2.filter(c => c.id !== card.id);
                }
            });

            this.saveCards();
        },

        // какая-то загрузка карточек, влияние на проект неизвестно
        loadCards() {
            const savedCards = JSON.parse(localStorage.getItem('cards'));

            if (savedCards) {
                this.column1 = savedCards.column1 || [];
                this.column2 = savedCards.column2 || [];
                this.column3 = savedCards.column3 || [];
            }
        },
        // сохранение при перезагрузке
        saveCards() {
            const cards = {
                column1: this.column1,
                column2: this.column2,
                column3: this.column3
            };

            localStorage.setItem('cards', JSON.stringify(cards));
        }
    },
    // перемещение заметок по столбцам
    watch: {
        'column1': {
            handler() {
                this.updateCardStatus();
            },
            deep: true
        },
        'column2': {
            handler() {
                this.updateCardStatus();
            },
            deep: true
        }
    }
});
