//1. 使用 express Router() | 必要Model
const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user");

// 載入 auth middleware
const { authenticated } = require("../config/auth");

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

  //1.1系統訊息建置
  let errorMessage = [];
  if (!name || !email || !password || !confirm_password) {
    errorMessage.push({ message: "每個欄位都是必填喔!!" });
  }
  if (password !== confirm_password) {
    errorMessage.push({ message: "確認密碼輸入有誤喔!!" });
  }

  if (errorMessage.length > 0) {
    res.render("register", {
      errorMessage,
      name,
      email,
      password,
      confirm_password
    });
  } else {
    //2. 驗證資料庫是否已經有這筆資料 -email
    userModel.findOne({ email: email }).then(user => {
      if (user) {
        //3.1 使用者已經存在-返回註冊頁面
        console.log("使用者已存在，正在重新導向註冊頁面");
        errorMessage.push({ message: "使用者已存在，請直接登入" });

        res.render("register", {
          errorMessage,
          name,
          email,
          password,
          confirm_password
        });
      } else {
        //3.2 使用者不存在，建立資料並且導回首頁
        const newUser = new userModel({
          //建立物件
          name,
          email,
          password,
          confirm_password
        });

        //bcryp 密碼加密處理
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            //有錯誤-列印出來
            if (err) throw err;
            //將雜湊後的密碼，回寫 password
            newUser.password = hash;

            //存到資料庫
            newUser
              .save()
              .then(user => {
                res.redirect("/");
              })
              .catch(err => console.log(err)); //存到資料庫-報錯
          });
        });
      }
    });
  }
});
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("successMessage", "你已經成功登出!! 放飯");
  res.redirect("/users/login");
});

//3. 匯出router
module.exports = router;
