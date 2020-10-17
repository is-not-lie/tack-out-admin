export default {
  user: state => state.user.user,
  addRoutes: state => state.user.userRoutes,
  cateList: state => state.cate.cateList,
  merchantList: state => state.shop.merchantList,
  currentMerchant: state => state.shop.currentMerchant,
  shopList: state => state.shop.shopList,
  goodsList: state => state.goods.goodsList
}
