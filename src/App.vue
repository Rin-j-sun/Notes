<!--создаем корневой компонент App.vue, который содержит -->
<!--три компонента столбцов: Column1.vue, Column2.vue и Column3.vue. -->
<!--В компонентах столбцов используются массивы cards для хранения карточек каждого -->
<!--столбца. Оопределяются методы для добавления и удаления карточек в каждом столбце.-->



<template>
  <div class="app">
    <column1 :cards="column1Cards" @addCard="addCardToColumn1" @deleteCard="deleteCardFromColumn1"></column1>
    <column2 :cards="column2Cards" @addCard="addCardToColumn2" @deleteCard="deleteCardFromColumn2"></column2>
    <column3 :cards="column3Cards" @addCard="addCardToColumn3" @deleteCard="deleteCardFromColumn3"></column3>
  </div>
</template>

<script>
import Column1 from './components/Column1.vue'
import Column2 from './components/Column2.vue'
import Column3 from './components/Column3.vue'

export default {
  name: 'App',
  components: {
    Column1,
    Column2,
    Column3
  },
  data() {
    return {
      column1Cards: [], // Массив карточек первого столбца
      column2Cards: [], // Массив карточек второго столбца
      column3Cards: [] // Массив карточек третьего столбца
    }
  },
  methods: {
    addCardToColumn1(card) {
      this.column1Cards.push(card)
    },
    addCardToColumn2(card) {
      this.column2Cards.push(card)
    },
    addCardToColumn3(card) {
      this.column3Cards.push(card)
    },
    deleteCardFromColumn1(cardIndex) {
      this.column1Cards.splice(cardIndex, 1)
    },
    deleteCardFromColumn2(cardIndex) {
      this.column2Cards.splice(cardIndex, 1)
    },
    deleteCardFromColumn3(cardIndex) {
      this.column3Cards.splice(cardIndex, 1)
    }
  }
}
</script>