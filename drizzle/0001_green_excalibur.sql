CREATE TABLE IF NOT EXISTS "friend_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer NOT NULL,
	"receiver_id" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "friendships" DROP CONSTRAINT "friendships_user_id_friend_id_pk";--> statement-breakpoint
ALTER TABLE "friendships" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "friendships" ALTER COLUMN "friend_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "friendships" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "friend_requests_sender_id_idx" ON "friend_requests" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "friend_requests_receiver_id_idx" ON "friend_requests" USING btree ("receiver_id");