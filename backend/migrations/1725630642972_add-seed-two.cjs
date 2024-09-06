/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = async (pgm) => {
  const now = new Date().toISOString();

  // Data to insert into items
  const items = [ 
    {
      code_item: 'DEFAULT_CODE',
      name_item: 'Default Item',
      description_item: 'Default Description',
      idunit_item: 'DEFAULT_UNIT',
      imgurl_item: 'http://example.com/default.jpg',
      createdat_item: now,
      batch_ctrl_item: 1,
      expiration_ctrl_item: 1,
      status_item: 0,
    },
  ];

  for (const item of items) {
    await pgm.sql(`
      INSERT INTO items (code_item, name_item, description_item, idunit_item, imgurl_item, createdat_item, batch_ctrl_item, expiration_ctrl_item, status_item)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `, [
      item.code_item,
      item.name_item,
      item.description_item,
      item.idunit_item,
      item.imgurl_item,
      item.createdat_item,
      item.batch_ctrl_item,
      item.expiration_ctrl_item,
      item.status_item
    ]);
  }

  // Data to insert into warehouses
  const warehouses = [
    {
      code_warehouse: 'DEFAULT_CODE',
      name_warehouse: 'Default Warehouse',
      status_warehouse: 1,
    },
  ];

  for (const warehouse of warehouses) {
    await pgm.sql(`
      INSERT INTO warehouses (code_warehouse, name_warehouse, status_warehouse)
      VALUES ($1, $2, $3);
    `, [
      warehouse.code_warehouse,
      warehouse.name_warehouse,
      warehouse.status_warehouse
    ]);
  }

  // Data to insert into locations
  const locations = [
    {
      idwarehouse_loc: 1,
      name_loc: 'Default Location',
      color_loc: 'Default Color',
      position_loc: 'Default Position',
      size_loc: 'Default Size',
      status_loc: 1,
    },
  ];

  for (const location of locations) {
    await pgm.sql(`
      INSERT INTO locations (idwarehouse_loc, name_loc, color_loc, position_loc, size_loc, status_loc)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      location.idwarehouse_loc,
      location.name_loc,
      location.color_loc,
      location.position_loc,
      location.size_loc,
      location.status_loc
    ]);
  }

  // Data to insert into navbar_menu
  const navbarMenuItems = [
    { name_mm: 'Users', link_mm: '/adduser', order_mm: 1, fa_mm: 'fa-users', status_mm: 1 },
    { name_mm: 'Warehouses', link_mm: '/addwarehouse', order_mm: 1, fa_mm: 'fa-warehouse', status_mm: 1 },
  ];

  for (const menuItem of navbarMenuItems) {
    await pgm.sql(`
      INSERT INTO navbar_menu (name_mm, link_mm, order_mm, fa_mm, status_mm)
      VALUES ($1, $2, $3, $4, $5);
    `, [
      menuItem.name_mm,
      menuItem.link_mm,
      menuItem.order_mm,
      menuItem.fa_mm,
      menuItem.status_mm
    ]);
  }

  // Data to insert into navbar_menu2
  const navbarMenu2Items = [
    { idmm_mm2: 1, name_mm2: 'Users', link_mm2: '/userMain', order_mm2: 1, status_mm2: 1 },
    { idmm_mm2: 1, name_mm2: 'Warehouses', link_mm2: '/warehouseMain', order_mm2: 1, status_mm2: 1 },
    { idmm_mm2: 1, name_mm2: 'Items', link_mm2: '/itemMain', order_mm2: 1, status_mm2: 1 },
    { idmm_mm2: 1, name_mm2: 'Inventory', link_mm2: '/inventoryMain', order_mm2: 1, status_mm2: 1 },
  ];

  for (const menuItem of navbarMenu2Items) {
    await pgm.sql(`
      INSERT INTO navbar_menu2 (idmm_mm2, name_mm2, link_mm2, order_mm2, status_mm2)
      VALUES ($1, $2, $3, $4, $5);
    `, [
      menuItem.idmm_mm2,
      menuItem.name_mm2,
      menuItem.link_mm2,
      menuItem.order_mm2,
      menuItem.status_mm2
    ]);
  }

  // Data to insert into navbar_menu_user
  const navbarMenuUserItems = [
    { iduser_mmu2: 3, idmm_mmu2: 1, access_mmu2: 1 },
    { iduser_mmu2: 3, idmm_mmu2: 3, access_mmu2: 1 },
    { iduser_mmu2: 3, idmm_mmu2: 2, access_mmu2: 1 },
  ];

  for (const menuUser of navbarMenuUserItems) {
    await pgm.sql(`
      INSERT INTO navbar_menu_user (iduser_mmu2, idmm_mmu2, access_mmu2)
      VALUES ($1, $2, $3);
    `, [
      menuUser.iduser_mmu2,
      menuUser.idmm_mmu2,
      menuUser.access_mmu2
    ]);
  }

  // Data to insert into inventory
  const inventories = [
    {
      iditem_in: 1,
      idbatch_in: 1,
      idwarehouse_in: 1,
      idlocation_in: 1,
      quantity_in: 10,
      status_in: 1,
    },
  ];

  for (const inventory of inventories) {
    await pgm.sql(`
      INSERT INTO inventory (iditem_in, idbatch_in, idwarehouse_in, idlocation_in, quantity_in, status_in)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      inventory.iditem_in,
      inventory.idbatch_in,
      inventory.idwarehouse_in,
      inventory.idlocation_in,
      inventory.quantity_in,
      inventory.status_in
    ]);
  }

  // Data to insert into inventory_batch
  const inventoryBatches = [
    {
      iditem_bc: 1,
      lot_bc: 'DEFAULT_LOT',
      quantity_bc: 100,
      createdat_bc: now,
      expirationdate_bc: null,
      status_bc: 1,
    },
  ];

  for (const batch of inventoryBatches) {
    await pgm.sql(`
      INSERT INTO inventory_batch (iditem_bc, lot_bc, quantity_bc, createdat_bc, expirationdate_bc, status_bc)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      batch.iditem_bc,
      batch.lot_bc,
      batch.quantity_bc,
      batch.createdat_bc,
      batch.expirationdate_bc,
      batch.status_bc
    ]);
  }

  // Data to insert into inventory_log
  const inventoryLogs = [
    {
      idgroup_inlog: 'DEFAULT_GROUP',
      type_inlog: 'In',
      iditem_inlog: 1,
      idbatch_inlog: 1,
      idwarehouse_inlog: 1,
      idlocation_inlog: 1,
      quantity_inlog: 10,
      iduser_inlog: 1,
      createdat_inlog: now,
      idmovtype_inlog: 1,
      idsubmovtype_inlog: 1,
      iddoc_inlog: 0,
      iddocdet_inlog: 0,
      lastquantity_inlog: 0,
      balancequantity_inlog: 10,
    },
  ];

  for (const log of inventoryLogs) {
    await pgm.sql(`
      INSERT INTO inventory_log (idgroup_inlog, type_inlog, iditem_inlog, idbatch_inlog, idwarehouse_inlog, idlocation_inlog, quantity_inlog, iduser_inlog, createdat_inlog, idmovtype_inlog, idsubmovtype_inlog, iddoc_inlog, iddocdet_inlog, lastquantity_inlog, obs_inlog)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
    `, [
      log.idgroup_inlog,
      log.type_inlog,
      log.iditem_inlog,
      log.idbatch_inlog,
      log.idwarehouse_inlog,
      log.idlocation_inlog,
      log.quantity_inlog,
      log.iduser_inlog,
      log.createdat_inlog,
      log.idmovtype_inlog,
      log.idsubmovtype_inlog,
      log.iddoc_inlog,
      log.iddocdet_inlog,
      log.lastquantity_inlog,
      log.obs_inlog
    ]);
  }
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = async (pgm) => {
  // Add down migrations if necessary
};
