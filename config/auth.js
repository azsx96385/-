// config/auth.js
// 新增一個方法authenticated |如果已驗證 丟掉下一個中介 ｜ 沒有重導 login
//匿名函數-無參數
module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); //有驗證過才可以進到下一層處理
    }
    res.redirect("/users/login");
  }
};
