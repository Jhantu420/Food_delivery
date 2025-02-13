




import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://food-delivery-backend-gy6h.onrender.com";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // Add to cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        const response = await fetch(`${url}/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ itemId }),
        });

        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {
    if (!cartItems[itemId]) return;

    setCartItems((prev) => {
      const updatedCart = { ...prev };
      updatedCart[itemId] -= 1;
      if (updatedCart[itemId] === 0) {
        delete updatedCart[itemId]; // Remove item if count reaches 0
      }
      return updatedCart;
    });

    if (token) {
      try {
        const response = await fetch(`${url}/api/cart/remove`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ itemId }),
        });

        if (!response.ok) {
          throw new Error("Failed to remove item from cart");
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  // Calculate total price
  const getCartTotal = () => {
    return Object.keys(cartItems).reduce((total, key) => {
      const item = food_list.find((item) => item._id === key);
      return item ? total + item.price * cartItems[key] : total;
    }, 0);
  };

  // Fetch food list from API
  const fetchFoodList = async () => {
    try {
      const response = await fetch(`${url}/api/food/list`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setFoodList(data);
      } else if (data && Array.isArray(data.data)) {
        setFoodList(data.data);
      } else {
        console.error("Unexpected API response format", data);
        setFoodList([]);
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      setFoodList([]);
    }
  };

  // Load cart data when token is available
  const loadCartData = async (token) => {
    if (!token) return; // Ensure we don't fetch without a token

    try {
      const response = await fetch(`${url}/api/cart/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cart data. Status: ${response.status}`);
      }

      const data = await response.json();
      setCartItems(data.cartData || {}); // Update cart state
    } catch (error) {
      console.error("Error loading cart data:", error);
      setCartItems({}); // Reset to empty on error
    }
  };

  // Fetch food list on mount
  useEffect(() => {
    fetchFoodList();
  }, []);

  // Load token from localStorage and fetch cart data
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch cart data when token is available
  useEffect(() => {
    if (token) {
      loadCartData(token);
    }
  }, [token]); // Runs when token changes

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getCartTotal,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
