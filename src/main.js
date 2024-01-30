let eventBus = new Vue();

// Форма Заметок
Vue.component('product-review', {
    template: `
      <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Пожалуйста, исправьте следующие ошибки:</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
      </p>

      <p>
        <label for="name">Заголовок:</label>
        <input id="name" v-model="name" placeholder="Заголовок">
      </p>

      <p>
        <label for="review">Пункты списка :</label>
        <textarea id="review" v-model="review"></textarea>
      </p>
        
      <p>
        <input type="submit" value="Создать">
      </p>
      </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if (!this.name) this.errors.push("Заголовок обязательно.");
            if (!this.review) this.errors.push("Пункты списка обязательны.");

            if (this.errors.length === 0) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                };

                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;

            }

        }
    }
});


// Вкладки
// страницы, вкладки
Vue.component('product-tabs', {
    template: `
      <div>
      <ul>
       <span class="tab"
             :class="{ activeTab: selectedTab === tab }"
             v-for="(tab, index) in tabs"
             @click="selectedTab = tab"
       >{{ tab }}</span>
      </ul>
      <div v-show="selectedTab === 'Заметки'">
        <p v-if="!reviews.length">Заметки отсутствуют.</p>
        <ul>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Пункты : {{ review.rating }}</p>
            <p>{{ review.review }}</p>
          </li>
        </ul>
      </div>
      <div v-show="selectedTab === 'Создать заметку'">
        <product-review></product-review>
      </div>
      
      
      </div>
    `,
    props: {
        reviews: {
            type: Array,
            required: true
        },
    },
    data() {
        return {
            tabs: ['Заметки', 'Создать заметку'],
            selectedTab: 'Заметки'
        }
    }
});


// Информация о самих заметках
Vue.component('product', {
    props: {
         reviews: {
            type: Array,
            required: true
        }
    },
    template: `
      

    <product-tabs :reviews="reviews"></product-tabs>
   
       
 `,
    data() {
        return {
            sizes: null,
            errors: [],
            product: "Носки",
            brand: 'Абибас',
            selectedVariant: 0,
            altText: "Пара носков",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantQuantity: 0

                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
        }
    },
    methods: {

    }
})


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        reviews: [],
    },
    methods: {

        },



    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        });
    }

})