<template lang="html">
  <div id="cover_page">
    <div class="background">
      <div class="brand_large">
        <a>METABOLISM</a>
      </div>
      <div class="brand_small">
        <img class="brand_img" src="../assets/logo.png" alt="Logo">
      </div>
      <div class="container_icons">
        <img src="../assets/icons8-email.png" alt="Email" class="icon" @click="focusEmailInput()">
        <img src="../assets/icons8-google.png" alt="Google" class="icon" @click="signInWithGoogle()">
        <!-- <img src="../assets/icons8-twitter.png" alt="Twitter" class="icon" @click="signInWithTwitter()"> -->
      </div>
      <div class="container_login">
        <form class="" action="index.html" method="post">
          <input id="emailInput" class="login_email" type="email" name="email" value="" v-model="email" placeholder="Email" autocomplete="email" required>
          <br>
          <input class="login_password" type="password" name="password" value="" @keyup.enter="login()" v-model="password" placeholder="Password" autocomplete="current-password" style="margin-top: 10px" required>
          <br>
          <button id="reset_button" class="login_email" style="margin-top: 10px; height: auto; width: 100px; font-size: 0.65em; text-algin: center; color: darkgrey; padding: 5px" type="button" name="button" @click="resetPassword()">Reset Password</button>
        </form>
        <div class="login_button" @click="login()">Login</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import store from '../store'
import router from '../router'

export default {
  name: 'Login',
  created () {
    store.commit('setPage', 'login')
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapState([
      'userData',
      'userAddresses'
    ])
  },
  methods: {
    focusEmailInput () {
      document.getElementById('emailInput').focus()
    },
    createDefaultUser () {
      store.commit('createDefaultUser')
    },
    login () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          if (firebase.auth().currentUser.emailVerified) {
            router.push('/calendar')
          } else {
            alert('You need to verify your email before you can log in.')
          }
        })
        .catch(error => {
          alert(error.code, ': ', error)
        })
    },
    signInWithGoogle () {
      var provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
      firebase.auth().getRedirectResult()
        .then(function (result) {
          router.push('/calendar')
        })
        .catch(function (error) {
          console.log('Error: ', error)
        })
    },
    signInWithTwitter () {
      var provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithRedirect(provider)
      firebase.auth().getRedirectResult()
        .then(function (result) {
          router.push('/calendar')
        })
        .catch(function (error) {
          console.log('Error: ', error)
        })
    },
    resetPassword () {
      const emailAddress = this.email
      firebase.auth().useDeviceLanguage()
      if (this.email === '') {
        alert('Enter your email address.')
      } else {
        firebase.auth().sendPasswordResetEmail(emailAddress).then(function () {
          alert('An email has been sent.')
        }).catch(function (error) {
          alert(error.message)
          console.log(error.code)
        })
      }
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
.container_login {
   position: relative;
   top: 300px;
   width: 100%;
   opacity: 0;
   animation: fadeIn .8s;
   animation-delay: 2s;
   animation-fill-mode: forwards;
}
.login_email,
.login_password {
   position: relative;
   display: inline-block;
   top: 0vh;
   left: 50%;
   transform: translateX(-50%);
   height: 30px;
   width: 35%;
   text-align: center;
   color: darkgray;
   font-family: Montserrat;
   font-size: 1em;
   letter-spacing: .2px;
   background: white;
   border-style: none;
   border-radius: 25px;
   border-width: 2px;
 }
input[type=email].login_email:focus,
input[type=password].login_password:focus {
  font-size: 1em;
  letter-spacing: .2px;
  background-color: #F8F8F8;
  outline: none;
}
.login_button {
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
.login_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
#reset_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
  outline: none;
}
::placeholder {
  font-size: 1em;
  font-family: Montserrat;
  color: darkgray;
  letter-spacing: .2px;
}
@media (max-width: 850px) {
  .brand_large {
    display: none;
  }
  .brand_small {
    position: relative;
    top: 150px;
    text-align: center;
    opacity: 0;
    animation: slideInLeft .8s 1.2s forwards;
  }
  .brand_img {
    width: 50vw;
  }
  .login_email,
  .login_password {
     width: 60%;
   }
}
@media (min-width: 850px) {
  .brand_large {
    position: relative;
    top: 150px;
    width: 100%;
    text-align: center;
    color: white;
    font-size: 9em;
    font-weight: 800;
    letter-spacing: .05em;
    opacity: 0;
    transform: translateY(-150%);
    animation: slideInLeft .8s 1.2s forwards;
  }
  .brand_small {
    display: none;
  }
}
@media (hover:hover) {
  .login_button:hover {
    cursor: pointer;
    color: #ffdeb9;
    font-weight: 400;
    background: white;
    transition: .4s ease-in-out;
  }
  #reset_button {
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
