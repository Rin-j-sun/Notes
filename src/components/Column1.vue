<!--Создаем компонент Column1.vue, который отображает карточки первого столбца.-->
<!--Используем входной параметр cards, который содержит массив карточек первого столбца.-->
<!--Рендерим каждую карточку и добавляем кнопку для удаления карточки. -->
<!--Когда пользователь нажимает на кнопку "Add Card", вызывается метод addCard и передается новая -->
<!--карточка через событие addCard. При нажатии кнопки "Delete Card" вызывается -->
<!--метод deleteCard и передается индекс карточки, которую нужно удалить, через событие deleteCard.-->


export default {
name: 'Column',
props: {
cards: {
type: Array,
required: true
}
},
methods: {
addCard() {
const newCard = {
title: 'New Card',
items: []
}
this.$emit('addCard', newCard)
},
deleteCard(cardIndex) {
this.$emit('deleteCard', cardIndex)
},
changeStatus(cardIndex, newStatus) {
this.cards[cardIndex].status = newStatus
},
moveCard(cardIndex, targetColumn) {
const card = this.cards[cardIndex]
this.cards.splice(cardIndex, 1)
targetColumn.push(card)
}
}
}
