<template>
  <div id="cover_page">
    <div id="cover_page_background" @click="scrollCalendar()">
      <div id="cover_page_brand_name"><a id="product_link">METABOLISM</a></div>
      <div id="container_benefits">
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
        <div id="enter_button" @click="scrollCalendar()">
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
<style scoped>
.slideOutUp {
  animation: slideOutUp .8s;
  animation-fill-mode: forwards;
}
#cover_page {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
#app {
  -webkit-font-smoothing: subpixel-antialiased;
  background: #fff;
  color: #222;
  font-family: Montserrat;
  font-size: 14px;
}
html {}
body {
  -webkit-font-smoothing: subpixel-antialiased;
  background: #fff;
  color: #222;
  font-family: Montserrat;
  font-size: 14px;
}
[v-cloak] {
  display: none;
}
.brand_name {
  color: white;
  letter-spacing: .2em;
  font-family: Montserrat;
  font-size: 50px;
  font-weight: 600;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  border-style: solid;
  border-width: 5px;
  border-color: white;
  padding: 10px;
}
.brand_name:hover {
  cursor: pointer;
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
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
::-webkit-scrollbar-thumb:horizontal {
  background: black;
}
#enter_button {
  position: relative;
  color: white;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);
  display: inline-block;
  padding: 5px 10px 5px 10px;
  font-size: 1em;
  border: 2px solid white;
  border-radius: 20px 20px;
}
#enter_button:hover {
  cursor: pointer;
  background: white;
  color: #ffdeb9;
  font-weight: 400;
  transition: .4s ease-in-out;
}
#enter_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
@media (max-width: 650px) {
  #cover_page_background {
    background: linear-gradient(to bottom right, lightpink, #ffdfa0);
    width: 100%;
    height: 100%;
    position: fixed;
    display: block;
    top: 0;
    left: 0;
    animation: slideInDown .8s;
  }
  #cover_page_brand_name {
    text-align: center;
    font-size: 3.5em;
    font-weight: 800;
    letter-spacing: .08em;
    color: white;
    width: 100%;
    position: relative;
    top: 40%;
    transform: translateY(-120%);
    overflow: scroll;
  }
  #container_benefits {
    position: absolute;
    top: 60%;
    height: inherit;
    width: 80%;
    padding-left: 10%;
  }
  .benefits {
    color: white;
    opacity: 0;
    position: relative;
    text-align: center;
    font-size: 25px;
    margin-bottom: 150px;
    width: 30%;
    left: 50%;
    transform: translateX(-50%);
  }
  .benefits_icon {
    color: white;
    margin: auto;
    font-size: 20px;
    padding: 5px;
    width: 30px;
    margin-bottom: 30px;
    margin-top: 10px;
    position: relative;
    text-align: center;
    border-style: solid;
    border-color: white;
    border-width: 2px;
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
  #cover_page_background {
    background: linear-gradient(to bottom right, lightpink, #ffdfa0);
    width: 100%;
    height: 100%;
    position: fixed;
    display: block;
    top: 0;
    left: 0;
    animation: slideInDown .8s;
  }
  #cover_page_brand_name {
    text-align: center;
    font-size: 5em;
    font-weight: 800;
    letter-spacing: .1em;
    color: white;
    width: 100%;
    position: relative;
    top: 40%;
    transform: translateY(-120%);
    overflow: scroll;
    animation: shadow .4s;
    animation-delay: 2.6s;
    animation-fill-mode: forwards;
  }
  #container_benefits {
    position: absolute;
    top: 60%;
    height: inherit;
    width: 80%;
    padding-left: 10%;
  }
  #container_login {
    position: absolute;
    top: 55%;
    height: inherit;
    width: 100%;
  }
  .benefits {
    color: white;
    opacity: 0;
    position: relative;
    text-align: center;
    font-size: 25px;
    margin-bottom: 150px;
    width: 30%;
    left: 50%;
    transform: translateX(-50%);
  }
  .benefits_icon {
    color: white;
    margin: auto;
    font-size: 20px;
    padding: 5px;
    width: 30px;
    margin-bottom: 30px;
    margin-top: 10px;
    position: relative;
    text-align: center;
    border-style: solid;
    border-color: white;
    border-width: 2px;
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
  ::-webkit-scrollbar:vertical {
    width: 0px;
    height: 0px;
  }
  #cover_page_background {
    background: linear-gradient(to bottom right, lightpink, #ffdfa0);
    width: 100%;
    height: 100%;
    position: fixed;
    display: block;
    top: 0;
    left: 0;
    animation: slideInDown 1.2s;
  }
  #cover_page_brand_name {
    text-align: center;
    font-size: 9em;
    font-weight: 800;
    letter-spacing: .05em;
    color: white;
    width: 100%;
    position: relative;
    top: 25%;
    opacity: 0;
    transform: translateY(-150%);
    animation: slideInLeft .8s;
    animation-delay: 1.2s, 1.2s;
    animation-fill-mode: forwards;
  }
  #container_benefits {
    position: absolute;
    width: 80%;
    padding-left: 10%;
    height: 45%;
    bottom: 0;
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
  .benefits_icon {
    margin: auto;
    font-size: 20px;
    padding: 5px;
    width: 30px;
    margin-bottom: 40px;
    margin-top: 30px;
    position: relative;
    text-align: center;
    border-style: solid;
    border-color: white;
    border-width: 2px;
  }
  .benefits_explanation {
    text-align: center;
    font-size: 14px;
    margin-top: 20px;
    margin-left: 20%;
    margin-right: 20%;
  }
}
</style>
