import { Product, User } from "@prisma/client";
import { Request, Response } from "express";
import { prismaClient } from "..";
import { CartItemSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

interface UserParams extends Request {
  user: User;
}

export const addItemToCart = async (req: Request, res: Response) => {
  const validatedData = CartItemSchema.parse(req.body);
  let product: Product | null = null;
  const userReq = req as unknown as UserParams;
  
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  }catch(e){
    throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
  }
  const cart = await prismaClient.cartItem.create({
    data: {
      userId: userReq.user.id,
      productId: product.id,
      quantity: validatedData.quantity,
    }
  })
  res.json(cart);
}

export const deleteItemFromCart = async (req: Request, res: Response) => {}
export const changeItemQuantity = async (req: Request, res: Response) => {}
export const getCart = async (req: Request, res: Response) => {}