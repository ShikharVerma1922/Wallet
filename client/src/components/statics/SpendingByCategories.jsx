import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const ExpenseDonutChart = ({ data }) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (data, index) => {
    if (activeIndex === index) {
      // If the same cell is clicked again, reset the selection
      setSelectedCategory(null);
      setActiveIndex(null);
    } else {
      // Otherwise, set the new selected category
      setSelectedCategory({ name: data.name, amount: data.amount });
      setActiveIndex(index);
    }
  };

  const totalAmount = data.reduce((acc, entry) => acc + entry.amount, 0);

  const chartWidth = 300; // Chart width
  const chartHeight = 500; // Chart height
  const centerX = chartWidth / 2; // X position of center
  const centerY = chartHeight / 2; // Y position of center
  const innerRadius = 80; // Inner radius size for centering text
  const outerRadius = 130; // Outer radius size

  return (
    <div style={{ textAlign: "center", margin: "10px" }}>
      <PieChart
        width={chartWidth}
        height={chartHeight}
        margin={{ top: 0, right: 20, bottom: 100, left: 20 }}
      >
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          labelLine={false}
          paddingAngle={1}
          label={(amount) => {
            `Rs${amount}`;
          }}
          onClick={handleClick}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              style={{ cursor: "pointer" }}
              stroke={index === activeIndex ? "#000" : "none"} // Optional: add border color for highlighted segment
              strokeWidth={index === activeIndex ? 4 : 0} // Optional: add border width for highlighted segment
            />
          ))}
        </Pie>
        {/* <Tooltip content={null} /> */}
        <Legend
          layout="horizontal"
          verticalAlign="bottom" // Position legend above the chart
          align="center"
          iconType="circle"
        />

        <>
          <text
            x={centerX}
            y={centerY - 90}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: "16px", fontWeight: "bold" }}
          >
            {selectedCategory ? selectedCategory.name : "All"}
          </text>
          <text
            x={centerX}
            y={centerY - 70}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: "14px", fontWeight: "normal", fill: "#888" }}
          >
            ₹{selectedCategory ? selectedCategory.amount : totalAmount}
          </text>
        </>
      </PieChart>
    </div>
  );
};

export default ExpenseDonutChart;
