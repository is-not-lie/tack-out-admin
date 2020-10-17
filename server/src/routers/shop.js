const dayjs = require('dayjs')
const merchantModel = require('../models/merchant')
const userModel = require('../models/user')
const goodsModel = require('../models/goods')
const commentModel = require('../models/comment')
const shopModel = require('../models/shops')
const pageFile = require('../utils/pageFile')

// const shopModel = require('../models/shops')
// const commentModel = require('../models/comment')
// const { shopVerify } = require('../utils/verify')
// const { SERVER } = require('../config')

// const shopDefaultImg = `${SERVER.host}:${SERVER.port}/images/default_shop.png`
// const defaultAnnouncement = '该商家很懒,暂无公告信息...'

module.exports = router => {
  // 商家注册路由
  router.post('/api/shop/signin', async (req, res) => {
    try {
      const merchant = await merchantModel.add(req.body)
      res.send({ status: 200, data: merchant })
    } catch (msg) { res.send({ status: 0, msg }) }
  })

  // 查询商家是否已提交注册
  router.get('/api/shop/verify', async (req, res) => {
    const { userId } = req.query
    try {
      const result = await merchantModel.findOne({ userId })
      if (result) res.send({ status: 200 })
      else res.send({ status: 200, data: '尚未申请' })
    } catch (err) {
      console.error(`确认用户是否已提交商家注册异常,错误信息${err}`)
      res.send({ status: 0, msg: '抱歉...服务器繁忙,请稍后再重新尝试' })
    }
  })

  // 商家列表路由
  router.get('/api/shop/list', async (req, res) => {
    const { pageNum, pageSize } = req.query
    try {
      const merchantList = await merchantModel.list()
      if (merchantList && merchantList.length > 0) res.send({ status: 200, data: pageFile(merchantList, pageNum, pageSize) })
      else res.send({ status: 404, msg: '暂无商家信息' })
    }
    catch (msg) { res.send({ status: 0, msg }) }
  })

  // 查询指定商家
  router.get('/api/shop/find', async (req, res) => {
    const { merchantId } = req.query
    try {
      res.send({ status: 200, data: await merchantModel.findId(merchantId) })
    } catch (msg) { res.send({ status: 0, msg }) }
  })

  // 更改商家审核状态路由
  router.post('/api/shop/audit', async (req, res) => {
    const { merchantId, status, auditor, desc } = req.body
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
        await commentModel.initCommentList(merchantId)
      }
      merchant._doc.status = status
      merchant._doc.auditor = auditor
      merchant._doc.passTime = passTime
      if (status === 2) {
        merchant._doc.desc = desc
      }
      res.send({ status: 200, data: merchant })
    } catch (msg) { res.send({ status: 0, msg }) }
  })

  // 搜索商家路由
  router.get('/api/shop/search', async (req, res) => {
    const { keyWord, searchType } = req.query
    try {
      const merchant = parseInt(searchType) === 0
        ? await merchantModel.searchName(keyWord)
        : await merchantModel.searchPhone(keyWord)
      if (merchant) res.send({ status: 200, data: merchant })
      else res.send({ status: 404, msg: '没有找到该商家,请确认输入是否正确' })
    } catch (msg) { res.send({ status: 0, msg }) }
  })

  // 根据审核状态搜索商家
  router.get('/api/shop/search/status', async (req, res) => {
    const { status, pageNum, pageSize } = req.query
    try {
      // 初始化查找条件
      const params = { status, lte: false, not: false }
      // 如果是多个状态的数组, 则需要处理一下
      if (Array.isArray(status)) {
        // 获取数组中的最大值 (拿到的是字符串, 得转一下)
        const num = parseInt(status.reduce((num, item) => item > num ? item : num, 0))
        // 更改查找条件, lte (小于等于获得的最大值)
        params.lte = params.status = num
        // 判断数组中的最大值是否为上限值, 若为上限值, 则需排除不存在的值 (若长度为 3 则代表查找所有)
        if (num === 2 && status.length < 3) {
          // 若 1 不存在, 则查找条件排除状态为 1 的
          if (status.indexOf('1') === -1) { params.not = 1 }
          // 否则则排除为 0 的
          else { params.not = 0 }
        }
      } else {
        // 如果不是数组, 则将其转换为数值
        params.status = parseInt(status)
      }
      // 处理查找条件完毕, 开始查找数据库
      const merchantList = await merchantModel.searchStatus(params)
      if (merchantList && merchantList.length > 0) res.send({ status: 200, data: pageFile(merchantList, pageNum, pageSize) })
      else res.send({ status: 404, msg: '暂无商家处于该审核状态' })
    } catch (msg) { res.send({ status: 0, msg }) }
  })

  // 新增店铺路由
  router.post('/api/shop/add', async (req, res) => {
    try {
      const shop = await shopModel.addShop(req.body)
      res.send({ status: 200, data: shop })
    } catch (msg) { res.send({ status: 0, msg }) }
  })

  // 商家店铺列表
  router.get('/api/shop/list', async (req, res) => {
    const { merchantId } = req.query
    try { res.send({ status: 200, data: await shopModel.findList(merchantId) }) }
    catch (msg) { res.send({ status: 0, msg }) }
  })





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
