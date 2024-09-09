import express, { query } from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
const corsOptions = {
  origin: "https://wallet-pb1u.onrender.com", // Allow this origin
};

app.use(cors(corsOptions));

const connection = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
};

app.get("/get_balance", async (req, res) => {
  const { account } = req.query;
  const db = new pg.Client(connection);
  db.connect();
  try {
    let query =
      "SELECT SUM(amount) AS total_amount FROM records WHERE transac_type = $1";
    let result, result_2;
    if (account === "select all") {
      result = await db.query(query, ["income"]);
      result_2 = await db.query(query, ["expense"]);
    } else {
      query += " AND account = $2";
      result = await db.query(query, ["income", account]);
      result_2 = await db.query(query, ["expense", account]);
    }

    const totalIncome = result.rows[0].total_amount || 0; // Handle null if no data
    const totalExpense = result_2.rows[0].total_amount || 0;
    res.json({ totalIncome, totalExpense });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  } finally {
    db.end();
  }
});

app.get("/view_records", async (req, res) => {
  const { datePattern, category } = req.query;
  const db = new pg.Client(connection);

  try {
    let query = "select * from records where transac_date::text LIKE $1";
    let amountQuery =
      "SELECT SUM(amount) AS total_amount FROM records WHERE transac_type = $1 AND transac_date::text LIKE $2";
    const queryParams = [datePattern];
    if (category) {
      queryParams.push(category);
      query += ` AND category = $${queryParams.length}`;
      amountQuery += ` AND category = $3`;
    }
    query += " ORDER BY transac_date DESC, transac_time DESC";
    db.connect();
    // records
    const result = await db.query(query, queryParams);
    // amount
    const income = await db.query(amountQuery, ["income", ...queryParams]);
    const expense = await db.query(amountQuery, ["expense", ...queryParams]);
    const totalIncome = income.rows[0].total_amount || 0; // Handle null if no data
    const totalExpense = expense.rows[0].total_amount || 0;
    res.json({ rows: result.rows, totalIncome, totalExpense });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  } finally {
    db.end();
  }
});

app.post("/insert_record", (req, res) => {
  const details = req.body.record;
  const db = new pg.Client(connection);
  db.connect();
  db.query(
    "INSERT INTO records(transac_type,category,account,amount,transac_date,note,transac_time) VALUES($1, $2, $3, $4, $5, $6, $7)",
    [...details],
    (err, res_2) => {
      if (err) {
        res.status(500).send("Unsuccussful");
      } else {
        // showRecords();
        res.status(200).send("Succussful");
      }
      db.end();
    }
  );
});

app.post("/delete", (req, res) => {
  const id = req.body.id;
  const db = new pg.Client(connection);
  db.connect();
  db.query("DELETE FROM records WHERE ID= $1", [id], (err, res_2) => {
    if (err) {
      console.log(err);
    } else {
      //   showRecords();
    }
    db.end();
  });
});

app.post("/get_single_record", async (req, res) => {
  const id = req.body.id;
  const db = new pg.Client(connection);
  db.connect();
  db.query("SELECT * FROM records WHERE id= $1", [id], (err, res_2) => {
    if (err) {
      console.error("error", err.stack);
    } else {
      res.json(res_2.rows[0]);
    }
    db.end();
  });
});

app.post("/update", (req, res) => {
  const details = req.body.record;
  const db = new pg.Client(connection);
  db.connect();
  db.query(
    "UPDATE records SET transac_type = $1, category = $2, account = $3, amount = $4, transac_date = $5, note = $6, transac_time = $7 WHERE id = $8",
    [...details],
    (err, res_2) => {
      if (err) {
        res.status(500).send("Unsuccussful");
      } else {
        // showRecords();
        res.status(200).send("Succussful");
      }
      db.end();
    }
  );
});

app.get("/filter-record", async (req, res) => {
  const { startDate, endDate, category, account } = req.query;
  const db = new pg.Client(connection);

  try {
    // Build your SQL query with optional filters
    let query = "SELECT * FROM records WHERE 1=1";
    const queryParams = [];

    if (startDate) {
      queryParams.push(startDate);
      query += ` AND transac_date >= $${queryParams.length}`;
    }

    if (endDate) {
      queryParams.push(endDate);
      query += ` AND transac_date <= $${queryParams.length}`;
    }

    if (category) {
      queryParams.push(category);
      query += ` AND category = $${queryParams.length}`;
    }
    if (account) {
      queryParams.push(account);
      query += ` AND account = $${queryParams.length}`;
    }
    db.connect();
    const result = await db.query(
      `${query} ORDER BY transac_date DESC, transac_time DESC`,
      queryParams
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  } finally {
    db.end();
  }
});

app.get("/filter-balance", async (req, res) => {
  const { startDate, endDate, category, account } = req.query;
  const db = new pg.Client(connection);

  try {
    let incomeQuery =
      "SELECT SUM(amount) AS total_amount FROM records WHERE transac_type='income'";
    let expenseQuery =
      "SELECT SUM(amount) AS total_amount FROM records WHERE transac_type='expense'";
    const queryParams = [];
    if (category && category !== "Select All") {
      queryParams.push(category);
      incomeQuery += ` AND category = $${queryParams.length}`;
      expenseQuery += ` AND category = $${queryParams.length}`;
    }
    if (account && account !== "Select All") {
      queryParams.push(account);
      incomeQuery += ` AND account = $${queryParams.length}`;
      expenseQuery += ` AND account = $${queryParams.length}`;
    }

    if (startDate) {
      queryParams.push(startDate);
      incomeQuery += ` AND transac_date >= $${queryParams.length}`;
      expenseQuery += ` AND transac_date >= $${queryParams.length}`;
    }
    if (endDate) {
      queryParams.push(endDate);
      incomeQuery += ` AND transac_date <= $${queryParams.length}`;
      expenseQuery += ` AND transac_date <= $${queryParams.length}`;
    }
    db.connect();
    const result = await db.query(incomeQuery, queryParams);
    const result_2 = await db.query(expenseQuery, queryParams);
    const totalIncome = result.rows[0].total_amount || 0; // Handle null if no data
    const totalExpense = result_2.rows[0].total_amount || 0;
    res.json({ totalIncome, totalExpense });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  } finally {
    db.end();
  }
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
