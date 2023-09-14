const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },

});

//using middleware to has the passward beform save

//i have used in the same sign post router, so don't need to use middleware
/*
employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await brcrypt.hash(this.password,10);
        next();
    }
});
*/
const Signup = new mongoose.model("Register",employeeSchema);
module.exports = Signup;