<template lang="html">
  <div id="cover_page">
    <div class="background">
      <div class="progress">
        <div id="impossible" class="progress_circle progress_circle_active"></div>
        <div id="2" class="progress_circle" @click="showAddress()"></div>
        <div id="3" class="progress_circle" @click="showCalories()"></div>
        <div id="4" class="progress_circle" @click="showMealplans()"></div>
        <div id="5" class="progress_circle" @click="showCheckout()"></div>
      </div>
      <div id="email" class="container_component">
        <div class="brand_large">
          SIGN UP
        </div>
        <div class="container_costs">
          <p class="costs_explanation">One address costs 5 CHF per month and can be shared with up to 7 family members</p>
          <!-- <p class="cost_icon">5.- Fr</p> -->
          <!-- <p> For the price of a <u><a id="loaf_of_bread" href="https://produkte.migros.ch/pain-creation-knusperbrot-111471500500">loaf of bread</a></u>  a month </p> -->
          <!-- <div class="cost_explanation">The price of metabolism probably amortises itself on average through cost savings due to reduced waste.</div> -->
        </div>
        <div class="container_icons">
          <img src="../assets/icons8-email.png" alt="Email" class="icon" @click="focusEmailInput()">
          <!-- <img src="../assets/icons8-google.png" alt="Google" class="icon" @click="createUserWithGoogle()"> -->
          <!-- <img src="../assets/icons8-twitter.png" alt="Twitter" class="icon" @click="createUserWithTwitter()"> -->
        </div>
        <div class="container_register">
          <form id="" action="" method="">
            <input id="emailInput" class="register_email" type="email" name="email" value="" v-model="email" placeholder="Email" autocomplete="email" required>
            <br>
            <input class="register_password" type="password" name="password" value="" v-model="password" placeholder="Password" autocomplete="current-password" style="margin-top: 10px" @keyup.enter="createUser()" required>
            <br>
            <button id="resend_button" class="register_email" style="margin-top: 10px; height: auto; width: 120px; font-size: 0.65em; text-algin: center; color: darkgrey; padding: 5px" type="button" name="button" @click="resendVerification()">Resend Verification</button>
            <!-- <input class="register" id="register_email" required>
            <input class="register" id="register_password" required> -->
          </form>
          <div class="register_button" @click="createUser(); showAddress()">Register</div>
        </div>
      </div>
      <div id="address" class="container_component hidden">
        <div class="brand_large">
          ADDRESSES
        </div>
        <div class="container_costs">
          <p class="costs_explanation">Further months can be purchased at any time under the profile section</p>
          <!-- <p class="cost_icon">5.- Fr</p> -->
          <!-- <p> For the price of a <u><a id="loaf_of_bread" href="https://produkte.migros.ch/pain-creation-knusperbrot-111471500500">loaf of bread</a></u>  a month </p> -->
          <!-- <div class="cost_explanation">The price of metabolism probably amortises itself on average through cost savings due to reduced waste.</div> -->
        </div>
        <div class="container_register">
          <template v-for="(place, index) in userData.addresses">
          <!-- eslint-disable-next-line -->
            <div class="box">
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
                    <p :class="{ inline_date_selected: month.isActive, inline_date_bought: Number(month.month) < currentMonth }" class="inline_date" @click="toggleSelectedRegister(month); calcPrice(index)">{{ month.display }}</p>
                  </template>
                </div>
                <div class="block_date">
                  <template v-for="month in userAddresses[index].months.slice(4,8)">
                    <!-- eslint-disable-next-line -->
                    <p :class="{ inline_date_selected: month.isActive, inline_date_bought: Number(month.month) < currentMonth }" class="inline_date" @click="toggleSelectedRegister(month); calcPrice(index)">{{ month.display }}</p>
                  </template>
                </div>
                <div class="block_date">
                  <template v-for="month in userAddresses[index].months.slice(8,12)">
                    <!-- eslint-disable-next-line -->
                    <p :class="{ inline_date_selected: month.isActive, inline_date_bought: Number(month.month) < currentMonth }" class="inline_date" @click="toggleSelectedRegister(month); calcPrice(index)">{{ month.display }}</p>
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
                    <p :class="{ inline_date_selected: month.isActive, inline_date_bought: Number(month.month) < currentMonth }" class="inline_date" @click="toggleSelectedRegister(month); calcPrice(index)">{{ month.display }}</p>
                  </template>
                </div>
                <div class="block_date">
                  <template v-for="month in userAddresses[index].months.slice(16,20)">
                    <!-- eslint-disable-next-line -->
                    <p :class="{ inline_date_selected: month.isActive, inline_date_bought: Number(month.month) < currentMonth }" class="inline_date" @click="toggleSelectedRegister(month); calcPrice(index)">{{ month.display }}</p>
                  </template>
                </div>
                <div class="block_date">
                  <template v-for="month in userAddresses[index].months.slice(20,24)">
                    <!-- eslint-disable-next-line -->
                    <p :class="{ inline_date_selected: month.isActive, inline_date_bought: Number(month.month) < currentMonth }" class="inline_date" @click="toggleSelectedRegister(month); calcPrice(index)">{{ month.display }}</p>
                  </template>
                </div>
                <p class="year_date price">{{ price }} CHF</p>
                <div class="register_button remove_left" @click="showCalories()">Next</div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div id="calories" class="container_component hidden">
        <div class="brand_large">
          CALORIES
        </div>
        <div class="container_costs">
          <p class="costs_explanation further_explanation">This number is used to calculate shopping lists based all family member's appetite, so when adding ingredients to new recipes, add amounts appropriate for your stomach size</p>
          <!-- <p class="cost_icon">5.- Fr</p> -->
          <!-- <p> For the price of a <u><a id="loaf_of_bread" href="https://produkte.migros.ch/pain-creation-knusperbrot-111471500500">loaf of bread</a></u>  a month </p> -->
          <!-- <div class="cost_explanation">The price of metabolism probably amortises itself on average through cost savings due to reduced waste.</div> -->
        </div>
        <div class="container_register">
          <div class="">
            <input id="emailInput" class="register_email" type="number" name="calories" value="" v-model="email" placeholder="2000" autocomplete="off">
            <br>
            <div class="register_button" @click="showMealplans()">Next</div>
          </div>
        </div>
      </div>
      <div id="mealplans" class="container_component hidden">
        <div class="brand_large">
          MEAL PLANS
        </div>
        <div class="container_costs">
          <p class="costs_explanation">Discover pre-made meal plans to alleviate you from the burden of adding your own recipes</p>
        </div>
        <div style="margin-bottom: 70px" class="container_faq">
          <div class="break"></div>
          <template v-for="mealplan in popularMealplans">
            <div :key="mealplan.uid" class="container_mealplan">
              <div class="information">
                <p class="question">{{ mealplan.publicName }}</p>
                <br>
                <p class="details">ID: {{ mealplan.uid }}</p>
                <p class="details">Recipes: {{ mealplan.recipesAmount }}</p>
                <p class="details">Price: {{ mealplan.price }} {{ mealplan.currency }}</p>
                <div :id="mealplan.uid" class="purchase_button" style="width: 44px" @click="selectMealplan(mealplan)">
                  Select
                </div>
                <div :id="mealplan.uid + 1" class="purchase_button_selected hidden" style="width: 62px" @click="unselectMealplan(mealplan)">
                  Unselect
                </div>
              </div>
              <template v-for="recipe in mealplan.recipes">
                <div :key="recipe.uid" class="day">
                  <div class="">
                    <!-- eslint-disable-next-line -->
                      <div class="box">
                        <p class="date"> {{ recipe.id }} </p>
                      </div>
                      <p class="dayname"> {{ recipe.name }} </p>
                      <div class="ingredients_break">

                      </div>
                      <template v-for="ingredient in recipe.ingredients">
                        <!-- eslint-disable-next-line -->
                        <div class="">
                          <p class="meal"> {{ ingredient.ingredient }} </p>
                          <p class="meal_location"> {{ ingredient.amount }} {{ ingredient.unit }} </p>
                        </div>
                      </template>
                      <div class="" style="margin-bottom: 70px">

                      </div>
                  </div>
                </div>
              </template>
              <div class="mealfilters">
                <template v-for="filter in mealplan.filters">
                  <div :key="filter.uid" class="mealfilter">
                    <p> {{ filter.text }} </p>
                    <div class="filter_selected"></div>
                  </div>
                </template>
              </div>
            </div>
          </template>
          <div style="margin-bottom: 50px; width: 33px" class="purchase_button" @click="showCheckout()">
            Purchase
          </div>
        </div>
      </div>
      <div id="checkout" class="container_component hidden">
        <div class="brand_large">
          CHECKOUT
        </div>
        <div class="container_costs">
          <p class="costs_explanation">Our payments are processed externally by Stripe to assure the security of your payment details. Click redirect to proceed to the checkout.</p>
          <br>
          <p class="costs_explanation">Please also verify your email in order to successfully log in after you have paid.</p>
          <!-- <p class="cost_icon">5.- Fr</p> -->
          <!-- <p> For the price of a <u><a id="loaf_of_bread" href="https://produkte.migros.ch/pain-creation-knusperbrot-111471500500">loaf of bread</a></u>  a month </p> -->
          <!-- <div class="cost_explanation">The price of metabolism probably amortises itself on average through cost savings due to reduced waste.</div> -->
        </div>
        <div class="container_register">
        <div id="register" class="register_button" @click="goCheckout()">Proceed</div>
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
import store from '../store'
import moment from 'moment'
import router from '../router'

