import { RouteConfig } from 'vue-router'
import { MainChildren } from './children'
import Index from '@/views/main/index.vue'

const routes: RouteConfig[] = [
  { path: '/', name: 'index', component: Index, children: MainChildren, redirect: '/home', meta: { authority: 0 } },
  { path: '/login', name: 'login', component: () => import('@/views/login/login.vue'), meta: { authority: 0 } },
  { path: '/signin', name: 'signin', component: () => import('@/views/shopSignin/signin.vue'), meta: { authority: 0 } }
]

export default routes
