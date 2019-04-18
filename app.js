//[引用之套件]
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bdParser = require("body-parser");
const methodOverride = require("method-override");

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

//[設定]使用 method override
app.use(methodOverride("_method"));

//---------------------------------------------------------------------------------------------
//[路由區]--------------------------------------
app.use("/", require("./routes/index"));
app.use("/todos", require("./routes/todo"));
app.use("/users", require("./routes/user"));
