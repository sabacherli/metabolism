<template>
  <div id="cover_page">
    <div class="background" @click="scrollCalendar()">
      <div class="brand_large">
        <a>METABOLISM</a>
      </div>
      <div class="brand_small">
        <img src="../assets/logo.png" alt="Logo">
      </div>
      <div class="container_benefits">
        <div id="benefit1" class="benefits">
          <p class="benefits_icon">1</p>
          Meal Planner
          <div class="benefits_explanation">Never have problems coming up with meals again</div>
        </div>
        <div id="benefit2" class="benefits">
          <p class="benefits_icon">2</p>
          Shopping List
          <div class="benefits_explanation">A shopping list automatically created based on your meal plan</div>
        </div>
        <div id="benefit3" class="benefits">
          <p class="benefits_icon">3</p>
          Family Sharing
          <div class="benefits_explanation">Share the meal plan with all members of the household</div>
          <!-- Fix styling, credit not visible. Crediting isn't required though. -->
        </div>
        <div class="enter_button" @click="scrollCalendar()">
          Discover the app
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Landing',
  created () {
    this.$store.commit('setPage', 'benefits')
  },
  methods: {
    scrollCalendar () {
      document.getElementById('cover_page').classList.add('slideOutUp')
      setTimeout(function () {
        this.$router.push('calendar')
      }.bind(this), 800)
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="css" scoped>
#cover_page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.slideOutUp {
  animation: slideOutUp .8s;
  animation-fill-mode: forwards;
}
.background {
  position: fixed;
  display: block;
  overflow: scroll;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, lightpink, #ffdfa0);
  animation: slideInDown 1.2s;
}
.container_benefits {
  position: absolute;
  top: 450px;
  width: 80%;
  padding-left: 10%;
}
#benefit1 {
  animation: fadeIn .8s;
  animation-delay: 2s;
  animation-fill-mode: forwards;
}
#benefit2 {
  animation: fadeIn .8s;
  animation-delay: 2.8s;
  animation-fill-mode: forwards;
}
#benefit3 {
  animation: fadeIn .8s;
  animation-delay: 3.6s;
  animation-fill-mode: forwards;
}
.benefits_icon {
  position: relative;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 30px;
  width: 30px;
  text-align: center;
  color: white;
  font-size: 20px;
  border: 2px solid white;
  padding: 5px;
}
.enter_button {
  position: relative;
  display: inline-block;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 50px;
  color: white;
  font-size: 1em;
  border: 2px solid white;
  border-radius: 20px 20px;
  padding: 5px 10px 5px 10px;
}
.enter_button:hover {
  cursor: pointer;
  color: #ffdeb9;
  font-weight: 400;
  background: white;
  transition: .4s ease-in-out;
}
.enter_button:active {
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
  transition: 0s;
}
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
@media (max-width: 650px) {
  .brand_large {
    display: none;
  }
  .brand_small {
    position: relative;
    top: 150px;
    text-align: center;
    opacity: 0;
    animation: slideInLeft .8s 1.2s forwards;
  }
  .benefits {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 110px;
    width: 30%;
    color: white;
    text-align: center;
    font-size: 25px;
    opacity: 0;
  }
  .benefits_explanation {
    text-align: center;
    font-size: 14px;
    margin-top: 20px;
    margin-bottom: -20px;
    color: white;
  }
}
@media (max-width: 850px) and (min-width: 650px) {
  .brand_large {
    display: none;
  }
  .brand_small {
    position: relative;
    top: 150px;
    text-align: center;
    opacity: 0;
    animation: slideInLeft .8s 1.2s forwards;
  }
  .benefits {
    color: white;
    opacity: 0;
    position: relative;
    text-align: center;
    font-size: 25px;
    margin-bottom: 110px;
    width: 30%;
    left: 50%;
    transform: translateX(-50%);
  }
  .benefits_explanation {
    text-align: center;
    font-size: 14px;
    margin-top: 20px;
    margin-bottom: -20px;
    color: white;
  }
}
@media (min-width: 850px) {
  .brand_large {
    text-align: center;
    font-size: 9em;
    font-weight: 800;
    letter-spacing: .05em;
    color: white;
    width: 100%;
    position: relative;
    top: 200px;
    opacity: 0;
    transform: translateY(-150%);
    animation: slideInLeft .8s 1.2s forwards;
  }
  .brand_small {
    display: none;
  }
  .benefits {
    color: white;
    opacity: 0;
    text-align: center;
    font-size: 20px;
    width: calc(99%/3);
    display: inline-block;
    overflow: visible;
    vertical-align: top;
  }
  .benefits_explanation {
    text-align: center;
    font-size: 14px;
    margin-top: 20px;
    margin-left: 20%;
    margin-right: 20%;
  }
  .enter_button {
    top: 100px;
    margin-bottom: 20px;
  }
}
</style>
