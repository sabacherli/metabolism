<template lang="html">
  <div class="container">
    <!-- Remove meal from calendar if one has been chosen. -->
    <div class="day" v-if="checkSelection(userData, pointer)">
      <div class="box" @click="returnToCalendar(pointer); removeMeal()">
        <p class="sign_remove" style="transform: rotate(45deg)">+</p>
      </div>
      <p class="dayname" @click="returnToCalendar(pointer); removeMeal()">Remove Meal</p>
      <div class="ingredients_break">

      </div>
    </div>
    <!-- Display filtered list of meals. -->
    <template v-for="meal in filtered(userData)">
      <!-- eslint-disable-next-line -->
      <div class="day">
        <!-- A user needs to be able to edit the meal -->
        <div class="box" v-if="userID !== 'default'" @click="setEditor(meal); goEdit()">
          <p class="date"> {{ meal.id }} </p>
          <img class="edit_icon" src="../assets/icon-edit.png" alt="Edit">
        </div>
        <!-- Default user shouldn't be able to edit the meal, thus the edit icon is not shown -->
        <div class="box_default" v-if="userID == 'default'">
          <p class="date_default"> {{ meal.id }} </p>
        </div>
        <!-- Meal is selected and entered into the calendar in the backend -->
        <p class="dayname" @click="returnToCalendar(pointer); removeMeal(); selectMeal(meal)"> {{ meal.name }} </p>
        <div class="ingredients_break">

        </div>
        <template v-for="ingredient in meal.ingredients">
          <!-- eslint-disable-next-line -->
          <div class="">
            <p class="meal"> {{ ingredient.ingredient }} </p>
            <p class="meal_location"> {{ ingredient.amount }} {{ ingredient.unit }} </p>
          </div>
        </template>
      </div>
    </template>
    <div class="day" v-if="userID !== 'default' && pointer.doc === ''">
      <div class="box" @click="addMeal()">
        <p class="add">+</p>
      </div>
      <p class="dayname" v-if="mealName"> {{ mealName }} </p>
      <p class="dayname" v-else>Add Meal</p>
      <div class="ingredients_break">

      </div>
      <template v-for="ingredient in meal.ingredients">
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
      <div class="" v-if="!meal.name">
        <label for="">Meal Name</label>
        <input class="amount" type="text" @keyup.enter="addMealName(); focusIngredient()" v-model="mealName" required>
        <br>
        <div class="add_button" @click="addMealName()" style="margin-top: 20px; margin-bottom: 40px">
          <span class="add_text">Add Meal Name</span>
        </div>
      </div>
      <div class="" v-if="meal.name">
        <label for="">Ingredient</label>
        <input id="newIngredient" class="amount" type="text" @keyup.enter="focusAmount()" v-model="newIngredient">
        <br>
        <label for="">Amount</label>
        <input id="newAmount" class="amount" type="number" @keyup.enter="focusUnit()" v-model="newAmount">
        <br>
        <label for="">Unit</label>
        <input id="newUnit" class="amount" type="text" @keyup.enter="addIngredientToMeal()" v-model="newUnit">
        <br>
        <div class="add_button" @click="addIngredientToMeal()" style="margin-top: 20px; margin-bottom: 40px">
          <span class="add_text">Add Ingredient</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Recipies',
  created () {
    this.$store.commit('setPage', 'recipies')
  },
  computed: {
    ...mapState([
      'userData',
      'userID',
      'pointer',
      'meal',
      'mealName',
      'newIngredient',
      'newAmount',
      'newUnit'
    ]),
    mealName: {
      get () {
        return this.$store.state.mealName
      },
      set (value) {
        this.$store.commit('syncMealName', value)
      }
    },
    newIngredient: {
      get () {
        return this.$store.state.newIngredient
      },
      set (value) {
        this.$store.commit('syncIngredient', value)
      }
    },
    newAmount: {
      get () {
        return this.$store.state.newAmount
      },
      set (value) {
        this.$store.commit('syncAmount', value)
      }
    },
    newUnit: {
      get () {
        return this.$store.state.newUnit
      },
      set (value) {
        this.$store.commit('syncUnit', value)
      }
    }
  },
  methods: {
    ...mapMutations([
      'selectMeal',
      'addMealName',
      'addMeal',
      'addIngredientToMeal',
      'setEditor',
      'removeMeal'
    ]),
    returnToCalendar (pointer) {
      if (pointer.doc !== '') {
        this.$router.push('/calendar')
      }
    },
    filtered (userData) {
      var filteredMeals = []
      var activeTags = []
      for (let t = 0; t < userData.tagList.length; t++) {
        if (userData.tagList[t].isActive) {
          activeTags.push(userData.tagList[t].text)
        }
      }
      for (let f = 0; f < userData.recipies.length; f++) {
        for (let t = 0; t < userData.recipies[f].tags.length; t++) {
          if ((activeTags.includes(userData.recipies[f].tags[t])) && (!filteredMeals.includes(userData.recipies[f]))) {
            filteredMeals.push(userData.recipies[f])
          }
        }
      }
      return filteredMeals
    },
    checkSelection (userData, pointer) {
      if (pointer.position === 'breakfast') {
        return userData.calendar[pointer.doc].breakfast !== 'Breakfast'
      }
      if (pointer.position === 'lunch') {
        return userData.calendar[pointer.doc].lunch !== 'Lunch'
      }
      if (pointer.position === 'dinner') {
        return userData.calendar[pointer.doc].dinner !== 'Dinner'
      }
    },
    focusIngredient () {
      document.getElementById('newIngredient').focus()
    },
    focusAmount () {
      document.getElementById('newAmount').focus()
    },
    focusUnit () {
      document.getElementById('newUnit').focus()
    },
    goEdit () {
      this.$router.push('edit')
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
