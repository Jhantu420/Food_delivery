import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./verify.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url , setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("✅ Received Query Params:", { success, orderId });

    const verifyPayment = async () => {
      if (!success || !orderId) {
        console.error("❌ Missing query params:", { success, orderId });
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`${url}/api/order/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ success: success === "true", orderId }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // console.log("✅ Payment Verified:", result);
          setCartItems({})
          setTimeout(() => navigate("/myorders"), 1000);
        } else {
          console.error("❌ Payment Verification Failed:", result);
          setTimeout(() => navigate("/"), 1000);
        }
      } catch (error) {
        console.error("❌ Error verifying payment:", error);
        setTimeout(() => navigate("/"), 1000);
      }
    };

    verifyPayment();
  }, [success, orderId, url, navigate, setCartItems]);

  return (
    <div className="verify">
      <p>Verifying Payment... Please Wait</p>
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
