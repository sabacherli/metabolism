<template lang="html">
  <div class="container container_animation">
    <template v-for="place in userAddresses">
      <template v-for="address in userData.addresses">
        <!-- eslint-disable-next-line -->
        <div v-if="address.uid === place.uid && address.isActive">
          <!-- eslint-disable-next-line -->
          <div class="day">
            <div class="date">
              {{ userData.shoppingListLength }}
            </div>
            <p class="dayname">Shopping List</p>
            <div class="ingredients_break">

            </div>
            <template v-for="item in place.shoppingList">
              <!-- eslint-disable-next-line -->
              <div class="item" @click="toggleIsActive(item)">
                <p :class="{ strikethrough: item.isActive }" class="meal"> {{ item.ingredient }} </p>
                <p :class="{ strikethrough: item.isActive }" class="meal_location"> {{ item.amount }} {{ item.unit }} </p>
              </div>
            </template>
            <p class="dayname" style="margin-top: 100px">Personal List</p>
            <div class="ingredients_break">

            </div>
            <template v-for="item in place.personalList">
              <!-- eslint-disable-next-line -->
              <div class="container_meal" @click="toggleIsActive(item)">
                <p :class="{ strikethrough: item.isActive }" class="meal"> {{ item.ingredient }} </p>
                <p :class="{ strikethrough: item.isActive }" class="meal_location"> {{ item.amount }} {{ item.unit }} </p>
              </div>
            </template>
            <div class="container_meal">
              <p class="meal"> {{ newIngredient }} </p>
              <p class="meal_location"> {{ newAmount }} <span v-if="newUnit"> {{ newUnit }} </span> </p>
            </div>
            <div class="ingredients_break" style="margin-top: 40px" v-if="newIngredient">

            </div>
            <div class="" align="left">
              <label style="margin-top: 40px" for="">Item</label>
              <input id="ingredient" class="amount" type="text" autocomplete="off" @keyup.enter="focusAmount" v-model="newIngredient" required>
              <br>
              <label for="">Amount</label>
              <input id="amount" class="amount" type="number" autocomplete="off" @keyup.enter="focusUnit" v-model="newAmount" required>
              <br>
              <label for="">Unit</label>
              <input id="unit" class="amount" type="text" autocomplete="off" @keyup.enter="addItem(place)" v-model="newUnit" required>
            </div>
          </div>
          <!-- eslint-disable-next-line  -->
          <div class="add_button" style="margin-bottom: 40px" @click="addItem(place)"><span class="add_text">Add Item</span></div>
          <!-- eslint-disable-next-line  -->
          <div class="confirm_button" style="margin-bottom: 70px" @click="deleteItems(place)" v-if="purchasedItems > 0">
            <span class="confirm_text">Done</span>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import db from '@/database.js'
import store from '../store'
import moment from 'moment'

export default {
  name: 'Shoppinglist',
  created () {
    store.commit('createList')
    store.commit('setPage', 'shoppinglist')
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
      'userAddresses',
      'userData',
      'purchasedItems'
    ])
  },
  methods: {
    ...mapMutations([
      'toggleIsActive'
    ]),
    focusAmount () {
      document.getElementById('amount').focus()
    },
    focusUnit () {
      document.getElementById('unit').focus()
    },
    addItem (place) {
      if (this.newIngredient !== null && this.newAmount !== null && this.newUnit !== null) {
        db.collection('addresses').doc(place.uid).collection('personalList').add({
          ingredient: this.newIngredient,
          amount: this.newAmount,
          unit: this.newUnit,
          isActive: false,
          isPurchased: false,
          uid: ''
        })
          .then(function (doc) {
            db.collection('addresses').doc(place.uid).collection('personalList').doc(doc.id).update({
              uid: doc.id
            })
          })
      }
      this.newIngredient = null
      this.newAmount = null
      this.newUnit = null
      document.getElementById('ingredient').focus()
    },
    deleteItems (place) {
      var days = this.userData.shoppingListLength
      for (var ingredient in place.shoppingList) {
        if (place.shoppingList[ingredient].isActive) {
          for (var d = 0; d < days; d++) {
            var day = moment().add(d, 'days').format('YYYYMMDD')
            db.collection('addresses').doc(place.uid).collection('calendar').doc(day).collection('breakfastIngredients').doc(place.shoppingList[ingredient].uid).delete()
            db.collection('addresses').doc(place.uid).collection('calendar').doc(day).collection('lunchIngredients').doc(place.shoppingList[ingredient].uid).delete()
            db.collection('addresses').doc(place.uid).collection('calendar').doc(day).collection('dinnerIngredients').doc(place.shoppingList[ingredient].uid).delete()
          }
        }
      }
      for (var item in place.personalList) {
        if (place.personalList[item].isActive) {
          db.collection('addresses').doc(place.uid).collection('personalList').doc(place.personalList[item].uid).delete()
        }
      }
      store.commit('createList')
      this.$forceUpdate()
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
.container {
  position: relative;
  top: 210px;
  text-align: center;
  animation: slideInUp .8s;
  animation-delay: .4s;
  animation-fill-mode: forwards;
}
.container_animation {
  animation: slideInUp .8s;
  animation-delay: .4s;
  animation-fill-mode: forwards;
  opacity: 0;
}
.day {
  margin-top: 70px;
}
.date {
  width: 30px;
  padding: 5px;
  margin-top: 10px;
  margin: auto;
  font-size: 20px;
  border: 2px solid black;
}
.dayname {
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 50px;
}
.meal_location {
  font-size: 10px;
  margin-top: -10px;
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
  display: block;
  text-align: left;
  top: 30.5pt;
  width: 100px;
  left: 50%;
  transform: translateX(-60px);
  font-size: 10px;
}
.strikethrough {
  text-decoration: line-through;
}
.add_button {
  position: relative;
  display: inline-block;
  top: 20px;
  margin-top: 40px;
  font-size: .714em;
  border: 1.2px solid black;
  border-radius: 20px 20px;
  padding: 5px 10px 5px 10px;
}
.add_button:active {
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
  transition: 0s;
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
@media (hover:hover) {
  .container_meal:hover {
    cursor: pointer;
  }
  .add_button:hover {
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
    transition: .2s;
  }
  .item:hover {
    cursor: pointer;
  }
  .confirm_button:hover {
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
    transition: 0.2s;
  }
}
</style>
