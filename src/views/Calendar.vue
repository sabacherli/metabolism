<template lang="html">
  <div class="container container_animation">
    <div class="calendar_navigation_button" @click="previousWeek()" v-if="userData.uid !== 'Default'"><span class="calendar_navigation_text">Previous Week</span></div>
    <div class="animated">
      <!-- eslint-disable-next-line -->
      <div v-for="(place, index) in userData.addresses">
        <!-- eslint-disable-next-line -->
        <div v-for="month in userAddresses[index].months">
          <!-- eslint-disable-next-line -->
          <template v-if="place.isActive && month.month === currentYearMonth && month.isPurchased" v-for="day in userData.calendar">
            <!-- eslint-disable-next-line -->
            <div class="day" v-if="day.date < today">
              <p class="date"> {{ day.day }} </p>
              <div class="past">

              </div>
              <p class="dayname"> {{ day.dayname }} </p>
              <div class="ingredients_break">

              </div>
              <div class="" v-if="userData.meals[0].isActive">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal0 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal0Location }} </p>
              </div>
              <div class="" v-if="userData.meals[1].isActive">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal1 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal1Location }} </p>
              </div>
              <div class="" v-if="userData.meals[2].isActive">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal2 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal2Location }} </p>
              </div>
              <div class="" v-if="userData.meals[3].isActive">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal3 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal3Location }} </p>
              </div>
              <div class="" v-if="userData.meals[4].isActive">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal4 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal4Location }} </p>
              </div>
              <div class="" v-if="userData.meals[5].isActive">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal5 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal5Location }} </p>
              </div>
              <div class="" v-if="userData.meals[6].isActive">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal6 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal6Location }} </p>
              </div>
              <div class="" v-if="userData.meals[7].isActive">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal7 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal7Location }} </p>
              </div>
              <div class="" v-if="userData.meals[8].isActive">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal8 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal8Location }} </p>
              </div>
              <div class="" v-if="userData.meals[9].isActive">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal9 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal9Location }} </p>
              </div>
            </div>
            <!-- eslint-disable-next-line -->
            <div class="day" v-if="day.date >= today && !dayPurchased(day)">
              <p class="date"> {{ day.day }} </p>
              <p class="dayname"> {{ day.dayname }} </p>
              <div class="ingredients_break">

              </div>
              <div class="container_meal" v-if="userData.meals[0].isActive" @click="setMeal0(day); openMenu()">
                <p class="meal"> {{ day.meal0 }} </p>
                <p class="meal_location"> {{ day.meal0Location }} </p>
              </div>
              <div class="container_meal" v-if="userData.meals[1].isActive" @click="setMeal1(day); openMenu()">
                <p class="meal"> {{ day.meal1 }} </p>
                <p class="meal_location"> {{ day.meal1Location }} </p>
              </div>
              <div class="container_meal" v-if="userData.meals[2].isActive" @click="setMeal2(day); openMenu()">
                <p class="meal"> {{ day.meal2 }} </p>
                <p class="meal_location"> {{ day.meal2Location }} </p>
              </div>
              <div class="container_meal" v-if="userData.meals[3].isActive" @click="setMeal3(day); openMenu()">
                <p class="meal"> {{ day.meal3 }} </p>
                <p class="meal_location"> {{ day.meal3Location }} </p>
              </div>
              <div class="container_meal" v-if="userData.meals[4].isActive" @click="setMeal4(day); openMenu()">
                <p class="meal"> {{ day.meal4 }} </p>
                <p class="meal_location"> {{ day.meal4Location }} </p>
              </div>
              <div class="container_meal" v-if="userData.meals[5].isActive" @click="setMeal5(day); openMenu()">
                <p class="meal"> {{ day.meal5 }} </p>
                <p class="meal_location"> {{ day.meal5Location }} </p>
              </div>
              <div class="container_meal" v-if="userData.meals[6].isActive" @click="setMeal6(day); openMenu()">
                <p class="meal"> {{ day.meal6 }} </p>
                <p class="meal_location"> {{ day.meal6Location }} </p>
              </div>
              <div class="container_meal" v-if="userData.meals[7].isActive" @click="setMeal7(day); openMenu()">
                <p class="meal"> {{ day.meal7 }} </p>
                <p class="meal_location"> {{ day.meal7Location }} </p>
              </div>
              <div class="container_meal" v-if="userData.meals[8].isActive" @click="setMeal8(day); openMenu()">
                <p class="meal"> {{ day.meal8 }} </p>
                <p class="meal_location"> {{ day.meal8Location }} </p>
              </div>
              <div class="container_meal" v-if="userData.meals[9].isActive" @click="setMeal9(day); openMenu()">
                <p class="meal"> {{ day.meal9 }} </p>
                <p class="meal_location"> {{ day.meal9Location }} </p>
              </div>
            </div>
            <!-- eslint-disable-next-line -->
            <div class="day" v-show="day.date >= today && dayPurchased(day)">
              <p class="date"> {{ day.day }} </p>
              <div class="past">

              </div>
              <p class="dayname"> {{ day.dayname }} </p>
              <div class="ingredients_break">

              </div>
              <div class="" v-if="userData.meals[0].isActive" @click="goProfile()">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal0 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal0Location }} </p>
              </div>
              <div class="" v-if="userData.meals[1].isActive" @click="goProfile()">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal1 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal1Location }} </p>
              </div>
              <div class="" v-if="userData.meals[2].isActive" @click="goProfile()">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal2 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal2Location }} </p>
              </div>
              <div class="" v-if="userData.meals[3].isActive" @click="goProfile()">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal3 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal3Location }} </p>
              </div>
              <div class="" v-if="userData.meals[4].isActive" @click="goProfile()">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal4 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal4Location }} </p>
              </div>
              <div class="" v-if="userData.meals[5].isActive" @click="goProfile()">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal5 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal5Location }} </p>
              </div>
              <div class="" v-if="userData.meals[6].isActive" @click="goProfile()">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal6 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal6Location }} </p>
              </div>
              <div class="" v-if="userData.meals[7].isActive" @click="goProfile()">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal7 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal7Location }} </p>
              </div>
              <div class="" v-if="userData.meals[8].isActive" @click="goProfile()">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal8 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal8Location }} </p>
              </div>
              <div class="" v-if="userData.meals[9].isActive" @click="goProfile()">
                <p class="meal" style="text-decoration: line-through"> {{ day.meal9 }} </p>
                <p class="meal_location" style="text-decoration: line-through"> {{ day.meal9Location }} </p>
              </div>
            </div>
          </template>
          <div v-if="place.isActive && month.month === currentYearMonth && month.isPurchased === false">
            <div class="box" @click="addMonths(index)">
              <p class="sign">+</p>
            </div>
            <!-- eslint-disable-next-line -->
            <div>
              <!-- eslint-disable-next-line -->
              <p class="dayname"> {{ place.name }} </p>
            </div>
            <!-- eslint-disable-next-line -->
            <div class="ingredients_break">

            </div>
            <!-- Adds days for the month ahead to the currently signed in user, also default if not signed in. -->
            <!-- eslint-disable-next-line -->
            <div class="" style="margin-bottom: 35px">
              <!-- eslint-disable-next-line -->
              <div class="year_date">
                <p>{{ currentYear }}</p>
              </div>
              <div class="">
                <div class="block_date">
                  <template v-for="month in userAddresses[index].months.slice(0,4)">
                    <!-- eslint-disable-next-line -->
                    <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased, inline_date_past: Number(month.month) < currentYearMonth }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
                  </template>
                </div>
                <div class="block_date">
                  <template v-for="month in userAddresses[index].months.slice(4,8)">
                    <!-- eslint-disable-next-line -->
                    <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased, inline_date_past: Number(month.month) < currentYearMonth }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
                  </template>
                </div>
                <div class="block_date">
                  <template v-for="month in userAddresses[index].months.slice(8,12)">
                    <!-- eslint-disable-next-line -->
                    <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased, inline_date_past: Number(month.month) < currentYearMonth }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
                  </template>
                </div>
              </div>
            </div>
            <!-- eslint-disable-next-line -->
            <div class="">
              <!-- eslint-disable-next-line -->
              <div class="year_date">
                <p>{{ Number(currentYear) + 1 }}</p>
              </div>
              <div class="">
                <div class="block_date">
                  <template v-for="month in userAddresses[index].months.slice(12,16)">
                    <!-- eslint-disable-next-line -->
                    <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased, inline_date_past: Number(month.month) < currentYearMonth }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
                  </template>
                </div>
                <div class="block_date">
                  <template v-for="month in userAddresses[index].months.slice(16,20)">
                    <!-- eslint-disable-next-line -->
                    <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased, inline_date_past: Number(month.month) < currentYearMonth }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
                  </template>
                </div>
                <div class="block_date">
                  <template v-for="month in userAddresses[index].months.slice(20,24)">
                    <!-- eslint-disable-next-line -->
                    <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased, inline_date_past: Number(month.month) < currentYearMonth }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
                  </template>
                </div>
                <p class="year_date price">{{ price }} CHF</p>
                <div class="purchase_button" @click="addMonths(index)">
                  <span class="purchase_text">Purchase Months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="calendar_navigation_button" style="margin-bottom: 70px" @click="nextWeek()" v-if="userData.uid !== 'Default'"><span class="calendar_navigation_text">Next Week</span></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import store from '../store'
