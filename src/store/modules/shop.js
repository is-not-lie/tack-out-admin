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
    getMerchantList ({ commit }, pageNum) {
      return new Promise((resolve, reject) => {
        http.reqMerchantList(pageNum)
          .then(merchantList => {
            if (merchantList) {
              const { total, list } = merchantList
              commit('setMerchantList', list)
              resolve(total)
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
        const index = searchType === 0
          ? merchantList.findIndex(item => item.brandName === keyWord)
          : merchantList.findIndex(item => item.phone === keyWord)
        if (index !== -1) {
          const merchant = merchantList[index]
          merchantList.splice(index, 1)
          merchantList.unshift(merchant)
          commit('setMerchantList', merchantList)
          resolve()
        } else {
          http.reqSearchMerchant(params)
            .then(merchant => {
              if (merchant) {
                merchantList.unshift(merchant)
                commit('setMerchantList', merchantList)
                resolve()
              } else reject(new Error())
            })
            .catch(reject)
        }
      })
    },

    // 根据审核状态请求商家列表
    searchStatus ({ commit }, statusList) {
      return new Promise((resolve, reject) => {
        const params = statusList.length === 1
          ? { status: statusList[0], pageNum: 1 }
          : { status: statusList, pageNum: 1 }
        http.reqSearchStatus(params)
          .then(merchantList => {
            if (merchantList) {
              const { total, list } = merchantList
              commit('setMerchantList', list)
              resolve(total)
            } else reject(new Error())
          })
          .catch(reject)
      })
    }
  }
}
