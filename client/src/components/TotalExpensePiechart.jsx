import React, { useState } from "react";

const TotalExpensePiechart = () => {
  const [data, setData] = useState(null);

  const expenseByCategory = async () => {
    try {
      const response = await fetch();
      const data = await response.json();
    } catch (err) {}
    return <div></div>;
  };
};

export default TotalExpensePiechart;
