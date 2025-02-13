import express from 'express';

import { addToCart, getCartItems, removeCartItem } from '../controllers/cartController.js';
import AuthMiddleware from '../middleware/auth.js';
const cartRouter = express.Router();

cartRouter.post('/add',AuthMiddleware, addToCart);
cartRouter.get('/get',AuthMiddleware, getCartItems);
cartRouter.post('/remove',AuthMiddleware, removeCartItem);

export default cartRouter;