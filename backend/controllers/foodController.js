import foodModel from "../model/foodModel.js";
import fs from "fs";

// Add Food Item
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required!", success: false });
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.file.filename, // Store filename
      category: req.body.category,
    });

    await food.save();
    res.status(201).json({ message: "Food added successfully", success: true, data: food });

  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// List All Food Items
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

// Remove Food Item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found!" });
    }

    // Remove image file if it exists
    const imagePath = `uploads/${food.image}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Remove food from the database
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food removed successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addFood, listFood, removeFood };
