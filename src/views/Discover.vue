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
          <p class="question">What is the calorie setting for?</p>
          <p class="answer">It is used to calculate the ratio of ingredients for the shoppinglist when multiple people are eating at one address.</p>
          <div style="margin-top: 70px"></div>
          <p class="question">Are my payment details stored?</p>
          <p class="answer">No. The entire payment flow is handled by Stripe. No credit card data is stored on our servers.</p>
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
        </div>
        <div class="search_button" @click="searchMealplan()">
          Search
        </div>
        <div v-if="searchedMealplan" class="container_mealplan">
          <!-- <div class="">
            <p class="question">{{ searchedMealplan.name }}</p>
            <p class="answer">{{ searchedMealplan.uid }}</p>
            <p>{{ searchedMealplan.recipesAmount }}</p>
            <p>{{ searchedMealplan.price }} {{ searchedMealplan.currency }}</p>
          </div> -->
          <template v-for="recipe in recipesFiltered()">
            <!-- eslint-disable-next-line -->
            <div class="day">
              <!-- A user needs to be able to edit the recipe -->
              <div class="box">
                <p class="date"> {{ recipe.id }} </p>
              </div>
              <!-- Meal is selected and entered into the calendar in the backend -->
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
          <div class="mealfilters">
            <template v-for="filter in searchedMealplan.filters">
              <!-- eslint-disable-next-line -->
              <div class="mealfilter" @click="toggleFilter(filter)">
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
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import store from '../store'
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
      'searchedMealplan'
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
.container_mealplan {
  position: relative;
  display: inline;
  width: 80%;
  margin-left: 10%;
  color: white;
  text-align: center;
  overflow: scroll;
  white-space: nowrap;
  animation: slideInUp .8s;
  animation-delay: .4s;
  animation-fill-mode: forwards;
  opacity: 0;
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
  top: 120px;
  left: 10%;
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
.day {
  margin-top: 50px;
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
  top: 70px;
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
@media (max-width: 700px) {
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
}
</style>
