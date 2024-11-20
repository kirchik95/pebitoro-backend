import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { tasks, users } from '@db/schema';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

const seed = async () => {
  try {
    console.log('Seeding data...');

    const user = await db
      .insert(users)
      .values({
        firstName: 'John',
        lastName: 'Doe',
        password: '123456',
        email: 'johndoe@mail.com',
      })
      .returning();

    await db
      .insert(tasks)
      .values({
        title: 'Task 1',
        description: 'Task 1 description',
        userId: user[0].id,
      })
      .returning();

    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await pool.end();
  }
};

seed();
