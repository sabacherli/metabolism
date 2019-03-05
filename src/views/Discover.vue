<template lang="html">
  <div id="cover_page">
    <div class="background">
      <transition name="slide" mode="out-in" appear>
      <component :is="currentPageComponent"></component>
      </transition>
      <div class="content" v-if="discoverFilters[0].isActive">
        <div class="title">
          {{ discoverFilters[0].text.toUpperCase() }}
        </div>
        <div style="margin-bottom: 70px" class="container_faq">
          <div class="break"></div>
          <template v-for="mealplan in popularMealplans">
            <div :key="mealplan.uid" class="container_mealplan">
              <div class="information">
                <p class="question">{{ mealplan.publicName }}</p>
                <br>
                <p class="details">ID: {{ mealplan.uid }}</p>
                <p class="details">Recipes: {{ mealplan.recipesAmount }}</p>
                <p class="details">Price: {{ mealplan.price }} {{ mealplan.currency }}</p>
                <div v-if="!checkIsOwned(mealplan)" class="purchase_button" @click="purchaseMealplan(mealplan)">
                  Purchase
                </div>
              </div>
              <template v-for="recipe in mealplan.recipes">
                <div :key="recipe.uid" class="day">
                  <div class="">
                    <!-- eslint-disable-next-line -->
                      <div class="box">
                        <p class="date"> {{ recipe.id }} </p>
                      </div>
                      <p class="dayname"> {{ recipe.name }} </p>
                      <div class="ingredients_break">

                      </div>
                      <template v-for="ingredient in recipe.ingredients">
                        <!-- eslint-disable-next-line -->
                        <div class="">
                          <p class="meal"> {{ ingredient.ingredient }} </p>
                          <p class="meal_location"> {{ ingredient.amount }} {{ ingredient.unit }} </p>
                        </div>
                      </template>
                      <div class="" style="margin-bottom: 70px">

                      </div>
                  </div>
                </div>
              </template>
              <div class="mealfilters">
                <template v-for="filter in mealplan.filters">
                  <div :key="filter.uid" class="mealfilter">
                    <p> {{ filter.text }} </p>
                    <div class="filter_selected"></div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="content" v-if="discoverFilters[1].isActive">
        <div class="title">
          {{ discoverFilters[1].text.toUpperCase() }}
        </div>
        <div style="margin-bottom: 70px" class="container_faq">
          <div class="break"></div>
          <p class="question">Enter the ID of a known meal plan:</p>
          <input class="search_input" type="text" name="" value="" placeholder="e.g. wPpDZo3Qrdz3Pkh2G6XW" v-model="uid">
          <div class="search_button" @click="searchMealplan()">
            Search
          </div>
          <div v-if="searchedMealplan" class="container_mealplan" style="margin-top: 70px">
            <div class="information">
              <p class="question">{{ searchedMealplan.publicName }}</p>
              <br>
              <p class="details">ID: {{ searchedMealplan.uid }}</p>
              <p class="details">Recipes: {{ searchedMealplan.recipesAmount }}</p>
              <p class="details">Price: {{ searchedMealplan.price }} {{ searchedMealplan.currency }}</p>
              <div class="purchase_button" @click="purchaseMealplan(searchedMealplan)">
                Purchase
              </div>
            </div>
            <div class="day">
              <template v-for="recipe in searchedMealplan.recipes">
                <div :key="recipe.uid" class="">
                  <!-- eslint-disable-next-line -->
                    <div class="box">
                      <p class="date"> {{ recipe.id }} </p>
                    </div>
                    <p class="dayname"> {{ recipe.name }} </p>
                    <div class="ingredients_break">

                    </div>
                    <template v-for="ingredient in recipe.ingredients">
                      <!-- eslint-disable-next-line -->
                      <div class="">
                        <p class="meal"> {{ ingredient.ingredient }} </p>
                        <p class="meal_location"> {{ ingredient.amount }} {{ ingredient.unit }} </p>
                      </div>
                    </template>
                </div>
              </template>
            </div>
            <div class="mealfilters">
              <template v-for="filter in searchedMealplan.filters">
                <div :key="filter.uid" class="mealfilter" @click="toggleFilter(filter)">
                  <p> {{ filter.text }} </p>
                  <div :class="{ filter_selected: filter.isActive }"></div>
                  <div :class="{ filter_required: filter.isRequired }"></div>
                  <div :class="{ filter_required2: filter.isRequired }"></div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import store from '../store'
