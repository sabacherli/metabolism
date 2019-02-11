<template>
  <div id="app">
    <router-view name="banner"></router-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/javascript">
import firebase from 'firebase/app'
import 'firebase/auth'
import store from './store'
import 'typeface-montserrat'
import { mapState } from 'vuex'

export default {
  created () {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user && user.emailVerified & user.metadata.creationTime !== user.metadata.lastSignInTime) {
        store.commit('setUser', user)
      } else {
        // User is signed out.
        store.commit('setDefaultUser')
      }
    })
    window.onbeforeunload = function () {
      store.commit('saveData')
    }
    window.onload = function () {
      for (var i = 0; i < document.getElementsByClassName('dropdown_item_selected').length; i++) {
        document.getElementsByClassName('dropdown_item_selected')[i].classList.add('dropdown_item')
        document.getElementsByClassName('dropdown_item_selected')[i].classList.remove('dropdown_item_selected')
      }
      if (this.currentPage === 'benefits') {
        document.getElementById('benefits').classList.remove('dropdown_item')
        document.getElementById('benefits').classList.add('dropdown_item_selected')
      } else if (this.currentPage === 'calendar') {
        document.getElementById('calendar').classList.remove('dropdown_item')
        document.getElementById('calendar').classList.add('dropdown_item_selected')
      } else if (this.currentPage === 'menu') {
        document.getElementById('menu').classList.remove('dropdown_item')
        document.getElementById('menu').classList.add('dropdown_item_selected')
      } else if (this.currentPage === 'shoppinglist') {
        document.getElementById('shoppinglist').classList.remove('dropdown_item')
        document.getElementById('shoppinglist').classList.add('dropdown_item_selected')
      } else if (this.currentPage === 'profile') {
        document.getElementById('profile').classList.remove('dropdown_item')
        document.getElementById('profile').classList.add('dropdown_item_selected')
      } else if (this.currentPage === 'register') {
        document.getElementById('register').classList.remove('dropdown_item')
        document.getElementById('register').classList.add('dropdown_item_selected')
      } else if (this.currentPage === 'login') {
        document.getElementById('login').classList.remove('dropdown_item')
        document.getElementById('login').classList.add('dropdown_item_selected')
      }
    }
  },
  computed: {
    ...mapState([
      'currentPage'
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
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
</style>
