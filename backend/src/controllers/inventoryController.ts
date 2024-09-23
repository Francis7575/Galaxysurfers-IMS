import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "../models/connection";
import { StockRequestBody } from "../types/types";

// ADD STOCK
export const stockIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { product, quantity, warehouse, location, batch, expire_date } =
      req.body;

    const adjustedExpireDate = expire_date === "" ? null : expire_date;

    const item = await pool.query("SELECT * FROM items WHERE iditem = $1", [
      product,
    ]);

    if (item.rows[0].batch_ctrl_item === 1) {
      const result = await pool.query(
        "SELECT lot_bc FROM inventory_batch WHERE lot_bc = $1",
        [batch]
      );

      if (result.rows.length > 0) {
        return res.status(400).json({
          error: "lots already exists.",
          errorCode: 2001,
          dataResponse: { duplicate: result.rows },
        });
      }
    }

    const now = new Date();
    const uniqueTimeKey = uuidv4();

    if (item.rows[0].batch_ctrl_item === 1) {
      const insertBatch = await pool.query(
        "INSERT INTO inventory_batch(iditem_bc, lot_bc, quantity_bc, createdat_bc, expirationdate_bc, status_bc) VALUES($1, $2, $3, $4, $5, $6) RETURNING idbatch",
        [product, batch, quantity, now, adjustedExpireDate, 1]
      );
      const idbatch = insertBatch.rows[0].idbatch;

      await pool.query(
        "INSERT INTO inventory(iditem_in, idbatch_in, idwarehouse_in, idlocation_in, quantity_in, status_in, createdat_in) VALUES($1, $2, $3, $4, $5, $6, $7)",
        [product, idbatch, warehouse, location, quantity, 1, now]
      );

      await pool.query(
        "INSERT INTO inventory_log(idgroup_inlog, type_inlog, iditem_inlog, idbatch_inlog, idwarehouse_inlog, idlocation_inlog, quantity_inlog, iduser_inlog, createdat_inlog, idmovtype_inlog, idsubmovtype_inlog, iddoc_inlog, iddocdet_inlog, lastquantity_inlog, obs_inlog) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
        [
          uniqueTimeKey,
          "In",
          product,
          idbatch,
          warehouse,
          location,
          quantity,
          0,
          now,
          1,
          1,
          0,
          0,
          0,
          "",
        ]
      );
    } else {
      const inventorySql = await pool.query(
        "SELECT * FROM inventory WHERE iditem_in = $1 and idwarehouse_in = $2 and idlocation_in = $3",
        [product, warehouse, location]
      );
      if (inventorySql.rows.length === 0) {
        await pool.query(
          "INSERT INTO inventory(iditem_in, idbatch_in, idwarehouse_in, idlocation_in, quantity_in, status_in, createdat_in) VALUES($1, $2, $3, $4, $5, $6, $7)",
          [product, 0, warehouse, location, quantity, 1, now]
        );
      } else {
        await pool.query(
          "UPDATE inventory SET quantity_in = quantity_in + $1 WHERE idinventory = $2",
          [quantity, inventorySql.rows[0].idinventory]
        );
      }

      await pool.query(
        "INSERT INTO inventory_log(idgroup_inlog, type_inlog, iditem_inlog, idbatch_inlog, idwarehouse_inlog, idlocation_inlog, quantity_inlog, iduser_inlog, createdat_inlog, idmovtype_inlog, idsubmovtype_inlog, iddoc_inlog, iddocdet_inlog, lastquantity_inlog, obs_inlog) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
        [
          uniqueTimeKey,
          "In",
          product,
          0,
          warehouse,
          location,
          quantity,
          0,
          now,
          1,
          1,
          0,
          0,
          0,
          "",
        ]
      );
    }

    return res.status(201).send("Stock created!");
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    return res.status(500).send(error.message);
  }
};

// REMOVE STOCK
export const stockOut = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { product, quantity, warehouse, location, batch } =
      req.body as StockRequestBody;
    const parsedQuantity = parseFloat(quantity as string);

    let query = `
            SELECT * FROM inventory 
            LEFT JOIN inventory_batch ON inventory.idbatch_in = inventory_batch.idbatch 
            WHERE iditem_in = $1 AND idwarehouse_in = $2 AND idlocation_in = $3
        `;

    let queryParams = [product, warehouse, location];

    if (batch) {
      query += " AND lot_bc = $4";
      queryParams.push(batch);
    }

    const inventorySql = await pool.query(query, queryParams);
    if (inventorySql.rows.length === 0) {
      return res.status(400).send("Not sufficient stock");
    }

    if (inventorySql.rows[0].quantity_in >= parsedQuantity) {
      if (inventorySql.rows[0].quantity_in === parsedQuantity) {
        await pool.query("DELETE FROM inventory WHERE idinventory = $1", [
          inventorySql.rows[0].idinventory,
        ]);
      } else {
        await pool.query(
          "UPDATE inventory SET quantity_in = quantity_in - $1 WHERE idinventory = $2",
          [parsedQuantity, inventorySql.rows[0].idinventory]
        );
      }

      const now = new Date();
      const uniqueTimeKey = uuidv4();

      let idbatch = inventorySql.rows[0].idbatch;
      if (!batch) {
        idbatch = 0;
      }

      await pool.query(
        "INSERT INTO inventory_log(idgroup_inlog, type_inlog, iditem_inlog, idbatch_inlog, idwarehouse_inlog, idlocation_inlog, quantity_inlog, iduser_inlog, createdat_inlog, idmovtype_inlog, idsubmovtype_inlog, iddoc_inlog, iddocdet_inlog, lastquantity_inlog, obs_inlog) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
        [
          uniqueTimeKey,
          "Out",
          product,
          idbatch,
          warehouse,
          location,
          parsedQuantity,
          0,
          now,
          1,
          1,
          0,
          0,
          0,
          "",
        ]
      );
    } else {
      return res.status(400).send("Not sufficient stock");
    }

    return res.status(201).send("Stock removed!");
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    return res.status(500).send(error.message);
  }
};

// DASHBOARD
export const getStock = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const result = await pool.query(`
            SELECT * FROM inventory
            LEFT JOIN items ON inventory.iditem_in = items.iditem
            LEFT JOIN inventory_batch ON inventory.idbatch_in = inventory_batch.idbatch
            LEFT JOIN warehouses ON inventory.idwarehouse_in = warehouses.idwarehouse
            LEFT JOIN locations ON inventory.idlocation_in = locations.idloc
        `);

    return res.status(200).json(result.rows);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    return res.status(500).send(error.message);
  }
};

// DELETE
export const deleteInventoryData = async (
  req: Request<{ idinventory: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { idinventory } = req.params;
    console.log(idinventory);

    await pool.query(
      `UPDATE inventory SET status_in = 0 WHERE idinventory = $1`,
      [idinventory]
    );

    return res.status(200).send("Inventory item deleted!");
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    return res.status(500).send(error.message);
  }
};
