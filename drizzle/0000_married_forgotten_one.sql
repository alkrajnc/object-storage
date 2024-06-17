DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('private', 'public');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "buckets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"type" "type",
	"owner_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "objects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "objects" USING btree ("name");