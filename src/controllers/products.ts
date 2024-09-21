import { Request, Response } from "express";
import { prismaClient } from "..";
import { ProductSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createProduct = async (req: Request, res: Response) => {
 ProductSchema.parse(req.body);
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    }
  })
  res.json(product)
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if(product.tags) {
      product.tags = product.tags.join(",");
    }
    const updatedProduct = await prismaClient.product.update({
      where: {
        id: +req.params.id
      },
      data: product
    });
    res.json(updatedProduct);

  }catch(err) {
    throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prismaClient.product.delete({
      where: {
        id: +req.params.id
      }
    });
    res.json({message: "Product deleted"});
  }catch(err) {
    throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
  }
}

export const getProducts = async (req: Request, res: Response) => {
  const count = await prismaClient.product.count();
  const skip = typeof req.query.skip === 'string' ? parseInt(req.query.skip, 10) : 0;
  const products = await prismaClient.product.findMany({
    skip: isNaN(skip) ? 0 : skip,
    take: 5,
  });
  res.json({
    count,
    data: products
  });
}

export const getProduct = async (req: Request, res: Response) => {
  const product = await prismaClient.product.findFirst({
    where: {
      id: +req.params.id
    }
  });
  if(!product) {
    throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
  }
  res.json(product);
}