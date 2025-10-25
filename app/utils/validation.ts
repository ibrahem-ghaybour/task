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

  /** ✅ backend expects `online_units` */
  online_units: z
    .number()
    .int("Online units must be a whole number")
    .min(1, "Online units must be at least 1"),

  max_order: z
    .number()
    .int("Max order must be a whole number")
    .min(0, "Max order cannot be negative"),

  /** ✅ backend expects `price` instead of `selling_price` */
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .refine((val) => val > 0, "Price must be greater than 0"),

  buying_price: z
    .number()
    .min(0, "Buying price cannot be negative"),

  tax: z
    .number()
    .min(0, "Tax cannot be negative")
    .max(100, "Tax cannot exceed 100%"),

  /** ✅ backend expects `Item_Isdisabled` */
  Item_Isdisabled: z.union([z.literal(0), z.literal(1)]).default(0),

  weight: z
    .number()
    .min(0, "Weight cannot be negative"),

  barcode: z.string().min(1, "Barcode is required"),

  content: z.string().optional(),
});

/**
 * Type exports for TypeScript
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
