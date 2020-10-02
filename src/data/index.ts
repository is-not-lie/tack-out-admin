const shopChildren = [
  {
    title: '店铺详情',
    path: '/shop/info',
    name: 'shop_info',
    type: 'shop'
  },
  {
    title: '店铺商品',
    path: '/shop/goods',
    name: 'shop_goods',
    type: 'gift'
  },
  {
    title: '店铺活动',
    path: '/shop/activity',
    name: 'shop_activity',
    type: 'tags'
  },
  {
    title: '客户评论',
    path: '/shop/comment',
    name: 'shop_comment',
    type: 'message'
  }
]
const chartsChildren = [
  {
    title: '销量',
    path: '/charts/sales',
    name: 'charts_sales',
    type: 'fund'
  },
  {
    title: '营业额',
    path: '/charts/turnover',
    name: 'charts_turnover',
    type: 'line-chart'
  },
  {
    title: '库存',
    path: '/charts/inventory',
    name: 'charts_inventory',
    type: 'fall'
  }
]
const cateChildren = [
  {
    title: '主分类',
    path: '/cate/parent',
    name: 'cate_parent',
    type: 'appstore'
  },
  {
    title: '子分类',
    path: '/cate/sub',
    name: 'cate_sub',
    type: 'branches'
  }
]
const userChildren = [
  {
    title: '商家审核',
    path: '/user/audit',
    name: 'user_audit',
    type: 'unlock'
  },
  {
    title: '商家管理',
    path: '/user/shop',
    name: 'user_shop',
    type: 'shop'
  }
]
const ruleChildren = [
  {
    title: '角色管理',
    path: '/rule/role',
    name: 'rule_role',
    type: 'usergroup-add'
  },
  {
    title: '权限设置',
    path: '/rule/set',
    name: 'rule_set',
    type: 'key'
  }
]

export const menuData = [
  {
    title: '首页',
    name: 'home',
    type: 'home',
    theme: 'filled',
    authId: 0
  },
  {
    title: '商家',
    name: 'shop',
    type: 'shop',
    theme: 'filled',
    authId: 1,
    children: shopChildren
  },
  {
    title: '图形图表',
    name: 'charts',
    type: 'pie-chart',
    theme: 'filled',
    authId: 1,
    children: chartsChildren
  },
  {
    title: '分类管理',
    name: 'cate',
    type: 'appstore',
    theme: 'filled',
    authId: 2,
    children: cateChildren
  },
  {
    title: '用户管理',
    name: 'user',
    type: 'edit',
    theme: 'filled',
    authId: 2,
    children: userChildren
  },
  {
    title: '权限管理',
    name: 'rule',
    type: 'lock',
    theme: 'filled',
    authId: 3,
    children: ruleChildren
  }
]
