ALTER TABLE "t3-app-latest_user" DROP CONSTRAINT "t3-app-latest_user_id_unique";--> statement-breakpoint
ALTER TABLE "t3-app-latest_user" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (sequence name "t3-app-latest_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "t3-app-latest_user" ALTER COLUMN "date_created" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "t3-app-latest_user" ALTER COLUMN "date_modified" SET DEFAULT CURRENT_TIMESTAMP;