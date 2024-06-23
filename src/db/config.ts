import { drizzle } from "drizzle-orm/postgres-js";
// import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import "dotenv/config";

// eslint-disable-next-line max-len
const dbUrl = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`;

const migrationClient = postgres(dbUrl, { max: 1 });
// migrate(drizzle(migrationClient));

export const queryClient = postgres(dbUrl);
export const db = drizzle(queryClient);
