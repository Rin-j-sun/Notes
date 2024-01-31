Vue.component('todo-item', {
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
                alert(`Слишком много задач. "${this.getColumnTitle(column)}".`);
                return;
            }
            if (column !== 'newColumn') {
                alert(`Можно добавлять только новые заметки.`);
                return;
            }
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
        }
    }
});

Vue.component('column', {
    props: ['title', 'cards'],
    template: `
      <div class="column">
      <h2>{{ title }}</h2>
      <card v-for="(card, index) in cards" :key="index" :card="card" @delete-card="deleteCard(index)" @save-local-storage="saveToLocalStorage"></card>
      <button class="add" v-if="title === 'Новые'" @click="addCardWithCustomTitle">Добавить заметку</button>
      </div>
    `,
    methods: {
        deleteCard(cardIndex) {
            this.$emit('delete-card', cardIndex);
        },
        addCardWithCustomTitle() {
            const customTitle = prompt('Введите заголовок для новой заметки:');
            if (customTitle) {
                this.$emit('add-card', customTitle);
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
      <div class="card">
      <h3>{{ card.title }}</h3>
      <ul>
        <li v-for="(item, index) in card.items" :key="index">
          <input type="text" v-model="item.text" :disabled="!item.editing">
          <input type="checkbox" v-model="item.completed" @change="saveToLocalStorage">
          <button @click="saveItem(index)" v-if="item.editing">Сохранить</button>
          <button @click="editItem(index)" v-else>Редактировать</button>
          <button @click="deleteItem(index)">Удалить</button>
        </li>
        <li v-if="card.items.length < 5 && card.status !== 'Закоченные'">
          <button @click="addItem">Добавить пункт</button>
        </li>
      </ul>
      <button v-if="card.status !== 'Закоченные'" @click="deleteCard">Удалить заметку</button>
      <p v-if="card.status === 'Закоченные'">Дата завершения: {{ card.completionDate }}</p>
      </div>
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