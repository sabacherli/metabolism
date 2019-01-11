<template lang="html">
  <div class="container container_animation">
    <div class="calendar_navigation_button" @click="previousWeek()"><span class="calendar_navigation_text">Previous Week</span></div>
    <div class="animated" v-if="userData.months.includes(currentYearMonth)">
      <template v-for="day in userCalendar">
        <!-- eslint-disable-next-line -->
        <div class="day" v-if="day.date < today">
          <p class="date"> {{ day.day }} </p>
          <div class="past">

          </div>
          <p class="dayname"> {{ day.dayname }} </p>
          <div class="ingredients_break">

          </div>
          <div class="">
            <p class="meal"> {{ day.breakfast }} </p>
            <p class="meal_location"> {{ day.breakfastLocation }} </p>
          </div>
          <div class="">
            <p class="meal"> {{ day.lunch }} </p>
            <p class="meal_location"> {{ day.lunchLocation }} </p>
          </div>
          <div class="">
            <p class="meal"> {{ day.dinner }} </p>
            <p class="meal_location"> {{ day.dinnerLocation }} </p>
          </div>
        </div>
        <!-- eslint-disable-next-line -->
        <div class="day" v-if="day.date >= today">
          <p class="date"> {{ day.day }} </p>
          <p class="dayname"> {{ day.dayname }} </p>
          <div class="ingredients_break">

          </div>
          <div class="container_meal" @click="setBreakfast(day); openMenu()">
            <p class="meal"> {{ day.breakfast }} </p>
            <p class="meal_location"> {{ day.breakfastLocation }} </p>
          </div>
          <div class="container_meal" @click="setLunch(day); openMenu()">
            <p class="meal"> {{ day.lunch }} </p>
            <p class="meal_location"> {{ day.lunchLocation }} </p>
          </div>
          <div class="container_meal" @click="setDinner(day); openMenu()">
            <p class="meal"> {{ day.dinner }} </p>
            <p class="meal_location"> {{ day.dinnerLocation }} </p>
          </div>
        </div>
      </template>
    </div>
    <div class="" v-else>
      <!-- Adds days for the month ahead to the currently signed in user, also default if not signed in. -->
      <div v-if="userID !== 'default'" class="" style="margin-bottom: 100px">
        <div class="day">
          <p class="date">+</p>
        </div>
        <p class="dayname">Add Months</p>
        <div class="ingredients_break">

        </div>
        <div class="" style="margin-bottom: 35px">
          <div class="year_date">
            <p>{{ currentYear }}</p>
          </div>
          <div class="">
            <div class="block_date">
              <template v-for="month in listMonths.slice(0,4)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_border: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in listMonths.slice(4,8)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_border: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in listMonths.slice(8,12)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_border: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
          </div>
        </div>
        <div class="">
          <div class="year_date">
            <p>{{ Number(currentYear) + 1 }}</p>
          </div>
          <div class="">
            <div class="block_date">
              <template v-for="month in listMonths.slice(12,16)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_border: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in listMonths.slice(16,20)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_border: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in listMonths.slice(20,24)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_border: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <p style="margin-top: 40px; color: lightpink" class="year_date">{{ price }} CHF</p>
            <p class="purchase_button" @click="addMonths()">Purchase</p>
          </div>
        </div>
      </div>
    </div>
    <div class="calendar_navigation_button" style="margin-bottom: 70px" @click="nextWeek()"><span class="calendar_navigation_text">Next Week</span></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'

export default {
  name: 'Calendar',
  created () {
    this.$store.commit('setToday', moment().format('YYYYMMDD'))
    this.$store.commit('populateMonthList', this.currentYear)
    this.$store.commit('setPage', 'calendar')
  },
  data () {
    return {
      currentYearMonth: moment().format('YYYYMM'),
      currentYear: moment().format('YYYY')
    }
  },
  updated () {
    // do something after updating vue instance
    setTimeout(this.checkUserCalendar, 3000)
  },
  computed: {
    ...mapState([
      'userCalendar',
      'today',
      'menu',
      'userData',
      'listMonths',
      'price',
      'userID',
      'start'
    ])
  },
  methods: {
    ...mapMutations([
      'setBreakfast',
      'setLunch',
      'setDinner',
      'nextWeek',
      'previousWeek',
      'addMonths',
      'toggleSelected'
    ]),
    openMenu () {
      if (this.menu.isActive) {
        this.$router.push('menu')
      }
    },
    checkUserCalendar () {
      if (this.userCalendar.length === 0) {
        this.$store.commit('getCalendar')
      }
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
.container_meal:hover {
  cursor: pointer;
  background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: .4s ease-in-out;
}
.container_meal:active .meal {
  text-shadow: 1px 1px rgb(240, 240, 240);
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
  top: 20px;
  margin-top: 20px;
  display: inline-block;
  padding: 5px;
  font-size: .714em;
  border: 1.2px solid black;
  border-radius: 20px 20px;
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
.calendar_navigation_button:active {
  transition: 0s;
  border: 1.2px solid rgb(102, 102, 102);
  text-shadow: 1px 1px white;
  color: rgb(102, 102, 102);
}
.block_date {
  display: block;
}
.purchase_button {
  position: relative;
  display: inline-block;
  color: lightpink;
  padding: 5px;
  margin-top: -20px;
  font-size: .714em;
  border: 1.2px solid lightpink;
  border-radius: 20px 20px;
}
.purchase_button:hover {
  background-color: lightpink;
  color: white;
  transition: .4s;
  cursor: pointer;
}
.purchase_button:active {
  transition: 0s;
  background-color: pink;
  border: 1.2px solid lightpink;
  text-shadow: 1px 1px lightgray;
  color: white;
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
  padding-left: 7px;
  padding-right: 7px;
}
.inline_date_border {
  background-color: lightpink;
  color: white;
  border-radius: 20px 20px;
}
.inline_date_selected {
  border: 1.4px solid lightpink;
  color: lightpink;
  border-radius: 20px 20px;
  font-weight: 400;
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
input[type=password].amount {
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
input[type=password]:focus.amount {
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
  top: 36px;
  width: 100%;
  left: 50%;
  transform: translateX(-60px);
  margin-right: auto;
  font-size: 10px;
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
</style>
