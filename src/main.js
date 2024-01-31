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
          <column title="Важно" :cards="column1" @add-card="addCard('column1', $event)" @delete-card="deleteCard('column1', $event)" @save-local-storage="saveToLocalStorage"></column>
          <column title="В процессе" :cards="column2" @add-card="addCard('column2', $event)" @delete-card="deleteCard('column2', $event)" @save-local-storage="saveToLocalStorage"></column>
          <column title="Выполнено" :cards="column3" @add-card="addCard('column3', $event)" @delete-card="deleteCard('column3', $event)" @save-local-storage="saveToLocalStorage"></column>
      </div>
      `,
    data() {
        return {
            column1: [],
            column2: [],
            column3: []
        }
    },
    created() {
        this.loadFromLocalStorage();
    },
    methods: {
        //Ограничение на количество задач
        addCard(column, customTitle) {
            if (column === 'column1' && this.column1.length >= 3) {
                alert('Слишком много задач.');
                return;
            }
            if (column === 'column2' && this.column2.length >= 5) {
                alert('Слишком много выполняемых задач.');
                return;
            }
            const newCard = { title: customTitle || 'Новая заметка', items: [] };
            this[column].push(newCard);
            this.saveToLocalStorage(); // Сохраняем изменения при добавлении карточки
        },
        //Удаление карточки
        deleteCard(column, cardIndex) {
            this[column].splice(cardIndex, 1);
            this.saveToLocalStorage();
        },
        //Сохранение при перезагрузке страницы
        saveToLocalStorage() {
            localStorage.setItem('todo-columns', JSON.stringify({
                column1: this.column1,
                column2: this.column2,
                column3: this.column3
            }));
        },
        //Выгрузка данных после перезагрузки
        loadFromLocalStorage() {
            const data = JSON.parse(localStorage.getItem('todo-columns'));
            if (data) {
                this.column1 = data.column1 || [];
                this.column2 = data.column2 || [];
                this.column3 = data.column3 || [];
            }
        }
    }
});


//Компонент столбца
Vue.component('column', {
    props: ['title', 'cards'],
    template: `
      <div class="column">
          <h2>{{ title }}</h2>
          <card v-for="(card, index) in cards" :key="index" :card="card" @remove-card="deleteCard(index)" @save-local-storage="saveToLocalStorage"></card>
          <button @click="addCardWithCustomTitle">Добавить заметку</button>
      </div>
      `,
    methods: {
        deleteCard(cardIndex) {
            this.$emit('delete-card', cardIndex);
        },
        addCardWithCustomTitle() {
            const customTitle = prompt('Введите заголовок для новой заметки:');
            if (customTitle) {
                this.$emit('create-card', customTitle);
            }
        },
        saveToLocalStorage() {
            this.$emit('save-local-storage'); // Передаем событие сохранения изменений в родительский компонент
        }
    }
});

//компонент карточки
Vue.component('card', {
    props: ['card'],
    template: `
      <div class="card">
          <h3>{{ card.title }}</h3>
          <ul>
              <list-item v-for="(item, index) in card.items" :key="index" :item="item" @toggle-complete="toggleComplete(index)" @delete-item="deleteItem(index)"></list-item>
          </ul>
          <button @click="addItem">Добавить пункт</button>
          <button @click="deleteCard">Удалить заметку</button>
      </div>
      `,
    methods: {
        //добавление текста к чек-боксу
        addItem() {
            const customText = prompt('Введите текст для нового пункта:');
            if (customText) {
                this.card.items.push({ text: customText, completed: false });
                this.$emit('save-local-storage');
            }
        },
        //удаление карточки
        deleteCard() {
            this.$emit('delete-card');
        },
        toggleComplete(index) {
            if (!this.card.items[index].completed) {
                this.card.items[index].completed = true;
            } else {
                this.card.items[index].completed = false;
            }
            this.$emit('save-local-storage');
        },
        detem(index) {
            this.card.items.splice(index, 1);
            this.$emit('save-local-storage');
        }
    }
});

//компонент для добавления заметок, форма
Vue.component('list-item', {
    props: ['item'],
    template: `
      <li>
          <input type="checkbox" v-model="item.completed">
          <span :class="{ completed: item.completed }">{{ item.text }}</span>
          <button @click="$emit('delete-item')">Удалить</button>
      </li>
      `
});

//само приложение
new Vue({
    el: '#app',
    methods: {
        saveLocalStorage() {
            localStorage.setItem('todo-columns', JSON.stringify({
                сolumn1: this.сolumn1,
                сolumn2: this.сolumn2,
                column3: this.column3
            }));
        }
    },
    beforeUnmount() {
        this.saveLocalStorage();
    }
});
