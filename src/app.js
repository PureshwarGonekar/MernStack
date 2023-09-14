const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const hbs = require('hbs');
require('dotenv').config()
require('./db/conn.js');
const Signup = require('./models/signup');

// console.log(process.env.SECRET_KEY) 
const PORT = process.env.PORT || 3000;


const app = express();

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/signup",(req,res)=>{
    res.render("signup");
});
app.get("/login",(req,res)=>{
    res.render("login");
});

//create a new use in out database
app.post("/signup", async (req, res) => {
    try {
        const { password, confirmpassword } = req.body;

        if (password !== confirmpassword) {
            return res.status(400).send("Passwords do not match");
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        const registerEmployee = new Signup({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone,
            age: req.body.age,
            password: hashedPassword, // Store the hashed password
        });

        const token = await registerEmployee.generateAuthToken();
        console.log("the token gererated during signup "+ token);

        const registered = await registerEmployee.save();
        console.log("the page part "+ registered);
        res.status(201).render("index");
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Find the user with the provided email
        const user = await Signup.findOne({ email: email });

        if (!user) {
            // If the user with the given email doesn't exist
            return res.status(400).send("User not found");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        const token = await user.generateAuthToken();
        console.log("the token gererated during login "+ token);

        if (isPasswordMatch) {
            res.status(200).render("index"); 
        } else {
            res.status(400).send("Password incorrect");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});
 