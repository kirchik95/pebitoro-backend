import { drizzle } from 'drizzle-orm/node-postgres';
import fp from 'fastify-plugin';
import pg from 'pg';

const db = fp((fastify) => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  fastify.decorate('db', db);
  fastify.addHook('onClose', async () => {
    await pool.end();
  });
});

export default db;
