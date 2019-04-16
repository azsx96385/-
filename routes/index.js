//引入 express 使用 router | 引入必要model
const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");

//----------------------------------
//1.index - 顯示所有資料
router.get("/", (req, res) => {
  //顯示首頁
  Todo.find()
    .sort({ done: "desc" })
    .exec((err, todo) => {
      res.render("index", { todos: todo });
    });
});

//---------------------------
module.exports = router;
