import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, image, price, description }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={image ? `${url}/images/${image}` : assets.default_food_image}
          alt={name || "Food item"}
        />
        {!cartItems[id] ? (
          <img
            className="add"
            src={assets.add_icon_white}
            alt="Add to cart"
            onClick={() => addToCart(id)}
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="Increase quantity"
            />
            <p>{cartItems[id] || 0}</p>
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="Decrease quantity"
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating stars" />
        </div>
        <p className="food-item-desc">{description}</p>
        <div className="food-item-price">${price?.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default FoodItem;
