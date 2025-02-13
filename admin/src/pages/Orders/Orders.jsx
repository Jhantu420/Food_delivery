import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import "./Orders.css";
const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders from the API
  const fetchAllOrders = async () => {
    try {
      const response = await fetch(`${url}/api/order/list`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      console.log("📦 All orders:", data);

      // Ensure correct data extraction
      setOrders(data.orders || data.data || []);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  };

  // ✅ Update Order Status
  const statusHandler = async (e, orderId) => {
    const newStatus = e.target.value;
    if (newStatus === "Select") return;

    try {
      const response = await fetch(`${url}/api/order/status`, {
        method: "PUT", // ✅ Use PUT or POST for updates
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("❌ Failed to update status:", data.message);
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  };
  
  // Fetch orders on component mount
  useEffect(() => {
    fetchAllOrders();
  }, []);



  return (
    <div className="order-container">
      <h3 className="order-title">My Orders</h3>
      <div className="order-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="order-item">
              <img
                src={assets.parcel_icon}
                alt="Parcel Icon"
                className="order-icon"
              />
              <div className="order-details">
                <p className="order-item-food">
                  {order.items.map((item, index) =>
                    index === order.items.length - 1
                      ? `${item.name} X ${item.quantity}`
                      : `${item.name} + ${item.quantity}, `
                  )}
                </p>
                <p className="order-name">
                  Name:{" "}
                  <span className="status-text">
                    {order.address.firstName + " " + order.address.lastName}
                  </span>
                </p>
                <p className="order-address">
                  Address:{" "}
                  <span className="status-text">
                    {order.address.street + ","}
                  </span>
                </p>
                <p className="order-address">
                  City:{" "}
                  <span className="status-text">
                    {order.address.city + ","}
                  </span>
                </p>
                <p className="order-address">
                  State:{" "}
                  <span className="status-text">
                    {order.address.state + ","}
                  </span>
                </p>
                <p className="order-address">
                  Zipcode:{" "}
                  <span className="status-text">
                    {order.address.zipcode + ","}
                  </span>
                </p>
                <p className="order-address">
                  Country:{" "}
                  <span className="status-text">
                    {order.address.country + ","}
                  </span>
                </p>
                <p className="order-address">
                  Phone:{" "}
                  <span className="status-text">
                    {order.address.phone + ","}
                  </span>
                </p>
                <p className="order-address">
                  Phone:{" "}
                  <span className="status-text">{order.amount + ","}</span>
                </p>
                <select onChange={(e)=>statusHandler(e,order._id)} value={order.status}>
                  <option value="Select">Select</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Deliverd">Deliverd</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <p className="no-orders">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
