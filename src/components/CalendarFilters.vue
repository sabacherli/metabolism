<template lang="html">
  <div class="filters">
    <template v-for="address in userData.addresses">
      <!-- eslint-disable-next-line -->
      <div class="filter" @click="toggleLocation(address)">
        <p> {{ address.name }} </p>
        <div :class="{ filter_selected: address.isActive }"></div>
      </div>
    </template>
    <template v-for="option in calendarOptions">
      <!-- eslint-disable-next-line -->
      <div v-if="currentPage === 'calendar'" class="filter" @click="toggleCalendarOptions(option)">
        <p> {{ option.text }} </p>
        <div :class="{ filter_selected: option.isActive }"></div>
      </div>
    </template>
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
      'currentPage',
      'calendarOptions'
    ])
  },
  methods: {
    ...mapMutations([
      'toggleLocation',
      'toggleCalendarOptions'
    ])
  }
}
</script>

<style lang="css" scoped>
.filters {
  position: absolute;
  bottom: 0px;
  height: 25px;
  width: calc(100% - 40px);
  margin-left: 20px;
  margin-right: 20px;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  text-align: center;
}
.filter {
  position: relative;
  display: inline-block;
  bottom: 15px;
  margin: auto 15px auto 15px;
  text-align: center;
  color: white;
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
