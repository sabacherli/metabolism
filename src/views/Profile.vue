<template lang="html">
  <div class="container">
    <div class="animated" v-if="profileFilters[0].isActive" style="padding-bottom: 100px">
      <div class="">
        <div class="box" @click="updateCalories(); removeFocus()">
          <img class="edit_icon" src="../assets/icon-edit.png" alt="Edit">
        </div>
        <p class="dayname">Daily Calorie Intake</p>
        <div class="ingredients_break">

        </div>
        <div class="" align="left">
          <label for="">Kcal</label>
          <input class="amount" type="number" min="1" max="20000" autocomplete="off" v-model="userData.calories" @keyup.enter="updateCalories(); removeFocus()">
          <br>
        </div>
        <div class="purchase_button" @click="updateCalories(); removeFocus()" style="margin-top: 20px">
          <span class="purchase_text">Update Calories</span>
        </div>
      </div>
      <div class="">
        <div class="box" @click="updateLength(); removeFocus()">
          <img class="edit_icon" src="../assets/icon-edit.png" alt="Edit">
        </div>
        <p class="dayname">Shopping List Length</p>
        <div class="ingredients_break">

        </div>
        <div class="" align="left">
          <label for="">Days</label>
          <input class="amount" type="number" min="1" max="365" autocomplete="off" v-model="userData.shoppingListLength" @keyup.enter="updateLength(); removeFocus()">
          <br>
        </div>
        <div class="purchase_button" @click="updateLength(); removeFocus()" style="margin-top: 20px">
          <span class="purchase_text">Update Length</span>
        </div>
      </div>
      <div class="">
        <div class="box" @click="updateEmail(); removeFocus()">
          <img class="edit_icon" src="../assets/icon-edit.png" alt="Edit">
        </div>
        <p class="dayname">Email</p>
        <div class="ingredients_break">

        </div>
        <div class="" align="left">
          <label for="">New Email</label>
          <input class="amount" type="text" name="" value="" v-model="userData.email" @keyup.enter="updateEmail()">
          <br>
          <label for="">Enter Password</label>
          <input class="amount" type="password" v-model="emailPassword" autocomplete="off" @keyup.enter="updateEmail(); removeFocus()" required>
          <br>
        </div>
        <div class="purchase_button" @click="updateEmail(); removeFocus()" style="margin-top: 20px">
          <span class="purchase_text">Update Email</span>
        </div>
      </div>
      <div class="">
        <div class="box" @click="updatePassword()">
          <img class="edit_icon" src="../assets/icon-edit.png" alt="Edit">
        </div>
        <p class="dayname">Password</p>
        <div class="ingredients_break">

        </div>
        <div class="" align="left">
          <form autocomplete="off" method="post">
            <label for="">Old Password</label>
            <!-- Email input field required for accessibility reasons -->
            <input style="display: none" type="text" autocomplete="off" required>
            <input class="amount" type="password" v-model="oldPassword" autocomplete="off" readonly onfocus="this.removeAttribute('readonly');" oncopy="return false" ondrag="return false" ondrop="return false" onpaste="return false" oncontextmenu="return false" required>
          </form>
          <br>
        </div>
        <div class="" align="left">
          <form method="post">
            <label for="">New Password</label>
            <!-- Email input field required for accessibility reasons -->
            <input style="display: none" autocomplete="username" type="text" required>
            <input class="amount" type="password" v-model="newPassword" autocomplete="new-password" required>
          </form>
          <br>
        </div>
        <div class="" align="left">
          <form method="post">
            <label for="">Confirm Password</label>
            <!-- Email input field required for accessibility reasons -->
            <input style="display: none" autocomplete="username" type="text" required>
            <input class="amount" type="password" v-model="checkPassword" @keyup.enter="updatePassword(); removeFocus()" autocomplete="new-password" required>
          </form>
          <br>
        </div>
        <div class="purchase_button" @click="updatePassword(); removeFocus()" style="margin-top: 20px">
          <span class="purchase_text">Update Password</span>
        </div>
      </div>
      <div class="" style="margin-bottom: 100px">
        <div class="box" @click="deleteAccount(); removeFocus()">
          <p class="sign" style="transform: rotate(45deg)">+</p>
        </div>
        <p class="dayname">Delete Account</p>
        <div class="ingredients_break">

        </div>
        <div class="" align="left">
          <form method="post">
            <label for="">Enter Password</label>
            <input class="amount" type="password" v-model="deleteConfirmation" autocomplete="off" @keyup.enter="deleteAccount()" required>
            <br>
          </form>
        </div>
        <div class="purchase_button" @click="deleteAccount(); removeFocus()" style="margin-top: 20px">
          <span class="purchase_text">Confirm</span>
        </div>
      </div>
    </div>
    <div class="animated" v-if="profileFilters[1].isActive" style="padding-bottom: 100px">
      <template v-for="(place, index) in userData.addresses">
        <!-- eslint-disable-next-line -->
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
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in userAddresses[index].months.slice(4,8)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in userAddresses[index].months.slice(8,12)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
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
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in userAddresses[index].months.slice(16,20)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in userAddresses[index].months.slice(20,24)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
              </template>
            </div>
            <p class="year_date price">{{ price }} CHF</p>
            <div class="purchase_button" @click="addMonths(index)">
              <span class="purchase_text">Purchase Months</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="animated" v-if="profileFilters[2].isActive" style="padding-bottom: 100px">
      <template v-for="(place, index) in userData.addresses">
        <!-- eslint-disable-next-line -->
        <div class="box" @click="deletePlace(place, index)">
          <p class="sign" style="transform: rotate(45deg)">+</p>
        </div>
        <!-- eslint-disable-next-line -->
        <div class="set_default" @click="setDefaultAddress(place)">
          <!-- eslint-disable-next-line -->
          <p class="dayname"> {{ place.name }} </p>
          <div class="box_default" v-if="!place.isDefault">
            <span class="text_default">Set this to your default place</span>
          </div>
        </div>
          <!-- eslint-disable-next-line -->
        <div class="box_default" v-if="place.isDefault">
          DEFAULT
        </div>
        <!-- eslint-disable-next-line -->
        <div class="ingredients_break">

        </div>
        <!-- eslint-disable-next-line -->
        <div class="" align="left">
          <label for="">Edit Name</label>
          <input class="amount" type="text" name="" value="" v-model="place.name" @keyup.enter="updatePlace(place); removeFocus()" required>
          <br>
        </div>
        <!-- eslint-disable-next-line -->
        <div class="purchase_button" @click="updatePlace(place); removeFocus()" style="margin-top: 20px; margin-bottom: 40px">
          <span class="purchase_text">Edit Name</span>
        </div>
        <!-- eslint-disable-next-line -->
        <div class="" v-if="checkOwner(index)">
          <template v-for="member in userAddresses[index].members">
            <!-- eslint-disable-next-line -->
            <div class="" align="left">
              <div v-if="member.role != 'Owner'">
                <span class="sign_remove" @click="deleteMember(member, place)">+</span>
              </div>
              <!-- eslint-disable-next-line -->
              <label>{{ member.role }}</label>
              <!-- eslint-disable-next-line -->
              <input class="amount" type="text" @keyup.enter="removeFocus()" v-model="member.email" readonly required>
              <!-- eslint-disable-next-line -->
              <br>
            </div>
          </template>
          <div class="" align="left">
            <label for="">Add Member</label>
            <input class="amount" type="text" name="" value="" @keyup.enter="addMember(place)" v-model="newMember" required>
            <br>
          </div>
          <div class="purchase_button" @click="addMember(place)" style="margin-top: 20px">
            <span class="purchase_text">Add Member</span>
          </div>
        </div>
        <!-- eslint-disable-next-line -->
        <div class="" align="left" v-else>
          <template v-for="member in userAddresses[index].members">
            <!-- eslint-disable-next-line -->
            <label>{{ member.role }}</label>
            <!-- eslint-disable-next-line -->
            <input class="amount" type="text" @keyup.enter="removeFocus()" v-model="member.email" required>
            <!-- eslint-disable-next-line -->
            <br>
          </template>
        </div>
      </template>
      <div class="" style="margin-bottom: 100px">
        <div class="box" @click="addPlace()">
          <p class="sign">+</p>
        </div>
        <p class="dayname">New Place</p>
        <div class="ingredients_break">

        </div>
        <div class="">
          <div class="" align="left">
            <label for="dayname">New Place</label>
            <input id="newPlace" class="amount" type="text" @keyup.enter="addPlace()" v-model="newPlace">
          </div>
          <br>
          <div class="purchase_button" @click="addPlace()" style="margin-top: 20px">
            <span class="purchase_text">Add Place</span>
          </div>
        </div>
      </div>
    </div>
    <div class="animated" v-if="profileFilters[3].isActive" style="padding-bottom: 100px">
      <template v-for="filter in userData.mealplans[0].filters">
        <!-- eslint-disable-next-line -->
        <div class="box" @click="deleteFilter(filter)">
          <p class="sign" style="transform: rotate(45deg)">+</p>
        </div>
        <!-- eslint-disable-next-line -->
        <p class="dayname"> {{ filter.text }} </p>
        <!-- eslint-disable-next-line -->
        <div class="ingredients_break">

        </div>
        <!-- eslint-disable-next-line -->
        <div class="" align="left">
          <label for="">Edit Filter</label>
          <input class="amount" type="text" name="" value="" @keyup.enter="updateFilter(filter)" v-model="filter.text" required>
          <br>
        </div>
        <!-- eslint-disable-next-line -->
        <div class="purchase_button" @click="updateFilter(filter)" style="margin-top: 20px">
          <span class="purchase_text">Update Filter</span>
        </div>
      </template>
      <div class="" style="margin-bottom: 100px">
        <div class="box">
          <p class="sign" @click="addFilter(newFilter)">+</p>
        </div>
        <p class="dayname">New Filter</p>
        <div class="ingredients_break">

        </div>
        <div class="" align="left">
          <label for="">New Filter</label>
          <input class="amount" id="newFilter" type="text" name="" value="" @keyup.enter="addFilter(newFilter)" v-model="newFilter" required>
        </div>
        <div class="purchase_button" @click="addFilter(newFilter)" style="margin-top: 40px">
          <span class="purchase_text">Add Filter</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import db from '@/database.js'
