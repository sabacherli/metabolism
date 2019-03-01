<template lang="html">
  <div id="cover_page">
    <div class="background">
      <transition name="slide" mode="out-in" appear>
      <component :is="currentPageComponent"></component>
      </transition>
      <div v-if="informationFilters[0].isActive">
        <div class="title">
          FREQUENTLY
          <br>
          ASKED
          <br>
          QUESTIONS
        </div>
        <div class="container_faq">
          <div class="break"></div>
          <p class="question">What is the calorie setting for?</p>
          <p class="answer">It is used to calculate the ratio of ingredients for the shoppinglist when multiple people are eating at one address.</p>
          <div style="margin-top: 70px"></div>
          <p class="question">Are my payment details stored?</p>
          <p class="answer">No. The entire payment flow is handled by Stripe. No credit card data is stored on our servers.</p>
        </div>
      </div>
      <div v-if="informationFilters[1].isActive">
        <div class="title">
          TERMS OF
          <br>
          SERVICE
        </div>
        <div class="container_faq">
          <div class="break"></div>
          <p class="question">What is the calorie setting for?</p>
          <p class="answer">It is used to calculate the ratio of ingredients for the shoppinglist when multiple people are eating at one address.</p>
          <div style="margin-top: 70px"></div>
          <p class="question">Are my payment details stored?</p>
          <p class="answer">No. The entire payment flow is handled by Stripe. No credit card data is stored on our servers.</p>
        </div>
      </div>
      <div v-if="informationFilters[2].isActive">
        <div class="title">
          PRIVACY
          <br>
          POLICY
        </div>
        <div class="container_faq">
          <div class="break"></div>
          <p class="question">What is the calorie setting for?</p>
          <p class="answer">It is used to calculate the ratio of ingredients for the shoppinglist when multiple people are eating at one address.</p>
          <div style="margin-top: 70px"></div>
          <p class="question">Are my payment details stored?</p>
          <p class="answer">No. The entire payment flow is handled by Stripe. No credit card data is stored on our servers.</p>
        </div>
      </div>
      <div v-if="informationFilters[3].isActive">
        <div class="title">
          REACH
          <br>
          OUT
        </div>
        <div class="container_faq">
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
  display: block;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, lightpink, #ffdfa0);
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
  top: 150px;
  opacity: 0;
  transform: translateY(-150%);
  animation: slideInLeft .8s .6s forwards;
}
.container_faq {
  position: relative;
  top: 190px;
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
.container_information {
   position: relative;
   top: 300px;
   width: 100%;
   opacity: 0;
   animation: fadeIn .8s;
   animation-delay: 3s;
   animation-fill-mode: forwards;
}
.information_email,
.information_password {
   position: relative;
   display: inline-block;
   top: 15%;
   left: 50%;
   transform: translateX(-50%);
   height: 30px;
   width: 35%;
   text-align: center;
   color: darkgray;
   font-size: 14px;
   font-family: Montserrat;
   letter-spacing: .2px;
   border-style: none;
   border-radius: 25px;
   border-width: 2px;
   background: white;
 }
input[type=email].information_email:focus,
input[type=password].information_password:focus {
  background-color: #F8F8F8;
  outline: none;
  letter-spacing: .2px;
  font-size: 14px;
}
.information_button {
  position: relative;
  display: inline-block;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 50px;
  color: white;
  font-size: 1em;
  border: 2px solid white;
  border-radius: 20px 20px;
  padding: 5px 10px 5px 10px;
}
.information_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
#resend_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
  outline: none;
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
    top: 180px;
    width: 90%;
    margin-left: 10%;
    text-align: left;
    line-height: 1em;
    color: white;
    font-size: 4em;
    font-weight: 800;
    letter-spacing: .05em;
    opacity: 0;
    transform: translateY(-150%);
    animation: slideInLeft .8s 1.2s forwards;
  }
  .container_faq {
    width: 70%;
  }
  .question {
    font-size: 1.5em;
  }
  .information_email,
  .information_password {
   width: 60%;
 }
}
@media (hover:hover) {
  .information_button:hover {
    cursor: pointer;
    color: #ffdeb9;
    font-weight: 400;
    background: white;
    transition: .4s ease-in-out;
  }
  #resend_button {
    cursor: pointer;
    color: #ffdeb9;
    font-weight: 400;
    background: white;
    transition: .4s ease-in-out;
    outline: none;
  }
  .icon:hover {
    cursor: pointer;
  }
}
</style>
