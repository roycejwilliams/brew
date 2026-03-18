import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "roycewilliams",
  database: "brew_dev",
  idleTimeoutMillis: 30000,
});

export default pool;
