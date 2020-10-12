import { PageLayout, LoginLayout, SigninLayout } from '@/layouts'

const rootRouter = [
  {
    path: '/',
    name: 'index',
    component: PageLayout,
    redirect: '/home',
    children: []
  },
  {
    path: '/signin',
    name: 'signin',
    component: SigninLayout,
    redirect: '/signin/shopsignin',
    children: [
      {
        path: '/signin/shopsignin',
        name: 'shopSignin',
        component: () => import('@/views/signin/shopSignin.vue')
      },
      {
        path: '/signin/success',
        name: 'signinSuccess',
        component: () => import('@/views/result/success.vue')
      },
      {
        path: '/signin/error',
        name: 'signinError',
        component: () => import('@/views/result/error.vue')
      }
    ]
  },
  {
    path: '/notshop',
    name: 'notShop',
    component: () => import('@/views/result/noShop')
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

const shopRouter = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/shop/home.vue'),
    meta: { title: '工作台', icon: 'edit' }
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/views/shop/shop.vue'),
    meta: { title: '店铺详情', icon: 'shop' }
  },
  {
    path: '/goods',
    name: 'goods',
    component: () => import('@/views/shop/goods.vue'),
    meta: { title: '商品列表', icon: 'gift' }
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/shop/order.vue'),
    meta: { title: '订单列表', icon: 'container' }
  },
  {
    path: '/comment',
    name: 'comment',
    component: () => import('@/views/shop/comment.vue'),
    meta: { title: '评论列表', icon: 'message' }
  },
  {
    path: '/sales',
    name: 'sales',
    component: () => import('@/views/shop/sales.vue'),
    meta: { title: '销量', icon: 'fund' }
  },
  {
    path: '/repertory',
    name: 'repertory',
    component: () => import('@/views/shop/repertory.vue'),
    meta: { title: '库存', icon: 'database' }
  }
]

const custodianRouter = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/custodian/home.vue'),
    meta: { title: '工作台', icon: 'edit' }
  },
  {
    path: '/audit',
    name: 'audit',
    component: () => import('@/views/custodian/audit.vue'),
    meta: { title: '商家审核', icon: 'shop' }
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/custodian/category.vue'),
    meta: { title: '分类列表', icon: 'appstore' }
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/custodian/detail.vue'),
    meta: { title: '商家详情', icon: 'info-circle' }
  }
]

const adminRouter = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/admin/home.vue'),
    meta: { title: '工作台', icon: 'edit' }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/admin/user.vue'),
    meta: { title: '用户列表', icon: 'contacts' }
  },
  {
    path: '/assigning',
    name: 'assigning',
    component: () => import('@/views/admin/assigning.vue'),
    meta: { title: '任务分配', icon: 'compass' }
  }
]

const userRouter = [shopRouter, custodianRouter, adminRouter]

export const asyncRouter = (userRank) => {
  rootRouter.find(item => item.path === '/')
    .children = userRouter[userRank - 1]
  return rootRouter
}

export default [
  {
    path: '/login',
    name: 'login',
    redirect: '/login/phone',
    component: LoginLayout,
    children: [
      {
        path: '/login/phone',
        name: 'phoneLogin',
        component: () => import('@/views/login/phone.vue'),
        meta: { rank: 0 }
      },
      {
        path: '/login/password',
        name: 'passwordLogin',
        component: () => import('@/views/login/password.vue'),
        meta: { rank: 0 }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/result/404.vue')
  }
]
