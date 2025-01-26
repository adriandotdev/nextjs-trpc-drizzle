// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `t3-app-latest_${name}`);

export const posts = createTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  content: varchar("content", { length: 1000 }),
  date_created: timestamp("date_created", { withTimezone: true }).defaultNow(),
  date_modified: timestamp("date_modified", {
    withTimezone: true,
  }).defaultNow(),
  user_id: integer("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
});

export const user = createTable("user", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  date_created: timestamp("date_created", { withTimezone: true }).defaultNow(),
  date_modified: timestamp("date_modified", {
    withTimezone: true,
  }).defaultNow(),
});

// RELATIONS
export const UserTableRelations = relations(user, ({ many }) => {
  return {
    posts: many(posts),
  };
});

export const PostTableRelations = relations(posts, ({ one }) => {
  return {
    user: one(user, {
      fields: [posts.user_id],
      references: [user.id],
    }),
  };
});
