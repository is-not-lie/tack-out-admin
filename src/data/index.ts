const shopChildren = [
  {
    title: '店铺详情',
    path: '/shop/info',
    name: 'shop_info',
    icon: 'el-icon-info'
  },
  {
    title: '店铺商品',
    path: '/shop/goods',
    name: 'shop_goods',
    icon: 'el-icon-s-goods'
  },
  {
    title: '店铺活动',
    path: '/shop/activity',
    name: 'shop_activity',
    icon: 'iconfont icon-activity'
  },
  {
    title: '客户评论',
    path: '/shop/comment',
    name: 'shop_comment',
    icon: 'el-icon-s-comment'
  }
]
const chartsChildren = [
  {
    title: '销量',
    path: '/charts/sales',
    name: 'charts_sales',
    icon: 'el-icon-s-marketing'
  },
  {
    title: '营业额',
    path: '/charts/turnover',
    name: 'charts_turnover',
    icon: 'iconfont icon-money'
  },
  {
    title: '库存',
    path: '/charts/inventory',
    name: 'charts_inventory',
    icon: 'iconfont icon-coin'
  }
]
const cateChildren = [
  {
    title: '主分类',
    path: '/cate/parent',
    name: 'cate_parent',
    icon: 'iconfont icon-superclass'
  },
  {
    title: '子分类',
    path: '/cate/sub',
    name: 'cate_sub',
    icon: 'iconfont icon-subclass'
  }
]
const userChildren = [
  {
    title: '商家审核',
    path: '/user/audit',
    name: 'user_audit',
    icon: 'el-icon-s-check'
  },
  {
    title: '商家管理',
    path: '/user/shop',
    name: 'user_shop',
    icon: 'el-icon-s-shop'
  }
]
const ruleChildren = [
  {
    title: '角色管理',
    path: '/rule/role',
    name: 'rule_role',
    icon: 'el-icon-s-custom'
  },
  {
    title: '权限设置',
    path: '/rule/set',
    name: 'rule_set',
    icon: 'el-icon-s-tools'
  }
]

export const menuData = [
  {
    title: '首页',
    name: 'home',
    icon: 'iconfont icon-home',
    authId: 0
  },
  {
    title: '商家',
    name: 'shop',
    icon: 'el-icon-office-building',
    authId: 1,
    children: shopChildren
  },
  {
    title: '图形图表',
    name: 'charts',
    icon: 'el-icon-pie-chart',
    authId: 1,
    children: chartsChildren
  },
  {
    title: '分类管理',
    name: 'cate',
    icon: 'el-icon-setting',
    authId: 2,
    children: cateChildren
  },
  {
    title: '用户管理',
    name: 'user',
    icon: 'el-icon-user',
    authId: 2,
    children: userChildren
  },
  {
    title: '权限管理',
    name: 'rule',
    icon: 'el-icon-unlock',
    authId: 3,
    children: ruleChildren
  }
]
