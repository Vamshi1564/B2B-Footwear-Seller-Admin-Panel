import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // XAMPP default
  database: "b2b_footwear_platform_new",
  waitForConnections: true,
  connectionLimit: 10,
});

export default db;
