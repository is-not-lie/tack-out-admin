const multer = require('multer')
const { join, extname } = require('path')
const fs = require('fs')
const { SERVER } = require('../config')

const dirPath = join(__dirname, '../../public/images')

const uploadSingle = multer({
  storage: multer.diskStorage({
    destination (req, file, cb) {
      if (!fs.existsSync(dirPath)) {
        fs.mkdir(dirPath, (err) => {
          if (err) console.log(err)
          else cb(null, dirPath)
        })
      } else cb(null, dirPath)
    },
    filename (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`)
    }
  })
}).single('image')

module.exports = router => {
  router.post('/api/img/upload', (req, res) => {
    uploadSingle(req, res, (err) => {
      if (err) {
        console.error(`文件上传异常,错误信息:${err}`)
        res.send({ status: 0, msg: '图片上传失败' })
      } else {
        const { filename } = req.file
        const url = `http://${SERVER.host}:${SERVER.port}/images/${filename}`
        res.send({ status: 200, data: { filename, url } })
      }
    })
  })
  router.post('/api/img/del', (req, res) => {
    const { filename } = req.body
    fs.unlink(join(dirPath, filename), (err) => {
      if (!err) res.send({ status: 200 })
      else {
        console.error(`文件删除异常,错误信息:${err}`)
        res.send({ status: 0, msg: '删除文件失败' })
      }
    })
  })
}
