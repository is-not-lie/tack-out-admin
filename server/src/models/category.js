// 分类模块
const mongoose = require('mongoose')
const { createCategory } = require('../utils/create')
const { mapImg } = require('../utils/map')

const cateSchema = new mongoose.Schema({
  cateId: { type: String, required: true, unique: true },
  cateName: { type: String, required: true, unique: true },
  icon: String,
  creator: String,
  createTime: String,
  editor: String,
  editTime: String,
  desc: String
})

// 获取分类列表
cateSchema.statics.getCates = function () {
  return new Promise((resolve, reject) => {
    this.find({})
      .then(cates => {
        if (cates && cates.length) resolve(cates)
        else reject('尚未添加分类')
      })
      .catch(err => {
        console.error(`获取分类列表异常,错误信息${err}`)
        reject('获取分类列表失败...')
      })
  })
}

// 添加分类
cateSchema.statics.addCate = function (params) {
  return new Promise((resolve, reject) => {
    const cate = createCategory(params)
    this.create(cate)
      .then(result => result && resolve(cate))
      .catch(err => {
        console.error(`新增分类异常,错误信息${err}`)
        reject('新增分类失败...')
      })
  })
}

// 更新分类
cateSchema.statics.updateCate = function (cate) {
  return new Promise((resolve, reject) => {
    const { cateId } = cate
    this.findOne({ cateId }, { _id: 0, __v: 0 })
      .then(result => {
        Object.keys(cate).forEach(key => {
          switch (key) {
            case 'cateId':
              return
            case 'createTime':
              return
            case 'creator':
              return
            case 'icon':
              result._doc[key] = mapImg(cate[key])
              break
            default:
              result._doc[key] = cate[key]
              break
          }
        })
        this.findOneAndUpdate({ cateId }, result, { useFindAndModify: false })
          .then(() => resolve(result))
          .catch((err) => {
            console.error(`更新分类异常,错误信息${err}`)
            reject('更新失败...')
          })
      })
      .catch((err) => {
        console.error(`查找分类异常,错误信息${err}`)
        reject('没有找到该分类...')
      })
  })
}

// 删除分类
cateSchema.statics.delCate = function (cateId) {
  return new Promise((resolve, reject) => {
    this.findOneAndRemove({ cateId }, { useFindAndModify: false })
      .then(resolve)
      .catch((err) => {
        console.error(`删除分类异常,错误信息${err}`)
        reject('删除失败...')
      })
  })
}

// 根据分类名称查找分类
cateSchema.statics.findCateName = function (cateName) {
  return new Promise((resolve, reject) => {
    this.findOne({ cateName })
      .then(result => {
        if (result) reject('该分类名称已存在')
        else resolve()
      })
      .catch((err) => {
        console.error(`查询分类异常,错误信息${err}`)
        reject('查询分类异常,请稍后重新尝试')
      })
  })
}

module.exports = mongoose.model('categorys', cateSchema)
