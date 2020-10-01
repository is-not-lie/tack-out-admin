const { v4: uuidv4 } = require('uuid')
const goodsModel = require('../models/goods')
const commentModel = require('../models/comment')
const { goodsVerify } = require('../utils/verify')

const createLabel = (goods) => ({
  labelId: goods.goodsId,
  labelName: goods.name
})

const createGoods = (goods) => ({
  cateId: goods.cateId, // 分类id (必须)
  goodsId: uuidv4(), // 商品id
  ImgUrlBig: goods.ImgUrlBig || '', // 商品大图片
  ImgUrlSmall: goods.imgUrlSmall ? goods.imgUrlSmall : '', // 商品小图片
  name: goods.name, // 商品名称 (必须)
  desc: goods.desc || '', // 商品描述
  originalPice: goods.desc, // 商品原价格 (必须)
  discount: goods.discount || 0, // 商品折扣
  currentPice: goods.discount ? goods.originalPice * (goods.discount / 10) : goods.originalPice, // 商品折扣价
  deal: goods.deal, // 价格对应的份量, 比如 $10 / 1人份 (必须)
  monthlySales: 0, // 月售量
  like: 0, // 点赞量
  tags: goods.tags || [], // tag标签列表
  status: 0, // 商品状态, 0: 停售, 1: 在售
  count: goods.count || 0 // 当前商品库存数量
})

const createCate = (cate) => ({
  cateId: uuidv4(),
  cateName: cate.name, // 分类名称 (必须)
  cateIcon: cate.icon || ''
})

