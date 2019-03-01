<template lang="html">
  <!-- The first empty div is required because all templates need one encompassing div -->
  <div class="">
    <div class="banner">
      <p class="version" v-if="userData.uid === 'default'" @click="goRegister()">Public Demo Version</p>
      <h1 class="brand_large target" @click="goCalendar()">METABOLISM</h1>
      <h1 class="brand_small target" @click="goCalendar()">ME</h1>
      <transition name="slide" mode="out-in" appear>
      <component :is="currentPageComponent"></component>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CalendarFilters from '@/components/CalendarFilters.vue'
import LocationFilters from '@/components/LocationFilters.vue'
import RecipeFilters from '@/components/RecipeFilters.vue'
import EditFilters from '@/components/EditFilters.vue'
import ProfileFilters from '@/components/ProfileFilters.vue'

export default {
  name: 'Banner',
  components: {
    'filters-benefits': CalendarFilters,
    'filters-calendar': CalendarFilters,
    'filters-recipies': RecipeFilters,
    'filters-edit': EditFilters,
    'filters-shoppinglist': LocationFilters,
    'filters-profile': ProfileFilters,
    'filters-register': CalendarFilters,
    'filters-login': CalendarFilters
  },
  computed: {
    ...mapState([
      'currentPage',
      'userData'
    ]),
    currentPageComponent () {
      return 'filters-' + this.currentPage
    }
  },
  methods: {
    goCalendar () {
      this.$store.commit('thisWeek')
      this.$store.commit('setPage', 'calendar')
      this.$router.push('calendar')
    },
    goRegister () {
      this.$store.commit('setPage', 'register')
      this.$router.push('register')
    }
  }
}
</script>

<style lang="css" scoped>
.banner {
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 210px;
  background: linear-gradient(to bottom right, lightpink, #ffdfa0);
  animation: slideInDown .8s;
}
.brand_large:hover {
  cursor: pointer;
}
.brand_small:hover {
  cursor: pointer;
}
.version {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  height: auto;
  padding: 5px 10px 5px 10px;
  text-align: center;
  font-weight: 500;
  font-size: 1.3em;
  color: #ffc1b8;
  background: white;
}
.version:hover {
  cursor: pointer;
}
@media (max-width: 650px) {
  .brand_large {
    display: none;
  }
  .brand_small {
    position: inherit;
    left: 50%;
    transform: translateX(-50%);
    height: auto;
    width: auto;
    color: white;
    font-size: 3.571em;
    font-weight: 600;
    letter-spacing: .1em;
    border: 5px solid white;
    padding: 20px 10px 20px 10px;
  }
  .version {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    height: auto;
    padding: 5px 9.5px 5px 9.5px;
    text-align: center;
    font-weight: 500;
    font-size: .7em;
    color: #ffc1b8;
    background: white;
  }
}
@media (min-width: 650px) {
  .brand_large {
    position: inherit;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    height: auto;
    width: auto;
    color: white;
    font-size: 3.571em;
    font-weight: 600;
    letter-spacing: .2em;
    border: 5px solid white;
    padding: 10px;
  }
  .brand_small {
    display: none;
  }
  .no_pointer {
    pointer-events: none;
  }
}
</style>
