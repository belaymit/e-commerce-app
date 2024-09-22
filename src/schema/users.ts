import {z} from 'zod';

export const SignUpSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})


export const AddressSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string().nullable(),
  zip: z.string().length(4),
  city: z.string(),
  country: z.string(),
})

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  defaaultShippingAddress: z.number().optional(),
  defaultBillingAddress: z.number().optional(),
})