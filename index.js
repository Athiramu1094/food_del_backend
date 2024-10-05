require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");
//const { cloudinaryInstance } = require('./config/cloudinaryConfig.js');
const cors = require("cors");
const app = express();
const port = 3000;
const foodRoute = require("./routes/foodRoute");
const restaurantRoute = require("./routes/restaurantRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");
const adminRoute = require("./routes/adminRoute");



connectDB();

app.use(
  cors({
    credentials: true,
    origin:[
      "https://food-del-frontend-vwfn.vercel.app",
      "http://localhost:5173",
      "https://food-del-backend-8w54.onrender.com",
      "https://food-del-admin-blond.vercel.app",
      "http://localhost:5174"
    ]
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/food", foodRoute);
app.use("/restaurant", restaurantRoute);
app.use("/api", userRoute);
app.use("/order", orderRoute);
app.use('/payment', paymentRoute);
app.use("/", adminRoute);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
