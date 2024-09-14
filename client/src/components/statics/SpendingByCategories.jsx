import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { categoryColor, formatToINS } from "../allExports";
import "bootstrap/dist/css/bootstrap.css";

const CategoryPieChart = ({ data }) => {
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

  const totalAmount = data.reduce(
    (acc, entry) => acc + parseFloat(entry.amount),
    0
  );

  const chartWidth = 300; // Chart width
  const chartHeight = 450; // Chart height
  const centerX = chartWidth / 2; // X position of center
  const centerY = chartHeight / 2; // Y position of center
  const innerRadius = 80; // Inner radius size for centering text
  const outerRadius = 130; // Outer radius size

  return (
    <div>
      <p style={{ color: "#666", margin: "0px", fontSize: "15px" }}>
        THIS MONTH
      </p>
      <span style={{ fontSize: "20px" }}>₹{formatToINS(totalAmount)}</span>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <PieChart
          width={chartWidth}
          height={chartHeight}
          margin={{ top: 0, right: 20, bottom: 0, left: 20 }}
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
                fill={categoryColor[entry.name] || "#CCCCCC"}
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
              style={{ fontSize: "16px", fontSize: "20px" }}
            >
              {selectedCategory ? selectedCategory.name : "All"}
            </text>
            <text
              x={centerX}
              y={centerY - 65}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: "18px", fill: "#666" }}
            >
              ₹
              {selectedCategory
                ? formatToINS(selectedCategory.amount)
                : formatToINS(totalAmount.toFixed(2))}
            </text>
          </>
        </PieChart>
      </div>
    </div>
  );
};

export default CategoryPieChart;
