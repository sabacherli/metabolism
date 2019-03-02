<template lang="html">
  <div class="container">

    <!-- Remove meal from calendar if one has been chosen. -->
    <div class="day" v-if="pointer.meal">
      <div class="box" @click="removeRecipe(); goCalendar()">
        <p class="sign_remove" style="transform: rotate(45deg)">+</p>
      </div>
      <p class="dayname" @click="removeRecipe(); goCalendar()">Remove Meal</p>
      <div class="ingredients_break">

      </div>
    </div>

    <!-- Display filtered list of meals. -->
    <template v-for="recipe in recipiesFiltered(userData)">
      <!-- eslint-disable-next-line -->
      <div class="day">
        <!-- A user needs to be able to edit the recipe -->
        <div class="box" v-if="userData.uid !== 'default'" @click="setEditor(recipe); setEditFilters()">
          <p class="date"> {{ recipe.id }} </p>
          <img class="edit_icon" src="../assets/icon-edit.png" alt="Edit">
        </div>
        <!-- Default user shouldn't be able to edit the recipe, thus the edit icon is not shown -->
        <div class="box_default" v-if="userData.uid == 'default'">
          <p class="date_default"> {{ recipe.id }} </p>
        </div>
        <!-- Meal is selected and entered into the calendar in the backend -->
        <p class="dayname" @click="selectRecipe(recipe); goCalendar()"> {{ recipe.name }} </p>
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

    <div class="day" v-if="userData.uid !== 'default' && pointer.doc === ''">
      <div class="box">
        <p class="add">+</p>
      </div>
      <p class="dayname" v-if="newName"> {{ newName }} </p>
      <p class="dayname" v-else>Add Recipe</p>
      <div class="ingredients_break">

      </div>
      <template v-for="ingredient in newRecipe.ingredients">
        <!-- eslint-disable-next-line -->
        <div class="">
          <p class="meal"> {{ ingredient.ingredient }} </p>
          <p class="meal_location"> {{ ingredient.amount }} {{ ingredient.unit }} </p>
        </div>
      </template>
      <div class="">
        <p class="meal"> {{ newIngredient }} </p>
        <p class="meal_location"> {{ newAmount }} <span v-if="newUnit"> {{ newUnit }} </span> </p>
      </div>
      <div class="" v-if="newIngredient">

      </div>
      <div class="" v-if="!newRecipe.name">
        <label>Meal Name</label>
        <input class="amount" type="text" @keyup.enter="addName()" v-model="newName" required>
        <br>
        <div class="add_button" @click="addName()" style="margin-top: 20px; margin-bottom: 40px">
          <span class="add_text">Add Name</span>
        </div>
      </div>
      <div class="" v-if="newRecipe.name">
        <label>Ingredient</label>
        <input id="newIngredient" class="amount" type="text" @keyup.enter="focusAmount()" v-model="newIngredient">
        <br>
        <label>Amount</label>
        <input id="newAmount" class="amount" type="number" @keyup.enter="focusUnit()" v-model="newAmount">
        <br>
        <label>Unit</label>
        <input id="newUnit" class="amount" type="text" @keyup.enter="addIngredient()" v-model="newUnit">
        <br>
        <div class="add_button" @click="addIngredient()" style="margin-top: 20px; margin-bottom: 40px">
          <span class="add_text">Add Ingredient</span>
        </div>
        <br>
        <div class="confirm_button" style="margin-bottom: 70px" v-if="newRecipe.ingredients.length > 0" @click="addRecipe()">
          <span class="confirm_text">Add Recipe</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Recipes',
  created () {
    this.$store.commit('setPage', 'recipes')
  },
  data () {
    return {
      newName: null,
      newIngredient: null,
      newAmount: null,
      newUnit: null
    }
  },
  computed: {
    ...mapState([
      'userData',
      'pointer',
      'newRecipe'
    ])
  },
  methods: {
    ...mapMutations([
      'selectRecipe',
      'setEditor',
      'setEditFilters',
      'removeRecipe',
      'addIngredient',
      'addRecipie'
    ]),
    addName () {
      if (this.newName !== null && this.newName !== '') {
        this.$store.commit('addName', this.newName)
      } else {
        alert('Please enter a meal name.')
      }
    },
    addIngredient () {
      var ingredient = this.newIngredient
      var amount = Number(this.newAmount)
      var unit = this.newUnit
      if (this.newIngredient !== null && this.newAmount !== null && this.newUnit !== null) {
        this.$store.commit('pushIngredient', { ingredient, amount, unit })
      }
      this.newIngredient = null
      this.newAmount = null
      this.newUnit = null
      document.getElementById('newIngredient').focus()
    },
    addRecipe () {
      this.$store.commit('addRecipe')
      this.newName = null
    },
    goCalendar () {
      this.$router.push('/calendar')
    },
    recipiesFiltered (userData) {
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
      for (let f = 0; f < userData.mealplans[0].filters.length; f++) {
        if (userData.mealplans[0].filters[f].isActive) {
          activeFilters.push(userData.mealplans[0].filters[f].text)
        }
        if (userData.mealplans[0].filters[f].isRequired) {
          requiredFilters.push(userData.mealplans[0].filters[f].text)
        }
      }
      for (let r = 0; r < userData.mealplans[0].recipes.length; r++) {
        for (let t = 0; t < userData.mealplans[0].recipes[r].tags.length; t++) {
          if (activeFilters.includes(userData.mealplans[0].recipes[r].tags[t]) && containsAll(userData.mealplans[0].recipes[r].tags, requiredFilters) && !filteredRecipes.includes(userData.mealplans[0].recipes[r])) {
            filteredRecipes.push(userData.mealplans[0].recipes[r])
          }
        }
      }
      return filteredRecipes
    },
    focusIngredient () {
      document.getElementById('newIngredient').focus()
    },
    focusAmount () {
      document.getElementById('newAmount').focus()
    },
    focusUnit () {
      document.getElementById('newUnit').focus()
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
.box {
  position: relative;
  width: 30px;
  height: 25px;
  margin: auto;
  margin-bottom: 30px;
  padding: 5px;
  border: 2px solid black;
}
.box_default {
  position: relative;
  width: 30px;
  height: 25px;
  margin: auto;
  margin-bottom: 30px;
  padding: 5px;
  border: 2px solid black;
}
.edit_icon {
  position: absolute;
  height: 20px;
  width: 20px;
  top: 50%;
  left: 50%;
  opacity: 0;
  transform: translateX(-50%) translateY(-50%);
}
.container {
  position: relative;
  top: 210px;
  height: inherit;
  width: 85%;
  margin: auto;
  overflow: scroll;
  text-align: center;
  margin-bottom: 20px;
  white-space: nowrap;
  overflow-y: scroll;
  animation: slideInUp .8s;
  animation-delay: .4s;
  animation-fill-mode: forwards;
  opacity: 0;
}
.date {
  position: absolute;
  font-size: 20px;
  top: -5%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.date_default {
  position: absolute;
  font-size: 20px;
  top: -5%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.sign_remove {
  position: absolute;
  top: 50%;
  margin-top: -19px;
  left: 50%;
  margin-left: -7px;
  font-size: 30px;
  transition: .8s ease-in-out;
}
.day {
  margin-top: 70px;
}
.dayname {
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 50px;
}
.meal_location {
  font-size: 10px;
  margin-top: -10px;
  /* transition: .4s; */
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
  border-bottom-color: black;
  border-bottom-width: 1px;
}
.add {
  position: absolute;
  font-size: 20px;
  top: 50%;
  margin-top: -19px;
  left: 50%;
  margin-left: -7px;
  font-size: 30px;
  transition: .8s ease-in-out;
}
.box:hover .add {
  cursor: pointer;
  transform: rotate(270deg);
}
.add_button {
  position: relative;
  display: inline-block;
  margin-top: -20px;
  font-size: .714em;
  border: 1.2px solid black;
  border-radius: 20px 20px;
  padding: 5px 10px 5px 10px;
}
.add_button:active {
  transition: .05s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
.confirm_button {
  position: fixed;
  bottom: -20px;
  left: 50px;
  font-size: .714em;
  background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
  border-radius: 20px 20px;
  padding: 10px;
}
.confirm_text {
  color: white;
  font-size: 12px;
  font-weight: 500;
}
.confirm_button:active {
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
  transition: 0s;
}
input[type=text].amount,
input[type=number].amount {
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: black;
  border-bottom-width: 1px;
  display: block;
  width: 120px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 5px;
  font-size: 14px;
  font-family: Montserrat;
}
input[type=text]:focus.amount,
input[type=number]:focus.amount {
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: black;
  border-bottom-width: 2px;
  display: block;
  width: 120px;
  position: relative;
  outline: none;
}
label {
  position: relative;
  color: black;
  display: block;
  text-align: left;
  top: 30.5pt;
  width: 100px;
  left: 50%;
  transform: translateX(-60px);
  margin-right: auto;
  font-size: 10px;
}
@media (max-width: 1000px) {
  .edit_icon {
    opacity: 1;
  }
  .box:hover {
    cursor: pointer;
  }
  .date {
    display: none;
  }
}
@media (min-width: 1000px) {
  @media (hover:hover) {
    .box:hover {
      cursor: pointer;
    }
    .box:hover .date {
      opacity: 0;
    }
    .box:hover .edit_icon {
      opacity: 1;
      cursor: pointer;
      transition: .8s ease-in-out;
    }
  }
  .container {
    top: 240px;
    overflow: visible;
  }
  .day {
    display: inline-block;
    width: calc(100%/7);
    vertical-align: top;
    margin-left: 15px;
    margin-right: 15px;
    overflow-y: visible;
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
    border-bottom-color: black;
    border-bottom-width: 1px;
  }
}
@media (hover:hover) {
  .add_button:hover {
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
    transition: .2s;
  }
  .dayname:hover {
    cursor: pointer;
    background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: .4s ease-in-out;  }
}
</style>
