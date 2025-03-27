import { z } from "zod";

export const ApiResponse = z.object({
  code: z.number().int().optional(),
  type: z.string().optional(),
  message: z.string().optional(),
});
export const Category = z.object({
  id: z.number().int().optional(),
  name: z.string().optional(),
});
export const Pet = z.object({
  id: z.number().int().optional(),
  category: z.any().optional(),
  name: z.string(),
  photoUrls: z.array(z.string()),
  tags: z.array(z.any()).optional(),
  status: z.enum(["available", "pending", "sold"]).optional(),
});
export const Tag = z.object({
  id: z.number().int().optional(),
  name: z.string().optional(),
});
export const Order = z.object({
  id: z.number().int().optional(),
  petId: z.number().int().optional(),
  quantity: z.number().int().optional(),
  shipDate: z.string().datetime({ offset: true }).optional(),
  status: z.enum(["placed", "approved", "delivered"]).optional(),
  complete: z.boolean().optional(),
});
export const User = z.object({
  id: z.number().int().optional(),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  userStatus: z.number().int().optional(),
});
