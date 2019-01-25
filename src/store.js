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
    pointer: {
      doc: '',
      position: ''
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
      isActive: false
    },
    ingredientsList: {
      ingredient: null,
      amount: null,
      unit: null,
      isActive: false
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
                breakfastID: '',
                breakfastMembers: [
                  state.userID
                ],
                breakfastCalories: state.userData.info.calories,
                breakfastIngredients: [],
                lunchID: '',
                lunchMembers: [
                  state.userID
                ],
                lunchCalories: state.userData.info.calories,
                lunchIngredients: [],
                dinnerID: '',
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
                breakfastID: '',
                breakfastMembers: [],
                breakfastCalories: '',
                breakfastIngredients: [],
                lunchID: '',
                lunchMembers: [],
                lunchCalories: '',
                lunchIngredients: [],
                dinnerID: '',
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
        if (state.userData.addresses[a].isActive) {
          day.breakfastLocation = state.userData.addresses[a].name
          day.breakfastAddress = state.userData.addresses[a].address
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
        if (state.userData.addresses[a].isActive) {
          day.lunchLocation = state.userData.addresses[a].name
          day.lunchAddress = state.userData.addresses[a].address
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
        if (state.userData.addresses[a].isActive) {
          day.dinnerLocation = state.userData.addresses[a].name
          day.dinnerAddress = state.userData.addresses[a].address
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
          isActive: false
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
        isActive: false
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
          state.userData.calendar[state.pointer.doc].breakfastIngredients.push(ingredientObject)
        } else if (state.pointer.position === 'lunch') {
          state.userData.calendar[state.pointer.doc].lunchIngredients.push(ingredientObject)
        } else {
          state.userData.calendar[state.pointer.doc].dinnerIngredients.push(ingredientObject)
        }
      }
      if (state.pointer.position === 'breakfast') {
        state.userData.calendar[state.pointer.doc].breakfast = mealName
        state.userData.calendar[state.pointer.doc].breakfastID = mealID
      } else if (state.pointer.position === 'lunch') {
        state.userData.calendar[state.pointer.doc].lunch = mealName
        state.userData.calendar[state.pointer.doc].lunchID = mealID
      } else {
        state.userData.calendar[state.pointer.doc].dinner = mealName
        state.userData.calendar[state.pointer.doc].dinnerID = mealID
      }
    },
    removeMeal (state) {
      if (state.pointer.position === 'breakfast') {
        Vue.set(state.userData.calendar[state.pointer.doc], 'breakfast', 'Breakfast')
        Vue.set(state.userData.calendar[state.pointer.doc], 'breakfastIngredients', [])
      } else if (state.pointer.position === 'lunch') {
        Vue.set(state.userData.calendar[state.pointer.doc], 'lunch', 'Lunch')
        Vue.set(state.userData.calendar[state.pointer.doc], 'lunchIngredients', [])
      } else {
        Vue.set(state.userData.calendar[state.pointer.doc], 'dinner', 'Dinner')
        Vue.set(state.userData.calendar[state.pointer.doc], 'dinnerIngredients', [])
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
              isDefault: false
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
          const dataRef = db.collection('users').doc(state.userID)
          state.userData = ''
          dataRef.get()
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
          console.log('Error adding document to addresses collection: ', error)
        })
    },
    deletePlace (state, place) {
      if (confirm('Are you sure you want to remove this place?')) {
        const index = state.userData.addresses.indexOf(place)
        const doc = state.userAddresses[index].address
        var owner = false
        for (let member = 0; member < state.userAddresses[index].members.length; member++) {
          if (state.userAddresses[index].members[member].role === 'Owner' && state.userAddresses[index].members[member].uid === state.userID) {
            owner = true
          }
        }
        if (owner) {
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
            var owner = false
            for (let member = 0; member < state.userAddresses[index].members.length; member++) {
              if (state.userAddresses[index].members[member].role === 'Owner' && state.userAddresses[index].members[member].uid === state.userID) {
                owner = true
              }
            }
            if (owner) {
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
                          // Get new userData and userAddresses
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
                resolve()
              })
              promise2.then(function () {
                // Deletes the address document in addresses collection.
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
            const collectionRef = db.collection('users').doc(obj.uid).collection('calendar')
            collectionRef.get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  // deletes all the documents in collection calendar
                  collectionRef.doc(doc.id).delete()
                    .then(function () {
                      console.log('Calendar document successfully deleted.')
                    })
                    .catch(function (error) {
                      console.error('Error removing document: ', error)
                    })
                })
              })
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
    confirmPurchase (state, address) {
      for (let place in state.userAddresses) {
        if (state.userAddresses[place].address === address) {
          for (let ingredient in state.userAddresses[place].shoppingList) {
            if (state.userAddresses[place].shoppingList[ingredient].isActive) {
              let searchIngredient = state.userAddresses[place].shoppingList[ingredient].ingredient
              for (let member in state.userAddresses[place].members) {
                state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                state.tempCal = []
                const calendarRef = db.collection('users').doc(state.userAddresses[place].members[member].uid).collection('calendar')
                calendarRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.userData.info.shoppingListLength, 'days').add(1, 'days').format('YYYYMMDD'))).orderBy('date').get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                      // doc.data() is never undefined for query doc snapshots
                      state.tempCal.push(doc.data())
                    })
                  })
                  .catch((error) => {
                    console.log('Error getting documents: ', error)
                  })
                // should use an async function here!
                setTimeout(() => {
                  setPurchased()
                }, 1000)
                // eslint-disable-next-line
                function setPurchased () {
                  for (let days in state.tempCal) {
                    for (let ingr in state.tempCal[days].breakfastIngredients) {
                      if (searchIngredient === state.tempCal[days].breakfastIngredients[ingr].ingredient && state.tempCal[days].breakfastAddress === address) {
                        state.tempCal[days].breakfastIngredients[ingr].isActive = true
                      }
                    }
                    for (let ingr in state.tempCal[days].lunchIngredients) {
                      if (searchIngredient === state.tempCal[days].lunchIngredients[ingr].ingredient && state.tempCal[days].lunchAddress === address) {
                        state.tempCal[days].lunchIngredients[ingr].isActive = true
                      }
                    }
                    for (let ingr in state.tempCal[days].dinnerIngredients) {
                      if (searchIngredient === state.tempCal[days].dinnerIngredients[ingr].ingredient && state.tempCal[days].lunchAddress === address) {
                        state.tempCal[days].dinnerIngredients[ingr].isActive = true
                      }
                    }
                  }
                  for (let day in state.tempCal) {
                    db.collection('users').doc(state.userAddresses[place].members[member].uid).collection('calendar').doc(state.tempCal[day].date.toString())
                      .set(state.tempCal[day])
                  }
                }
              }
            }
          }
          for (let item in state.userAddresses[place].personalList) {
            if (state.userAddresses[place].personalList[item].isActive === true) {
              state.userAddresses[place].personalList.splice(item, 1)
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
              calories: 2000
            }
          }
          db.collection('users').doc(obj.user.uid).set(template)
          db.collection('addresses').doc(docRef.id).update({
            address: docRef.id
          })
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
    },
    async setDefaultUser (state) {
      state.userID = 'default'
      state.userEmail = 'default'
    },
    getData (state) {
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
              const today = moment().format('YYYYMM')
              for (var month = 0; month < 12; month++) {
                if (!state.userData.months.includes(today + month)) {
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
                      breakfastID: '',
                      breakfastLocation: 'Home',
                      breakfastAddress: state.userAddresses[0].address,
                      breakfastIngredients: [],
                      lunch: 'Lunch',
                      lunchID: '',
                      lunchLocation: 'Home',
                      lunchAddress: state.userAddresses[0].address,
                      lunchIngredients: [],
                      dinner: 'Dinner',
                      dinnerID: '',
                      dinnerLocation: 'Home',
                      dinnerAddress: state.userAddresses[0].address,
                      dinnerIngredients: []
                    }
                    db.collection('users').doc(state.userID).collection('calendar').doc(docName)
                      .set(dayTemplate)
                  }
                  state.userData.months.push(moment().add(month, 'months').format('YYYYMM'))
                }
              }
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
    },
    async getUserCalendar (state) {
      console.log('getUserCalendar started')
      return new Promise(function (resolve, reject) {
        state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
        const calRef = db.collection('users').doc(state.userID).collection('calendar')
        calRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
          .then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
              state.userData.calendar.push(doc.data())
            })
            console.log('successful userCalendar')
            resolve()
          })
          .catch((error) => {
            console.log('Error in getting user calendar: ', error)
          })
        console.log('getUserCalendar finished')
      })
    },
    async getUserAddresses (state) {
      return new Promise(function (resolve, reject) {
        console.log('getUserAddresses started')
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
        console.log('successful userAddresses')
        resolve()
        console.log('getUserAddresses finished')
      })
    },
    async getUserAddressesCalendar (state) {
      return new Promise(function (resolve, reject) {
        console.log('getUserAddressesCalendar started')
        for (let a = 0; a < state.userData.addresses.length; a++) {
          state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
          const calRef = db.collection('addresses').doc(state.userData.addresses[a].address).collection('calendar')
          calRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                state.userAddresses[a].calendar.push(doc.data())
              })
              console.log('successful getUserAddressesCalendar')
            })
            .catch((error) => {
              console.log('Error getting documents: ', error)
            })
        }
        console.log('getUserAddressesCalendar finsihed')
      })
    },
    async saveData (state) {
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
  },
  actions: {
    async getData ({ commit }) {
      commit('getData')
    },
    async commitSaveData ({ commit }) {
      commit('saveData')
    },
    async commitSetDefaultUser ({ commit }) {
      commit('setDefaultUser')
    },
    async setDefault ({ dispatch, commit }) {
      await dispatch('commitSaveData')
      await dispatch('commitSetDefaultUser')
      await dispatch('getData')
    }
  }
})
