import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./MyOrder.css";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext); // ✅ Removed `removeFromCart` from context
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${url}/api/order/myorders`, {
        method: "GET",
        headers: { token }, // ✅ Pass auth token in headers
      });

      const result = await response.json();
      if (response.ok) {
        setOrders(result.orders);
      } else {
        console.error("❌ Error fetching orders:", result.message);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [url, token]); // ✅ Removed `removeFromCart` dependency

  return (
    <div className="myorders">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="order-item-main">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{order.amount}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>

              <strong>Items:</strong>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index} className="order-item-details">
                    <img
                      src={`${url}/images/${item.image}`} // ✅ Display item image
                      alt={item.name}
                      className="order-item-image"
                    />
                    <p>
                      <strong>{item.name}</strong> - {item.quantity} pcs
                    </p>
                    <p>₹{item.price} each</p>
                  </li>
                ))}
              </ul>

              <strong>Address:</strong>
              <p>
                {order.address.firstName} {order.address.lastName},{" "}
                {order.address.street}, {order.address.city},{" "}
                {order.address.state}, {order.address.zipcode},{" "}
                {order.address.country}
              </p>
              <p>
                <strong>Phone:</strong> {order.address.phone}
              </p>

              <button className="trackOrder" onClick={fetchOrders()}>
                Track Order
              </button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default MyOrders;
