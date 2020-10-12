import { http } from '@/api'

const searchName = (brandName, list) => new Promise((resolve, reject) => {
  const index = list.findIndex(item => item.brandName === brandName)
  if (index !== -1) resolve(index)
  else reject(new Error())
})

const searchPhone = (phone, list) => new Promise((resolve, reject) => {
  const index = list.findIndex(item => item.phone === phone)
  if (index !== -1) resolve(index)
  else reject(new Error())
})

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
    },

    // 搜索商家
    searchMerchantList ({ state, commit }, params) {
      const { searchType, keyWord } = params
      const { merchantList } = state
      return new Promise((resolve, reject) => {
        const result = searchType === 0 ? searchName(keyWord, merchantList) : searchPhone(keyWord, merchantList)
        result
          .then(index => {
            const merchant = merchantList[index]
            merchantList.splice(index, 1)
            merchantList.unshift(merchant)
            commit('setMerchantList', merchantList)
            resolve()
          })
          .catch(() => {
            http.reqSearchMerchant(params)
              .then(merchant => {
                if (merchant) {
                  merchantList.unshift(merchant)
                  commit('setMerchantList', merchantList)
                  resolve()
                } else reject(new Error())
              })
              .catch(reject)
          })
      })
    }
  }
}
