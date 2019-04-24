// /config/passport.js

//1.引入必要 package & model
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

//2.輸出中介層
module.exports = passport => {
  //1.使用 passport 策略
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
