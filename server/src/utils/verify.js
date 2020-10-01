const shopVerify = (body) => {
  const { shopName, shopLocation, openingHours, minFee, contact_way } = body
  if (!shopName) return { status: false, msg: '请填写商家名称' }
  if (!shopLocation) return { status: false, msg: '请填写商家位置' }
  if (!openingHours) return { status: false, msg: '请填写营业时间' }
  if (!minFee) return { status: false, msg: '请设置起送价' }
  if (contact_way) return { status: false, msg: '请填写商家联系方式' }
  return true
}

const goodsVerify = (goods) => {
  const { cateId, name, originalPice, deal } = goods
  if (!cateId) return { status: false, msg: '请选择商品分类' }
  if (!name) return { status: false, msg: '请填写商品名称' }
  if (!originalPice) return { status: false, msg: '请设置商品价格' }
  if (!deal) return { status: false, msg: '请设置价格对应数量' }
  return true
}

const commentVerify = comment => {
  const { userName, content, typeId } = comment
  if (!userName) return { status: false, msg: '用户名不能为空' }
  if (!content) return { status: false, msg: '评论内容不能为空' }
  if (!typeId) return { status: false, msg: '评论类型不能为空' }
  return true
}

const orderVerify = ({ shopId, goods, price }) => {
  if (!shopId) return { status: false, msg: '商家id是必须的' }
  if (!goods) return { status: false, msg: '商品列表是必须的' }
  if (!price) return { status: false, msg: '付款金额是必须的' }
  return true
}

module.exports = { shopVerify, goodsVerify, commentVerify, orderVerify }
