import Balance from "./Balance";
import LastFiveRecords from "./LastFiveRecords";

const Home = () => {
  return (
    <div style={{ position: "relative" }}>
      <Balance />
      <LastFiveRecords />
      <p style={{ textAlign: "center", color: "grey", marginTop: "20px" }}>
        Made with <span style={{ color: "#e25555" }}>♥</span> by Shikhar
      </p>
    </div>
  );
};

export default Home;
