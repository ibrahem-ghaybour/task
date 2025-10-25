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
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  keywords_seo_ar: z.string().optional(),
  keywords_seo_en: z.string().optional(),
  description_seo_ar: z.string().optional(),
  description_seo_en: z.string().optional(),
  description: z.string().optional(),

  category: z.number().int().positive("Category is required"),
  brand: z.number().int().positive("Brand is required"),
  unit: z.number().int().positive("Unit is required"),

  quantity: z.number().int().min(0, "Quantity cannot be negative"),
  featured: z.union([z.literal(0), z.literal(1)]).default(0),
  isOnline: z.union([z.literal(0), z.literal(1)]).default(0),
  online_units: z.number().int().min(1, "Online units must be at least 1"),
  max_order: z.number().int().min(0, "Max order cannot be negative"),

  buying_price: z.number().min(0, "Buying price cannot be negative"),
  selling_price: z.number().min(0, "Selling price cannot be negative"),
  tax: z.number().min(0).max(100, "Tax must be between 0 and 100"),

  sku: z.string().min(1, "SKU is required"),
  weight: z.number().min(0, "Weight cannot be negative").optional(),
  barcode: z.string().optional(),
  content: z.string().optional(),
  price: z.number().min(0, "Price cannot be negative"),
  Item_Isdisabled: z.number().min(1),
});


/**
 * Type exports for TypeScript
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
