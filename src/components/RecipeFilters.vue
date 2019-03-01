<template lang="html">
  <div class="filters">
    <template v-for="filter in userData.mealplans[0].filters">
      <!-- eslint-disable-next-line -->
      <div class="filter" @click="toggleFilter(filter)">
        <p> {{ filter.text }} </p>
        <div :class="{ filter_selected: filter.isActive }"></div>
        <div :class="{ filter_required: filter.isRequired }"></div>
        <div :class="{ filter_required2: filter.isRequired }"></div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'RecipeFilters',
  computed: {
    ...mapState([
      'userData',
      'editor'
    ])
  },
  methods: {
    ...mapMutations([
      'toggleFilter'
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
.filter_required {
  position: relative;
  bottom: 15px;
  margin: auto;
  height: 2px;
  background-color: white;
  animation: expand .4s;
  animation-fill-mode: forwards;
}
.filter_required2 {
  position: relative;
  bottom: 14px;
  margin: auto;
  height: 2px;
  background-color: white;
  animation: expand .4s;
  animation-fill-mode: forwards;
}
</style>
