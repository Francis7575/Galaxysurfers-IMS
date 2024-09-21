// migrations/1725386639333_my-first-migration.cjs
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable('users', {
    iduser: 'serial primary key',
    username: { type: 'varchar(500)', notNull: true, default: '' },
    name_user: { type: 'varchar(500)', notNull: true, default: '' },
    mail_user: { type: 'varchar(500)', notNull: true, default: '' },
    pass_user: { type: 'varchar(500)', notNull: true, default: '' },
    status_user: { type: 'integer', default: 1 },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updatedAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createTable('navbar_menu', {
    idmm2: 'serial primary key',
    idmm_mm2: { type: 'integer', default: 0 },
    name_mm2: { type: 'varchar(500)', notNull: true, default: '' },
    link_mm2: { type: 'varchar(500)', notNull: true, default: '' },
    order_mm2: { type: 'integer', default: 1 },
    status_mm2: { type: 'integer', default: 1 },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updatedAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createTable('navbar_menu_user', {
    idmmu2: 'serial primary key',
    iduser_mmu2: { type: 'integer', default: 0 },
    idmm_mmu2: { type: 'integer', default: 0 },
    access_mmu2: { type: 'integer', default: 1 },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updatedAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createTable('warehouses', {
    idwarehouse: 'serial primary key',
    code_warehouse: { type: 'varchar(500)', default: '' },
    name_warehouse: { type: 'varchar(500)', default: '' },
    status_warehouse: { type: 'integer', default: 1 },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updatedAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createTable('items', {
    iditem: 'serial primary key',
    code_item: { type: 'varchar(50)', notNull: true, default: '' },
    name_item: { type: 'varchar(50)', notNull: true, default: '' },
    description_item: { type: 'varchar(255)', notNull: true, default: '' },
    idunit_item: { type: 'varchar(50)', notNull: true, default: '' },
    imgurl_item: { type: 'varchar(150)', notNull: true, default: '' },
    createdat_item: { type: 'timestamp', default: pgm.func('current_timestamp'), },
    batch_ctrl_item: { type: 'integer', default: 0 },
    expiration_ctrl_item: { type: 'integer', default: 0 },
    status_item: { type: 'integer', default: 1 },
  });

  pgm.createTable('locations', {
    idloc: 'serial primary key',
    idwarehouse_loc: { type: 'integer', default: 0 },
    name_loc: { type: 'varchar(50)', notNull: true, default: '' },
    color_loc: { type: 'varchar(50)', notNull: true, default: '' },
    position_loc: { type: 'varchar(50)', notNull: true, default: '' },
    size_loc: { type: 'varchar(50)', notNull: true, default: '' },
    status_loc: { type: 'integer', default: 0 },
  });

  pgm.createTable('inventory_batch', {
    idbatch: 'serial primary key',
    iditem_bc: { type: 'integer', default: 0 },
    lot_bc: { type: 'varchar(100)', notNull: true, default: '' },
    quantity_bc: { type: 'decimal(15,6)', default: 0.00 },
    createdat_bc: { type: 'timestamp', default: pgm.func('current_timestamp'), },
    expirationdate_bc: { type: 'timestamp', default: null },
    status_bc: { type: 'integer', default: 1 },
  });

  pgm.createTable('inventory', {
    idinventory: 'serial primary key',
    iditem_in: { type: 'integer', default: 0 },
    idbatch_in: { type: 'integer', default: 0 },
    idwarehouse_in: { type: 'integer', default: 0 },
    idlocation_in: { type: 'integer', default: 0 },
    quantity_in: { type: 'decimal(15,6)', default: 0.00 },
    status_in: { type: 'integer', default: 1 },
    createdat_in: { type: 'timestamp', default: pgm.func('current_timestamp'), },
  });

  pgm.createTable('inventory_log', {
    idinventorylog: 'serial primary key',
    idgroup_inlog: { type: 'varchar(200)', notNull: true, default: '' },
    type_inlog: { type: 'varchar(50)', notNull: true, default: '' },
    iditem_inlog: { type: 'integer', default: 0 },
    idbatch_inlog: { type: 'integer', default: 0 },
    idwarehouse_inlog: { type: 'integer', default: 0 },
    idlocation_inlog: { type: 'integer', default: 0 },
    quantity_inlog: { type: 'decimal(15,6)', default: 0.00 },
    iduser_inlog: { type: 'integer', default: 0 },
    createdat_inlog: { type: 'timestamp', default: pgm.func('current_timestamp'), },
    idmovtype_inlog: { type: 'integer', default: 0 },
    idsubmovtype_inlog: { type: 'integer', default: 0 },
    iddoc_inlog: { type: 'integer', default: 0 },
    iddocdet_inlog: { type: 'integer', default: 0 },
    lastquantity_inlog: { type: 'decimal(15,6)', default: 0.00 },
    obs_inlog: { type: 'varchar(255)', notNull: true, default: '' },
  });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable('users');
  pgm.dropTable('warehouses');
  pgm.dropTable('items');
  pgm.dropTable('inventory_log');
  pgm.dropTable('inventory');
  pgm.dropTable('inventory_batch');
  pgm.dropTable('locations');
  pgm.dropTable('navbar_menu_user');
  pgm.dropTable('navbar_menu2');
  pgm.dropTable('navbar_menu');
};
