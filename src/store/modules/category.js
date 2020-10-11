import { http } from '@/api'

export default {
  state: {
    cateList: []
  },

  mutations: {
    setCateList (state, cateList) { state.cateList = cateList }
  },

  actions: {
    // 获取分类列表
    getCates ({ commit }) {
      return new Promise((resolve, reject) => {
        http.reqCateList()
          .then(cateList => {
            if (cateList) {
              commit('setCateList', cateList)
              resolve()
            }
          })
          .catch(reject)
      })
    },

    // 新增与编辑分类
    addCate ({ state, commit }, params) {
      return new Promise((resolve, reject) => {
        http.reqAddCate(params)
          .then(cate => {
            if (cate) {
              const { cateList } = state
              const index = cateList.findIndex(item => item.cateId === cate.cateId)
              if (index === -1) cateList.unshift(cate)
              else cateList.splice(index, 1, cate)
              commit('setCateList', cateList)
              resolve()
            } else reject(new Error('服务器没有响应'))
          })
          .catch(reject)
      })
    },

    // 删除分类
    delCate ({ state, commit }, cateId) {
      return new Promise((resolve, reject) => {
        http.reqDelCate(cateId)
          .then(result => {
            if (result) {
              const { cateList } = state
              cateList.splice(cateList.findIndex(cate => cate.cateId === cateId), 1)
              commit('setCateList', cateList)
              resolve()
            }
          })
          .catch(reject)
      })
    },

    // 分类排序
    cateSort ({ state, commit }, index) {
      const { cateList } = state
      const cate = cateList[index]
      cateList.splice(index, 1)
      cateList.unshift(cate)
      commit('setCateList', cateList)
    }
  }
}
