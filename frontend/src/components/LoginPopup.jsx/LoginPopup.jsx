import React, { useContext, useEffect, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const SIGN_UP = "Sign Up";
const LOGIN = "Login";

const LoginPopup = ({ setShowLogin }) => {
  const { url, token, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState(SIGN_UP);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const apiEndpoint = currState === SIGN_UP 
      ? `${url}/api/user/register` 
      : `${url}/api/user/login`;

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }
      if(response.ok){
        setToken(result.token);  // ✅ Use result.token instead of response.data.token
        localStorage.setItem("token", result.token);                       
      }

      toast.success(
        result.message || (currState === SIGN_UP 
          ? "Registered Successfully!" 
          : "Logged in Successfully!")
      );

      setShowLogin(false);
    } catch (error) {
      toast.error(error.message || "An error occurred!");
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === SIGN_UP && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            minLength={6}
            required
          />
        </div>

        <button type="submit">
          {currState === SIGN_UP ? "Create Account" : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>

        {currState === LOGIN ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState(SIGN_UP)}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState(LOGIN)}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
