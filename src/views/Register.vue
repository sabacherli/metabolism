<template lang="html">
  <div id="cover_page">
    <div class="background">
      <div class="brand_large">
        SIGN UP
      </div>
      <div class="container_costs">
        <p class="costs_explanation">One address costs 5 CHF per month and are purchased in the app</p>
        <!-- <p class="cost_icon">5.- Fr</p> -->
        <!-- <p> For the price of a <u><a id="loaf_of_bread" href="https://produkte.migros.ch/pain-creation-knusperbrot-111471500500">loaf of bread</a></u>  a month </p> -->
        <!-- <div class="cost_explanation">The price of metabolism probably amortises itself on average through cost savings due to reduced waste.</div> -->
      </div>
      <div class="container_icons">
        <img src="../assets/icons8-email.png" alt="Email" class="icon" @click="focusEmailInput()">
        <img src="../assets/icons8-google.png" alt="Google" class="icon" @click="createUserWithGoogle()">
        <!-- <img src="../assets/icons8-twitter.png" alt="Twitter" class="icon" @click="createUserWithTwitter()"> -->
      </div>
      <div class="container_register">
        <!-- <a><img id="link_email" style="transform: translateX(100%)" :src="require('@/assets/icons8-new-post-filled-100.png')" alt="Email"></a> -->
        <!-- <a><img id="link_google" :src="require('@/assets/icons8-google-plus-96.png')" alt="Google"></a> -->
        <form id="" action="" method="">
          <input id="emailInput" class="register_email" type="email" name="email" value="" v-model="email" placeholder="Email" autocomplete="email" required>
          <br>
          <input class="register_password" type="password" name="password" value="" v-model="password" placeholder="Password" autocomplete="current-password" style="margin-top: 10px" @keyup.enter="createUser()" required>
          <br>
          <button id="resend_button" class="register_email" style="margin-top: 10px; height: auto; width: 120px; font-size: 0.65em; text-algin: center; color: darkgrey; padding: 5px" type="button" name="button" @click="resendVerification()">Resend Verification</button>
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
import store from '../store'
import moment from 'moment'
import router from '../router'

export default {
  name: 'Register',
  data () {
    return {
      email: '',
      password: '',
      currentYear: moment().format('YYYY')
    }
  },
  beforeMount () {
    store.commit('setPage', 'register')
  },
  computed: {
    ...mapState([
      'userID'
    ])
  },
  methods: {
    focusEmailInput () {
      document.getElementById('emailInput').focus()
    },
    createUser () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          store.commit('createUser2', user)
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
            store.commit('createUser2', user)
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
          router.push('/calendar')
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
  top: 150px;
  opacity: 0;
  transform: translateY(-150%);
  animation: slideInLeft .8s 1.2s forwards;
}
.container_costs {
  position: relative;
  top: 175px;
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
.container_icons {
  position: relative;
  top: 260px;
  width: 100%;
  text-align: center;
  opacity: 0;
  animation: fadeIn .8s;
  animation-delay: 3s;
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
   opacity: 0;
   animation: fadeIn .8s;
   animation-delay: 3s;
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
   color: darkgray;
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
#resend_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
  outline: none;
}
::placeholder {
  font-size: 14px;
  font-family: Montserrat;
  color: darkgray;
  letter-spacing: .2px;
}
@media (max-width: 700px) {
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
    animation: slideInLeft .8s 1.2s forwards;
  }
  .container_costs {
    width: 70%;
  }
  .costs_explanation {
    font-size: 1.5em;
  }
  .register_email,
  .register_password {
   width: 60%;
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
  #resend_button {
    cursor: pointer;
    color: #ffdeb9;
    font-weight: 400;
    background: white;
    transition: .4s ease-in-out;
    outline: none;
  }
  .icon:hover {
    cursor: pointer;
  }
}
</style>
