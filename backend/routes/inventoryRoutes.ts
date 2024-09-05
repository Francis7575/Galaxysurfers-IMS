import express from 'express';

import { stockIn, stockOut, getStock } from "../controllers/inventoryController.ts"
const router = express.Router()


router.post('/inventory-in', stockIn)
router.post('/inventory-out', stockOut)
router.get('/get-inventory', getStock)

export default router