require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js');
//const { cloudinaryInstance } = require('./config/cloudinaryConfig.js'); 
const cors = require('cors');
const app = express();
const port = 3000;
const foodRoute = require("./routes/foodRoute");
const restaurantRoute = require("./routes/restaurantRoute")
const userRoute = require("./routes/userRoute")
const orderRoute = require('./routes/orderRoute');
const paymentRoute = require('./routes/paymentRoute')
const adminRoute = require("./routes/adminRoute");
console.log("DB_URL:", process.env.DB_URL);


connectDB();

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
  }));
app.use(express.json()); 
app.use(cookieParser());


app.use("/food", foodRoute);
app.use("/restaurant", restaurantRoute)
app.use("/api", userRoute)
app.use('/order', orderRoute); 
app.use('/payment', paymentRoute)
app.use("/admin", adminRoute);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
