import { MdFastfood } from "react-icons/md";

export let categoryList = [
  "Food & Drinks",
  "Groceries",
  "Shopping",
  "Transportation",
  "Vehicle",
  "Internet",
  "Entertainment",
  "Investment",
  "Rent",
  "Wage",
  "Gifts",
];

export let categoryColor = {
  "Food & Drinks": "red",
  Groceries: "#FF474C",
  Shopping: "lightblue",
  Transportation: "grey",
  Vehicle: "purple",
  Entertainment: "lightgreen",
  Internet: "blue",
  Investment: "pink",
  Rent: "orange",
  Wage: "#9B870C",
  Gifts: "yellow",
};

var todaysDate = new Date();
var dd = String(todaysDate.getDate()).padStart(2, "0");
var mm = String(todaysDate.getMonth() + 1).padStart(2, "0");
var yyyy = todaysDate.getFullYear();

export var patternDate = yyyy + "-" + mm + "%";

export var currentDate = yyyy + "-" + mm + "-" + dd;

export var currentTime =
  String(todaysDate.getHours()).padStart(2, "0") +
  ":" +
  String(todaysDate.getMinutes()).padStart(2, "0") +
  ":" +
  String(todaysDate.getSeconds()).padStart(2, "0");

const today = new Date();
const oneMonthAgo = new Date(today);

// Adjust the month by subtracting 1
oneMonthAgo.setMonth(today.getMonth() - 1);

// Handle edge cases for months with different days
if (oneMonthAgo.getDate() !== today.getDate()) {
  oneMonthAgo.setDate(0); // Set to the last day of the previous month
}

export const oneMonthAgoDate = oneMonthAgo.toISOString().split("T")[0];

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const monthNum = mm;
export const monthName = months[parseInt(monthNum, 10) - 1];
