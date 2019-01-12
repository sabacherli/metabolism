<template lang="html">
  <div id="cover_page">
    <div class="background">
      <div class="brand_large">
        SIGN UP
      </div>
      <div class="container_costs">
        <p class="costs_explanation" >Months are purchased in the app after the account is created and cost CHF 5</p>
        <!-- <p class="cost_icon">5.- Fr</p> -->
        <!-- <p> For the price of a <u><a id="loaf_of_bread" href="https://produkte.migros.ch/pain-creation-knusperbrot-111471500500">loaf of bread</a></u>  a month </p> -->
        <!-- <div class="cost_explanation">The price of metabolism probably amortises itself on average through cost savings due to reduced waste.</div> -->
      </div>
      <div class="container_register">
        <!-- <a><img id="link_email" style="transform: translateX(100%)" :src="require('@/assets/icons8-new-post-filled-100.png')" alt="Email"></a> -->
        <!-- <a><img id="link_google" :src="require('@/assets/icons8-google-plus-96.png')" alt="Google"></a> -->
        <form id="" action="" method="">
          <input class="register_email" type="email" name="email" value="" v-model="email" placeholder="Email" autocomplete="email" required>
          <br>
          <input class="register_password" type="password" name="password" value="" v-model="password" placeholder="Password" autocomplete="current-password" style="margin-top: 10px" @keyup.enter="createUser()" required>

          <!-- <input class="register" id="register_email" required>
          <input class="register" id="register_password" required> -->

        </form>
        <div class="register_button" @click="createUser()">Register</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import db from '@/database.js'

export default {
  name: 'Register',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  created () {
    this.$store.commit('populateMonthList', this.currentYear)
  },
  beforeMount () {
    this.$store.commit('setPage', 'register')
  },
  computed: {
    ...mapState([
      'userID'
    ])
  },
  methods: {
    createUser () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          const obj = JSON.parse(JSON.stringify(user))
          db.collection('addresses').add({
            members: [{
              email: obj.user.email,
              role: 'Owner',
              uid: obj.user.uid
            }],
            personalList: [],
            shoppingList: [],
            address: ''
          })
            .then(docRef => {
              const template = {
                foods: [],
                addresses: [{
                  name: 'Home',
                  isActive: true,
                  address: docRef.id
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
                info: {
                  email: obj.user.email,
                  uid: obj.user.uid
                },
                months: []
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
                })
                .catch(function (error) {
                  // An error happened.
                  console.log(error.message)
                })
            })
            .catch(function (error) {
              alert(error.message)
              console.log(error.code)
            })
          // Enter application.
          this.$router.push('/login')
        })
        .catch(function (error) {
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, lightpink, #ffdfa0);
  animation: slideInDown 1.2s;
}
.brand_large {
  text-align: center;
  font-size: 9em;
  font-weight: 800;
  letter-spacing: .05em;
  color: white;
  width: 100%;
  position: relative;
  top: 200px;
  opacity: 0;
  transform: translateY(-150%);
  animation: slideInLeft .8s 1.2s forwards;
}
.container_costs {
  position: relative;
  top: 225px;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  opacity: 0;
  animation: fadeIn .8s;
  animation-delay: 2s;
  animation-fill-mode: forwards;
}
.costs_explanation {
  text-align: center;
  font-size: 2em;
  margin-top: 20px;
  margin-bottom: -20px;
  color: white;
}
.container_register {
   position: relative;
   top: 350px;
   width: 100%;
   opacity: 0;
   animation: fadeIn .8s;
   animation-delay: 2s;
   animation-fill-mode: forwards;
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
   color: lightgray;
   font-size: 14px;
   font-family: Montserrat;
   letter-spacing: .2px;
   border-style: none;
   border-radius: 25px;
   border-width: 2px;
   background: white;
 }
input[type=email].register_email:focus,
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
.register_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
::placeholder {
  font-size: 14px;
  font-family: Montserrat;
  color: lightgray;
  letter-spacing: .2px;
}
@media (hover:hover) {
  .register_button:hover {
    cursor: pointer;
    color: #ffdeb9;
    font-weight: 400;
    background: white;
    transition: .4s ease-in-out;
  }
}
</style>
