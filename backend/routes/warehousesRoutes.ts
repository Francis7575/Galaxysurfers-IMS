import express from 'express'
import {
  getDashboard, warehouseNew, warehouseUpdate, warehouseCancel, getWarehouses, saveLocations, getLocations
}
  from '../controllers/warehousesController'

const router = express.Router()

router.post('/warehouse-new', warehouseNew)
router.put('/warehouse-update/:idwarehouse', warehouseUpdate)
router.put('/warehouse-cancel/:idwarehouse', warehouseCancel)
router.get('/warehouses-list', getWarehouses)
router.post('/save-locations/:idwarehouse', saveLocations)
router.get('/get-locations/:idwarehouse', getLocations)

router.get('/dashboard', getDashboard)

export default router