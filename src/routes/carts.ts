import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { addItemToCart, changeItemQuantity, deleteItemFromCart, getCart } from "../controllers/cart";

const cartRoutes: Router = Router();
cartRoutes.post('/', [authMiddleware], errorHandler(addItemToCart))
cartRoutes.get('/', [authMiddleware], errorHandler(getCart))
cartRoutes.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart))
cartRoutes.put('/:id', [authMiddleware], errorHandler(changeItemQuantity))

export default cartRoutes;