//1. 使用 express Router() | 必要Model
const express = require("express");
const router = express.Router();

//2. 輸入路由
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("login", (req, res) => {});
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", (req, res) => {});
router.get("/logout", (req, res) => {
  res.render("/login");
});

//3. 匯出router
module.exports = router;
