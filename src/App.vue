<template>
  <div id="app">
    <router-view name="banner"></router-view>
    <router-view :key="rerender" name="dropdown"></router-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/javascript">
import firebase from 'firebase/app'
import store from './store'
import db from './database'
import { mapState } from 'vuex'
import 'firebase/auth'
import 'typeface-montserrat'

export default {
  created () {
    var unsubscribeUserData
    var unsubscribeUserDataAddresses
    var unsubscribeUserAddresses
    var unsubscribeUserAddressesMembers
    var unsubscribeUserAddressesMonths
    var unsubscribeUserAddressesPersonalList
    var unsubscribeUserDataMeals
    var unsubscribeUserDataMealplans
    var unsubscribeUserDataMealplanFilters
    var unsubscribeUserDataMealplanRecipes
    var unsubscribeUserDataMealplanRecipeIngredients
    store.commit('getPopularMealplans')
    firebase.auth().onAuthStateChanged(function (user) {
      if (user && user.emailVerified && user.metadata.creationTime !== user.metadata.lastSignInTime) {
        var userID = user.uid
        if (unsubscribeUserData) {
          unsubscribeUserData()
          unsubscribeUserDataAddresses()
          unsubscribeUserAddresses()
          unsubscribeUserAddressesMembers()
          unsubscribeUserAddressesMonths()
          unsubscribeUserAddressesPersonalList()
          unsubscribeUserDataMeals()
          unsubscribeUserDataMealplans()
          unsubscribeUserDataMealplanFilters()
          unsubscribeUserDataMealplanRecipes()
          unsubscribeUserDataMealplanRecipeIngredients()
        }
        unsubscribeUserData =
        db.collection('users').doc(userID)
          .onSnapshot(function (doc) {
            // get the data from the user
            let userData = doc.data()
            // set it as state.userData
            store.commit('getUserData', userData)
            // this requires the completetion of the setting of userData because it pushes it into state.userData.addresses
            unsubscribeUserDataAddresses =
            db.collection('users').doc(userID).collection('addresses')
              .onSnapshot(function (querySnapshot) {
                // empty userData
                store.commit('emptyUserDataAddresses')
                // assign the values to an array first
                let userDataAddressesArray = []
                // get the documents and push them into the array
                querySnapshot.forEach(function (doc) {
                  let userDataAddress = doc.data()
                  userDataAddressesArray.push(userDataAddress)
                })
                // set the addresses in userData instead of pushing them sepeartely, doing it all at once now
                store.commit('setUserDataAddresses', userDataAddressesArray)
                // empty userAddresses
                store.commit('emptyUserAddresses')
                for (let userDataAddress in userDataAddressesArray) {
                  var addressID = userDataAddressesArray[userDataAddress].uid
                  unsubscribeUserAddresses =
                  db.collection('addresses').doc(addressID)
                    .onSnapshot(function (doc) {
                      // because its being looped through we don't need any forEach querySnapshots
                      let userAddress = doc.data()
                      // set the addresses in userData instead of pushing them sepeartely, doing it all at once now
                      store.commit('pushUserAddress', userAddress)
                      store.commit('thisWeek')
                      store.commit('createList')
                    })
                  unsubscribeUserAddressesMembers =
                  db.collection('addresses').doc(addressID).collection('members')
                    .onSnapshot(function (querySnapshot) {
                      // otherwise addressID not defined properly inside the snapshot
                      var addressID = userDataAddressesArray[userDataAddress].uid
                      // empty the subcollection
                      store.commit('emptyUserAddressMembers')
                      // assing the values to an array first
                      let userAddressMembersArray = []
                      // get the documents and push them into this array
                      querySnapshot.forEach(function (doc) {
                        let userAddressMember = doc.data()
                        userAddressMembersArray.push(userAddressMember)
                      })
                      // set the members of this address
                      store.commit('setUserAddressMembers', { userAddressMembersArray, addressID })
                    })
                  unsubscribeUserAddressesMonths =
                  db.collection('addresses').doc(addressID).collection('months')
                    .onSnapshot(function (querySnapshot) {
                      // otherwise addressID not defined properly inside the snapshot
                      var addressID = userDataAddressesArray[userDataAddress].uid
                      // empty the subcollection
                      store.commit('emptyUserAddressMonths')
                      // assing the values to an array first
                      let userAddressMonthsArray = []
                      // get the documents and push them into this array
                      querySnapshot.forEach(function (doc) {
                        let userAddressMonth = doc.data()
                        userAddressMonthsArray.push(userAddressMonth)
                      })
                      // set the months of this address
                      store.commit('setUserAddressMonths', { userAddressMonthsArray, addressID })
                    })
                  unsubscribeUserAddressesPersonalList =
                  db.collection('addresses').doc(addressID).collection('personalList')
                    .onSnapshot(function (querySnapshot) {
                      // otherwise addressID not defined properly inside the snapshot
                      var addressID = userDataAddressesArray[userDataAddress].uid
                      // empty the subcollection
                      store.commit('emptyUserAddressPersonalLists', addressID)
                      // assing the values to an array first
                      let userAddressPersonalListsArray = []
                      // get the documents and push them into this array
                      querySnapshot.forEach(function (doc) {
                        let userAddressPersonalList = doc.data()
                        userAddressPersonalListsArray.push(userAddressPersonalList)
                      })
                      // set the personal list of this address
                      store.commit('setUserAddressPersonalLists', { userAddressPersonalListsArray, addressID })
                    })
                }
              })
            unsubscribeUserDataMeals =
            db.collection('users').doc(userID).collection('meals')
              .onSnapshot(function (querySnapshot) {
                // emtpy userData.meals
                store.commit('emptyUserDataMeals')
                // assign the values to an array first
                let userDataMealsArray = []
                // get the documents and push them into the array
                querySnapshot.forEach(function (doc) {
                  let userDataMeal = doc.data()
                  userDataMealsArray.push(userDataMeal)
                })
                // set the meals in userData instead of pushing them sepeartely, doing it all at once now
                store.commit('setUserDataMeals', userDataMealsArray)
              })
            unsubscribeUserDataMealplans =
            db.collection('users').doc(userID).collection('mealplans')
              .onSnapshot(function (querySnapshot) {
                // empty userData
                store.commit('emptyUserDataMealplans')
                // assign the values to an array first
                let userDataMealplansArray = []
                // get the documents and push them into the array
                querySnapshot.forEach(function (doc) {
                  let userDataMealplan = doc.data()
                  userDataMealplansArray.push(userDataMealplan)
                })
                // set the mealplans in userData instead of pushing them sepeartely, doing it all at once now
                store.commit('setUserDataMealplans', userDataMealplansArray)
                // loop through all mealplans to get collections thereof
                for (let userDataMealplan in userDataMealplansArray) {
                  var mealplanID = userDataMealplansArray[userDataMealplan].uid
                  unsubscribeUserDataMealplanFilters =
                  db.collection('users').doc(userID).collection('mealplans').doc(mealplanID).collection('filters')
                    .onSnapshot(function (querySnapshot) {
                      // otherwise mealplanID not defined properly inside the snapshot
                      var mealplanID = userDataMealplansArray[userDataMealplan].uid
                      // empty the values
                      store.commit('emptyUserDataMealplanFilters', mealplanID)
                      // initialize an array
                      let userDataMealplanFiltersArray = []
                      // get the documents in the collection
                      querySnapshot.forEach(function (doc) {
                        let userDataMealplanFilter = doc.data()
                        userDataMealplanFiltersArray.push(userDataMealplanFilter)
                      })
                      // remove breakfast, lunch, and dinner from the array
                      var bld = userDataMealplanFiltersArray.splice(0, 3)
                      var rest = userDataMealplanFiltersArray.splice(0, userDataMealplanFiltersArray.length)
                      // sort the filters alphabetically
                      rest.sort(function (a, b) {
                        var nameA = a.text.toUpperCase() // ignore upper and lowercase
                        var nameB = b.text.toUpperCase() // ignore upper and lowercase
                        if (nameA < nameB) {
                          return -1
                        }
                        if (nameA > nameB) {
                          return 1
                        }
                        // names must be equal
                        return 0
                      })
                      userDataMealplanFiltersArray = bld.concat(rest)
                      // set all filters once the array is complete
                      store.commit('setUserDataMealplanFilters', { userDataMealplanFiltersArray, mealplanID })
                    })
                  unsubscribeUserDataMealplanRecipes =
                  db.collection('users').doc(userID).collection('mealplans').doc(mealplanID).collection('recipes')
                    .onSnapshot(function (querySnapshot) {
                      // otherwise mealplanID not defined properly inside the snapshot
                      var mealplanID = userDataMealplansArray[userDataMealplan].uid
                      // empty the subcollection
                      store.commit('emptyUserDataMealplanRecipes', mealplanID)
                      // assing the values to an array first
                      let userDataMealplanRecipesArray = []
                      // get the documents and push them into this array
                      querySnapshot.forEach(function (doc) {
                        let userDataMealplanRecipe = doc.data()
                        userDataMealplanRecipesArray.push(userDataMealplanRecipe)
                      })
                      // sort the recipes alphabetically
                      userDataMealplanRecipesArray.sort(function (a, b) {
                        var nameA = a.name.toUpperCase() // ignore upper and lowercase
                        var nameB = b.name.toUpperCase() // ignore upper and lowercase
                        if (nameA < nameB) {
                          return -1
                        }
                        if (nameA > nameB) {
                          return 1
                        }
                        // names must be equal
                        return 0
                      })
                      // set the members of this address
                      store.commit('setUserDataMealplanRecipes', { userDataMealplanRecipesArray, mealplanID })
                      // get ingredients in the recipe
                      for (let userDataMealplanRecipe in userDataMealplanRecipesArray) {
                        var recipeID = userDataMealplanRecipesArray[userDataMealplanRecipe].uid
                        unsubscribeUserDataMealplanRecipeIngredients =
                        db.collection('users').doc(userID).collection('mealplans').doc(mealplanID).collection('recipes').doc(recipeID).collection('ingredients')
                          .onSnapshot(function (querySnapshot) {
                            // otherwise mealplanID not defined properly inside the snapshot
                            var mealplanID = userDataMealplansArray[userDataMealplan].uid
                            // otherwise recipeID not defined properly inside the snapshot
                            var recipeID = userDataMealplanRecipesArray[userDataMealplanRecipe].uid
                            // empty the values
                            store.commit('emptyUserDataMealplanRecipeIngredients', { mealplanID, recipeID })
                            // initialize an array
                            let userDataMealplanRecipeIngredientsArray = []
                            // get the documents in the collection
                            querySnapshot.forEach(function (doc) {
                              let userDataMealplanRecipeIngredient = doc.data()
                              userDataMealplanRecipeIngredientsArray.push(userDataMealplanRecipeIngredient)
                            })
                            // sort the filters alphabetically
                            userDataMealplanRecipeIngredientsArray.sort(function (a, b) {
                              var nameA = a.ingredient.toUpperCase() // ignore upper and lowercase
                              var nameB = b.ingredient.toUpperCase() // ignore upper and lowercase
                              if (nameA < nameB) {
                                return -1
                              }
                              if (nameA > nameB) {
                                return 1
                              }
                              // names must be equal
                              return 0
                            })
                            // set all filters once the array is complete
                            store.commit('setUserDataMealplanRecipeIngredient', { userDataMealplanRecipeIngredientsArray, mealplanID, recipeID })
                          })
                      }
                    })
                }
              })
          })
      } else {
        userID = 'default'
        if (unsubscribeUserData) {
          unsubscribeUserData()
          unsubscribeUserDataAddresses()
          unsubscribeUserAddresses()
          unsubscribeUserAddressesMembers()
          unsubscribeUserAddressesMonths()
          unsubscribeUserAddressesPersonalList()
          unsubscribeUserDataMeals()
          unsubscribeUserDataMealplans()
          unsubscribeUserDataMealplanFilters()
          unsubscribeUserDataMealplanRecipes()
          unsubscribeUserDataMealplanRecipeIngredients()
        }
        unsubscribeUserData =
        db.collection('users').doc(userID)
          .onSnapshot(function (doc) {
            // get the data from the user
            let userData = doc.data()
            // set it as state.userData
            store.commit('getUserData', userData)
            // this requires the completetion of the setting of userData because it pushes it into state.userData.addresses
            unsubscribeUserDataAddresses =
            db.collection('users').doc(userID).collection('addresses')
              .onSnapshot(function (querySnapshot) {
                // empty userData
                store.commit('emptyUserDataAddresses')
                // assign the values to an array first
                let userDataAddressesArray = []
                // get the documents and push them into the array
                querySnapshot.forEach(function (doc) {
                  let userDataAddress = doc.data()
                  userDataAddressesArray.push(userDataAddress)
                })
                // set the addresses in userData instead of pushing them sepeartely, doing it all at once now
                store.commit('setUserDataAddresses', userDataAddressesArray)
                // empty userAddresses
                store.commit('emptyUserAddresses')
                for (let userDataAddress in userDataAddressesArray) {
                  var addressID = userDataAddressesArray[userDataAddress].uid
                  unsubscribeUserAddresses =
                  db.collection('addresses').doc(addressID)
                    .onSnapshot(function (doc) {
                      // because its being looped through we don't need any forEach querySnapshots
                      let userAddress = doc.data()
                      // set the addresses in userData instead of pushing them sepeartely, doing it all at once now
                      store.commit('pushUserAddress', userAddress)
                      store.commit('thisWeek')
                      store.commit('createList')
                    })
                  unsubscribeUserAddressesMembers =
                  db.collection('addresses').doc(addressID).collection('members')
                    .onSnapshot(function (querySnapshot) {
                      // otherwise addressID not defined properly inside the snapshot
                      var addressID = userDataAddressesArray[userDataAddress].uid
                      // empty the subcollection
                      store.commit('emptyUserAddressMembers')
                      // assing the values to an array first
                      let userAddressMembersArray = []
                      // get the documents and push them into this array
                      querySnapshot.forEach(function (doc) {
                        let userAddressMember = doc.data()
                        userAddressMembersArray.push(userAddressMember)
                      })
                      // set the members of this address
                      store.commit('setUserAddressMembers', { userAddressMembersArray, addressID })
                    })
                  unsubscribeUserAddressesMonths =
                  db.collection('addresses').doc(addressID).collection('months')
                    .onSnapshot(function (querySnapshot) {
                      // otherwise addressID not defined properly inside the snapshot
                      var addressID = userDataAddressesArray[userDataAddress].uid
                      // empty the subcollection
                      store.commit('emptyUserAddressMonths')
                      // assing the values to an array first
                      let userAddressMonthsArray = []
                      // get the documents and push them into this array
                      querySnapshot.forEach(function (doc) {
                        let userAddressMonth = doc.data()
                        userAddressMonthsArray.push(userAddressMonth)
                      })
                      // set the months of this address
                      store.commit('setUserAddressMonths', { userAddressMonthsArray, addressID })
                    })
                  unsubscribeUserAddressesPersonalList =
                  db.collection('addresses').doc(addressID).collection('personalList')
                    .onSnapshot(function (querySnapshot) {
                      // otherwise addressID not defined properly inside the snapshot
                      var addressID = userDataAddressesArray[userDataAddress].uid
                      // empty the subcollection
                      store.commit('emptyUserAddressPersonalLists', addressID)
                      // assing the values to an array first
                      let userAddressPersonalListsArray = []
                      // get the documents and push them into this array
                      querySnapshot.forEach(function (doc) {
                        let userAddressPersonalList = doc.data()
                        userAddressPersonalListsArray.push(userAddressPersonalList)
                      })
                      // set the personal list of this address
                      store.commit('setUserAddressPersonalLists', { userAddressPersonalListsArray, addressID })
                    })
                }
              })
            unsubscribeUserDataMeals =
            db.collection('users').doc(userID).collection('meals')
              .onSnapshot(function (querySnapshot) {
                // emtpy userData.meals
                store.commit('emptyUserDataMeals')
                // assign the values to an array first
                let userDataMealsArray = []
                // get the documents and push them into the array
                querySnapshot.forEach(function (doc) {
                  let userDataMeal = doc.data()
                  userDataMealsArray.push(userDataMeal)
                })
                // set the meals in userData instead of pushing them sepeartely, doing it all at once now
                store.commit('setUserDataMeals', userDataMealsArray)
              })
            unsubscribeUserDataMealplans =
            db.collection('users').doc(userID).collection('mealplans')
              .onSnapshot(function (querySnapshot) {
                // empty userData
                store.commit('emptyUserDataMealplans')
                // assign the values to an array first
                let userDataMealplansArray = []
                // get the documents and push them into the array
                querySnapshot.forEach(function (doc) {
                  let userDataMealplan = doc.data()
                  userDataMealplansArray.push(userDataMealplan)
                })
                // set the mealplans in userData instead of pushing them sepeartely, doing it all at once now
                store.commit('setUserDataMealplans', userDataMealplansArray)
                // loop through all mealplans to get collections thereof
                for (let userDataMealplan in userDataMealplansArray) {
                  var mealplanID = userDataMealplansArray[userDataMealplan].uid
                  unsubscribeUserDataMealplanFilters =
                  db.collection('users').doc(userID).collection('mealplans').doc(mealplanID).collection('filters')
                    .onSnapshot(function (querySnapshot) {
                      // otherwise mealplanID not defined properly inside the snapshot
                      var mealplanID = userDataMealplansArray[userDataMealplan].uid
                      // empty the values
                      store.commit('emptyUserDataMealplanFilters', mealplanID)
                      // initialize an array
                      let userDataMealplanFiltersArray = []
                      // get the documents in the collection
                      querySnapshot.forEach(function (doc) {
                        let userDataMealplanFilter = doc.data()
                        userDataMealplanFiltersArray.push(userDataMealplanFilter)
                      })
                      // remove breakfast, lunch, and dinner from the array
                      var bld = userDataMealplanFiltersArray.splice(0, 3)
                      var rest = userDataMealplanFiltersArray.splice(0, userDataMealplanFiltersArray.length)
                      // sort the filters alphabetically
                      rest.sort(function (a, b) {
                        var nameA = a.text.toUpperCase() // ignore upper and lowercase
                        var nameB = b.text.toUpperCase() // ignore upper and lowercase
                        if (nameA < nameB) {
                          return -1
                        }
                        if (nameA > nameB) {
                          return 1
                        }
                        // names must be equal
                        return 0
                      })
                      userDataMealplanFiltersArray = bld.concat(rest)
                      // set all filters once the array is complete
                      store.commit('setUserDataMealplanFilters', { userDataMealplanFiltersArray, mealplanID })
                    })
                  unsubscribeUserDataMealplanRecipes =
                  db.collection('users').doc(userID).collection('mealplans').doc(mealplanID).collection('recipes')
                    .onSnapshot(function (querySnapshot) {
                      // otherwise mealplanID not defined properly inside the snapshot
                      var mealplanID = userDataMealplansArray[userDataMealplan].uid
                      // empty the subcollection
                      store.commit('emptyUserDataMealplanRecipes', mealplanID)
                      // assing the values to an array first
                      let userDataMealplanRecipesArray = []
                      // get the documents and push them into this array
                      querySnapshot.forEach(function (doc) {
                        let userDataMealplanRecipe = doc.data()
                        userDataMealplanRecipesArray.push(userDataMealplanRecipe)
                      })
                      // sort the recipes alphabetically
                      userDataMealplanRecipesArray.sort(function (a, b) {
                        var nameA = a.name.toUpperCase() // ignore upper and lowercase
                        var nameB = b.name.toUpperCase() // ignore upper and lowercase
                        if (nameA < nameB) {
                          return -1
                        }
                        if (nameA > nameB) {
                          return 1
                        }
                        // names must be equal
                        return 0
                      })
                      // set the members of this address
                      store.commit('setUserDataMealplanRecipes', { userDataMealplanRecipesArray, mealplanID })
                      // get ingredients in the recipe
                      for (let userDataMealplanRecipe in userDataMealplanRecipesArray) {
                        var recipeID = userDataMealplanRecipesArray[userDataMealplanRecipe].uid
                        unsubscribeUserDataMealplanRecipeIngredients =
                        db.collection('users').doc(userID).collection('mealplans').doc(mealplanID).collection('recipes').doc(recipeID).collection('ingredients')
                          .onSnapshot(function (querySnapshot) {
                            // otherwise mealplanID not defined properly inside the snapshot
                            var mealplanID = userDataMealplansArray[userDataMealplan].uid
                            // otherwise recipeID not defined properly inside the snapshot
                            var recipeID = userDataMealplanRecipesArray[userDataMealplanRecipe].uid
                            // empty the values
                            store.commit('emptyUserDataMealplanRecipeIngredients', { mealplanID, recipeID })
                            // initialize an array
                            let userDataMealplanRecipeIngredientsArray = []
                            // get the documents in the collection
                            querySnapshot.forEach(function (doc) {
                              let userDataMealplanRecipeIngredient = doc.data()
                              userDataMealplanRecipeIngredientsArray.push(userDataMealplanRecipeIngredient)
                            })
                            // sort the filters alphabetically
                            userDataMealplanRecipeIngredientsArray.sort(function (a, b) {
                              var nameA = a.ingredient.toUpperCase() // ignore upper and lowercase
                              var nameB = b.ingredient.toUpperCase() // ignore upper and lowercase
                              if (nameA < nameB) {
                                return -1
                              }
                              if (nameA > nameB) {
                                return 1
                              }
                              // names must be equal
                              return 0
                            })
                            // set all filters once the array is complete
                            store.commit('setUserDataMealplanRecipeIngredient', { userDataMealplanRecipeIngredientsArray, mealplanID, recipeID })
                          })
                      }
                    })
                }
              })
          })
      }
    })
  },
  computed: {
    ...mapState([
      'currentPage',
      'userData',
      'rerender'
    ])
  }
}
</script>

