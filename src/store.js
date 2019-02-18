import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import db from './database'
import router from './router'
import firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(Vuex, moment)

export default new Vuex.Store({
  state: {
    userData: {

    },
    userAddresses: [],
    mealName: null,
    newIngredient: null,
    newAmount: null,
    newUnit: null,
    currentPage: 'calendar',
    price: 0,
    index: null,
    pricePerMonth: 5,
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
      state.userData.email = email
    },
    syncShoppingListLength (state, days) {
      state.userData.shoppingListLength = days
    },
    syncCalories (state, calories) {
      state.userData.calories = calories
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
      for (let t = 0; t < state.userData.filters.length; t++) {
        state.userData.filters[t].isActive = false
      }
      for (let f = 0; f < state.userData.foods.length; f++) {
        if (state.userData.foods[f].id === state.editor.id) {
          for (let t = 0; t < state.userData.filters.length; t++) {
            for (let tag = 0; tag < state.userData.foods[f].tags.length; tag++) {
              if (state.userData.foods[f].tags[tag] === state.userData.filters[t].text) {
                state.userData.filters[t].isActive = true
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
          for (let t = 0; t < state.userData.filters.length; t++) {
            if (state.userData.filters[t].isActive) {
              state.userData.foods[f].tags.push(state.userData.filters[t].text)
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
      }
    },
    calcPrice (state, index) {
      state.price = 0
      for (var i = 0; i < state.userAddresses[index].months.length; i++) {
        if (state.userAddresses[index].months[i].isActive) {
          state.price += state.pricePerMonth
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
                  state.userData.uid
                ],
                breakfastCalories: state.userData.calories,
                breakfastIngredients: [],
                lunchCaloriesOwner: null,
                lunchMembers: [
                  state.userData.uid
                ],
                lunchCalories: state.userData.calories,
                lunchIngredients: [],
                dinnerCaloriesOwner: null,
                dinnerMembers: [
                  state.userData.uid
                ],
                dinnerCalories: state.userData.calories,
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
          db.collection('addresses').doc(state.userAddresses[index].address).collection('months').doc(state.userAddresses[index].months[month].month).update({
            isPurchased: true,
            isActive: false
          })
        }
      }
      // eslint-disable-next-line
      var stripe = Stripe('pk_test_eOIPf7mHX035HASoi8LrghW5', {
        betas: ['checkout_beta_4']
      })
      stripe.redirectToCheckout({
        items: [{
          sku: 'sku_ETuovBIeaLjPou', quantity: state.price / 5
        }],
        // Note that it is not guaranteed your customers will be redirected to this
        // URL *100%* of the time, it's possible that they could e.g. close the
        // tab between form submission and the redirect.
        successUrl: 'https://metabolism-salo.firebaseapp.com/profile',
        cancelUrl: 'https://metabolism-salo.firebaseapp.com/profile'
      })
        .then(function (result) {
          if (result.error) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer.
            alert(result.error.message)
          }
        })
    },
    // addMonthsToFirebase (state) {
    // },
    setPage (state, page) {
      state.currentPage = page
    },
    setToday (state, today) {
      state.today = Number(today)
      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
    },
    setBreakfast (state, day) {
      console.log(day.date)
      state.pointer.doc = state.userData.calendar.indexOf(day)
      state.pointer.position = 'breakfast'
      for (let a = 0; a < state.userData.addresses.length; a++) {
        var alreadyMember = false
        if (state.userData.addresses[a].isActive) {
          state.pointer.address = a
          day.breakfastLocation = state.userData.addresses[a].name
          day.breakfastAddress = state.userData.addresses[a].address
          for (let m = 0; m < state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers.length; m++) {
            if (state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers[m] === state.userData.uid) {
              alreadyMember = true
            }
          }
          if (alreadyMember === false) {
            state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers.push(state.userData.uid)
            state.userAddresses[a].calendar[state.pointer.doc].breakfastCalories += Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
          }
        } else {
          if (state.userAddresses[a].calendar.length > 0) {
            for (let m = 0; m < state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers.length; m++) {
              if (state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers[m] === state.userData.uid) {
                alreadyMember = true
              }
            }
            if (alreadyMember === true) {
              for (var i = state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers.length - 1; i >= 0; i--) {
                if (state.userAddresses[a].calendar[state.pointer.doc].breakfastMembers[i] === state.userData.uid) {
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
        for (let t = 0; t < state.userData.filters.length; t++) {
          state.userData.filters[t].isActive = false
        }
        state.userData.filters[0].isActive = true
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
            if (state.userAddresses[a].calendar[state.pointer.doc].lunchMembers[m] === state.userData.uid) {
              alreadyMember = true
            }
          }
          if (alreadyMember === false) {
            state.userAddresses[a].calendar[state.pointer.doc].lunchMembers.push(state.userData.uid)
            state.userAddresses[a].calendar[state.pointer.doc].lunchCalories += Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
          }
        } else {
          if (state.userAddresses[a].calendar.length > 0) {
            for (let m = 0; m < state.userAddresses[a].calendar[state.pointer.doc].lunchMembers.length; m++) {
              if (state.userAddresses[a].calendar[state.pointer.doc].lunchMembers[m] === state.userData.uid) {
                alreadyMember = true
              }
            }
            if (alreadyMember === true) {
              for (var i = state.userAddresses[a].calendar[state.pointer.doc].lunchMembers.length - 1; i >= 0; i--) {
                if (state.userAddresses[a].calendar[state.pointer.doc].lunchMembers[i] === state.userData.uid) {
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
        for (let t = 0; t < state.userData.filters.length; t++) {
          state.userData.filters[t].isActive = false
        }
        state.userData.filters[1].isActive = true
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
            if (state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers[m] === state.userData.uid) {
              alreadyMember = true
            }
          }
          if (alreadyMember === false) {
            state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers.push(state.userData.uid)
            state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers += Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
          }
        } else {
          if (state.userAddresses[a].calendar.length > 0) {
            for (let m = 0; m < state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers.length; m++) {
              if (state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers[m] === state.userData.uid) {
                alreadyMember = true
              }
            }
            if (alreadyMember === true) {
              for (var i = state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers.length - 1; i >= 0; i--) {
                if (state.userAddresses[a].calendar[state.pointer.doc].dinnerMembers[i] === state.userData.uid) {
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
        for (let t = 0; t < state.userData.filters.length; t++) {
          state.userData.filters[t].isActive = false
        }
        state.userData.filters[2].isActive = true
      }
    },
    setDefault (state, index) {
      // change default isActive
      var oldDefault = null
      for (var i = 0; i < state.userData.addresses.length; i++) {
        if (state.userData.addresses[i].isDefault) {
          oldDefault = state.userData.addresses[i].address
          Vue.set(state.userData.addresses[i], 'isDefault', false)
        }
      }
      Vue.set(state.userData.addresses[index], 'isDefault', true)
      // edit user calendar
      var changeBreakfastAddress = []
      var changeLunchAddress = []
      var changeDinnerAddress = []
      var tempUserCal = []
      const userCalRef = db.collection('users').doc(state.userData.uid).collection('calendar')
      userCalRef.where('date', '>=', Number(moment().format('YYYYMMDD'))).get()
        .then((querySnapshot) => {
          new Promise(function (resolve, reject) {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              tempUserCal.push(doc.data())
            })
            resolve()
          })
            .then(function () {
              new Promise(function (resolve, reject) {
                for (let d = 0; d < tempUserCal.length; d++) {
                  if (tempUserCal[d].breakfastAddress === oldDefault) {
                    changeBreakfastAddress.push(tempUserCal[d].date)
                    Vue.set(tempUserCal[d], 'breakfastAddress', state.userData.addresses[index].address)
                    Vue.set(tempUserCal[d], 'breakfastLocation', state.userData.addresses[index].name)
                  }
                  if (tempUserCal[d].lunchAddress === oldDefault) {
                    changeLunchAddress.push(tempUserCal[d].date)
                    Vue.set(tempUserCal[d], 'lunchAddress', state.userData.addresses[index].address)
                    Vue.set(tempUserCal[d], 'lunchLocation', state.userData.addresses[index].name)
                  }
                  if (tempUserCal[d].dinnerAddress === oldDefault) {
                    changeDinnerAddress.push(tempUserCal[d].date)
                    Vue.set(tempUserCal[d], 'dinnerAddress', state.userData.addresses[index].address)
                    Vue.set(tempUserCal[d], 'dinnerLocation', state.userData.addresses[index].name)
                  }
                  db.collection('users').doc(state.userData.uid).collection('calendar').doc(tempUserCal[d].date.toString()).set(tempUserCal[d])
                }
                resolve()
              })
                .then(function () {
                  // remove user from address calendar
                  const calOldDefaultRef = db.collection('addresses').doc(oldDefault).collection('calendar')
                  var tempOldDefaultAddressCal = []
                  calOldDefaultRef.where('date', '>=', Number(moment().format('YYYYMMDD'))).get()
                    .then(function (querySnapshot) {
                      new Promise(function (resolve, reject) {
                        querySnapshot.forEach((doc) => {
                          tempOldDefaultAddressCal.push(doc.data())
                        })
                        resolve()
                      })
                        .then(function () {
                          for (let d = 0; d < tempOldDefaultAddressCal.length; d++) {
                            if (changeBreakfastAddress.includes(tempOldDefaultAddressCal[d].date)) {
                              for (let i = tempOldDefaultAddressCal[d].breakfastMembers.length - 1; i >= 0; i--) {
                                if (tempOldDefaultAddressCal[d].breakfastMembers[i] === state.userData.uid) {
                                  tempOldDefaultAddressCal[d].breakfastMembers.splice(i, 1)
                                  break
                                }
                              }
                              tempOldDefaultAddressCal[d].breakfastCalories -= Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
                            }
                            if (changeLunchAddress.includes(tempOldDefaultAddressCal[d].date)) {
                              for (let i = tempOldDefaultAddressCal[d].lunchMembers.length - 1; i >= 0; i--) {
                                if (tempOldDefaultAddressCal[d].lunchMembers[i] === state.userData.uid) {
                                  tempOldDefaultAddressCal[d].lunchMembers.splice(i, 1)
                                  break
                                }
                              }
                              tempOldDefaultAddressCal[d].lunchCalories -= Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
                            }
                            if (changeDinnerAddress.includes(tempOldDefaultAddressCal[d].date)) {
                              for (let i = tempOldDefaultAddressCal[d].dinnerMembers.length - 1; i >= 0; i--) {
                                if (tempOldDefaultAddressCal[d].dinnerMembers[i] === state.userData.uid) {
                                  tempOldDefaultAddressCal[d].dinnerMembers.splice(i, 1)
                                  break
                                }
                              }
                              tempOldDefaultAddressCal[d].dinnerCalories -= Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
                            }
                            db.collection('addresses').doc(oldDefault).collection('calendar').doc(tempOldDefaultAddressCal[d].date.toString()).set(tempOldDefaultAddressCal[d])
                          }
                        })
                    })
                  // Add user to default address calendar
                  const newDefault = state.userData.addresses[index].address
                  var tempNewDefaultAddressCal = []
                  const calNewDefaultRef = db.collection('addresses').doc(newDefault).collection('calendar')
                  calNewDefaultRef.where('date', '>=', Number(moment().format('YYYYMMDD'))).get()
                    .then(function (querySnapshot) {
                      new Promise(function (resolve, reject) {
                        querySnapshot.forEach((doc) => {
                          tempNewDefaultAddressCal.push(doc.data())
                        })
                        resolve()
                      })
                        .then(function () {
                          for (let d = 0; d < tempNewDefaultAddressCal.length; d++) {
                            if (changeBreakfastAddress.includes(tempNewDefaultAddressCal[d].date)) {
                              tempNewDefaultAddressCal[d].breakfastMembers.push(state.userData.uid)
                              tempNewDefaultAddressCal[d].breakfastCalories += Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
                            }
                            if (changeLunchAddress.includes(tempNewDefaultAddressCal[d].date)) {
                              tempNewDefaultAddressCal[d].lunchMembers.push(state.userData.uid)
                              tempNewDefaultAddressCal[d].lunchCalories += Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
                            }
                            if (changeDinnerAddress.includes(tempNewDefaultAddressCal[d].date)) {
                              tempNewDefaultAddressCal[d].dinnerMembers.push(state.userData.uid)
                              tempNewDefaultAddressCal[d].dinnerCalories += Number(JSON.parse(JSON.stringify(state.userData.info.calories)))
                            }
                            db.collection('addresses').doc(newDefault).collection('calendar').doc(tempNewDefaultAddressCal[d].date.toString()).set(tempNewDefaultAddressCal[d])
                          }
                        })
                    })
                })
            })
        })
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
      if (state.userData.uid !== 'default') {
        for (let d = 0; d < state.userData.calendar.length; d++) {
          db.collection('users').doc(state.userData.uid).collection('calendar').doc(state.userData.calendar[d].date.toString())
            .set(state.userData.calendar[d])
        }
      }
      const calendarRef = db.collection('users').doc(state.userData.uid).collection('calendar')
      state.userData.calendar = []
      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
      state.currentYearMonth = moment(state.start).format('YYYYMM')
      state.currentYear = moment(state.start).format('YYYY')
      calendarRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date')
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            state.userData.calendar.push(doc.data())
          })
        })
    },
    nextWeek (state) {
      if (state.userData.calendar.length !== 0) {
        if (state.userData.uid !== 'default') {
          for (let d = 0; d < state.userData.calendar.length; d++) {
            db.collection('users').doc(state.userData.uid).collection('calendar').doc(state.userData.calendar[d].date.toString())
              .set(state.userData.calendar[d])
          }
        }
        const calendarRef = db.collection('users').doc(state.userData.uid).collection('calendar')
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
        if (state.userData.uid !== 'default') {
          for (let d = 0; d < state.userData.calendar.length; d++) {
            db.collection('users').doc(state.userData.uid).collection('calendar').doc(state.userData.calendar[d].date.toString())
              .set(state.userData.calendar[d])
          }
        }
        const calendarRef = db.collection('users').doc(state.userData.uid).collection('calendar')
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
        if (state.userData.recipies.length + 1 < 10) {
          state.meal.id = `0${state.userData.recipies.length + 1}`
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
        for (let f = 0; f < state.userData.filters.length; f++) {
          if (state.userData.filters[f].isActive) {
            state.meal.tags.push(state.userData.filters[f].text)
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
      state.userData.filters.push(newObject)
      document.getElementById('newFilter').focus()
    },
    deleteFilter (state, tag) {
      for (let f = 0; f < state.userData.filters.length; f++) {
        if (state.userData.filters[f].text === tag.text) {
          state.userData.filters.splice(f, 1)
        }
      }
    },
    addPlace (state, newPlace) {
      const currentYear = moment().format('YYYY')
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
        uid: '',
        members: [{
          email: state.userData.email,
          role: 'Owner',
          uid: state.userData.uid
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
          db.collection('users').doc(state.userData.uid).set(state.userData)
          db.collection('addresses').doc(docRef.id).update({
            uid: docRef.id
          })
          // getData without checking userData.months ()
          const dataRef = db.collection('users').doc(state.userData.uid)
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
                          const calRef = db.collection('users').doc(state.userData.uid).collection('calendar')
                          calRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
                            .then(function (querySnapshot) {
                              querySnapshot.forEach((doc) => {
                                state.userData.calendar.push(doc.data())
                              })
                            })
                          state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                          const calAddressRef = db.collection('addresses').doc(state.userData.addresses[a].address).collection('calendar')
                          calAddressRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.userData.shoppingListLength, 'days').format('YYYYMMDD'))).orderBy('date').get()
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
        const address = state.userAddresses[index].address
        var Owner = false
        for (let m = 0; m < state.userAddresses[index].members.length; m++) {
          if (state.userAddresses[index].members[m].role === 'Owner' && state.userAddresses[index].members[m].uid === state.userData.uid) {
            Owner = true
          }
        }
        if (Owner) {
          new Promise(function (resolve, reject) {
            for (let m = 0; m < state.userAddresses[index].members.length; m++) {
              const docRef = db.collection('users').doc(state.userAddresses[index].members[m].uid)
              var tempData = ''
              docRef.get()
                .then((doc) => {
                  if (doc.exists) {
                    new Promise(function (resolve, reject) {
                      tempData = doc.data()
                      resolve()
                    })
                      .then(function () {
                        // Deletes the address out of the addressess record.
                        for (let a = 0; a < tempData.addresses.length; a++) {
                          if (tempData.addresses[a].address === address) {
                            tempData.addresses.splice(a, 1)
                          }
                        }
                        docRef.set(tempData)
                      })
                  }
                })
            }
            resolve()
          })
            .then(function () {
              db.collection('addresses').doc(address).delete()
              state.userAddresses.splice(index, 1)
              state.userData.addresses.splice(index, 1)
            })
        } else {
          state.userData.addresses.splice(index, 1)
          for (let m = 0; m < state.userAddresses[index].members.length; m++) {
            if (state.userAddresses[index].members[m].uid === state.userData.uid) {
              state.userAddresses[index].members.splice(m, 1)
            }
          }
        }
      }
    },
    deleteAccount (state, user) {
      if (confirm('Are you sure you want to delete your account permanenently? All owned places will also be deleted.')) {
        for (let index = 0; index < state.userData.addresses.length; index++) {
          const address = state.userAddresses[index].address
          var Owner = false
          for (let m = 0; m < state.userAddresses[index].members.length; m++) {
            if (state.userAddresses[index].members[m].role === 'Owner' && state.userAddresses[index].members[m].uid === state.userData.uid) {
              Owner = true
            }
          }
          if (Owner) {
            new Promise(function (resolve, reject) {
              for (let m = 0; m < state.userAddresses[index].members.length; m++) {
                const docRef = db.collection('users').doc(state.userAddresses[index].members[m].uid)
                var tempData = ''
                docRef.get()
                  .then((doc) => {
                    if (doc.exists) {
                      new Promise(function (resolve, reject) {
                        tempData = doc.data()
                        resolve()
                      })
                        .then(function () {
                          // Deletes the address out of the addressess record.
                          for (let a = 0; a < tempData.addresses.length; a++) {
                            if (tempData.addresses[a].address === address) {
                              tempData.addresses.splice(a, 1)
                            }
                          }
                          docRef.set(tempData)
                        })
                    }
                  })
              }
              resolve()
            })
              .then(function () {
                db.collection('addresses').doc(address).delete()
                state.userAddresses.splice(index, 1)
                state.userData.addresses.splice(index, 1)
              })
          } else {
            state.userData.addresses.splice(index, 1)
            for (let m = 0; m < state.userAddresses[index].members.length; m++) {
              if (state.userAddresses[index].members[m].uid === state.userData.uid) {
                state.userAddresses[index].members.splice(m, 1)
              }
            }
          }
        }
        const obj = JSON.parse(JSON.stringify(user))
        db.collection('users').doc(obj.uid).delete()
        user.delete()
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
      if (state.userData.uid !== 'default') {
        for (let d = 0; d < state.userData.calendar.length; d++) {
          db.collection('users').doc(state.userData.uid).collection('calendar').doc(state.userData.calendar[d].date.toString())
            .set(state.userData.calendar[d])
        }
        state.userData.calendar = []
        db.collection('users').doc(state.userData.uid).set(state.userData)
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
      const docRef = db.collection('users').doc(state.userData.uid)
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
                      for (var month = 0; month < 12; month++) {
                        if (!state.userData.months.includes(moment().add(month, 'months').format('YYYYMM'))) {
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
                            db.collection('users').doc(state.userData.uid).collection('calendar').doc(docName)
                              .set(dayTemplate)
                          }
                          state.userData.months.push(moment().add(month, 'months').format('YYYYMM'))
                        }
                      }
                      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                      const calRef = db.collection('users').doc(state.userData.uid).collection('calendar')
                      calRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date').get()
                        .then(function (querySnapshot) {
                          querySnapshot.forEach((doc) => {
                            state.userData.calendar.push(doc.data())
                          })
                        })
                      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
                      const calAddressRef = db.collection('addresses').doc(state.userData.addresses[a].address).collection('calendar')
                      calAddressRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.userData.shoppingListLength, 'days').format('YYYYMMDD'))).orderBy('date').get()
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
    createDefaultUser (state) {
      db.collection('addresses').add({
        uid: '',
        personalList: [],
        shoppingList: [],
        calendar: [],
        members: [],
        months: []
      })
        .then(function (address) {
          db.collection('addresses').doc(address.id).update({
            uid: address.id
          })
          db.collection('addresses').doc(address.id).collection('members').doc('default').set({
            email: 'default',
            role: 'Owner',
            uid: 'default'
          })
          db.collection('addresses').doc(address.id).collection('calendar').doc('default').set({
            placeholder: 'default'
          })
          var batchAddress = db.batch()
          for (let y = 0; y < 2; y++) {
            for (let m = 0; m < 12; m++) {
              var yearCurrent = moment().format('YYYY')
              var monthVar = moment().year(Number(yearCurrent)).month(m).add(y, 'years').format('YYYYMM')
              var monthTemplate = {
                month: moment().year(Number(yearCurrent)).month(m).add(y, 'years').format('YYYYMM'),
                display: moment().year(Number(yearCurrent)).month(m).add(y, 'years').format('MMM'),
                isActive: false,
                isPurchased: false
              }
              const docRef = db.collection('addresses').doc(address.id).collection('months').doc(monthVar)
              batchAddress.set(docRef, monthTemplate)
            }
          }
          batchAddress.commit()
          db.collection('users').doc('default').set({
            email: 'default',
            uid: 'default',
            shoppingListLength: 7,
            calories: 2000,
            role: 'customer',
            months: [],
            calendar: [],
            addresses: [],
            mealplans: []
          })
          db.collection('users').doc('default').collection('mealplans').add({
            name: 'Personal',
            isActive: true,
            recipies: [],
            filters: [],
            uid: ''
          })
            .then(function (mealplan) {
              db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).update({
                uid: mealplan.id
              })
              db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('filters').add({
                text: 'Breakfast',
                isActive: false,
                uid: ''
              })
                .then(function (filter) {
                  db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('filters').doc(filter.id).update({
                    uid: filter.id
                  })
                })
              db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('filters').add({
                text: 'Lunch',
                isActive: false,
                uid: ''
              })
                .then(function (filter) {
                  db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('filters').doc(filter.id).update({
                    uid: filter.id
                  })
                })
              db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('filters').add({
                text: 'Dinner',
                isActive: false,
                uid: ''
              })
                .then(function (filter) {
                  db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('filters').doc(filter.id).update({
                    uid: filter.id
                  })
                })
              db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('recipies').add({
                name: 'Banana Smoothie',
                id: '01',
                ingredients: [],
                uid: '',
                tags: [
                  'Breakfast'
                ]
              })
                .then(function (recipe) {
                  db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('recipies').doc(recipe.id).update({
                    uid: recipe.id
                  })
                  db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('recipies').doc(recipe.id).collection('ingredients').add({
                    ingredient: 'Milk',
                    amount: 200,
                    unit: 'g',
                    isActive: false,
                    isPurchased: false,
                    uid: ''
                  })
                    .then(function (ingredient) {
                      db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('recipies').doc(recipe.id).collection('ingredients').doc(ingredient.id).update({
                        uid: ingredient.id
                      })
                    })
                  db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('recipies').doc(recipe.id).collection('ingredients').add({
                    ingredient: 'Banana',
                    amount: 1,
                    unit: 'medium',
                    isActive: false,
                    isPurchased: false,
                    uid: ''
                  })
                    .then(function (ingredient) {
                      db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('recipies').doc(recipe.id).collection('ingredients').doc(ingredient.id).update({
                        uid: ingredient.id
                      })
                    })
                })
            })
          db.collection('users').doc('default').collection('addresses').doc(address.id).set({
            name: 'Home',
            isActive: true,
            isDefault: true,
            uid: address.id
          })
          var months = []
          var batchUser = db.batch()
          for (var month = 0; month < 12; month++) {
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
                day: moment().year(year).month(mon).subtract(1, 'M')
                  .startOf('month')
                  .add(d, 'day')
                  .format('DD'),
                dayname: moment().isoWeekday(moment().year(year).month(mon).subtract(1, 'M')
                  .date(day)
                  .weekday()).format('dddd'),
                breakfast: 'Breakfast',
                breakfastLocation: 'Home',
                breakfastAddress: address.id,
                lunch: 'Lunch',
                lunchLocation: 'Home',
                lunchAddress: address.id,
                dinner: 'Dinner',
                dinnerLocation: 'Home',
                dinnerAddress: address.id
              }
              const docRef = db.collection('users').doc('default').collection('calendar').doc(docName)
              batchUser.set(docRef, dayTemplate)
            }
            months.push(moment().year(year).month(mon).subtract(1, 'M').format('YYYYMM'))
          }
          batchUser.commit()
          db.collection('users').doc('default').update({
            months: months
          })
        })
    },
    createUser (state, user) {
      const object = JSON.parse(JSON.stringify(user))
      db.collection('addresses').add({
        uid: '',
        personalList: [],
        shoppingList: [],
        calendar: [],
        members: [],
        months: []
      })
        .then(function (address) {
          db.collection('addresses').doc(address.id).update({
            uid: address.id
          })
          db.collection('addresses').doc(address.id).collection('members').doc(object.user.uid).set({
            email: object.user.email,
            role: 'Owner',
            userID: object.user.uid
          })
          db.collection('addresses').doc(address.id).collection('calendar').doc('default').set({
            placeholder: 'default'
          })
          var batchAddress = db.batch()
          for (let y = 0; y < 2; y++) {
            for (let m = 0; m < 12; m++) {
              var yearCurrent = moment().format('YYYY')
              var monthVar = moment().year(Number(yearCurrent)).month(m).add(y, 'years').format('YYYYMM')
              var monthTemplate = {
                month: moment().year(Number(yearCurrent)).month(m).add(y, 'years').format('YYYYMM'),
                display: moment().year(Number(yearCurrent)).month(m).add(y, 'years').format('MMM'),
                isActive: false,
                isPurchased: false
              }
              const docRef = db.collection('addresses').doc(address.id).collection('months').doc(monthVar)
              batchAddress.set(docRef, monthTemplate)
            }
          }
          batchAddress.commit()
          db.collection('users').doc(object.user.uid).set({
            email: object.user.email,
            uid: object.user.uid,
            shoppingListLength: 7,
            calories: 2000,
            role: 'customer',
            months: [],
            calendar: [],
            addresses: [],
            mealplans: []
          })
          db.collection('users').doc(object.user.uid).collection('mealplans').add({
            name: 'Personal',
            isActive: true,
            recipies: [],
            filters: [],
            uid: ''
          })
            .then(function (mealplan) {
              db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).update({
                uid: mealplan.id
              })
              db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('filters').add({
                text: 'Breakfast',
                isActive: false,
                uid: ''
              })
                .then(function (filter) {
                  db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('filters').doc(filter.id).update({
                    uid: filter.id
                  })
                })
              db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('filters').add({
                text: 'Lunch',
                isActive: false,
                uid: ''
              })
                .then(function (filter) {
                  db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('filters').doc(filter.id).update({
                    uid: filter.id
                  })
                })
              db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('filters').add({
                text: 'Dinner',
                isActive: false,
                uid: ''
              })
                .then(function (filter) {
                  db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('filters').doc(filter.id).update({
                    uid: filter.id
                  })
                })
              db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('recipies').add({
                name: 'Banana Smoothie',
                id: '01',
                ingredients: [],
                uid: '',
                tags: [
                  'Breakfast'
                ]
              })
                .then(function (recipe) {
                  db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('recipies').doc(recipe.id).update({
                    uid: recipe.id
                  })
                  db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('recipies').doc(recipe.id).collection('ingredients').add({
                    ingredient: 'Milk',
                    amount: 200,
                    unit: 'g',
                    isActive: false,
                    isPurchased: false,
                    uid: ''
                  })
                    .then(function (ingredient) {
                      db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('recipies').doc(recipe.id).collection('ingredients').doc(ingredient.id).update({
                        uid: ingredient.id
                      })
                    })
                  db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('recipies').doc(recipe.id).collection('ingredients').add({
                    ingredient: 'Banana',
                    amount: 1,
                    unit: 'medium',
                    isActive: false,
                    isPurchased: false,
                    uid: ''
                  })
                    .then(function (ingredient) {
                      db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('recipies').doc(recipe.id).collection('ingredients').doc(ingredient.id).update({
                        uid: ingredient.id
                      })
                    })
                })
            })
          db.collection('users').doc(object.user.uid).collection('addresses').doc(address.id).set({
            name: 'Home',
            isActive: true,
            isDefault: true,
            uid: address.id
          })
          var months = []
          var batchUser = db.batch()
          for (var month = 0; month < 12; month++) {
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
                day: moment().year(year).month(mon).subtract(1, 'M')
                  .startOf('month')
                  .add(d, 'day')
                  .format('DD'),
                dayname: moment().isoWeekday(moment().year(year).month(mon).subtract(1, 'M')
                  .date(day)
                  .weekday()).format('dddd'),
                breakfast: 'Breakfast',
                breakfastLocation: 'Home',
                breakfastAddress: address.id,
                lunch: 'Lunch',
                lunchLocation: 'Home',
                lunchAddress: address.id,
                dinner: 'Dinner',
                dinnerLocation: 'Home',
                dinnerAddress: address.id
              }
              const docRef = db.collection('users').doc(object.user.uid).collection('calendar').doc(docName)
              batchUser.set(docRef, dayTemplate)
            }
            months.push(moment().year(year).month(mon).subtract(1, 'M').format('YYYYMM'))
          }
          batchUser.commit()
          db.collection('users').doc(object.user.uid).update({
            months: months
          })
          if (object.user.emailVerified === false) {
            firebase.auth().useDeviceLanguage()
            firebase.auth().currentUser.sendEmailVerification()
              .then(function () {
                alert('Verification email sent. Please verify your email address and then log in.')
                firebase.auth().signOut()
                  .then(function () {
                    // Sign-out successful.
                    router.push('/login')
                  })
                  .catch(function (error) {
                    // An error happened.
                    alert(error.code, ': ', error)
                  })
              })
          } else {
            router.push('/calendar')
          }
        })
    },
    getUserData (state, userData) {
      state.userData = userData
    },
    emptyUserDataAddresses (state) {
      state.userData.addresses.length = 0
    },
    pushUserDataAddress (state, userDataAddress) {
      state.userData.addresses.push(userDataAddress)
    },
    emptyUserAddresses (state) {
      state.userAddresses.length = 0
    },
    pushUserAddress (state, userAddress) {
      state.userAddresses.push(userAddress)
    },
    emptyUserAddressMembers (state, addressID) {
      for (var userAddress in state.userAddresses) {
        if (state.userAddresses[userAddress].uid === addressID) {
          state.userAddresses[userAddress].members.length = 0
        }
      }
    },
    pushUserAddressMember (state, { userAddressMember, addressID }) {
      for (var userAddress in state.userAddresses) {
        if (state.userAddresses[userAddress].uid === addressID) {
          state.userAddresses[userAddress].members.push(userAddressMember)
        }
      }
    },
    emptyUserAddressMonths (state, addressID) {
      for (var userAddress in state.userAddresses) {
        if (state.userAddresses[userAddress].uid === addressID) {
          state.userAddresses[userAddress].months.length = 0
        }
      }
    },
    pushUserAddressMonth (state, { userAddressMonth, addressID }) {
      for (var userAddress in state.userAddresses) {
        if (state.userAddresses[userAddress].uid === addressID) {
          state.userAddresses[userAddress].months.push(userAddressMonth)
        }
      }
    },
    emptyUserDataCalendar (state) {
      state.userData.calendar.length = 0
    },
    pushUserDataCalendar (state, userDataCalendar) {
      state.userData.calendar.push(userDataCalendar)
    },
    emptyUserDataMealplans (state) {
      state.userData.mealplans.length = 0
    },
    pushUserDataMealplan (state, userDataMealplan) {
      state.userData.mealplans.push(userDataMealplan)
    },
    emptyUserDataMealplanFilters (state, mealplanID) {
      for (var mealplan in state.userData.mealplans) {
        if (state.userData.mealplans[mealplan].uid === mealplanID) {
          state.userData.mealplans[mealplan].filters.length = 0
        }
      }
    },
    pushUserDataMealplanFilter (state, { userDataMealplanFilter, mealplanID }) {
      for (var mealplan in state.userData.mealplans) {
        if (state.userData.mealplans[mealplan].uid === mealplanID) {
          state.userData.mealplans[mealplan].filters.push(userDataMealplanFilter)
        }
      }
    },
    emptyUserDataMealplanRecipies (state, mealplanID) {
      for (var mealplan in state.userData.mealplans) {
        if (state.userData.mealplans[mealplan].uid === mealplanID) {
          state.userData.mealplans[mealplan].recipies.length = 0
        }
      }
    },
    pushUserDataMealplanRecipe (state, { userDataMealplanRecipe, mealplanID }) {
      for (var mealplan in state.userData.mealplans) {
        if (state.userData.mealplans[mealplan].uid === mealplanID) {
          state.userData.mealplans[mealplan].recipies.push(userDataMealplanRecipe)
        }
      }
    },
    emptyUserDataMealplanRecipeIngredients (state, { mealplanID, recipeID }) {
      for (var mealplan in state.userData.mealplans) {
        if (state.userData.mealplans[mealplan].uid === mealplanID) {
          for (var recipe in state.userData.mealplans[mealplan].recipies) {
            if (state.userData.mealplans[mealplan].recipies[recipe].uid === recipeID) {
              state.userData.mealplans[mealplan].recipies[recipe].ingredients.length = 0
            }
          }
        }
      }
    },
    pushUserDataMealplanRecipeIngredient (state, { userDataMealplanRecipeIngredient, mealplanID, recipeID }) {
      for (var mealplan in state.userData.mealplans) {
        if (state.userData.mealplans[mealplan].uid === mealplanID) {
          for (var recipe in state.userData.mealplans[mealplan].recipies) {
            if (state.userData.mealplans[mealplan].recipies[recipe].uid === recipeID) {
              state.userData.mealplans[mealplan].recipies[recipe].ingredients.push(userDataMealplanRecipeIngredient)
            }
          }
        }
      }
    }
  }
})
