import React, { useEffect, useState } from "react";
import CategoryPieChart from "./statics/SpendingByCategories";
import { useNavigate, useLocation } from "react-router-dom";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TotalExpensePiechart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [datePattern, setDatePattern] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}%`
  );
  const location = useLocation();

  const expenseByCategory = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        ...(datePattern && { datePattern }),
      });
      const response = await fetch(
        `https://wallet-app-u6wd.onrender.com/expense_by_category?${params.toString()}`
      );
      const datar = await response.json();
      const formattedData = datar.map((item) => ({
        name: item.name,
        amount: parseFloat(item.amount) || 0, // Convert string to number, default to 0 if invalid
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    expenseByCategory();
    location.chart = false;
  }, [location.chart]);

  return (
    <div
      style={{
        // margin: "10px",
        maxWidth: "600px",
        // maxHeight: "400px",
        // width: "100%",
        borderRadius: "5px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.4)",
        padding: "10px",
      }}
    >
      <h3>Spending by Categories</h3>
      {/* <p style={{ color: "#666" }}>This Month</p> */}
      {isLoading ? (
        <>
          <p
            style={{
              position: "relative",
              textAlign: "center",
              color: "grey",
            }}
          >
            <span className="spinner-border" role="status"></span>

            <span style={{ fontSize: "27px", paddingLeft: "10px" }}>
              Loading...
            </span>
          </p>
        </>
      ) : data.length ? (
        <CategoryPieChart data={data} />
      ) : (
        <div
          style={{
            position: "relative",
            textAlign: "center",
            color: "lightgray",
          }}
        >
          <i
            className="bi bi-database-fill-x"
            style={{
              fontSize: "50px",
            }}
          ></i>
          <p>No Data Found</p>
        </div>
      )}
    </div>
  );
};

export default TotalExpensePiechart;
