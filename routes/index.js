//引入 express 使用 router | 引入必要model
const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");
// 載入 auth middleware
const { authenticated } = require("../config/auth");

//----------------------------------
//1.index - 顯示所有資料

// router.get("/", (req, res) => {
//   //顯示首頁
//   Todo.find()
//     .sort({ done: "desc" })
//     .exec((err, todo) => {
//       res.render("index", { todos: todo });
//     });
// });

// 加入 authenticated 驗證
router.get("/", authenticated, (req, res) => {
  Todo.find({ userId: req.user._id })
    .sort({ name: "asc" })
    .exec((err, todos) => {
      if (err) return console.error(err);
      return res.render("index", { todos: todos });
    });
});

//---------------------------
module.exports = router;
