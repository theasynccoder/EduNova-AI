import { pgTable, integer, varchar, boolean, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  subscriptionId: varchar({ length: 255 }),
});

export const courseTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }),
  description: varchar({ length: 255 }), // FIXED
  noOfChapters: integer().notNull(),
  includeVideo: boolean().default(false),
  level: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }),
  courseJson: json(),
  bannerImageUrl: varchar().default(""),
  courseContent: json().default({}), // FIXED
  userEmail: varchar({ length: 255 }) // FIXED
    .references(() => usersTable.email)
    .notNull(),
});

export const enrollCourseTable = pgTable('enrollCourse',{
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid:varchar('cid').references(()=>courseTable.cid),
  userEmail: varchar({ length: 255 }) // FIXED
    .references(() => usersTable.email)
    .notNull(),
    completedChapters:json()
})