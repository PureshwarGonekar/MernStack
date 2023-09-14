const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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
    tokens:[{
        token : {
            type: String,
            required: true
        }
    }]

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

//generating and storing token
employeeSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
        
    } catch (err) {
        res.send("The erorr is : " + err);
        console.error(err);
        
    }
}

const Signup = new mongoose.model("Register",employeeSchema);
module.exports = Signup;