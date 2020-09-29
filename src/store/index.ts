import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import { commitData } from '@/tsConfig/interface/storeInterface'
import { createStorage } from '@/utils/storage'

const userStorage = createStorage({ key: 'user' })

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: userStorage.val,
    globalImgs: {},
    roles: []
  },
  mutations: {
    COMMIT (state: any, data: commitData): void {
      const { key, val } = data
      state[key] = val
    }
  },
  actions,
  getters
})
