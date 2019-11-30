import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'

import App from '../App.vue'
import router from '../router/router'
import store from '../store/store'

Vue.use(VueAxios, axios)
Vue.use(VueRouter)

// export const HTTP = axios.create({
//   baseURL: 'http://jsonplaceholder.typicode.com/',
//   headers: {
//     Authorization: 'Bearer {token}'
//   }
// })

document.addEventListener('DOMContentLoaded', () => {
  const app = new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    render: h => h(App)
  }).$mount()

  document.body.appendChild(app.$el)
})