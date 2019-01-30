import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import db from './database'
import firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(Vuex, moment)

export default new Vuex.Store({
  state: {
    userID: 'default',
    userEmail: 'default',
    userData: {

    },
    userAddresses: [],
    // authFlag: true,
    mealName: null,
    newIngredient: null,
    newAmount: null,
    newUnit: null,
    currentPage: 'calendar',
    price: 0,
    today: null,
    start: null,
    currentYear: null,
    currentYearMonth: null,
    pointer: {
      doc: '',
      position: '',
      address: ''
    },
    editor: {
      id: null
    },
    displayAmount: 7,
    profileFilters: [
      {
        text: 'Account',
        isActive: true
      },
      {
        text: 'Months',
        isActive: false
      },
      {
        text: 'Places',
        isActive: false
      },
      {
        text: 'Filters',
        isActive: false
      }
    ],
    menu: {
      text: 'Menu',
      isActive: true
    },
    meal: {
      id: null,
      uniqueID: null,
      name: null,
      ingredients: [],
      tags: []
    },
    item: {
      ingredient: null,
      amount: null,
      unit: null,
      isActive: false,
      isPurchased: false
    },
    ingredientsList: {
      ingredient: null,
      amount: null,
      unit: null,
      isActive: false,
      isPurchased: false
    },
    // listMonths: [],
    // listMonthsDefault: [],
    tempCal: []
  },
  mutations: {
    syncMealName (state, mealName) {
      state.mealName = mealName
    },
    syncIngredient (state, ingredient) {
      state.newIngredient = ingredient
    },
    syncAmount (state, amount) {
      state.newAmount = Number(amount)
    },
    syncUnit (state, unit) {
      state.newUnit = unit
    },
    syncUserEmail (state, email) {
      state.userEmail = email
    },
    syncShoppingListLength (state, days) {
      state.userData.info.shoppingListLength = days
    },
    syncCalories (state, calories) {
      state.userData.info.calories = calories
    },
    syncCurrentYearMonth (state, calories) {
      state.currentYearMonth = calories
    },
    setEditor (state, meal) {
      state.editor.id = meal.id
      state.editor.uniqueID = meal.uniqueID
    },
    resetPointer (state) {
      state.pointer.position = ''
      state.pointer.doc = ''
    },
    setEditFilters (state) {
      for (let t = 0; t < state.userData.tagList.length; t++) {
        state.userData.tagList[t].isActive = false
      }
      for (let f = 0; f < state.userData.foods.length; f++) {
        if (state.userData.foods[f].id === state.editor.id) {
          for (let t = 0; t < state.userData.tagList.length; t++) {
            for (let tag = 0; tag < state.userData.foods[f].tags.length; tag++) {
              if (state.userData.foods[f].tags[tag] === state.userData.tagList[t].text) {
                state.userData.tagList[t].isActive = true
              }
            }
          }
        }
      }
    },
    changeFilters (state) {
      for (let f = 0; f < state.userData.foods.length; f++) {
        if (state.userData.foods[f].uniqueID === state.editor.uniqueID) {
          // parameters in splice should probably be switched around
          state.userData.foods[f].tags.splice(0, state.userData.foods[f].tags.length)
          for (let t = 0; t < state.userData.tagList.length; t++) {
            if (state.userData.tagList[t].isActive) {
              state.userData.foods[f].tags.push(state.userData.tagList[t].text)
            }
          }
        }
      }
    },
    toggleIsActive (state, item) {
      item.isActive = !item.isActive
    },
    toggleSelected (state, month) {
      if (month.isPurchased === false) {
        month.isActive = !month.isActive
        if (month.isActive === true) {
          state.price += 5
        } else {
          state.price -= 5
        }
      }
    },
    addMonths (state, index) {
      for (let month = 0; month < state.userAddresses[index].months.length; month++) {
        if (state.userAddresses[index].months[month].isActive === true) {
          const date = moment(state.userAddresses[index].months[month].month, 'YYYYMM', true)
          const daysInMonth = date.daysInMonth()
          const year = date.format('YYYY')
          const mon = date.format('MM')
          for (let d = 0; d < daysInMonth; d++) {
            const day = moment().year(year).month(mon).subtract(1, 'M')
              .startOf('month')
              .add(d, 'day')
              .format('DD')
            const docName = moment().year(year).month(mon).subtract(1, 'M')
              .date(day)
              .format('YYYYMMDD')
            if (state.userData.addresses[index].isDefault === true) {
              const dayTemplate = {
                date: Number(moment().year(year).month(mon).subtract(1, 'M')
                  .date(day)
                  .format('YYYYMMDD')),
                day,
                dayname: moment().isoWeekday(moment().year(year).month(mon).subtract(1, 'M')
                  .date(day)
                  .weekday()).format('dddd'),
                breakfastCaloriesOwner: null,
                breakfastMembers: [
                  state.userID
                ],
                breakfastCalories: state.userData.info.calories,
                breakfastIngredients: [],
                lunchCaloriesOwner: null,
                lunchMembers: [
                  state.userID
                ],
                lunchCalories: state.userData.info.calories,
                lunchIngredients: [],
                dinnerCaloriesOwner: null,
                dinnerMembers: [
                  state.userID
                ],
                dinnerCalories: state.userData.info.calories,
                dinnerIngredients: []
              }
              db.collection('addresses').doc(state.userData.addresses[index].address).collection('calendar').doc(docName)
                .set(dayTemplate)
            } else {
              const dayTemplate = {
                date: Number(moment().year(year).month(mon).subtract(1, 'M')
                  .date(day)
                  .format('YYYYMMDD')),
                day,
                dayname: moment().isoWeekday(moment().year(year).month(mon).subtract(1, 'M')
                  .date(day)
                  .weekday()).format('dddd'),
                breakfastCaloriesOwner: null,
                breakfastMembers: [],
                breakfastCalories: '',
                breakfastIngredients: [],
                lunchCaloriesOwner: null,
                lunchMembers: [],
                lunchCalories: '',
                lunchIngredients: [],
                dinnerCaloriesOwner: null,
                dinnerMembers: [],
                dinnerCalories: '',
                dinnerIngredients: []
              }
              db.collection('addresses').doc(state.userData.addresses[index].address).collection('calendar').doc(docName)
                .set(dayTemplate)
            }
          }
          state.userAddresses[index].months[month].isPurchased = true
          Vue.set(state.userAddresses[index].months[month], 'isActive', false)
        }
        state.price = 0
      }
    },
    setPage (state, page) {
      state.currentPage = page
    },
    setToday (state, today) {
      state.today = Number(today)
      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
    },
    setBreakfast (state, day) {
      state.pointer.doc = state.userData.calendar.indexOf(day)
      state.pointer.position = 'breakfast'
      for (let a = 0; a < state.userData.addresses.length; a++) {
        var alreadyMember = false
        if (state.userData.addresses[a].isActive) {
          state.pointer.address = a
          day.breakfastLocation = state.userData.addresses[a].name
          day.breakfastAddress = state.userData.addresses[a].address
          for (let m = 0; m < state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers.length; m++) {
            if (state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers[m] === state.userID) {
              alreadyMember = true
            }
          }
          if (alreadyMember === false) {
            state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers.push(state.userID)
            state.userAddresses[a].calendar[state.pointer.doc].breakfastCalories += Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
          }
        } else {
          if (state.userAddresses[a].calendar.length > 0) {
            for (let m = 0; m < state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers.length; m++) {
              if (state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers[m] === state.userID) {
                alreadyMember = true
              }
            }
            if (alreadyMember === true) {
              for (var i = state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers.length - 1; i >= 0; i--) {
                if (state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers[i] === state.userID) {
                  state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers.splice(i, 1)
                  break
                }
              }
              state.userAddresses[a].calendar[state.pointer.doc].breakfastCalories -= Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
            }
          }
        }
      }
      if (state.menu.isActive) {
        for (let t = 0; t < state.userData.tagList.length; t++) {
          state.userData.tagList[t].isActive = false
        }
        state.userData.tagList[0].isActive = true
      }
    },
    setLunch (state, day) {
      state.pointer.doc = state.userData.calendar.indexOf(day)
      state.pointer.position = 'lunch'
      for (let a = 0; a < state.userData.addresses.length; a++) {
        var alreadyMember = false
        if (state.userData.addresses[a].isActive) {
          state.pointer.address = a
          day.lunchLocation = state.userData.addresses[a].name
          day.lunchAddress = state.userData.addresses[a].address
          for (let m = 0; m < state.userAddresses[a].calendar[state.pointer.doc].lunchMembers.length; m++) {
            if (state.userAddresses[a].calendar[state.pointer.doc].lunchMembers[m] === state.userID) {
              alreadyMember = true
            }
          }
          if (alreadyMember === false) {
            state.userAddresses[a].calendar[state.pointer.doc].lunchMembers.push(state.userID)
            state.userAddresses[a].calendar[state.pointer.doc].lunchCalories += Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
          }
        } else {
          if (state.userAddresses[a].calendar.length > 0) {
            for (let m = 0; m < state.userAddresses[a].calendar[state.pointer.doc].lunchMembers.length; m++) {
              if (state.userAddresses[a].calendar[state.pointer.doc].lunchMembers[m] === state.userID) {
                alreadyMember = true
              }
            }
            if (alreadyMember === true) {
              for (var i = state.userAddresses[a].calendar[state.pointer.doc].lunchMembers.length - 1; i >= 0; i--) {
                if (state.userAddresses[a].calendar[state.pointer.doc].lunchMembers[i] === state.userID) {
                  state.userAddresses[a].calendar[state.pointer.doc].lunchMembers.splice(i, 1)
                  break
                }
              }
              state.userAddresses[a].calendar[state.pointer.doc].lunchCalories -= Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
            }
          }
        }
      }
      if (state.menu.isActive) {
        for (let t = 0; t < state.userData.tagList.length; t++) {
          state.userData.tagList[t].isActive = false
        }
        state.userData.tagList[1].isActive = true
      }
    },
    setDinner (state, day) {
      state.pointer.doc = state.userData.calendar.indexOf(day)
      state.pointer.position = 'dinner'
      for (let a = 0; a < state.userData.addresses.length; a++) {
        var alreadyMember = false
        if (state.userData.addresses[a].isActive) {
          state.pointer.address = a
          day.dinnerLocation = state.userData.addresses[a].name
          day.dinnerAddress = state.userData.addresses[a].address
          for (let m = 0; m < state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers.length; m++) {
            if (state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers[m] === state.userID) {
              alreadyMember = true
            }
          }
          if (alreadyMember === false) {
            state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers.push(state.userID)
            state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers += Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
          }
        } else {
          if (state.userAddresses[a].calendar.length > 0) {
            for (let m = 0; m < state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers.length; m++) {
              if (state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers[m] === state.userID) {
                alreadyMember = true
              }
            }
            if (alreadyMember === true) {
              for (var i = state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers.length - 1; i >= 0; i--) {
                if (state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers[i] === state.userID) {
                  state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers.splice(i, 1)
                  break
                }
              }
              state.userAddresses[a].calendar[state.pointer.doc].dinnerCalories -= Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
            }
          }
        }
      }
      if (state.menu.isActive) {
        for (let t = 0; t < state.userData.tagList.length; t++) {
          state.userData.tagList[t].isActive = false
        }
        state.userData.tagList[2].isActive = true
      }
    },
    setDefault (state, index) {
      for (var i = 0; i < state.userData.addresses.length; i++) {
        Vue.set(state.userData.addresses[i], 'isDefault', false)
      }
      Vue.set(state.userData.addresses[index], 'isDefault', true)
    },
    toggleLocation (state, address) {
      for (let a = 0; a < state.userData.addresses.length; a++) {
        Vue.set(state.userData.addresses[a], 'isActive', false)
      }
      Vue.set(address, 'isActive', true)
    },
    toggleFilter (state, filter) {
      filter.isActive = !filter.isActive
    },
    toggleMenu (state, menu) {
      menu.isActive = !menu.isActive
    },
    toggleProfileFilter (state, filter) {
      for (let p = 0; p < state.profileFilters.length; p++) {
        Vue.set(state.profileFilters[p], 'isActive', false)
      }
      Vue.set(filter, 'isActive', true)
    },
    thisWeek (state) {
      if (state.userID !== 'default') {
        for (let d = 0; d < state.userData.calendar.length; d++) {
          db.collection('users').doc(state.userID).collection('calendar').doc(state.userData.calendar[d].date.toString())
            .set(state.userData.calendar[d])
        }
      }
      const calendarRef = db.collection('users').doc(state.userID).collection('calendar')
      state.userData.calendar = []
      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
      state.currentYearMonth = moment(state.start).format('YYYYMM')
      state.currentYear = moment(state.start).format('YYYY')
      calendarRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            state.userData.calendar.push(doc.data())
          })
        })
        .catch((error) => {
          console.log('Error getting documents: ', error)
        })
    },
    nextWeek (state) {
      if (state.userData.calendar.length !== 0) {
        if (state.userID !== 'default') {
          for (let d = 0; d < state.userData.calendar.length; d++) {
            db.collection('users').doc(state.userID).collection('calendar').doc(state.userData.calendar[d].date.toString())
              .set(state.userData.calendar[d])
          }
        }
        const calendarRef = db.collection('users').doc(state.userID).collection('calendar')
        state.userData.calendar = []
        state.currentYearMonth = moment(state.start).format('YYYYMM')
        state.currentYear = moment(state.start).format('YYYY')
        calendarRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              state.userData.calendar.push(doc.data())
            })
          })
          .catch((error) => {
            console.log('Error getting documents: ', error)
          })
      }
    },
    previousWeek (state) {
      if (state.userData.calendar.length !== 0) {
        if (state.userID !== 'default') {
          for (let d = 0; d < state.userData.calendar.length; d++) {
            db.collection('users').doc(state.userID).collection('calendar').doc(state.userData.calendar[d].date.toString())
              .set(state.userData.calendar[d])
          }
        }
        const calendarRef = db.collection('users').doc(state.userID).collection('calendar')
        state.userData.calendar = []
        state.start = state.start.subtract(state.displayAmount, 'days')
        state.currentYearMonth = moment(state.start).format('YYYYMM')
        state.currentYear = moment(state.start).format('YYYY')
        calendarRef.where('date', '>=', Number(state.start.subtract(state.displayAmount, 'days').format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              state.userData.calendar.push(doc.data())
            })
          })
          .catch((error) => {
            console.log('Error getting documents: ', error)
          })
      }
    },
    addItem (state, place) {
      state.item.ingredient = state.newIngredient
      state.item.amount = state.newAmount
      state.item.unit = state.newUnit
      if (state.item.ingredient === null || state.item.amount === null || state.item.unit === null) {
        alert('Please fill in all fields before adding a new ingredient.')
      } else {
        state.userAddresses[place].personalList.push(state.item)
        state.newIngredient = null
        state.newAmount = null
        state.newUnit = null
        state.item = {
          ingredient: null,
          amount: null,
          unit: null,
          isActive: false,
          isPurchased: false
        }
      }
      document.getElementById('ingredient').focus()
    },
    addIngredientToMeal (state) {
      state.ingredientsList.ingredient = state.newIngredient
      state.ingredientsList.amount = state.newAmount
      state.ingredientsList.unit = state.newUnit
      state.meal.ingredients.push(state.ingredientsList)
      state.newIngredient = null
      state.newAmount = null
      state.newUnit = null
      state.ingredientsList = {
        ingredient: null,
        amount: null,
        unit: null,
        isActive: false,
        isPurchased: false
      }
      document.getElementById('newIngredient').focus()
    },
    addIngredient (state) {
      state.ingredientsList.ingredient = state.mealName
      state.ingredientsList.amount = state.newAmount
      state.ingredientsList.unit = state.newUnit
      for (let f = 0; f < state.userData.foods.length; f++) {
        if (state.userData.foods[f].id === state.editor.id) {
          if (state.ingredientsList.ingredient === null || state.ingredientsList.amount === null || state.ingredientsList.unit === null) {
            alert('Please fill in all fields before adding a new ingredient.')
          } else {
            state.userData.foods[f].ingredients.push(JSON.parse(JSON.stringify(state.ingredientsList)))
          }
        }
      }
      state.mealName = null
      state.newAmount = null
      state.newUnit = null
    },
    deleteIngredient (state, ingredient) {
      for (let f = 0; f < state.userData.foods.length; f++) {
        if (state.userData.foods[f].id === state.editor.id) {
          for (let i = 0; i < state.userData.foods[f].ingredients.length; i++) {
            if (state.userData.foods[f].ingredients[i].ingredient === ingredient.ingredient) {
              state.userData.foods[f].ingredients.splice(i, 1)
            }
          }
        }
      }
    },
    selectMeal (state, meal) {
      const mealName = JSON.parse(JSON.stringify(meal.name))
      const mealID = JSON.parse(JSON.stringify(meal.uniqueID))
      for (let i = 0; i < meal.ingredients.length; i++) {
        const ingredientObject = JSON.parse(JSON.stringify(meal.ingredients[i]))
        if (state.pointer.position === 'breakfast') {
          state.userAddresses[state.pointer.address].calendar[state.pointer.doc].breakfastIngredients.push(ingredientObject)
        } else if (state.pointer.position === 'lunch') {
          state.userAddresses[state.pointer.address].calendar[state.pointer.doc].lunchIngredients.push(ingredientObject)
        } else {
          state.userAddresses[state.pointer.address].calendar[state.pointer.doc].dinnerIngredients.push(ingredientObject)
        }
      }
      if (state.pointer.position === 'breakfast') {
        state.userData.calendar[state.pointer.doc].breakfast = mealName
        state.userAddresses[state.pointer.address].calendar[state.pointer.doc].breakfast = mealName
        state.userData.calendar[state.pointer.doc].breakfastID = mealID
        state.userAddresses[state.pointer.address].calendar[state.pointer.doc].breakfastID = mealID
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'breakfastCaloriesOwner', state.userData.info.calories)
      } else if (state.pointer.position === 'lunch') {
        state.userData.calendar[state.pointer.doc].lunch = mealName
        state.userAddresses[state.pointer.address].calendar[state.pointer.doc].lunch = mealName
        state.userData.calendar[state.pointer.doc].lunchID = mealID
        state.userAddresses[state.pointer.address].calendar[state.pointer.doc].lunchID = mealID
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'lunchCaloriesOwner', state.userData.info.calories)
      } else {
        state.userData.calendar[state.pointer.doc].dinner = mealName
        state.userAddresses[state.pointer.address].calendar[state.pointer.doc].dinner = mealName
        state.userData.calendar[state.pointer.doc].dinnerID = mealID
        state.userAddresses[state.pointer.address].calendar[state.pointer.doc].dinnerID = mealID
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'dinnerCaloriesOwner', state.userData.info.calories)
      }
    },
    removeMeal (state) {
      if (state.pointer.position === 'breakfast') {
        Vue.set(state.userData.calendar[state.pointer.doc], 'breakfast', 'Breakfast')
        Vue.set(state.userData.calendar[state.pointer.doc], 'breakfastID', '')
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'breakfastIngredients', [])
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'breakfast', 'Breakfast')
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'breakfastID', '')
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'dinnerCaloriesOwner', null)
      } else if (state.pointer.position === 'lunch') {
        Vue.set(state.userData.calendar[state.pointer.doc], 'lunch', 'Lunch')
        Vue.set(state.userData.calendar[state.pointer.doc], 'lunchID', '')
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'lunchIngredients', [])
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'lunch', 'Lunch')
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'lunchID', '')
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'dinnerCaloriesOwner', null)
      } else {
        Vue.set(state.userData.calendar[state.pointer.doc], 'dinner', 'Dinner')
        Vue.set(state.userData.calendar[state.pointer.doc], 'dinnerID', '')
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'dinnerIngredients', [])
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'dinner', 'Dinner')
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'dinnerID', '')
        Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'dinnerCaloriesOwner', null)
      }
    },
    addMealName (state) {
      if (state.mealName) {
        if (state.userData.foods.length + 1 < 10) {
          state.meal.id = `0${state.userData.foods.length + 1}`
        } else {
          state.meal.id = state.userData.foods.length + 1
        }
        state.meal.name = state.mealName
        document.getElementById('newIngredient').focus()
      } else {
        alert('You need to enter a recipe name.')
      }
    },
    addMeal (state) {
      if (state.meal.name) {
        for (let t = 0; t < state.userData.tagList.length; t++) {
          if (state.userData.tagList[t].isActive) {
            state.meal.tags.push(state.userData.tagList[t].text)
          }
        }
        state.meal.uniqueID = new Date().getTime().toString() + (Math.floor((Math.random() * 10000000) + 1)).toString()
        state.userData.foods.push(state.meal)
        state.meal = {
          id: null,
          uniqueID: null,
          name: null,
          ingredients: [],
          tags: []
        }
        state.mealName = null
      } else {
        alert('You need to add a recipe name')
      }
    },
    deleteMeal (state) {
      for (let f = 0; f < state.userData.foods.length; f++) {
        if (state.userData.foods[f].id === state.editor.id) {
          state.userData.foods.splice(f, 1)
        }
      }
      for (let f = 0; f < state.userData.foods.length; f++) {
        if (f + 1 < 10) {
          var singleDigit = f + 1
          state.userData.foods[f].id = `0${singleDigit}`
        } else {
          state.userData.foods[f].id = singleDigit.toString()
        }
      }
    },
    addFilter (state, newFilter) {
      const newObject = {
        text: '',
        isActive: false
      }
      newObject.text = newFilter
      state.userData.tagList.push(newObject)
      document.getElementById('newFilter').focus()
    },
    deleteFilter (state, tag) {
      for (let t = 0; t < state.userData.tagList.length; t++) {
        if (state.userData.tagList[t].text === tag.text) {
          state.userData.tagList.splice(t, 1)
        }
      }
    },
    addPlace (state, newPlace, currentYear) {
      const twoYears = []
      for (let y = 0; y < 2; y++) {
        for (let month = 0; month < 12; month++) {
          twoYears.push({
            month: moment().year(Number(currentYear)).month(month).add(y, 'years').format('YYYYMM'),
            display: moment().year(Number(currentYear)).month(month).add(y, 'years').format('MMM'),
            isActive: false,
            isPurchased: false
          })
        }
      }
      db.collection('addresses').add({
        address: '',
        members: [{
          email: state.userEmail,
          role: 'Owner',
          uid: state.userID
        }],
        personalList: [],
        shoppingList: [],
        calendar: [],
        months: twoYears
      })
        .then((docRef) => {
          if (state.userAddresses.length === 0) {
            const newAddress = {
              name: newPlace,
              isActive: false,
              address: docRef.id,
              isDefault: true
            }
            state.userData.addresses.push(newAddress)
          } else {
            const newAddress = {
              name: newPlace,
              isActive: false,
              address: docRef.id,
              isDefault: false
            }
            state.userData.addresses.push(newAddress)
          }
          db.collection('users').doc(state.userID).set(state.userData)
          db.collection('addresses').doc(docRef.id).update({
            address: docRef.id
          })
          // getData without checking userData.months ()
          const dataRef = db.collection('users').doc(state.userID)
          state.userData = ''
          dataRef.get()
            .then((doc) => {
              // eslint-disable-next-line
              new Promise(function (resolve, reject) {
                state.userData = doc.data()
                resolve()
              })
                .then(function () {
                  state.userAddresses = []
                  for (let a = 0; a < state.userData.addresses.length; a++) {
                    const addressRef = db.collection('addresses').doc(state.userData.addresses[a].address)
                    addressRef.get()
                      .then((doc) => {
                        if (doc.exists) {
                          state.userAddresses.push(doc.data())
                          state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                          const calRef = db.collection('users').doc(state.userID).collection('calendar')
                          calRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
                            .then(function (querySnapshot) {
                              querySnapshot.forEach((doc) => {
                                state.userData.calendar.push(doc.data())
                              })
                            })
                          state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                          const calAddressRef = db.collection('addresses').doc(state.userData.addresses[a].address).collection('calendar')
                          calAddressRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.userData.info.shoppingListLength, 'days').format('YYYYMMDD'))).orderBy('date').get()
                            .then(function (querySnapshot) {
                              querySnapshot.forEach((doc) => {
                                state.userAddresses[a].calendar.push(doc.data())
                              })
                            })
                        }
                      })
                  }
                })
            })
        })
    },
    deletePlace (state, place) {
      if (confirm('Are you sure you want to remove this place?')) {
        const index = state.userData.addresses.indexOf(place)
        const doc = state.userAddresses[index].address
        var Owner = false
        for (let member = 0; member < state.userAddresses[index].members.length; member++) {
          if (state.userAddresses[index].members[member].role === 'Owner' && state.userAddresses[index].members[member].uid === state.userID) {
            Owner = true
          }
        }
        if (Owner) {
          // eslint-disable-next-line
          new Promise(function (resolve, reject) {
            for (let m = 0; m < state.userAddresses[index].members.length; m++) {
              // Gets the user data of each member and saves it into tempArray.
              const docRef = db.collection('users').doc(state.userAddresses[index].members[m].uid)
              var tempData = ''
              docRef.get()
                .then((doc) => {
                  if (doc.exists) {
                    // eslint-disable-next-line
                    new Promise(function (resolve, reject) {
                      tempData = doc.data()
                      resolve()
                    })
                      .then(function () {
                      // Deletes the address out of the addressess record.
                        for (let a = 0; a < tempData.addresses.length; a++) {
                          if (tempData.addresses[a].address === state.userAddresses[index].address) {
                            tempData.addresses.splice(a, 1)
                          }
                        }
                        // Saves the tempArray back into the edited users' document.
                        db.collection('users').doc(state.userAddresses[index].members[m].uid).set(tempData)
                        resolve()
                      })
                  } else {
                    // doc.data() will be undefined in this case
                    console.log('doc.exists is false')
                  }
                })
                .catch((error) => {
                  console.log('Error getting document:', error)
                })
            }
          })
            .then(function () {
            // Deletes the address document in addresses collection.
              db.collection('addresses').doc(doc).delete()
                .then(() => {
                  const docRef = db.collection('users').doc(state.userID)
                  state.userData = ''
                  docRef.get()
                    .then((doc) => {
                      state.userData = doc.data()
                      // eslint-disable-next-line
                      new Promise(function (resolve, reject) {
                        // eslint-disable-next-line
                        new Promise(function (resolve, reject) {
                          state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                          const calRef = db.collection('users').doc(state.userID).collection('calendar')
                          calRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
                            .then(function (querySnapshot) {
                              querySnapshot.forEach((doc) => {
                                state.userData.calendar.push(doc.data())
                              })
                              // eslint-disable-next-line
                              new Promise(function (resolve, reject) {
                                state.userAddresses = []
                                // goes through addresses of the user
                                for (let a = 0; a < state.userData.addresses.length; a++) {
                                  const addressRef = db.collection('addresses').doc(state.userData.addresses[a].address)
                                  addressRef.get()
                                    .then((doc) => {
                                      if (doc.exists) {
                                        state.userAddresses.push(doc.data())
                                      }
                                    })
                                    .catch((error) => {
                                      console.log('Error in getting user addresses: ', error)
                                    })
                                }
                                for (let a = 0; a < state.userData.addresses.length; a++) {
                                  state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                                  const calRef = db.collection('addresses').doc(state.userData.addresses[a].address).collection('calendar')
                                  calRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
                                    .then((querySnapshot) => {
                                      querySnapshot.forEach((doc) => {
                                        // doc.data() is never undefined for query doc snapshots
                                        state.userAddresses[a].calendar.push(doc.data())
                                      })
                                    })
                                    .catch((error) => {
                                      console.log('Error getting documents: ', error)
                                    })
                                }
                              })
                            })
                            .catch((error) => {
                              console.log('Error in getting user calendar: ', error)
                            })
                        })
                      })
                    })
                    .catch((error) => {
                      console.log('Error in getting user data: ', error)
                    })
                })
                .catch((error) => {
                  console.log('Error removing document: ', error)
                })
            })
            .catch((error) => {
              console.log('Error: ', error)
            })
        } else {
          for (let m = 0; m < state.userAddresses[index].members.length; m++) {
            if (state.userAddresses[index].members[m].uid === state.userID) {
              state.userAddresses[index].members.splice(m, 1)
            }
          }
          state.userData.addresses.splice(index, 1)
          if (state.userID !== 'default') {
            new Promise(function (resolve, reject) {
              for (let d = 0; d < state.userData.calendar.length; d++) {
                db.collection('users').doc(state.userID).collection('calendar').doc(state.userData.calendar[d].date.toString())
                  .set(state.userData.calendar[d])
              }
              state.userData.calendar = []
              if (state.userData.calendar.length === 0) {
                resolve()
              }
            })
              .then(function () {
                new Promise(function (resolve, reject) {
                  db.collection('users').doc(state.userID).set(state.userData)
                  resolve()
                })
                  .then(function () {
                    // db.collection('users').doc(state.defaultID).set(state.defaultData)
                    for (let a = 0; a < state.userAddresses.length; a++) {
                      new Promise(function (resolve, reject) {
                        if (state.userAddresses[a].calendar.length > 0) {
                          for (let d = 0; d < state.userAddresses[a].calendar.length; d++) {
                            db.collection('addresses').doc(state.userAddresses[a].address).collection('calendar').doc(state.userAddresses[a].calendar[d].date.toString())
                              .set(state.userAddresses[a].calendar[d])
                          }
                          state.userAddresses[a].calendar = []
                          if (state.userAddresses[a].calendar.length === 0) {
                            resolve()
                          }
                        }
                      })
                        .then(function () {
                          db.collection('addresses').doc(state.userAddresses[a].address).set(state.userAddresses[a])
                        })
                    }
                  })
              })
          }
        }
      }
    },
    deleteAccount (state, user) {
      if (confirm('Are you sure you want to delete your account permanenently? All owned places will also be deleted.')) {
        var promise1 = new Promise(function (resolve, reject) {
          for (let index = 0; index < state.userAddresses.length; index++) {
            var Owner = false
            for (let member = 0; member < state.userAddresses[index].members.length; member++) {
              if (state.userAddresses[index].members[member].role === 'Owner' && state.userAddresses[index].members[member].uid === state.userID) {
                Owner = true
              }
            }
            if (Owner) {
              var promise2 = new Promise(function (resolve, reject) {
                for (let m = 0; m < state.userAddresses[index].members.length; m++) {
                  // Gets the user data of each member and saves it into tempArray.
                  const docRef = db.collection('users').doc(state.userAddresses[index].members[m].uid)
                  var tempData = ''
                  docRef.get()
                    .then((doc) => {
                      if (doc.exists) {
                        var promise5 = new Promise(function (resolve, reject) {
                          tempData = doc.data()
                          resolve()
                        })
                        promise5.then(function () {
                          // Deletes the address out of the addressess record.
                          for (let a = 0; a < tempData.addresses.length; a++) {
                            if (tempData.addresses[a].address === state.userAddresses[index].address) {
                              tempData.addresses.splice(a, 1)
                            }
                          }
                          // Saves the tempArray back into the edited users' document.
                          db.collection('users').doc(state.userAddresses[index].members[m].uid).set(tempData)
                          resolve()
                        })
                      } else {
                        // doc.data() will be undefined in this case
                        console.log('No such document!')
                      }
                    })
                    .catch((error) => {
                      console.log('Error getting document:', error)
                    })
                }
              })
              promise2.then(function () {
                // Deletes the address document in addresses collection.
                var batch = db.batch()
                var collectionRef = db.collection('addresses').doc(state.userAddresses[index].address).collection('calendar')
                batch.delete(collectionRef)
                db.collection('addresses').doc(state.userAddresses[index].address).delete()
                  .then(() => {
                    console.log('Document successfully delete.')
                  })
                  .catch((error) => {
                    console.log('Error removing document: ', error)
                  })
              })
            } else {
              for (let m = 0; m < state.userAddresses[index].members.length; m++) {
                if (state.userAddresses[index].members[m].uid === state.userID) {
                  state.userAddresses[index].members.splice(m, 1)
                }
              }
              state.userData.addresses.splice(index, 1)
              // get new data
            }
          }
          resolve()
        })
        promise1.then(function () {
          const obj = JSON.parse(JSON.stringify(user))
          var promise3 = new Promise(function (resolve, reject) {
            var batch = db.batch()
            var collectionRef = db.collection('users').doc(obj.uid).collection('calendar')
            batch.delete(collectionRef)
            // collectionRef.get()
            //   .then(function (querySnapshot) {
            //     querySnapshot.forEach(function (doc) {
            //       // deletes all the documents in collection calendar
            //       collectionRef.doc(doc.id).delete()
            //         .then(function () {
            //           console.log('Calendar document successfully deleted.')
            //         })
            //         .catch(function (error) {
            //           console.error('Error removing document: ', error)
            //         })
            //     })
            //   })
            resolve()
          })
          promise3.then(function () {
            var promise4 = new Promise(function (resolve, reject) {
              // deletes the user data in the main document
              db.collection('users').doc(obj.uid).delete()
                .then(function () {
                  console.log('User data successfully deleted.')
                })
                .catch(function (error) {
                  console.error('Error removing document: ', error)
                })
              resolve()
            })
            promise4.then(function () {
              state.userID = 'default'
              state.userEmail = 'default'
              // deletes the user account in firebase authentication
              user.delete()
                .then(function () {
                  // User deleted.
                }).catch(function (error) {
                  // An error happened.
                  console.log(error.message)
                })
            })
          })
        })
      }
    },
    createShoppingList (state) {
      for (let a = 0; a < state.userAddresses.length; a++) {
        state.userAddresses[a].shoppingList = []
        for (let d = 0; d < state.userAddresses[a].calendar.length; d++) {
          const breakfastRatio = state.userAddresses[a].calendar[d].breakfastCalories / state.userAddresses[a].calendar[d].breakfastCaloriesOwner
          const lunchRatio = state.userAddresses[a].calendar[d].lunchCalories / state.userAddresses[a].calendar[d].lunchCaloriesOwner
          const dinnerRatio = state.userAddresses[a].calendar[d].dinnerCalories / state.userAddresses[a].calendar[d].dinnerCaloriesOwner
          for (let ingredient = 0; ingredient < state.userAddresses[a].calendar[d].breakfastIngredients.length; ingredient++) {
            // needs to check whether the ingredient is already purchased / active
            if (state.userAddresses[a].calendar[d].breakfastIngredients[ingredient].isPurchased === false) {
              // for each ingredient, it checks whether the ingredient is already in the shopping list
              let check = true
              for (let item = 0; item < state.userAddresses[a].shoppingList.length; item++) {
                // if it is, it increases the amount
                if (state.userAddresses[a].shoppingList[item].ingredient === state.userAddresses[a].calendar[d].breakfastIngredients[ingredient].ingredient) {
                  state.userAddresses[a].shoppingList[item].amount += (state.userAddresses[a].calendar[d].breakfastIngredients[ingredient].amount * breakfastRatio)
                  check = false
                }
              }
              // if the ingredient isn't already on the list, then it adds it
              if (check) {
                state.userAddresses[a].shoppingList.push(JSON.parse(JSON.stringify(state.userAddresses[a].calendar[d].breakfastIngredients[ingredient])))
                state.userAddresses[a].shoppingList[state.userAddresses[a].shoppingList.length - 1].amount *= breakfastRatio
              }
            }
          }
          for (let ingredient = 0; ingredient < state.userAddresses[a].calendar[d].lunchIngredients.length; ingredient++) {
            // needs to check whether the ingredient is already purchased / active
            if (state.userAddresses[a].calendar[d].lunchIngredients[ingredient].isPurchased === false) {
              // for each ingredient, it checks whether the ingredient is already in the shopping list
              let check = true
              for (let item = 0; item < state.userAddresses[a].shoppingList.length; item++) {
                // if it is, it increases the amount
                if (state.userAddresses[a].shoppingList[item].ingredient === state.userAddresses[a].calendar[d].lunchIngredients[ingredient].ingredient) {
                  state.userAddresses[a].shoppingList[item].amount += (state.userAddresses[a].calendar[d].lunchIngredients[ingredient].amount * lunchRatio)
                  check = false
                }
              }
              // if the ingredient isn't already on the list, then it adds it
              if (check) {
                state.userAddresses[a].shoppingList.push(JSON.parse(JSON.stringify(state.userAddresses[a].calendar[d].lunchIngredients[ingredient])))
                state.userAddresses[a].shoppingList[state.userAddresses[a].shoppingList.length - 1].amount *= lunchRatio
              }
            }
          }
          for (let ingredient = 0; ingredient < state.userAddresses[a].calendar[d].dinnerIngredients.length; ingredient++) {
            // needs to check whether the ingredient is already purchased / active
            if (state.userAddresses[a].calendar[d].dinnerIngredients[ingredient].isPurchased === false) {
              // for each ingredient, it checks whether the ingredient is already in the shopping list
              let check = true
              for (let item = 0; item < state.userAddresses[a].shoppingList.length; item++) {
                // if it is, it increases the amount
                if (state.userAddresses[a].shoppingList[item].ingredient === state.userAddresses[a].calendar[d].dinnerIngredients[ingredient].ingredient) {
                  state.userAddresses[a].shoppingList[item].amount += (state.userAddresses[a].calendar[d].dinnerIngredients[ingredient].amount * dinnerRatio)
                  check = false
                }
              }
              // if the ingredient isn't already on the list, then it adds it
              if (check) {
                state.userAddresses[a].shoppingList.push(JSON.parse(JSON.stringify(state.userAddresses[a].calendar[d].dinnerIngredients[ingredient])))
                state.userAddresses[a].shoppingList[state.userAddresses[a].shoppingList.length - 1].amount *= dinnerRatio
              }
            }
          }
        }
      }
    },
    groceriesDone (state, address) {
      for (let a = 0; a < state.userAddresses.length; a++) {
        for (let i = 0; i < state.userAddresses[a].shoppingList.length; i++) {
          if (state.userAddresses[a].shoppingList[i].isActive) {
            const ingredient = state.userAddresses[a].shoppingList[i].ingredient
            for (let d = 0; d < state.userAddresses[a].calendar.length; d++) {
              for (let br = 0; br < state.userAddresses[a].calendar[d].breakfastIngredients.length; br++) {
                if (state.userAddresses[a].calendar[d].breakfastIngredients[br].ingredient === ingredient) {
                  Vue.set(state.userAddresses[a].calendar[d].breakfastIngredients[br], 'isPurchased', true)
                }
              }
              for (let lu = 0; lu < state.userAddresses[a].calendar[d].lunchIngredients.length; lu++) {
                if (state.userAddresses[a].calendar[d].lunchIngredients[lu].ingredient === ingredient) {
                  Vue.set(state.userAddresses[a].calendar[d].lunchIngredients[lu], 'isPurchased', true)
                }
              }
              for (let di = 0; di < state.userAddresses[a].calendar[d].dinnerIngredients.length; di++) {
                if (state.userAddresses[a].calendar[d].dinnerIngredients[di].ingredient === ingredient) {
                  Vue.set(state.userAddresses[a].calendar[d].dinnerIngredients[di], 'isPurchased', true)
                }
              }
            }
          }
        }
        for (let p = 0; p < state.userAddresses[a].personalList.length; p++) {
          if (state.userAddresses[a].personalList[p].isActive) {
            state.userAddresses[a].personalList.splice(p, 1)
          }
        }
      }
      // saveData ()
      if (state.userID !== 'default') {
        for (let d = 0; d < state.userData.calendar.length; d++) {
          db.collection('users').doc(state.userID).collection('calendar').doc(state.userData.calendar[d].date.toString())
            .set(state.userData.calendar[d])
        }
        state.userData.calendar = []
        db.collection('users').doc(state.userID).set(state.userData)
        for (let a = 0; a < state.userAddresses.length; a++) {
          if (state.userAddresses[a].calendar.length > 0) {
            for (let d = 0; d < state.userAddresses[a].calendar.length; d++) {
              db.collection('addresses').doc(state.userAddresses[a].address).collection('calendar').doc(state.userAddresses[a].calendar[d].date.toString())
                .set(state.userAddresses[a].calendar[d])
            }
            state.userAddresses[a].calendar = []
          }
          db.collection('addresses').doc(state.userAddresses[a].address).set(state.userAddresses[a])
        }
      }
      // getData ()
      state.userData = ''
      const docRef = db.collection('users').doc(state.userID)
      docRef.get()
        .then((doc) => {
          // eslint-disable-next-line
          new Promise(function (resolve, reject) {
            state.userData = doc.data()
            resolve()
          })
            .then(function () {
              state.userAddresses = []
              for (let a = 0; a < state.userData.addresses.length; a++) {
                const addressRef = db.collection('addresses').doc(state.userData.addresses[a].address)
                addressRef.get()
                  .then((doc) => {
                    if (doc.exists) {
                      state.userAddresses.push(doc.data())
                      const today = moment().format('YYYYMM')
                      for (var month = 0; month < 12; month++) {
                        if (!state.userData.months.includes((Number(today) + Number(month)).toString())) {
                          const daysInMonth = moment().add(month, 'months').daysInMonth()
                          const year = moment().add(month, 'months').format('YYYY')
                          const mon = moment().add(month, 'months').format('MM')
                          for (let d = 0; d < daysInMonth; d++) {
                            const day = moment().year(year).month(mon).subtract(1, 'M')
                              .startOf('month')
                              .add(d, 'day')
                              .format('DD')
                            const docName = moment().year(year).month(mon).subtract(1, 'M')
                              .date(day)
                              .format('YYYYMMDD')
                            const dayTemplate = {
                              date: Number(moment().year(year).month(mon).subtract(1, 'M')
                                .date(day)
                                .format('YYYYMMDD')),
                              day,
                              dayname: moment().isoWeekday(moment().year(year).month(mon).subtract(1, 'M')
                                .date(day)
                                .weekday()).format('dddd'),
                              breakfast: 'Breakfast',
                              breakfastLocation: 'Home',
                              breakfastAddress: state.userAddresses[0].address,
                              lunch: 'Lunch',
                              lunchLocation: 'Home',
                              lunchAddress: state.userAddresses[0].address,
                              dinner: 'Dinner',
                              dinnerLocation: 'Home',
                              dinnerAddress: state.userAddresses[0].address
                            }
                            db.collection('users').doc(state.userID).collection('calendar').doc(docName)
                              .set(dayTemplate)
                          }
                          state.userData.months.push(moment().add(month, 'months').format('YYYYMM'))
                        }
                      }
                      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                      const calRef = db.collection('users').doc(state.userID).collection('calendar')
                      calRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
                        .then(function (querySnapshot) {
                          querySnapshot.forEach((doc) => {
                            state.userData.calendar.push(doc.data())
                          })
                        })
                      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                      const calAddressRef = db.collection('addresses').doc(state.userData.addresses[a].address).collection('calendar')
                      calAddressRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.userData.info.shoppingListLength, 'days').format('YYYYMMDD'))).orderBy('date').get()
                        .then(function (querySnapshot) {
                          querySnapshot.forEach((doc) => {
                            state.userAddresses[a].calendar.push(doc.data())
                          })
                        })
                    }
                  })
              }
            })
        })
      for (let a = 0; a < state.userAddresses.length; a++) {
        state.userAddresses[a].shoppingList = []
        for (let d = 0; d < state.userAddresses[a].calendar.length; d++) {
          const breakfastRatio = state.userAddresses[a].calendar[d].breakfastCalories / state.userAddresses[a].calendar[d].breakfastCaloriesOwner
          const lunchRatio = state.userAddresses[a].calendar[d].lunchCalories / state.userAddresses[a].calendar[d].lunchCaloriesOwner
          const dinnerRatio = state.userAddresses[a].calendar[d].dinnerCalories / state.userAddresses[a].calendar[d].dinnerCaloriesOwner
          for (let ingredient = 0; ingredient < state.userAddresses[a].calendar[d].breakfastIngredients.length; ingredient++) {
            // needs to check whether the ingredient is already purchased / active
            if (state.userAddresses[a].calendar[d].breakfastIngredients[ingredient].isActive === false) {
              // for each ingredient, it checks whether the ingredient is already in the shopping list
              let check = true
              for (let item = 0; item < state.userAddresses[a].shoppingList.length; item++) {
                // if it is, it increases the amount
                if (state.userAddresses[a].shoppingList[item].ingredient === state.userAddresses[a].calendar[d].breakfastIngredients[ingredient].ingredient) {
                  state.userAddresses[a].shoppingList[item].amount += (state.userAddresses[a].calendar[d].breakfastIngredients[ingredient].amount * breakfastRatio)
                  check = false
                }
              }
              // if the ingredient isn't already on the list, then it adds it
              if (check) {
                state.userAddresses[a].shoppingList.push(JSON.parse(JSON.stringify(state.userAddresses[a].calendar[d].breakfastIngredients[ingredient])))
                state.userAddresses[a].shoppingList[state.userAddresses[a].shoppingList.length - 1].amount *= breakfastRatio
              }
            }
          }
          for (let ingredient = 0; ingredient < state.userAddresses[a].calendar[d].lunchIngredients.length; ingredient++) {
            // needs to check whether the ingredient is already purchased / active
            if (state.userAddresses[a].calendar[d].lunchIngredients[ingredient].isActive === false) {
              // for each ingredient, it checks whether the ingredient is already in the shopping list
              let check = true
              for (let item = 0; item < state.userAddresses[a].shoppingList.length; item++) {
                // if it is, it increases the amount
                if (state.userAddresses[a].shoppingList[item].ingredient === state.userAddresses[a].calendar[d].lunchIngredients[ingredient].ingredient) {
                  state.userAddresses[a].shoppingList[item].amount += (state.userAddresses[a].calendar[d].lunchIngredients[ingredient].amount * lunchRatio)
                  check = false
                }
              }
              // if the ingredient isn't already on the list, then it adds it
              if (check) {
                state.userAddresses[a].shoppingList.push(JSON.parse(JSON.stringify(state.userAddresses[a].calendar[d].lunchIngredients[ingredient])))
                state.userAddresses[a].shoppingList[state.userAddresses[a].shoppingList.length - 1].amount *= lunchRatio
              }
            }
          }
          for (let ingredient = 0; ingredient < state.userAddresses[a].calendar[d].dinnerIngredients.length; ingredient++) {
            // needs to check whether the ingredient is already purchased / active
            if (state.userAddresses[a].calendar[d].dinnerIngredients[ingredient].isActive === false) {
              // for each ingredient, it checks whether the ingredient is already in the shopping list
              let check = true
              for (let item = 0; item < state.userAddresses[a].shoppingList.length; item++) {
                // if it is, it increases the amount
                if (state.userAddresses[a].shoppingList[item].ingredient === state.userAddresses[a].calendar[d].dinnerIngredients[ingredient].ingredient) {
                  state.userAddresses[a].shoppingList[item].amount += (state.userAddresses[a].calendar[d].dinnerIngredients[ingredient].amount * dinnerRatio)
                  check = false
                }
              }
              // if the ingredient isn't already on the list, then it adds it
              if (check) {
                state.userAddresses[a].shoppingList.push(JSON.parse(JSON.stringify(state.userAddresses[a].calendar[d].dinnerIngredients[ingredient])))
                state.userAddresses[a].shoppingList[state.userAddresses[a].shoppingList.length - 1].amount *= dinnerRatio
              }
            }
          }
        }
      }
    },
    createUser (state, user) {
      const obj = JSON.parse(JSON.stringify(user))
      var twoYears = []
      for (let y = 0; y < 2; y++) {
        for (let month = 0; month < 12; month++) {
          twoYears.push({
            month: moment().year(Number(this.currentYear)).month(month).add(y, 'years').format('YYYYMM'),
            display: moment().year(Number(this.currentYear)).month(month).add(y, 'years').format('MMM'),
            isActive: false,
            isPurchased: false
          })
        }
      }
      db.collection('addresses').add({
        members: [{
          email: obj.user.email,
          role: 'Owner',
          uid: obj.user.uid
        }],
        personalList: [],
        shoppingList: [],
        calendar: [],
        address: '',
        months: twoYears
      })
        .then(docRef => {
          const template = {
            foods: [],
            addresses: [{
              name: 'Home',
              isActive: true,
              address: docRef.id,
              isDefault: true
            }],
            tagList: [
              {
                text: 'Breakfast',
                isActive: true
              },
              {
                text: 'Lunch',
                isActive: true
              },
              {
                text: 'Dinner',
                isActive: true
              }
            ],
            calendar: [],
            months: [],
            info: {
              email: obj.user.email,
              uid: obj.user.uid,
              shoppingListLength: 7,
              calories: 2000,
              role: 'customer'
            }
          }
          db.collection('users').doc(obj.user.uid).set(template)
          db.collection('addresses').doc(docRef.id).update({
            address: docRef.id
          })
          for (var month = 0; month < 12; month++) {
          // adds days to user data
            const daysInMonth = moment().add(month, 'months').daysInMonth()
            const year = moment().add(month, 'months').format('YYYY')
            const mon = moment().add(month, 'months').format('MM')
            for (let d = 0; d < daysInMonth; d++) {
              const day = moment().year(year).month(mon).subtract(1, 'M')
                .startOf('month')
                .add(d, 'day')
                .format('DD')
              const docName = moment().year(year).month(mon).subtract(1, 'M')
                .date(day)
                .format('YYYYMMDD')
              const dayTemplate = {
                date: Number(moment().year(year).month(mon).subtract(1, 'M')
                  .date(day)
                  .format('YYYYMMDD')),
                day,
                dayname: moment().isoWeekday(moment().year(year).month(mon).subtract(1, 'M')
                  .date(day)
                  .weekday()).format('dddd'),
                breakfast: 'Breakfast',
                breakfastLocation: 'Home',
                breakfastAddress: docRef.id,
                lunch: 'Lunch',
                lunchLocation: 'Home',
                lunchAddress: docRef.id,
                dinner: 'Dinner',
                dinnerLocation: 'Home',
                dinnerAddress: docRef.id
              }
              db.collection('users').doc(state.userID).collection('calendar').doc(docName)
                .set(dayTemplate)
            }
          }
          firebase.auth().useDeviceLanguage()
          firebase.auth().currentUser.sendEmailVerification()
            .then(function () {
              // Email sent.
              alert('Verification email sent. Please verify your email address and then log in.')
              firebase.auth().signOut()
                .then(function () {
                // Sign-out successful.
                }).catch(function (error) {
                  // An error happened.
                  console.log(error.code)
                })
            })
            .catch(function (error) {
              // An error happened.
              console.log(error.message)
            })
        })
        .catch(function (error) {
          console.log(error.code)
        })
    },
    setUser (state, user) {
      state.userID = user.uid
      state.userEmail = user.email
      // getData ()
      state.userData = ''
      const docRef = db.collection('users').doc(state.userID)
      docRef.get()
        .then((doc) => {
          // eslint-disable-next-line
          new Promise(function (resolve, reject) {
            state.userData = doc.data()
            resolve()
          })
            .then(function () {
              state.userAddresses = []
              const calRef = db.collection('users').doc(state.userID).collection('calendar')
              state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
              calRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach((doc) => {
                    state.userData.calendar.push(doc.data())
                  })
                })
              for (let a = 0; a < state.userData.addresses.length; a++) {
                const addressRef = db.collection('addresses').doc(state.userData.addresses[a].address)
                addressRef.get()
                  .then((doc) => {
                    if (doc.exists) {
                      state.userAddresses.push(doc.data())
                      const today = moment().format('YYYYMM')
                      for (var month = 0; month < 12; month++) {
                        // adds days to user data
                        if (!state.userData.months.includes((Number(today) + Number(month)).toString())) {
                          const daysInMonth = moment().add(month, 'months').daysInMonth()
                          const year = moment().add(month, 'months').format('YYYY')
                          const mon = moment().add(month, 'months').format('MM')
                          for (let d = 0; d < daysInMonth; d++) {
                            const day = moment().year(year).month(mon).subtract(1, 'M')
                              .startOf('month')
                              .add(d, 'day')
                              .format('DD')
                            const docName = moment().year(year).month(mon).subtract(1, 'M')
                              .date(day)
                              .format('YYYYMMDD')
                            const dayTemplate = {
                              date: Number(moment().year(year).month(mon).subtract(1, 'M')
                                .date(day)
                                .format('YYYYMMDD')),
                              day,
                              dayname: moment().isoWeekday(moment().year(year).month(mon).subtract(1, 'M')
                                .date(day)
                                .weekday()).format('dddd'),
                              breakfast: 'Breakfast',
                              breakfastLocation: 'Home',
                              breakfastAddress: state.userAddresses[0].address,
                              lunch: 'Lunch',
                              lunchLocation: 'Home',
                              lunchAddress: state.userAddresses[0].address,
                              dinner: 'Dinner',
                              dinnerLocation: 'Home',
                              dinnerAddress: state.userAddresses[0].address
                            }
                            db.collection('users').doc(state.userID).collection('calendar').doc(docName)
                              .set(dayTemplate)
                          }
                          state.userData.months.push(moment().add(month, 'months').format('YYYYMM'))
                        }
                      }
                      var months = []
                      for (let m = 0; m < state.userAddresses[a].months.length; m++) {
                        months.push(state.userAddresses[a].months[m].month)
                      }
                      for (var month2 = 0; month2 < 24; month2++) {
                        // adds months to user address
                        if (!months.includes((Number(today) + Number(month2)).toString())) {
                          state.userAddresses[a].months.push({
                            month: (Number(today) + Number(month2)).toString(),
                            display: moment((Number(today) + Number(month2)).toString(), 'YYYYMM').format('MMM'),
                            isActive: false,
                            isPurchased: false
                          })
                          db.collection('addresses').doc(state.userAddresses[a].address)
                            .set(state.userAddresses[a])
                        }
                      }
                      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                      const calAddressRef = db.collection('addresses').doc(state.userData.addresses[a].address).collection('calendar')
                      calAddressRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.userData.info.shoppingListLength, 'days').format('YYYYMMDD'))).orderBy('date').get()
                        .then(function (querySnapshot) {
                          querySnapshot.forEach((doc) => {
                            state.userAddresses[a].calendar.push(doc.data())
                          })
                        })
                    }
                  })
              }
            })
        })
    },
    setDefaultUser (state) {
      // saveData ()
      if (state.userID !== 'default') {
        for (let d = 0; d < state.userData.calendar.length; d++) {
          db.collection('users').doc(state.userID).collection('calendar').doc(state.userData.calendar[d].date.toString())
            .set(state.userData.calendar[d])
        }
        state.userData.calendar = []
        db.collection('users').doc(state.userID).set(state.userData)
        for (let a = 0; a < state.userAddresses.length; a++) {
          if (state.userAddresses[a].calendar.length > 0) {
            for (let d = 0; d < state.userAddresses[a].calendar.length; d++) {
              db.collection('addresses').doc(state.userAddresses[a].address).collection('calendar').doc(state.userAddresses[a].calendar[d].date.toString())
                .set(state.userAddresses[a].calendar[d])
            }
            state.userAddresses[a].calendar = []
          }
          db.collection('addresses').doc(state.userAddresses[a].address).set(state.userAddresses[a])
        }
      }
      state.userID = 'default'
      state.userEmail = 'default'
      // getData ()
      state.userData = ''
      const docRef = db.collection('users').doc(state.userID)
      docRef.get()
        .then((doc) => {
          // eslint-disable-next-line
          new Promise(function (resolve, reject) {
            state.userData = doc.data()
            resolve()
          })
            .then(function () {
              state.userAddresses = []
              for (let a = 0; a < state.userData.addresses.length; a++) {
                const addressRef = db.collection('addresses').doc(state.userData.addresses[a].address)
                addressRef.get()
                  .then((doc) => {
                    if (doc.exists) {
                      state.userAddresses.push(doc.data())
                      const today = moment().format('YYYYMM')
                      var months = []
                      for (let m = 0; m < state.userAddresses[a].months.length; m++) {
                        months.push(state.userAddresses[a].months[m].month)
                      }
                      for (var month = 0; month < 12; month++) {
                        // adds days to default user calendar
                        if (!state.userData.months.includes((Number(today) + Number(month)).toString())) {
                          const daysInMonth = moment().add(month, 'months').daysInMonth()
                          const year = moment().add(month, 'months').format('YYYY')
                          const mon = moment().add(month, 'months').format('MM')
                          for (let d = 0; d < daysInMonth; d++) {
                            const day = moment().year(year).month(mon).subtract(1, 'M')
                              .startOf('month')
                              .add(d, 'day')
                              .format('DD')
                            const docName = moment().year(year).month(mon).subtract(1, 'M')
                              .date(day)
                              .format('YYYYMMDD')
                            const dayTemplate = {
                              date: Number(moment().year(year).month(mon).subtract(1, 'M')
                                .date(day)
                                .format('YYYYMMDD')),
                              day,
                              dayname: moment().isoWeekday(moment().year(year).month(mon).subtract(1, 'M')
                                .date(day)
                                .weekday()).format('dddd'),
                              breakfast: 'Breakfast',
                              breakfastLocation: 'Home',
                              breakfastAddress: state.userAddresses[0].address,
                              lunch: 'Lunch',
                              lunchLocation: 'Home',
                              lunchAddress: state.userAddresses[0].address,
                              dinner: 'Dinner',
                              dinnerLocation: 'Home',
                              dinnerAddress: state.userAddresses[0].address
                            }
                            db.collection('users').doc(state.userID).collection('calendar').doc(docName)
                              .set(dayTemplate)
                          }
                          state.userData.months.push(moment().add(month, 'months').format('YYYYMM'))
                          db.collection('users').doc(state.userID)
                            .set(state.userData)
                        }
                        // adds months to default address
                        if (!months.includes((Number(today) + Number(month)).toString())) {
                          state.userAddresses[a].months.push({
                            month: (Number(today) + Number(month)).toString(),
                            display: moment((Number(today) + Number(month)).toString(), 'YYYYMM').format('MMM'),
                            isActive: true,
                            isPurchased: false
                          })
                          db.collection('addresses').doc(state.userAddresses[a].address)
                            .set(state.userAddresses[a])
                        }
                      }
                      // adds days to default address calendar
                      for (let m = 0; m < state.userAddresses[a].months.length; m++) {
                        if (state.userAddresses[a].months[m].isActive === true) {
                          const date = moment(state.userAddresses[a].months[m].month, 'YYYYMM', true)
                          const daysInMonth = date.daysInMonth()
                          const year = date.format('YYYY')
                          const mon = date.format('MM')
                          for (let d = 0; d < daysInMonth; d++) {
                            const day = moment().year(year).month(mon).subtract(1, 'M')
                              .startOf('month')
                              .add(d, 'day')
                              .format('DD')
                            const docName = moment().year(year).month(mon).subtract(1, 'M')
                              .date(day)
                              .format('YYYYMMDD')
                            const dayTemplate = {
                              date: Number(moment().year(year).month(mon).subtract(1, 'M')
                                .date(day)
                                .format('YYYYMMDD')),
                              day,
                              dayname: moment().isoWeekday(moment().year(year).month(mon).subtract(1, 'M')
                                .date(day)
                                .weekday()).format('dddd'),
                              breakfastCaloriesOwner: null,
                              breakfastMembers: [
                                state.userID
                              ],
                              breakfastCalories: state.userData.info.calories,
                              breakfastIngredients: [],
                              lunchCaloriesOwner: null,
                              lunchMembers: [
                                state.userID
                              ],
                              lunchCalories: state.userData.info.calories,
                              lunchIngredients: [],
                              dinnerCaloriesOwner: null,
                              dinnerMembers: [
                                state.userID
                              ],
                              dinnerCalories: state.userData.info.calories,
                              dinnerIngredients: []
                            }
                            db.collection('addresses').doc(state.userData.addresses[a].address).collection('calendar').doc(docName)
                              .set(dayTemplate)
                          }
                          Vue.set(state.userAddresses[a].months[m], 'isPurchased', true)
                          Vue.set(state.userAddresses[a].months[m], 'isActive', false)
                          db.collection('addresses').doc(state.userAddresses[a].address)
                            .set(state.userAddresses[a])
                        }
                      }
                      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                      const calRef = db.collection('users').doc(state.userID).collection('calendar')
                      calRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
                        .then(function (querySnapshot) {
                          querySnapshot.forEach((doc) => {
                            state.userData.calendar.push(doc.data())
                          })
                        })
                      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                      const calAddressRef = db.collection('addresses').doc(state.userData.addresses[a].address).collection('calendar')
                      calAddressRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.userData.info.shoppingListLength, 'days').format('YYYYMMDD'))).orderBy('date').get()
                        .then(function (querySnapshot) {
                          querySnapshot.forEach((doc) => {
                            state.userAddresses[a].calendar.push(doc.data())
                          })
                        })
                    }
                  })
              }
            })
        })
    },
    getData (state) {
      // getData without checking userData.months ()
      const docRef = db.collection('users').doc(state.userID)
      state.userData = ''
      docRef.get()
        .then((doc) => {
          // eslint-disable-next-line
          new Promise(function (resolve, reject) {
            state.userData = doc.data()
            resolve()
          })
            .then(function () {
              state.userAddresses = []
              for (let a = 0; a < state.userData.addresses.length; a++) {
                const addressRef = db.collection('addresses').doc(state.userData.addresses[a].address)
                addressRef.get()
                  .then((doc) => {
                    if (doc.exists) {
                      state.userAddresses.push(doc.data())
                      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                      const calRef = db.collection('users').doc(state.userID).collection('calendar')
                      calRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
                        .then(function (querySnapshot) {
                          querySnapshot.forEach((doc) => {
                            state.userData.calendar.push(doc.data())
                          })
                        })
                      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                      const calAddressRef = db.collection('addresses').doc(state.userData.addresses[a].address).collection('calendar')
                      calAddressRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.userData.info.shoppingListLength, 'days').format('YYYYMMDD'))).orderBy('date').get()
                        .then(function (querySnapshot) {
                          querySnapshot.forEach((doc) => {
                            state.userAddresses[a].calendar.push(doc.data())
                          })
                        })
                    }
                  })
              }
            })
        })
    },
    saveData (state) {
      // saveData ()
      if (state.userID !== 'default') {
        for (let d = 0; d < state.userData.calendar.length; d++) {
          db.collection('users').doc(state.userID).collection('calendar').doc(state.userData.calendar[d].date.toString())
            .set(state.userData.calendar[d])
        }
        state.userData.calendar = []
        db.collection('users').doc(state.userID).set(state.userData)
        for (let a = 0; a < state.userAddresses.length; a++) {
          if (state.userAddresses[a].calendar.length > 0) {
            for (let d = 0; d < state.userAddresses[a].calendar.length; d++) {
              db.collection('addresses').doc(state.userAddresses[a].address).collection('calendar').doc(state.userAddresses[a].calendar[d].date.toString())
                .set(state.userAddresses[a].calendar[d])
            }
            state.userAddresses[a].calendar = []
          }
          db.collection('addresses').doc(state.userAddresses[a].address).set(state.userAddresses[a])
        }
      }
    }
  }
})
