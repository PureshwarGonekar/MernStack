const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Registration").then(()=>{
    console.log("Connection is successful");
}).catch((err)=>{
    console.error(err);
    console.log("Failed to Connect Database");
});