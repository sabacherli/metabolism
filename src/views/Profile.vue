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
        <div class="box" @click="updateLength(); removeFocus()">
          <img class="edit_icon" src="../assets/icon-edit.png" alt="Edit">
        </div>
        <p class="dayname">Displayed Meals</p>
        <div class="ingredients_break">

        </div>
        <!-- eslint-disable-next-line -->
        <div class="meal_container" v-for="meal in userData.meals" @click="toggleMeal(meal)">
          <div :key="meal.uid" class="meal">{{ meal.text }}</div>
          <div :class="{ meal_selected_black: meal.isActive, meal_selected_white: !meal.isActive }"></div>
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
          <input class="amount" type="text" v-model="userData.email" @keyup.enter="updateEmail()">
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
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased, inline_date_past: Number(month.month) < currentMonth }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in userAddresses[index].months.slice(4,8)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased, inline_date_past: Number(month.month) < currentMonth }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in userAddresses[index].months.slice(8,12)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased, inline_date_past: Number(month.month) < currentMonth }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
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
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased, inline_date_past: Number(month.month) < currentMonth }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in userAddresses[index].months.slice(16,20)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased, inline_date_past: Number(month.month) < currentMonth }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in userAddresses[index].months.slice(20,24)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased, inline_date_past: Number(month.month) < currentMonth }" class="inline_date" @click="toggleSelected(month); calcPrice(index)">{{ month.display }}</p>
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
          <input class="amount" type="text" v-model="place.name" @keyup.enter="updatePlace(place); removeFocus()" required>
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
            <input class="amount" type="text" @keyup.enter="addMember(place)" v-model="newMember" required>
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
      <template v-for="filter in filteredMealplans()">
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
          <input class="amount" type="text" @keyup.enter="updateFilter(filter)" v-model="filter.text" required>
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
          <input class="amount" id="newFilter" type="text" @keyup.enter="addFilter(newFilter)" v-model="newFilter" required>
        </div>
        <div class="purchase_button" @click="addFilter(newFilter)" style="margin-top: 40px">
          <span class="purchase_text">Add Filter</span>
        </div>
      </div>
      <div class="">
        <template v-for="mealplan in userData.mealplans">
          <!-- eslint-disable-next-line -->
          <div v-if="userData.mealplans.length > 1">
            <!-- eslint-disable-next-line -->
            <div v-if="mealplan.isActive" class="mealplan_button" @click="dropdownMealplans()">
              <span class="mealplan_text"> {{ mealplan.name }} </span>
            </div>
            <div v-if="!mealplan.isActive" class="other_mealplans" @click="selectMealplan(mealplan)">
              <span class="add_text"> {{ mealplan.name }} </span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="animated" v-if="profileFilters[4].isActive" style="padding-bottom: 100px">
      <div class="">
        <div class="box" @click="goDiscover()">
          <img class="edit_icon" src="../assets/icons8-binoculars-52.png" alt="Edit">
        </div>
        <p class="dayname">Discover Meal Plans</p>
        <div class="ingredients_break">

        </div>
        <div class="mealplan_explanation" align="left">
          <p>Discover pre-made meal plans to alleviate you from the burden of adding your own recipes.</p>
          <br>
        </div>
        <div class="purchase_button" @click="goDiscover()" style="margin-top: 20px">
          <span class="purchase_text">Discover Meal Plans</span>
        </div>
      </div>
      <template v-for="mealplan in userData.mealplans">
        <!-- eslint-disable-next-line -->
        <div class="box" @click="deleteMealplan(mealplan)">
          <p class="sign" style="transform: rotate(45deg)">+</p>
        </div>
        <!-- eslint-disable-next-line -->
        <p class="dayname"> {{ mealplan.name }} </p>
        <!-- eslint-disable-next-line -->
        <div class="ingredients_break">

        </div>
        <!-- eslint-disable-next-line -->
        <div class="" align="left">
          <label for="">Meal Plan Name</label>
          <input class="amount" type="text" @keyup.enter="updateMealplan(mealplan)" v-model="mealplan.name" required>
          <br>
        </div>
        <!-- eslint-disable-next-line -->
        <div v-if="mealplan.isPublic" class="purchase_button" @click="updateMealplan(mealplan)" style="margin-top: 20px">
          <span class="purchase_text">Update Name</span>
        </div>
        <!-- eslint-disable-next-line -->
        <div class="" align="left" style="margin-top: 40px">
          <label for="">ID</label>
          <input class="amount" type="text" v-model="mealplan.uid" readonly>
          <br>
        </div>
        <!-- eslint-disable-next-line -->
        <div v-if="mealplan.isPublic" class="" align="left">
          <label for="">Public Name</label>
          <input class="amount" type="text" v-model="mealplan.publicName" required>
          <br>
        </div>
        <!-- eslint-disable-next-line -->
        <div v-if="mealplan.isPublic" class="" align="left">
          <label for="">Price</label>
          <input class="amount" type="text" v-model="mealplan.price" required>
          <br>
        </div>
        <!-- eslint-disable-next-line -->
        <div v-if="mealplan.isPublic" class="" align="left">
          <label for="">Currency</label>
          <input class="amount" type="text" v-model="mealplan.currency" required>
          <br>
        </div>
        <!-- eslint-disable-next-line -->
        <div v-if="mealplan.isPublic" class="purchase_button" @click="updateDetails(mealplan)" style="margin-top: 20px">
          <span class="purchase_text">Update Details</span>
        </div>
        <!-- eslint-disable-next-line -->
        <br>
        <!-- eslint-disable-next-line -->
        <div v-if="!mealplan.isPublic && !mealplan.isPurchased" class="public_button" @click="makePublic(mealplan)" style="margin-top: 20px">
          <span class="public_text">Make Public</span>
        </div>
        <!-- eslint-disable-next-line -->
        <div v-if="mealplan.isPublic && !mealplan.isPurchased" class="public_button" @click="makePrivate(mealplan)" style="margin-top: 20px">
          <span class="public_text">Make Private</span>
        </div>
      </template>
      <div class="" style="margin-bottom: 100px">
        <div class="box">
          <p class="sign" @click="addMealplan(newMealplan)">+</p>
        </div>
        <p class="dayname">New Meal Plan</p>
        <div class="ingredients_break">

        </div>
        <div class="" align="left">
          <label for="">New Meal Plan</label>
          <input class="amount" id="newMealplan" type="text" @keyup.enter="addMealplan(newMealplan)" v-model="newMealplan" required>
        </div>
        <div class="purchase_button" @click="addMealplan(newMealplan)" style="margin-top: 40px">
          <span class="purchase_text">Add Meal Plan</span>
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
      newMealplan: '',
      newPlace: '',
      newMember: '',
      emailPassword: '',
      oldPassword: '',
      newPassword: '',
      checkPassword: '',
      deleteConfirmation: '',
      currentYear: moment().format('YYYY'),
      currentMonth: moment().format('YYYYMM')
    }
  },
  computed: {
    ...mapState([
      'profileFilters',
      'userData',
      'userAddresses',
      'price'
    ])
  },
  methods: {
    ...mapMutations([
      'toggleSelected',
      'calcPrice',
      'addMonths',
      'setDefaultAddress'
    ]),
    goDiscover () {
      store.commit('setPage', 'discover')
      router.push('discover')
    },
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
                db.collection('mealplans').doc(mealplanID).collection('recipes').doc(recipeID).collection('ingredients').doc(ingredientID).update({
                  amount: newAmount
                })
                db.collection('mealplans').doc(mealplanID).update({
                  calories: Number(userData.calories)
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
    toggleMeal (meal) {
      var index = meal.uid
      var userData = this.userData
      if (meal.isActive) {
        db.collection('users').doc(userData.uid).collection('meals').doc(index).update({
          isActive: false
        })
      } else {
        db.collection('users').doc(userData.uid).collection('meals').doc(index).update({
          isActive: true
        })
      }
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
      // get data to be deleted
      var oldUserData = JSON.parse(JSON.stringify(this.userData))
      var oldUserAddresses = JSON.parse(JSON.stringify(this.userAddresses))
      if (confirm('Are you sure you want to delete your account? This will also delete all places you are the owner of.')) {
        // get authetication details
        const user = firebase.auth().currentUser
        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          this.deleteConfirmation
        )
        for (let address in oldUserAddresses) {
          // check owner of the addresses
          var isOwner = false
          for (let member in oldUserAddresses[address].members) {
            if (oldUserAddresses[address].members[member].role === 'Owner' && oldUserAddresses[address].members[member].uid === oldUserData.uid) {
              isOwner = true
            }
          }
          if (isOwner) {
            for (let member in oldUserAddresses[address].members) {
              db.collection('users').doc(oldUserAddresses[address].members[member].uid).collection('addresses').doc(oldUserAddresses[address].uid).delete()
            }
            for (let month in oldUserAddresses[address].months) {
              db.collection('addresses').doc(oldUserAddresses[address].uid).collection('months').doc(oldUserAddresses[address].months[month].month).delete()
            }
            for (let item in oldUserAddresses[address].personalList) {
              db.collection('addresses').doc(oldUserAddresses[address].uid).collection('personalList').doc(oldUserAddresses[address].personalList[item].uid).delete()
            }
            for (let day in oldUserAddresses[address].calendar) {
              for (let ingredient in oldUserAddresses[address].calendar[day].meal0Ingredients) {
                db.collection('addresses').doc(oldUserAddresses[address].uid).collection('calendar').doc(oldUserAddresses[address].calendar[day].date.toString()).collection('meal0Ingredients').doc(oldUserAddresses[address].calendar[day].meal0Ingredients[ingredient].uid).delete()
              }
              for (let ingredient in oldUserAddresses[address].calendar[day].meal1Ingredients) {
                db.collection('addresses').doc(oldUserAddresses[address].uid).collection('calendar').doc(oldUserAddresses[address].calendar[day].date.toString()).collection('meal1Ingredients').doc(oldUserAddresses[address].calendar[day].meal1Ingredients[ingredient].uid).delete()
              }
              for (let ingredient in oldUserAddresses[address].calendar[day].meal2Ingredients) {
                db.collection('addresses').doc(oldUserAddresses[address].uid).collection('calendar').doc(oldUserAddresses[address].calendar[day].date.toString()).collection('meal2Ingredients').doc(oldUserAddresses[address].calendar[day].meal2Ingredients[ingredient].uid).delete()
              }
              for (let ingredient in oldUserAddresses[address].calendar[day].meal3Ingredients) {
                db.collection('addresses').doc(oldUserAddresses[address].uid).collection('calendar').doc(oldUserAddresses[address].calendar[day].date.toString()).collection('meal3Ingredients').doc(oldUserAddresses[address].calendar[day].meal3Ingredients[ingredient].uid).delete()
              }
              for (let ingredient in oldUserAddresses[address].calendar[day].meal4Ingredients) {
                db.collection('addresses').doc(oldUserAddresses[address].uid).collection('calendar').doc(oldUserAddresses[address].calendar[day].date.toString()).collection('meal4Ingredients').doc(oldUserAddresses[address].calendar[day].meal4Ingredients[ingredient].uid).delete()
              }
              for (let ingredient in oldUserAddresses[address].calendar[day].meal5Ingredients) {
                db.collection('addresses').doc(oldUserAddresses[address].uid).collection('calendar').doc(oldUserAddresses[address].calendar[day].date.toString()).collection('meal5Ingredients').doc(oldUserAddresses[address].calendar[day].meal5Ingredients[ingredient].uid).delete()
              }
              for (let ingredient in oldUserAddresses[address].calendar[day].meal6Ingredients) {
                db.collection('addresses').doc(oldUserAddresses[address].uid).collection('calendar').doc(oldUserAddresses[address].calendar[day].date.toString()).collection('meal6Ingredients').doc(oldUserAddresses[address].calendar[day].meal6Ingredients[ingredient].uid).delete()
              }
              for (let ingredient in oldUserAddresses[address].calendar[day].meal7Ingredients) {
                db.collection('addresses').doc(oldUserAddresses[address].uid).collection('calendar').doc(oldUserAddresses[address].calendar[day].date.toString()).collection('meal7Ingredients').doc(oldUserAddresses[address].calendar[day].meal7Ingredients[ingredient].uid).delete()
              }
              for (let ingredient in oldUserAddresses[address].calendar[day].meal8Ingredients) {
                db.collection('addresses').doc(oldUserAddresses[address].uid).collection('calendar').doc(oldUserAddresses[address].calendar[day].date.toString()).collection('meal8Ingredients').doc(oldUserAddresses[address].calendar[day].meal8Ingredients[ingredient].uid).delete()
              }
              for (let ingredient in oldUserAddresses[address].calendar[day].meal9Ingredients) {
                db.collection('addresses').doc(oldUserAddresses[address].uid).collection('calendar').doc(oldUserAddresses[address].calendar[day].date.toString()).collection('meal9Ingredients').doc(oldUserAddresses[address].calendar[day].meal9Ingredients[ingredient].uid).delete()
              }
              db.collection('addresses').doc(oldUserAddresses[address].uid).collection('calendar').doc(oldUserAddresses[address].calendar[day].date.toString()).delete()
            }
          } else {
            db.collection('addresses').doc(oldUserAddresses[address].uid).collection('members').doc(oldUserData.uid).delete()
          }
        }
        for (let address in oldUserData.addresses) {
          db.collection('users').doc(oldUserData.uid).collection('addresses').doc(oldUserData.addresses[address].uid).delete()
        }
        for (let day in oldUserData.calendar) {
          db.collection('users').doc(oldUserData.uid).collection('calendar').doc(oldUserData.calendar[day].date.toString()).delete()
        }
        for (let mealplan in oldUserData.mealplans) {
          for (let filter in oldUserData.mealplans[mealplan].filters) {
            var mealplanID = oldUserData.mealplans[mealplan].uid
            db.collection('users').doc(oldUserData.uid).collection('mealplans').doc(mealplanID).collection('filters').doc(oldUserData.mealplans[mealplan].filters[filter].uid).delete()
          }
          for (let recipe in oldUserData.mealplans[mealplan].recipes) {
            for (let ingredient in oldUserData.mealplans[mealplan].recipes[recipe].ingredients) {
              mealplanID = oldUserData.mealplans[mealplan].uid
              var recipeID = oldUserData.mealplans[mealplan].recipes[recipe].uid
              db.collection('users').doc(oldUserData.uid).collection('mealplans').doc(mealplanID).collection('recipes').doc(recipeID).collection('ingredients').doc(oldUserData.mealplans[mealplan].recipes[recipe].ingredients[ingredient].uid).delete()
            }
            db.collection('users').doc(oldUserData.uid).collection('mealplans').doc(mealplanID).collection('recipes').doc(oldUserData.mealplans[mealplan].recipes[recipe].uid).delete()
          }
          db.collection('users').doc(oldUserData.uid).collection('mealplans').doc(oldUserData.mealplans[mealplan].uid).delete()
        }
        // delete user, sign out and redirect to register page
        user.reauthenticateAndRetrieveDataWithCredential(credential)
          .then(function () {
            user.delete()
            firebase.auth().signOut()
              .then(function () {
                store.commit('setPage', 'register')
                router.push('register')
              })
              .catch(error => {
                alert(error.message)
                console.log(error.code)
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
    filteredMealplans () {
      var userData = this.userData
      var filters = []
      for (let m in userData.mealplans) {
        if (userData.mealplans[m].isActive) {
          for (let f in userData.mealplans[m].filters) {
            filters.push(userData.mealplans[m].filters[f])
          }
        }
      }
      return filters
    },
    addFilter (newFilter) {
      var userData = this.userData
      var m
      for (m in userData.mealplans) {
        if (userData.mealplans[m].isActive) {
          break
        }
      }
      if (this.newFilter !== '') {
        db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[m].uid).collection('filters').add({
          text: newFilter,
          isActive: false,
          isRequired: false,
          uid: ''
        })
          .then(function (filter) {
            db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[m].uid).collection('filters').doc(filter.id).update({
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
      var m
      for (m in userData.mealplans) {
        if (userData.mealplans[m].isActive) {
          break
        }
      }
      db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[m].uid).collection('filters').doc(filter.uid).update({
        text: filter.text
      })
    },
    deleteFilter (filter) {
      var userData = this.userData
      var m
      for (m in userData.mealplans) {
        if (userData.mealplans[m].isActive) {
          break
        }
      }
      db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[m].uid).collection('filters').doc(filter.uid).delete()
    },
    dropdownMealplans () {
      for (var i = 0; i < document.getElementsByClassName('other_mealplans').length; i++) {
        if (document.getElementsByClassName('other_mealplans')[i].style.opacity == 1) {
          document.getElementsByClassName('other_mealplans')[i].style.opacity = 0
        } else {
          document.getElementsByClassName('other_mealplans')[i].style.opacity = 1
        }
      }
    },
    selectMealplan (mealplan) {
      var userData = this.userData
      for (let m in userData.mealplans) {
        if (userData.mealplans[m].isActive) {
          db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[m].uid).update({
            isActive: false
          })
        }
      }
      db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).update({
        isActive: true
      })
    },
    addMealplan (newMealplan) {
      var newMP = newMealplan
      if (this.newMealplan !== '') {
        var userData = this.userData
        db.collection('users').doc(userData.uid).collection('mealplans').add({
          name: newMP,
          publicName: newMP,
          isActive: false,
          isPublic: false,
          isPurchased: true,
          recipes: [],
          filters: [],
          price: 0,
          purchases: 0,
          currency: 'CHF',
          recipesAmount: 0,
          uid: ''
        })
          .then(function (mealplan) {
            db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.id).update({
              uid: mealplan.id
            })
            db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.id).collection('filters').doc('00000000000000000001').set({
              text: 'Breakfast',
              isActive: true,
              isRequired: false,
              uid: '00000000000000000001'
            })
            db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.id).collection('filters').doc('00000000000000000002').set({
              text: 'Lunch',
              isActive: true,
              isRequired: false,
              uid: '00000000000000000002'
            })
            db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.id).collection('filters').doc('00000000000000000003').set({
              text: 'Dinner',
              isActive: true,
              isRequired: false,
              uid: '00000000000000000003'
            })
          })
        this.newMealplan = ''
        document.getElementById('newMealplan').focus()
      } else {
        alert('Add a name first.')
      }
    },
    updateMealplan (mealplan) {
      var userData = this.userData
      db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).update({
        name: mealplan.name
      })
    },
    deleteMealplan (mealplan) {
      var userData = this.userData
      db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).delete()
    },
    makePrivate (mealplan) {
      var userData = this.userData
      var mealplanIndex = userData.mealplans.indexOf(mealplan)
      db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).update({
        isPublic: false
      })
      for (var recipe in userData.mealplans[mealplanIndex].recipes) {
        for (var ingredient in userData.mealplans[mealplanIndex].recipes[recipe].ingredients) {
          db.collection('mealplans').doc(mealplan.uid).collection('recipes').doc(userData.mealplans[mealplanIndex].recipes[recipe].uid).collection('ingredients').doc(userData.mealplans[mealplanIndex].recipes[recipe].ingredients[ingredient].uid).delete()
        }
        db.collection('mealplans').doc(mealplan.uid).collection('recipes').doc(userData.mealplans[mealplanIndex].recipes[recipe].uid).delete()
      }
      for (var filter in userData.mealplans[mealplanIndex].filters) {
        db.collection('mealplans').doc(mealplan.uid).collection('filters').doc(userData.mealplans[mealplanIndex].filters[filter].uid).delete()
      }
      db.collection('mealplans').doc(mealplan.uid).delete()
    },
    makePublic (mealplan) {
      var userData = this.userData
      var mealplanIndex = userData.mealplans.indexOf(mealplan)
      db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).update({
        isPublic: true
      })
      db.collection('mealplans').doc(mealplan.uid).set({
        uid: mealplan.uid,
        owner: userData.uid,
        price: mealplan.price,
        recipesAmount: mealplan.recipesAmount,
        currency: mealplan.currency,
        name: mealplan.name,
        publicName: mealplan.publicName,
        purchases: mealplan.purchases,
        calories: userData.calories,
        filters: [],
        recipes: []
      })
      for (var filter in userData.mealplans[mealplanIndex].filters) {
        db.collection('mealplans').doc(mealplan.uid).collection('filters').doc(userData.mealplans[mealplanIndex].filters[filter].uid).set(userData.mealplans[mealplanIndex].filters[filter])
      }
      for (var recipe in userData.mealplans[mealplanIndex].recipes) {
        db.collection('mealplans').doc(mealplan.uid).collection('recipes').doc(userData.mealplans[mealplanIndex].recipes[recipe].uid).set(userData.mealplans[mealplanIndex].recipes[recipe])
        for (var ingredient in userData.mealplans[mealplanIndex].recipes[recipe].ingredients) {
          db.collection('mealplans').doc(mealplan.uid).collection('recipes').doc(userData.mealplans[mealplanIndex].recipes[recipe].uid).collection('ingredients').doc(userData.mealplans[mealplanIndex].recipes[recipe].ingredients[ingredient].uid).set(userData.mealplans[mealplanIndex].recipes[recipe].ingredients[ingredient])
        }
      }
    },
    updateDetails (mealplan) {
      var userData = this.userData
      db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).update({
        price: Number(mealplan.price),
        currency: mealplan.currency,
        publicName: mealplan.publicName
      })
      db.collection('mealplans').doc(mealplan.uid).update({
        price: Number(mealplan.price),
        currency: mealplan.currency,
        publicName: mealplan.publicName
      })
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
.meal_container {
  display: table;
  margin-left: 50%;
  transform: translateX(-50%);
}
.meal {
  position: relative;
  display: block;
  margin-top: 15px;
  text-align: center;
}
.meal_selected_black {
  position: relative;
  bottom: 0px;
  margin: auto;
  width: 40px;
  height: 2px;
  background-color: black;
  animation: expand .4s;
  animation-fill-mode: forwards;
}
.meal_selected_white {
  position: relative;
  bottom: 0px;
  margin: auto;
  width: 40px;
  height: 2px;
  background-color: white;
  animation: expand .4s;
  animation-fill-mode: forwards;
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
.public_button {
  position: relative;
  display: inline-block;
  margin-top: -20px;
  font-size: .85em;
  border: 1.2px solid linear-gradient(315deg, #ffdeb9, lightpink 100%);
  background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
  border-radius: 20px 20px;
  padding: 5px 10px 5px 10px;
}
.public_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
.public_text {
  color: white;
}
.other_mealplans {
  position: fixed;
  bottom: 80px;
  right: 50px;
  font-size: .714em;
  border: 1.2px solid black;
  border-radius: 20px 20px;
  padding: 10px;
  opacity: 0;
  transition: .4s ease-in-out;
}
.other_mealplans:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
.mealplan_button {
  position: fixed;
  bottom: 40px;
  right: 50px;
  font-size: .714em;
  background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
  border-radius: 20px 20px;
  padding: 10px;
}
.mealplan_text {
  color: white;
  font-size: 12px;
  font-weight: 500;
}
.mealplan_button:active {
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
.inline_date_past {
  text-decoration: line-through;
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
.mealplan_explanation {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  text-align: center;
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
  .public_button:hover {
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
    transition: .2s;
  }
  .mealplan_button:hover {
    cursor: pointer;
    background: linear-gradient(315deg, lightpink, #ffdeb9 100%);
    box-shadow: 1px 1px 1px rgba(0,0,0,0.2);
    transition: 0s;
  }
  .other_mealplans:hover {
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
    transition: .2s;
  }
  .meal_container:hover {
    cursor: pointer;
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
