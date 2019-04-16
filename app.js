//[引用之套件]
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bdParser = require("body-parser");

//[model]
const Todo = require("./models/todo");

//---------------------------------------------------------------------------------------------
//[設定]express server 設定與啟用
const port = 3000;
const app = express();
app.listen(port, () => {
  console.log("hello world !!");
});

//[設定]mongoose 設定與啟用 | "mongodb://127.0.0.1/todo" [mongodb|位置|資料庫名稱]
mongoose.connect("mongodb://127.0.0.1/todo", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error!!");
});
db.once("open", () => {
  console.log("mongodb connected!!");
});

//[設定]handlebars 樣板引擎設定
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//[設定]啟用body parser
app.use(bdParser.urlencoded({ extended: true }));

//---------------------------------------------------------------------------------------------
//[路由區]--------------------------------------

//1.index - 顯示所有資料
app.get("/todos", (req, res) => {
  //顯示首頁
  Todo.find()
    .sort({ done: "desc" })
    .exec((err, todo) => {
      res.render("index", { todos: todo });
    });
});

//2.create - 新增一筆資料
app.get("/todos/new", (req, res) => {
  //顯示新增頁面 |
  res.render("show");
});
app.post("/todos", (req, res) => {
  //顯示新增頁面 | 使用get-req.query.name 抓值 - 丟給model 建立參數
  //Q create & save 有什麼不一樣

  let newTodo = req.body.todo;

  const todo = Todo({ name: newTodo });
  todo.save(err => {
    if (err) return console.log(err);
    return res.redirect("/todos");
  });
});

//3.檢視單一資料頁面
app.get("/todos/:id", (req, res) => {
  //檢視單一todo資料
  //研究一下-Model 的用法 findById()
  let id = req.params.id;
  Todo.findById(id, (err, todo) => {
    return res.render("detail", { todo: todo });
  });
});

//4.update 更新資料庫資料
app.get("/todos/:id/edit", (req, res) => {
  //檢視-單一todo資料 編輯頁
  let id = req.params.id;
  Todo.findById(id, (err, todo) => {
    return res.render("edit", { todo });
  });
});

app.post("/todos/:id/edit", (req, res) => {
  //編輯 單一todo資料

  id = req.params.id;
  Todo.findById(id, (err, todo) => {
    todo.name = req.body.name;
    todo.save(err => {});
    if (req.body.done) {
      todo.done = true;
    } else {
      todo.done = false;
    }
    return res.redirect("/todos/" + todo.id);
  });
});

//5.delete 刪除一筆資料
app.post("/todos/:id/delete", (req, res) => {
  //刪除單一todo 資料
  id = req.params.id;
  Todo.findById(id, (err, todo) => {
    todo.remove(err => {
      return res.redirect("/todos");
    });
  });
});
