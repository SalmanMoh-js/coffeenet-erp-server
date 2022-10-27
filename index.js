const express = require("express");
const path = require("path");
const cors = require("cors");
const mysql = require("mysql");
const config = require("config");
// const sql = require('mssql');

const app = express();

// Connect Database

// Init Middleware
app.use(express.json({ extended: false }));
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
const db = mysql.createConnection(config.get("db"));

// Connect
db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// const sqlconfig = {
//   server: '192.168.1.4',
//   user: 'saa',
//   password: 'saaadmin',
//   database: 'GSF',
//   options: {
//     trustServerCertificate: true,
//   },
// };
// sql
//   .connect(sqlconfig)
//   .then((pool) => {
//     console.log('Remote Connected');
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// Define Routes
app.use("/api/auth", require("./Routes/auth"));
app.use("/api/user", require("./Routes/user"));
app.use("/api/admin", require("./Routes/admin"));
app.use("/api/document", require("./Routes/document"));
// app.use('/api/sample', require('./Routes/sample'));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
