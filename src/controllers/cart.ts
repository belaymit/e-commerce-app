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

export const deleteItemFromCart = async (req: Request, res: Response) => {
  //check if user is deleting his own cart item
  const userReq = req as unknown as UserParams;
  const cartItem = await prismaClient.cartItem.findFirst({
    where: {
      id: parseInt(req.params.id),
      userId: userReq.user.id
    }
  })
  if(!cartItem){
    throw new NotFoundException("Cart item not found", ErrorCode.CART_ITEM_NOT_FOUND);
  }
  await prismaClient.cartItem.delete({
    where: {
      id: parseInt(req.params.id)
    }
  })
}
export const changeItemQuantity = async (req: Request, res: Response) => {
  const validatedData = CartItemSchema.parse(req.body);
  const userReq = req as unknown as UserParams;
  const cartItem = await prismaClient.cartItem.findFirst({
    where: {
      id: parseInt(req.params.id),
      userId: userReq.user.id
    }
  })
  if(!cartItem){
    throw new NotFoundException("Cart item not found", ErrorCode.CART_ITEM_NOT_FOUND);
  }
  const updatedCart = await prismaClient.cartItem.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      quantity: validatedData.quantity
    }
  })
  res.json(updatedCart);
}
export const getCart = async (req: Request, res: Response) => {
  const cart = await prismaClient.cartItem.findMany({
    where: {
      userId: (req as unknown as UserParams).user.id
    },
    include: {
      product: true
    }
  })
  res.json(cart);
}