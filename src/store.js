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
    popularMealplans: [],
    mealplansSelected: [],
    newIngredient: null,
    newAmount: null,
    newUnit: null,
    currentPage: 'calendar',
    price: 0,
    totalPrice: 0,
    rerender: 1,
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
      index: '',
      recipe: false
    },
    editor: {
      index: null,
      mealplan: null
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
      },
      {
        text: 'Meal Plans',
        isActive: false
      }
    ],
    informationFilters: [
      {
        text: 'FAQ',
        isActive: true
      },
      {
        text: 'Terms of Service',
        isActive: false
      },
      {
        text: 'Privacy Policy',
        isActive: false
      },
      {
        text: 'Contact',
        isActive: false
      }
    ],
    discoverFilters: [
      {
        text: 'Most Popular',
        isActive: true
      },
      {
        text: 'Search',
        isActive: false
      }
    ],
    searchedMealplan: null,
    calendarOptions: [
      {
        text: 'Menu',
        isActive: true
      },
      {
        text: 'Restaurant',
        isActive: false
      }//,
      // {
      //   text: 'Sports',
      //   isActive: false
      // }
    ],
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
    purchasedItems: 0
  },
  mutations: {
    rerender (state) {
      state.rerender = state.rerender * (-1)
    },
    // syncMealName (state, name) {
    //   state.newRecipe.name = name
    // },
    // syncIngredient (state, ingredient) {
    //   state.newIngredient = ingredient
    // },
    // syncAmount (state, amount) {
    //   state.newAmount = Number(amount)
    // },
    // syncUnit (state, unit) {
    //   state.newUnit = unit
    // },
    // syncUserEmail (state, email) {
    //   state.userData.email = email
    // },
    // syncShoppingListLength (state, days) {
    //   state.userData.shoppingListLength = days
    // },
    // syncCalories (state, calories) {
    //   state.userData.calories = calories
    // },
    // syncCurrentYearMonth (state, calories) {
    //   state.currentYearMonth = calories
    // },
    setEditor (state, recipe) {
      var m
      for (m in state.userData.mealplans) {
        if (state.userData.mealplans[m].isActive) {
          break
        }
      }
      state.editor.index = state.userData.mealplans[m].recipes.indexOf(recipe)
      state.editor.mealplan = m
      router.push('/edit')
    },
    resetPointer (state) {
      state.pointer.meal = null
      state.pointer.doc = ''
    },
    setEditFilters (state) {
      for (let t = 0; t < state.userData.mealplans[state.editor.mealplan].filters.length; t++) {
        state.userData.mealplans[state.editor.mealplan].filters[t].isActive = false
      }
      for (let t = 0; t < state.userData.mealplans[state.editor.mealplan].filters.length; t++) {
        for (let tag = 0; tag < state.userData.mealplans[state.editor.mealplan].recipes[state.editor.index].tags.length; tag++) {
          if (state.userData.mealplans[state.editor.mealplan].recipes[state.editor.index].tags[tag] === state.userData.mealplans[state.editor.mealplan].filters[t].text) {
            state.userData.mealplans[state.editor.mealplan].filters[t].isActive = true
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
    toggleIsActive (state, item) {
      item.isActive = !item.isActive
      if (item.isActive) {
        state.purchasedItems += 1
      } else {
        state.purchasedItems -= 1
      }
    },
    toggleSelected (state, month) {
      if (month.isPurchased === false) {
        month.isActive = !month.isActive
      }
    },
    toggleSelectedRegister (state, month) {
      if (Number(moment().format('YYYYMM')) <= Number(month.month)) {
        month.isActive = !month.isActive
      }
    },
    pushMealplanSelected (state, mealplan) {
      state.mealplansSelected.push(mealplan)
    },
    removeMealplanSelected (state, mealplan) {
      let index = state.mealplansSelected.indexOf(mealplan)
      state.mealplansSelected.splice(index, 1)
    },
    calcPrice (state, index) {
      state.price = 0
      for (var i = 0; i < state.userAddresses[index].months.length; i++) {
        if (state.userAddresses[index].months[i].isActive) {
          state.price += state.pricePerMonth
        }
      }
    },
    calcTotalPrice (state) {
      state.totalPrice = 0
      for (let mealplan in state.mealplansSelected) {
        state.totalPrice += state.mealplansSelected[mealplan].price
      }
      state.totalPrice += state.price
    },
    addMonths (state, index) {
      // eslint-disable-next-line
      // var stripe = Stripe('pk_test_eOIPf7mHX035HASoi8LrghW5', {
      //   betas: ['checkout_beta_4']
      // })
      // stripe.redirectToCheckout({
      //   items: [{
      //     sku: 'sku_ETuovBIeaLjPou', quantity: state.price / 5
      //   }],
        // Note that it is not guaranteed your customers will be redirected to this
        // URL *100%* of the time, it's possible that they could e.g. close the
        // tab between form submission and the redirect.
      //   successUrl: 'https://metabolism-salo.firebaseapp.com/profile',
      //   cancelUrl: 'https://metabolism-salo.firebaseapp.com/profile'
      // })
      //   .then(function (result) {
      //     if (result.error) {
      //       // If `redirectToCheckout` fails due to a browser or network
      //       // error, display the localized error message to your customer.
      //       alert(result.error.message)
      //     }
      //   })
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
                meal0CaloriesOwner: null,
                meal0Members: [],
                meal0Ingredients: [],
                meal1CaloriesOwner: null,
                meal1Members: [],
                meal1Ingredients: [],
                meal2CaloriesOwner: null,
                meal2Members: [],
                meal2Ingredients: [],
                meal3CaloriesOwner: null,
                meal3Members: [],
                meal3Ingredients: [],
                meal4CaloriesOwner: null,
                meal4Members: [],
                meal4Ingredients: [],
                meal5CaloriesOwner: null,
                meal5Members: [],
                meal5Ingredients: [],
                meal6CaloriesOwner: null,
                meal6Members: [],
                meal6Ingredients: [],
                meal7CaloriesOwner: null,
                meal7Members: [],
                meal7Ingredients: [],
                meal8CaloriesOwner: null,
                meal8Members: [],
                meal8Ingredients: [],
                meal9CaloriesOwner: null,
                meal9Members: [],
                meal9Ingredients: []
              }
              for (let meal in state.userData.meals) {
                if (state.userData.meals[meal].uid === '0' && state.userData.meals[meal].isActive) {
                  dayTemplate.meal0Members.push(state.userData.uid)
                }
                if (state.userData.meals[meal].uid === '1' && state.userData.meals[meal].isActive) {
                  dayTemplate.meal1Members.push(state.userData.uid)
                }
                if (state.userData.meals[meal].uid === '2' && state.userData.meals[meal].isActive) {
                  dayTemplate.meal2Members.push(state.userData.uid)
                }
                if (state.userData.meals[meal].uid === '3' && state.userData.meals[meal].isActive) {
                  dayTemplate.meal3Members.push(state.userData.uid)
                }
                if (state.userData.meals[meal].uid === '4' && state.userData.meals[meal].isActive) {
                  dayTemplate.meal4Members.push(state.userData.uid)
                }
                if (state.userData.meals[meal].uid === '5' && state.userData.meals[meal].isActive) {
                  dayTemplate.meal5Members.push(state.userData.uid)
                }
                if (state.userData.meals[meal].uid === '6' && state.userData.meals[meal].isActive) {
                  dayTemplate.meal6Members.push(state.userData.uid)
                }
                if (state.userData.meals[meal].uid === '7' && state.userData.meals[meal].isActive) {
                  dayTemplate.meal7Members.push(state.userData.uid)
                }
                if (state.userData.meals[meal].uid === '8' && state.userData.meals[meal].isActive) {
                  dayTemplate.meal8Members.push(state.userData.uid)
                }
                if (state.userData.meals[meal].uid === '9' && state.userData.meals[meal].isActive) {
                  dayTemplate.meal9Members.push(state.userData.uid)
                }
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
                meal0CaloriesOwner: null,
                meal0Members: [],
                meal0Ingredients: [],
                meal1CaloriesOwner: null,
                meal1Members: [],
                meal1Ingredients: [],
                meal2CaloriesOwner: null,
                meal2Members: [],
                meal2Ingredients: [],
                meal3CaloriesOwner: null,
                meal3Members: [],
                meal3Ingredients: [],
                meal4CaloriesOwner: null,
                meal4Members: [],
                meal4Ingredients: [],
                meal5CaloriesOwner: null,
                meal5Members: [],
                meal5Ingredients: [],
                meal6CaloriesOwner: null,
                meal6Members: [],
                meal6Ingredients: [],
                meal7CaloriesOwner: null,
                meal7Members: [],
                meal7Ingredients: [],
                meal8CaloriesOwner: null,
                meal8Members: [],
                meal8Ingredients: [],
                meal9CaloriesOwner: null,
                meal9Members: [],
                meal9Ingredients: []
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
    },
    setDefaultAddress (state, place) {
      for (let address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          db.collection('users').doc(state.userData.uid).collection('addresses').doc(state.userData.addresses[address].uid).update({
            isDefault: false
          })
        }
      }
      db.collection('users').doc(state.userData.uid).collection('addresses').doc(place.uid).update({
        isDefault: true
      })
      db.collection('users').doc(state.userData.uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD')))
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            db.collection('users').doc(state.userData.uid).collection('calendar').doc(doc.id).update({
              meal0Location: place.name,
              meal0Address: place.uid,
              meal1Location: place.name,
              meal1Address: place.uid,
              meal2Location: place.name,
              meal2Address: place.uid,
              meal3Location: place.name,
              meal3Address: place.uid,
              meal4Location: place.name,
              meal4Address: place.uid,
              meal5Location: place.name,
              meal5Address: place.uid,
              meal6Location: place.name,
              meal6Address: place.uid,
              meal7Location: place.name,
              meal7Address: place.uid,
              meal8Location: place.name,
              meal8Address: place.uid,
              meal9Location: place.name,
              meal9Address: place.uid
            })
          })
        })
      for (var address in state.userData.addresses) {
        db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD'))).where('meal0Members', 'array-contains', state.userData.uid)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                meal0Members: firebase.firestore.FieldValue.arrayRemove(state.userData.uid)
              })
            })
          })
        db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD'))).where('meal1Members', 'array-contains', state.userData.uid)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                meal1Members: firebase.firestore.FieldValue.arrayRemove(state.userData.uid)
              })
            })
          })
        db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD'))).where('meal2Members', 'array-contains', state.userData.uid)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                meal2Members: firebase.firestore.FieldValue.arrayRemove(state.userData.uid)
              })
            })
          })
        db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD'))).where('meal3Members', 'array-contains', state.userData.uid)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                meal3Members: firebase.firestore.FieldValue.arrayRemove(state.userData.uid)
              })
            })
          })
        db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD'))).where('meal4Members', 'array-contains', state.userData.uid)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                meal4Members: firebase.firestore.FieldValue.arrayRemove(state.userData.uid)
              })
            })
          })
        db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD'))).where('meal5Members', 'array-contains', state.userData.uid)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                meal5Members: firebase.firestore.FieldValue.arrayRemove(state.userData.uid)
              })
            })
          })
        db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD'))).where('meal6Members', 'array-contains', state.userData.uid)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                meal6Members: firebase.firestore.FieldValue.arrayRemove(state.userData.uid)
              })
            })
          })
        db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD'))).where('meal7Members', 'array-contains', state.userData.uid)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                meal7Members: firebase.firestore.FieldValue.arrayRemove(state.userData.uid)
              })
            })
          })
        db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD'))).where('meal8Members', 'array-contains', state.userData.uid)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                meal8Members: firebase.firestore.FieldValue.arrayRemove(state.userData.uid)
              })
            })
          })
        db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD'))).where('meal9Members', 'array-contains', state.userData.uid)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                meal9Members: firebase.firestore.FieldValue.arrayRemove(state.userData.uid)
              })
            })
          })
      }
      for (let meal in state.userData.meals) {
        if (state.userData.meals[meal].uid === '0' && state.userData.meals[meal].isActive) {
          db.collection('addresses').doc(place.uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD')))
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                  meal0Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
                })
              })
            })
        }
        if (state.userData.meals[meal].uid === '1' && state.userData.meals[meal].isActive) {
          db.collection('addresses').doc(place.uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD')))
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                  meal1Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
                })
              })
            })
        }
        if (state.userData.meals[meal].uid === '2' && state.userData.meals[meal].isActive) {
          db.collection('addresses').doc(place.uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD')))
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                  meal2Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
                })
              })
            })
        }
        if (state.userData.meals[meal].uid === '3' && state.userData.meals[meal].isActive) {
          db.collection('addresses').doc(place.uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD')))
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                  meal3Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
                })
              })
            })
        }
        if (state.userData.meals[meal].uid === '4' && state.userData.meals[meal].isActive) {
          db.collection('addresses').doc(place.uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD')))
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                  meal4Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
                })
              })
            })
        }
        if (state.userData.meals[meal].uid === '5' && state.userData.meals[meal].isActive) {
          db.collection('addresses').doc(place.uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD')))
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                  meal5Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
                })
              })
            })
        }
        if (state.userData.meals[meal].uid === '6' && state.userData.meals[meal].isActive) {
          db.collection('addresses').doc(place.uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD')))
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                  meal6Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
                })
              })
            })
        }
        if (state.userData.meals[meal].uid === '7' && state.userData.meals[meal].isActive) {
          db.collection('addresses').doc(place.uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD')))
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                  meal7Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
                })
              })
            })
        }
        if (state.userData.meals[meal].uid === '8' && state.userData.meals[meal].isActive) {
          db.collection('addresses').doc(place.uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD')))
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                  meal8Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
                })
              })
            })
        }
        if (state.userData.meals[meal].uid === '9' && state.userData.meals[meal].isActive) {
          db.collection('addresses').doc(place.uid).collection('calendar').where('date', '>=', Number(moment().format('YYYYMMDD')))
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                db.collection('addresses').doc(state.userData.addresses[address].uid).collection('calendar').doc(doc.id).update({
                  meal9Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
                })
              })
            })
        }
      }
    },
    toggleLocation (state, address) {
      for (let a = 0; a < state.userData.addresses.length; a++) {
        Vue.set(state.userData.addresses[a], 'isActive', false)
      }
      Vue.set(address, 'isActive', true)
    },
    toggleFilter (state, filter) {
      var check = JSON.parse(JSON.stringify(filter))
      if (check.isActive) {
        filter.isActive = !filter.isActive
        filter.isRequired = !filter.isRequired
      }
      if (check.isRequired) {
        filter.isRequired = !filter.isRequired
      }
      if (!check.isActive && !check.isRequired) {
        filter.isActive = !filter.isActive
      }
    },
    toggleCalendarOptions (state, option) {
      for (let o in state.calendarOptions) {
        state.calendarOptions[o].isActive = false
      }
      option.isActive = true
    },
    toggleProfileFilter (state, filter) {
      for (let p = 0; p < state.profileFilters.length; p++) {
        Vue.set(state.profileFilters[p], 'isActive', false)
      }
      Vue.set(filter, 'isActive', true)
    },
    toggleInformationFilter (state, filter) {
      for (let p = 0; p < state.informationFilters.length; p++) {
        Vue.set(state.informationFilters[p], 'isActive', false)
      }
      Vue.set(filter, 'isActive', true)
    },
    toggleDiscoverFilter (state, filter) {
      for (let p = 0; p < state.discoverFilters.length; p++) {
        Vue.set(state.discoverFilters[p], 'isActive', false)
      }
      Vue.set(filter, 'isActive', true)
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
      var m
      for (m in state.userData.mealplans) {
        if (state.userData.mealplans[m].isActive) {
          break
        }
      }
      for (let f = 0; f < state.userData.mealplans[m].filters.length; f++) {
        if (state.userData.mealplans[m].filters[f].isActive) {
          state.newRecipe.tags.push(state.userData.mealplans[m].filters[f].text)
        }
      }
      db.collection('users').doc(state.userData.uid).collection('mealplans').doc(state.userData.mealplans[m].uid).collection('recipes').add({
        id: state.newRecipe.name.slice(0, 2),
        ingredients: [],
        name: state.newRecipe.name,
        tags: state.newRecipe.tags,
        mealplans: [
          state.userData.mealplans[m].uid
        ],
        uid: ''
      })
        .then(function (doc) {
          var recipeID = doc.id
          db.collection('users').doc(state.userData.uid).collection('mealplans').doc(state.userData.mealplans[m].uid).update({
            recipesAmount: state.userData.mealplans[m].recipes.length
          })
          db.collection('users').doc(state.userData.uid).collection('mealplans').doc(state.userData.mealplans[m].uid).collection('recipes').doc(recipeID).update({
            uid: recipeID
          })
          if (state.userData.mealplans[m].isPublic) {
            db.collection('mealplans').doc(state.userData.mealplans[m].uid).collection('recipes').doc(recipeID).set({
              id: state.newRecipe.name.slice(0, 2),
              ingredients: [],
              name: state.newRecipe.name,
              tags: state.newRecipe.tags,
              mealplans: [
                state.userData.mealplans[m].uid
              ],
              uid: recipeID
            })
            db.collection('mealplans').doc(state.userData.mealplans[m].uid).update({
              recipesAmount: state.userData.mealplans[m].recipes.length
            })
          }
          for (var ingredient in state.newRecipe.ingredients) {
            db.collection('users').doc(state.userData.uid).collection('mealplans').doc(state.userData.mealplans[m].uid).collection('recipes').doc(recipeID).collection('ingredients').add({
              ingredient: state.newRecipe.ingredients[ingredient].ingredient,
              amount: state.newRecipe.ingredients[ingredient].amount,
              unit: state.newRecipe.ingredients[ingredient].unit,
              isActive: false,
              isPurchased: false,
              uid: ''
            })
              .then(function (doc) {
                db.collection('users').doc(state.userData.uid).collection('mealplans').doc(state.userData.mealplans[m].uid).collection('recipes').doc(recipeID).collection('ingredients').doc(doc.id).update({
                  uid: doc.id
                })
                if (state.userData.mealplans[m].isPublic) {
                  db.collection('mealplans').doc(state.userData.mealplans[m].uid).collection('recipes').doc(recipeID).collection('ingredients').doc(doc.id).set({
                    ingredient: state.newRecipe.ingredients[ingredient].ingredient,
                    amount: state.newRecipe.ingredients[ingredient].amount,
                    unit: state.newRecipe.ingredients[ingredient].unit,
                    isActive: false,
                    isPurchased: false,
                    uid: doc.id
                  })
                }
                state.newRecipe = {
                  id: null,
                  name: null,
                  ingredients: [],
                  tags: [],
                  mealplans: [],
                  uid: ''
                }
              })
          }
        })
    },
    getPopularMealplans (state) {
      state.popularMealplans = []
      db.collection('mealplans').orderBy('purchases', 'desc').limit(10)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            var mealplan = doc.data()
            var mealplanID = doc.id
            db.collection('mealplans').doc(mealplanID).collection('filters')
              .get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  var filter = doc.data()
                  mealplan.filters.push(filter)
                })
              })
            db.collection('mealplans').doc(mealplanID).collection('recipes')
              .get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  var recipe = doc.data()
                  var recipeID = doc.id
                  db.collection('mealplans').doc(mealplanID).collection('recipes').doc(recipeID).collection('ingredients')
                    .get()
                    .then(function (querySnapshot) {
                      recipe.ingredients = []
                      querySnapshot.forEach(function (doc) {
                        var ingredient = doc.data()
                        recipe.ingredients.push(ingredient)
                      })
                      mealplan.recipes.push(recipe)
                    })
                })
                state.popularMealplans.push(mealplan)
              })
          })
        })
    },
    setPage (state, page) {
      state.currentPage = page
    },
    setToday (state, today) {
      state.today = Number(today)
      state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
    },
    thisWeek (state) {
      for (var address in state.userAddresses) {
        state.start = moment().subtract(moment().isoWeekday(), 'days').add(1, 'days')
        state.currentYear = state.start.format('YYYY')
        state.currentYearMonth = state.start.format('YYYYMM')
        var addressID = state.userAddresses[address].uid
        db.collection('addresses').doc(addressID).collection('calendar').where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date')
          .onSnapshot(function (querySnapshot) {
            state.userAddresses[address].calendar.length = 0
            querySnapshot.forEach(function (doc) {
              var userAddressDay = doc.data()
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal0Ingredients')
                .onSnapshot(function (querySnapshot) {
                  userAddressDay.meal0Ingredients.length = 0
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal0Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal1Ingredients')
                .onSnapshot(function (querySnapshot) {
                  userAddressDay.meal1Ingredients.length = 0
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal1Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal2Ingredients')
                .onSnapshot(function (querySnapshot) {
                  userAddressDay.meal2Ingredients.length = 0
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal2Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal3Ingredients')
                .onSnapshot(function (querySnapshot) {
                  userAddressDay.meal2Ingredients.length = 0
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal3Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal4Ingredients')
                .onSnapshot(function (querySnapshot) {
                  userAddressDay.meal4Ingredients.length = 0
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal4Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal5Ingredients')
                .onSnapshot(function (querySnapshot) {
                  userAddressDay.meal5Ingredients.length = 0
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal5Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal6Ingredients')
                .onSnapshot(function (querySnapshot) {
                  userAddressDay.meal6Ingredients.length = 0
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal6Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal7Ingredients')
                .onSnapshot(function (querySnapshot) {
                  userAddressDay.meal7Ingredients.length = 0
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal7Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal8Ingredients')
                .onSnapshot(function (querySnapshot) {
                  userAddressDay.meal8Ingredients.length = 0
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal8Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal9Ingredients')
                .onSnapshot(function (querySnapshot) {
                  userAddressDay.meal9Ingredients.length = 0
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal9Ingredients.push(userAddressDayIngredient)
                  })
                })
              state.userAddresses[address].calendar.push(userAddressDay)
            })
          })
      }
      state.start = state.start.subtract(state.displayAmount, 'days')
      db.collection('users').doc(state.userData.uid).collection('calendar').where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date')
        .onSnapshot(function (querySnapshot) {
          state.userData.calendar.length = 0
          querySnapshot.forEach(function (doc) {
            state.userData.calendar.push(doc.data())
          })
        })
    },
    nextWeek (state) {
      for (var address in state.userAddresses) {
        state.currentYear = state.start.format('YYYY')
        state.currentYearMonth = state.start.format('YYYYMM')
        var addressID = state.userAddresses[address].uid
        db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar').where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date')
          .onSnapshot(function (querySnapshot) {
            state.userAddresses[address].calendar.length = 0
            querySnapshot.forEach(function (doc) {
              var userAddressDay = doc.data()
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal0Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal0Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal1Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal1Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal2Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal2Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal3Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal3Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal4Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal4Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal5Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal5Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal6Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal6Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal7Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal7Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal8Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal8Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal9Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal9Ingredients.push(userAddressDayIngredient)
                  })
                })
              state.userAddresses[address].calendar.push(userAddressDay)
            })
          })
        state.start = state.start.subtract(state.displayAmount, 'days')
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date')
        .onSnapshot(function (querySnapshot) {
          state.userData.calendar.length = 0
          querySnapshot.forEach(function (doc) {
            state.userData.calendar.push(doc.data())
          })
        })
    },
    previousWeek (state) {
      state.start = state.start.subtract(2 * state.displayAmount, 'days')
      for (var address in state.userAddresses) {
        state.currentYear = state.start.format('YYYY')
        state.currentYearMonth = state.start.format('YYYYMM')
        var addressID = state.userAddresses[address].uid
        db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar').where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date')
          .onSnapshot(function (querySnapshot) {
            state.userAddresses[address].calendar.length = 0
            querySnapshot.forEach(function (doc) {
              var userAddressDay = doc.data()
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal0Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal0Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal1Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal1Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal2Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal2Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal3Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal3Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal4Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal4Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal5Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal5Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal6Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal6Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal7Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal7Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal8Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal8Ingredients.push(userAddressDayIngredient)
                  })
                })
              db.collection('addresses').doc(addressID).collection('calendar').doc(userAddressDay.date.toString()).collection('meal9Ingredients')
                .onSnapshot(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let userAddressDayIngredient = doc.data()
                    userAddressDay.meal9Ingredients.push(userAddressDayIngredient)
                  })
                })
              state.userAddresses[address].calendar.push(userAddressDay)
            })
          })
        state.start = state.start.subtract(state.displayAmount, 'days')
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.displayAmount, 'days').format('YYYYMMDD'))).orderBy('date')
        .onSnapshot(function (querySnapshot) {
          state.userData.calendar.length = 0
          querySnapshot.forEach(function (doc) {
            state.userData.calendar.push(doc.data())
          })
        })
    },
    setMeal0 (state, day) {
      state.pointer.doc = day.date
      state.pointer.meal = '0'
      for (var address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          state.pointer.address = state.userData.addresses[address].uid
          state.pointer.location = state.userData.addresses[address].name
          state.pointer.index = address
        }
      }
      // set filters appropriately
      var m
      for (m in state.userData.mealplans) {
        if (state.userData.mealplans[m].isActive) {
          break
        }
      }
      if (state.userData.mealplans[m].filters[0].text === 'Breakfast') {
        state.userData.mealplans[m].filters[0].isActive = false
      }
      if (state.userData.mealplans[m].filters[1].text === 'Lunch') {
        state.userData.mealplans[m].filters[1].isActive = false
      }
      if (state.userData.mealplans[m].filters[2].text === 'Dinner') {
        state.userData.mealplans[m].filters[2].isActive = false
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').doc(day.date.toString()).update({
        meal0Address: state.pointer.address,
        meal0Location: state.pointer.location
      })
      var isMember = false
      var date = day.date.toString()
      for (var object in state.userAddresses[state.pointer.index].calendar) {
        if (state.userAddresses[state.pointer.index].calendar[object].date === day.date) {
          if (state.userAddresses[state.pointer.index].calendar[object].meal0Members.includes(state.userData.uid)) {
            isMember = true
          }
        }
      }
      if (isMember === false) {
        db.collection('addresses').doc(state.userAddresses[state.pointer.index].uid).collection('calendar').doc(date).update({
          meal0Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
        })
      }
    },
    setMeal1 (state, day) {
      state.pointer.doc = day.date
      state.pointer.meal = '1'
      for (var address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          state.pointer.address = state.userData.addresses[address].uid
          state.pointer.location = state.userData.addresses[address].name
          state.pointer.index = address
        }
      }
      // set filters appropriately
      var m
      for (m in state.userData.mealplans) {
        if (state.userData.mealplans[m].isActive) {
          break
        }
      }
      if (state.userData.mealplans[m].filters[0].text === 'Breakfast') {
        state.userData.mealplans[m].filters[0].isActive = true
      }
      if (state.userData.mealplans[m].filters[1].text === 'Lunch') {
        state.userData.mealplans[m].filters[1].isActive = false
      }
      if (state.userData.mealplans[m].filters[2].text === 'Dinner') {
        state.userData.mealplans[m].filters[2].isActive = false
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').doc(day.date.toString()).update({
        meal1Address: state.pointer.address,
        meal1Location: state.pointer.location
      })
      var isMember = false
      var date = day.date.toString()
      for (var object in state.userAddresses[state.pointer.index].calendar) {
        if (state.userAddresses[state.pointer.index].calendar[object].date === day.date) {
          if (state.userAddresses[state.pointer.index].calendar[object].meal1Members.includes(state.userData.uid)) {
            isMember = true
          }
        }
      }
      if (isMember === false) {
        db.collection('addresses').doc(state.userAddresses[state.pointer.index].uid).collection('calendar').doc(date).update({
          meal1Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
        })
      }
    },
    setMeal2 (state, day) {
      state.pointer.doc = day.date
      state.pointer.meal = '2'
      for (var address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          state.pointer.address = state.userData.addresses[address].uid
          state.pointer.location = state.userData.addresses[address].name
          state.pointer.index = address
        }
      }
      // set filters appropriately
      var m
      for (m in state.userData.mealplans) {
        if (state.userData.mealplans[m].isActive) {
          break
        }
      }
      if (state.userData.mealplans[m].filters[0].text === 'Breakfast') {
        state.userData.mealplans[m].filters[0].isActive = false
      }
      if (state.userData.mealplans[m].filters[1].text === 'Lunch') {
        state.userData.mealplans[m].filters[1].isActive = false
      }
      if (state.userData.mealplans[m].filters[2].text === 'Dinner') {
        state.userData.mealplans[m].filters[2].isActive = false
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').doc(day.date.toString()).update({
        meal2Address: state.pointer.address,
        meal2Location: state.pointer.location
      })
      var isMember = false
      var date = day.date.toString()
      for (var object in state.userAddresses[state.pointer.index].calendar) {
        if (state.userAddresses[state.pointer.index].calendar[object].date === day.date) {
          if (state.userAddresses[state.pointer.index].calendar[object].meal2Members.includes(state.userData.uid)) {
            isMember = true
          }
        }
      }
      if (isMember === false) {
        db.collection('addresses').doc(state.userAddresses[state.pointer.index].uid).collection('calendar').doc(date).update({
          meal2Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
        })
      }
    },
    setMeal3 (state, day) {
      state.pointer.doc = day.date
      state.pointer.meal = '3'
      for (var address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          state.pointer.address = state.userData.addresses[address].uid
          state.pointer.location = state.userData.addresses[address].name
          state.pointer.index = address
        }
      }
      // set filters appropriately
      var m
      for (m in state.userData.mealplans) {
        if (state.userData.mealplans[m].isActive) {
          break
        }
      }
      if (state.userData.mealplans[m].filters[0].text === 'Breakfast') {
        state.userData.mealplans[m].filters[0].isActive = false
      }
      if (state.userData.mealplans[m].filters[1].text === 'Lunch') {
        state.userData.mealplans[m].filters[1].isActive = false
      }
      if (state.userData.mealplans[m].filters[2].text === 'Dinner') {
        state.userData.mealplans[m].filters[2].isActive = false
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').doc(day.date.toString()).update({
        meal3Address: state.pointer.address,
        meal3Location: state.pointer.location
      })
      var isMember = false
      var date = day.date.toString()
      for (var object in state.userAddresses[state.pointer.index].calendar) {
        if (state.userAddresses[state.pointer.index].calendar[object].date === day.date) {
          if (state.userAddresses[state.pointer.index].calendar[object].meal3Members.includes(state.userData.uid)) {
            isMember = true
          }
        }
      }
      if (isMember === false) {
        db.collection('addresses').doc(state.userAddresses[state.pointer.index].uid).collection('calendar').doc(date).update({
          meal3Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
        })
      }
    },
    setMeal4 (state, day) {
      state.pointer.doc = day.date
      state.pointer.meal = '4'
      for (var address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          state.pointer.address = state.userData.addresses[address].uid
          state.pointer.location = state.userData.addresses[address].name
          state.pointer.index = address
        }
      }
      // set filters appropriately
      var m
      for (m in state.userData.mealplans) {
        if (state.userData.mealplans[m].isActive) {
          break
        }
      }
      if (state.userData.mealplans[m].filters[0].text === 'Breakfast') {
        state.userData.mealplans[m].filters[0].isActive = false
      }
      if (state.userData.mealplans[m].filters[1].text === 'Lunch') {
        state.userData.mealplans[m].filters[1].isActive = true
      }
      if (state.userData.mealplans[m].filters[2].text === 'Dinner') {
        state.userData.mealplans[m].filters[2].isActive = false
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').doc(day.date.toString()).update({
        meal4Address: state.pointer.address,
        meal4Location: state.pointer.location
      })
      var isMember = false
      var date = day.date.toString()
      for (var object in state.userAddresses[state.pointer.index].calendar) {
        if (state.userAddresses[state.pointer.index].calendar[object].date === day.date) {
          if (state.userAddresses[state.pointer.index].calendar[object].meal4Members.includes(state.userData.uid)) {
            isMember = true
          }
        }
      }
      if (isMember === false) {
        db.collection('addresses').doc(state.userAddresses[state.pointer.index].uid).collection('calendar').doc(date).update({
          meal4Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
        })
      }
    },
    setMeal5 (state, day) {
      state.pointer.doc = day.date
      state.pointer.meal = '5'
      for (var address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          state.pointer.address = state.userData.addresses[address].uid
          state.pointer.location = state.userData.addresses[address].name
          state.pointer.index = address
        }
      }
      // set filters appropriately
      var m
      for (m in state.userData.mealplans) {
        if (state.userData.mealplans[m].isActive) {
          break
        }
      }
      if (state.userData.mealplans[m].filters[0].text === 'Breakfast') {
        state.userData.mealplans[m].filters[0].isActive = false
      }
      if (state.userData.mealplans[m].filters[1].text === 'Lunch') {
        state.userData.mealplans[m].filters[1].isActive = false
      }
      if (state.userData.mealplans[m].filters[2].text === 'Dinner') {
        state.userData.mealplans[m].filters[2].isActive = false
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').doc(day.date.toString()).update({
        meal5Address: state.pointer.address,
        meal5Location: state.pointer.location
      })
      var isMember = false
      var date = day.date.toString()
      for (var object in state.userAddresses[state.pointer.index].calendar) {
        if (state.userAddresses[state.pointer.index].calendar[object].date === day.date) {
          if (state.userAddresses[state.pointer.index].calendar[object].meal5Members.includes(state.userData.uid)) {
            isMember = true
          }
        }
      }
      if (isMember === false) {
        db.collection('addresses').doc(state.userAddresses[state.pointer.index].uid).collection('calendar').doc(date).update({
          meal5Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
        })
      }
    },
    setMeal6 (state, day) {
      state.pointer.doc = day.date
      state.pointer.meal = '6'
      for (var address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          state.pointer.address = state.userData.addresses[address].uid
          state.pointer.location = state.userData.addresses[address].name
          state.pointer.index = address
        }
      }
      // set filters appropriately
      var m
      for (m in state.userData.mealplans) {
        if (state.userData.mealplans[m].isActive) {
          break
        }
      }
      if (state.userData.mealplans[m].filters[0].text === 'Breakfast') {
        state.userData.mealplans[m].filters[0].isActive = false
      }
      if (state.userData.mealplans[m].filters[1].text === 'Lunch') {
        state.userData.mealplans[m].filters[1].isActive = false
      }
      if (state.userData.mealplans[m].filters[2].text === 'Dinner') {
        state.userData.mealplans[m].filters[2].isActive = false
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').doc(day.date.toString()).update({
        meal6Address: state.pointer.address,
        meal6Location: state.pointer.location
      })
      var isMember = false
      var date = day.date.toString()
      for (var object in state.userAddresses[state.pointer.index].calendar) {
        if (state.userAddresses[state.pointer.index].calendar[object].date === day.date) {
          if (state.userAddresses[state.pointer.index].calendar[object].meal6Members.includes(state.userData.uid)) {
            isMember = true
          }
        }
      }
      if (isMember === false) {
        db.collection('addresses').doc(state.userAddresses[state.pointer.index].uid).collection('calendar').doc(date).update({
          meal6Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
        })
      }
    },
    setMeal7 (state, day) {
      state.pointer.doc = day.date
      state.pointer.meal = '7'
      for (var address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          state.pointer.address = state.userData.addresses[address].uid
          state.pointer.location = state.userData.addresses[address].name
          state.pointer.index = address
        }
      }
      // set filters appropriately
      var m
      for (m in state.userData.mealplans) {
        if (state.userData.mealplans[m].isActive) {
          break
        }
      }
      if (state.userData.mealplans[m].filters[0].text === 'Breakfast') {
        state.userData.mealplans[m].filters[0].isActive = false
      }
      if (state.userData.mealplans[m].filters[1].text === 'Lunch') {
        state.userData.mealplans[m].filters[1].isActive = false
      }
      if (state.userData.mealplans[m].filters[2].text === 'Dinner') {
        state.userData.mealplans[m].filters[2].isActive = true
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').doc(day.date.toString()).update({
        meal7Address: state.pointer.address,
        meal7Location: state.pointer.location
      })
      var isMember = false
      var date = day.date.toString()
      for (var object in state.userAddresses[state.pointer.index].calendar) {
        if (state.userAddresses[state.pointer.index].calendar[object].date === day.date) {
          if (state.userAddresses[state.pointer.index].calendar[object].meal7Members.includes(state.userData.uid)) {
            isMember = true
          }
        }
      }
      if (isMember === false) {
        db.collection('addresses').doc(state.userAddresses[state.pointer.index].uid).collection('calendar').doc(date).update({
          meal7Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
        })
      }
    },
    setMeal8 (state, day) {
      state.pointer.doc = day.date
      state.pointer.meal = '8'
      for (var address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          state.pointer.address = state.userData.addresses[address].uid
          state.pointer.location = state.userData.addresses[address].name
          state.pointer.index = address
        }
      }
      // set filters appropriately
      var m
      for (m in state.userData.mealplans) {
        if (state.userData.mealplans[m].isActive) {
          break
        }
      }
      if (state.userData.mealplans[m].filters[0].text === 'Breakfast') {
        state.userData.mealplans[m].filters[0].isActive = false
      }
      if (state.userData.mealplans[m].filters[1].text === 'Lunch') {
        state.userData.mealplans[m].filters[1].isActive = false
      }
      if (state.userData.mealplans[m].filters[2].text === 'Dinner') {
        state.userData.mealplans[m].filters[2].isActive = false
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').doc(day.date.toString()).update({
        meal8Address: state.pointer.address,
        meal8Location: state.pointer.location
      })
      var isMember = false
      var date = day.date.toString()
      for (var object in state.userAddresses[state.pointer.index].calendar) {
        if (state.userAddresses[state.pointer.index].calendar[object].date === day.date) {
          if (state.userAddresses[state.pointer.index].calendar[object].meal8Members.includes(state.userData.uid)) {
            isMember = true
          }
        }
      }
      if (isMember === false) {
        db.collection('addresses').doc(state.userAddresses[state.pointer.index].uid).collection('calendar').doc(date).update({
          meal8Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
        })
      }
    },
    setMeal9 (state, day) {
      state.pointer.doc = day.date
      state.pointer.meal = '9'
      for (var address in state.userData.addresses) {
        if (state.userData.addresses[address].isActive) {
          state.pointer.address = state.userData.addresses[address].uid
          state.pointer.location = state.userData.addresses[address].name
          state.pointer.index = address
        }
      }
      // set filters appropriately
      var m
      for (m in state.userData.mealplans) {
        if (state.userData.mealplans[m].isActive) {
          break
        }
      }
      if (state.userData.mealplans[m].filters[0].text === 'Breakfast') {
        state.userData.mealplans[m].filters[0].isActive = false
      }
      if (state.userData.mealplans[m].filters[1].text === 'Lunch') {
        state.userData.mealplans[m].filters[1].isActive = false
      }
      if (state.userData.mealplans[m].filters[2].text === 'Dinner') {
        state.userData.mealplans[m].filters[2].isActive = false
      }
      db.collection('users').doc(state.userData.uid).collection('calendar').doc(day.date.toString()).update({
        meal9Address: state.pointer.address,
        meal9Location: state.pointer.location
      })
      var isMember = false
      var date = day.date.toString()
      for (var object in state.userAddresses[state.pointer.index].calendar) {
        if (state.userAddresses[state.pointer.index].calendar[object].date === day.date) {
          if (state.userAddresses[state.pointer.index].calendar[object].meal9Members.includes(state.userData.uid)) {
            isMember = true
          }
        }
      }
      if (isMember === false) {
        db.collection('addresses').doc(state.userAddresses[state.pointer.index].uid).collection('calendar').doc(date).update({
          meal9Members: firebase.firestore.FieldValue.arrayUnion(state.userData.uid)
        })
      }
    },
    selectRecipe (state, recipe) {
      state.pointer.recipe = true
      var mealIngredients = 'meal' + state.pointer.meal + 'Ingredients'
      if (state.pointer.meal === '0') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal0: recipe.name
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal0CaloriesOwner: state.userData.calories
        })
      }
      if (state.pointer.meal === '1') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal1: recipe.name
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal1CaloriesOwner: state.userData.calories
        })
      }
      if (state.pointer.meal === '2') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal2: recipe.name
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal2CaloriesOwner: state.userData.calories
        })
      }
      if (state.pointer.meal === '3') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal3: recipe.name
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal3CaloriesOwner: state.userData.calories
        })
      }
      if (state.pointer.meal === '4') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal4: recipe.name
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal4CaloriesOwner: state.userData.calories
        })
      }
      if (state.pointer.meal === '5') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal5: recipe.name
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal5CaloriesOwner: state.userData.calories
        })
      }
      if (state.pointer.meal === '6') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal6: recipe.name
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal6CaloriesOwner: state.userData.calories
        })
      }
      if (state.pointer.meal === '7') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal7: recipe.name
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal7CaloriesOwner: state.userData.calories
        })
      }
      if (state.pointer.meal === '8') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal8: recipe.name
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal8CaloriesOwner: state.userData.calories
        })
      }
      if (state.pointer.meal === '9') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal9: recipe.name
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal9CaloriesOwner: state.userData.calories
        })
      }
      db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).collection(mealIngredients)
        .get()
        .then(function (querySnapshot) {
          new Promise(function (resolve, reject) {
            querySnapshot.forEach(function (doc) {
              db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).collection(mealIngredients).doc(doc.id).delete()
            })
            resolve()
          })
            .then(function () {
              for (let ingredient in recipe.ingredients) {
                db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).collection(mealIngredients).doc(recipe.ingredients[ingredient].uid).set(recipe.ingredients[ingredient])
              }
            })
        })
    },
    removeRecipe (state) {
      state.pointer.recipe = false
      var mealIngredients = 'meal' + state.pointer.meal + 'Ingredients'
      if (state.pointer.meal === '0') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal0: 'Snack'
              })
            }
          }
        }
      }
      if (state.pointer.meal === '1') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal1: 'Breakfast'
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal1CaloriesOwner: null
        })
      }
      if (state.pointer.meal === '2') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal2: 'Snack'
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal2CaloriesOwner: null
        })
      }
      if (state.pointer.meal === '3') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal3: 'Snack'
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal3CaloriesOwner: null
        })
      }
      if (state.pointer.meal === '4') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal4: 'Lunch'
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal4CaloriesOwner: null
        })
      }
      if (state.pointer.meal === '5') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal5: 'Snack'
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal5CaloriesOwner: null
        })
      }
      if (state.pointer.meal === '6') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal6: 'Snack'
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal6CaloriesOwner: null
        })
      }
      if (state.pointer.meal === '7') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal7: 'Dinner'
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal7CaloriesOwner: null
        })
      }
      if (state.pointer.meal === '8') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal8: 'Snack'
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal8CaloriesOwner: null
        })
      }
      if (state.pointer.meal === '9') {
        for (let address in state.userAddresses) {
          if (state.userAddresses[address].uid === state.pointer.address) {
            for (let member in state.userAddresses[address].members) {
              db.collection('users').doc(state.userAddresses[address].members[member].uid).collection('calendar').doc(state.pointer.doc.toString()).update({
                meal9: 'Snack'
              })
            }
          }
        }
        db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).update({
          meal9CaloriesOwner: null
        })
      }
      db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).collection(mealIngredients)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            db.collection('addresses').doc(state.pointer.address).collection('calendar').doc(state.pointer.doc.toString()).collection(mealIngredients).doc(doc.id).delete()
          })
        })
    },
    createList (state) {
      for (var address in state.userAddresses) {
        state.start = moment()
        state.userAddresses[address].shoppingList.length = 0
        db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar').where('date', '>=', Number(state.start.format('YYYYMMDD'))).where('date', '<', Number(state.start.add(state.userData.shoppingListLength, 'days').format('YYYYMMDD'))).orderBy('date')
          .get()
          .then(function (querySnapshot) {
            let userCalendarArray = []
            querySnapshot.forEach(function (doc) {
              let userDay = doc.data()
              userCalendarArray.push(userDay)
            })
            for (let day in userCalendarArray) {
              var meal0Total = 0
              for (let calendarMember in userCalendarArray[day].meal0Members) {
                for (let addressMember in state.userAddresses[address].members) {
                  if (state.userAddresses[address].members[addressMember].uid === userCalendarArray[day].meal0Members[calendarMember]) {
                    meal0Total += state.userAddresses[address].members[addressMember].calories
                  }
                }
              }
              var meal1Total = 0
              for (let calendarMember in userCalendarArray[day].meal1Members) {
                for (let addressMember in state.userAddresses[address].members) {
                  if (state.userAddresses[address].members[addressMember].uid === userCalendarArray[day].meal1Members[calendarMember]) {
                    meal1Total += state.userAddresses[address].members[addressMember].calories
                  }
                }
              }
              var meal2Total = 0
              for (let calendarMember in userCalendarArray[day].meal2Members) {
                for (let addressMember in state.userAddresses[address].members) {
                  if (state.userAddresses[address].members[addressMember].uid === userCalendarArray[day].meal2Members[calendarMember]) {
                    meal2Total += state.userAddresses[address].members[addressMember].calories
                  }
                }
              }
              var meal3Total = 0
              for (let calendarMember in userCalendarArray[day].meal3Members) {
                for (let addressMember in state.userAddresses[address].members) {
                  if (state.userAddresses[address].members[addressMember].uid === userCalendarArray[day].meal3Members[calendarMember]) {
                    meal3Total += state.userAddresses[address].members[addressMember].calories
                  }
                }
              }
              var meal4Total = 0
              for (let calendarMember in userCalendarArray[day].meal4Members) {
                for (let addressMember in state.userAddresses[address].members) {
                  if (state.userAddresses[address].members[addressMember].uid === userCalendarArray[day].meal4Members[calendarMember]) {
                    meal4Total += state.userAddresses[address].members[addressMember].calories
                  }
                }
              }
              var meal5Total = 0
              for (let calendarMember in userCalendarArray[day].meal5Members) {
                for (let addressMember in state.userAddresses[address].members) {
                  if (state.userAddresses[address].members[addressMember].uid === userCalendarArray[day].meal5Members[calendarMember]) {
                    meal5Total += state.userAddresses[address].members[addressMember].calories
                  }
                }
              }
              var meal6Total = 0
              for (let calendarMember in userCalendarArray[day].meal6Members) {
                for (let addressMember in state.userAddresses[address].members) {
                  if (state.userAddresses[address].members[addressMember].uid === userCalendarArray[day].meal6Members[calendarMember]) {
                    meal6Total += state.userAddresses[address].members[addressMember].calories
                  }
                }
              }
              var meal7Total = 0
              for (let calendarMember in userCalendarArray[day].meal7Members) {
                for (let addressMember in state.userAddresses[address].members) {
                  if (state.userAddresses[address].members[addressMember].uid === userCalendarArray[day].meal7Members[calendarMember]) {
                    meal7Total += state.userAddresses[address].members[addressMember].calories
                  }
                }
              }
              var meal8Total = 0
              for (let calendarMember in userCalendarArray[day].meal8Members) {
                for (let addressMember in state.userAddresses[address].members) {
                  if (state.userAddresses[address].members[addressMember].uid === userCalendarArray[day].meal8Members[calendarMember]) {
                    meal8Total += state.userAddresses[address].members[addressMember].calories
                  }
                }
              }
              var meal9Total = 0
              for (let calendarMember in userCalendarArray[day].meal9Members) {
                for (let addressMember in state.userAddresses[address].members) {
                  if (state.userAddresses[address].members[addressMember].uid === userCalendarArray[day].meal9Members[calendarMember]) {
                    meal9Total += state.userAddresses[address].members[addressMember].calories
                  }
                }
              }
              const meal0Ratio = meal0Total / userCalendarArray[day].meal0CaloriesOwner
              const meal1Ratio = meal1Total / userCalendarArray[day].meal1CaloriesOwner
              const meal2Ratio = meal2Total / userCalendarArray[day].meal2CaloriesOwner
              const meal3Ratio = meal3Total / userCalendarArray[day].meal3CaloriesOwner
              const meal4Ratio = meal4Total / userCalendarArray[day].meal4CaloriesOwner
              const meal5Ratio = meal5Total / userCalendarArray[day].meal5CaloriesOwner
              const meal6Ratio = meal6Total / userCalendarArray[day].meal6CaloriesOwner
              const meal7Ratio = meal7Total / userCalendarArray[day].meal7CaloriesOwner
              const meal8Ratio = meal8Total / userCalendarArray[day].meal8CaloriesOwner
              const meal9Ratio = meal9Total / userCalendarArray[day].meal9CaloriesOwner
              db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar').doc(userCalendarArray[day].date.toString()).collection('meal0Ingredients')
                .get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let ingredient = doc.data()
                    if (!state.userAddresses[address].shoppingList.some(e => e.ingredient === ingredient.ingredient)) {
                      ingredient.amount = ingredient.amount * meal0Ratio
                      state.userAddresses[address].shoppingList.push(ingredient)
                    } else {
                      for (let item in state.userAddresses[address].shoppingList) {
                        if (state.userAddresses[address].shoppingList[item].ingredient === ingredient.ingredient) {
                          state.userAddresses[address].shoppingList[item].amount += (ingredient.amount * meal0Ratio)
                        }
                      }
                    }
                  })
                })
              db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar').doc(userCalendarArray[day].date.toString()).collection('meal1Ingredients')
                .get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let ingredient = doc.data()
                    if (!state.userAddresses[address].shoppingList.some(e => e.ingredient === ingredient.ingredient)) {
                      ingredient.amount = ingredient.amount * meal1Ratio
                      state.userAddresses[address].shoppingList.push(ingredient)
                    } else {
                      for (let item in state.userAddresses[address].shoppingList) {
                        if (state.userAddresses[address].shoppingList[item].ingredient === ingredient.ingredient) {
                          state.userAddresses[address].shoppingList[item].amount += (ingredient.amount * meal1Ratio)
                        }
                      }
                    }
                  })
                })
              db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar').doc(userCalendarArray[day].date.toString()).collection('meal2Ingredients')
                .get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let ingredient = doc.data()
                    if (!state.userAddresses[address].shoppingList.some(e => e.ingredient === ingredient.ingredient)) {
                      ingredient.amount = ingredient.amount * meal2Ratio
                      state.userAddresses[address].shoppingList.push(ingredient)
                    } else {
                      for (let item in state.userAddresses[address].shoppingList) {
                        if (state.userAddresses[address].shoppingList[item].ingredient === ingredient.ingredient) {
                          state.userAddresses[address].shoppingList[item].amount += (ingredient.amount * meal2Ratio)
                        }
                      }
                    }
                  })
                })
              db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar').doc(userCalendarArray[day].date.toString()).collection('meal3Ingredients')
                .get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let ingredient = doc.data()
                    if (!state.userAddresses[address].shoppingList.some(e => e.ingredient === ingredient.ingredient)) {
                      ingredient.amount = ingredient.amount * meal3Ratio
                      state.userAddresses[address].shoppingList.push(ingredient)
                    } else {
                      for (let item in state.userAddresses[address].shoppingList) {
                        if (state.userAddresses[address].shoppingList[item].ingredient === ingredient.ingredient) {
                          state.userAddresses[address].shoppingList[item].amount += (ingredient.amount * meal3Ratio)
                        }
                      }
                    }
                  })
                })
              db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar').doc(userCalendarArray[day].date.toString()).collection('meal4Ingredients')
                .get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let ingredient = doc.data()
                    if (!state.userAddresses[address].shoppingList.some(e => e.ingredient === ingredient.ingredient)) {
                      ingredient.amount = ingredient.amount * meal4Ratio
                      state.userAddresses[address].shoppingList.push(ingredient)
                    } else {
                      for (let item in state.userAddresses[address].shoppingList) {
                        if (state.userAddresses[address].shoppingList[item].ingredient === ingredient.ingredient) {
                          state.userAddresses[address].shoppingList[item].amount += (ingredient.amount * meal4Ratio)
                        }
                      }
                    }
                  })
                })
              db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar').doc(userCalendarArray[day].date.toString()).collection('meal5Ingredients')
                .get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let ingredient = doc.data()
                    if (!state.userAddresses[address].shoppingList.some(e => e.ingredient === ingredient.ingredient)) {
                      ingredient.amount = ingredient.amount * meal5Ratio
                      state.userAddresses[address].shoppingList.push(ingredient)
                    } else {
                      for (let item in state.userAddresses[address].shoppingList) {
                        if (state.userAddresses[address].shoppingList[item].ingredient === ingredient.ingredient) {
                          state.userAddresses[address].shoppingList[item].amount += (ingredient.amount * meal5Ratio)
                        }
                      }
                    }
                  })
                })
              db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar').doc(userCalendarArray[day].date.toString()).collection('meal6Ingredients')
                .get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let ingredient = doc.data()
                    if (!state.userAddresses[address].shoppingList.some(e => e.ingredient === ingredient.ingredient)) {
                      ingredient.amount = ingredient.amount * meal6Ratio
                      state.userAddresses[address].shoppingList.push(ingredient)
                    } else {
                      for (let item in state.userAddresses[address].shoppingList) {
                        if (state.userAddresses[address].shoppingList[item].ingredient === ingredient.ingredient) {
                          state.userAddresses[address].shoppingList[item].amount += (ingredient.amount * meal6Ratio)
                        }
                      }
                    }
                  })
                })
              db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar').doc(userCalendarArray[day].date.toString()).collection('meal7Ingredients')
                .get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let ingredient = doc.data()
                    if (!state.userAddresses[address].shoppingList.some(e => e.ingredient === ingredient.ingredient)) {
                      ingredient.amount = ingredient.amount * meal7Ratio
                      state.userAddresses[address].shoppingList.push(ingredient)
                    } else {
                      for (let item in state.userAddresses[address].shoppingList) {
                        if (state.userAddresses[address].shoppingList[item].ingredient === ingredient.ingredient) {
                          state.userAddresses[address].shoppingList[item].amount += (ingredient.amount * meal7Ratio)
                        }
                      }
                    }
                  })
                })
              db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar').doc(userCalendarArray[day].date.toString()).collection('meal8Ingredients')
                .get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let ingredient = doc.data()
                    if (!state.userAddresses[address].shoppingList.some(e => e.ingredient === ingredient.ingredient)) {
                      ingredient.amount = ingredient.amount * meal8Ratio
                      state.userAddresses[address].shoppingList.push(ingredient)
                    } else {
                      for (let item in state.userAddresses[address].shoppingList) {
                        if (state.userAddresses[address].shoppingList[item].ingredient === ingredient.ingredient) {
                          state.userAddresses[address].shoppingList[item].amount += (ingredient.amount * meal8Ratio)
                        }
                      }
                    }
                  })
                })
              db.collection('addresses').doc(state.userAddresses[address].uid).collection('calendar').doc(userCalendarArray[day].date.toString()).collection('meal9Ingredients')
                .get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let ingredient = doc.data()
                    if (!state.userAddresses[address].shoppingList.some(e => e.ingredient === ingredient.ingredient)) {
                      ingredient.amount = ingredient.amount * meal9Ratio
                      state.userAddresses[address].shoppingList.push(ingredient)
                    } else {
                      for (let item in state.userAddresses[address].shoppingList) {
                        if (state.userAddresses[address].shoppingList[item].ingredient === ingredient.ingredient) {
                          state.userAddresses[address].shoppingList[item].amount += (ingredient.amount * meal9Ratio)
                        }
                      }
                    }
                  })
                })
            }
          })
      }
    },
    setSearchedMealplan (state) {
      state.searchedMealplan = null
    },
    searchMealplan (state, mealplanID) {
      db.collection('mealplans').doc(mealplanID)
        .get()
        .then(function (doc) {
          let data = doc.data()
          state.searchedMealplan = data
          db.collection('mealplans').doc(mealplanID).collection('filters')
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                let filter = doc.data()
                state.searchedMealplan.filters.push(filter)
              })
            })
          db.collection('mealplans').doc(mealplanID).collection('recipes')
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                let recipe = doc.data()
                state.searchedMealplan.recipes.push(recipe)
              })
            })
        })
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
            uid: 'default',
            calories: 2000
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
            meals: [],
            mealplans: []
          })

          db.collection('users').doc('default').collection('meals').doc('0').set({
            text: 'Snack',
            isActive: false,
            uid: '0'
          })
          db.collection('users').doc('default').collection('meals').doc('1').set({
            text: 'Breakfast',
            isActive: true,
            uid: '1'
          })
          db.collection('users').doc('default').collection('meals').doc('2').set({
            text: 'Snack',
            isActive: false,
            uid: '2'
          })
          db.collection('users').doc('default').collection('meals').doc('3').set({
            text: 'Snack',
            isActive: false,
            uid: '3'
          })
          db.collection('users').doc('default').collection('meals').doc('4').set({
            text: 'Lunch',
            isActive: true,
            uid: '4'
          })
          db.collection('users').doc('default').collection('meals').doc('5').set({
            text: 'Snack',
            isActive: false,
            uid: '5'
          })
          db.collection('users').doc('default').collection('meals').doc('6').set({
            text: 'Snack',
            isActive: false,
            uid: '6'
          })
          db.collection('users').doc('default').collection('meals').doc('7').set({
            text: 'Dinner',
            isActive: true,
            uid: '7'
          })
          db.collection('users').doc('default').collection('meals').doc('8').set({
            text: 'Snack',
            isActive: false,
            uid: '8'
          })
          db.collection('users').doc('default').collection('meals').doc('9').set({
            text: 'Snack',
            isActive: false,
            uid: '9'
          })
          db.collection('users').doc('default').collection('mealplans').add({
            name: 'Personal',
            publicName: 'PersonalMealplan',
            isActive: true,
            isPurchased: false,
            isPublic: false,
            recipes: [],
            filters: [],
            price: 0,
            purchases: 0,
            currency: 'CHF',
            recipesAmount: 1,
            uid: ''
          })
            .then(function (mealplan) {
              db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).update({
                uid: mealplan.id
              })
              db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('filters').doc('00000000000000000001').set({
                text: 'Breakfast',
                isActive: true,
                isRequired: false,
                uid: '00000000000000000001'
              })
              db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('filters').doc('00000000000000000002').set({
                text: 'Lunch',
                isActive: true,
                isRequired: false,
                uid: '00000000000000000002'
              })
              db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('filters').doc('00000000000000000003').set({
                text: 'Dinner',
                isActive: true,
                isRequired: false,
                uid: '00000000000000000003'
              })
              db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('recipes').add({
                name: 'Banana Smoothie',
                id: 'Ba',
                ingredients: [],
                uid: '',
                tags: [
                  'Breakfast'
                ],
                mealplans: [
                  mealplan.id
                ]
              })
                .then(function (recipe) {
                  db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('recipes').doc(recipe.id).update({
                    uid: recipe.id
                  })
                  db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('recipes').doc(recipe.id).collection('ingredients').add({
                    ingredient: 'Milk',
                    amount: 200,
                    unit: 'g',
                    isActive: false,
                    isPurchased: false,
                    uid: ''
                  })
                    .then(function (ingredient) {
                      db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('recipes').doc(recipe.id).collection('ingredients').doc(ingredient.id).update({
                        uid: ingredient.id
                      })
                    })
                  db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('recipes').doc(recipe.id).collection('ingredients').add({
                    ingredient: 'Banana',
                    amount: 1,
                    unit: 'medium',
                    isActive: false,
                    isPurchased: false,
                    uid: ''
                  })
                    .then(function (ingredient) {
                      db.collection('users').doc('default').collection('mealplans').doc(mealplan.id).collection('recipes').doc(recipe.id).collection('ingredients').doc(ingredient.id).update({
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
                meal0: 'Snack',
                meal0Location: 'Home',
                meal0Address: address.id,
                meal1: 'Breakfast',
                meal1Location: 'Home',
                meal1Address: address.id,
                meal2: 'Snack',
                meal2Location: 'Home',
                meal2Address: address.id,
                meal3: 'Snack',
                meal3Location: 'Home',
                meal3Address: address.id,
                meal4: 'Lunch',
                meal4Location: 'Home',
                meal4Address: address.id,
                meal5: 'Snack',
                meal5Location: 'Home',
                meal5Address: address.id,
                meal6: 'Snack',
                meal6Location: 'Home',
                meal6Address: address.id,
                meal7: 'Dinner',
                meal7Location: 'Home',
                meal7Address: address.id,
                meal8: 'Snack',
                meal8Location: 'Home',
                meal8Address: address.id,
                meal9: 'Snack',
                meal9Location: 'Home',
                meal9Address: address.id
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
      const object = user
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
            uid: object.user.uid,
            calories: 2000
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
            meals: [],
            mealplans: []
          })
          db.collection('users').doc(object.user.uid).collection('meals').doc('0').set({
            text: 'Snack',
            isActive: false,
            uid: '0'
          })
          db.collection('users').doc(object.user.uid).collection('meals').doc('1').set({
            text: 'Breakfast',
            isActive: true,
            uid: '1'
          })
          db.collection('users').doc(object.user.uid).collection('meals').doc('2').set({
            text: 'Snack',
            isActive: false,
            uid: '2'
          })
          db.collection('users').doc(object.user.uid).collection('meals').doc('3').set({
            text: 'Snack',
            isActive: false,
            uid: '3'
          })
          db.collection('users').doc(object.user.uid).collection('meals').doc('4').set({
            text: 'Lunch',
            isActive: true,
            uid: '4'
          })
          db.collection('users').doc(object.user.uid).collection('meals').doc('5').set({
            text: 'Snack',
            isActive: false,
            uid: '5'
          })
          db.collection('users').doc(object.user.uid).collection('meals').doc('6').set({
            text: 'Snack',
            isActive: false,
            uid: '6'
          })
          db.collection('users').doc(object.user.uid).collection('meals').doc('7').set({
            text: 'Dinner',
            isActive: true,
            uid: '7'
          })
          db.collection('users').doc(object.user.uid).collection('meals').doc('8').set({
            text: 'Snack',
            isActive: false,
            uid: '8'
          })
          db.collection('users').doc(object.user.uid).collection('meals').doc('9').set({
            text: 'Snack',
            isActive: false,
            uid: '9'
          })
          db.collection('users').doc(object.user.uid).collection('mealplans').add({
            name: 'Personal',
            publicName: 'Personal Mealplan',
            isActive: true,
            isPublic: false,
            isPurchased: false,
            recipes: [],
            filters: [],
            price: 0,
            purchases: 0,
            currency: 'CHF',
            recipesAmount: 1,
            uid: ''
          })
            .then(function (mealplan) {
              db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).update({
                uid: mealplan.id
              })
              db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('filters').doc('00000000000000000001').set({
                text: 'Breakfast',
                isActive: true,
                isRequired: false,
                uid: '00000000000000000001'
              })
              db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('filters').doc('00000000000000000002').set({
                text: 'Lunch',
                isActive: true,
                isRequired: false,
                uid: '00000000000000000002'
              })
              db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('filters').doc('00000000000000000003').set({
                text: 'Dinner',
                isActive: true,
                isRequired: false,
                uid: '00000000000000000003'
              })
              db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('recipes').add({
                name: 'Banana Smoothie',
                id: 'Ba',
                ingredients: [],
                uid: '',
                tags: [
                  'Breakfast'
                ],
                mealplans: [
                  mealplan.id
                ]
              })
                .then(function (recipe) {
                  db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('recipes').doc(recipe.id).update({
                    uid: recipe.id
                  })
                  db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('recipes').doc(recipe.id).collection('ingredients').add({
                    ingredient: 'Milk',
                    amount: 200,
                    unit: 'g',
                    isActive: false,
                    isPurchased: false,
                    uid: ''
                  })
                    .then(function (ingredient) {
                      db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('recipes').doc(recipe.id).collection('ingredients').doc(ingredient.id).update({
                        uid: ingredient.id
                      })
                    })
                  db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('recipes').doc(recipe.id).collection('ingredients').add({
                    ingredient: 'Banana',
                    amount: 1,
                    unit: 'medium',
                    isActive: false,
                    isPurchased: false,
                    uid: ''
                  })
                    .then(function (ingredient) {
                      db.collection('users').doc(object.user.uid).collection('mealplans').doc(mealplan.id).collection('recipes').doc(recipe.id).collection('ingredients').doc(ingredient.id).update({
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
                meal0: 'Snack',
                meal0Location: 'Home',
                meal0Address: address.id,
                meal1: 'Breakfast',
                meal1Location: 'Home',
                meal1Address: address.id,
                meal2: 'Snack',
                meal2Location: 'Home',
                meal2Address: address.id,
                meal3: 'Snack',
                meal3Location: 'Home',
                meal3Address: address.id,
                meal4: 'Lunch',
                meal4Location: 'Home',
                meal4Address: address.id,
                meal5: 'Snack',
                meal5Location: 'Home',
                meal5Address: address.id,
                meal6: 'Snack',
                meal6Location: 'Home',
                meal6Address: address.id,
                meal7: 'Dinner',
                meal7Location: 'Home',
                meal7Address: address.id,
                meal8: 'Snack',
                meal8Location: 'Home',
                meal8Address: address.id,
                meal9: 'Snack',
                meal9Location: 'Home',
                meal9Address: address.id
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
        })
    },
    getUserData (state, userData) {
      state.userData = userData
    },
    emptyUserDataAddresses (state) {
      state.userData.addresses.length = 0
    },
    setUserDataAddresses (state, userDataAddressesArray) {
      for (let userDataAddress in userDataAddressesArray) {
        state.userData.addresses.push(userDataAddressesArray[userDataAddress])
      }
    },
    emptyUserAddresses (state) {
      var defaultAddress = null
      var defaultName = null
      for (let address in state.userData.addresses) {
        if (state.userData.addresses[address].isDefault) {
          defaultAddress = state.userData.addresses[address].uid
          defaultName = state.userData.addresses[address].name
        }
      }
      for (var month = 0; month < 12; month++) {
        // adds days to user data
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
              meal0: 'Snack',
              meal0Location: defaultName,
              meal0Address: defaultAddress,
              meal1: 'Breakfast',
              meal1Location: defaultName,
              meal1Address: defaultAddress,
              meal2: 'Snack',
              meal2Location: defaultName,
              meal2Address: defaultAddress,
              meal3: 'Snack',
              meal3Location: defaultName,
              meal3Address: defaultAddress,
              meal4: 'Lunch',
              meal4Location: defaultName,
              meal4Address: defaultAddress,
              meal5: 'Snack',
              meal5Location: defaultName,
              meal5Address: defaultAddress,
              meal6: 'Snack',
              meal6Location: defaultName,
              meal6Address: defaultAddress,
              meal7: 'Dinner',
              meal7Location: defaultName,
              meal7Address: defaultAddress,
              meal8: 'Snack',
              meal8Location: defaultName,
              meal8Address: defaultAddress,
              meal9: 'Snack',
              meal9Location: defaultName,
              meal9Address: defaultAddress
            }
            db.collection('users').doc(state.userData.uid).collection('calendar').doc(docName)
              .set(dayTemplate)
          }
          state.userData.months.push(moment().add(month, 'months').format('YYYYMM'))
          db.collection('users').doc(state.userData.uid).update({
            months: state.userData.months
          })
        }
      }
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
    setUserAddressMembers (state, { userAddressMembersArray, addressID }) {
      for (let address in state.userAddresses) {
        if (state.userAddresses[address].uid === addressID) {
          for (let userAddressMember in userAddressMembersArray) {
            state.userAddresses[address].members.push(userAddressMembersArray[userAddressMember])
          }
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
    setUserAddressMonths (state, { userAddressMonthsArray, addressID }) {
      for (let address in state.userAddresses) {
        if (state.userAddresses[address].uid === addressID) {
          for (let userAddressMonth in userAddressMonthsArray) {
            state.userAddresses[address].months.push(userAddressMonthsArray[userAddressMonth])
          }
          var currentYear = moment().format('YYYY')
          var months = []
          for (let m = 0; m < state.userAddresses[address].months.length; m++) {
            months.push(state.userAddresses[address].months[m].month)
          }
          for (let y = 0; y < 2; y++) {
            for (let month2 = 0; month2 < 12; month2++) {
              // adds months to user address
              if (!months.includes(moment().year(Number(currentYear)).month(month2).add(y, 'years').format('YYYYMM'))) {
                state.userAddresses[address].months.push({
                  month: moment().year(Number(currentYear)).month(month2).add(y, 'years').format('YYYYMM'),
                  display: moment().year(Number(currentYear)).month(month2).add(y, 'years').format('MMM'),
                  isActive: false,
                  isPurchased: false
                })
                db.collection('addresses').doc(state.userAddresses[address].uid).collection('months').doc(moment().year(Number(currentYear)).month(month2).add(y, 'years').format('YYYYMM')).set(state.userAddresses[address].months[state.userAddresses[address].months.length - 1])
              }
            }
          }
        }
      }
    },
    emptyUserAddressPersonalLists (state, addressID) {
      for (var userAddress in state.userAddresses) {
        if (state.userAddresses[userAddress].uid === addressID) {
          state.userAddresses[userAddress].personalList.length = 0
        }
      }
    },
    setUserAddressPersonalLists (state, { userAddressPersonalListsArray, addressID }) {
      for (let address in state.userAddresses) {
        if (state.userAddresses[address].uid === addressID) {
          for (let userAddressPersonalList in userAddressPersonalListsArray) {
            state.userAddresses[address].personalList.push(userAddressPersonalListsArray[userAddressPersonalList])
          }
        }
      }
    },
    emptyUserDataMeals (state) {
      state.userData.meals.length = 0
    },
    setUserDataMeals (state, userDataMealsArray) {
      for (let userDataMeal in userDataMealsArray) {
        state.userData.meals.push(userDataMealsArray[userDataMeal])
      }
    },
    emptyUserDataMealplans (state) {
      state.userData.mealplans.length = 0
    },
    setUserDataMealplans (state, userDataMealplansArray) {
      for (let userDataMealplan in userDataMealplansArray) {
        state.userData.mealplans.push(userDataMealplansArray[userDataMealplan])
      }
    },
    emptyUserDataMealplanFilters (state, mealplanID) {
      for (var mealplan in state.userData.mealplans) {
        if (state.userData.mealplans[mealplan].uid === mealplanID) {
          state.userData.mealplans[mealplan].filters.length = 0
        }
      }
    },
    setUserDataMealplanFilters (state, { userDataMealplanFiltersArray, mealplanID }) {
      for (let mealplan in state.userData.mealplans) {
        if (state.userData.mealplans[mealplan].uid === mealplanID) {
          for (let userDataMealplanFilter in userDataMealplanFiltersArray) {
            state.userData.mealplans[mealplan].filters.push(userDataMealplanFiltersArray[userDataMealplanFilter])
          }
        }
      }
    },
    emptyUserDataMealplanRecipes (state, mealplanID) {
      for (var mealplan in state.userData.mealplans) {
        if (state.userData.mealplans[mealplan].uid === mealplanID) {
          state.userData.mealplans[mealplan].recipes.length = 0
        }
      }
    },
    setUserDataMealplanRecipes (state, { userDataMealplanRecipesArray, mealplanID }) {
      for (let mealplan in state.userData.mealplans) {
        if (state.userData.mealplans[mealplan].uid === mealplanID) {
          for (let userDataMealplanRecipe in userDataMealplanRecipesArray) {
            state.userData.mealplans[mealplan].recipes.push(userDataMealplanRecipesArray[userDataMealplanRecipe])
          }
        }
      }
    },
    emptyUserDataMealplanRecipeIngredients (state, { mealplanID, recipeID }) {
      for (var mealplan in state.userData.mealplans) {
        if (state.userData.mealplans[mealplan].uid === mealplanID) {
          for (var recipe in state.userData.mealplans[mealplan].recipes) {
            if (state.userData.mealplans[mealplan].recipes[recipe].uid === recipeID) {
              state.userData.mealplans[mealplan].recipes[recipe].ingredients.length = 0
            }
          }
        }
      }
    },
    setUserDataMealplanRecipeIngredient (state, { userDataMealplanRecipeIngredientsArray, mealplanID, recipeID }) {
      for (let mealplan in state.userData.mealplans) {
        if (state.userData.mealplans[mealplan].uid === mealplanID) {
          for (let recipe in state.userData.mealplans[mealplan].recipes) {
            if (state.userData.mealplans[mealplan].recipes[recipe].uid === recipeID) {
              for (let userDataMealplanRecipeIngredient in userDataMealplanRecipeIngredientsArray) {
                state.userData.mealplans[mealplan].recipes[recipe].ingredients.push(userDataMealplanRecipeIngredientsArray[userDataMealplanRecipeIngredient])
              }
            }
          }
        }
      }
    }
  }
})
