// 1级路由
import { RouteConfig } from 'vue-router'
import Main from '@/views/main/index.vue'
import { Children } from './children'

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'index',
    component: Main,
    children: Children,
    meta: { userAuthority: 0 }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue')
  }
]

export default routes
