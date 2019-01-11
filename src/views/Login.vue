<template lang="html">
  <div id="cover_page">
    <div class="background">
      <div class="brand_large">
        <a>METABOLISM</a>
      </div>
      <div class="brand_small">
        <img src="../assets/logo.png" alt="Logo">
      </div>
      <div class="container_login">
        <form class="" action="index.html" method="post">
          <input class="login_email" type="email" name="email" value="" v-model="email" placeholder="Email" autocomplete="email" required>
          <br>
          <input class="login_password" type="password" name="password" value="" @keyup.enter="login()" v-model="password" placeholder="Password" autocomplete="current-password" style="margin-top: 10px" required>
          <br>
          <button class="login_email" style="width: 100px; margin-top: 10px; font-size: 0.65em; text-algin: center; height: auto; padding: 5px" type="button" name="button" @click="resetPassword()">Reset Password</button>
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

export default {
  name: 'Login',
  created () {
    this.$store.commit('setPage', 'login')
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapState([
      'userID'
    ])
  },
  methods: {
    login () {
      firebase.auth().signOut()
        .then(success => {
          this.$store.dispatch('setDefault')
        })
        .catch(error => {
          alert(error.message)
          console.log(error.code)
        })
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          if (user) {
            if (firebase.auth().currentUser.emailVerified) {
              this.$store.commit('resetUserCalendar')
              this.$router.push('calendar')
            } else {
              alert('You need to verify your email before you can log in.')
            }
          } else {
            alert('You need to verify your email before you can log in.')
          }
        })
        .catch(error => {
          alert(error.message)
          console.log(error.code)
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, lightpink, #ffdfa0);
  animation: slideInDown 1.2s;
}
.container_login {
   position: relative;
   top: 320px;
   width: 100%;
   opacity: 0;
   animation: fadeIn .8s;
   animation-delay: 2s;
   animation-fill-mode: forwards;
}
.login_email,
.login_password {
   position: relative;
   text-align: center;
   font-size: 14px;
   font-family: Montserrat;
   color: lightgray;
   letter-spacing: .2px;
   left: 50%;
   transform: translateX(-50%);
   display: inline-block;
   border-style: none;
   border-radius: 25px;
   border-width: 2px;
   background: white;
   top: 15%;
   height: 30px;
   width: 35%;
   color: darkgray;
 }
input[type=email].login_email:focus,
input[type=password].login_password:focus {
  background-color: #F8F8F8;
  outline: none;
  letter-spacing: .2px;
  font-size: 14px;
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
.login_button:hover {
  cursor: pointer;
  color: #ffdeb9;
  font-weight: 400;
  background: white;
  transition: .4s ease-in-out;
}
.login_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
::placeholder {
  font-size: 14px;
  font-family: Montserrat;
  color: lightgray;
  letter-spacing: .2px;
}
::-webkit-scrollbar {
  height: 0px;
  width: 0px;
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
}
@media (min-width: 850px) {
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
  .brand_small {
    display: none;
  }
}
</style>
