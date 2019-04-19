//passport 設定
//引入必要package | model

const LocalSrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/user");

//建立 名為 passport 的middleware
module.exports = passport => {
  //修改預設，usernameField 為 email

  //1.使用  LocalSrategy 實例
  passport.use(
    //修改預設值 { usernameField: "email" }
    new LocalSrategy({ usernameField: "email" }, (email, password, done) => {
      //用戶 req - (email, password, done)
      //1. 自資料庫調資料 - 有查到會丟給then()
      User.findOne({ email: email }).then(user => {
        // 情境一 :沒有user 實例 - done 回傳false 和 訊息
        if (!user) {
          return done(null, false, { message: "that emailis not registered!" });
        }
        // 情境二 :有 user 實例 但密碼錯誤 - done 回傳false 和 訊息
        if (user.password != password) {
          return done(null, false, { message: "Email or Password incorrect" });
        }
        //情境三 : 有 user實例 且 密碼正確 - done 會傳 user 實例
        return done(null, user);
      });
    })
  );

  //login session | 成功登入後，app會自動發一個session_id 存 cooki 給 瀏覽器
  //2.序列化 - 將user instance 存到 session
  passport.serializeUser((user, done) => {
    done(null, user.id); //將 userid 存到cookie
  });
  //3. 反序列化 - 將 session 從資料調出來
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user); //使用 userA_id 調用 session 資料
    });
  });
};
