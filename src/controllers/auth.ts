import {Response, Request} from 'express';
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import { JWT_SECRET } from "../secrets";
import * as jwt from 'jsonwebtoken';

export const signup = async(req: Request, res: Response) => {
  const {email, name, password} = req.body;
  let user = await prismaClient.user.findFirst({where: {email}});
  if(user) {
    return res.status(400).json({error: "User already exists"});
  }
  user = await prismaClient.user.create(
    {data: {
      email,
      name,
      password: hashSync(password, 10)
    }
});
res.json(user);

}

export const login = async(req: Request, res: Response) => {
  const {email, password} = req.body;
  let user = await prismaClient.user.findFirst({where: {email}});
  if(!user) {
    return res.status(400).json({error: "User doesn't exists"});
  }
  if(!compareSync(password, user.password)) {
    return res.status(400).json({error: "Invalid Password"});
  }
  const token = jwt.sign({userId: user.id}, JWT_SECRET);
  res.json({user, token});
}