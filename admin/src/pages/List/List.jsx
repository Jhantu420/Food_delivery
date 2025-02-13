import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./List.css";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await fetch(`${url}/api/food/list`);
    const result = await response.json();
    if (response.ok) {
      setList(result.data);
    } else {
      toast.error(result.message);
    }
  };
  useEffect(() => {
    fetchList();
  }, []);

  const removeFood = async (foodid) => {
    try {
      const response = await fetch(`${url}/api/food/remove/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: foodid }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        fetchList(); // Refresh the list after successful deletion
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Price</b>
          <b>Category</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={`${url}/images/` + item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p onClick={() => removeFood(item._id)}>X</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
