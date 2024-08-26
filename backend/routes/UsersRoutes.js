const express = require('express')
const router = express.Router()
const {login, checkLoggedIn, getMenuAccess, logout} = require('../controllers/usersController')

router.post('/login', login)
router.get('/check-logged-in', checkLoggedIn)
router.get('/get-access-menus', getMenuAccess)
router.get('/logout', logout)

module.exports = router
