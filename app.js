//[引用之套件]
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
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

//handlebars 樣板引擎設定
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//[路由區]--------------------------------------
app.get("/todos", (req, res) => {
  //顯示首頁

  Todo.find((err, todo) => {
    res.render("index", { todos: todo });
  });
});

app.get("/todos/new", (req, res) => {
  //顯示新增頁面 | 使用get-req.query.name 抓值 - 丟給model 建立參數
  res.send("這是 todo 新增頁面");
});
app.get("/todos/:id", (req, res) => {
  //檢視單一todo資料
  res.send("檢視單一 todo 資料");
});

app.get("/todos/:id/edit", (req, res) => {
  //檢視-單一todo資料 編輯頁
  res.send("檢視-單一todo資料 編輯頁");
});

app.post("/todos/:id/edit", (req, res) => {
  //編輯 單一todo資料
  res.send("編輯 單一todo資料");
});

app.post("/todos/:id/delete", (req, res) => {
  //刪除單一todo 資料
  res.send("刪除單一todo 資料");
});