import moment from 'moment'

export default {
  name: 'Calendar',
  created () {
    store.commit('setToday', moment().format('YYYYMMDD'))
    store.commit('setPage', 'calendar')
    setTimeout(function () {
      store.commit('rerender')
    }, 800)
  },
  computed: {
    ...mapState([
      'userData',
      'userAddresses',
      'today',
      'menu',
      'price',
      'start',
      'currentYear',
      'currentYearMonth',
      'pointer',
      'calendarOptions'
    ])
  },
  methods: {
    ...mapMutations([
      'setMeal0',
      'setMeal1',
      'setMeal2',
      'setMeal3',
      'setMeal4',
      'setMeal5',
      'setMeal6',
      'setMeal7',
      'setMeal8',
      'setMeal9',
      'nextWeek',
      'previousWeek',
      'toggleSelected',
      'calcPrice',
      'addMonths'
    ]),
    openMenu () {
      var options = this.calendarOptions
      for (let option in options) {
        if (options[option].text === 'Menu' && options[option].isActive === true) {
          this.$router.push('/recipes')
        }
      }
    },
    dayPurchased (day) {
      var isPurchased = true
      for (var address in this.userData.addresses) {
        if (this.userData.addresses[address].isActive) {
          for (var place in this.userAddresses) {
            if (this.userAddresses[place].uid === this.userData.addresses[address].uid) {
              for (var object in this.userAddresses[place].calendar) {
                if (this.userAddresses[place].calendar[object].date === day.date) {
                  isPurchased = false
                }
              }
            }
          }
        }
      }
      return isPurchased
    },
    goProfile () {
      this.$store.commit('setProfileFilters')
      this.$router.push('/profile')
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
.animated {
  animation: fadeIn .8s;
}
.box {
  margin: auto;
  font-size: 20px;
  padding: 5px;
  width: 30px;
  height: 25px;
  margin-bottom: 30px;
  margin-top: 100px;
  position: relative;
  text-align: center;
  border: 2px solid black;
}
.sign {
  position: absolute;
  top: 50%;
  margin-top: -19px;
  left: 50%;
  margin-left: -7px;
  font-size: 30px;
  transition: .8s ease-in-out;
}
.sign_special {
  margin-top: 0px;
  font-size: 20px;
  transition: .8s ease-in-out;
}
.container {
  position: relative;
  top: 210px;
  text-align: center;
}
.container_animation {
  animation: slideInUp .8s;
  animation-delay: 1.6s;
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
.past {
  position: relative;
  top: -44px;
  left: 50%;
  width: 55px;
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: black;
  border-bottom-width: 2px;
  transform: rotate(-41deg) translateX(-67%);
}
.dayname {
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 50px;
}
.container_meal:active .meal {
  text-shadow: 1px 1px #e0e0de;
}
.meal {
  /* transition: .4s; */
}
.meal_location {
  font-size: 10px;
  margin-top: -10px;
  /* transition: .4s; */
}
.calendar_navigation_button {
  position: relative;
  display: inline-block;
  top: 20px;
  margin-top: 20px;
  font-size: .714em;
  border: 1.2px solid black;
  border-radius: 20px 20px;
  padding: 5px;
}
.calendar_navigation_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
.block_date {
  display: block;
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
.container {
  position: relative;
  top: 210px;
  text-align: center;
  animation: slideInUp .8s;
  animation-delay: .8s;
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
.inline_date {
  display: inline-block;
  margin: 7px;
  width: 25px;
  font-weight: 400;
  border: 1.4px solid white;
  border-radius: 20px 20px;
  padding-left: 7px;
  padding-right: 7px;
}
.inline_date_bought {
    background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
    color: white;
    padding: auto 5px auto 5px;
    border-radius: 20px 20px;
}
.inline_date_past {
  text-decoration: line-through;
}
.inline_date_selected {
  font-weight: 400;
  border: 1.4px solid black;
  border-radius: 20px 20px;
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
.year_date {
  font-weight: 500;
}
.price {
  margin-top: 40px;
  background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
@media (min-width: 1000px) {
  .container {
    top: 240px;
  }
  .day {
    display: inline-block;
    width: calc(100%/9);
    vertical-align: top;
  }
  .calendar_navigation_button {
    position: relative;
    text-align: center;
  }
}
@media (hover:hover) {
  .purchase_button:hover {
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
    transition: .2s;
  }
  .container_meal:hover {
    cursor: pointer;
    background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: .4s ease-in-out;
  }
  .calendar_navigation_button:hover {
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
    transition: .2s;
  }
  .inline_date:hover {
    cursor: pointer;
  }
  .inline_date_past:hover {
    cursor: default;
  }
  .box:hover {
    cursor: pointer;
  }
  .box:hover .sign {
    transform: rotate(270deg);
  }
}
</style>
