import React, { useEffect, useState } from "react";
import CategoryPieChart from "./statics/SpendingByCategories";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TotalExpensePiechart = () => {
  const [data, setData] = useState([]);

  const expenseByCategory = async () => {
    try {
      const response = await fetch(
        "https://wallet-app-u6wd.onrender.com/expense_by_category"
      );
      const datar = await response.json();
      const formattedData = datar.map((item) => ({
        name: item.name,
        amount: parseFloat(item.amount) || 0, // Convert string to number, default to 0 if invalid
      }));
      console.log(formattedData);

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    expenseByCategory();
  }, []);
  if (!data || data.length === 0) {
    return <div>Loading...</div>;
  }

  return <CategoryPieChart data={data} />;
};

export default TotalExpensePiechart;
