const mongoose = require("mongoose");
mongoose.set("debug",true);
// mongoose.connect("mongodb://localhost/warbler", {
//   keepAlive: true
// });

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/warbler", {
  keepAlive: true
});


//requre user.js
module.exports.User = require("./user");
module.exports.Message = require("./message");