import moment from 'moment'
import store from '../store'
import router from '../router'

export default {
  name: 'Profile',
  created () {
    store.commit('setPage', 'profile')
  },
  data () {
    return {
      newFilter: '',
      newPlace: '',
      newMember: '',
      emailPassword: '',
      oldPassword: '',
      newPassword: '',
      checkPassword: '',
      deleteConfirmation: '',
      currentYear: moment().format('YYYY')
    }
  },
  computed: {
    ...mapState([
      'profileFilters',
      'userData',
      'userAddresses',
      'price'
    ])
    // userEmail: {
    //   get () {
    //     return store.state.userData.email
    //   },
    //   set (value) {
    //     store.commit('syncUserEmail', value)
    //   }
    // },
    // shoppingListLength: {
    //   get () {
    //     return store.state.userData.shoppingListLength
    //   },
    //   set (value) {
    //     store.commit('syncShoppingListLength', value)
    //   }
    // },
    // calories: {
    //   get () {
    //     return store.state.userData.calories
    //   },
    //   set (value) {
    //     store.commit('syncCalories', value)
    //   }
    // }
  },
  methods: {
    ...mapMutations([
      'toggleSelected',
      'calcPrice',
      'addMonths',
      'setDefaultAddress'
    ]),
    updateCalories () {
      var userData = this.userData
      var oldCalories = null
      db.collection('users').doc(userData.uid)
        .get()
        .then(function (doc) {
          oldCalories = doc.data().calories
          var calorieRatio = userData.calories / oldCalories
          for (let mealplan in userData.mealplans) {
            var mealplanID = userData.mealplans[mealplan].uid
            for (let recipe in userData.mealplans[mealplan].recipes) {
              var recipeID = userData.mealplans[mealplan].recipes[recipe].uid
              for (let ingredient in userData.mealplans[mealplan].recipes[recipe].ingredients) {
                var ingredientID = userData.mealplans[mealplan].recipes[recipe].ingredients[ingredient].uid
                var newAmount = userData.mealplans[mealplan].recipes[recipe].ingredients[ingredient].amount * calorieRatio
                db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplanID).collection('recipes').doc(recipeID).collection('ingredients').doc(ingredientID).update({
                  amount: newAmount
                })
              }
            }
          }
        })
      db.collection('users').doc(userData.uid).update({
        calories: Number(userData.calories)
      })
      for (var address in userData.addresses) {
        db.collection('addresses').doc(userData.addresses[address].uid).collection('members').doc(userData.uid).update({
          calories: Number(userData.calories)
        })
      }
    },
    updateLength () {
      db.collection('users').doc(this.userData.uid).update({
        shoppingListLength: Number(this.userData.shoppingListLength)
      })
    },
    updateEmail () {
      const user = firebase.auth().currentUser
      db.collection('users').doc(this.userData.uid).update({
        'email': this.userData.email
      })
      for (let a in this.userAddresses) {
        db.collection('addresses').doc(this.userAddresses[a].address).collection('members').doc(this.userData.uid).update({
          'email': this.userData.email
        })
      }
      var newEmail = this.userData.email
      var emailPassword = this.emailPassword
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        emailPassword
      )
      user.reauthenticateAndRetrieveDataWithCredential(credential)
        .then(function () {
          // User re-authenticated.
          user.updateEmail(newEmail)
            .then(function () {
              // Update successful.
              console.log('Email successfully updated!')
            })
            .catch(function (error) {
              console.log('There is still an error occuring.', error)
            })
        })
        .catch(function (error) {
          // An error happened.
          console.log('Error: ', error)
        })
    },
    updatePassword () {
      const user = firebase.auth().currentUser
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        this.oldPassword
      )
      user.reauthenticateAndRetrieveDataWithCredential(credential)
        .then(function () {
          if (this.checkPassword === this.newPassword) {
            var newPassword = this.newPassword
          } else {
            alert('The new password cannot be empty.')
          }
          user.updatePassword(newPassword)
            .then(function () {
              // Update successful.
              console.log('A new password is set.')
            })
            .catch(function (error) {
              // An error happened.
              console.log(error.message)
            })
          this.oldPassword = ''
          this.newPassword = ''
          this.checkPassword = ''
        })
        .catch(function (error) {
          alert(error)
          console.log('Error: ', error)
        })
    },
    deleteAccount () {
      if (confirm('Are you sure you want to remove this place?')) {
        const userData = this.userData
        const userAddresses = this.userAddresses
        const user = firebase.auth().currentUser
        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          this.deleteConfirmation
        )
        user.reauthenticateAndRetrieveDataWithCredential(credential)
          .then(function () {
            user.delete()
            store.commit('setPage', 'register')
            router.push('/register')
            for (var address in userAddresses) {
              var isOwner = false
              var batch = db.batch()
              for (let member in userAddresses[address].members) {
                if (userAddresses[address].members[member].role === 'Owner' && userAddresses[address].members[member].uid === userData.uid) {
                  isOwner = true
                }
              }
              if (isOwner) {
                new Promise(function (resolve, reject) {
                  for (let member in userAddresses[address].members) {
                    var addressRef = db.collection('users').doc(userAddresses[address].members[member].uid).collection('addresses').doc(userAddresses[address].uid)
                    batch.delete(addressRef)
                  }
                  resolve()
                })
                  .then(function () {
                    new Promise(function (resolve, reject) {
                      db.collection('addresses').doc(userAddresses[address].uid).collection('calendar')
                        .onSnapshot(function (querySnapshot) {
                          querySnapshot.forEach(function (doc) {
                            var calendarRef = db.collection('addresses').doc(userAddresses[address].uid).collection('calendar').doc(doc.id)
                            batch.delete(calendarRef)
                          })
                          resolve()
                        })
                    })
                      .then(function () {
                        new Promise(function (resolve, reject) {
                          db.collection('addresses').doc(userAddresses[address].uid).collection('members')
                            .onSnapshot(function (querySnapshot) {
                              querySnapshot.forEach(function (doc) {
                                var memberRef = db.collection('addresses').doc(userAddresses[address].uid).collection('members').doc(doc.id)
                                batch.delete(memberRef)
                              })
                              resolve()
                            })
                        })
                          .then(function () {
                            new Promise(function (resolve, reject) {
                              db.collection('addresses').doc(userAddresses[address].uid).collection('months')
                                .onSnapshot(function (querySnapshot) {
                                  querySnapshot.forEach(function (doc) {
                                    var monthRef = db.collection('addresses').doc(userAddresses[address].uid).collection('months').doc(doc.id)
                                    batch.delete(monthRef)
                                  })
                                  resolve()
                                })
                            })
                              .then(function () {
                                new Promise(function (resolve, reject) {
                                  var docRef = db.collection('addresses').doc(userAddresses[address].uid)
                                  batch.delete(docRef)
                                  resolve()
                                })
                                  .then(function () {
                                    batch.commit()
                                  })
                              })
                          })
                      })
                  })
              } else {
                batch.delete(db.collection('addresses').doc(userAddresses[address].uid).collection('members').doc(userData.uid))
                batch.delete(db.collection('users').doc(userData.uid).collection('addresses').doc(userAddresses[address].uid))
                batch.commit()
              }
            }
            new Promise(function (resolve, reject) {
              for (var recipe in userData.mealplans[0].recipes) {
                db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('recipes').doc(userData.mealplans[0].recipes[recipe].uid).collection('ingredients')
                  .onSnapshot(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                      db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('recipes').doc(userData.mealplans[0].recipes[recipe].uid).collection('ingredients').doc(doc.id).delete()
                    })
                    db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('recipes').doc(userData.mealplans[0].recipes[recipe].uid).delete()
                  })
              }
              resolve()
            })
              .then(function () {
                new Promise(function (resolve, reject) {
                  db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('filters')
                    .onSnapshot(function (querySnapshot) {
                      querySnapshot.forEach(function (doc) {
                        db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('filters').doc(doc.id).delete()
                      })
                      db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).delete()
                    })
                  db.collection('users').doc(userData.uid).collection('calendar')
                    .onSnapshot(function (querySnapshot) {
                      querySnapshot.forEach(function (doc) {
                        db.collection('users').doc(userData.uid).collection('calendar').doc(doc.id).delete()
                      })
                    })
                  resolve()
                })
                  .then(function () {
                    db.collection('users').doc(userData.uid).delete()
                  })
              })
          })
      }
    },
    updatePlace (place) {
      db.collection('users').doc(this.userData.uid).collection('addresses').doc(place.uid).update({
        name: place.name
      })
    },
    removeFocus () {
      const placesList = document.getElementsByClassName('editPlace')
      for (let p = 0; p < placesList.length; p++) {
        placesList[p].blur()
      }
    },
    checkOwner (index) {
      for (let role = 0; role < this.userAddresses[index].members.length; role++) {
        if (this.userAddresses[index].members[role].role === 'Owner' && this.userAddresses[index].members[role].uid === this.userData.uid) {
          return true
        }
      }
    },
    addMember (place) {
      const ownerEmail = this.userData.email
      const memberEmail = this.newMember
      db.collection('users').where('email', '==', this.newMember)
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            var memberID = doc.id
            db.collection('users').doc(doc.id).collection('addresses').doc(place.uid).set({
              uid: place.uid,
              isActive: false,
              isDefault: false,
              name: 'Invited by ' + ownerEmail
            })
            db.collection('addresses').doc(place.uid).collection('members').doc(memberID).set({
              email: memberEmail,
              role: 'Member',
              uid: memberID,
              calories: doc.data().calories
            })
          })
        })
      this.newMember = ''
    },
    deleteMember (member, place) {
      if (confirm('Are you sure you wan to remove this member?')) {
        db.collection('addresses').doc(place.uid).collection('members').doc(member.uid).delete()
        db.collection('users').doc(member.uid).collection('addresses').doc(place.uid).delete()
      }
    },
    addPlace () {
      if (this.newPlace !== '') {
        var userData = this.userData
        var newPlace = this.newPlace
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
            db.collection('addresses').doc(address.id).collection('members').doc(userData.uid).set({
              email: userData.email,
              role: 'Owner',
              uid: userData.uid,
              calories: userData.calories
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
            db.collection('users').doc(userData.uid).collection('addresses').doc(address.id).set({
              name: newPlace,
              isActive: false,
              isDefault: false,
              uid: address.id
            })
          })
        this.newPlace = ''
        document.getElementById('newPlace').focus()
      }
    },
    deletePlace (place, index) {
      if (confirm('Are you sure you want to remove this place?')) {
        console.log(1)
        var userData = this.userData
        var userAddresses = this.userAddresses
        var isOwner = false
        var batch = db.batch()
        for (let member in userAddresses[index].members) {
          if (userAddresses[index].members[member].role === 'Owner' && userAddresses[index].members[member].uid === userData.uid) {
            isOwner = true
          }
        }
        if (isOwner) {
          console.log(2)
          new Promise(function (resolve, reject) {
            for (let member in userAddresses[index].members) {
              var addressRef = db.collection('users').doc(userAddresses[index].members[member].uid).collection('addresses').doc(place.uid)
              batch.delete(addressRef)
            }
            resolve()
          })
            .then(function () {
              new Promise(function (resolve, reject) {
                db.collection('addresses').doc(place.uid).collection('calendar')
                  .onSnapshot(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                      var calendarRef = db.collection('addresses').doc(place.uid).collection('calendar').doc(doc.id)
                      batch.delete(calendarRef)
                    })
                    resolve()
                  })
              })
                .then(function () {
                  new Promise(function (resolve, reject) {
                    db.collection('addresses').doc(place.uid).collection('members')
                      .onSnapshot(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                          var memberRef = db.collection('addresses').doc(place.uid).collection('members').doc(doc.id)
                          batch.delete(memberRef)
                        })
                        resolve()
                      })
                  })
                    .then(function () {
                      new Promise(function (resolve, reject) {
                        db.collection('addresses').doc(place.uid).collection('months')
                          .onSnapshot(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                              var monthRef = db.collection('addresses').doc(place.uid).collection('months').doc(doc.id)
                              batch.delete(monthRef)
                            })
                            resolve()
                          })
                      })
                        .then(function () {
                          new Promise(function (resolve, reject) {
                            var docRef = db.collection('addresses').doc(place.uid)
                            batch.delete(docRef)
                            resolve()
                          })
                            .then(function () {
                              batch.commit()
                            })
                        })
                        .catch(function (error) {
                          console.log('Error: ', error)
                        })
                    })
                    .catch(function (error) {
                      console.log('Error: ', error)
                    })
                })
                .catch(function (error) {
                  console.log('Error: ', error)
                })
            })
            .catch(function (error) {
              console.log('Error: ', error)
            })
        } else {
          console.log(3)
          batch.delete(db.collection('addresses').doc(place.uid).collection('members').doc(userData.uid))
          batch.delete(db.collection('users').doc(userData.uid).collection('addresses').doc(place.uid))
        }
      }
    },
    addFilter (newFilter) {
      if (this.newFilter !== '') {
        var userData = this.userData
        db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('filters').add({
          text: newFilter,
          isActive: false,
          isRequired: false,
          uid: ''
        })
          .then(function (filter) {
            db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('filters').doc(filter.id).update({
              uid: filter.id
            })
          })
        this.newFilter = ''
        document.getElementById('newFilter').focus()
      } else {
        alert('Add a filter first.')
      }
    },
    updateFilter (filter) {
      var userData = this.userData
      db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('filters').doc(filter.uid).update({
        text: filter.text
      })
    },
    deleteFilter (filter) {
      var userData = this.userData
      db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('filters').doc(filter.uid).delete()
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
.box_default {
  position: relative;
  top: -45px;
  left: 50%;
  transform: translateX(-50%);
  height: auto;
  width: 35px;
  text-align: center;
  font-size: 0.5em;
  letter-spacing: .1em;
  padding: 3px;
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
.sign_remove {
  position: absolute;
  display: inline-block;
  left: 50%;
  transform: translateX(-100px) rotate(45deg);
  margin-top: 42px;
  width: 100px;
  font-size: 25px;
}
.past {
  position: relative;
  top: -43px;
  left: 50%;
  width: 53px;
  border: 1px solid black;
  transform: rotate(-40.5deg) translateX(-65%);
}
.dayname {
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 50px;
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
  animation-delay: .4s;
  animation-fill-mode: forwards;
  opacity: 0;
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
.inline_date_selected {
  font-weight: 400;
  border: 1.4px solid black;
  border-radius: 20px 20px;
}
input[type=text].amount,
input[type=number].amount,
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
input[type=text]:focus.amount,
input[type=number].amount,
input[type=password]:focus.amount  {
  position: relative;
  display: block;
  width: 120px;
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: black;
  border-bottom-width: 2px;
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
.year_date {
  font-weight: 500;
}
.price {
  margin-top: 40px;
  background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.edit_icon {
  position: absolute;
  height: 20px;
  width: 20px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.text_default {
  position: absolute;
  opacity: 0;
  z-index: 20;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  text-align: center;
  color: #fff;
  border-radius: 6px;
  background-color: black;
  padding: 5px 0;
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
}
@media (hover:hover) {
  .purchase_button:hover {
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
    transition: .2s;
  }
  .inline_date:hover {
    cursor: pointer;
  }
  .box:hover {
    cursor: pointer;
  }
  .box:hover .sign {
    transform: rotate(270deg);
  }
  .sign_remove:hover {
    cursor: pointer;
  }
  .set_default:hover {
    cursor: pointer;
  }
  .set_default:hover .text_default {
    opacity: 1;
    transition: .8s ease-in-out;
  }
}
</style>
