import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import "./Add.css";
import { toast } from "react-toastify";


const Add = ({url}) => {
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Select",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const [image, setImage] = useState(null);

  // Handle file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();  
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);
    const response = await fetch(`${url}/api/food/add`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    // console.log(result);
    if (response.ok) {
       toast.success("Item added successfully!");
      setData({
        name: "",
        description: "",
        price: "",
        category: "Select",
      });
      setImage(null);
    } else {
      toast.error(response.data.message);
    }
  };
  useEffect(() => {
    console.log(data);
  });

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="upload preview"
            />
          </label>
          <input
            type="file"
            id="image"
            hidden
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            name="name"
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Enter product description"
            required
          ></textarea>
        </div>

        <div className="add-category-pro">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} name="category">
              <option value="Select">Select</option>
              <option value="Rolls">Rolls</option>
              <option value="Salad">Salad</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              name="price"
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              placeholder="$20"
              required
            />
          </div>
        </div>

        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
