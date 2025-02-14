const bcrypt = require('bcrypt');

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
	const pass = '12345678';
	const hashedPassword = await bcrypt.hash(pass, 12);

	const users = [
		{ username: 'admin', name_user: 'testuser', pass_user: hashedPassword, mail_user: 'test@gmail.com' },
		{ username: 'edward', name_user: 'edward01', pass_user: hashedPassword, mail_user: 'edward@gmail.com' }
	];

	// Insert users using a loop
	for (const user of users) {
		await pgm.sql(
			`INSERT INTO users (username, name_user, pass_user, mail_user) 		
			VALUES ('${user.username}', '${user.name_user}', '${user.pass_user}',  '${user.mail_user}');
			`)
	}

	const now = new Date().toISOString();
	// Data to insert into items
	const items = [
		{
			code_item: 'ORNG-20',
			name_item: 'Orange',
			description_item: 'Orange Fruit',
			idunit_item: '50',
			imgurl_item: 'https://res.cloudinary.com/dlknx4y4m/image/upload/v1725859214/w6kgaanobbrmvm0nkfqt.jpg',
			createdat_item: now,
			batch_ctrl_item: 1,
			expiration_ctrl_item: 1,
			status_item: 1,
		},
		{
			code_item: 'Apple-20',
			name_item: 'Apple',
			description_item: 'Apple Fruit',
			idunit_item: '50',
			imgurl_item: 'https://res.cloudinary.com/dlknx4y4m/image/upload/v1726697382/i2njj97irz8hgxcgc0vz.png',
			createdat_item: now,
			batch_ctrl_item: 1,
			expiration_ctrl_item: 1,
			status_item: 1,
		},
	];

	for (const item of items) {
		await pgm.sql(`
    INSERT INTO items (code_item, name_item, description_item, idunit_item, imgurl_item, createdat_item, batch_ctrl_item, expiration_ctrl_item, status_item)
		VALUES ('${item.code_item}', '${item.name_item}', '${item.description_item}',  '${item.idunit_item}', '${item.imgurl_item}', '${item.createdat_item}', '${item.batch_ctrl_item}', '${item.expiration_ctrl_item}', '${item.status_item}');
  `)
	}

	// Data to insert into warehouses
	const warehouses = [
		{
			code_warehouse: '20',
			name_warehouse: 'Seattle',
			status_warehouse: 1,
		},
		{
			code_warehouse: '30',
			name_warehouse: 'New York',
			status_warehouse: 1,
		},
	];

	for (const warehouse of warehouses) {
		pgm.sql(`
	INSERT INTO warehouses (code_warehouse, name_warehouse, status_warehouse)
	VALUES ('${warehouse.code_warehouse}', '${warehouse.name_warehouse}', '${warehouse.status_warehouse}');
	`)
	}

	// Data to insert into warehousess
	const locations = [
		{
			idwarehouse_loc: 1,
			name_loc: 'a1',
			color_loc: 'gray',
			position_loc: '-6.149421112973947,0,7.860267426770203',
			size_loc: '5,1,1',
			status_loc: 1,
		},
		{
			idwarehouse_loc: 1,
			name_loc: 'a2',
			color_loc: 'gray',
			position_loc: '-0.2696748854822948,0,7.712787191049772',
			size_loc: '5,1,1',
			status_loc: 1,
		},
		{
			idwarehouse_loc: 1,
			name_loc: 'a3',
			color_loc: 'gray',
			position_loc: '5.267678188493902,0,7.850344269680872',
			size_loc: '5,1,1',
			status_loc: 1,
		},
		{
			idwarehouse_loc: 1,
			name_loc: 'a4',
			color_loc: '#2439db',
			position_loc: '0.3964381304998188,0,-1.2999120444588477',
			size_loc: '5,1,1',
			status_loc: 1,
		},
		{
			idwarehouse_loc: 2,
			name_loc: 'b1',
			color_loc: 'gray',
			position_loc: '-3.5435306600103527,0,7.9360679310831115',
			size_loc: '3,1,1',
			status_loc: 1,
		},
		{
			idwarehouse_loc: 2,
			name_loc: 'b2',
			color_loc: 'gray',
			position_loc: '1.9863915492968012,0,7.890957391636112',
			size_loc: '3,1,1',
			status_loc: 1,
		},
		{
			idwarehouse_loc: 2,
			name_loc: 'b3',
			color_loc: 'gray',
			position_loc: '6.562970041600832,0,7.806288540019689',
			size_loc: '3,1,1',
			status_loc: 1,
		},
	];


	for (const location of locations) {
		pgm.sql(`
	INSERT INTO locations (idwarehouse_loc, name_loc, color_loc, position_loc, size_loc, status_loc)
	VALUES ('${location.idwarehouse_loc}', '${location.name_loc}', '${location.color_loc}', '${location.position_loc}', '${location.size_loc}', '${location.status_loc}');
	`);
	}
	// Data to insert into navbar_menu
	const navbarMenuItems = [
		{ idmm_mm2: 1, name_mm2: 'Users', link_mm2: '/user', order_mm2: 1, status_mm2: 1 },
		{ idmm_mm2: 1, name_mm2: 'Warehouses', link_mm2: '/warehouse', order_mm2: 1, status_mm2: 1 },
		{ idmm_mm2: 1, name_mm2: 'Items', link_mm2: '/item', order_mm2: 1, status_mm2: 1 },
		{ idmm_mm2: 1, name_mm2: 'Inventory', link_mm2: '/inventoryMain', order_mm2: 1, status_mm2: 1 },
	];

	for (const menuItem of navbarMenuItems) {
		await pgm.sql(`
    INSERT INTO navbar_menu (idmm_mm2, name_mm2, link_mm2, order_mm2, status_mm2)
		VALUES ('${menuItem.idmm_mm2}', '${menuItem.name_mm2}', '${menuItem.link_mm2}',  '${menuItem.order_mm2}', '${menuItem.status_mm2}');
  `)
	}

	// Data to insert into navbar_menu_user
	const navbarMenuUserItems = [
		{ iduser_mmu2: 1, idmm_mmu2: 4, access_mmu2: 1 },
		{ iduser_mmu2: 1, idmm_mmu2: 2, access_mmu2: 1 },
		{ iduser_mmu2: 1, idmm_mmu2: 1, access_mmu2: 1 },
		{ iduser_mmu2: 1, idmm_mmu2: 3, access_mmu2: 1 },
	];

	for (const menuUser of navbarMenuUserItems) {
		await pgm.sql(`
    INSERT INTO navbar_menu_user (iduser_mmu2, idmm_mmu2, access_mmu2)
		VALUES ('${menuUser.iduser_mmu2}', '${menuUser.idmm_mmu2}', '${menuUser.access_mmu2}');
  `)
	}

	// Data to insert into inventory
	const inventories = [
		{
			iditem_in: 1,
			idbatch_in: 1,
			idwarehouse_in: 1,
			idlocation_in: 1,
			quantity_in: 25,
			status_in: 1,
			createdat_in: now
		},
		{
			iditem_in: 2,
			idbatch_in: 2,
			idwarehouse_in: 2,
			idlocation_in: 2,
			quantity_in: 40,
			status_in: 1,
			createdat_in: now
		},
	];

	for (const inventory of inventories) {
		await pgm.sql(`
    INSERT INTO inventory (iditem_in, idbatch_in, idwarehouse_in, idlocation_in, quantity_in, status_in, createdat_in)
		VALUES ('${inventory.iditem_in}', '${inventory.idbatch_in}', '${inventory.idwarehouse_in}', '${inventory.idlocation_in}', '${inventory.quantity_in}', '${inventory.status_in}', '${inventory.createdat_in}');
  `)
	}

	// Data to insert into inventory_batch
	const inventoryBatches = [
		{
			iditem_bc: 1,
			lot_bc: 'Orange-42',
			quantity_bc: 25,
			createdat_bc: now,
			expirationdate_bc: '2024-09-27 00:00:00',
			status_bc: 1,
		},
		{
			iditem_bc: 2,
			lot_bc: 'App-24',
			quantity_bc: 40,
			createdat_bc: now,
			expirationdate_bc: '2024-09-25 00:00:00',
			status_bc: 1,
		},
	];

	for (const batch of inventoryBatches) {
		await pgm.sql(`
    INSERT INTO inventory_batch (iditem_bc, lot_bc, quantity_bc, createdat_bc, expirationdate_bc, status_bc)
		VALUES ('${batch.iditem_bc}', '${batch.lot_bc}', '${batch.quantity_bc}', '${batch.createdat_bc}', '${batch.expirationdate_bc}', '${batch.status_bc}');
  `)
	}

	// Data to insert into inventory_log
	const inventoryLogs = [
		{
			idgroup_inlog: 'cd0942e5-feb0-409f-8cf0-1d980d608d31',
			type_inlog: 'In',
			iditem_inlog: 1,
			idbatch_inlog: 1,
			idwarehouse_inlog: 1,
			idlocation_inlog: 1,
			quantity_inlog: 25,
			iduser_inlog: 0,
			createdat_inlog: now,
			idmovtype_inlog: 1,
			idsubmovtype_inlog: 1,
			iddoc_inlog: 0,
			iddocdet_inlog: 0,
			lastquantity_inlog: 0,
			obs_inlog: ''
		},
		{
			idgroup_inlog: '496338de-5da7-4f3c-886d-8f6f6b55948d',
			type_inlog: 'In',
			iditem_inlog: 2,
			idbatch_inlog: 2,
			idwarehouse_inlog: 2,
			idlocation_inlog: 2,
			quantity_inlog: 40,
			iduser_inlog: 0,
			createdat_inlog: now,
			idmovtype_inlog: 1,
			idsubmovtype_inlog: 1,
			iddoc_inlog: 0,
			iddocdet_inlog: 0,
			lastquantity_inlog: 0,
			obs_inlog: ''
		},
	];

	for (const log of inventoryLogs) {
		await pgm.sql(`
    INSERT INTO inventory_log (idgroup_inlog, type_inlog, iditem_inlog, idbatch_inlog, idwarehouse_inlog, idlocation_inlog, quantity_inlog, iduser_inlog, createdat_inlog, idmovtype_inlog, idsubmovtype_inlog, iddoc_inlog, iddocdet_inlog, lastquantity_inlog, obs_inlog)
		VALUES ('${log.idgroup_inlog}', '${log.type_inlog}', '${log.iditem_inlog}', '${log.idbatch_inlog}', '${log.idwarehouse_inlog}', '${log.idlocation_inlog}', '${log.quantity_inlog}', '${log.iduser_inlog}', '${log.createdat_inlog}', '${log.idmovtype_inlog}', '${log.idsubmovtype_inlog}', '${log.iddoc_inlog}', '${log.iddocdet_inlog}', '${log.lastquantity_inlog}', '${log.obs_inlog}');
  `)
	}
}

exports.down = (pgm) => { }