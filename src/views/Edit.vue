<template lang="html">
  <div class="container_recipies">
    <template v-for="filteredmeal in filtered(userData, editor)">
      <!-- eslint-disable-next-line -->
      <div class="recipies">
        <div class="number" @click="returnToMenu(); deleteMeal()">
          <p class="add_recipe" style="transform: rotate(45deg)">+</p>
        </div>
        <p class="recipe_name"> {{ filteredmeal.name }} </p>
        <div class="square square_recipies">

        </div>
        <div class="" align="left">
          <label for="">Recipe Name</label>
          <input id="mealName" class="amount editPlace" type="text" @keyup.enter="removeFocus()" v-model="filteredmeal.name" required>
        </div>
        <div class="purchase_button" @click="removeFocus()" style="margin-top: 20px">
          <span class="purchase_text">Update Meal Name</span>
        </div>
      </div>
      <!-- eslint-disable-next-line -->
      <template v-for="ingredient in filteredmeal.ingredients">
        <!-- eslint-disable-next-line -->
        <div class="recipies">
          <div class="number" @click="deleteIngredient(ingredient)">
            <p class="add_recipe" style="transform: rotate(45deg)">+</p>
          </div>
          <p class="recipe_name"> {{ ingredient.ingredient }} </p>
          <p class="amount"> {{ ingredient.amount }} {{ ingredient.unit }} </p>
          <div class="" align="left">
            <label for="">Ingredient</label>
            <input class="amount" type="text" @keyup.enter="focusAmount" v-model="ingredient.ingredient" required>
            <br>
            <label for="">Amount</label>
            <input id="amount" class="amount" type="number" name="" value="" @keyup.enter="focusUnit" v-model="ingredient.amount" required>
            <br>
            <label for="">Unit</label>
            <input id="unit" class="amount editPlace" type="text" @keyup.enter="removeFocus" v-model="ingredient.unit" required>
          </div>
          <div class="purchase_button" @click="removeFocus()" style="margin-top: 20px">
            <span class="purchase_text">Update Ingredient</span>
          </div>
        </div>
      </template>
    </template>
    <div class="recipies">
      <div class="number">
        <p class="add_recipe" @click="addIngredient()">+</p>
      </div>
      <p class="recipe_name" v-if="mealName"> {{ mealName }} </p>
      <p class="recipe_name" v-else>Add Ingredient</p>
      <template v-for="object in meal.ingredients">
        <!-- eslint-disable-next-line -->
        <div class="">
          <p class="recipe_name"> {{ object.ingredient }} </p>
          <p class="amount"> {{ object.amount }} <span> {{ object.unit }} </span></p>
        </div>
      </template>
      <div class="">
        <p class="amount"> {{ mealName }} </p>
        <p class="amount"> {{ newAmount }} <span> {{ newUnit }} </span></p>
      </div>
      <div class="square square_recipies">

      </div>
      <div class="" align="left">
        <label for="">Ingredient</label>
        <input id="newIngredient" class="amount" type="text" name="" value="" @keyup.enter="addMealName" v-model="mealName" required>
        <br>
        <label for="">Amount</label>
        <input class="amount" type="text" name="" value="" @keyup.enter="focusUnit" v-model="newAmount" required>
        <br>
        <label for="">Unit</label>
        <input class="amount" type="text" name="" value="" @keyup.enter="focusIngredient(), addIngredient()" v-model="newUnit" required>
      </div>
      <div class="purchase_button" @click="focusIngredient(), addIngredient()" style="margin-top: 20px">
        <span class="purchase_text">Add Ingredient</span>
      </div>
    </div>
    <div class="save_button" style="margin-bottom: 70px" @click="returnToMenu()">
      <span class="save_text">Save & Return</span>
    </div>
    <!-- <img  src="../assets/icons8-save-close-48.png" alt="Save"> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Edit',
  created () {
    this.$store.commit('setEditFilters')
  },
  computed: {
    ...mapState([
      'userData',
      'mealName',
      'newIngredient',
      'newAmount',
      'newUnit',
      'meal',
      'pointer',
      'editor'
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
      'addMealName',
      'addIngredient',
      'deleteIngredient',
      'deleteMeal'
    ]),
    focusAmount () {
      document.getElementById('amount').focus()
    },
    focusUnit () {
      document.getElementById('unit').focus()
    },
    focusIngredient () {
      document.getElementById('newIngredient').focus()
    },
    removeFocus () {
      const placesList = document.getElementsByClassName('editPlace')
      for (let p = 0; p < placesList.length; p++) {
        placesList[p].blur()
      }
    },
    returnToMenu () {
      this.$router.push('menu')
      this.$store.commit('resetPointer')
      this.$store.commit('changeFilters')
    },
    filtered (userData, editor) {
      var editIngredients = []
      for (let f = 0; f < userData.foods.length; f++) {
        if (userData.foods[f].id === editor.id) {
          editIngredients.push(userData.foods[f])
        }
      }
      return editIngredients
    }
  }
}
</script>

