import React, { useState, useEffect, useRef } from "react";
import { categoryList, oneMonthAgoDate, currentDate } from "./allExports";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { months } from "./allExports";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

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

  const fetchFilteredData = async () => {
    try {
      const params = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(category && { category }),
        ...(account && { account }),
      });

      const response = await fetch(
        `http://localhost:3000/filter-record?${params.toString()}`
      );
      const result = await response.json();
      setData(result);

      const response2 = await fetch(
        `http://localhost:3000/filter-balance?${params.toString()}`
      );
      const result2 = await response2.json();
      setTotalIncome(result2.totalIncome);
      setTotalExpense(result2.totalExpense);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
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
      .post("http://localhost:3000/get_single_record", { id: id })
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
    var mm = String(newDate.getMonth() + 1).padStart(2, "0");
    var dd = String(newDate.getDate());
    var month = months[parseInt(mm, 10)];
    return month.substring(0, 3) + " " + dd;
  };

  return (
    <div style={{ marginTop: "60px", margin: "60px 10px 0px 10px" }}>
      <h2>Filter Records</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div className="d-flex justify-content-evenly mb-1">
          <div className="form-group d-flex flex-column">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control-sm"
            />
          </div>
          <div className="form-group d-flex flex-column">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control-sm"
            />
          </div>
        </div>
        <div className="d-flex justify-content-evenly mb-3">
          <div className="form-group d-flex flex-column">
            <label htmlFor="category">Category:</label>
            <select
              name="category"
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              style={{ width: "fit-content" }}
              className="form-control-sm"
            >
              <option value="">Select All</option>
              {options.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group d-flex flex-column">
            <label htmlFor="account">Account:</label>
            <select
              name="account"
              id="account"
              value={account}
              onChange={(e) => {
                setAccount(e.target.value);
              }}
              className="form-control-sm"
              style={{ width: "fit-content" }}
            >
              <option value="">Select All</option>
              <option value="savings account">Savings Acc.</option>
              <option value="cash">Cash</option>
            </select>
          </div>
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
      {data.length ? (
        <div>
          <div
            className="d-flex justify-content-between mb-2 mt-2"
            style={{ margin: "5px 10px", borderBottom: "2px solid grey" }}
          >
            <div className="d-flex flex-column">
              <p className="mb-1 text-secondary">Total Income</p>
              <p className="mb-0 fw-bold text-success">₹{totalIncome}</p>
            </div>
            <div className="d-flex flex-column align-items-end">
              <p className="mb-1 text-secondary">Total Expense</p>
              <p className="mb-0 fw-bold text-danger">-₹{totalExpense}</p>
            </div>
          </div>
          <ul className="list-unstyled">
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
                    <div className="d-flex justify-content-between mb-3 ">
                      <div className="d-flex flex-column align-items-start">
                        <p
                          className="p-0 mb-0"
                          style={{ fontWeight: "bold", fontSize: "large" }}
                        >
                          {i.category}
                        </p>
                        <p className="p-0 mb-0 text-muted">{i.account}</p>
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
                          {i.transac_type === "expense" ? "-" : ""}₹{i.amount}
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
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            color: "lightgray",
          }}
        >
          <i
            class="bi bi-database-fill-x"
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
