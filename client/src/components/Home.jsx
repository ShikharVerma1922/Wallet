import Balance from "./Balance";
import LastFiveRecords from "./LastFiveRecords";
import TotalExpensePiechart from "./TotalExpensePiechart";
import "bootstrap/dist/css/bootstrap.css";

const Home = () => {
  const data = [
    { name: "Food & Drinks", amount: 1500 },
    { name: "Entertainment", amount: 500 },
    { name: "Transport", amount: 300 },
    { name: "Shopping", amount: 700 },
    { name: "Health", amount: 400 },
  ];

  return (
    <div style={{ position: "relative", padding: "5px" }}>
      <div style={{ maxWidth: "600px" }}>
        <Balance />
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <LastFiveRecords />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <TotalExpensePiechart />
          </div>
        </div>
      </div>

      <p style={{ textAlign: "center", color: "grey", marginTop: "20px" }}>
        Made with <span style={{ color: "#e25555" }}>♥</span> by Shikhar
      </p>
    </div>
  );
};

export default Home;
