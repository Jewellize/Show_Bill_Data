import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import Toggle from "./component/Toggle";

function App() {
  const [menuItems, setMenuItems] = useState([]);

  const [allOrder, setAllOrder] = useState(0);
  const [successOrder, setSuccessOrder] = useState(0);
  const [UnSuccessOrder, setUnSuccessOrder] = useState(0);

  useEffect(() => {
    // Fetch menu items from the database
    fetchMenuItems();
  }, []);

  useEffect(() => {
    // Fetch menu items from the database
    setAllOrder(menuItems.length);
    setSuccessOrder(menuItems.filter((obj) => obj.cookstatus === 0).length);
    setUnSuccessOrder(menuItems.filter((obj) => obj.cookstatus === 1).length);
  }, [menuItems]);

  //get
  const [data, setData] = useState([]);

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get(
        "https://temi-food-backend.vercel.app/showorder"
      );
      setMenuItems(res.data);
    } catch (error) {
      console.log("Error fetching menu items:", error);
    }
  };

  const updateCookStatus = (id, updateValue) => {
    axios
      .post(`https://temi-food-backend.vercel.app/updatecookstatus/${id}`, {
        updateValue,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const handleUpdateStatus = (id, index) => {
    let updateValue = menuItems[index].cookstatus === 1 ? 0 : 1;
    let updateMenu = menuItems.map((obj) =>
      obj.id === id ? { ...obj, cookstatus: updateValue } : obj
    );
    setMenuItems(updateMenu);
    updateCookStatus(id, updateValue);
  };

  console.log(menuItems);
  return (
    <div className="grid gap-4">
      <div id="title-header" className="text-6xl">
        Kitchen Menu
      </div>
      <div id="tab-filter" className="flex justify-center gap-2">
        <div className="flex items-center bg-blue-200 py-2 px-4 rounded-full ">
          ออเดอร์ทั้งหมด
          <div className="flex justify-center items-center ml-2 rounded-full bg-white w-8 h-8">
            {allOrder}
          </div>
        </div>
        <div className="flex items-center bg-red-200 py-2 px-4 rounded-full">
          ยังไม่ได้ทำ
          <div className="flex justify-center items-center ml-2 rounded-full bg-white w-8 h-8">
            {successOrder}
          </div>
        </div>
        <div className="flex items-center bg-green-200 py-2 px-4 rounded-full">
          ทำแล้ว
          <div className="flex justify-center items-center ml-2 rounded-full bg-white w-8 h-8">
            {UnSuccessOrder}
          </div>
        </div>
      </div>
      <div className="grid gap-4"></div>
      {/* loop menu */}
      {menuItems.map((menu, index) => (
        <div id="menu-card" key={index} className="border rounded-xl">
          <div id="card-header" className="flex justify-between p-2">
            <div className="flex gap-8 items-center">
              <div>{menu.numoftable}</div>
              <div>วันที่ : {menu.ordertime ? menu.ordertime : ""}</div>
              <div>เวลา : {menu.ordertime ? menu.ordertime : ""}</div>
            </div>
            {/* check status */}
            {menu.cookstatus === 1 ? (
              <div className="bg-green-200 py-2 px-4 rounded-full">ทำแล้ว</div>
            ) : (
              <div className="bg-red-200 py-2 px-4 rounded-full">
                ยังไม่ได้ทำ
              </div>
            )}
          </div>
          {/* loop order */}
          <div id="card-body" className="flex justify-center bg-white">
            <table className="w-full">
              <thead className="border-y">
                <tr>
                  <th className="w-1/2 border-r">รายการ</th>
                  <th className="w-1/2">จำนวน</th>
                </tr>
              </thead>
              <tbody>
                {menu.bulkfood.map((item, foodIndex) => (
                  <tr key={foodIndex} className="divide-x">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">{item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div id="card-button">
            {menu.cookstatus === 1 ? (
              <button
                className="bg-blue-500 w-full hover:bg-blue-200 text-white font-bold py-2 px-4 rounded-b-xl"
                onClick={() => handleUpdateStatus(menu.id, index)}
              >
                เสร็จเรียบร้อย
              </button>
            ) : (
              <button
                className="bg-red-500 w-full hover:bg-red-200 text-white font-bold py-2 px-4 rounded-b-xl"
                onClick={() => handleUpdateStatus(menu.id, index)}
              >
                ยังทำไม่เสร็จ
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
