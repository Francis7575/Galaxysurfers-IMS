import pkg from 'pg';  
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

// Create a new instance of a pool connection
// const pool = new Pool({
//   user: process.env.DB_USER, // The PostgreSQL username that has access to the database.
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD, // Database password
//   port: process.env.DB_PORT,// The port on which PostgreSQL is listening (5432 is the default port).
// })

const pool = new Pool({
  connectionString: process.env.RENDERDB_INT,
  ssl: {
    rejectUnauthorized: false
  }
});

// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('Error connecting to PostgreSQL:', err);
//   } else {
//     console.log('Connected to PostgreSQL:', res.rows[0]);
//   }
//   pool.end();
// });

export default pool