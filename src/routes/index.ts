import { Router } from "express";
import authRouter from "./auth";
import productsRoutes from "./products";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/products", productsRoutes);

export default rootRouter;