CREATE TABLE IF NOT EXISTS "t3-app-latest_user" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"username" varchar(255),
	"password" varchar(255),
	"date_created" timestamp with time zone,
	"date_modified" timestamp with time zone,
	CONSTRAINT "t3-app-latest_user_id_unique" UNIQUE("id")
);
