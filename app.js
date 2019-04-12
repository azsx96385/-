//[引用之套件]
const express = require("express");
const mongoose = require("mongoose");
//[model]
const Todo = require("./models/todo");
//express server 設定與啟用
const port = 3000;
const app = express();
app.listen(port, () => {
  console.log("hello world !!");
});

//mongoose 設定與啟用 | "mongodb://127.0.0.1/todo" [mongodb|位置|資料庫名稱]
mongoose.connect("mongodb://127.0.0.1/todo", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error!!");
});
db.once("open", () => {
  console.log("mongodb connected!!");
});

app.get("/", (req, res) => {
  res.send("today is friday");
});
