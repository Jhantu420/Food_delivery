import UserModel from "../model/userModel.js";

// Add to cart
export const addToCart = async (req, res) => {
  try {
    let userData = await UserModel.findById({ _id: req.body.userId });
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await UserModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Remove from cart
export const removeCartItem = async (req, res) => {
  try {
    const userData = await UserModel.findById(req.body.userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData; // Declare cartData with let
    if (!cartData || typeof cartData !== "object") {
      cartData = {}; // Ensure cartData is an object
    }

    if (cartData[req.body.itemId] && cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
      if (cartData[req.body.itemId] === 0) {
        delete cartData[req.body.itemId]; // Remove item if count reaches zero
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Item not found in cart" });
    }

    await UserModel.findByIdAndUpdate(req.body.userId, { cartData });

    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Get cart items
export const getCartItems = async (req, res) => {
  try {
    let userData = await UserModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
};
