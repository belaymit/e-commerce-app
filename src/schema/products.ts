import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  description: z.string().min(10),
  tags: z.array(z.string())
});