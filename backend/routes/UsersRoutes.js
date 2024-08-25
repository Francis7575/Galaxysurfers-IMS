const express = require('express')
const router = express.Router()
const {login, getCookie} = require('../controllers/usersController')

router.post('/login', login)
router.get('/check-logged-in', getCookie)


module.exports = router
