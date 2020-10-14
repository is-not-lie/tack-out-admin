const goodsModel = require('../models/goods')

// const componentCurrentPice = (pice, discount) => {
//   const currentPice = pice * (discount / 10)
//   return Math.ceil(currentPice * 100) / 100
// }

module.exports = router => {
  // 新增商品路由
  router.post('/api/shop/goods/add', async (req, res) => {
    const { merchantId } = req.body
    if (!merchantId) return res.send({ status: 0, msg: '商家id是必须的' })
    try {
      const merchant = await goodsModel.addGoods(req.body)
      res.send({ status: 200, data: merchant._doc.goodsList.reverse() })
    } catch (msg) { res.send({ status: 0, msg }) }
  })

  // 获取商家商品列表路由
  router.get('/api/shop/goods/list', async (req, res) => {
    const { merchantId } = req.query
    try {
      const merchant = await goodsModel.findMerchant(merchantId)
      if (!merchant) res.send({ status: 404, msg: '没有找到该商家' })
      else res.send({ status: 200, data: merchant })
    } catch (msg) { res.send({ status: 0, msg }) }
  })

  // 修改商品信息路由
  router.post('/api/shop/goods/edit', async (req, res) => {
    const { merchantId, goodsId, goodsName } = req.body
    try {
      const merchant = await goodsModel.findMerchant(merchantId)
      const { goodsList, tables } = merchant._doc
      const goods = goodsList.find(item => item.goodsId === goodsId)
      if (!goods) res.send({ status: 404, msg: '抱歉...没有找到该商品' })
      else {
        Object.keys(req.body).forEach(key => {
          switch (key) {
            case 'goodsId':
              break
            case 'merchantId':
              break
            default:
              goods[key] = req.body[key]
              break
          }
        })
        if (goodsName) {
          tables.find(table => table.goodsId === goodsId).goodsName = goodsName
        }
        await goodsModel.updateMerchant(merchant)
        res.send({ status: 200, data: goodsList })
      }
    } catch (msg) { res.send({ status: 0, msg }) }
  })

  // 删除商品路由
  router.post('/api/shop/goods/del', async (req, res) => {
    const { merchantId, goodsId } = req.body
    try {
      const merchant = await goodsModel.findMerchant(merchantId)
      const { goodsList, tables } = merchant._doc
      goodsList.splice(goodsList.findIndex(item => item.goodsId === goodsId), 1)
      tables.splice(tables.findIndex(item => item.goodsId === goodsId), 1)
      await goodsModel.updateMerchant(merchant)
      res.send({ status: 200, data: goodsList })
    } catch (msg) { res.send({ status: 0, msg }) }
  })





  // 商家商品路由
  // router.get('/api/shop/goods', async (req, res) => {
  //   const { shopId, goodsId } = req.query
  //   try {
  //     const shopGoods = await goodsModel.findOne({ shopId })
  //     if (!shopGoods) return res.send({ status: 404, msg: '您当前还不是商家哦' })

  //     const { goodsList } = shopGoods._doc
  //     const goods = goodsList.find(goods => goods.goodsId === goodsId)
  //     if (!goods) res.send({ status: 404, msg: '您还未添加过该商品' })
  //     else res.send({ status: 200, data: goods })
  //   } catch (err) {
  //     console.error(`查询商品异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '获取商品信息失败' })
  //   }
  // })
  // router.get('/api/shop/goods/list', async (req, res) => {
  //   const { shopId } = req.query
  //   try {
  //     const shopGoods = await goodsModel.findOne({ shopId })
  //     if (!shopGoods) return res.send({ status: 404, msg: '您当前还不是商家哦' })

  //     const { goodsList, cates } = shopGoods._doc
  //     if (!goodsList.length) res.send({ status: 404, msg: '您还未添加过商品呢' })
  //     else res.send({ status: 200, data: { goodsList, cates } })
  //   } catch (err) {
  //     console.error(`查询商品列表异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '获取商品列表失败' })
  //   }
  // })
  // router.post('/api/shop/goods/add', async (req, res) => {
  //   let { shopId, goods } = req.body

  //   const result = goodsVerify(goods)
  //   if (result.status === false) return res.send({ status: 0, msg: result.msg })

  //   try {
  //     const shopGoods = await goodsModel.findOne({ shopId })
  //     if (!shopGoods) return res.send({ status: 404, msg: '您当前还不是商家哦' })

  //     const { goodsList } = shopGoods._doc
  //     if (goodsList.find(item => item.name === goods.name)) res.send({ status: 0, msg: '该商品名称已存在' })
  //     else {
  //       goods = createGoods(goods)
  //       goodsList.unshift(goods)
  //       await goodsModel.findOneAndUpdate({ shopId }, shopGoods, { useFindAndModify: false })
  //       // 新增商品的同时将商品名称添加到评论的标签列表
  //       const shopComment = await commentModel.findOne({ shopId })
  //       const { labels } = shopComment._doc
  //       labels.push(createLabel(goods))
  //       await commentModel.findOneAndUpdate({ shopId }, shopComment, { useFindAndModify: false })

  //       res.send({ status: 200, data: goodsList })
  //     }
  //   } catch (err) {
  //     console.error(`新增商品异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '添加商品失败' })
  //   }
  // })
  // router.post('/api/shop/goods/edit', async (req, res) => {
  //   const { shopId, goods } = req.body

  //   const result = goodsVerify(goods)
  //   if (result.status === false) return res.send({ status: 0, msg: result.msg })

  //   try {
  //     const shopGoods = await goodsModel.findOne({ shopId })
  //     if (!shopGoods) res.send({ status: 404, msg: '您当前还不是商家哦' })
  //     else {
  //       const { goodsList } = shopGoods._doc
  //       const food = goodsList.find(food => food.goodsId === goods.goodsId)
  //       if (!food) res.send({ status: 404, msg: '您还未添加过该商品哦' })
  //       else {
  //         Object.keys(goods).forEach(key => {
  //           if (key === 'goodsId' || key === 'cateId') return
  //           food[key] = goods[key]
  //         })
  //         await goodsModel.findOneAndUpdate({ shopId }, shopGoods, { useFindAndModify: false })
  //         // 修改商品信息后同时更新评论的标签列表
  //         const shopComment = await commentModel.findOne({ shopId })
  //         const { labels } = shopComment._doc
  //         const label = labels.find(item => item.labelId === goods.goodsId)
  //         if (label) { label.labelName = goods.name }
  //         else labels.push(createLabel(goods))
  //         await commentModel.findOneAndUpdate({ shopId }, shopComment, { useFindAndModify: false })

  //         res.send({ status: 200, data: goodsList })
  //       }
  //     }
  //   } catch (err) {
  //     console.error(`修改商品信息异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '修改商品信息失败' })
  //   }
  // })
  // router.post('/api/shop/goods/del', async (req, res) => {
  //   const { shopId, goodsId } = req.body
  //   try {
  //     const shopGoods = await goodsModel.findOne({ shopId })
  //     if (!shopGoods) res.send({ status: 404, msg: '您当前还不是商家哦' })
  //     else {
  //       const { goodsList } = shopGoods._doc
  //       const index = goodsList.findIndex(goods => goods.goodsId === goodsId)
  //       if (index === -1) res.send({ status: 404, msg: '您还未添加过该商品呢' })
  //       else {
  //         goodsList.splice(index, 1)
  //         await goodsModel.findOneAndUpdate({ shopId }, shopGoods, { useFindAndModify: false })
  //         res.send({ status: 200, data: goodsList })
  //       }
  //     }
  //   } catch (err) {
  //     console.error(`删除商品异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '删除商品失败' })
  //   }
  // })
  // // 商家商品分类路由
  // router.get('/api/shop/cate/list', async (req, res) => {
  //   const { shopId } = req.query
  //   try {
  //     const shopGoods = await goodsModel.findOne({ shopId })
  //     if (!shopGoods) return res.send({ status: 404, msg: '您当前还不是商家哦' })

  //     const { cates } = shopGoods._doc
  //     if (!cates.length) res.send({ status: 404, msg: '您还未定义商品分类呢' })
  //     else res.send({ status: 200, data: cates })
  //   } catch (err) {
  //     console.error(`查询分类列表异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '获取分类列表失败' })
  //   }
  // })
  // router.post('/api/shop/cate/add', async (req, res) => {
  //   const { shopId, cateName, icon } = req.body
  //   if (!cateName) return res.send({ status: 0, msg: '请填写分类名称' })

  //   try {
  //     const shopGoods = await goodsModel.findOne({ shopId })
  //     if (!shopGoods) res.send({ status: 404, msg: '您当前还不是商家哦' })
  //     else {
  //       const { cates } = shopGoods._doc
  //       if (cates.find(cate => cate.cateName === cateName)) res.send({ status: 0, msg: '该分类名称已存在' })
  //       else {
  //         const cate = createCate({ cateName, icon })
  //         cates.unshift(cate)
  //         await goodsModel.findOneAndUpdate({ shopId }, shopGoods, { useFindAndModify: false })
  //         res.send({ status: 200, data: cates })
  //       }
  //     }
  //   } catch (err) {
  //     console.error(`添加商品分类异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '添加分类失败' })
  //   }
  // })
  // router.post('/api/shop/cate/edit', async (req, res) => {
  //   const { shopId, cateName, icon, cateId } = req.body
  //   if (!cateName) return res.send({ status: 0, msg: '请填写分类名称' })

  //   try {
  //     const shopGoods = await goodsModel.findOne({ shopId })
  //     if (!shopGoods) res.send({ status: 404, msg: '您当前还不是商家哦' })
  //     else {
  //       const { cates } = shopGoods._doc
  //       const cate = cates.find(item => item.cateId === cateId)
  //       if (!cate) res.send({ status: 0, msg: '您还未添加该分类呢' })
  //       else {
  //         cate.cateName = cateName
  //         cate.cateIcon = icon || cate.cateIcon
  //         await goodsModel.findOneAndUpdate({ shopId }, shopGoods, { useFindAndModify: false })
  //         res.send({ status: 200, data: cates })
  //       }
  //     }
  //   } catch (err) {
  //     console.error(`修改商品分类信息异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '修改分类失败' })
  //   }
  // })
  // router.post('/api/shop/cate/del', async (req, res) => {
  //   const { shopId, cateId } = req.body
  //   try {
  //     const shopGoods = await goodsModel.findOne({ shopId })
  //     if (!shopGoods) res.send({ status: 404, msg: '您当前还不是商家哦' })
  //     else {
  //       const { cates } = shopGoods._doc
  //       const index = cates.findIndex(item => item.cateId === cateId)
  //       if (index !== -1) cates.splice(index, 1)
  //       await goodsModel.findOneAndUpdate({ shopId }, shopGoods, { useFindAndModify: false })
  //       res.send({ status: 200, data: cates })
  //     }
  //   } catch (err) {
  //     console.error(`删除商品分类异常,错误信息${err}`)
  //     res.send({ status: 0, msg: '删除分类失败' })
  //   }
  // })
}
