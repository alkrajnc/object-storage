import {
    integer,
    pgEnum,
    pgTable,
    serial,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";

export const bucketType = pgEnum("type", ["private", "public"]);

export type Bucket = typeof buckets.$inferSelect;
export type Object = typeof objects.$inferSelect;
export type ObjectLink = typeof objectAccess.$inferSelect;
export type NewBucket = typeof buckets.$inferInsert;
export type NewObject = typeof objects.$inferInsert;

export const objects = pgTable(
    "objects",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 256 }),
        path: varchar("path", { length: 1024 }),
        size: integer("size"),
        mimetype: varchar("mimetype", { length: 256 }),
        bucketId: serial("bucketId").references(() => buckets.id),
    },
    objects => {
        return {
            nameIndex: uniqueIndex("name_idx").on(objects.name),
        };
    },
);
export const buckets = pgTable("buckets", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    type: bucketType("type"),
    ownerId: integer("owner_id"),
    path: varchar("path", { length: 256 }),
});

export const objectAccess = pgTable("object_access", {
    id: serial("id").primaryKey(),
    token: varchar("token", { length: 64 }),
    expiringAt: timestamp("expiring_at"),
    objectName: varchar("object_name", { length: 256 }).references(
        () => objects.name,
    ),
});
export const accounts = pgTable("accounts", {
    username: varchar("username", { length: 256 }).primaryKey(),
    hash: varchar("hash", { length: 1024 }),
    salt: varchar("salt", { length: 1024 }),
    image: varchar("image", { length: 512 }),
});

export const accessLogs = pgTable("access_logs", {
    id: serial("id").primaryKey(),
    objectName: varchar("object_name", { length: 256 }).references(
        () => objects.name,
    ),
    timestamp: timestamp("timestamp"),
});
