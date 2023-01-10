import Vue from 'vue'
import Vuex from 'vuex'
import state from '@/store/state'
import mutations from '@/store/mutations'
import modules from './modules'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters: {
  },
  mutations,
  actions: {
  },
  modules
})
