Vue.component('notes-item', {
    template: '\
<li>\
{{ title }}\
<button v-on:click="$emit(\'delete\')">Удалить</button>\
</li>\
',
    props: ['title']
});

Vue.component('columns', {
    template: `
      <div class="columns">
      <column title="Новые" :cards="newColumn" @add-card="addCard('newColumn', $event)" @delete-card="deleteCard('newColumn', $event)" @save-local-storage="saveToLocalStorage"></column>
      <column title="В процессе" :cards="inProgressColumn" @delete-card="deleteCard('inProgressColumn', $event)" @save-local-storage="saveToLocalStorage"></column>
      <column title="Закоченные" :cards="completedColumn" @delete-card="deleteCard('completedColumn', $event)" @save-local-storage="saveToLocalStorage"></column>
      </div>
    `,
    data() {
        return {
            newColumn: [],
            inProgressColumn: [],
            completedColumn: [],
            maxCards: {
                newColumn: 3,
                inProgressColumn: 5,
                completedColumn: Infinity
            }
        }
    },
    created() {
        this.loadFromLocalStorage();
    },
    methods: {
        addCard(column, customTitle) {
            const totalCards = this.newColumn.length + this.inProgressColumn.length + this.completedColumn.length;
            if (totalCards >= this.maxCards.newColumn + this.maxCards.inProgressColumn + this.maxCards.completedColumn) {
                alert(`Слишком много задач.`);
                return;
            }

            if (this[column].length >= this.maxCards[column]) {
                alert(`Слишком много задач. Удалите одну из карточек. "${this.getColumnTitle(column)}".`);
                return;
            }
            if (column !== 'newColumn') {
                alert(`Можно добавлять только новые заметки.`);
                return;
            }

            // Создаем новую карточку
            const newCard = {
                title: customTitle || 'Новая заметка',
                items: [
                    { text: '', completed: false, editing: true },
                    { text: '', completed: false, editing: true },
                    { text: '', completed: false, editing: true }
                ],
                status: 'Новые'
            };
            this[column].push(newCard);
            this.saveToLocalStorage();
        },
        deleteCard(column, cardIndex) {
            this[column].splice(cardIndex, 1);
            this.saveToLocalStorage();
        },
        saveToLocalStorage() {
            localStorage.setItem('todo-columns', JSON.stringify({
                newColumn: this.newColumn,
                inProgressColumn: this.inProgressColumn,
                completedColumn: this.completedColumn
            }));
        },
        loadFromLocalStorage() {
            const data = JSON.parse(localStorage.getItem('todo-columns'));
            if (data) {
                this.newColumn = data.newColumn || [];
                this.inProgressColumn = data.inProgressColumn || [];
                this.completedColumn = data.completedColumn || [];
                // Состояния чекбоксов
                this.newColumn.forEach(card => card.items.forEach(item => item.completed = !!item.completed));
                this.inProgressColumn.forEach(card => card.items.forEach(item => item.completed = !!item.completed));
                this.completedColumn.forEach(card => card.items.forEach(item => item.completed = !!item.completed));
            }
        },
        getColumnTitle(column) {
            switch (column) {
                case 'newColumn':
                    return 'Новые';
                case 'inProgressColumn':
                    return 'В процессе';
                case 'completedColumn':
                    return 'Закоченные';
                default:
                    return '';
            }
        },

        methods: {
            // перемещение в процессе
            moveCardToInProgress(card) {
                const index = this.newColumn.indexOf(card);
                if (index !== -1) {
                    if (this.inProgressColumn.length >= this.maxCards.inProgressColumn) {
                        return;
                    }
                    this.newColumn.splice(index, 1);
                    this.inProgressColumn.push(card);
                    this.saveToLocalStorage();
                }
            },

            // перемещение в завершено
            moveCardToCompleted(card) {
                const index = this.inProgressColumn.indexOf(card);
                if (index !== -1) {
                    this.inProgressColumn.splice(index, 1);
                    this.completedColumn.push(card);
                    this.saveToLocalStorage();
                }
            },

            // обновление прогресса карточки
            updateCardProgress(card, progress) {
                if (progress >= 50 && progress < 100) {
                    // перемещение карточки из первого столбца во второй столбец
                    this.moveCardToInProgress(card);
                } else if (progress === 100) {
                    // перемещение карточки из второго столбца в третий столбец
                    this.moveCardToCompleted(card);
                }
            }
        }

        // // перемещение в процессе
        // moveCardToInProgress(card){
        //     const index = this.newColumn.indexOf(card);
        //     if (index !==-1){
        //         if (this.inProgressColumn.length >= this.maxCards.inProgressColumn){
        //             return;
        //         }
        //         this.newColumn.splice(index, 1);
        //         this.inProgressColumn.push(card);
        //         this.saveToLocalStorage();
        //     }
        // },
        // // перемещение при завершении
        // moveCardToCompleted(card){
        //     const index = this.inProgressColumn.indexOf(card);
        //     if (index !==-1){
        //         this.completedColumn.push(card);
        //         this.inProgressColumn.splice(index, 1);
        //         this.saveToLocalStorage();
        //     }
        // },

    }
});

