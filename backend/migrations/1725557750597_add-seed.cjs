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
    { username: 'francis5050', name_user: 'francis', pass_user: hashedPassword, mail_user: 'francis@test.com' },
  ];

  // Insert users using a loop
  for (const user of users) {
    await pgm.sql(
      `INSERT INTO users (username, name_user, pass_user, mail_user) VALUES ($1, $2, $3, $4);`,
      [user.username, user.name_user, user.pass_user, user.mail_user]
    );
  }

  // Direct SQL statement to insert a user
  await pgm.sql(`
    INSERT INTO users (username, name_user, pass_user, mail_user)
    VALUES ('francis5050', 'francis', '${hashedPassword}', 'francis@test.com');
  `);
};

exports.down = (pgm) => {}