require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const path = require('path');
const db = require("./models");
const { loginRequired, ensureCorrectUser } = require("./middleware/auth");

app.use(express.static(path.resolve(__dirname, '../warbler-client/build')));

const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(bodyParser.json());

app.get("/",function(req,res,next){
  res.send('HELLO FROM THE ROOT ROUTE');
});
//routes goes there
app.use("/api/auth",authRoutes);
app.use(
  "/api/users/:id/messages",
  loginRequired,
  ensureCorrectUser,
  messagesRoutes
);

//this route is used to show all the messages in the timeline
//but before we show it, first make sure that user is loged in
app.get("/api/messages", loginRequired, async function(req, res, next) {
  try {
    let messages = await db.Message.find()
      .sort({ createdAt: "desc" })
      .populate("user", {
        username: true,
        profileImageUrl: true
      });
    return res.status(200).json(messages);
  } catch (err) {
    return next(err);
  }
});

app.use(function(req,res,next){
  let err = new Error("NOT FOUND");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT,function(){
  console.log(`The server is starting on port ${PORT}`);
});