import db from '@/database.js'
import DiscoverFilters from '@/components/DiscoverFilters.vue'

export default {
  name: 'Discover',
  components: {
    'filters-discover': DiscoverFilters
  },
  created () {
    store.commit('setPage', 'discover')
    setTimeout(function () {
      store.commit('rerender')
    }, 800)
  },
  data () {
    return {
      uid: ''
    }
  },
  computed: {
    ...mapState([
      'currentPage',
      'discoverFilters',
      'userData',
      'searchedMealplan',
      'popularMealplans'
    ]),
    currentPageComponent () {
      return 'filters-' + this.currentPage
    }
  },
  methods: {
    ...mapMutations([
      'toggleFilter'
    ]),
    searchMealplan () {
      var mealplanID = this.uid
      if (mealplanID === '') {
        this.$store.commit('setSearchedMealplan')
      } else {
        this.$store.commit('searchMealplan', mealplanID)
      }
    },
    checkIsOwned (mealplan) {
      var userData = this.userData
      var isOwned = false
      for (let m in userData.mealplans) {
        if (userData.mealplans[m].uid === mealplan.uid) {
          isOwned = true
          break
        }
      }
      return isOwned
    },
    purchaseMealplan (mealplan) {
      var userData = this.userData
      var calorieRatio = userData.calories / mealplan.calories
      // eslint-disable-next-line
      var stripe = Stripe('pk_test_eOIPf7mHX035HASoi8LrghW5', {
        betas: ['checkout_beta_4']
      })
      stripe.redirectToCheckout({
        items: [{
          sku: 'sku_ETuovBIeaLjPou', quantity: mealplan.price
        }],
        // Note that it is not guaranteed your customers will be redirected to this
        // URL *100%* of the time, it's possible that they could e.g. close the
        // tab between form submission and the redirect.
        successUrl: 'https://metabolism-salo.firebaseapp.com/discover',
        cancelUrl: 'https://metabolism-salo.firebaseapp.com/discover'
      })
        .then(function (result) {
          if (result.error) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer.
            alert(result.error.message)
          }
        })
      db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).set({
        name: mealplan.publicName,
        publicName: mealplan.publicName,
        isActive: false,
        isPublic: false,
        isPurchased: true,
        recipes: [],
        filters: [],
        price: mealplan.price,
        purchases: mealplan.purchases,
        currency: mealplan.currency,
        recipesAmount: mealplan.recipesAmount,
        uid: mealplan.uid
      })
      for (let filter in mealplan.filters) {
        db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).collection('filters').doc(mealplan.filters[filter].uid).set(mealplan.filters[filter])
      }
      for (let recipe in mealplan.recipes) {
        db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).collection('filters').doc(mealplan.recipes[recipe].uid).set(mealplan.recipes[recipe])
        for (let ingredient in mealplan.recipes[recipe].ingredients) {
          db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).collection('filters').doc(mealplan.recipes[recipe].uid).collection('ingredients').doc(mealplan.recipes[recipe].ingredients[ingredient].uid).set(mealplan.recipes[recipe].ingredients[ingredient])
        }
      }
    },
    recipesFiltered () {
      var mealplan = this.searchedMealplan
      var filteredRecipes = []
      var activeFilters = []
      var requiredFilters = []
      function containsAll (tags, requiredFilters) {
        for (let filter in requiredFilters) {
          if (!tags.includes(requiredFilters[filter])) {
            return false
          }
        }
        return true
      }
      for (let f = 0; f < mealplan.filters.length; f++) {
        if (mealplan.filters[f].isActive) {
          activeFilters.push(mealplan.filters[f].text)
        }
        if (mealplan.filters[f].isRequired) {
          requiredFilters.push(mealplan.filters[f].text)
        }
      }
      for (let r = 0; r < mealplan.recipes.length; r++) {
        for (let t = 0; t < mealplan.recipes[r].tags.length; t++) {
          if (activeFilters.includes(mealplan.recipes[r].tags[t]) && containsAll(mealplan.recipes[r].tags, requiredFilters) && !filteredRecipes.includes(mealplan.recipes[r])) {
            filteredRecipes.push(mealplan.recipes[r])
          }
        }
      }
      return filteredRecipes
    }
  }
}
</script>

