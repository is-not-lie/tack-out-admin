const mongoose = require('mongoose')
const dayjs = require('dayjs')

const roleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true },
  creator: { type: String, required: true },
  creationTime: { type: String || Number, default: dayjs().format('YYYY-MM-DD') },
  editor: String,
  editTime: String || Number
})

module.exports = mongoose.model('roles', roleSchema)