export default {
  name: 'Register',
  data () {
    return {
      email: '',
      password: '',
      currentYear: moment().format('YYYY'),
      currentMonth: moment().format('YYYYMM')
    }
  },
  beforeMount () {
    store.commit('setPage', 'register')
  },
  computed: {
    ...mapState([
      'popularMealplans',
      'userData',
      'userAddresses',
      'price',
      'mealplansSelected'
    ])
  },
  created () {
    store.commit('setPage', 'register')
    setTimeout(function () {
      store.commit('rerender')
    }, 800)
  },
  methods: {
    ...mapMutations([
      'toggleSelectedRegister',
      'calcPrice'
    ]),
    showAddress () {
      for (let i = 0; i < document.getElementsByClassName('progress_circle').length; i++) {
        document.getElementsByClassName('progress_circle')[i].classList.remove('progress_circle_active')
      }
      document.getElementById('2').classList.add('progress_circle_active')
      for (let i = 0; i < document.getElementsByClassName('container_component').length; i++) {
        document.getElementsByClassName('container_component')[i].classList.add('hidden')
      }
      document.getElementById('address').classList.remove('hidden')
    },
    showCalories () {
      for (let i = 0; i < document.getElementsByClassName('progress_circle').length; i++) {
        document.getElementsByClassName('progress_circle')[i].classList.remove('progress_circle_active')
      }
      document.getElementById('3').classList.add('progress_circle_active')
      for (let i = 0; i < document.getElementsByClassName('container_component').length; i++) {
        document.getElementsByClassName('container_component')[i].classList.add('hidden')
      }
      document.getElementById('calories').classList.remove('hidden')
    },
    showMealplans () {
      for (let i = 0; i < document.getElementsByClassName('progress_circle').length; i++) {
        document.getElementsByClassName('progress_circle')[i].classList.remove('progress_circle_active')
      }
      document.getElementById('4').classList.add('progress_circle_active')
      for (let i = 0; i < document.getElementsByClassName('container_component').length; i++) {
        document.getElementsByClassName('container_component')[i].classList.add('hidden')
      }
      document.getElementById('mealplans').classList.remove('hidden')
    },
    showCheckout () {
      for (let i = 0; i < document.getElementsByClassName('progress_circle').length; i++) {
        document.getElementsByClassName('progress_circle')[i].classList.remove('progress_circle_active')
      }
      document.getElementById('5').classList.add('progress_circle_active')
      for (let i = 0; i < document.getElementsByClassName('container_component').length; i++) {
        document.getElementsByClassName('container_component')[i].classList.add('hidden')
      }
      document.getElementById('checkout').classList.remove('hidden')
    },
    goCheckout () {
      // returns total price which you can then pass on to Stripe Checkout
      store.commit('calcTotalPrice')
      // eslint-disable-next-line
      var stripe = Stripe('pk_test_eOIPf7mHX035HASoi8LrghW5', {
        betas: ['checkout_beta_4']
      })
      stripe.redirectToCheckout({
        items: [{
          sku: 'sku_ETuovBIeaLjPou', quantity: 5
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
      store.commit('addMonths')
      var mealplans = this.mealplansSelected
      for (let m in mealplans) {
        var mealplan = mealplans[m]
        var userData = this.userData
        var calorieRatio = userData.calories / mealplan.calories
        db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).set({
          name: mealplan.publicName,
          publicName: mealplan.publicName,
          isActive: false,
          isPublic: false,
          isPurchased: true,
          recipes: [],
          filters: [],
          price: mealplan.price,
          purchases: mealplan.purchases,
          currency: mealplan.currency,
          recipesAmount: mealplan.recipesAmount,
          uid: mealplan.uid
        })
        for (let filter in mealplan.filters) {
          db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).collection('filters').doc(mealplan.filters[filter].uid).set(mealplan.filters[filter])
        }
        for (let recipe in mealplan.recipes) {
          db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).collection('filters').doc(mealplan.recipes[recipe].uid).set(mealplan.recipes[recipe])
          for (let ingredient in mealplan.recipes[recipe].ingredients) {
            mealplan.recipes[recipe].ingredients[ingredient].amount = calorieRatio * mealplan.recipes[recipe].ingredients[ingredient].amount
            db.collection('users').doc(userData.uid).collection('mealplans').doc(mealplan.uid).collection('filters').doc(mealplan.recipes[recipe].uid).collection('ingredients').doc(mealplan.recipes[recipe].ingredients[ingredient].uid).set(mealplan.recipes[recipe].ingredients[ingredient])
          }
        }
      }
    },
    focusEmailInput () {
      document.getElementById('emailInput').focus()
    },
    selectMealplan (mealplan) {
      document.getElementById(mealplan.uid).classList.add('hidden')
      document.getElementById(mealplan.uid + 1).classList.remove('hidden')
      store.commit('pushMealplanSelected', mealplan)
    },
    unselectMealplan (mealplan) {
      document.getElementById(mealplan.uid + 1).classList.add('hidden')
      document.getElementById(mealplan.uid).classList.remove('hidden')
      store.commit('removeMealplanSelected', mealplan)
    },
    createUser () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(function (user) {
          store.commit('createUser', user)
          firebase.auth().useDeviceLanguage()
          firebase.auth().currentUser.sendEmailVerification()
        })
        .catch(function (error) {
          alert(error)
          console.log(error.code)
        })
    },
    createUserWithGoogle () {
      var provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
      firebase.auth().getRedirectResult()
        .then(function (user) {
          if (user.additionalUserInfo.isNewUser) {
            store.commit('createUser', user)
          }
        })
        .catch(function (error) {
          console.log('Error: ', error)
        })
    },
    createUserWithTwitter () {
      var provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
      firebase.auth().getRedirectResult()
        .then(function (result) {
          // The signed-in user info.
          store.commit('createUser', result)
          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          // var token = result.credential.accessToken
          // var secret = result.credential.secret
          // ...
        })
        .catch(function (error) {
          // Handle Errors here.
          // var errorCode = error.code
          // var errorMessage = error.message
          // The email of the user's account used.
          // var email = error.email
          // The firebase.auth.AuthCredential type that was used.
          // var credential = error.credential
          // ...
          console.log('Error: ', error)
        })
    },
    resendVerification () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          firebase.auth().currentUser.sendEmailVerification()
            .then(function () {
              // Email sent.
              alert('Another verification email has been sent.')
              firebase.auth().signOut()
                .then(function () {
                  // Sign-out successful.
                  router.push('/login')
                }).catch(function (error) {
                  // An error happened.
                  console.log(error.code)
                })
            })
        })
        .catch(error => {
          alert(error.message)
          console.log(error.code)
        })
    }
  }
}
</script>

