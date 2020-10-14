const express = require('express')
const router = express.Router()

require('./user')(router)
require('./category')(router)
require('./upload')(router)
require('./shop')(router)
require('./goods')(router)

module.exports = router
