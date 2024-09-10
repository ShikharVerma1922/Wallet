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
  const [savingsAccBalance, setSavingsAccBalance] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);

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

  const getAccountBalance = async () => {
    try {
      const response = await fetch(
        `https://wallet-app-u6wd.onrender.com/get_balance?savings%20account}`
      );
      const data = await response.json();
      setSavingsAccBalance(data.totalIncome - data.totalExpense);
      const response2 = await fetch(
        `https://wallet-app-u6wd.onrender.com/get_balance?cash}`
      );
      const data2 = await response2.json();
      setCashBalance(data2.totalIncome - data2.totalExpense);
    } catch (error) {
      console.error("Error fetching total income:", error);
    }
  };

  // Fetch total income when the component mounts
  useEffect(() => {
    totalBalance();
    getAccountBalance();
    location.state = false;
  }, [account, location.state]);

  const hanbleClick = (buttonNum) => {
    setActiveButton(buttonNum);
  };

  return (
    <div
      style={{
        margin: "70px 10px 0px 10px",
        borderBottom: "5px solid grey",
      }}
    >
      <h5 className="mb-3">List of accounts</h5>
      <div className="d-flex flex-column align-items-center mb-3">
        <div className="container">
          <div className="row gap-2">
            <button
              className={`btn ${
                activeButton === 1 || activeButton === 3
                  ? "btn-primary"
                  : "btn-secondary"
              } d-flex flex-column p-1 col`}
              onClick={(e) => {
                setAccount("savings account");
                hanbleClick(1);
              }}
            >
              <span style={{ color: "lightgrey", fontSize: "small" }}>
                Savings Account
              </span>
              <span>{savingsAccBalance}</span>
            </button>
            <button
              className={`btn ${
                activeButton === 2 || activeButton === 3
                  ? "btn-danger"
                  : "btn-secondary"
              } d-flex flex-column p-1 col`}
              onClick={(e) => {
                setAccount("cash");
                hanbleClick(2);
              }}
            >
              <span style={{ color: "lightgrey", fontSize: "small" }}>
                Cash
              </span>
              <span>{cashBalance}</span>
            </button>
          </div>
        </div>
        {activeButton !== 3 ? (
          <span
            onClick={(e) => {
              setAccount("select all");
              setActiveButton(3);
            }}
            style={{
              cursor: "pointer",
              color: "#0096FF",
              marginTop: "10px",
              textDecoration: "underline",
            }}
          >
            Select all
          </span>
        ) : (
          <span></span>
        )}
      </div>
      <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
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
      </div>
    </div>
  );
}

export default Balance;
