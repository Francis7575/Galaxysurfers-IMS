const express = require('express')
const router = express.Router()
const {
  getDashboard, warehouseNew, warehouseUpdate, warehouseCancel, getWarehouses, saveLocations, getLocations
}
  = require('../controllers/warehousesController')

router.post('/warehouse-new', warehouseNew)
router.put('/warehouse-update/:idwarehouse', warehouseUpdate)
router.put('/warehouse-cancel/:idwarehouse', warehouseCancel)
router.get('/warehouses-list', getWarehouses)
router.post('/save-locations/:idwarehouse', saveLocations)
router.get('/get-locations/:idwarehouse', getLocations)

router.get('/dashboard', getDashboard)

module.exports = router
