import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import { createStorage } from '@/utils/storage'

const userStorage = createStorage({ key: 'user' })

interface CommitData {
  key: string;
  val: any;
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: userStorage.val || {},
    roles: []
  },
  mutations: {
    COMMIT (state, data: CommitData) {
      const { key, val } = data;
      (state as any)[key] = val
    }
  },
  actions,
  getters
})
