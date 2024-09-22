import { NextFunction, Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { prismaClient } from "..";
import { Address, User } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/bad-request";

interface UserParams extends Request {
  user: User;
}
export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);
  const userReq = req as unknown as UserParams;
  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: userReq.user.id
    }
  })
  res.json(address);
}

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: parseInt(req.params.id)
      }
    })
    res.json({success: true});
  }catch(err) {
    new NotFoundException('Address not found', ErrorCode.ADDRESS_NOT_FOUND);
  }
}

export const listAddresses = async (req: Request, res: Response) => {
  const userReq = req as unknown as UserParams;
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: userReq.user.id
    }
  })
  res.json({
    data: addresses
  });
}

export const updateAddress = async (req: Request, res: Response) => {
  const validatedData = UpdateUserSchema.parse(req.body);
  const userReq = req as unknown as UserParams;

  let shiPpingAddressId: Address | null = null;
  let billingAddressId: Address | null = null;

  if(validatedData.defaaultShippingAddress) {
    try {
      shiPpingAddressId = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaaultShippingAddress
        }
      });
    }catch(error) {
      new NotFoundException('Address not found', ErrorCode.ADDRESS_NOT_FOUND);
    }
    if(shiPpingAddressId?.userId !== userReq.user.id) {
      throw new BadRequestException('Address does npt belong to user', ErrorCode.ADDRESS_DOES_NOT_BELONG_TO_USER);
    }
  }
  
  if(validatedData.defaultBillingAddress) {
    try {
      billingAddressId = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddress
        }
      });
      
    }catch(error) {
      new NotFoundException('Address not found', ErrorCode.ADDRESS_NOT_FOUND);
    }
    if(billingAddressId?.userId !== userReq.user.id) {
      throw new BadRequestException('Address does not belong to user', ErrorCode.ADDRESS_DOES_NOT_BELONG_TO_USER);
    }
  }


  const updatedUser = await prismaClient.user.update({
    where: {
      id: userReq.user.id
    },
    data: validatedData
  })
  res.json(updatedUser);
}