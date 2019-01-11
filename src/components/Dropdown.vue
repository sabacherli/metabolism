<template lang="html">
  <div class="dropdown">
    <img class="dropdown_icon" src="../assets/icon-menu-dropdown.png" alt="Menu">
    <div class="dropdown_nav">
      <span id="benefits" class="dropdown_item" v-if="userID === 'default'" v-on:click='goBenefits(); thisWeek()'>BENEFITS</span>
      <div class="dropdown_item_break" v-if="userID === 'default'">

      </div>
      <span id="calendar" class="dropdown_item_selected" v-on:click='goCalendar()'>CALENDAR</span>
      <div class="dropdown_item_break">

      </div>
      <span id="shoppinglist" class="dropdown_item" v-on:click='goShoppinglist()'>SHOPPING LIST</span>
      <div style="border: .5px solid black;" class="dropdown_item_break">

      </div>
      <span id="menu" class="dropdown_item" v-on:click='goMenu()'>MENU</span>
      <div style="border: .5px solid black;" class="dropdown_item_break">

      </div>
      <span id="profile" class="dropdown_item" v-if="userID !== 'default'" v-on:click='goProfile()'>PROFILE</span>
      <div style="border: .5px solid black;" class="dropdown_item_break" v-if="userID !== 'default'">

      </div>
      <span id="register" class="dropdown_item" v-if="userID === 'default'" v-on:click='goRegister()'>REGISTER</span>
      <div style="border: .5px solid black;" class="dropdown_item_break" v-if="userID === 'default'">

      </div>
      <span id="login" class="dropdown_item" v-if="userID === 'default'" v-on:click='goLogin()'>LOGIN</span>
      <span class="dropdown_item" v-if="userID !== 'default'" v-on:click='logout()'>LOGOUT</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'Dropdown',
  computed: {
    ...mapState([
      'currentPage',
      'userID'
    ])
  },
  methods: {
    ...mapMutations([
      'thisWeek'
    ]),
    goBenefits () {
      this.$router.push('benefits')
    },
    goCalendar () {
      this.$router.push('calendar')
      this.$store.commit('getCalendar')
    },
    goMenu () {
      this.$router.push('menu')
      this.$store.commit('resetPointer')
    },
    goShoppinglist () {
      this.$router.push('shoppinglist')
    },
    goProfile () {
      this.$router.push('profile')
    },
    goLogin () {
      this.$router.push('login')
    },
    goRegister () {
      this.$router.push('register')
    },
    logout () {
      firebase.auth().signOut()
        .then(success => {
          this.$store.dispatch('setDefault')
          this.$router.push('login')
        })
        .catch(error => {
          alert(error.message)
          console.log(error.code)
        })
    }
  },
  updated () {
    if (this.currentPage === 'benefits') {
      document.getElementsByClassName('dropdown_item_selected')[0].classList.add('dropdown_item')
      document.getElementsByClassName('dropdown_item_selected')[0].classList.remove('dropdown_item_selected')
      document.getElementById('benefits').classList.remove('dropdown_item')
      document.getElementById('benefits').classList.add('dropdown_item_selected')
    } else if (this.currentPage === 'calendar') {
      document.getElementsByClassName('dropdown_item_selected')[0].classList.add('dropdown_item')
      document.getElementsByClassName('dropdown_item_selected')[0].classList.remove('dropdown_item_selected')
      document.getElementById('calendar').classList.remove('dropdown_item')
      document.getElementById('calendar').classList.add('dropdown_item_selected')
    } else if (this.currentPage === 'menu') {
      document.getElementsByClassName('dropdown_item_selected')[0].classList.add('dropdown_item')
      document.getElementsByClassName('dropdown_item_selected')[0].classList.remove('dropdown_item_selected')
      document.getElementById('menu').classList.remove('dropdown_item')
      document.getElementById('menu').classList.add('dropdown_item_selected')
    } else if (this.currentPage === 'shoppinglist') {
      document.getElementsByClassName('dropdown_item_selected')[0].classList.add('dropdown_item')
      document.getElementsByClassName('dropdown_item_selected')[0].classList.remove('dropdown_item_selected')
      document.getElementById('shoppinglist').classList.remove('dropdown_item')
      document.getElementById('shoppinglist').classList.add('dropdown_item_selected')
    } else if (this.currentPage === 'profile') {
      document.getElementsByClassName('dropdown_item_selected')[0].classList.add('dropdown_item')
      document.getElementsByClassName('dropdown_item_selected')[0].classList.remove('dropdown_item_selected')
      document.getElementById('profile').classList.remove('dropdown_item')
      document.getElementById('profile').classList.add('dropdown_item_selected')
    } else if (this.currentPage === 'register') {
      document.getElementsByClassName('dropdown_item_selected')[0].classList.add('dropdown_item')
      document.getElementsByClassName('dropdown_item_selected')[0].classList.remove('dropdown_item_selected')
      document.getElementById('register').classList.remove('dropdown_item')
      document.getElementById('register').classList.add('dropdown_item_selected')
    } else if (this.currentPage === 'login') {
      document.getElementsByClassName('dropdown_item_selected')[0].classList.add('dropdown_item')
      document.getElementsByClassName('dropdown_item_selected')[0].classList.remove('dropdown_item_selected')
      document.getElementById('login').classList.remove('dropdown_item')
      document.getElementById('login').classList.add('dropdown_item_selected')
    }
  }
}
</script>

<style lang="css" scoped>
.dropdown_icon {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  margin-top: 40px;
  margin-left: 40px;
  width: 1.875em;
  height: 1.875em;
  transition: .8s ease-in-out;
}
.dropdown:hover .dropdown_icon {
  transform: rotate(360deg);
}
.dropdown:hover .background {
  z-index: 300;
  opacity: 0.6;
}
.dropdown_nav {
  position: fixed;
  z-index: 1;
  left: -250px;
  width: 250px;
  height: 100%;
  background: white;
  opacity: 1;
  text-align: center;
  padding-top: 120px;
  transition: .8s ease-in-out;
}
.dropdown:hover .dropdown_nav {
  left: 0;
}
.dropdown_item {
  color: black;
  font-size: 1.143em;
  transition: .4s ease-in-out;
}
.dropdown_item:hover {
  cursor: pointer;
  background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: .4s ease-in-out;
}
.dropdown_item_selected {
  background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.143em;
  transition: .4s ease-in-out;
}
.dropdown_item_break {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 14px;
  margin-bottom: 14px;
  width: 12%;
  border: .6px solid black;
}
</style>
