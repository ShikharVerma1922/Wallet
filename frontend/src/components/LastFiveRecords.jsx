import React, { useEffect, useState } from "react";
import { oneMonthAgoDate, currentDate, months } from "./allExports";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";

const LastFiveRecords = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // fetch data of last 30 days
  const fetchFilteredData = async () => {
    try {
      const params = new URLSearchParams({
        ...(oneMonthAgoDate && { oneMonthAgoDate }),
        ...(currentDate && { currentDate }),
      });

      const response = await fetch(
        `http://localhost:3000/filter-record?${params.toString()}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  // render data on mount
  useEffect(() => {
    fetchFilteredData();
  }, []);

  // navigate to /update_record with a specific id
  const handleUpdate = (id) => {
    axios
      .post("http://localhost:3000/get_single_record", { id: id })
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
        navigate("/update_record", { state: correctedData, update: true });
        //   console.log("hi");
      });
  };

  const monthDateFormat = (date) => {
    var newDate = new Date(date);
    var mm = String(newDate.getMonth() + 1).padStart(2, "0");
    var dd = String(newDate.getDate());
    var month = months[parseInt(mm, 10)];
    return month.substring(0, 3) + " " + dd;
  };

  return (
    <div
      style={{
        margin: "10px",
        padding: "10px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.4)",
        borderRadius: "5px",
      }}
    >
      <h2>Last records overview</h2>
      <p className="text-secondary">LAST 30 DAYS</p>
      {data.length ? (
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
                  <div className="d-flex justify-content-between mb-3 ">
                    <div className="d-flex flex-column align-items-start">
                      <p
                        className="p-0 mb-0"
                        style={{ fontWeight: "bold", fontSize: "large" }}
                      >
                        {i.category}
                      </p>
                      <p className="p-0 mb-0 text-muted">{i.account}</p>
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
                        {i.transac_type === "expense" ? "-" : ""}₹{i.amount}
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
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            color: "lightgray",
          }}
        >
          <i
            class="bi bi-database-fill-x"
            style={{
              fontSize: "100px",
            }}
          ></i>
          <p>No Data Found</p>
        </div>
      )}
    </div>
  );
};

export default LastFiveRecords;
