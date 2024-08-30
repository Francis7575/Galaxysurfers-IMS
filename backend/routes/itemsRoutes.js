import express from 'express';
import { itemList, itemNew, itemUpdate, itemCancel } from "../controllers/itemsController.js"

const router = express.Router()

router.get('/items-list', itemList)
router.post('/item-new', itemNew)
router.put('/item-update/:iditem', itemUpdate)
router.put('/item-cancel/:iditem', itemCancel)

export default router;
