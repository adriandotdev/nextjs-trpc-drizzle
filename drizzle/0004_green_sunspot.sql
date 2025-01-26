CREATE TABLE IF NOT EXISTS "t3-app-latest_post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"content" varchar(1000),
	"date_created" timestamp with time zone DEFAULT now(),
	"date_modified" timestamp with time zone DEFAULT now(),
	"user_id" integer NOT NULL
);
--> statement-breakpoint
DROP TABLE "t3-app-latest_posts";--> statement-breakpoint
ALTER TABLE "t3-app-latest_user" ALTER COLUMN "date_created" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "t3-app-latest_user" ALTER COLUMN "date_modified" SET DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3-app-latest_post" ADD CONSTRAINT "t3-app-latest_post_user_id_t3-app-latest_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."t3-app-latest_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
