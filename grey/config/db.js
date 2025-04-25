import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  database: "grey",
});
 

async function testConnection() {
    try {
      const connection = await pool.getConnection();
      console.log('Conexión obtenida del pool con el ID:', connection.threadId);
      connection.release();
    } catch (err) {
      console.error('Error al obtener una conexión del pool:', err.stack);
    }
  }
  
  testConnection();

export { pool } ;