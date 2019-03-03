<template lang="html">
  <div id="cover_page">
    <div class="background">
      <transition name="slide" mode="out-in" appear>
      <component :is="currentPageComponent"></component>
      </transition>
      <div class="content" v-if="discoverFilters[0].isActive">
        <div class="title">
          {{ discoverFilters[0].text.toUpperCase() }}
        </div>
        <div style="margin-bottom: 70px" class="container_faq">
          <div class="break"></div>
          <p class="question">What is the calorie setting for?</p>
          <p class="answer">It is used to calculate the ratio of ingredients for the shoppinglist when multiple people are eating at one address.</p>
          <div style="margin-top: 70px"></div>
          <p class="question">Are my payment details stored?</p>
          <p class="answer">No. The entire payment flow is handled by Stripe. No credit card data is stored on our servers.</p>
        </div>
      </div>
      <div class="content" v-if="discoverFilters[1].isActive">
        <div class="title">
          {{ discoverFilters[1].text.toUpperCase() }}
        </div>
        <div style="margin-bottom: 70px" class="container_faq">
          <div class="break"></div>
          <p class="question">Enter the ID of a known mealplan:</p>
          <input class="search_input" type="text" name="" value="" placeholder="e.g. wPpDZo3Qrdz3Pkh2G6XW">
        </div>
        <div class="search_button" @click="">
          Search
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '../store'
import DiscoverFilters from '@/components/DiscoverFilters.vue'

export default {
  name: 'Discover',
  components: {
    'filters-discover': DiscoverFilters
  },
  created () {
    store.commit('setPage', 'discover')
    setTimeout(function () {
      store.commit('rerender')
    }, 800)
  },
  computed: {
    ...mapState([
      'currentPage',
      'discoverFilters'
    ]),
    currentPageComponent () {
      return 'filters-' + this.currentPage
    }
  },
  methods: {
  }
}
</script>

<style lang="css" scoped>
#cover_page {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, lightpink, #ffdfa0);

}
.content {
  position: fixed;
  height: calc(100% - 110px);
  width: 100%;
  overflow: scroll;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  margin: 110px 0 0 0;
}
.title {
  text-align: left;
  font-size: 6em;
  font-weight: 800;
  letter-spacing: .05em;
  line-height: 1em;
  color: white;
  width: 90%;
  margin-left: 10%;
  position: relative;
  top: 80px;
  opacity: 0;
  transform: translateY(-150%);
  animation: slideInLeft .8s .6s forwards;
}
.container_faq {
  position: relative;
  top: 120px;
  width: 80%;
  margin-left: 10%;
  text-align: left;
  opacity: 0;
  animation: fadeIn .8s;
  animation-delay: 1.4s;
  animation-fill-mode: forwards;
}
.break {
  position: relative;
  width: 50px;
  height: auto;
  left: 0px;
  margin-top: 40px;
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: white;
  border-bottom-width: 2px;
}
.question {
  text-align: left;
  font-size: 1.8em;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: -20px;
  color: white;
}
.answer {
  text-align: left;
  font-size: 1.2em;
  margin-top: 30px;
  margin-bottom: -20px;
  color: white;
}
.container_icons {
  position: relative;
  top: 260px;
  width: 100%;
  text-align: center;
  opacity: 0;
  animation: fadeIn .8s;
  animation-delay: 3s;
  animation-fill-mode: forwards;
}
.icon {
  display: inline-block;
  height: 40px;
  width: 40px;
  margin: 0px 20px 0 20px;
}
.search_button {
  position: relative;
  display: inline-block;
  top: 120px;
  left: 10%;
  margin-bottom: 50px;
  color: white;
  font-size: 1em;
  border: 2px solid white;
  border-radius: 20px 20px;
  padding: 5px 10px 5px 10px;
  opacity: 0;
  animation: fadeIn .8s;
  animation-delay: 2s;
  animation-fill-mode: forwards;

}
.search_button:active {
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
  transition: 0s;
}
input[type=text].search_input,
input[type=number].search_input,
input[type=password].search_input {
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: white;
  border-bottom-width: 2px;
  display: block;
  width: 80%;
  position: relative;
  top: 50px;
  background: transparent;
  color: white;
  margin-bottom: 5px;
  font-size: 18px;
  font-family: Montserrat;
}
input[type=text]:focus.search_input,
input[type=number].search_input,
input[type=password]:focus.search_input  {
  position: relative;
  display: block;
  width: 80%;
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: white;
  border-bottom-width: 3px;
  outline: none;
}
::placeholder {
  font-size: 16px;
  font-family: Montserrat;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: .4px;
}
@media (max-width: 700px) {
  .title {
    position: relative;
    top: 20px;
    width: 90%;
    margin-left: 10%;
    text-align: left;
    line-height: 1em;
    color: white;
    font-size: 3em;
    font-weight: 800;
    letter-spacing: .05em;
    opacity: 0;
    transform: translateY(-150%);
    animation: slideInLeft .8s .6s forwards;
  }
  .container_faq {
    width: 80%;
    top: 50px;
  }
  .question {
    font-size: 1.5em;
  }
}
@media (hover:hover) {
  .icon:hover {
    cursor: pointer;
  }
  .search_button:hover {
    cursor: pointer;
    color: #ffcab0;
    font-weight: 400;
    background: white;
    transition: .4s ease-in-out;
  }
}
</style>
