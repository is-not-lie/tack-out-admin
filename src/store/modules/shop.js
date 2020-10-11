import { http } from '@/api'

export default {
  state: {
    merchantList: []
  },

  mutations: {
    setMerchantList (state, merchantList) { state.merchantList = merchantList }
  },

  actions: {
    // 商家注册
    signin ({ commit }, params) {
      return new Promise((resolve, reject) => {
        http.reqShopSignin(params)
          .then(merchant => {
            if (merchant) resolve()
            else reject(new Error())
          })
          .catch(reject)
      })
    },

    // 请求商家列表
    getMerchantList ({ commit }) {
      return new Promise((resolve, reject) => {
        http.reqMerchantList()
          .then(merchantList => {
            if (merchantList && merchantList.length > 0) {
              commit('setMerchantList', merchantList)
              resolve(merchantList)
            } else reject(new Error())
          })
          .catch(reject)
      })
    },

    // 更改审核状态
    setAudit ({ state, commit }, params) {
      return new Promise((resolve, reject) => {
        http.reqSetAudit(params)
          .then((merchant) => {
            if (merchant) {
              const { merchantList } = state
              const { merchantId } = merchant
              merchantList.splice(merchantList.findIndex(item => item.merchantId === merchantId), 1, merchant)
              commit('setMerchantList', merchantList)
              resolve()
            } else reject(new Error())
          })
          .catch(reject)
      })
    }
  }
}
