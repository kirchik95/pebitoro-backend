import { drizzle } from 'drizzle-orm/node-postgres';
import fp from 'fastify-plugin';
import pg from 'pg';

const db = fp((fastify) => {
  const pool = new pg.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'app_db',
  });

  const db = drizzle(pool);

  fastify.decorate('db', db);
  fastify.addHook('onClose', async () => {
    await pool.end();
  });
});

export default db;
