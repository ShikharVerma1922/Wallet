import React, { useState, useEffect, useRef } from "react";
import {
  categoryList,
  oneMonthAgoDate,
  currentDate,
  categoryColor,
  formatToINS,
} from "./allExports";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { months } from "./allExports";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MdFastfood, MdSubscriptions } from "react-icons/md";
import { GiMilkCarton, GiHouseKeys } from "react-icons/gi";
import {
  FaBus,
  FaCar,
  FaCoins,
  FaGift,
  FaPhoneAlt,
  FaQuestion,
  FaShoppingBag,
} from "react-icons/fa";
import { RiStockFill } from "react-icons/ri";

let categoryIcons = {
  "Food & Drinks": <MdFastfood />,
  Groceries: <GiMilkCarton />,
  Shopping: <FaShoppingBag />,
  Transportation: <FaBus />,
  Vehicle: <FaCar />,
  Entertainment: <MdSubscriptions />,
  Internet: <FaPhoneAlt />,
  Rent: <GiHouseKeys />,
  Investment: <RiStockFill />,
  Wage: <FaCoins />,
  Gifts: <FaGift />,
};

const FilterRecords = () => {
  const [data, setData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [startDate, setStartDate] = useState(oneMonthAgoDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [options] = useState(categoryList);
  const [buttonClicked, setButtonclicked] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const fetchFilteredData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(category && { category }),
        ...(account && { account }),
      });

      const response = await fetch(
        `https://wallet-app-u6wd.onrender.com/filter-record?${params.toString()}`
      );
      const result = await response.json();
      setData(result);

      const response2 = await fetch(
        `https://wallet-app-u6wd.onrender.com/filter-balance?${params.toString()}`
      );
      const result2 = await response2.json();
      setTotalIncome(result2.totalIncome);
      setTotalExpense(result2.totalExpense);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchFilteredData();
    setButtonclicked(false);
  };

  const handleUpdate = (id) => {
    axios
      .post("https://wallet-app-u6wd.onrender.com/get_single_record", {
        id: id,
      })
      .then((res) => {
        //   console.log(res.data);
        const date = new Date(res.data.transac_date);
        const adjustedDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        const correctedData = {
          ...res.data,
          transac_date: adjustedDate.toLocaleDateString("en-CA").split("T")[0],
        };
        navigate("/update_record", { state: correctedData, update: true });
        //   console.log("hi");
      });
  };

  const resetFilter = () => {
    setStartDate(oneMonthAgoDate);
    setEndDate(currentDate);
    setCategory("");
    setAccount("");
    setButtonclicked(true);
  };

  useEffect(() => {
    fetchFilteredData();
  }, [buttonClicked]);

  const monthDateFormat = (date) => {
    var newDate = new Date(date);
    var mm = String(newDate.getMonth()).padStart(2, "0");
    var dd = String(newDate.getDate());
    var month = months[parseInt(mm, 10)];
    return month.substring(0, 3) + " " + dd;
  };

  return (
    <div
      style={{
        margin: "60px 0px",
        // padding: "10px",
        position: "relative",
      }}
    >
      <h2 style={{ padding: "10px" }}>Filter Records</h2>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", position: "relative" }}
      >
        <div
          className="d-flex justify-content-evenly mb-1 rounded"
          style={{
            width: "90%",
            left: "50%",
            transform: "translateX(4%)",
            border: "#0096FF solid 2px",
          }}
        >
          <div className="form-group">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control-sm border-0"
              style={{ backgroundColor: "white" }}
            />
          </div>
          <span
            style={{
              backgroundColor: "#0096FF",
              width: "50px",
              color: "white",
              textAlign: "center",
            }}
          >
            -
          </span>
          <div className="form-group">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control-sm border-0"
              style={{ backgroundColor: "white" }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center mb-3 mt-3 gap-0">
          {/* <div className="form-group d-flex flex-column"> */}
          <label htmlFor="category" style={{ fontSize: "13px", color: "grey" }}>
            Category:
          </label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            style={{
              width: "100px",
              fontSize: "12px",
              border: "none",
              borderBottom: "grey solid 1px",
              backgroundColor: "white",
            }}
            // className="form-control-sm"
          >
            <option value="">Select All</option>
            {options.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          {/* </div> */}
          {/* <div className="form-group d-flex flex-column"> */}
          <label
            htmlFor="account"
            style={{ fontSize: "13px", color: "grey", marginLeft: "10px" }}
          >
            Account:
          </label>
          <select
            name="account"
            id="account"
            value={account}
            onChange={(e) => {
              setAccount(e.target.value);
            }}
            // className="form-control-sm"
            style={{
              width: "100px",
              fontSize: "12px",
              border: "none",
              borderBottom: "grey solid 1px",
              backgroundColor: "white",
            }}
          >
            <option value="">Select All</option>
            <option value="savings account">Savings Acc.</option>
            <option value="cash">Cash</option>
          </select>
          {/* </div> */}
        </div>
        <div className="d-flex flex-column justify-content-start align-items-center">
          <input
            type="submit"
            value="Apply Filter"
            className="btn btn-secondary btn-sm"
          />
          <span
            onClick={resetFilter}
            style={{ cursor: "pointer", color: "grey", fontSize: "small" }}
          >
            Reset fiter
          </span>
        </div>
      </form>
      {isLoading ? (
        <p
          style={{
            position: "relative",
            // top: "50%",
            // left: "50%",
            // transform: "translate(-50%,-50%)",
            textAlign: "center",
            color: "grey",
          }}
        >
          <span className="spinner-border" role="status"></span>

          <span style={{ fontSize: "27px", paddingLeft: "10px" }}>
            Loading...
          </span>
        </p>
      ) : data.length ? (
        <div style={{ position: "relative" }}>
          <div
            className="d-flex justify-content-between mb-2 mt-6 sticky-div"
            style={{
              padding: "5px 10px",
              margin: "0",
              // borderBottom: "2px solid grey",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="d-flex flex-column">
              <p className="mb-1 text-secondary">Total Income</p>
              <p className="mb-0 fw-bold text-success">
                ₹{formatToINS(totalIncome)}
              </p>
            </div>
            <div className="d-flex flex-column align-items-end">
              <p className="mb-1 text-secondary">Total Expense</p>
              <p className="mb-0 fw-bold text-danger">
                -₹{formatToINS(totalExpense)}
              </p>
            </div>
          </div>
          <ul className="list-unstyled" style={{ padding: "10px" }}>
            {data.map((i, index) => {
              const date = new Date(i.transac_date);
              const adjustedDate = new Date(
                date.getTime() - date.getTimezoneOffset() * 60000
              );
              return (
                <div key={index}>
                  <li
                    className="border-bottom"
                    onClick={(e) => {
                      handleUpdate(i.id);
                    }}
                  >
                    <div className="d-flex justify-content-between mb-3 mt-3 gap-3">
                      <div className="d-flex gap-3">
                        <span
                          className="rounded-circle d-flex justify-content-center align-items-center"
                          style={{
                            color: "white",
                            backgroundColor: categoryColor[i.category],
                            width: "45px",
                            height: "45px",
                            fontSize: "25px",
                          }}
                        >
                          {categoryIcons[i.category] || <FaQuestion />}
                        </span>
                        <div className="d-flex flex-column align-items-start">
                          <p
                            className="p-0 mb-0"
                            style={{ fontWeight: "bold", fontSize: "large" }}
                          >
                            {i.category}
                          </p>
                          <p className="p-0 mb-0 text-muted">{i.account}</p>
                          {i.note ? (
                            <p className="p-0 mb-0 text-muted">"{i.note}"</p>
                          ) : (
                            <span></span>
                          )}
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <p
                          className="p-0 mb-0"
                          style={
                            i.transac_type === "expense"
                              ? { color: "red", fontWeight: "bold" }
                              : { color: "green", fontWeight: "bold" }
                          }
                        >
                          {i.transac_type === "expense" ? "-" : ""}₹
                          {formatToINS(i.amount)}
                        </p>
                        <p className="p-0 mb-0 text-muted">
                          {monthDateFormat(
                            adjustedDate
                              .toLocaleDateString("en-CA")
                              .split("T")[0]
                          )}
                        </p>
                      </div>
                    </div>
                  </li>
                </div>
              );
            })}
          </ul>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            // top: "50%",
            // left: "50%",
            // transform: "translate(-50%,-50%)",
            textAlign: "center",
            color: "lightgray",
          }}
        >
          <i
            className="bi bi-database-fill-x"
            style={{
              fontSize: "100px",
            }}
          ></i>
          <p>No Data Found</p>
        </div>
      )}
    </div>
  );
};

export default FilterRecords;
