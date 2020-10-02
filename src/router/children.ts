import { RouteConfig } from 'vue-router'

export const MainChildren: RouteConfig[] = [
  // 首页
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/main/home/home.vue'),
    meta: { userAuthority: 0 }
  },
  // 商家模块
  {
    path: '/shop/info',
    name: 'shop_info',
    component: () => import('@/views/main/shop/shopInfo.vue'),
    meta: { userAuthority: 1 }
  },
  {
    path: '/shop/goods',
    name: 'shop_goods',
    component: () => import('@/views/main/shop/goods.vue'),
    meta: { userAuthority: 1 }
  },
  {
    path: '/shop/activity',
    name: 'shop_activity',
    component: () => import('@/views/main/shop/activity.vue'),
    meta: { userAuthority: 1 }
  },
  {
    path: '/shop/comment',
    name: 'shop_comment',
    component: () => import('@/views/main/shop/comment.vue'),
    meta: { userAuthority: 1 }
  },
  // 图形图表模块
  {
    path: '/charts/sales',
    name: 'charts_sales',
    component: () => import('@/views/main/charts/sales.vue'),
    meta: { userAuthority: 1 }
  },
  {
    path: '/charts/turnover',
    name: 'charts_turnover',
    component: () => import('@/views/main/charts/turnover.vue'),
    meta: { userAuthority: 1 }
  },
  {
    path: '/charts/inventory',
    name: 'charts_inventory',
    component: () => import('@/views/main/charts/inventory.vue'),
    meta: { userAuthority: 1 }
  },
  // 分类管理
  {
    path: '/cate/main',
    name: 'cate_main',
    component: () => import('@/views/main/cate/mainCate.vue'),
    meta: { userAuthority: 2 }
  },
  {
    path: '/cate/sub',
    name: 'cate_sub',
    component: () => import('@/views/main/cate/subCate.vue'),
    meta: { userAuthority: 2 }
  },
  // 用户管理
  {
    path: '/user/audit',
    name: 'user_audit',
    component: () => import('@/views/main/user/audit.vue'),
    meta: { userAuthority: 2 }
  },
  {
    path: '/user/shop',
    name: 'user_shop',
    component: () => import('@/views/main/user/shopUser.vue'),
    meta: { userAuthority: 2 }
  },
  // 权限管理
  {
    path: '/rule/role',
    name: 'rule_role',
    component: () => import('@/views/main/rule/role.vue'),
    meta: { userAuthority: 3 }
  },
  {
    path: '/rule/set',
    name: 'rule_set',
    component: () => import('@/views/main/rule/rule.vue'),
    meta: { userAuthority: 3 }
  }
]
