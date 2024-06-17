import "dotenv/config";
import { db, queryClient } from "./config";
import { migrate } from "drizzle-orm/postgres-js/migrator";

async function migrateDb() {
    await migrate(db, { migrationsFolder: "./drizzle" });
    await queryClient.end();
}
migrateDb();
