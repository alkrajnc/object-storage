import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import "dotenv/config";

// for migrations
const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
// migrate(drizzle(migrationClient));

// for query purposes
export const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient);
