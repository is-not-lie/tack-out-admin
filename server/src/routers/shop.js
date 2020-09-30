const shopModel = require('../models/shop')
const { shopVerify } = require('../utils/verify')
module.exports = router => {
  router.get('/api/shop', async (req, res) => {
    const { _id } = req.query
    try {
      const shop = await shopModel({ _id })
      if (!shop) res.send({ status: 404, msg: '该商家不存在' })
      else res.send({ status: 200, data: shop })
    } catch (err) {
      console.error(`查询商家异常,错误信息${err}`)
      res.send({ status: 0, msg: '找不到对应商家' })
    }
  })
  router.get('/api/shop/list', async (req, res) => {
    try {
      const shops = await shopModel.find({})
      if (!shops.length) res.send({ status: 404, msg: '暂无商家列表' })
      else res.send({ status: 200, data: shops })
    } catch (err) {
      console.error(`查询商家列表异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取商家列表失败' })
    }
  })
  router.post('/api/shop/add', async (req, res) => {
    const result = shopVerify(req.body)
    if (result.status === false) return res.send({ status: 0, msg: result.msg })
    const { shopName } = req.body
    try {
      const shop = await shopModel.findOne({ shopName })
      if (shop) res.send({ status: 0, msg: '该商家名称已存在' })
      else res.send({ status: 200, data: await shopModel.create({ ...req.body }) })
    } catch (err) {
      console.error(`新增商家异常,错误信息${err}`)
      res.send({ status: 0, msg: '商家注册失败' })
    }
  })
  router.post('/api/shop/edit', async (req, res) => {
    const result = shopVerify(req.body)
    if (result.status === false) return res.send({ status: 0, msg: result.msg })
    const { _id } = req.body
    try {
      const shop = await shopModel.findOne({ _id })
      if (!shop) res.send({ status: 404, msg: '该商家不存在' })
      else res.send({ status: 200, data: await shopModel.findOneAndUpdate({ _id }, { ...req.body }) })
    } catch (err) {
      console.error(`编辑商家信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '编辑失败' })
    }
  })
  router.post('/api/shop/del', async (req, res) => {
    const { _id } = req.body
    try {
      await shopModel.deleteOne({ _id })
      res.send({ status: 200 })
    } catch (err) {
      console.error(`商家注销异常,错误信息${err}`)
      res.send({ status: 0, msg: '注销失败' })
    }
  })
}
