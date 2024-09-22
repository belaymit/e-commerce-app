import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { addAddress, deleteAddress, listAddresses, updateAddress } from "../controllers/users";
import { errorHandler } from "../error-handler";

const usersRouter: Router = Router();
usersRouter.post("/address", [authMiddleware], errorHandler(addAddress));
usersRouter.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress));
usersRouter.get("/address", [authMiddleware], errorHandler(listAddresses));
usersRouter.put("/", [authMiddleware], errorHandler(updateAddress));

export default usersRouter;