<template>
  <div id="app">
    <router-view name="banner"></router-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/javascript">
import firebase from 'firebase/app';
import 'firebase/auth';
import store from './store';

export default {
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        if (user.emailVerified) {
          store.dispatch('setUser', user);
        }
      } else {
        // User is signed out.
        firebase.auth().signOut()
          .then((success) => {
            store.dispatch('setDefault');
          })
          .catch((error) => {
            alert(error.message);
            console.log(error.code);
          });
      }
    });
    window.onbeforeunload = function () {
      store.commit('saveData');
    };
  },
};
</script>

<style>
#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  font-family: Montserrat;
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
}
</style>
