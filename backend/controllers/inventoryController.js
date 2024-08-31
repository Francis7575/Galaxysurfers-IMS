import { v4 as uuidv4 } from 'uuid'
import pool from '../models/connection.js'

//ADD STOCK
export const stockIn = async (req, res) => {
  try {

    const { product, quantity, warehouse, location, batch } = req.body;
    let { expire_date } = req.body

    if (expire_date == '') {
      expire_date = null;
    }

    const item = await pool.query(`SELECT * FROM items WHERE iditem = $1`, [product]);

    if (item.rows[0].batch_ctrl_item == 1) {
      const result = await pool.query(`SELECT lot_bc FROM inventory_batch WHERE lot_bc = $1`, [batch]);

      if (result.rows.length > 0) {
        return res.status(400).json({
          error: 'lotes ya existentes.',
          errorCode: 2001,
          dataResponse: { duplicate: result.rows }
        });
      }
    }

    const now = new Date();
    const uniqueTimeKey = uuidv4();

    if (item.rows[0].batch_ctrl_item == 1) {
      const insertBatch = await pool.query(
        'INSERT INTO inventory_batch(iditem_bc, lot_bc, quantity_bc, createdat_bc, expirationdate_bc, status_bc) VALUES($1, $2, $3, $4, $5, $6) RETURNING idbatch',
        [product, batch, quantity, now, expire_date, 1]
      );
      const idbatch = insertBatch.rows[0].idbatch;

      await pool.query(
        'INSERT INTO inventory(iditem_in, idbatch_in, idwarehouse_in, idlocation_in, quantity_in, status_in, createdat_in) VALUES($1, $2, $3, $4, $5, $6, $7)',
        [product, idbatch, warehouse, location, quantity, 1, now]
      );

      await pool.query(
        'INSERT INTO inventory_log(idgroup_inlog, type_inlog, iditem_inlog, idbatch_inlog, idwarehouse_inlog, idlocation_inlog, quantity_inlog, iduser_inlog, createdat_inlog, idmovtype_inlog, idsubmovtype_inlog, iddoc_inlog, iddocdet_inlog, lastquantity_inlog, obs_inlog) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
        [uniqueTimeKey, 'In', product, idbatch, warehouse, location, quantity, 0, now, 1, 1, 0, 0, 0, '']
      );
    } else {
      const inventorysql = await pool.query(`SELECT * FROM inventory WHERE iditem_in = $1 and idwarehouse_in = $2 and idlocation_in = $3`, [product, warehouse, location]);
      if (inventorysql.rows.length == 0) {
        await pool.query(
          'INSERT INTO inventory(iditem_in, idbatch_in, idwarehouse_in, idlocation_in, quantity_in, status_in, createdat_in) VALUES($1, $2, $3, $4, $5, $6, $7)',
          [product, 0, warehouse, location, quantity, 1, now]
        );


      } else {
        await pool.query(
          'update inventory set quantity_in = quantity_in + $1 where idinventory = $2',
          [quantity, inventorysql.rows[0].idinventory]
        );
      }

      await pool.query(
        'INSERT INTO inventory_log(idgroup_inlog, type_inlog, iditem_inlog, idbatch_inlog, idwarehouse_inlog, idlocation_inlog, quantity_inlog, iduser_inlog, createdat_inlog, idmovtype_inlog, idsubmovtype_inlog, iddoc_inlog, iddocdet_inlog, lastquantity_inlog, obs_inlog) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
        [uniqueTimeKey, 'In', product, 0, warehouse, location, quantity, 0, now, 1, 1, 0, 0, 0, '']
      );
    }

    res.status(201).send('Stock created!');
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

//ADD STOCK
export const stockOut = async (req, res) => {
  try {
    const { product, quantity, warehouse, location, batch } = req.body;
    const parsedQuantity = parseFloat(quantity);

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

    const inventorysql = await pool.query(query, queryParams);
    if (inventorysql.rows.length == 0) {
      console.log(inventorysql.rows)
      res.status(400).send('Not sufficient stock');
      return;
    }
    if (inventorysql.rows[0].quantity_in >= parsedQuantity) {
      if (inventorysql.rows[0].quantity_in == parsedQuantity) {
        await pool.query(
          'delete from inventory where idinventory = $1',
          [inventorysql.rows[0].idinventory]
        );
      } else {
        await pool.query(
          'update inventory set quantity_in = quantity_in - $1 where idinventory = $2',
          [parsedQuantity, inventorysql.rows[0].idinventory]
        );
      }

      const now = new Date();
      const uniqueTimeKey = uuidv4();

      let idbatch = inventorysql.rows[0].idbatch;
      if (batch == '' || batch == null) {
        idbatch = 0;
      }

      await pool.query(
        'INSERT INTO inventory_log(idgroup_inlog, type_inlog, iditem_inlog, idbatch_inlog, idwarehouse_inlog, idlocation_inlog, quantity_inlog, iduser_inlog, createdat_inlog, idmovtype_inlog, idsubmovtype_inlog, iddoc_inlog, iddocdet_inlog, lastquantity_inlog, obs_inlog) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
        [uniqueTimeKey, 'Out', product, idbatch, warehouse, location, parsedQuantity, 0, now, 1, 1, 0, 0, 0, '']
      );
    } else {
      console.log(inventorysql.rows[0].quantity_in, parsedQuantity)
      res.status(400).send('Not sufficient stock');
      return;
    }

    res.status(201).send('Stock created!');
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

// dashboard
export const getStock = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT * from inventory
            left join items on inventory.iditem_in = items.iditem
            left join inventory_batch on inventory.idbatch_in = inventory_batch.idbatch
            left join warehouses on inventory.idwarehouse_in = warehouses.idwarehouse
            left join locations on inventory.idlocation_in = locations.idloc`)

    res.status(200).json(result.rows)
  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message)
  }
}