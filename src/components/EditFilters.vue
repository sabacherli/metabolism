<template lang="html">
  <div class="filters">
    <template v-for="filter in userData.mealplans[0].filters">
      <!-- eslint-disable-next-line -->
      <div class="filter" @click="editFilter(filter)">
        <p> {{ filter.text }} </p>
        <div :class="{ filter_selected: filter.isActive }">

        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import db from '@/database.js'

export default {
  name: 'EditFilters',
  computed: {
    ...mapState([
      'userData',
      'editor'
    ])
  },
  methods: {
    ...mapMutations([
      'toggleFilter'
    ]),
    editFilter (state, filter) {
      var userData = this.userData
      var editor = this.editor
      if (filter.isActive) {
        db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('recipies').doc(userData.mealplans[0].recipies[editor.index].uid).update({
          tags: firebase.firestore.FieldValue.arrayRemove(filter.text)
        })
      } else {
        db.collection('users').doc(userData.uid).collection('mealplans').doc(userData.mealplans[0].uid).collection('recipies').doc(userData.mealplans[0].recipies[editor.index].uid).update({
          tags: firebase.firestore.FieldValue.arrayUnion(filter.text)
        })
      }
      filter.isActive = !filter.isActive
    }
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
</style>
