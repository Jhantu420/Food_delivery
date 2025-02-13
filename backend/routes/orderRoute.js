// routes/userRoutes.js
import express from "express";
import { getUserOrders, listOrder, placeOrder, updateStatus, verifyOrder} from "../controllers/orderController.js";
import AuthMiddleware from "../middleware/auth.js"
const orderRouter = express.Router();

orderRouter.post("/place", AuthMiddleware, placeOrder)
orderRouter.post("/verify", verifyOrder)
orderRouter.get("/myorders", AuthMiddleware, getUserOrders);
orderRouter.get("/list", listOrder);
orderRouter.put("/status", updateStatus)


export default orderRouter;