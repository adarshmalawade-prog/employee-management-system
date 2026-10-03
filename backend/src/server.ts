import fs from 'fs';
import path from 'path';
import app from './app';
import { pool } from './config/database';

const PORT = parseInt(process.env.PORT || '5000', 10);

const runDatabaseInit = async () => {
  try {
    // 1. Run Migration (idempotent: CREATE TABLE IF NOT EXISTS)
    const migrationCandidates = [
      path.resolve(__dirname, '../migrations/001_create_employees.sql'),
      path.resolve(__dirname, '../../migrations/001_create_employees.sql'),
      path.resolve(process.cwd(), 'migrations/001_create_employees.sql'),
    ];
    const migrationPath = migrationCandidates.find((p) => fs.existsSync(p));
    if (migrationPath) {
      console.log(`[Database]: Applying migration schema from ${migrationPath}...`);
      const sql = fs.readFileSync(migrationPath, 'utf-8');
      await pool.query(sql);
      console.log('✅ [Database]: Schema migration verified.');
    }

    // 2. Run Seed (idempotent: INSERT ... ON CONFLICT DO NOTHING)
    const seedCandidates = [
      path.resolve(__dirname, '../seeds/seed_employees.sql'),
      path.resolve(__dirname, '../../seeds/seed_employees.sql'),
      path.resolve(process.cwd(), 'seeds/seed_employees.sql'),
    ];
    const seedPath = seedCandidates.find((p) => fs.existsSync(p));
    if (seedPath) {
      console.log(`[Database]: Applying seed data from ${seedPath}...`);
      const seedSql = fs.readFileSync(seedPath, 'utf-8');
      await pool.query(seedSql);
      const countRes = await pool.query('SELECT COUNT(*) FROM employees;');
      console.log(`✅ [Database]: Seed verified. Total employees in database: ${countRes.rows[0].count}`);
    }
  } catch (initErr: any) {
    console.warn(`[Database Init Warning]: ${initErr.message}`);
  }
};

const startServer = async () => {
  try {
    // Verify database connection
    const res = await pool.query('SELECT current_database(), current_user;');
    console.log(
      `[Database]: Connected to PostgreSQL database "${res.rows[0].current_database}" as user "${res.rows[0].current_user}"`
    );

    // Initialize database schema and seeds automatically
    await runDatabaseInit();

    app.listen(PORT, () => {
      console.log(`[Server]: Employee Management API running on http://localhost:${PORT}`);
      console.log(`[Health]: Health check available at http://localhost:${PORT}/api/health`);
    });
  } catch (error: any) {
    console.error(`[Database Error]: Failed to connect to PostgreSQL: ${error.message}`);
    console.log('[Server]: Starting server in degraded mode (DB disconnected)...');
    
    app.listen(PORT, () => {
      console.log(`[Server]: Employee Management API running on http://localhost:${PORT} (Database offline)`);
    });
  }
};

startServer();
