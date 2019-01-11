<template lang="html">
  <div class="filters">
    <template v-for="filter in userData.tagList">
      <!-- eslint-disable-next-line -->
      <div class="filter" @click="toggleFilter(filter)">
        <p> {{ filter.text }} </p>
        <div :class="{ filter_selected: filter.isActive }">

        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'MealFilters',
  computed: {
    ...mapState([
      'userData'
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
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.filters {
  animation: fadeIn 1.2s;
}
.filters {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 25px;
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
  height: 2px;
  margin: auto;
  background-color: white;
  animation: expand .4s;
  animation-fill-mode: forwards;
}
</style>
