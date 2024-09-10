import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Balance() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [account, setAccount] = useState("select all");
  const [activeButton, setActiveButton] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const totalBalance = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        ...(account && { account }),
      });

      const response = await fetch(
        `https://wallet-app-u6wd.onrender.com/get_balance?${params.toString()}`
      );
      const data = await response.json();
      setTotalIncome(data.totalIncome);
      setTotalExpense(data.totalExpense);
    } catch (error) {
      console.error("Error fetching total income:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch total income when the component mounts
  useEffect(() => {
    totalBalance();
    location.state = false;
  }, [account, location.state]);

  const hanbleClick = (buttonNum) => {
    setActiveButton(buttonNum);
  };

  return (
    <div
      style={{
        margin: "60px 10px 0px 10px",
        borderBottom: "5px solid grey",
      }}
    >
      <h1>List of accounts</h1>
      <div className="d-flex flex-column align-items-center mb-1">
        <div className="d-flex justify-content-around">
          <button
            className={`btn ${
              activeButton === 1 || activeButton === 3
                ? "btn-primary"
                : "btn-secondary"
            }`}
            onClick={(e) => {
              setAccount("savings account");
              hanbleClick(1);
            }}
          >
            Savings Acc.
          </button>
          <button
            className={`btn ${
              activeButton === 2 || activeButton === 3
                ? "btn-danger"
                : "btn-secondary"
            }`}
            onClick={(e) => {
              setAccount("cash");
              hanbleClick(2);
            }}
          >
            Cash
          </button>
        </div>
        {activeButton !== 3 ? (
          <span
            onClick={(e) => {
              setAccount("select all");
              setActiveButton(3);
            }}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Select all
          </span>
        ) : (
          <span></span>
        )}
      </div>
      <span style={{ fontWeight: "bold" }}>
        Net Balance:{" "}
        {isLoading ? (
          <span style={{ color: "grey" }}>
            <span className="spinner-grow spinner-grow-sm" role="status"></span>
          </span>
        ) : (
          <span
            style={
              totalIncome - totalExpense < 0
                ? { color: "red" }
                : { color: "green" }
            }
          >
            Rs {(totalIncome - totalExpense).toFixed(2)}
          </span>
        )}
      </span>
    </div>
  );
}

export default Balance;
