const express = require('express')
const router = express.Router()
const {login, checkLoggedIn, getMenuAccess, logout, addUser} = require('../controllers/usersController')

router.post('/login', login)
router.get('/check-logged-in', checkLoggedIn)
router.get('/get-access-menus', getMenuAccess)
router.get('/logout', logout)
router.post('/user-add', addUser)


module.exports = router
