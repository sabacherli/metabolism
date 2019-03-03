<template lang="html">
  <div class="container_recipes">

    <!-- eslint-disable-next-line -->
    <div class="recipes">
      <div class="number" @click="deleteRecipe()">
        <p class="add_recipe" style="transform: rotate(45deg)">+</p>
      </div>
      <p class="recipe_name"> {{ userData.mealplans[0].recipes[editor.index].name }} </p>
      <div class="square square_recipes">

      </div>
      <div class="" align="left">
        <label for="">Recipe Name</label>
        <input id="mealName" class="amount editPlace" type="text" @keyup.enter="updateName()" v-model="userData.mealplans[0].recipes[editor.index].name" required>
      </div>
      <br>
      <div class="add_button" @click="updateName()" style="margin-top: 20px; margin-bottom: 40px">
        <span class="add_text">Update Name</span>
      </div>
    </div>

    <!-- eslint-disable-next-line -->
    <template v-for="ingredient in userData.mealplans[0].recipes[editor.index].ingredients">
      <!-- eslint-disable-next-line -->
      <div class="recipes">
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
          <input id="unit" class="amount editPlace" type="text" @keyup.enter="updateIngredient(ingredient)" v-model="ingredient.unit" required>
        </div>

        <br>
        <div class="add_button" @click="updateIngredient(ingredient)" style="margin-top: 20px; margin-bottom: 40px">
          <span class="add_text">Update Ingredient</span>
        </div>
      </div>
    </template>

    <div class="recipes">
      <div class="number">
        <p class="add_recipe" @click="addIngredient(); resetData()">+</p>
      </div>
      <p class="recipe_name" v-if="newName"> {{ newName }} </p>
      <p class="recipe_name" v-else>Add Ingredient</p>
      <div class="">
        <p class="amount"> {{ newAmount }} <span> {{ newUnit }} </span></p>
      </div>
      <div class="square square_recipes">

      </div>
      <div class="" align="left">
        <label for="">Ingredient</label>
        <input id="newIngredient" class="amount" type="text" name="" value="" @keyup.enter="addName" v-model="newName" required>
        <br>
        <label for="">Amount</label>
        <input class="amount" type="text" name="" value="" @keyup.enter="focusUnit" v-model="newAmount" required>
        <br>
        <label for="">Unit</label>
        <input class="amount" type="text" name="" value="" @keyup.enter="addIngredient(); resetData()" v-model="newUnit" required>
      </div>
      <br>
      <div class="add_button" @click="addIngredient(); resetData()" style="margin-top: 20px; margin-bottom: 40px"><span class="add_text">Add Ingredient</span></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import db from '@/database.js'
import store from '../store'
import router from '../router'

export default {
  name: 'Edit',
  created () {
    store.commit('setPage', 'edit')
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
      'editor'
    ])
  },
  methods: {
    addIngredient () {
      var ingredient = this.newName
      var amount = this.newAmount
      var unit = this.newUnit
      var userData = this.userData
      var editor = this.editor
      db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('recipes').doc(userData.mealplans[0].recipes[editor.index].uid).collection('ingredients').add({
        ingredient: ingredient,
        amount: amount,
        unit: unit,
        isActive: false,
        isPurchased: false,
        uid: ''
      })
        .then(function (doc) {
          db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('recipes').doc(userData.mealplans[0].recipes[editor.index].uid).collection('ingredients').doc(doc.id).update({
            uid: doc.id
          })
        })
    },
    resetData () {
      this.newName = null
      this.newIngredient = null
      this.newAmount = null
      this.newUnit = null
      document.getElementById('newIngredient').focus()
    },
    updateIngredient (ingredient) {
      var userData = this.userData
      db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('recipes').doc(userData.mealplans[0].recipes[this.editor.index].uid).collection('ingredients').doc(ingredient.uid).update({
        ingredient: ingredient.ingredient,
        amount: ingredient.amount,
        unit: ingredient.unit
      })
    },
    deleteIngredient (ingredient) {
      var userData = this.userData
      db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('recipes').doc(userData.mealplans[0].recipes[this.editor.index].uid).collection('ingredients').doc(ingredient.uid).delete()
    },
    updateName () {
      var userData = this.userData
      var editor = this.editor
      db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('recipes').doc(userData.mealplans[0].recipes[this.editor.index].uid).update({
        name: userData.mealplans[0].recipes[editor.index].name
      })
    },
    deleteRecipe () {
      var userData = this.userData
      var editor = this.editor
      db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).update({
        recipes: userData.mealplans[0].recipes - 1
      })
      db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('recipes').doc(userData.mealplans[0].recipes[editor.index].uid).collection('ingredients')
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('recipes').doc(userData.mealplans[0].recipes[editor.index].uid).collection('ingredients').doc(doc.id).delete()
          })
          db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('recipes').doc(userData.mealplans[0].recipes[editor.index].uid).delete()
          router.push('/recipes')
          store.commit('resetPointer')
        })
    },
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
    editRecipe (userData, editor) {
      var editIngredients = []
      for (let r = 0; r < userData.mealplans[0].recipes.length; r++) {
        if (userData.mealplans[0].recipes[r].id === editor.id) {
          editIngredients.push(userData.mealplans[0].recipes[r])
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
.add_button {
  position: relative;
  display: inline-block;
  margin-top: -20px;
  font-size: .714em;
  border: 1.2px solid black;
  border-radius: 20px 20px;
  padding: 2px 10px 5px 10px;
}
.add_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
.add_text {
  font-size: 10px;
}
@media (max-width: 850px) and (min-height: 400px) {
  .container_recipes {
    position: absolute;
    top: 210px;
    height: inherit;
    width: 100%;
    overflow: hidden;
    animation: fadeIn .8s;
  }
  .recipes {
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
  .square_recipes {
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
    top: 30.5pt;
    width: 100%;
    left: 50%;
    transform: translateX(-60px);
    margin-right: auto;
    font-size: 10px;
  }
}
@media (min-width: 850px) {
  .container_recipes {
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
  .recipes {
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
  .square_recipes {
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
    top: 36.5pt;
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
  .add_button:hover {
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
    transition: .2s;
  }
}
</style>
