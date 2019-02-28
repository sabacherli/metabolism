<template lang="html">
  <!-- The first empty div is required because all templates need one encompassing div -->
  <div class="">
    <div class="banner">
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
import MealFilters from '@/components/MealFilters.vue'
import EditFilters from '@/components/EditFilters.vue'
import ProfileFilters from '@/components/ProfileFilters.vue'

export default {
  name: 'Banner',
  components: {
    'filters-benefits': CalendarFilters,
    'filters-calendar': CalendarFilters,
    'filters-recipies': MealFilters,
    'filters-edit': EditFilters,
    'filters-shoppinglist': LocationFilters,
    'filters-profile': ProfileFilters,
    'filters-register': CalendarFilters,
    'filters-login': CalendarFilters
  },
  computed: {
    ...mapState([
      'currentPage'
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
