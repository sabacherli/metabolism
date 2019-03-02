<template lang="html">
  <div id="container" class="dropdown">
    <img id="dropdown_icon" class="dropdown_icon_t dropdown_icon_p" src="../assets/icon-menu-dropdown.png" alt="Menu" @click="touchCome()">
    <div id="dropdown_nav" class="dropdown_nav_p dropdown_nav_t">
      <img id="dropdown_close" class="dropdown_close_t dropdown_close_p" src="../assets/icons8-delete-50.png" alt="Close" @click="touchLeave()">
      <span id="benefits" class="dropdown_item" v-if="userData.uid === 'default'" v-on:click='goBenefits()'>BENEFITS</span>
      <div class="dropdown_item_break" v-if="userData.uid === 'default'">

      </div>
      <span id="calendar" class="dropdown_item" v-on:click='goCalendar()'>CALENDAR</span>
      <div class="dropdown_item_break">

      </div>
      <span id="shoppinglist" class="dropdown_item" v-on:click='goShoppinglist()'>SHOPPING LIST</span>
      <div class="dropdown_item_break">

      </div>
      <span id="recipes" class="dropdown_item" v-on:click='goRecipies()'>RECIPIES</span>
      <div class="dropdown_item_break">

      </div>
      <span id="profile" class="dropdown_item" v-if="userData.uid !== 'default'" v-on:click='goProfile()'>PROFILE</span>
      <div class="dropdown_item_break" v-if="userData.uid !== 'default'">

      </div>
      <span id="information" class="dropdown_item" v-if="userData.uid === 'default'" v-on:click='goInformation()'>INFORMATION</span>
      <div class="dropdown_item_break" v-if="userData.uid === 'default'">

      </div>
      <span id="register" class="dropdown_item" v-if="userData.uid === 'default'" v-on:click='goRegister()'>REGISTER</span>
      <div class="dropdown_item_break" v-if="userData.uid === 'default'">

      </div>
      <span id="login" class="dropdown_item" v-if="userData.uid === 'default'" v-on:click='goLogin()'>LOGIN</span>
      <span id="logout" class="dropdown_item" v-if="userData.uid !== 'default'" v-on:click='logout()'>LOGOUT</span>
    </div>
    <div id="background" class="" @click="touchLeave()">

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
  name: 'Dropdown',
  mounted () {
    for (var i = 0; i < document.getElementsByClassName('dropdown_item_selected').length; i++) {
      document.getElementsByClassName('dropdown_item_selected')[i].classList.add('dropdown_item')
      document.getElementsByClassName('dropdown_item_selected')[i].classList.remove('dropdown_item_selected')
    }
    if (this.currentPage === 'benefits' && document.getElementById('benefits') !== null) {
      document.getElementById('benefits').classList.remove('dropdown_item')
      document.getElementById('benefits').classList.add('dropdown_item_selected')
    } else if (this.currentPage === 'calendar' && document.getElementById('calendar') !== null) {
      document.getElementById('calendar').classList.remove('dropdown_item')
      document.getElementById('calendar').classList.add('dropdown_item_selected')
    } else if (this.currentPage === 'recipes' && document.getElementById('recipes') !== null) {
      document.getElementById('recipes').classList.remove('dropdown_item')
      document.getElementById('recipes').classList.add('dropdown_item_selected')
    } else if (this.currentPage === 'shoppinglist' && document.getElementById('shoppinglist') !== null) {
      document.getElementById('shoppinglist').classList.remove('dropdown_item')
      document.getElementById('shoppinglist').classList.add('dropdown_item_selected')
    } else if (this.currentPage === 'profile' && document.getElementById('profile') !== null) {
      document.getElementById('profile').classList.remove('dropdown_item')
      document.getElementById('profile').classList.add('dropdown_item_selected')
    } else if (this.currentPage === 'information' && document.getElementById('information') !== null) {
      document.getElementById('information').classList.remove('dropdown_item')
      document.getElementById('information').classList.add('dropdown_item_selected')
    } else if (this.currentPage === 'register' && document.getElementById('register') !== null) {
      document.getElementById('register').classList.remove('dropdown_item')
      document.getElementById('register').classList.add('dropdown_item_selected')
    } else if (this.currentPage === 'login' && document.getElementById('login') !== null) {
      document.getElementById('login').classList.remove('dropdown_item')
      document.getElementById('login').classList.add('dropdown_item_selected')
    }
  },
  computed: {
    ...mapState([
      'currentPage',
      'userData'
    ])
  },
  methods: {
    goBenefits () {
      store.commit('setPage', 'benefits')
      router.push('benefits')
      // hover actions
      document.getElementById('container').classList.add('remove_hover')
      setTimeout(this.removeClass, 800)
      // no hover actions
      document.getElementById('dropdown_nav').classList.remove('dropdown_nav_touch')
      document.getElementById('dropdown_icon').classList.remove('dropdown_icon_touch')
      document.getElementById('dropdown_close').classList.remove('dropdown_close_touch')
      document.getElementById('dropdown_nav').classList.add('dropdown_nav_t')
      document.getElementById('dropdown_icon').classList.add('dropdown_icon')
      document.getElementById('dropdown_close').classList.add('dropdown_close')
      document.getElementById('background').classList.remove('background_t')
      this.$forceUpdate()
    },
    goCalendar () {
      store.commit('setPage', 'calendar')
      router.push('calendar')
      // hover actions
      document.getElementById('container').classList.add('remove_hover')
      setTimeout(this.removeClass, 800)
      // no hover actions
      document.getElementById('dropdown_nav').classList.remove('dropdown_nav_touch')
      document.getElementById('dropdown_icon').classList.remove('dropdown_icon_touch')
      document.getElementById('dropdown_close').classList.remove('dropdown_close_touch')
      document.getElementById('dropdown_nav').classList.add('dropdown_nav_t')
      document.getElementById('dropdown_icon').classList.add('dropdown_icon')
      document.getElementById('dropdown_close').classList.add('dropdown_close')
      document.getElementById('background').classList.remove('background_t')
      this.$forceUpdate()
    },
    goRecipies () {
      store.commit('setPage', 'recipes')
      router.push('recipes')
      store.commit('resetPointer')
      // hover actions
      document.getElementById('container').classList.add('remove_hover')
      setTimeout(this.removeClass, 800)
      // no hover actions
      document.getElementById('dropdown_nav').classList.remove('dropdown_nav_touch')
      document.getElementById('dropdown_icon').classList.remove('dropdown_icon_touch')
      document.getElementById('dropdown_close').classList.remove('dropdown_close_touch')
      document.getElementById('dropdown_nav').classList.add('dropdown_nav_t')
      document.getElementById('dropdown_icon').classList.add('dropdown_icon')
      document.getElementById('dropdown_close').classList.add('dropdown_close')
      document.getElementById('background').classList.remove('background_t')
      this.$forceUpdate()
    },
    goShoppinglist () {
      store.commit('setPage', 'shoppinglist')
      router.push('shoppinglist')
      // hover actions
      document.getElementById('container').classList.add('remove_hover')
      setTimeout(this.removeClass, 800)
      // no hover actions
      document.getElementById('dropdown_nav').classList.remove('dropdown_nav_touch')
      document.getElementById('dropdown_icon').classList.remove('dropdown_icon_touch')
      document.getElementById('dropdown_close').classList.remove('dropdown_close_touch')
      document.getElementById('dropdown_nav').classList.add('dropdown_nav_t')
      document.getElementById('dropdown_icon').classList.add('dropdown_icon')
      document.getElementById('dropdown_close').classList.add('dropdown_close')
      document.getElementById('background').classList.remove('background_t')
      this.$forceUpdate()
    },
    goProfile () {
      store.commit('setPage', 'profile')
      router.push('profile')
      // hover actions
      document.getElementById('container').classList.add('remove_hover')
      setTimeout(this.removeClass, 800)
      // no hover actions
      document.getElementById('dropdown_nav').classList.remove('dropdown_nav_touch')
      document.getElementById('dropdown_icon').classList.remove('dropdown_icon_touch')
      document.getElementById('dropdown_close').classList.remove('dropdown_close_touch')
      document.getElementById('dropdown_nav').classList.add('dropdown_nav_t')
      document.getElementById('dropdown_icon').classList.add('dropdown_icon')
      document.getElementById('dropdown_close').classList.add('dropdown_close')
      document.getElementById('background').classList.remove('background_t')
      this.$forceUpdate()
    },
    goLogin () {
      store.commit('setPage', 'login')
      router.push('login')
      // hover actions
      document.getElementById('container').classList.add('remove_hover')
      setTimeout(this.removeClass, 800)
      // no hover actions
      document.getElementById('dropdown_nav').classList.remove('dropdown_nav_touch')
      document.getElementById('dropdown_icon').classList.remove('dropdown_icon_touch')
      document.getElementById('dropdown_close').classList.remove('dropdown_close_touch')
      document.getElementById('dropdown_nav').classList.add('dropdown_nav_t')
      document.getElementById('dropdown_icon').classList.add('dropdown_icon')
      document.getElementById('dropdown_close').classList.add('dropdown_close')
      document.getElementById('background').classList.remove('background_t')
      this.$forceUpdate()
    },
    goInformation () {
      store.commit('setPage', 'information')
      router.push('information')
      // hover actions
      document.getElementById('container').classList.add('remove_hover')
      setTimeout(this.removeClass, 800)
      // no hover actions
      document.getElementById('dropdown_nav').classList.remove('dropdown_nav_touch')
      document.getElementById('dropdown_icon').classList.remove('dropdown_icon_touch')
      document.getElementById('dropdown_close').classList.remove('dropdown_close_touch')
      document.getElementById('dropdown_nav').classList.add('dropdown_nav_t')
      document.getElementById('dropdown_icon').classList.add('dropdown_icon')
      document.getElementById('dropdown_close').classList.add('dropdown_close')
      document.getElementById('background').classList.remove('background_t')
      this.$forceUpdate()
    },
    goRegister () {
      store.commit('setPage', 'register')
      router.push('register')
      // hover actions
      document.getElementById('container').classList.add('remove_hover')
      setTimeout(this.removeClass, 800)
      // no hover actions
      document.getElementById('dropdown_nav').classList.remove('dropdown_nav_touch')
      document.getElementById('dropdown_icon').classList.remove('dropdown_icon_touch')
      document.getElementById('dropdown_close').classList.remove('dropdown_close_touch')
      document.getElementById('dropdown_nav').classList.add('dropdown_nav_t')
      document.getElementById('dropdown_icon').classList.add('dropdown_icon')
      document.getElementById('dropdown_close').classList.add('dropdown_close')
      document.getElementById('background').classList.remove('background_t')
      this.$forceUpdate()
    },
    logout () {
      firebase.auth().signOut()
        .then(function () {
          store.commit('setPage', 'login')
          router.push('login')
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
      document.getElementById('background').classList.add('background_t')
    },
    touchLeave () {
      // hover actions
      document.getElementById('container').classList.add('remove_hover')
      setTimeout(this.removeClass, 800)
      // no hover actions
      document.getElementById('dropdown_nav').classList.remove('dropdown_nav_touch')
      document.getElementById('dropdown_icon').classList.remove('dropdown_icon_touch')
      document.getElementById('dropdown_close').classList.remove('dropdown_close_touch')
      document.getElementById('dropdown_nav').classList.add('dropdown_nav_t')
      document.getElementById('dropdown_icon').classList.add('dropdown_icon')
      document.getElementById('dropdown_close').classList.add('dropdown_close')
      document.getElementById('background').classList.remove('background_t')
    },
    removeClass () {
      // hover actions
      document.getElementById('container').classList.remove('remove_hover')
    }
  },
  updated () {
    this.$nextTick(function () {
      for (var i = 0; i < document.getElementsByClassName('dropdown_item_selected').length; i++) {
        document.getElementsByClassName('dropdown_item_selected')[i].classList.add('dropdown_item')
        document.getElementsByClassName('dropdown_item_selected')[i].classList.remove('dropdown_item_selected')
      }
      if (this.currentPage === 'benefits' && document.getElementById('benefits') !== null) {
        document.getElementById('benefits').classList.remove('dropdown_item')
        document.getElementById('benefits').classList.add('dropdown_item_selected')
      } else if (this.currentPage === 'calendar' && document.getElementById('calendar') !== null) {
        document.getElementById('calendar').classList.remove('dropdown_item')
        document.getElementById('calendar').classList.add('dropdown_item_selected')
      } else if (this.currentPage === 'recipes' && document.getElementById('recipes') !== null) {
        document.getElementById('recipes').classList.remove('dropdown_item')
        document.getElementById('recipes').classList.add('dropdown_item_selected')
      } else if (this.currentPage === 'shoppinglist' && document.getElementById('shoppinglist') !== null) {
        document.getElementById('shoppinglist').classList.remove('dropdown_item')
        document.getElementById('shoppinglist').classList.add('dropdown_item_selected')
      } else if (this.currentPage === 'profile' && document.getElementById('profile') !== null) {
        document.getElementById('profile').classList.remove('dropdown_item')
        document.getElementById('profile').classList.add('dropdown_item_selected')
      } else if (this.currentPage === 'information' && document.getElementById('information') !== null) {
        document.getElementById('information').classList.remove('dropdown_item')
        document.getElementById('information').classList.add('dropdown_item_selected')
      } else if (this.currentPage === 'register' && document.getElementById('register') !== null) {
        document.getElementById('register').classList.remove('dropdown_item')
        document.getElementById('register').classList.add('dropdown_item_selected')
      } else if (this.currentPage === 'login' && document.getElementById('login') !== null) {
        document.getElementById('login').classList.remove('dropdown_item')
        document.getElementById('login').classList.add('dropdown_item_selected')
      }
    })
  }
}
</script>

<style lang="css" scoped>
.background {
  display: none;
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
  /* Touch devices */
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
  .dropdown_icon_t {
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
  .dropdown_close_t {
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
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    margin-top: 40px;
    margin-left: 40px;
    height: 1.875em;
    width: 1.875em;
    opacity: 0;
    transform: rotate(360deg);
    transition: .8s ease-in-out;
  }
  .dropdown_close_touch {
    position: absolute;
    z-index: 30;
    top: 0;
    left: 0;
    margin-top: 40px;
    margin-left: 40px;
    height: 1.875em;
    width: 1.875em;
    opacity: 1;
    transform: rotate(360deg);
    transition: .8s ease-in-out;
  }
  .background_t {
    position: fixed;
    z-index: 0;
    width: 100%;
    height: 100%;
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
  .dropdown_icon_p {
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
  .dropdown_close_p {
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
  .dropdown:hover .dropdown_nav_p {
    left: 0;
  }
  .dropdown:hover .dropdown_icon_p {
    transform: rotate(360deg);
    z-index: 0;
    opacity: 0;
  }
  .dropdown:hover .dropdown_close_p {
    transform: rotate(360deg);
    opacity: 1;
  }
  .dropdown_close_p:hover {
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
