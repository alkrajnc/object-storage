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
export type ObjectLink = typeof objectLinks.$inferSelect;
export type NewBucket = typeof buckets.$inferInsert;
export type NewObject = typeof objects.$inferInsert;

export const objects = pgTable(
    "objects",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 256 }),
        path: varchar("path", { length: 1024 }),
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

export const objectLinks = pgTable("object_links", {
    id: serial("id").primaryKey(),
    link: varchar("link", { length: 1024 }),
    token: varchar("token", { length: 64 }),
    expiringAt: timestamp("expiring_at"),
    objectName: varchar("object_name", { length: 256 }).references(
        () => objects.name,
    ),
});
