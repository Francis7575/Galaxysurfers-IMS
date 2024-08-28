const pool = require('../models/connection')

// NEW WAREHOUSE
const warehouseNew = async (req, res) => {
  try {

    let { code_warehouse, name_warehouse } = req.body;

    const result = await pool.query('SELECT code_warehouse FROM warehouses where code_warehouse = $1', [code_warehouse]);
    if (result.rows.length > 0 || code_warehouse.trim().length == 0) {
      return res.status(400).json({ error: 'Warehouse its already in use.' });
    }

    await pool.query('INSERT INTO warehouses(code_warehouse, name_warehouse) values($1, $2)',
      [code_warehouse, name_warehouse])

    res.status(201).send('Warehouse created!')
  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message)
  }
}

// UPDATE WAREHOUSE
const warehouseUpdate = async (req, res) => {
  try {

    let { idwarehouse } = req.params;

    let { code_warehouse, name_warehouse } = req.body;

    const result = await pool.query(
      'SELECT code_warehouse FROM warehouses where code_warehouse = $1 AND idwarehouse != $2', [code_warehouse, idwarehouse]);
    if (result.rows.length > 0 || code_warehouse.trim().length == 0) {
      return res.status(400).json({ error: 'Warehouse its already in use.' });
    }

    await pool.query('UPDATE warehouses SET code_warehouse = $1, name_warehouse = $2 WHERE idwarehouse = $3',
      [code_warehouse, name_warehouse, idwarehouse])

    res.status(200).send('Warehouse updated!')
  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message)
  }
}

// DELETE-CANCEL WAREHOUSE
const warehouseCancel = async (req, res) => {
  try {

    const { idwarehouse } = req.params;

    await pool.query('UPDATE warehouses SET status_warehouse = 0 WHERE idwarehouse = $1',
      [idwarehouse])

    res.status(201).send('Warehouse canceled!')

  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message)
  }
}

// GET ALL ACTIVE WAREHOUSES
const getWarehouses = async (req, res) => {
  try {
    const result = await pool.query(`
          SELECT * FROM warehouses WHERE status_warehouse = $1`, [1])
    res.status(200).json(result.rows)
  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message)
  }
}

// SAVE LOCATIONS
const saveLocations = async (req, res) => {

  const { idwarehouse } = req.params;
  const { figures } = req.body;

  try {
    await pool.query(
      `DELETE FROM locations WHERE idwarehouse_loc = $1`,
      [idwarehouse]
    );

    for (const item of figures) {

      const position = item.position.join(',');
      const sizes = item.size.join(',');

      await pool.query(
        `INSERT INTO locations(idwarehouse_loc, name_loc, color_loc, position_loc, size_loc, status_loc) 
              VALUES ($1, $2, $3, $4, $5, $6)`,
        [idwarehouse, item.name, item.color, position, sizes, 1]
      );
    }

    res.status(201).send('Saved!')
  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message)
  }
}

// GET ALL ACTIVE WAREHOUSES
const getLocations = async (req, res) => {

  const { idwarehouse } = req.params;

  try {
    const result = await pool.query(`
          SELECT * FROM locations WHERE idwarehouse_loc = $1`, [idwarehouse])
    res.status(200).json(result.rows)
  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message)
  }
}

// dashboard
const getDashboard = async (req, res) => {
  try {
    const result = await pool.query(`
          SELECT count(idinventory) as units, count(distinct iditem) as items
          from inventory
          left join items on inventory.iditem_in = items.iditem `)

    const result2 = await pool.query(`
          SELECT name_item, name_warehouse, sum(quantity_in) as quantity
          FROM inventory
          left join items on inventory.iditem_in = items.iditem
          left join warehouses on inventory.idwarehouse_in = warehouses.idwarehouse

          group by iditem, name_warehouse
          order by name_warehouse, name_item
          `)

    res.status(200).json({
      indicators: result.rows[0],
      ocupancy: result2.rows
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message)
  }
}

module.exports = {
  getDashboard,
  warehouseNew,
  warehouseUpdate,
  warehouseCancel,
  getWarehouses,
  saveLocations,
  getLocations
}