<style lang="css" scoped>
.save_button {
  position: fixed;
  bottom: -20px;
  left: 50px;
  font-size: .714em;
  background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
  border-radius: 20px 20px;
  padding: 10px;
}
.save_text {
  color: white;
  font-size: 12px;
  font-weight: 500;
}
.save_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
.purchase_button {
  position: relative;
  display: inline-block;
  margin-top: -20px;
  font-size: .714em;
  border: 1.2px solid black;
  border-radius: 20px 20px;
  padding: 5px 10px 5px 10px;
}
.purchase_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
@media (max-width: 850px) and (min-height: 400px) {
  .container_recipies {
    position: absolute;
    top: 210px;
    height: inherit;
    width: 100%;
    overflow: hidden;
    animation: fadeIn .8s;
  }
  .recipies {
    color: black;
    text-align: center;
    font-size: 20px;
    margin-bottom: 100px;
  }
  .number {
    margin: auto;
    font-size: 20px;
    padding: 5px;
    width: 30px;
    height: 25px;
    margin-bottom: 30px;
    margin-top: 100px;
    position: relative;
    text-align: center;
    border-style: solid;
    border-color: black;
    border-width: 2px;
  }
  .add_recipe {
    position: absolute;
    top: 50%;
    margin-top: -19px;
    left: 50%;
    margin-left: -7px;
    font-size: 30px;
    transition: .8s ease-in-out;
  }
  .square {
    position: relative;
    text-align: center;
    margin: auto;
    background-color: black;
    width: 15px;
    height: 1px;
    margin-top: 20px;
  }
  .square_recipies {
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .amount {
    text-align: center;
    font-size: 10px;
    margin-top: 0px;
    margin-bottom: 10px;
  }
  input[type=text].amount,
  input[type=number].amount,
  input[type=password].amount {
    position: relative;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 5px;
    width: 120px;
    font-size: 14px;
    font-family: Montserrat;
    border: 0px;
    border-bottom: 1px solid black;
  }
  input[type=text]:focus.amount,
  input[type=number]:focus.amount,
  input[type=password]:focus.amount {
    position: relative;
    display: block;
    width: 120px;
    border: 0px;
    border-bottom: 2px solid black;
    outline: none;
  }
  label {
    position: relative;
    display: block;
    text-align: left;
    top: 36px;
    width: 100%;
    left: 50%;
    transform: translateX(-60px);
    margin-right: auto;
    font-size: 10px;
  }
}
@media (min-width: 850px) {
  .container_recipies {
    position: relative;
    top: 210px;
    height: 570px;
    width: 95%;
    margin: auto;
    overflow: scroll;
    margin-bottom: 20px;
    white-space: nowrap;
    overflow-y: hidden;
    animation: fadeIn .8s;
  }
  .recipies {
    color: black;
    text-align: center;
    font-size: 20px;
    width: calc(88%/8);
    margin: 20px;
    display: inline-block;
    vertical-align: top;
    white-space: normal;
  }
  .number {
    margin: auto;
    padding: 5px;
    width: 30px;
    height: 25px;
    margin-bottom: 50px;
    margin-top: 50px;
    position: relative;
    border-style: solid;
    border-color: black;
    border-width: 2px;
  }
  .add_recipe {
    position: absolute;
    font-size: 20px;
    top: 50%;
    margin-top: -19px;
    left: 50%;
    margin-left: -7px;
    font-size: 30px;
    transition: .8s ease-in-out;
  }
  .square {
    position: relative;
    text-align: center;
    margin: auto;
    background-color: black;
    width: 15px;
    height: 1px;
  }
  .square_recipies {
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .amount {
    font-size: 10px;
    margin-top: 0px;
    transition: .3s;
  }
  input[type=text].amount,
  input[type=number].amount,
  input[type=password].amount {
    position: relative;
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
    width: 120px;
    font-size: 14px;
    font-family: Montserrat;
    border: 0px;
    border-bottom: 1px solid black;
  }
  input[type=text]:focus.amount,
  input[type=number]:focus.amount,
  input[type=password]:focus.amount {
    position: relative;
    display: inline-block;
    width: 120px;
    border: 0px;
    border-bottom: 2px solid black;
    outline: none;
  }
  label {
    position: relative;
    display: inline-block;
    text-align: left;
    top: 42px;
    width: 100%;
    margin-right: auto;
    font-size: 10px;
  }
}
@media (hover:hover) {
  .number:hover {
    cursor: pointer;
  }
  .number:hover .add_recipe {
    transform: rotate(270deg);
  }
  .save_button:hover {
    cursor: pointer;
    background: linear-gradient(315deg, lightpink, #ffdeb9 100%);
    box-shadow: 1px 1px 1px rgba(0,0,0,0.2);
    transition: 0s;
  }
  .purchase_button:hover {
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
    transition: .2s;
  }
}
</style>
