import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cate from './modules/category'
import shop from './modules/shop'
import goods from './modules/goods'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    cate,
    shop,
    goods
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
