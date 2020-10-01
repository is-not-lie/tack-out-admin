const shopModel = require('../models/shop')
const goodsModel = require('../models/goods')
const commentModel = require('../models/comment')
const { shopVerify } = require('../utils/verify')
const { SERVER } = require('../config')

const shopDefaultImg = `${SERVER.host}:${SERVER.port}/images/default_shop.png`
const defaultAnnouncement = '该商家很懒,暂无公告信息...'

const createShop = (shop) => {
  return {
    shopName: shop.shopName, // 商家名称 (必须)
    shopLocation: shop.shopLocation, // 商家地理坐标 (必须)
    shopAddress: shop.shopAddress, // 商家地址 (必须)
    openingHours: shop.openingHours, // 商家营业时间 (必须)
    serTime: shop.serTime, // 商家配送时间段数组 (必须)
    minFee: shop.minFee, // 起送价 (必须)
    contact_way: shop.contact_way, // 商家联系方式 (必须, 字符串或多个字符串的数组)
    shopCate: shop.shopCate, // 商家所属分类 (必须, 对象或多个对象的数组)
    shopImg: shop.shopImg || shopDefaultImg, // 商家图片
    disPic: shop.disPic || 0, // 配送价
    activity: shop.activity || [], // 商家活动数组
    announcement: shop.announcement || defaultAnnouncement // 商家公告
  }
}

module.exports = router => {
  router.get('/api/shop', async (req, res) => {
    const { _id } = req.query
    try {
      const shop = await shopModel.findById(_id)
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
    const params = req.body
    const result = shopVerify(params)
    if (result.status === false) return res.send({ status: 0, msg: result.msg })
    try {
      const shop = await shopModel.findOne({ shopName: params.shopName })
      if (shop) res.send({ status: 0, msg: '该商家名称已存在' })
      else {
        const newShop = createShop(params)
        const result =  await shopModel.create(newShop)
        const { _id } = result._doc
        // 商家注册成功, 舒适化商家商品表和用户评论表
        await goodsModel.create({ shopId: _id })
        await commentModel.create({ shopId: _id })
        res.send({ status: 200, data: result })
      }
    } catch (err) {
      console.error(`新增商家异常,错误信息${err}`)
      res.send({ status: 0, msg: '商家注册失败' })
    }
  })
  router.post('/api/shop/edit', async (req, res) => {
    const params = req.body
    const result = shopVerify(params)
    if (result.status === false) return res.send({ status: 0, msg: result.msg })

    try {
      const shop = await shopModel.findById(params._id)
      if (!shop) res.send({ status: 404, msg: '该商家不存在' })
      else {
        Object.keys(params).forEach(key => {
          if (key === '_id') return
          shop._doc[key] = params[key]
        })
        await shopModel.findByIdAndUpdate(params._id, shop, { useFindAndModify: false })
        res.send({ status: 200, data: shop })
      }
    } catch (err) {
      console.error(`编辑商家信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '编辑失败' })
    }
  })
  router.post('/api/shop/del', async (req, res) => {
    const { _id } = req.body
    try {
      await shopModel.findByIdAndDelete(_id)
      res.send({ status: 200 })
    } catch (err) {
      console.error(`商家注销异常,错误信息${err}`)
      res.send({ status: 0, msg: '注销失败' })
    }
  })
}