<style lang="css" scoped>
@keyframes slideInUp {
  from {
    top: 400px;
    opacity: 0;
  }
  to {
    top: 210px;
    opacity: 1;
  }
}
#cover_page {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, lightpink, #ffdfa0);

}
.content {
  position: fixed;
  height: calc(100% - 110px);
  width: 100%;
  overflow: scroll;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  margin: 110px 0 0 0;
}
.title {
  text-align: left;
  font-size: 6em;
  font-weight: 800;
  letter-spacing: .05em;
  line-height: 1em;
  color: white;
  width: 90%;
  margin-left: 10%;
  position: relative;
  top: 80px;
  opacity: 0;
  transform: translateY(-150%);
  animation: slideInLeft .8s .6s forwards;
}
.container_faq {
  position: relative;
  top: 120px;
  width: 80%;
  margin-left: 10%;
  text-align: left;
  opacity: 0;
  animation: fadeIn .8s;
  animation-delay: 1.4s;
  animation-fill-mode: forwards;
}
.container_details {
  position: relative;
  width: 80%;
  margin-left: 10%;
  text-align: left;
  animation: slideInUp .8s;
  animation-delay: .4s;
  animation-fill-mode: forwards;
  opacity: 0;
}
.container_mealplan {
  display: block;
  margin-bottom: 20px;
  white-space: nowrap;
  overflow-y: scroll;
}
.break {
  position: relative;
  width: 50px;
  height: auto;
  left: 0px;
  margin-top: 40px;
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: white;
  border-bottom-width: 2px;
}
.question {
  text-align: left;
  font-size: 1.8em;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: -20px;
  color: white;
}
.answer {
  text-align: left;
  font-size: 1.2em;
  margin-top: 30px;
  margin-bottom: -20px;
  color: white;
}
.details {
  text-align: left;
  font-size: 1em;
  margin-top: 30px;
  margin-bottom: -20px;
  color: white;
}
.container_icons {
  position: relative;
  top: 260px;
  width: 100%;
  text-align: center;
  opacity: 0;
  animation: fadeIn .8s;
  animation-delay: 3s;
  animation-fill-mode: forwards;
}
.icon {
  display: inline-block;
  height: 40px;
  width: 40px;
  margin: 0px 20px 0 20px;
}
.search_button {
  position: relative;
  display: inline-block;
  top: 70px;
  margin-bottom: 40px;
  color: white;
  font-size: 1em;
  border: 2px solid white;
  border-radius: 20px 20px;
  padding: 5px 10px 5px 10px;
  opacity: 0;
  animation: fadeIn .8s;
  animation-delay: 2s;
  animation-fill-mode: forwards;
}
.search_button:active {
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
  transition: 0s;
}
.purchase_button {
  position: relative;
  width: 65px;
  margin-top: 50px;
  margin-bottom: -20px;
  color: white;
  font-size: 1em;
  text-align: left;
  font-size: 1em;
  border: 2px solid white;
  border-radius: 20px 20px;
  padding: 5px 10px 5px 10px;
  opacity: 0;
  animation: fadeIn .8s;
  animation-delay: 2s;
  animation-fill-mode: forwards;
}
.purchase_button:active {
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
  transition: 0s;
}
input[type=text].search_input,
input[type=number].search_input,
input[type=password].search_input {
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: white;
  border-bottom-width: 2px;
  display: block;
  width: 80%;
  position: relative;
  top: 50px;
  background: transparent;
  color: white;
  margin-bottom: 5px;
  font-size: 18px;
  font-family: Montserrat;
}
input[type=text]:focus.search_input,
input[type=number].search_input,
input[type=password]:focus.search_input  {
  position: relative;
  display: block;
  width: 80%;
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: white;
  border-bottom-width: 3px;
  outline: none;
}
::placeholder {
  font-size: 16px;
  font-family: Montserrat;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: .4px;
}
.box {
  position: relative;
  width: 30px;
  height: 25px;
  margin: auto;
  margin-bottom: 30px;
  padding: 5px;
  border: 2px solid white;
}
.information {
  position: relative;
  display: inline-block;
  width: 400px;
  margin-top: 50px;
  margin-bottom: 80px;
  vertical-align: top;
  overflow-y: visible;
  color: white;
  text-align: center;
}
.day {
  position: relative;
  display: inline-block;
  margin-top: 5px;
  width: 200px;
  vertical-align: top;
  color: white;
  text-align: center;
}
.date {
  position: absolute;
  font-size: 20px;
  top: -5%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.dayname {
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 50px;
}
.ingredients_break {
  position: relative;
  top: auto;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: auto;
  margin-top: -10px;
  margin-bottom: 35px;
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: white;
  border-bottom-width: 1px;
}
.meal {
  font-size: 16px;
  margin-top: 25px;
  margin-bottom: 25px;
}
.meal_location {
  font-size: 10px;
  margin-top: -20px;
}
.mealfilters {
  position: relative;
  height: 25px;
  margin-bottom: 80px;
  width: 100%;
  text-align: center;
}
.mealfilter {
  position: relative;
  display: inline-block;
  bottom: 15px;
  margin: auto 15px auto 15px;
  text-align: center;
  color: white;
}
.filter:hover {
  cursor: pointer;
}
.filter_selected {
  position: relative;
  bottom: 15px;
  margin: auto;
  height: 2px;
  background-color: white;
  animation: expand .4s;
  animation-fill-mode: forwards;
}
.filter_required {
  position: relative;
  bottom: 15px;
  margin: auto;
  height: 2px;
  background-color: white;
  animation: expand .4s;
  animation-fill-mode: forwards;
}
.filter_required2 {
  position: relative;
  bottom: 14px;
  margin: auto;
  height: 2px;
  background-color: white;
  animation: expand .4s;
  animation-fill-mode: forwards;
}
@media (max-width: 660px) {
  .title {
    position: relative;
    top: 20px;
    width: 90%;
    margin-left: 10%;
    text-align: left;
    line-height: 1em;
    color: white;
    font-size: 3em;
    font-weight: 800;
    letter-spacing: .05em;
    opacity: 0;
    transform: translateY(-150%);
    animation: slideInLeft .8s .6s forwards;
  }
  .container_faq {
    width: 80%;
    top: 50px;
  }
  .container_mealplan {
    position: relative;
    height: inherit;
    width: 85%;
    margin: auto;
    overflow: visible;
    text-align: center;
    margin-bottom: 20px;
    white-space: nowrap;
  }
  .information {
    width: 100%;
  }
  .mealfilters {
    position: relative;
    top: 70px;
    height: 25px;
    margin-bottom: 80px;
    width: 100%;
    text-align: center;
  }
  .day {
    display: inline;
    margin-top: 70px;
    color: white;
    text-align: center;
  }
  .question {
    font-size: 1.5em;
  }
}
@media (hover:hover) {
  .icon:hover {
    cursor: pointer;
  }
  .search_button:hover {
    cursor: pointer;
    color: #ffcab0;
    font-weight: 400;
    background: white;
    transition: .4s ease-in-out;
  }
  .purchase_button:hover {
    cursor: pointer;
    color: #ffcab0;
    font-weight: 400;
    background: white;
    transition: .4s ease-in-out;
  }
}
</style>
