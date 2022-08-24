const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://dell:test123@cluster0.xnlen.mongodb.net/user_management_system?retryWrites=true&w=majority");

const express = require("express");

const app = express();

//for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

//for admin routes
const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute);

app.listen(3000,function(){
    console.log("Server is running . . . ");
});