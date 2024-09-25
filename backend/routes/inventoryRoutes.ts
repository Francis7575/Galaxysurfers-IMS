import express from "express";

import {
  stockIn,
  stockOut,
  getStock,
  deleteInventoryData,
} from "../controllers/inventoryController";
const router = express.Router();

router.post("/inventory-in", stockIn);
router.post("/inventory-out", stockOut);
router.get("/get-inventory", getStock);
router.delete("/delete-inventory/:idinventory", deleteInventoryData);

export default router;
