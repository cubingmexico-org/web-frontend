ALTER TABLE "exportMetadata" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "exportMetadata" ADD COLUMN "key" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "exportMetadata" ADD COLUMN "value" text;--> statement-breakpoint
ALTER TABLE "exportMetadata" ADD COLUMN "updatedAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "exportMetadata" DROP COLUMN "date";