module.exports = router => {
  // 商家商品路由
  router.get('/api/shop/goods', async (req, res) => {
    const { shopId, goodsId } = req.query
    try {
      const shopGoods = await goodsModel.findOne({ shopId })
      if (!shop) return res.send({ status: 404, msg: '您当前还不是商家哦' })

      const { goodsList } = shopGoods
      const goods = goodsList.find(goods => goods.goodsId === goodsId)
      if (!goods) res.send({ status: 404, msg: '您还未添加过该商品' })
      else res.send({ status: 200, data: goods })
    } catch (err) {
      console.error(`查询商品异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取商品信息失败' })
    }
  })
  router.get('/api/shop/goods/list', async (req, res) => {
    const { shopId } = req.query
    try {
      const shopGoods = await goodsModel.findOne({ shopId })
      if (!shopGoods) return res.send({ status: 404, msg: '您当前还不是商家哦' })

      const { goodsList, cates } = shopGoods._doc
      if (!goodsList.length) res.send({ status: 404, msg: '您还未添加过商品呢' })
      else res.send({ status: 200, msg: { goodsList, cates } })
    } catch (err) {
      console.error(`查询商品列表异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取商品列表失败' })
    }
  })
  router.post('/api/shop/goods/add', async (req, res) => {
    let { shopId, goods } = req.body

    const result = goodsVerify(goods)
    if (result.status === false) return res.send({ status: 0, msg: result.msg })

    try {
      const shopGoods = await goodsModel.findOne({ shopId })
      if (!shopGoods) return res.send({ status: 404, msg: '您当前还不是商家哦' })

      const { goodsList } = shopGoods._doc
      if (goodsList.findIndex(item => item.name === goods.name) !== -1) res.send({ status: 0, msg: '该商品名称已存在' })
      else {
        goods = createGoods(goods)
        goodsList.unshift(goods)
        await goodsModel.findOneAndUpdate({ shopId }, { ...shopGoods })
        // 新增商品的同时将商品名称添加到评论的标签列表
        const shopComment = commentModel.findOne({ shopId })
        const { labels } = shopComment._doc
        labels.push(createLabel(goods))
        await commentModel.findOneAndUpdate({ shopId }, { ...shopComment })

        res.send({ status: 200, data: goodsList })
      }
    } catch (err) {
      console.error(`新增商品异常,错误信息${err}`)
      res.send({ status: 0, msg: '添加商品失败' })
    }
  })
  router.post('/api/shop/goods/edit', async (req, res) => {
    const { shopId, goods } = req.body

    const result = goodsVerify(goods)
    if (result.status === false) return res.send({ status: 0, msg: result.msg })

    try {
      const shopGoods = await goodsModel.findOne({ shopId })
      if (!shopGoods) res.send({ status: 404, msg: '您当前还不是商家哦' })
      else {
        const { goodsList } = shopGoods._doc
        const index = goodsList.findIndex(food => food.goodsId === goods.goodsId)
        if (index === -1) res.send({ status: 404, msg: '您还未添加过该商品哦' })
        else {
          goodsList.splice(index, 1, goods)
          await goodsModel.findOneAndUpdate({ shopId }, { ...shopGoods })
          // 修改商品信息后同时更新评论的标签列表
          const shopComment = commentModel.findOne({ shopId })
          const { labels } = shopComment._doc
          const label = labels.find(item => item.labelId === goods.goodsId)
          if (label) { label.labelName = goods.name }
          else labels.push(createLabel(goods))
          await commentModel.findOneAndUpdate({ shopId }, { ...shopComment })

          res.send({ status: 200, data: goodsList })
        }
      }
    } catch (err) {
      console.error(`修改商品信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '修改商品信息失败' })
    }
  })
  router.post('/api/shop/goods/del', async (req, res) => {
    const { shopId, goodsId } = req.body
    try {
      const shopGoods = await goodsModel.findOne({ shopId })
      if (!shopGoods) res.send({ status: 404, msg: '您当前还不是商家哦' })
      else {
        const { goodsList } = shopGoods._doc
        const index = goodsList.findIndex(goods => goods.goodsId === goodsId)
        if (index === -1) res.send({ status: 404, msg: '您还未添加过该商品呢' })
        else {
          goodsList.splice(index, 1)
          await goodsModel.findOneAndUpdate({ shopId }, { ...shopGoods })
          res.send({ status: 200 })
        }
      }
    } catch (err) {
      console.error(`删除商品异常,错误信息${err}`)
      res.send({ status: 0, msg: '删除商品失败' })
    }
  })
  // 商家商品分类路由
  router.get('/api/shop/cate/list', async (req, res) => {
    const { shopId } = req.query
    try {
      const shopGoods = goodsModel.findOne({ shopId })
      if (!shopGoods) res.send({ status: 404, msg: '您当前还不是商家哦' })

      const { cates } = shopGoods._doc
      if (!cates.length) res.send({ status: 404, msg: '您还未定义商品分类呢' })
      else res.send({ status: 200, data: cates })
    } catch (err) {
      console.error(`查询分类列表异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取分类列表失败' })
    }
  })
  router.post('/api/shop/cate/add', async (req, res) => {
    const { shopId, cateName, icon } = req.body
    if (!cateName) return res.send({ status: 0, msg: '请填写分类名称' })

    try {
      const shopGoods = goodsModel.findOne({ shopId })
      if (!shopGoods) res.send({ status: 404, msg: '您当前还不是商家哦' })
      else {
        const { cates } = shopGoods._doc
        if (cates.findIndex(cate => cate.cateName === cateName) === -1) res.send({ status: 0, msg: '该分类名称已存在' })
        else {
          const cate = createCate({ cateName, icon })
          cates.unshift(cate)
          await goodsModel.findOneAndUpdate({ shopId }, { ...shopGoods })
          res.send({ status: 200, data: cates })
        }
      }
    } catch (err) {
      console.error(`添加商品分类异常,错误信息${err}`)
      res.send({ status: 0, msg: '添加分类失败' })
    }
  })
  router.post('/api/shop/cate/edit', async (req, res) => {
    const { shopId, cate } = req.body
    if (!cate.cateName) return res.send({ status: 0, msg: '请填写分类名称' })

    try {
      const shopGoods = goodsModel.findOne({ shopId })
      if (!shopGoods) res.send({ status: 404, msg: '您当前还不是商家哦' })
      else {
        const { cates } = shopGoods._doc
        const index = cates.findIndex(item => item.cateId === cate.cateId)
        if (index === -1) res.send({ status: 0, msg: '您还未添加该分类呢' })
        else {
          cates.splice(index, 1, cate)
          await goodsModel.findOneAndUpdate({ shopId }, { ...shopGoods })
          res.send({ status: 200, data: cates })
        }
      }
    } catch (err) {
      console.error(`修改商品分类信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '修改分类失败' })
    }
  })
  router.post('/api/shop/cate/del', async (req, res) => {
    const { shopId, cateId } = req.body
    try {
      const shopGoods = goodsModel.findOne({ shopId })
      if (!shopGoods) res.send({ status: 404, msg: '您当前还不是商家哦' })
      else {
        const { cates } = shopGoods._doc
        const index = cates.findIndex(item => item.cateId === cateId)
        if (index !== -1) cates.splice(index, 1)
        await goodsModel.findOneAndUpdate({ shopId }, { ...shopGoods })
        res.send({ status: 200, data: cates })
      }
    } catch (err) {
      console.error(`删除商品分类异常,错误信息${err}`)
      res.send({ status: 0, msg: '删除分类失败' })
    }
  })
}
