import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'


import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'

Vue.use(Vuex)

const state = {
  isLoggedIn: false,
  overlay: false,
  selectedEntry: null,
  user: {
    entries: []
  },
  flashMessage: {
    show: false,
    message: '',
    error: false
  }
}

const vuexPersist = new VuexPersist({
  key: 'himama-tech-test',
  storage: window.sessionStorage,
  reducer: state => ({
    user: state.user,
    isLoggedIn: state.isLoggedIn
  })
})

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [vuexPersist.plugin]
})
