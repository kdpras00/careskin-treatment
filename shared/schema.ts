import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skinAnalysis = pgTable("skin_analysis", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  imagePath: text("image_path"),
  skinType: text("skin_type"),
  hydration: integer("hydration"),
  elasticity: integer("elasticity"),
  concerns: jsonb("concerns").$type<string[]>(),
  analysisData: jsonb("analysis_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const questionnaires = pgTable("questionnaires", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  age: text("age"),
  primaryConcern: text("primary_concern"),
  currentRoutine: text("current_routine"),
  sensitivity: text("sensitivity"),
  lifestyle: jsonb("lifestyle"),
  answers: jsonb("answers"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  size: text("size"),
  rating: integer("rating"),
  imageUrl: text("image_url"),
  ingredients: jsonb("ingredients").$type<string[]>(),
  skinTypes: jsonb("skin_types").$type<string[]>(),
  concerns: jsonb("concerns").$type<string[]>(),
  isActive: boolean("is_active").default(true),
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  mainConcern: text("main_concern"),
  consultationTime: text("consultation_time"),
  status: text("status").default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age"),
  location: text("location"),
  beforeImageUrl: text("before_image_url"),
  afterImageUrl: text("after_image_url"),
  review: text("review"),
  rating: integer("rating").default(5),
  treatmentDuration: text("treatment_duration"),
  isActive: boolean("is_active").default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertSkinAnalysisSchema = createInsertSchema(skinAnalysis).omit({ id: true, createdAt: true });
export const insertQuestionnaireSchema = createInsertSchema(questionnaires).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertConsultationSchema = createInsertSchema(consultations).omit({ id: true, createdAt: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type SkinAnalysis = typeof skinAnalysis.$inferSelect;
export type Questionnaire = typeof questionnaires.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Consultation = typeof consultations.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSkinAnalysis = z.infer<typeof insertSkinAnalysisSchema>;
export type InsertQuestionnaire = z.infer<typeof insertQuestionnaireSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
