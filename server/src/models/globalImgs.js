const mongoose = require('mongoose')

const globalImgsSchema = new mongoose.Schema({
  imgs: Array,
  name: { type: String, required: true, unique: true }
})

const globalImgsModel = mongoose.model('global_imgs', globalImgsSchema)

globalImgsModel.findOne({ name: 'loginPageImgs' })
  .then(result => {
    if (!result)
      return globalImgsModel.create({
        imgs: [
          'http://localhost:4000/images/login_bg1.jpg',
          'http://localhost:4000/images/login_bg2.jpg',
          'http://localhost:4000/images/login_bg3.jpg',
          'http://localhost:4000/images/login_bg4.jpg'
        ],
        name: 'loginPageImgs'
      })
    else throw ''
  })
  .then(() => {
    console.log('初始化图片列表成功')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = globalImgsModel
