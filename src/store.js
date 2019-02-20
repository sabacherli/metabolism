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
      meal: '',
      address: '',
      location: '',
      index: ''
    },
    editor: {
      index: null
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
    newRecipe: {
      id: null,
      name: null,
      ingredients: [],
      tags: [],
      uid: ''
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
      isPurchased: false,
      uid: ''
    },
    // listMonths: [],
    // listMonthsDefault: [],
    tempCal: []
  },
  mutations: {
    syncMealName (state, name) {
      state.newRecipe.name = name
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
    setEditor (state, recipe) {
      state.editor.index = state.userData.mealplans[0].recipies.indexOf(recipe)
      router.push('/edit')
    },
    resetPointer (state) {
      state.pointer.meal = ''
      state.pointer.doc = ''
    },
    setEditFilters (state) {
      for (let t = 0; t < state.userData.mealplans[0].filters.length; t++) {
        state.userData.mealplans[0].filters[t].isActive = false
      }
      for (let f = 0; f < state.userData.mealplans[0].recipies.length; f++) {
        if (state.userData.mealplans[0].recipies[f].id === state.editor.id) {
          for (let t = 0; t < state.userData.mealplans[0].filters.length; t++) {
            for (let tag = 0; tag < state.userData.mealplans[0].recipies[f].tags.length; tag++) {
              if (state.userData.mealplans[0].recipies[f].tags[tag] === state.userData.mealplans[0].filters[t].text) {
                state.userData.mealplans[0].filters[t].isActive = true
              }
            }
          }
        }
      }
    },
    setProfileFilters (state) {
      for (var filter in state.profileFilters) {
        if (state.profileFilters[filter].text === 'Months') {
          state.profileFilters[filter].isActive = true
        } else {
          state.profileFilters[filter].isActive = false
        }
      }
    },
    changeFilters (state) {
      for (let f = 0; f < state.userData.mealplans[0].recipies.length; f++) {
        if (state.userData.mealplans[0].recipies[f].uniqueID === state.editor.uniqueID) {
          // parameters in splice should probably be switched around
          state.userData.mealplans[0].recipies[f].tags.splice(0, state.userData.mealplans[0].recipies[f].tags.length)
          for (let t = 0; t < state.userData.mealplans[0].filters.length; t++) {
            if (state.userData.mealplans[0].filters[t].isActive) {
              state.userData.mealplans[0].recipies[f].tags.push(state.userData.mealplans[0].filters[t].text)
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
              db.collection('addresses').doc(state.userData.addresses[index].uid).collection('calendar').doc(docName)
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
              db.collection('addresses').doc(state.userData.addresses[index].uid).collection('calendar').doc(docName)
                .set(dayTemplate)
            }
          }
          db.collection('addresses').doc(state.userAddresses[index].uid).collection('months').doc(state.userAddresses[index].months[month].month).update({
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
      state.pointer.doc = day.date
      state.pointer.meal = 'Breakfast'
      for (var address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          state.pointer.address = state.userData.addresses[address].uid
          state.pointer.location = state.userData.addresses[address].name
          state.pointer.index = address
        }
      }
      // set filters appropriately
      for (var filter in state.userData.mealplans[0].filters) {
        if (state.userData.mealplans[0].filters[filter].text === 'Breakfast') {
          state.userData.mealplans[0].filters[filter].isActive = true
        } else {
          state.userData.mealplans[0].filters[filter].isActive = false
        }
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').doc(day.date.toString()).update({
        breakfastAddress: state.pointer.address,
        breakfastLocation: state.pointer.location
      })
      var isMember = false
      var newCalories = null
      var date = day.date.toString()
      for (var object in state.userAddresses[state.pointer.index].calendar) {
        if (state.userAddresses[state.pointer.index].calendar[object].date === day.date) {
          if (state.userAddresses[state.pointer.index].calendar[object].breakfastMembers.includes(state.userData.uid)) {
            isMember = true
            newCalories = state.userData.calories + state.userAddresses[state.pointer.index].calendar[object].breakfastCalories
          }
        }
      }
      if (isMember === false) {
        db.collection('users').doc(state.userData.uid).collection('calendar').doc(date).update({
          breakfastMembers: firebase.firestore.FieldValue.arrayUnion(state.userData.uid),
          breakfastCalories: newCalories
        })
      }
    },
    setLunch (state, day) {
      state.pointer.doc = day.date
      state.pointer.meal = 'Lunch'
      for (var address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          state.pointer.address = state.userData.addresses[address].uid
          state.pointer.location = state.userData.addresses[address].name
          state.pointer.index = address
        }
      }
      // set filters appropriately
      for (var filter in state.userData.mealplans[0].filters) {
        if (state.userData.mealplans[0].filters[filter].text === 'Lunch') {
          state.userData.mealplans[0].filters[filter].isActive = true
        } else {
          state.userData.mealplans[0].filters[filter].isActive = false
        }
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').doc(day.date.toString()).update({
        lunchAddress: state.pointer.address,
        lunchLocation: state.pointer.location
      })
      var isMember = false
      var newCalories = null
      var date = day.date.toString()
      for (var object in state.userAddresses[state.pointer.index].calendar) {
        if (state.userAddresses[state.pointer.index].calendar[object].date === day.date) {
          if (state.userAddresses[state.pointer.index].calendar[object].lunchMembers.includes(state.userData.uid)) {
            isMember = true
            newCalories = state.userData.calories + state.userAddresses[state.pointer.index].calendar[object].lunchCalories
          }
        }
      }
      if (isMember === false) {
        db.collection('users').doc(state.userData.uid).collection('calendar').doc(date).update({
          lunchMembers: firebase.firestore.FieldValue.arrayUnion(state.userData.uid),
          lunchCalories: newCalories
        })
      }
    },
    setDinner (state, day) {
      state.pointer.doc = day.date
      state.pointer.meal = 'Dinner'
      for (var address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          state.pointer.address = state.userData.addresses[address].uid
          state.pointer.location = state.userData.addresses[address].name
          state.pointer.index = address
        }
      }
      // set filters appropriately
      for (var filter in state.userData.mealplans[0].filters) {
        if (state.userData.mealplans[0].filters[filter].text === 'Dinner') {
          state.userData.mealplans[0].filters[filter].isActive = true
        } else {
          state.userData.mealplans[0].filters[filter].isActive = false
        }
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').doc(day.date.toString()).update({
        dinnerAddress: state.pointer.address,
        dinnerLocation: state.pointer.location
      })
      var isMember = false
      var newCalories = null
      var date = day.date.toString()
      for (var object in state.userAddresses[state.pointer.index].calendar) {
        if (state.userAddresses[state.pointer.index].calendar[object].date === day.date) {
          if (state.userAddresses[state.pointer.index].calendar[object].dinnerMembers.includes(state.userData.uid)) {
            isMember = true
            newCalories = state.userData.calories + state.userAddresses[state.pointer.index].calendar[object].dinnerCalories
          }
        }
      }
      if (isMember === false) {
        db.collection('users').doc(state.userData.uid).collection('calendar').doc(date).update({
          dinnerMembers: firebase.firestore.FieldValue.arrayUnion(state.userData.uid),
          dinnerCalories: newCalories
        })
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
    editFilter (state, filter) {
      if (filter.isActive) {
        db.collection('users').doc(state.userData.uid).collection('mealplans').doc(state.userData.mealplans[0].uid).collection('recipies').doc(state.userData.mealplans[0].recipies[state.editor.index].uid).update({
          tags: firebase.firestore.FieldValue.arrayRemove(filter.text)
        })
      } else {
        db.collection('users').doc(state.userData.uid).collection('mealplans').doc(state.userData.mealplans[0].uid).collection('recipies').doc(state.userData.mealplans[0].recipies[state.editor.index].uid).update({
          tags: firebase.firestore.FieldValue.arrayUnion(filter.text)
        })
      }
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
      const calendarRef = db.collection('users').doc(state.userData.uid).collection('calendar')
      state.userData.calendar.length = 0
      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
      state.currentYearMonth = moment(state.start).format('YYYYMM')
      state.currentYear = moment(state.start).format('YYYY')
      calendarRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            state.userData.calendar.push(doc.data())
          })
          state.start = state.start.subtract(state.displayAmount, 'days')
          for (var address in state.userAddresses) {
            const calendarRef2 = db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar')
            state.userAddresses[address].calendar = []
            state.currentYearMonth = moment(state.start).format('YYYYMM')
            state.currentYear = moment(state.start).format('YYYY')
            calendarRef2.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date')
              .get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  state.userAddresses[address].calendar.push(doc.data())
                })
              })
          }
        })
    },
    nextWeek (state) {
      const calendarRef = db.collection('users').doc(state.userData.uid).collection('calendar')
      state.userData.calendar = []
      state.currentYearMonth = moment(state.start).format('YYYYMM')
      state.currentYear = moment(state.start).format('YYYY')
      calendarRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            state.userData.calendar.push(doc.data())
          })
          state.start = state.start.subtract(state.displayAmount, 'days')
          for (var address in state.userAddresses) {
            const calendarRef2 = db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar')
            state.userAddresses[address].calendar = []
            state.currentYearMonth = moment(state.start).format('YYYYMM')
            state.currentYear = moment(state.start).format('YYYY')
            calendarRef2.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date')
              .get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  state.userAddresses[address].calendar.push(doc.data())
                })
              })
          }
        })
    },
    previousWeek (state) {
      const calendarRef = db.collection('users').doc(state.userData.uid).collection('calendar')
      state.userData.calendar = []
      state.start = state.start.subtract(2 * state.displayAmount, 'days')
      state.currentYearMonth = moment(state.start).format('YYYYMM')
      state.currentYear = moment(state.start).format('YYYY')
      calendarRef.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            state.userData.calendar.push(doc.data())
          })
          state.start = state.start.subtract(state.displayAmount, 'days')
          for (var address in state.userAddresses) {
            const calendarRef2 = db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar')
            state.userAddresses[address].calendar = []
            state.currentYearMonth = moment(state.start).format('YYYYMM')
            state.currentYear = moment(state.start).format('YYYY')
            calendarRef2.where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date')
              .get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  state.userAddresses[address].calendar.push(doc.data())
                })
              })
          }
        })
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
    addName (state, name) {
      state.newRecipe.name = name
    },
    pushIngredient (state, { ingredient, amount, unit }) {
      state.newRecipe.ingredients.push({
        ingredient: ingredient,
        amount: amount,
        unit: unit,
        isActive: false,
        isPurchased: false,
        uid: ''
      })
    },
    addRecipe (state) {
      if (state.userData.mealplans[0].recipies.length + 1 < 10) {
        state.newRecipe.id = `0${state.userData.mealplans[0].recipies.length + 1}`
      } else {
        state.newRecipe.id = state.userData.mealplans[0].recipies.length + 1
      }
      for (let f = 0; f < state.userData.mealplans[0].filters.length; f++) {
        if (state.userData.mealplans[0].filters[f].isActive) {
          state.newRecipe.tags.push(state.userData.mealplans[0].filters[f].text)
        }
      }
      db.collection('users').doc(state.userData.uid).collection('mealplans').doc(state.userData.mealplans[0].uid).collection('recipies').add({
        id: state.newRecipe.id,
        ingredients: [],
        name: state.newRecipe.name,
        tags: state.newRecipe.tags,
        uid: ''
      })
        .then(function (doc) {
          var recipeID = doc.id
          db.collection('users').doc(state.userData.uid).collection('mealplans').doc(state.userData.mealplans[0].uid).collection('recipies').doc(recipeID).update({
            uid: recipeID
          })
          for (var ingredient in state.newRecipe.ingredients) {
            db.collection('users').doc(state.userData.uid).collection('mealplans').doc(state.userData.mealplans[0].uid).collection('recipies').doc(recipeID).collection('ingredients').add({
              ingredient: state.newRecipe.ingredients[ingredient].ingredient,
              amount: state.newRecipe.ingredients[ingredient].amount,
              unit: state.newRecipe.ingredients[ingredient].unit,
              isActive: false,
              isPurchased: false,
              uid: ''
            })
              .then(function (doc) {
                db.collection('users').doc(state.userData.uid).collection('mealplans').doc(state.userData.mealplans[0].uid).collection('recipies').doc(recipeID).collection('ingredients').doc(doc.id).update({
                  uid: doc.id
                })
                state.newRecipe = {
                  id: null,
                  name: null,
                  ingredients: [],
                  tags: [],
                  uid: ''
                }
              })
          }
        })
    },
    addIngredient (state) {
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
        isPurchased: false,
        uid: ''
      }
      document.getElementById('newIngredient').focus()
    },
    addIngredient2 (state) {
      state.ingredientsList.ingredient = state.mealName
      state.ingredientsList.amount = state.newAmount
      state.ingredientsList.unit = state.newUnit
      for (let f = 0; f < state.userData.mealplans[0].recipies.length; f++) {
        if (state.userData.mealplans[0].recipies[f].id === state.editor.id) {
          if (state.ingredientsList.ingredient === null || state.ingredientsList.amount === null || state.ingredientsList.unit === null) {
            alert('Please fill in all fields before adding a new ingredient.')
          } else {
            state.userData.mealplans[0].recipies[f].ingredients.push(JSON.parse(JSON.stringify(state.ingredientsList)))
          }
        }
      }
      state.mealName = null
      state.newAmount = null
      state.newUnit = null
    },
    deleteIngredient (state, ingredient) {
      for (let f = 0; f < state.userData.mealplans[0].recipies.length; f++) {
        if (state.userData.mealplans[0].recipies[f].id === state.editor.id) {
          for (let i = 0; i < state.userData.mealplans[0].recipies[f].ingredients.length; i++) {
            if (state.userData.mealplans[0].recipies[f].ingredients[i].ingredient === ingredient.ingredient) {
              state.userData.mealplans[0].recipies[f].ingredients.splice(i, 1)
            }
          }
        }
      }
    },
    selectRecipe (state, recipe) {
      if (state.pointer.meal === 'Breakfast') {
        db.collection('users').doc(state.userData.uid).collection('calendar').doc(state.pointer.doc.toString()).update({
          breakfast: recipe.name
        })
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          breakfastCaloriesOwner: state.userData.calories,
          breakfastIngredients: recipe.ingredients
        })
      }
      if (state.pointer.meal === 'Lunch') {
        db.collection('users').doc(state.userData.uid).collection('calendar').doc(state.pointer.doc.toString()).update({
          lunch: recipe.name
        })
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          lunchCaloriesOwner: state.userData.calories,
          lunchIngredients: recipe.ingredients
        })
      }
      if (state.pointer.meal === 'Dinner') {
        db.collection('users').doc(state.userData.uid).collection('calendar').doc(state.pointer.doc.toString()).update({
          dinner: recipe.name
        })
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          dinnerCaloriesOwner: state.userData.calories,
          dinnerIngredients: recipe.ingredients
        })
      }
      // for (let i = 0; i < meal.ingredients.length; i++) {
      //   const ingredientObject = JSON.parse(JSON.stringify(meal.ingredients[i]))
      //   if (state.pointer.meal === 'breakfast') {
      //     state.userAddresses[state.pointer.address].calendar[state.pointer.doc].breakfastIngredients.push(ingredientObject)
      //   } else if (state.pointer.meal === 'lunch') {
      //     state.userAddresses[state.pointer.address].calendar[state.pointer.doc].lunchIngredients.push(ingredientObject)
      //   } else {
      //     state.userAddresses[state.pointer.address].calendar[state.pointer.doc].dinnerIngredients.push(ingredientObject)
      //   }
      // }
      // if (state.pointer.meal === 'breakfast') {
      //   state.userData.calendar[state.pointer.doc].breakfast = mealName
      //   state.userAddresses[state.pointer.address].calendar[state.pointer.doc].breakfast = mealName
      //   state.userData.calendar[state.pointer.doc].breakfastID = mealID
      //   state.userAddresses[state.pointer.address].calendar[state.pointer.doc].breakfastID = mealID
      //   Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'breakfastCaloriesOwner', state.userData.info.calories)
      // } else if (state.pointer.meal === 'lunch') {
      //   state.userData.calendar[state.pointer.doc].lunch = mealName
      //   state.userAddresses[state.pointer.address].calendar[state.pointer.doc].lunch = mealName
      //   state.userData.calendar[state.pointer.doc].lunchID = mealID
      //   state.userAddresses[state.pointer.address].calendar[state.pointer.doc].lunchID = mealID
      //   Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'lunchCaloriesOwner', state.userData.info.calories)
      // } else {
      //   state.userData.calendar[state.pointer.doc].dinner = mealName
      //   state.userAddresses[state.pointer.address].calendar[state.pointer.doc].dinner = mealName
      //   state.userData.calendar[state.pointer.doc].dinnerID = mealID
      //   state.userAddresses[state.pointer.address].calendar[state.pointer.doc].dinnerID = mealID
      //   Vue.set(state.userAddresses[state.pointer.address].calendar[state.pointer.doc], 'dinnerCaloriesOwner', state.userData.info.calories)
      // }
    },
    removeMeal (state) {
      if (state.pointer.meal === 'Breakfast') {
        db.collection('users').doc(state.userData.uid).collection('calendar').doc(state.pointer.doc.toString()).update({
          breakfast: 'Breakfast'
        })
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          breakfastCaloriesOwner: null,
          breakfastIngredients: []
        })
      }
      if (state.pointer.meal === 'Lunch') {
        db.collection('users').doc(state.userData.uid).collection('calendar').doc(state.pointer.doc.toString()).update({
          lunch: 'Lunch'
        })
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          lunchCaloriesOwner: null,
          lunchIngredients: []
        })
      }
      if (state.pointer.meal === 'Dinner') {
        db.collection('users').doc(state.userData.uid).collection('calendar').doc(state.pointer.doc.toString()).update({
          dinner: 'Dinner'
        })
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          dinnerCaloriesOwner: null,
          dinnerIngredients: []
        })
      }
    },
    deleteMeal (state) {
      for (let f = 0; f < state.userData.mealplans[0].recipies.length; f++) {
        if (state.userData.mealplans[0].recipies[f].id === state.editor.id) {
          state.userData.mealplans[0].recipies.splice(f, 1)
        }
      }
      for (let f = 0; f < state.userData.mealplans[0].recipies.length; f++) {
        if (f + 1 < 10) {
          var singleDigit = f + 1
          state.userData.mealplans[0].recipies[f].id = `0${singleDigit}`
        } else {
          state.userData.mealplans[0].recipies[f].id = singleDigit.toString()
        }
      }
    },
    addFilter (state, newFilter) {
      const newObject = {
        text: '',
        isActive: false
      }
      newObject.text = newFilter
      state.userData.mealplans[0].filters.push(newObject)
      document.getElementById('newFilter').focus()
    },
    deleteFilter (state, tag) {
      for (let f = 0; f < state.userData.mealplans[0].filters.length; f++) {
        if (state.userData.mealplans[0].filters[f].text === tag.text) {
          state.userData.mealplans[0].filters.splice(f, 1)
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
