import { Router } from "express";
import authRouter from "./auth";
import productsRoutes from "./products";
import usersRouter from "./users";
import cartRoutes from "./carts";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/products", productsRoutes);
rootRouter.use("/users", usersRouter);
rootRouter.use("/carts", cartRoutes);

export default rootRouter;