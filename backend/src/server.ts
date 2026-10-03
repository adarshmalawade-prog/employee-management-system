import app from './app';
import { pool } from './config/database';

const PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async () => {
  try {
    // Verify database connection
    const res = await pool.query('SELECT current_database(), current_user;');
    console.log(
      `[Database]: Connected to PostgreSQL database "${res.rows[0].current_database}" as user "${res.rows[0].current_user}"`
    );

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
