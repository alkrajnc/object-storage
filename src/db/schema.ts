import {
    integer,
    pgEnum,
    pgTable,
    serial,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";

export const bucketType = pgEnum("type", ["private", "public"]);

export type Bucket = typeof buckets.$inferSelect;
export type Object = typeof objects.$inferSelect;
export type NewBucket = typeof buckets.$inferInsert;
export type NewObject = typeof objects.$inferInsert;

export const objects = pgTable(
    "objects",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 256 }),
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
});
