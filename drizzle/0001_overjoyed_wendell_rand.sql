ALTER TABLE "buckets" ADD COLUMN "path" varchar(256);--> statement-breakpoint
ALTER TABLE "objects" ADD COLUMN "bucketId" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "objects" ADD CONSTRAINT "objects_bucketId_buckets_id_fk" FOREIGN KEY ("bucketId") REFERENCES "public"."buckets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
