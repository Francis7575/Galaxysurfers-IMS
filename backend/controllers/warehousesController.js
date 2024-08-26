const pool = require('../models/connection')

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
      // It contains the counts for units and items.
      indicators: result.rows[0],
      // It provides details about the quantity of items per warehouse.
      ocupancy: result2.rows
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message)
  }
}

module.exports = {
  getDashboard
}