Vue.component('column', {
    props: ['title', 'cards'],
    template: `
      <div class="column">
      <h2>{{ title }}</h2>
      <card v-for="(card, index) in cards" :key="index" :card="card" @delete-card="deleteCard(index)" @save-local-storage="saveToLocalStorage"></card>
      <form action="" v-if="title === 'Новые'">
        <input type="text" v-model="customTitle">
        <button class="add" @click="addCardWithCustomTitle">Добавить заметку</button>
      </form>
      </div>
    `,
    data() {
        return {
            customTitle: ''
        };
    },
    methods: {
        deleteCard(cardIndex) {
            this.$emit('delete-card', cardIndex);
        },
        // Добавление заголовка для новой карточки
        addCardWithCustomTitle() {
                if (this.customTitle) {
                    this.$emit('add-card', this.customTitle);
                }
            },
        saveToLocalStorage() {
            this.$emit('save-local-storage');
        }
    }
});

Vue.component('card', {
    props: ['card'],
    template: `
<!--Поле ввода сохранение по умолчанию-->
      <div class="card">
      <h3>{{ card.title }}</h3>
      <ul>
        <li v-for="(item, index) in card.items" :key="index">
          <input type="checkbox" v-model="item.completed" @change="saveToLocalStorage">
          <input type="text" v-model="item.text" :disabled="!item.editing" @change="saveToLocalStorage">
          <button @click="saveItem(index)" v-if="item.editing">Сохранить</button>
          <button @click="editItem(index)" v-else>Редактировать</button>
        </li>
        <li v-if="card.items.length < 5 && card.status !== 'Закоченные'">
          <!-- <button @click="addItem">Добавить пункт</button> -->
        </li>
      </ul>
      <p v-if="card.status === 'Закоченные'">Дата завершения: {{ card.completionDate }}</p>
      </div>
<!--      <div class="card">-->
<!--      <h3>{{ card.title }}</h3>-->
<!--      <ul>-->
<!--        <li v-for="(item, index) in card.items" :key="index">-->
<!--&lt;!&ndash;          Сохранение чекбоксов&ndash;&gt;-->
<!--          <input type="checkbox" v-model="item.completed" @change="saveToLocalStorage">-->
<!--&lt;!&ndash;          текст задачи&ndash;&gt;-->
<!--          <input type="text" v-model="item.text"  :disabled="!item.editing">-->
<!--          <button @click="saveItem(index)" v-if="item.editing">Сохранить</button>-->
<!--          <button @click="editItem(index)" v-else>Редактировать</button>-->
<!--&lt;!&ndash;          <button @click="deleteItem(index)">Удалить</button>&ndash;&gt;-->
<!--        </li>-->
<!--        <li v-if="card.items.length < 5 && card.status !== 'Закоченные'">-->
<!--&lt;!&ndash;          кнопка добавить пункт&ndash;&gt;-->
<!--&lt;!&ndash;          <button @click="addItem">Добавить пункт</button>&ndash;&gt;-->
<!--        </li>-->
<!--      </ul>-->
<!--&lt;!&ndash;      Кнопка удаления заметки&ndash;&gt;-->
<!--&lt;!&ndash;      <button v-if="card.status !== 'Закоченные'" @click="deleteCard">Удалить заметку</button>&ndash;&gt;-->
<!--      <p v-if="card.status === 'Закоченные'">Дата завершения: {{ card.completionDate }}</p>-->
<!--      </div>-->
    `,
    methods: {
        addItem() {
            if (this.card.items.length < 5) {
                this.card.items.push({ text: '', completed: false, editing: true });
                this.saveToLocalStorage();
            } else {
                alert('Слишком много задач.');
            }
        },
        deleteItem(index) {
            this.card.items.splice(index, 1);
            this.saveToLocalStorage();
        },
        deleteCard() {
            this.$emit('delete-card');
        },
        saveItem(index) {
            this.card.items[index].editing = false;
            this.saveToLocalStorage();
        },
        editItem(index) {
            this.card.items[index].editing = true;
        },
        saveToLocalStorage() {
            this.checkCardStatus();
            this.$emit('save-local-storage');
        },
        checkCardStatus() {
            const completedItems = this.card.items.filter(item => item.completed).length;
            const totalItems = this.card.items.length;
            if (completedItems > 0 && completedItems === totalItems) {
                this.card.status = 'Закоченные';
                this.card.completionDate = new Date().toLocaleString();
            } else if (completedItems > totalItems / 2) {
                this.card.status = 'В процессе';
            } else {
                this.card.status = 'Новые';
            }
        }
    }
});

new Vue({
    el: '#app',
    data() {
        return {
            newColumn: [],
            inProgressColumn: [],
            completedColumn: [],
        }
    },
    created() {
        this.loadFromLocalStorage();
    },
    methods: {
        deleteCard(column, cardIndex) {
            this[column].splice(cardIndex, 1);
            this.saveToLocalStorage();
        },
        saveToLocalStorage() {
            localStorage.setItem('todo-columns', JSON.stringify({
                newColumn: this.newColumn,
                inProgressColumn: this.inProgressColumn,
                completedColumn: this.completedColumn
            }));
        },
        loadFromLocalStorage() {
            const data = JSON.parse(localStorage.getItem('todo-columns'));
            if (data) {
                this.newColumn = data.newColumn || [];
                this.inProgressColumn = data.inProgressColumn || [];
                this.completedColumn = data.completedColumn || [];
                // Установка состояния чекбоксов
                this.newColumn.forEach(card => card.items.forEach(item => item.completed = !!item.completed));
                this.inProgressColumn.forEach(card => card.items.forEach(item => item.completed = !!item.completed));
                this.completedColumn.forEach(card => card.items.forEach(item => item.completed = !!item.completed));
            }
        },
    }
});