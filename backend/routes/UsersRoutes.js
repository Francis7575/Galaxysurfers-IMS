const express = require('express')
const router = express.Router()
const {
  login, checkLoggedIn, getMenuAccess, logout, addUser, deleteUser, updateUser, getUserList, updateMenuAccess
} = require('../controllers/usersController')

router.post('/login', login)
router.get('/check-logged-in', checkLoggedIn)
router.get('/get-access-menus', getMenuAccess)
router.get('/logout', logout)
router.post('/user-add', addUser)
router.get('/user-list', getUserList)
router.put('/user-delete/:iduser', deleteUser)
router.put('/user-update/:iduser', updateUser)
router.put('/update-menu-access/:iduser', updateMenuAccess)


module.exports = router
