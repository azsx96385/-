// /config/passport.js

//1.引入必要 package & model
const LocalStrategy = require("passport-local").Strategy;
const FacebookSrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

//2.輸出中介層
module.exports = passport => {
  //1.使用 passport 策略

  //[策略一 - local]
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email: email }).then(user => {
        //1.狀況一 - 查無此人
        if (!user) {
          return done(null, false, { message: "that email is not registered" });
        }
        //2.狀況二 - 密碼錯誤 | 使用 bcrypt
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Email or Password incorrect"
            });
          }
        });

        // if (user.password != password) {
        //   return done(null, false, { message: "Email or Password incorrect" });
        // }
        // return done(null, user);
      });
    })
  );

  //[策略二 - facebook]
  passport.use(
    new FacebookSrategy(
      {
        //第三方app 設定
        clientID: "2343753385674683",
        clientSecret: "626a19e0b4a9f64808fa1c07d20f3ae6",
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ["email", "displayName"]
      },
      (accessToken, refreshToken, profile, done) => {
        //執行驗證，用email 調資料，有-資料庫回傳使用者資料，沒有-新建一個，再回傳使用者資料
        User.findOne({ email: profile._json.email }).then(user => {
          //1.如果user 不存在 - 新建立-回傳

          if (!user) {
            //隨機密碼
            let randomPassword = Math.random()
              .toString(36)
              .slice(-8);
            //密碼雜湊處理
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(randomPassword, salt, (err, hash) => {
                let newUser = new User({
                  name: profile._json.name,
                  email: profile._json.email,
                  password: hash,
                  confirm_password: hash
                });

                newUser
                  .save()
                  .then(user => {
                    return done(null.user);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              });
            });
          } else {
            //2.如果user 存在-回傳從資料庫釣到的資料

            return done(null, user);
          }
        });
      }
    )
  );

  //2.log session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