<style lang="css" scoped>
#cover_page {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
.background {
  position: fixed;
  display: block;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, lightpink, #ffdfa0);
}
.hidden {
  display: none;
}
.brand_large {
  text-align: center;
  font-size: 9em;
  font-weight: 800;
  letter-spacing: .05em;
  color: white;
  width: 100%;
  position: relative;
  top: 150px;
  opacity: 0;
  transform: translateY(-150%);
  animation: slideInLeft .8s .4s forwards;
}
.container_costs {
  position: relative;
  top: 175px;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  opacity: 0;
  animation: fadeIn .8s;
  animation-delay: 1.2s;
  animation-fill-mode: forwards;
}
.costs_explanation {
  text-align: center;
  font-size: 2em;
  margin-top: 20px;
  margin-bottom: -20px;
  color: white;
}
.further_explanation {
  font-size: 1.6em;
}
.container_faq {
  position: relative;
  top: 300px;
  width: 80%;
  margin-left: 10%;
  text-align: left;
  opacity: 0;
  animation: fadeIn .8s;
  animation-delay: 1.4s;
  animation-fill-mode: forwards;
}
.container_mealplan {
  display: block;
  margin-bottom: 20px;
  white-space: nowrap;
  overflow-y: scroll;
}
.information {
  position: relative;
  display: inline-block;
  width: 400px;
  margin-top: 50px;
  margin-bottom: 80px;
  vertical-align: top;
  overflow-y: visible;
  color: white;
  text-align: center;
}
.break {
  position: relative;
  width: 50px;
  height: auto;
  left: 0px;
  margin-top: 40px;
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: white;
  border-bottom-width: 2px;
}
.question {
  text-align: left;
  font-size: 1.8em;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: -20px;
  color: white;
}
.details {
  text-align: left;
  font-size: 1em;
  margin-top: 30px;
  margin-bottom: -20px;
  color: white;
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
.box {
  position: relative;
  width: 30px;
  height: 25px;
  margin: auto;
  margin-bottom: 30px;
  padding: 5px;
  border: 2px solid white;
}
.date {
  position: absolute;
  font-size: 20px;
  top: -5%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.day {
  position: relative;
  display: inline-block;
  margin-top: 5px;
  width: 200px;
  vertical-align: top;
  color: white;
  text-align: center;
}
.dayname {
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 50px;
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
  border-bottom-color: white;
  border-bottom-width: 1px;
}
.meal {
  font-size: 16px;
  margin-top: 25px;
  margin-bottom: 25px;
}
.meal_location {
  font-size: 10px;
  margin-top: -20px;
}
.mealfilters {
  position: relative;
  height: 25px;
  margin-bottom: 80px;
  width: 100%;
  text-align: center;
}
.mealfilter {
  position: relative;
  display: inline-block;
  bottom: 15px;
  margin: auto 15px auto 15px;
  text-align: center;
  color: white;
}
.filter_selected {
  position: relative;
  bottom: 15px;
  margin: auto;
  height: 2px;
  background-color: white;
  animation: expand .4s;
  animation-fill-mode: forwards;
}
.container_icons {
  position: relative;
  top: 260px;
  width: 100%;
  text-align: center;
  opacity: 0;
  animation: fadeIn .8s;
  animation-delay: 2s;
  animation-fill-mode: forwards;
}
.icon {
  display: inline-block;
  height: 40px;
  width: 40px;
  margin: 0px 20px 0 20px;
}
.container_register {
   position: relative;
   top: 300px;
   width: 100%;
   color: white;
   opacity: 0;
   animation: fadeIn .8s;
   animation-delay: 2s;
   animation-fill-mode: forwards;
}
#address {
  text-align: center;
}
.register_email,
.register_password {
   position: relative;
   display: inline-block;
   top: 15%;
   left: 50%;
   transform: translateX(-50%);
   height: 30px;
   width: 35%;
   text-align: center;
   color: darkgray;
   font-size: 14px;
   font-family: Montserrat;
   letter-spacing: .2px;
   border-style: none;
   border-radius: 25px;
   border-width: 2px;
   background: white;
 }
 .purchase_button {
   position: relative;
   width: 65px;
   margin-top: 50px;
   margin-bottom: -20px;
   color: white;
   font-size: 1em;
   text-align: left;
   font-size: 1em;
   border: 2px solid white;
   border-radius: 20px 20px;
   padding: 5px 10px 5px 10px;
 }
 .purchase_button:active {
   box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
   transition: 0s;
 }
 .purchase_button_selected {
   position: relative;
   width: 65px;
   margin-top: 50px;
   margin-bottom: -20px;
   color: white;
   font-size: 1em;
   text-align: left;
   font-size: 1em;
   font-weight: 400;
   color: #ffcdaf;
   padding: 5px 10px 5px 10px;
   background: white;
   border: 1.4px solid white;
   border-radius: 20px 20px;
 }
 .year_date {
   font-weight: 500;
 }
 .block_date {
   display: block;
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
    text-decoration: line-through;
 }
 .inline_date_selected {
   font-weight: 400;
   color: #ffcdaf;
   background: white;
   border: 1.4px solid white;
   border-radius: 20px 20px;
 }
input[type=email].register_email:focus,
input[type=number].register_email:focus,
input[type=password].register_password:focus {
  background-color: #F8F8F8;
  outline: none;
  letter-spacing: .2px;
  font-size: 14px;
}
.register_button {
  position: relative;
  display: inline-block;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 50px;
  color: white;
  font-size: 1em;
  border: 2px solid white;
  border-radius: 20px 20px;
  padding: 5px 10px 5px 10px;
}
.remove_left {
  left: 0%;
  transform: translateX(0%);
}
.register_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
#resend_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
  outline: none;
}
.progress {
  position: fixed;
  height: auto;
  width: 2%;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
}
.progress_circle {
  height: 10px;
  width: 10px;
  margin: 10px;
  border: 1px solid white;
  border-radius: 50px 50px;
}
.progress_circle_active {
  height: 10px;
  width: 10px;
  margin: 10px;
  background: white;
  border: 1px solid white;
  border-radius: 50px 50px;
}
::placeholder {
  font-size: 14px;
  font-family: Montserrat;
  color: darkgray;
  letter-spacing: .2px;
}
@media (max-width: 660px) {
  .brand_large {
    position: relative;
    top: 180px;
    width: 100%;
    text-align: center;
    line-height: 1em;
    color: white;
    font-size: 6em;
    font-weight: 800;
    letter-spacing: .05em;
    opacity: 0;
    transform: translateY(-150%);
    animation: slideInLeft .8s .4s forwards;
  }
  .container_costs {
    width: 70%;
  }
  .costs_explanation {
    margin-top: 60px;
    margin-bottom: -40px;
    font-size: 1.5em;
  }
  .further_explanation {
    font-size: 1.4em;
  }
  .register_email,
  .register_password {
   width: 60%;
 }
 .container_faq {
   width: 80%;
   top: 270px;
 }
 .container_mealplan {
   position: relative;
   height: inherit;
   width: 85%;
   margin: auto;
   overflow: visible;
   text-align: center;
   margin-bottom: 20px;
   white-space: nowrap;
 }
 .information {
   width: 100%;
 }
 .mealfilters {
   position: relative;
   top: 70px;
   height: 25px;
   margin-bottom: 80px;
   width: 100%;
   text-align: center;
 }
 .day {
   display: inline;
   margin-top: 70px;
   color: white;
   text-align: center;
 }
 .question {
   font-size: 1.5em;
 }
}
@media (hover:hover) {
  .register_button:hover {
    cursor: pointer;
    color: #ffdeb9;
    font-weight: 400;
    background: white;
    transition: .4s ease-in-out;
  }
  .progress_circle:not(#impossible):hover {
    cursor: pointer;
  }
  .progress_circle_active:hover {
    cursor: default;
  }
  #resend_button {
    cursor: pointer;
    color: #ffdeb9;
    font-weight: 400;
    background: white;
    transition: .4s ease-in-out;
    outline: none;
  }
  .inline_date {
    cursor: pointer;
  }
  .icon:hover {
    cursor: pointer;
  }
  .inline_date_bought:hover {
    cursor: default;
  }
  .purchase_button:hover {
    cursor: pointer;
    color: #ffcab0;
    font-weight: 400;
    background: white;
    transition: .4s ease-in-out;
  }
  .purchase_button_selected:hover {
    cursor: pointer;
  }
}
</style>
