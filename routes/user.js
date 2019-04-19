//1. 使用 express Router() | 必要Model
const express = require("express");
const router = express.Router();
const passport = require("passport");
const userModel = require("../models/user");

//2. 輸入路由

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  // 使用 passport 認證
  passport.authenticate("local", {
    successRedirect: "/", // 登入成功會回到根目錄
    failureRedirect: "/users/login" // 失敗會留在原本頁面
  })(req, res, next);
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  //1.取得表單資料 | 解構賦值技巧
  const { name, email, password, confirm_password } = req.body;

  //2. 驗證資料庫是否已經有這筆資料 -email
  userModel.findOne({ email: email }).then(user => {
    if (user) {
      //3.1 使用者已經存在-返回註冊頁面
      console.log("使用者已存在，正在重新導向註冊頁面");
      res.render("register", { name, email, password, confirm_password });
    } else {
      //3.2 使用者不存在，建立資料並且導回首頁
      const newUser = new userModel({
        name,
        email,
        password,
        confirm_password
      }); //建立物件
      newUser
        .save()
        .then(user => {
          res.redirect("/");
        })
        .catch(err => console.log(err)); //存到資料庫-報錯
    }
  });
});
router.get("/logout", (req, res) => {
  res.render("/login");
});

//3. 匯出router
module.exports = router;
