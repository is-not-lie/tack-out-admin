const dayjs = require('dayjs')
const merchantModel = require('../models/merchant')
const userModel = require('../models/user')
const goodsModel = require('../models/goods')

// const shopModel = require('../models/shops')
// const commentModel = require('../models/comment')
// const { shopVerify } = require('../utils/verify')
// const { SERVER } = require('../config')

// const shopDefaultImg = `${SERVER.host}:${SERVER.port}/images/default_shop.png`
// const defaultAnnouncement = '该商家很懒,暂无公告信息...'

// const createShop = (shop) => {
//   return {
//     shopName: shop.shopName, // 商家名称 (必须)
//     shopLocation: shop.shopLocation, // 商家地理坐标 (必须)
//     shopAddress: shop.shopAddress, // 商家地址 (必须)
//     openingHours: shop.openingHours, // 商家营业时间 (必须)
//     serTime: shop.serTime, // 商家配送时间段数组 (必须)
//     minFee: shop.minFee, // 起送价 (必须)
//     contact_way: shop.contact_way, // 商家联系方式 (必须, 字符串或多个字符串的数组)
//     shopCate: shop.shopCate, // 商家所属分类 (必须, 对象或多个对象的数组)
//     shopImg: shop.shopImg || shopDefaultImg, // 商家图片
//     disPic: shop.disPic || 0, // 配送价
//     activity: shop.activity || [], // 商家活动数组
//     announcement: shop.announcement || defaultAnnouncement // 商家公告
//   }
// }

module.exports = router => {
  // 商家注册路由
  router.post('/api/shop/signin', async (req, res) => {
    try {
      const merchant = await merchantModel.add(req.body)
      res.send({ status: 200, data: merchant })
    } catch (msg) { res.send({ status: 0, msg }) }
  })

  // 商家列表路由
  router.get('/api/shop/list', async (req, res) => {
    try { res.send({ status: 200, data: await merchantModel.list() }) }
    catch (msg) { res.send({ status: 0, msg }) }
  })

  // 更改商家审核状态路由
  router.post('/api/shop/audit', async (req, res) => {
    const { merchantId, status, auditor } = req.body
    try {
      const passTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      const merchant = await merchantModel.setStatus(merchantId, { status, auditor, passTime })
      if (status === 1) {
        const { userId } = merchant._doc
        const user = await userModel.searchId(userId)
        user._doc.merchantId = merchantId
        user._doc.rank = 1
        await userModel.update(userId, user)
        await goodsModel.initGoodsList(merchantId)
      }
      merchant._doc.status = status
      merchant._doc.auditor = auditor
      merchant._doc.passTime = passTime
      res.send({ status: 200, data: merchant })
    } catch (msg) { res.send({ status: 0, msg }) }
  })

  // 搜索商家路由
  router.get('/shop/search', async (req, res) => {
    const { keyWord, searchType } = req.query
    try {
      const merchant = searchType === 0
        ? await merchantModel.searchName(keyWord)
        : await merchantModel.searchPhone(keyWord)
      res.send({ status: 200, data: merchant })
    } catch (msg) { res.send({ status: 0, msg }) }
  })
  // 根据 id 查找商家路由
  // router.get('/api/shop/id', async (req, res) => {
  //   const { merchantId } = req.query
  //   try { res.send({ status: 200, data: await merchantModel.findId(merchantId) }) }
  //   catch (msg) { res.send({ status: 0, msg }) }
  // })








  // router.get('/api/shop', async (req, res) => {
  //   const { _id } = req.query
  //   try {
  //     const shop = await shopModel.findById(_id)
  //     if (!shop) res.send({ status: 404, msg: '该商家不存在' })
  //     else res.send({ status: 200, data: shop })
  //   } catch (err) {
  //     console.error(`查询商家异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '找不到对应商家' })
  //   }
  // })
  // router.get('/api/shop/list', async (req, res) => {
  //   try {
  //     const shops = await shopModel.find({})
  //     if (!shops.length) res.send({ status: 404, msg: '暂无商家列表' })
  //     else res.send({ status: 200, data: shops })
  //   } catch (err) {
  //     console.error(`查询商家列表异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '获取商家列表失败' })
  //   }
  // })
  // router.post('/api/shop/add', async (req, res) => {
  //   const params = req.body
  //   const result = shopVerify(params)
  //   if (result.status === false) return res.send({ status: 0, msg: result.msg })
  //   try {
  //     const shop = await shopModel.findOne({ shopName: params.shopName })
  //     if (shop) res.send({ status: 0, msg: '该商家名称已存在' })
  //     else {
  //       const newShop = createShop(params)
  //       const result =  await shopModel.create(newShop)
  //       const { _id } = result._doc
  //       // 商家注册成功, 舒适化商家商品表和用户评论表
  //       await goodsModel.create({ shopId: _id })
  //       await commentModel.create({ shopId: _id })
  //       res.send({ status: 200, data: result })
  //     }
  //   } catch (err) {
  //     console.error(`新增商家异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '商家注册失败' })
  //   }
  // })
  // router.post('/api/shop/edit', async (req, res) => {
  //   const params = req.body
  //   const result = shopVerify(params)
  //   if (result.status === false) return res.send({ status: 0, msg: result.msg })

  //   try {
  //     const shop = await shopModel.findById(params._id)
  //     if (!shop) res.send({ status: 404, msg: '该商家不存在' })
  //     else {
  //       Object.keys(params).forEach(key => {
  //         if (key === '_id') return
  //         shop._doc[key] = params[key]
  //       })
  //       await shopModel.findByIdAndUpdate(params._id, shop, { useFindAndModify: false })
  //       res.send({ status: 200, data: shop })
  //     }
  //   } catch (err) {
  //     console.error(`编辑商家信息异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '编辑失败' })
  //   }
  // })
  // router.post('/api/shop/del', async (req, res) => {
  //   const { _id } = req.body
  //   try {
  //     await shopModel.findByIdAndDelete(_id)
  //     res.send({ status: 200 })
  //   } catch (err) {
  //     console.error(`商家注销异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '注销失败' })
  //   }
  // })
}
