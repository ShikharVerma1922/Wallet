import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { categoryList, currentDate, currentTime } from "../allExports";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Add.css";

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

      history.back();
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
        .delete("hhttps://wallet-app-u6wd.onrender.com/delete", {
          id: id,
        })
        .then((res) => {});
      history.back();
    } else {
    }
  };

  return (
    <div className="container">
      <h1>Enter Details</h1>
      <form action="/insert_record" onSubmit={handleSubmit}>
        {/* transaction type */}

        <div
          className="btn-group"
          role="group"
          aria-label="Basic radio toggle button group"
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
          <label htmlFor="category">Category</label>
          <select
            name="category"
            className="form-control"
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
          <label htmlFor="account">Account</label>
          <select
            name="account"
            className="form-control"
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
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            className="form-control"
            name="number"
            value={amount}
            placeholder="Rs 00.00"
            autoFocus="autofocus"
            step="any"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            required
          />
        </div>
        {/* date */}
        <div className=" form-group row">
          <div className="col-6">
            <label htmlFor="transac_date">Date</label>
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
            <label htmlFor="transac_time">Time</label>
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
          <label htmlFor="note">Note</label>
          <textarea
            name="note"
            className="form-control"
            onChange={(e) => {
              setNote(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="d-flex justify-content-around mt-4">
          <input
            type="submit"
            className="btn btn-success"
            value={props.new ? "Add Record" : "Update"}
          />

          <button
            type="button"
            className="btn btn-secondary"
            value="Cancel"
            onClick={() => {
              history.back();
            }}
          >
            <i className="bi bi-x-circle"></i> Cancel
          </button>
          {!props.new ? (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={(e) => {
                handleDelete(location.state.id);
              }}
            >
              <i className="bi bi-trash"></i> Delete
            </button>
          ) : (
            ""
          )}
        </div>
      </form>
    </div>
  );
};

export default RecordDetail;
