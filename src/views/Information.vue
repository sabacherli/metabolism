<template lang="html">
  <div id="cover_page">
    <div class="background">
      <transition name="slide" mode="out-in" appear>
      <component :is="currentPageComponent"></component>
      </transition>
      <div class="content" v-if="informationFilters[0].isActive">
        <div class="title">
          FREQUENTLY
          <br>
          ASKED
          <br>
          QUESTIONS
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
      <div class="content" v-if="informationFilters[1].isActive">
        <div class="title">
          TERMS OF
          <br>
          SERVICE
        </div>
        <div style="margin-bottom: 70px" class="container_faq">
          <div class="break"></div>
          <p class="question">What is the calorie setting for?</p>
          <p class="answer">It is used to calculate the ratio of ingredients for the shoppinglist when multiple people are eating at one address.</p>
          <div style="margin-top: 70px"></div>
          <p class="question">Are my payment details stored?</p>
          <p class="answer">No. The entire payment flow is handled by Stripe. No credit card data is stored on our servers.</p>
          <div style="margin-top: 70px"></div>
          <p class="question">How do the filters work?</p>
          <p class="answer">If two filters are underlined once, it will show all recipes that have at least one of the filters attached. If a filter is underlined twice, it will only show that have that filter attached.</p>
        </div>
      </div>
      <div class="content" v-if="informationFilters[2].isActive">
        <div class="title">
          PRIVACY
          <br>
          POLICY
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
      <div class="content" v-if="informationFilters[3].isActive">
        <div class="title">
          REACH
          <br>
          OUT
        </div>
        <div style="margin-bottom: 70px" class="container_faq">
          <div class="break"></div>
          <p class="question">We want to continously improve.</p>
          <p class="answer">To give us your feedback or to get in contact with us, message us on Twitter.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '../store'
import InformationFilters from '@/components/InformationFilters.vue'

export default {
  name: 'Information',
  components: {
    'filters-information': InformationFilters
  },
  created () {
    store.commit('setPage', 'information')
  },
  computed: {
    ...mapState([
      'currentPage',
      'informationFilters'
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
::placeholder {
  font-size: 14px;
  font-family: Montserrat;
  color: darkgray;
  letter-spacing: .2px;
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
}
</style>
