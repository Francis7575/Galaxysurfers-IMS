import express from 'express';

import { stockIn, stockOut, getStock, getLog } from "../controllers/inventoryController.js"
const router = express.Router()


router.post('/inventory-in', stockIn)
router.post('/inventory-out', stockOut)
router.get('/get-inventory', getStock)
router.get('/get-log', getLog)

export default router