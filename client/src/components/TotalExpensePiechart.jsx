import React, { useState } from "react";

const TotalExpensePiechart = () => {
  const [data, setData] = useState(null);

  const expenseByCategory = async () => {
    try {
      const response = await fetch(
        "https://wallet-app-u6wd.onrender.com/expense_by_category"
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching total income:", error);
    } finally {
      // setIsLoading(false);
    }
    return <div></div>;
  };
};

export default TotalExpensePiechart;
