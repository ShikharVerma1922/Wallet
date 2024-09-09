import Balance from "./Balance";
import LastFiveRecords from "./LastFiveRecords";

const Home = () => {
  return (
    <>
      <Balance />
      <LastFiveRecords />
      <p style={{ textAlign: "center" }}>
        Made with <span style={{ color: "#e25555" }}>♥</span> by Shikhar
      </p>
    </>
  );
};

export default Home;
