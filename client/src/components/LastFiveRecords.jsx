import React, { useEffect, useState } from "react";
import {
  oneMonthAgoDate,
  currentDate,
  months,
  categoryColor,
  formatToINS,
} from "./allExports";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../app.css";
import "bootstrap/dist/css/bootstrap.css";
import { MdFastfood, MdSubscriptions } from "react-icons/md";
import { GiMilkCarton, GiHouseKeys } from "react-icons/gi";
import {
  FaBus,
  FaCar,
  FaCoins,
  FaGift,
  FaPhoneAlt,
  FaQuestion,
  FaShoppingBag,
} from "react-icons/fa";
import { RiStockFill } from "react-icons/ri";

let categoryIcons = {
  "Food & Drinks": <MdFastfood />,
  Groceries: <GiMilkCarton />,
  Shopping: <FaShoppingBag />,
  Transportation: <FaBus />,
  Vehicle: <FaCar />,
  Entertainment: <MdSubscriptions />,
  Internet: <FaPhoneAlt />,
  Rent: <GiHouseKeys />,
  Investment: <RiStockFill />,
  Wage: <FaCoins />,
  Gifts: <FaGift />,
};

const LastFiveRecords = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // fetch data of last 30 days
  const fetchFilteredData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        ...(oneMonthAgoDate && { oneMonthAgoDate }),
        ...(currentDate && { currentDate }),
      });

      const response = await fetch(
        `https://wallet-app-u6wd.onrender.com/filter-record?${params.toString()}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // render data on mount
  useEffect(() => {
    fetchFilteredData();
    location.state = false;
  }, [location.state]);

  // navigate to /update_record with a specific id
  const handleUpdate = (id) => {
    axios
      .post("https://wallet-app-u6wd.onrender.com/get_single_record", {
        id: id,
      })
      .then((res) => {
        //   console.log(res.data);
        const date = new Date(res.data.transac_date);
        const adjustedDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        const correctedData = {
          ...res.data,
          transac_date: adjustedDate.toLocaleDateString("en-CA").split("T")[0],
        };
        console.log("navigated to update_record");

        navigate("/update_record", { state: correctedData, update: true });
        //   console.log("hi");
      });
  };

  const monthDateFormat = (date) => {
    var newDate = new Date(date);
    var mm = String(newDate.getMonth()).padStart(2, "0");
    var dd = String(newDate.getDate());
    var month = months[parseInt(mm, 10)];
    return month.substring(0, 3) + " " + dd;
  };

  return (
    <div
      style={{
        position: "relative",
        margin: "10px",
        padding: "10px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.4)",
        borderRadius: "5px",
      }}
    >
      <h2>Last records overview</h2>
      <p className="text-secondary">LAST 30 DAYS</p>
      {isLoading ? (
        <>
          <p
            style={{
              position: "relative",
              // position: "absolute",
              // left: "50%",
              // transform: "translateX(-50%)",
              textAlign: "center",
              color: "grey",
            }}
          >
            <span className="spinner-border" role="status"></span>

            <span style={{ fontSize: "27px", paddingLeft: "10px" }}>
              Loading...
            </span>
          </p>
        </>
      ) : data.length ? (
        <ul className="list-unstyled">
          {data.slice(0, 5).map((i, index) => {
            const date = new Date(i.transac_date);
            const adjustedDate = new Date(
              date.getTime() - date.getTimezoneOffset() * 60000
            );

            return (
              <div key={index}>
                <li
                  className="border-bottom"
                  onClick={(e) => {
                    handleUpdate(i.id);
                  }}
                >
                  <div className="d-flex justify-content-between mb-3 mt-3 gap-3">
                    <div className="d-flex gap-3">
                      <span
                        className="rounded-circle d-flex justify-content-center align-items-center"
                        style={{
                          color: "white",
                          backgroundColor: categoryColor[i.category],
                          width: "45px",
                          height: "45px",
                          fontSize: "25px",
                        }}
                      >
                        {categoryIcons[i.category] || <FaQuestion />}
                      </span>
                      <div className="d-flex flex-column align-items-start">
                        <p
                          className="p-0 mb-0"
                          style={{ fontWeight: "bold", fontSize: "large" }}
                        >
                          {i.category}
                        </p>
                        <p className="p-0 mb-0 text-muted">{i.account}</p>
                        {i.note ? (
                          <p className="p-0 mb-0 text-muted">"{i.note}"</p>
                        ) : (
                          <span></span>
                        )}
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-end">
                      <p
                        className="p-0 mb-0"
                        style={
                          i.transac_type === "expense"
                            ? { color: "red", fontWeight: "bold" }
                            : { color: "green", fontWeight: "bold" }
                        }
                      >
                        {i.transac_type === "expense" ? "-" : ""}₹
                        {formatToINS(i.amount)}
                      </p>
                      <p className="p-0 mb-0 text-muted">
                        {monthDateFormat(
                          adjustedDate.toLocaleDateString("en-CA").split("T")[0]
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              </div>
            );
          })}

          <span
            onClick={(e) => {
              navigate("/records");
            }}
            className="text-primary"
            style={{ fontWeight: "bold", cursor: "pointer" }}
          >
            SHOW MORE
          </span>
        </ul>
      ) : (
        <div
          style={{
            position: "relative",
            textAlign: "center",
            color: "lightgray",
          }}
        >
          <i
            className="bi bi-database-fill-x"
            style={{
              fontSize: "50px",
            }}
          ></i>
          <p>No Data Found</p>
        </div>
      )}
    </div>
  );
};

export default LastFiveRecords;
