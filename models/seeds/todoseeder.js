// 引入 mongoose package & todo model
const mongoose = require("mongoose");
const Todo = require("../todo");

//建立連線
mongoose.connect("mongodb://127.0.0.1/todo", { useNewUrlParser: true });

//接收 Connection
const db = mongoose.connection;

//持續監聽 - 錯誤事件回報
db.on("error", () => {
  console.log("mongodb error!!");
});

//成功連接後 - 建立10筆假資料
db.once("open", () => {
  console.log("mongodb connected!!");
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: "name-" + i });
  }
  console.log("DONE!!");
});
