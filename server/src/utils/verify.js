const shopVerify = (body) => {
  const { shopName, shopLocation, openingHours, minFee, contact_way } = body
  if (!shopName) return { status: false, msg: '请填写商家名称' }
  if (!shopLocation) return { status: false, msg: '请填写商家位置' }
  if (!openingHours) return { status: false, msg: '请填写营业时间' }
  if (!minFee) return { status: false, msg: '请设置起送价' }
  if (contact_way) return { status: false, msg: '请填写商家联系方式' }
  return true
}


module.exports = { shopVerify }
