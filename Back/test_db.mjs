import pool from "./DB_config/db.mjs";

try {
    const result =await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful:', result.rows[0]);
    process.exit(0);
} catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
}