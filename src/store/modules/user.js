import { http } from '@/api'
import { asyncRouter } from '@/router/route'
import { createStorage } from '@/utils/storage'
import { PAGESIZE } from '@/config'

const userStorage = createStorage({ key: 'user' })

export default {
  state: {
    user: userStorage.val || {},
    userRoutes: [],
    userList: []
  },
  mutations: {
    setUser (state, user) { state.user = user },
    setUserRoutes (state, routes) { state.userRoutes = routes },
    userLogout (state) {
      state.user = {}
      state.userRoutes = []
    },
    setUserList (state, userList) { state.userList = userList }
  },
  actions: {
    // 用户登录
    login ({ commit }, params) {
      return new Promise((resolve, reject) => {
        http.reqLogin(params)
          .then(user => {
            commit('setUser', user)
            userStorage.set(user)
            resolve(user)
          })
          .catch(reject)
      })
    },

    // 退出登录
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        userStorage.del()
        commit('userLogout')
        resolve()
      })
    },

    // 获取用户权限菜单
    getUserRoutes ({ state, commit }) {
      return new Promise((resolve, reject) => {
        const { user } = state
        if (user && user.rank >= 0) {
          const userRoutes = asyncRouter(user.rank)
          commit('setUserRoutes', userRoutes)
          resolve(userRoutes)
        } else reject(new Error('您还未登录'))
      })
    },

    // 获取用户列表
    getUserList ({ state, commit }, pageNum) {
      return new Promise((resolve, reject) => {
        const { userList } = state
        const userCount = pageNum * PAGESIZE
        if (userCount < userList.length) return resolve(userList)
        http.reqUsers(pageNum)
          .then(users => {
            // 先放着, 之后再来优化 total 的问题
            const { list, total } = users
            if (userList.length - total < 0) userList.push(...list)
            else return resolve(userList)
            commit('setUserList', userList)
            resolve(userList, total)
          })
          .catch(reject)
      })
    },

    // 修改用户信息
    editUser ({ state, commit }, params) {
      return new Promise((resolve, reject) => {
        http.reqEditUser(params)
          .then(user => {
            state.userList.splice(state.userList.findIndex(item => item.userId === user.userId), 1, user)
            commit('setUserList', state.userList)
            resolve(state.userList)
          })
          .catch(reject)
      })
    },

    // 删除用户
    delUser ({ state, commit }, userId) {
      return new Promise((resolve, reject) => {
        http.reqDelUser(userId)
          .then(() => {
            state.userList.splice(state.userList.findIndex(item => item.userId === userId), 1)
            commit('setUserList', state.userList)
            resolve(state.userList)
          })
          .catch(reject)
      })
    },

    // 搜索用户
    searchUser ({ state }, phone) {
      return new Promise((resolve, reject) => {
        const users = state.userList.filter(user => new RegExp(phone).test(user.phone))
        if (users.length) resolve(users)
        else if (!/^1[34578]\d{9}$/g.test(phone)) resolve([])
        else {
          http.reqSeachUser(phone)
            .then(user => {
              if (user) resolve([user])
              else reject(new Error())
            })
            .catch(reject)
        }
      })
    },

    // 查询用户是否已申请注册商家
    isRegistered ({ commit }, userId) {
      return new Promise((resolve, reject) => {
        http.verifyIsRegistered(userId)
          .then((result) => {
            if (result === true) resolve()
            else reject(new Error())
          })
          .catch(reject)
      })
    }
  }
}
