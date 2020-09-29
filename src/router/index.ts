import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { createStorage } from '@/utils/storage'

const userStorage = createStorage({ key: 'user' })

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const { name, meta } = to
  const _id = userStorage.val?._id
  if (name === 'login') {
    if (_id) next({ replace: true, name: 'home' })
    else next()
  } else if (from.name === 'login') next()
  else {
    if (!_id) next({ replace: true, name: 'login' })
    else {
      const { userAuthority } = meta
      const { authority } = userStorage.val
      if (userAuthority > authority) next({ replace: true, name: from.name })
      else next()
    }
  }
})

export default router
