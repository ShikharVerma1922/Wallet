import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "client/build")));

const corsOptions = {
  origin: "https://wallet-pb1u.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  res.send("Welcome to the Wallet App API");
});

app.get("/get_balance", async (req, res) => {
  const { account } = req.query;
  try {
    let query =
      "SELECT SUM(amount) AS total_amount FROM records WHERE transac_type = $1";
    let result, result_2;
    if (account === "select all") {
      result = await pool.query(query, ["income"]);
      result_2 = await pool.query(query, ["expense"]);
    } else {
      query += " AND account = $2";
      result = await pool.query(query, ["income", account]);
      result_2 = await pool.query(query, ["expense", account]);
    }

    const totalIncome = result.rows[0].total_amount || 0;
    const totalExpense = result_2.rows[0].total_amount || 0;
    res.json({ totalIncome, totalExpense });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/view_records", async (req, res) => {
  const { datePattern, category } = req.query;
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

    const result = await pool.query(query, queryParams);
    const income = await pool.query(amountQuery, ["income", ...queryParams]);
    const expense = await pool.query(amountQuery, ["expense", ...queryParams]);
    const totalIncome = income.rows[0].total_amount || 0;
    const totalExpense = expense.rows[0].total_amount || 0;
    res.json({ rows: result.rows, totalIncome, totalExpense });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/insert_record", async (req, res) => {
  const details = req.body.record;
  try {
    await pool.query(
      "INSERT INTO records(transac_type,category,account,amount,transac_date,note,transac_time) VALUES($1, $2, $3, $4, $5, $6, $7)",
      [...details]
    );
    res.status(200).send("Successful");
  } catch (err) {
    res.status(500).send("Unsuccessful");
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.id;
  try {
    await pool.query("DELETE FROM records WHERE ID= $1", [id]);
    res.status(200).send("Record deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Unsuccessful");
  }
});

app.post("/get_single_record", async (req, res) => {
  const id = req.body.id;
  try {
    const result = await pool.query("SELECT * FROM records WHERE id= $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("error", err.stack);
    res.status(500).send("Server Error");
  }
});

app.post("/update", async (req, res) => {
  const details = req.body.record;
  try {
    await pool.query(
      "UPDATE records SET transac_type = $1, category = $2, account = $3, amount = $4, transac_date = $5, note = $6, transac_time = $7 WHERE id = $8",
      [...details]
    );
    res.status(200).send("Successful");
  } catch (err) {
    res.status(500).send("Unsuccessful");
  }
});

app.get("/filter-record", async (req, res) => {
  const { startDate, endDate, category, account } = req.query;
  try {
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
    const result = await pool.query(
      `${query} ORDER BY transac_date DESC, transac_time DESC`,
      queryParams
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/filter-balance", async (req, res) => {
  const { startDate, endDate, category, account } = req.query;
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
    const result = await pool.query(incomeQuery, queryParams);
    const result_2 = await pool.query(expenseQuery, queryParams);
    const totalIncome = result.rows[0].total_amount || 0;
    const totalExpense = result_2.rows[0].total_amount || 0;
    res.json({ totalIncome, totalExpense });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
