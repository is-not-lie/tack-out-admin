const { v4: uuidv4 } = require('uuid')
const shopModel = require('../models/shop')
const orderModel = require('../models/order')
const { orderVerify } = require('../utils/verify')

const createOrder = async ({ shopId, goods, price }) => {
  const shop = await shopModel.findOne({ _id: shopId })
  const { shopImg, shopName } = shop._doc
  return {
    orderId: uuidv4, // 订单 id
    shopId: shopId, // 商家 id (必须)
    shopImg, // 商家图片
    shopName, // 商家名称
    create_time: dayjs().format('YYYY-MM-DD hh:mm:ss'), // 创建时间
    status: 0, // 订单状态 0: 未完成, 1: 已完成
    goods, // 订单商品列表 (必须)
    price // 付款金额 (必须)
  }
}

module.exports = router => {
  router.get('/api/user/order/list', async (req, res) => {
    const { userId } = req.query
    try {
      const userOrder = await orderModel.findOne({ userId })
      if (!userOrder) return res.send({ status: 404, msg: '您好像还未注册' })

      const { orderList } = userOrder._doc
      if (!orderList.length) res.send({ status: 404, msg: '目前还没有您的下单记录' })
      else res.send({ status: 200, data: orderList })
    } catch (err) {
      console.error(`查询用户订单列表异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取订单列表失败' })
    }
  })
  router.post('/api/user/order/add', async (req, res) => {
    const { userId, order } = req.body
    const result = orderVerify(order)
    if (result.status === false) return res.send({ status: 0, msg: result.msg })

    try {
      const newOrder = createOrder(req.body)
      const userOrder = await orderModel.findOne({ userId })
      if (!userOrder) res.send({ status: 404, msg: '您好像还未注册' })
      else {
        const { orderList } = userOrder._doc
        orderList.unshift(newOrder)
        await orderModel.findOneAndUpdate({ userId }, { ...userOrder })
        res.send({ status: 200, data: orderList })
      }
    } catch (err) {
      console.error(`添加用户订单异常,错误信息${err}`)
      res.send({ status: 0, msg: '下单失败' })
    }
  })
  router.post('/api/user/order/del', async (req, res) => {
    const { userId, orderId } = req.body
    try {
      const userOrder = await orderModel.findOne({ userId })
      if (!userOrder) res.send({ status: 404, msg: '您好像还未注册' })
      else {
        const { orderList } = userOrder._doc
        const index = orderList.findIndex(order => order.orderId === orderId)
        if (index !== -1) orderList.splice(index, 1)
        await orderModel.findOneAndUpdate({ userId }, { ...userOrder })
        res.send({ status: 200, data: orderList })
      }
    } catch (err) {
      console.error(`删除订单异常,错误信息${err}`)
      res.send({ status: 0, msg: '删除失败' })
    }
  })
  router.post('/api/user/order/edit', async (req, res) => {
    const result = orderVerify(req.body)
    const { userId, order } = req.body
    if (result.status === false) return res.send({ status: 0, msg: result.msg })

    try {
      const userOrder = await orderModel.findOne({ userId })
      if (!userOrder) res.send({ status: 404, msg: '您好像还未注册' })
      else {
        const { orderList } = userOrder._doc
        const index = orderList.findIndex(item => item.orderId === order.orderId)
        if (index === -1) res.send({ status: 404, msg: '没有找到该订单' })
        else {
          orderList.splice(index, 1, order)
          await orderModel.findOneAndUpdate({ userId }, { ...userOrder })
          res.send({ status: 200, data: orderList })
        }
      }
    } catch (err) {
      console.error(`订单编辑异常,错误信息${err}`)
      res.send({ status: 0, msg: '编辑失败' })
    }
  })
}
