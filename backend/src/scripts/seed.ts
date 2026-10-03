import fs from 'fs';
import path from 'path';
import { pool } from '../config/database';

export const runSeed = async (): Promise<void> => {
  try {
    const seedFilePath = path.join(__dirname, '../../seeds/seed_employees.sql');
    console.log(`[Seed]: Reading seed data from ${seedFilePath}...`);

    const sql = fs.readFileSync(seedFilePath, 'utf-8');
    await pool.query(sql);

    const countRes = await pool.query('SELECT COUNT(*) FROM employees;');
    console.log(`✅ [Seed]: Seed data applied successfully. Total employees: ${countRes.rows[0].count}`);
  } catch (error: any) {
    console.error('❌ [Seed Error]: Failed to seed sample data:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  runSeed();
}
