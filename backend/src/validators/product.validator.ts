import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9 ,.-]+$/, 'Name contains invalid characters'),
  category: z.enum(['rings', 'necklaces', 'bracelets', 'earrings']),
  metalType: z.enum(['gold', 'silver', 'platinum', 'rose-gold']),
  weight: z.number().min(0.01, 'Weight must be at least 0.01').max(1000, 'Weight exceeded maximum of 1000'),
  currentMetalPrice: z.number().min(0.01, 'Metal price must be positive'),
  makingCharges: z.number().min(0, 'Making charges must be non-negative'),
  shippingCharges: z.number().min(0, 'Shipping charges must be non-negative'),
  availability: z.boolean(),
  tax: z.string().min(1, 'Tax name is required'),
  image: z.string().regex(/^(https?:\/\/.*\.(?:png|jpg|jpeg|webp))$/i, 'Image must be a valid URL ending in format .png, .jpg, .jpeg, or .webp'),
  description: z.string().optional()
});
