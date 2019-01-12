<template lang="html">
  <div id="container" class="dropdown">
    <img id="dropdown_icon" class="dropdown_icon" src="../assets/icon-menu-dropdown.png" alt="Menu" @click="touchCome()">
    <div id="dropdown_nav" class="dropdown_nav_p dropdown_nav_t">
      <img id="dropdown_close" class="dropdown_close" src="../assets/icons8-delete-50.png" alt="Close" @click="touchLeave()">
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
      this.$store.commit('setPage', 'benefits')
      this.$router.push('benefits')
      this.$forceUpdate()
    },
    goCalendar () {
      this.$store.commit('setPage', 'calendar')
      this.$router.push('calendar')
      this.$store.commit('getCalendar')
      this.$forceUpdate()
    },
    goMenu () {
      this.$store.commit('setPage', 'menu')
      this.$router.push('menu')
      this.$store.commit('resetPointer')
      this.$forceUpdate()
    },
    goShoppinglist () {
      this.$store.commit('setPage', 'shoppinglist')
      this.$router.push('shoppinglist')
      this.$forceUpdate()
    },
    goProfile () {
      this.$store.commit('setPage', 'profile')
      this.$router.push('profile')
      this.$forceUpdate()
    },
    goLogin () {
      this.$store.commit('setPage', 'login')
      this.$router.push('login')
      this.$forceUpdate()
    },
    goRegister () {
      this.$store.commit('setPage', 'register')
      this.$router.push('register')
      this.$forceUpdate()
    },
    logout () {
      firebase.auth().signOut()
        .then(success => {
          this.$store.dispatch('setDefault')
          this.$store.commit('setPage', 'login')
          this.$router.push('login')
          this.$forceUpdate()
        })
        .catch(error => {
          alert(error.message)
          console.log(error.code)
        })
    },
    touchCome () {
      // no hover actions
      document.getElementById('dropdown_nav').classList.remove('dropdown_nav_t')
      document.getElementById('dropdown_icon').classList.remove('dropdown_icon')
      document.getElementById('dropdown_close').classList.remove('dropdown_close')
      document.getElementById('dropdown_nav').classList.add('dropdown_nav_touch')
      document.getElementById('dropdown_icon').classList.add('dropdown_icon_touch')
      document.getElementById('dropdown_close').classList.add('dropdown_close_touch')
    },
    touchLeave () {
      // hover actions
      document.getElementById('container').classList.add('remove_hover')
      setTimeout(this.removeClass, 800)
      // no hover actions
      document.getElementById('dropdown_nav').classList.remove('dropdown_nav_touch')
      document.getElementById('dropdown_icon').classList.remove('dropdown_icon_touch')
      document.getElementById('dropdown_close').classList.remove('dropdown_close_touch')
      document.getElementById('dropdown_nav').classList.add('dropdown_nav')
      document.getElementById('dropdown_icon').classList.add('dropdown_icon')
      document.getElementById('dropdown_close').classList.add('dropdown_close')
    },
    removeClass () {
      // hover actions
      document.getElementById('container').classList.remove('remove_hover')
    }
  },
  mounted () {
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
  height: 1.875em;
  width: 1.875em;
  transition: .8s ease-in-out;
}
.dropdown_close {
  position: absolute;
  z-index: 30;
  top: 0;
  left: 0;
  margin-top: 40px;
  margin-left: 40px;
  height: 1.875em;
  width: 1.875em;
  opacity: 0;
  transition: .8s ease-in-out;
}
.dropdown_item {
  color: black;
  font-size: 1.143em;
  transition: .4s ease-in-out;
}
.dropdown_item_selected {
  font-size: 1.143em;
  background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: .4s ease-in-out;
}
.dropdown_item_break {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 14px;
  margin-bottom: 14px;
  width: 12%;
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: black;
  border-bottom-width: 1px;
}
@media (hover:none) {
  .dropdown_nav_t {
    position: fixed;
    z-index: 1;
    left: -250px;
    height: 100%;
    width: 250px;
    background: white;
    text-align: center;
    opacity: 1;
    padding-top: 120px;
    transition: .8s ease-in-out;
  }
  .dropdown_nav_touch {
    position: fixed;
    z-index: 1;
    left: 0px;
    height: 100%;
    width: 250px;
    background: white;
    text-align: center;
    opacity: 1;
    padding-top: 120px;
    transition: .8s ease-in-out;
  }
  .dropdown_icon_touch {
    transform: rotate(360deg);
    z-index: 0;
    opacity: 0;
  }
  .dropdown_close_touch {
    transform: rotate(360deg);
    opacity: 1;
  }
}
@media (hover:hover) {
  /* Mouse devices */
  .dropdown_nav_p {
    position: fixed;
    z-index: 1;
    left: -250px;
    height: 100%;
    width: 250px;
    background: white;
    text-align: center;
    opacity: 1;
    padding-top: 120px;
    transition: .8s ease-in-out;
  }
  .dropdown:hover .dropdown_nav_p {
    left: 0;
  }
  .dropdown:hover .dropdown_icon {
    transform: rotate(360deg);
    z-index: 0;
    opacity: 0;
  }
  .dropdown:hover .dropdown_close {
    transform: rotate(360deg);
    opacity: 1;
  }
  .dropdown_close:hover {
    cursor: pointer;
  }
  .dropdown_item:hover {
    cursor: pointer;
    background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: .4s ease-in-out;
  }
  .remove_hover {
    pointer-events: none;
  }
}
</style>
