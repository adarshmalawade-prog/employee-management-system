import fs from 'fs';
import path from 'path';
import { pool } from '../config/database';

export const runMigrations = async (): Promise<void> => {
  try {
    const migrationFilePath = path.join(__dirname, '../../migrations/001_create_employees.sql');
    console.log(`[Migration]: Reading SQL migration from ${migrationFilePath}...`);

    const sql = fs.readFileSync(migrationFilePath, 'utf-8');
    await pool.query(sql);

    console.log('✅ [Migration]: Database migration completed successfully.');
  } catch (error: any) {
    console.error('❌ [Migration Error]: Failed to run database migration:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  runMigrations();
}
