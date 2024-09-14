import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { categoryList, currentDate, currentTime } from "./allExports";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";

const RecordDetail = (props) => {
  const location = useLocation();
  const [type, setType] = useState(
    props.new ? "expense" : location.state.transac_type
  );
  const [category, setCategory] = useState(
    props.new ? categoryList[0] : location.state.category
  );
  const [options] = useState(categoryList);
  const [account, setAccount] = useState(
    props.new ? "savings account" : location.state.account
  );
  const [amount, setAmount] = useState(props.new ? "" : location.state.amount);
  const [date, setDate] = useState(
    props.new ? currentDate : location.state.transac_date
  );
  const [time, setTime] = useState(
    props.new ? currentTime : location.state.transac_time
  );
  const [note, setNote] = useState(props.new ? undefined : location.state.note);
  const naviagate = useNavigate();

  // insert new record or update existing record
  const handleSubmit = (e) => {
    e.preventDefault();
    const record = [
      type,
      category,
      account,
      parseFloat(amount),
      date,
      note,
      time,
    ];
    if (!props.new) record.push(location.state.id);
    if (props.new || confirm("Confirm to update")) {
      console.log(record);

      axios
        .post(
          props.new
            ? "https://wallet-app-u6wd.onrender.com/insert_record"
            : "https://wallet-app-u6wd.onrender.com/update",
          {
            record: record,
          }
        )
        .then((res) => {
          // alert(res.data);
        })
        .catch((error) => {
          alert("Unsuccesful");
        });

      naviagate("/", { state: true });
    }
  };

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        handleSubmit();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // deletes record of specified id
  const handleDelete = (id) => {
    if (confirm("Confirm to permanently delete")) {
      axios
        .post("https://wallet-app-u6wd.onrender.com/delete", {
          id: id,
        })
        .then((res) => {});
      naviagate("/", { state: true });
    } else {
    }
  };

  return (
    <div className="container-add">
      <form
        action="/insert_record"
        className="d-flex flex-column gap-3"
        onSubmit={handleSubmit}
      >
        <div className="d-flex justify-content-between mb-2">
          {/* <input
            type="submit"
            className="btn btn-success"
            value={props.new ? "Add Record" : "Update"}
          /> */}

          <button
            type="button"
            className="btn btn-secondary"
            value="Cancel"
            onClick={() => {
              history.back();
            }}
          >
            <b>
              <i className="bi bi-x-lg" style={{ fontWeight: "bold" }}></i>
            </b>
          </button>

          <div className="d-flex gap-4">
            {!props.new ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={(e) => {
                  handleDelete(location.state.id);
                }}
              >
                <i className="bi bi-trash"></i>
              </button>
            ) : (
              ""
            )}

            <button
              type="submit"
              className="btn btn-success"
              value={props.new ? "Add Record" : "Update"}
            >
              <i className="bi bi-check2"></i>
            </button>
          </div>
        </div>
        {/* transaction type */}

        <div
          className="btn-group"
          role="group"
          aria-label="Basic radio toggle button group"
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio1"
            autoComplete="off"
            value="income"
            onChange={(e) => {
              setType(e.target.value);
            }}
            checked={type === "income"}
          />
          <label className="btn btn-outline-primary" htmlFor="btnradio1">
            Income
          </label>

          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio2"
            autoComplete="off"
            value="expense"
            onChange={(e) => {
              setType(e.target.value);
            }}
            checked={type === "expense"}
          />
          <label className="btn btn-outline-primary" htmlFor="btnradio2">
            Expense
          </label>

          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio3"
            autoComplete="off"
            value="transfer"
            onChange={(e) => {
              setType(e.target.value);
            }}
            checked={type === "transfer"}
          />
          <label className="btn btn-outline-primary" htmlFor="btnradio3">
            Transfer
          </label>
        </div>
        {/* category */}
        <div className="form-group">
          <label htmlFor="category" style={{ color: "grey", fontSize: "13px" }}>
            Category
          </label>
          <select
            name="category"
            className="form-select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            required
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {/* account */}
        <div className="form-group">
          <label htmlFor="account" style={{ color: "grey", fontSize: "13px" }}>
            Account
          </label>
          <select
            name="account"
            className="form-select"
            value={account}
            onChange={(e) => {
              setAccount(e.target.value);
            }}
            required
          >
            <option value="savings account">Savings Acc.</option>
            <option value="cash">Cash</option>
          </select>
        </div>
        {/* amount */}
        <div className="form-group">
          <label htmlFor="amount" style={{ color: "grey", fontSize: "13px" }}>
            Amount
          </label>
          <div className="d-flex align-items-center form-control">
            <span>₹ </span>
            <input
              type="number"
              className="border-0"
              name="number"
              value={amount}
              placeholder="00.00"
              autoFocus="autofocus"
              step="any"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              required
            />
          </div>
        </div>
        {/* date */}
        <div className=" form-group row">
          <div className="col-6">
            <label
              htmlFor="transac_date"
              style={{ color: "grey", fontSize: "13px" }}
            >
              Date
            </label>
            <input
              type="date"
              className="form-control"
              name="transac_date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              required
            />
          </div>
          {/* time */}
          <div className="col-6">
            <label
              htmlFor="transac_time"
              style={{ color: "grey", fontSize: "13px" }}
            >
              Time
            </label>
            <input
              type="time"
              className="form-control"
              name="transac_time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
              }}
              required
            />
          </div>
        </div>
        {/* note */}
        <div className="from-group">
          <label htmlFor="note" style={{ color: "grey", fontSize: "13px" }}>
            Note
          </label>
          <textarea
            name="note"
            className="form-control"
            onChange={(e) => {
              setNote(e.target.value);
            }}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default RecordDetail;
