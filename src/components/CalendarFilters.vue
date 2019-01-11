<template lang="html">
  <div class="filters">
    <template v-for="address in userData.addresses">
      <!-- eslint-disable-next-line -->
      <div class="filter" @click="toggleLocation(address)">
        <p> {{ address.name }} </p>
        <div :class="{ filter_selected: address.isActive }">

        </div>
      </div>
    </template>
    <div v-if="currentPage === 'calendar'" class="filter" @click="toggleMenu(menu)">
      <p> {{ menu.text }} </p>
      <div :class="{ filter_selected: menu.isActive }">

      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'CalendarFilters',
  computed: {
    ...mapState([
      'userData',
      'menu',
      'currentPage'
    ])
  },
  methods: {
    ...mapMutations([
      'toggleLocation',
      'toggleMenu'
    ])
  }
}
</script>

<style lang="css" scoped>
.filters {
  position: absolute;
  bottom: 0;
  height: 25px;
  width: 100%;
  text-align: center;
}
.filter {
  position: relative;
  display: inline-block;
  bottom: 15px;
  margin: auto 15px auto 15px;
  color: white;
  text-align: center;
}
.filter:hover {
  cursor: pointer;
}
.filter_selected {
  position: relative;
  bottom: 15px;
  margin: auto;
  height: 2px;
  background-color: white;
  animation: expand .4s;
  animation-fill-mode: forwards;
}
</style>
