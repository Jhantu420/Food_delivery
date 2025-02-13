import express from "express";
import multer from "multer";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";

const foodRouter = express.Router();

// Image Storage
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    const fileExtension = file.mimetype.split("/")[1]; // Extract file extension
    cb(null, `${Date.now()}.${fileExtension}`); // Use Date.now() as filename
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
