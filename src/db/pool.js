import mysql from "mysql2/promise";
import "dotenv/config";

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,           // "db" inside Docker
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  charset: "utf8mb4",
  collation: "utf8mb4_unicode_ci",
  waitForConnections: true,
  connectionLimit: 10,
});
