import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import routes from './route'
import { createStorage } from '@/utils/storage'
import 'nprogress/nprogress.css'

const userStorage = createStorage({ key: 'user' })

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const toLogin = next => {
  if (userStorage.val) next({ name: 'home', replace: true })
  else next()
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  const { path } = to
  if (/\/login/g.test(path)) toLogin(next)
  else if (/\/404/g.test(path)) next()
  else {
    if (userStorage.val) next()
    else next({ name: 'login' })
  }
})

router.afterEach(() => {
  NProgress.done()
})

export const created = function () {
  if (userStorage.val && this.$store.getters.addRoutes.length <= 0) {
    this.$store.dispatch('getUserRoutes')
      .then(routes => {
        this.$router.addRoutes(routes)
        const { rank } = userStorage.val
        if (rank <= 0) this.$router.replace('/notshop')
      })
      .catch(() => {})
  }
}

export default router
