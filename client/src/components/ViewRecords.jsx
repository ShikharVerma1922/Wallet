import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { categoryList, months } from "./allExports";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ViewRecords = () => {
  const [records, setRecords] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [datePattern, setDatePattern] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}%`
  );
  const [category, setCategory] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [options] = useState(categoryList);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // fetch data for a specified month
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        ...(datePattern && { datePattern }),
        ...(category && { category }),
      });
      const response = await fetch(
        `https://wallet-app-u6wd.onrender.com/view_records?${params.toString()}`
      );
      const jsonData = await response.json();
      setRecords(jsonData.rows);
      setTotalIncome(jsonData.totalIncome);
      setTotalExpense(jsonData.totalExpense);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // navigate to /update_record with a specific id
  const handleUpdate = (id) => {
    axios
      .post("https://wallet-app-u6wd.onrender.com/get_single_record", {
        id,
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
        console.log("hi");
      });
  };

  // return month name to da specific date
  const getMonthName = (date) => {
    return months[date.getMonth()];
  };

  // handle PreviousMonth button click
  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  // handle NextMonth button click
  const goToNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  // set date pattern to get specific month info when goTo## buttons clicked
  useEffect(() => {
    setDatePattern(
      `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}%`
    );
  }, [currentDate]);

  //renders records data when setDatePattern is called
  useEffect(() => {
    fetchData();
  }, [datePattern, category]);

  // to add arrow key listner
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "ArrowLeft") {
        goToPreviousMonth();
      } else if (event.key === "ArrowRight") {
        goToNextMonth();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const monthDateFormat = (date) => {
    var newDate = new Date(date);
    var mm = String(newDate.getMonth() + 1).padStart(2, "0");
    var dd = String(newDate.getDate());
    var month = months[parseInt(mm, 10)];
    return month.substring(0, 3) + " " + dd;
  };

  return (
    <div className="App" style={{ marginTop: "60px" }}>
      <div
        style={{
          position: "fixed",
          top: "46px",
          background: "white",
          width: "100%",
          marginTop: "10px",
          paddingTop: "10px",
        }}
      >
        <div className="d-flex justify-content-center">
          <div className="btn-group">
            <button onClick={goToPreviousMonth} className="btn btn-secondary">
              <i className="bi bi-caret-left-fill"></i>
            </button>
            <span className="btn btn-light fw-bold" style={{ width: "150px" }}>
              {getMonthName(currentDate).substring(0, 3)}{" "}
              {currentDate.getFullYear()}
            </span>
            <button onClick={goToNextMonth} className="btn btn-secondary">
              <i className="bi bi-caret-right-fill"></i>
            </button>
          </div>
        </div>

        <div
          className="d-flex justify-content-between mb-2"
          style={{ margin: "5px 10px" }}
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
        <form
          style={{
            margin: "0px 10px",
            padding: "10px",
            borderBottom: "2px solid grey",
          }}
          className="d-flex"
        >
          <label
            className="text-secondary"
            style={{ width: "fit-content", textAlign: "right" }}
          >
            Filter By Category :
          </label>

          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            className="form-control form-control-sm text-secondary"
            style={{ width: "fit-content" }}
          >
            <option value="">Select All</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </form>
      </div>
      <div style={{ margin: "230px 10px 0px 10px" }}>
        {isLoading ? (
          <p
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              color: "grey",
            }}
          >
            <span className="spinner-border" role="status"></span>

            <span style={{ fontSize: "27px", paddingLeft: "10px" }}>
              Loading...
            </span>
          </p>
        ) : records.length ? (
          <>
            <ul className="list-unstyled">
              {records.map((record, index) => {
                const date = new Date(record.transac_date);
                const adjustedDate = new Date(
                  date.getTime() - date.getTimezoneOffset() * 60000
                );

                return (
                  <div key={index}>
                    <li
                      className="border-bottom"
                      onClick={(e) => {
                        handleUpdate(record.id);
                      }}
                    >
                      <div className="d-flex justify-content-between mb-3 ">
                        <div className="d-flex flex-column align-items-start">
                          <p
                            className="p-0 mb-0"
                            style={{ fontWeight: "bold", fontSize: "large" }}
                          >
                            {record.category}
                          </p>
                          <p className="p-0 mb-0 text-muted">
                            {record.account}
                          </p>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <p
                            className="p-0 mb-0"
                            style={
                              record.transac_type === "expense"
                                ? { color: "red", fontWeight: "bold" }
                                : { color: "green", fontWeight: "bold" }
                            }
                          >
                            {record.transac_type === "expense" ? "-" : ""}₹
                            {record.amount}
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
          </>
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
              className="bi bi-database-fill-x"
              style={{
                fontSize: "100px",
              }}
            ></i>
            <p>No Data Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRecords;
