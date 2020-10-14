import { http } from '@/api'

export default {
  state: {
    goodsList: []
  },

  mutations: {
    setGoodsList (state, list) { state.goodsList = list }
  },

  actions: {
    goodsAdd ({ commit }, params) {
      return new Promise((resolve, reject) => {
        http.reqGoodsAdd(params)
          .then((goodsList) => {
            if (goodsList && goodsList.length) {
              commit('setGoodsList', goodsList)
              resolve()
            } else reject(new Error())
          })
          .catch(reject)
      })
    },

    getGoodsList ({ commit }, merchantId) {
      return new Promise((resolve, reject) => {
        http.reqGoodsList(merchantId)
          .then(merchant => {
            if (merchant && merchant.goodsList.length > 0) {
              const { goodsList, tables } = merchant
              commit('setGoodsList', goodsList)
              resolve(tables)
            } else reject(new Error())
          })
          .catch(reject)
      })
    },

    goodsEdit ({ commit }, params) {
      console.log(params)
      return new Promise((resolve, reject) => {
        http.reqGoodsEdit(params)
          .then(goodsList => {
            console.log(goodsList)
            if (goodsList && goodsList.length > 0) {
              commit('setGoodsList', goodsList)
              resolve()
            } else reject(new Error())
          })
          .catch(reject)
      })
    },

    removeGoods ({ commit }, params) {
      return new Promise((resolve, reject) => {
        http.reqRemoveGoods(params)
          .then(goodsList => {
            if (goodsList && goodsList.length > 0) {
              commit('setGoodsList', goodsList)
              resolve()
            } else reject(new Error())
          })
          .catch(reject)
      })
    },

    sortGoods ({ state, commit }, type) {
      return new Promise((resolve, reject) => {
        const { goodsList } = state
        if (goodsList.length > 0) {
          goodsList.sort((currentGoods, nextGoods) => currentGoods[type] - nextGoods[type])
          commit('setGoodsList', goodsList)
          resolve()
        } else reject(new Error())
      })
    },

    searchGoods ({ state, commit }, keyWord) {
      return new Promise((resolve, reject) => {
        const { goodsList } = state
        const index = goodsList.findIndex(goods => goods.goodsName === keyWord)
        if (index === -1) reject(new Error('抱歉...暂无该名称商品存在'))
        else {
          const goods = goodsList[index]
          goodsList.splice(index, 1)
          goodsList.unshift(goods)
          commit('setGoodsList', goodsList)
          resolve()
        }
      })
    }
  }
}
