import Vue from 'vue'
import Router from 'vue-router'
import Benefits from './views/Benefits.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/benefits',
      meta: {
        title: 'Metabolism',
        metaTags: [
          {
            name: 'Meal Planner & Shopping List',
            content: 'Automatically create shopping lists and plan meals for a healthy lifestyle, for you and the family.'
          }
        ]
      }
    },
    {
      path: '/benefits',
      name: 'benefits',
      component: Benefits,
      meta: {
        title: 'Metabolism',
        metaTags: [
          {
            name: 'Meal Planner & Shopping List',
            content: 'Automatically create shopping lists and plan meals for a healthy lifestyle, for you and the family.'
          }
        ]
      }
    },
    {
      path: '/calendar',
      name: 'calendar',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import(/* webpackChunkName: "calendar" */ './views/Calendar.vue'),
        dropdown: () => import(/* webpackChunkName: "dropdown" */ './components/Dropdown.vue'),
        banner: () => import(/* webpackChunkName: "banner" */ './components/Banner.vue')
      },
      meta: {
        title: 'Metabolism',
        metaTags: [
          {
            name: 'Meal Planner & Shopping List',
            content: 'Automatically create shopping lists and plan meals for a healthy lifestyle, for you and the family.'
          }
        ]
      }
    },
    {
      path: '/recipes',
      name: 'recipes',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import(/* webpackChunkName: "recipes" */ './views/Recipes.vue'),
        dropdown: () => import(/* webpackChunkName: "dropdown" */ './components/Dropdown.vue'),
        banner: () => import(/* webpackChunkName: "banner" */ './components/Banner.vue')
      },
      meta: {
        title: 'Metabolism',
        metaTags: [
          {
            name: 'Meal Planner & Shopping List',
            content: 'Automatically create shopping lists and plan meals for a healthy lifestyle, for you and the family.'
          }
        ]
      }
    },
    {
      path: '/edit',
      name: 'edit',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import(/* webpackChunkName: "edit" */ './views/Edit.vue'),
        dropdown: () => import(/* webpackChunkName: "dropdown" */ './components/Dropdown.vue'),
        banner: () => import(/* webpackChunkName: "banner" */ './components/Banner.vue')
      },
      meta: {
        title: 'Metabolism',
        metaTags: [
          {
            name: 'Meal Planner & Shopping List',
            content: 'Automatically create shopping lists and plan meals for a healthy lifestyle, for you and the family.'
          }
        ]
      }
    },
    {
      path: '/shoppinglist',
      name: 'shoppinglist',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import(/* webpackChunkName: "shoppinglist" */ './views/Shoppinglist.vue'),
        dropdown: () => import(/* webpackChunkName: "dropdown" */ './components/Dropdown.vue'),
        banner: () => import(/* webpackChunkName: "banner" */ './components/Banner.vue')
      },
      meta: {
        title: 'Metabolism',
        metaTags: [
          {
            name: 'Meal Planner & Shopping List',
            content: 'Automatically create shopping lists and plan meals for a healthy lifestyle, for you and the family.'
          }
        ]
      }
    },
    {
      path: '/profile',
      name: 'profile',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue'),
        dropdown: () => import(/* webpackChunkName: "dropdown" */ './components/Dropdown.vue'),
        banner: () => import(/* webpackChunkName: "banner" */ './components/Banner.vue')
      },
      meta: {
        title: 'Metabolism',
        metaTags: [
          {
            name: 'Meal Planner & Shopping List',
            content: 'Automatically create shopping lists and plan meals for a healthy lifestyle, for you and the family.'
          }
        ]
      }
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
        dropdown: () => import(/* webpackChunkName: "dropdown" */ './components/Dropdown.vue')
      },
      meta: {
        title: 'Metabolism',
        metaTags: [
          {
            name: 'Meal Planner & Shopping List',
            content: 'Automatically create shopping lists and plan meals for a healthy lifestyle, for you and the family.'
          }
        ]
      }
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import(/* webpackChunkName: "register" */ './views/Register.vue'),
        dropdown: () => import(/* webpackChunkName: "dropdown" */ './components/Dropdown.vue')
      },
      meta: {
        title: 'Metabolism',
        metaTags: [
          {
            name: 'Meal Planner & Shopping List',
            content: 'Automatically create shopping lists and plan meals for a healthy lifestyle, for you and the family.'
          }
        ]
      }
    },
    {
      path: '/information',
      name: 'information',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import(/* webpackChunkName: "information" */ './views/Information.vue'),
        dropdown: () => import(/* webpackChunkName: "dropdown" */ './components/Dropdown.vue')
      },
      meta: {
        title: 'Metabolism',
        metaTags: [
          {
            name: 'Meal Planner & Shopping List',
            content: 'Automatically create shopping lists and plan meals for a healthy lifestyle, for you and the family.'
          }
        ]
      }
    },
    {
      path: '/discover',
      name: 'discover',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import(/* webpackChunkName: "discover" */ './views/Discover.vue'),
        dropdown: () => import(/* webpackChunkName: "dropdown" */ './components/Dropdown.vue')
      },
      meta: {
        title: 'Metabolism',
        metaTags: [
          {
            name: 'Meal Planner & Shopping List',
            content: 'Automatically create shopping lists and plan meals for a healthy lifestyle, for you and the family.'
          }
        ]
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
