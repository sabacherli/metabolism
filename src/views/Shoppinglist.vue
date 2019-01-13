<template lang="html">
  <div class="container container_animation" style="margin-bottom: 150px">
    <template v-for="place in userAddresses">
      <!-- eslint-disable-next-line -->
      <div class="day">
        <div class="date">
          {{ place.shoppingList.length + place.personalList.length }}
        </div>
        <p class="dayname">Shopping List</p>
        <div class="ingredients_break">

        </div>
        <template v-for="item in place.shoppingList">
          <!-- eslint-disable-next-line -->
          <div class="" @click="toggleIsActive(item)">
            <p :class="{ strikethrough: item.isActive }" class="meal"> {{ item.ingredient }} </p>
            <p :class="{ strikethrough: item.isActive }" class="meal_location"> {{ item.amount }} {{ item.unit }} </p>
          </div>
        </template>
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
        <label style="margin-top: 40px" for="">Add item</label>
        <input id="ingredient" class="amount" type="text" name="" value="" @keyup.enter="focusAmount" v-model="newIngredient" required>
        <br>
        <label for="">Amount</label>
        <input id="amount" class="amount" type="text" name="" value="" @keyup.enter="focusUnit" v-model="newAmount" required>
        <br>
        <label for="">Unit</label>
        <input id="unit" class="amount" type="text" name="" value="" @keyup.enter="addItem(userAddresses.indexOf(place))" v-model="newUnit" required>
      </div>
      <!-- eslint-disable-next-line  -->
      <div class="calendar_navigation_button" style="margin-bottom: 70px" @click="addItem(userAddresses.indexOf(place))"><span class="calendar_navigation_text">Add ingredient</span></div>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Shoppinglist',
  created () {
    this.$store.commit('createList')
    this.$store.commit('setPage', 'shoppinglist')
  },
  computed: {
    ...mapState([
      'newIngredient',
      'newAmount',
      'newUnit',
      'userAddresses',
      'userID'
    ]),
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
      'addItem',
      'toggleIsActive'
    ]),
    focusAmount () {
      document.getElementById('amount').focus()
    },
    focusUnit () {
      document.getElementById('unit').focus()
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
.container_meal:active .meal {
  text-shadow: 1px 1px rgb(240, 240, 240);
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
input[type=text].amount {
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
input[type=text]:focus.amount {
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
  top: 36px;
  width: 100px;
  left: 50%;
  transform: translateX(-60px);
  font-size: 10px;
}
.strikethrough {
  text-decoration: line-through
}
.calendar_navigation_button {
  position: relative;
  top: 20px;
  margin-top: 20px;
  display: inline-block;
  padding: 5px;
  font-size: .714em;
  border: 1.2px solid black;
  border-radius: 20px 20px;
}
.calendar_navigation_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
@media (hover:hover) {
  .container_meal:hover {
    color: lightpink;
    transition: .4s ease-in-out;
    cursor: pointer;
  }
  .calendar_navigation_button:hover .calendar_navigation_text {
    background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: .4s ease-in-out;
  }
  .calendar_navigation_button:hover {
    cursor: pointer;
    background: black;
    transition: .4s ease-in-out;
  }
}
</style>
