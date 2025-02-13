import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <ToastContainer
      position="top-center" // Center the toast horizontally
      autoClose={2000} // Display time of 2 seconds (2000ms)
      hideProgressBar={true} // Optionally hide the progress bar
      newestOnTop={false} // To avoid overlapping with other toasts
      closeOnClick={true} // Close the toast on click
      pauseOnHover={true} // Pause toast when hovered
      draggable={false} // Disable drag functionality
      // theme="colored"
    />{" "}
    {/* Add this globally */}
  </BrowserRouter>
);
