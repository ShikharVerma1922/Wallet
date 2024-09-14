import Balance from "./Balance";
import LastFiveRecords from "./LastFiveRecords";
import ExpensePieChart from "./statics/SpendingByCategories";
import TotalExpensePiechart from "./TotalExpensePiechart";

const Home = () => {
  const data = [
    { name: "Food & Drinks", amount: 1500 },
    { name: "Entertainment", amount: 500 },
    { name: "Transport", amount: 300 },
    { name: "Shopping", amount: 700 },
    { name: "Health", amount: 400 },
  ];

  return (
    <div style={{ position: "relative" }}>
      <Balance />
      <LastFiveRecords />
      <TotalExpensePiechart />
      <p style={{ textAlign: "center", color: "grey", marginTop: "20px" }}>
        Made with <span style={{ color: "#e25555" }}>♥</span> by Shikhar
      </p>
    </div>
  );
};

export default Home;
