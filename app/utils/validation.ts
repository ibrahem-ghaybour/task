/**
 * Validation Schemas
 * Centralized validation rules using Zod
 */
import * as z from "zod";

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(100, "Password must not exceed 100 characters"),
  provider: z.string().default("mgr"),
  otp: z.string().optional().default(""),
});

/**
 * Register form validation schema
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

/**
 * Product form validation schema
 */
export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(255, "Product name must not exceed 255 characters"),
  slug: z
    .string()
    .optional()
    .refine(
      (val) => !val || new RegExp("^[\\p{L}\\p{N}\\-_]+$", "u").test(val),
      "Slug can only contain letters, numbers, hyphens, and underscores"
    ),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(100, "SKU must not exceed 100 characters")
    .refine(
      (val) => new RegExp("^[\\p{L}\\p{N}\\-_]+$", "u").test(val),
      "SKU can only contain letters, numbers, hyphens, and underscores"
    ),
  description: z.string().optional().default(""),
  keywords_seo_ar: z.string().optional().default(""),
  keywords_seo_en: z.string().optional().default(""),
  description_seo_ar: z.string().optional().default(""),
  description_seo_en: z.string().optional().default(""),
  category: z
    .number()
    .int("Category must be a whole number")
    .positive("Category must be a positive number"),
  brand: z
    .number()
    .int("Brand must be a whole number")
    .positive("Brand must be a positive number"),
  unit: z
    .number()
    .int("Unit must be a whole number")
    .positive("Unit must be a positive number"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative"),
  featured: z.union([z.literal(0), z.literal(1)]).default(0),
  isOnline: z.union([z.literal(0), z.literal(1)]).default(0),
  online_units: z
    .number()
    .int("Online units must be a whole number")
    .min(1, "Online units must be at least 1"),
  max_order: z
    .number()
    .int("Max order must be a whole number")
    .min(0, "Max order cannot be negative"),
  buying_price: z
    .number()
    .min(0, "Buying price cannot be negative"),
  selling_price: z
    .number()
    .min(0, "Selling price cannot be negative")
    .refine((val) => val > 0, "Selling price must be greater than 0"),
  tax: z
    .number()
    .min(0, "Tax cannot be negative")
    .max(100, "Tax cannot exceed 100%"),
  weight: z.number().optional().refine((v) => v === undefined || v >= 0, {
    message: "Weight cannot be negative",
  }),
  barcode: z.string().optional(),
  content: z.string().optional(),
});

/**
 * Type exports for TypeScript
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