<style>
#app {
  position: absolute;
  top: 0;
  left: 0;
  height: auto;
  width: 100%;
  font-size: 14px;
  font-family: Montserrat;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: white;
}
div {
  -webkit-user-select: none; /* Safari 3.1+ */
  -moz-user-select: none; /* Firefox 2+ */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
}
input {
  border-radius: 0;
  overflow: visible;
}
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20%);
  }
  to {
    opacity: 1;
    transform: translateX(0%);
  }
}
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20%);
  }
  to {
    opacity: 1;
    transform: translateX(0%);
  }
}
@keyframes expandDown {
  from {
    opacity: .6;
    height: 0%;
  }
  to {
    opacity: 1;
    height: calc(100% - 40px);
  }
}
@keyframes expandUp {
  from {
    bottom: 0;
    height: 0;
  }
  to {
    bottom: 0;
    height: calc(100% - 40px);
  }
}
@keyframes slideOutUp {
  from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(-100%);
  }
}
@keyframes slideInUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0%);
  }
}
@keyframes slideOutDown {
  from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(100%);
  }
}
@keyframes slideInDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0%);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes shadow {
  from {
    text-shadow: 0px 0px 0;
  }
  to {
    text-shadow: 2px 2px 8px lightpink;
  }
}
@keyframes expand {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: opacity .8s, transform .8s;
}
.slide-enter {
  opacity: 0;
  transform: translateX(30%);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}/* Change Autocomplete styles in Chrome*/
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-text-fill-color: darkgrey;
  -webkit-box-shadow: 0 0 0px 1000px rgba(123, 251, 119, 0.20) inset;
  transition: background-color 5000s ease-in-out 0s;
}
input:invalid {
    box-shadow: none;
}
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
</style>
