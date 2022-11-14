const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const {validationSchema, loginSchema} = require("./routes/validation");


// //Import Routes
// const authRoute = require("./routes/auth");


//
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//dotenv package used to conceal passwords 
dotenv.config();

//connect to db trial 1
const dbURI = "mongodb+srv://seniorbush:rmu9yrk-TVH7ycg2rpz@atlascluster.fa2z3u9.mongodb.net/bb-users?retryWrites=true&w=majority"
mongoose.connect(dbURI, {useNewUrlParser:true})
  .then((result) => {
    console.log("Connected to Database");
    app.listen(3000, () => {
      console.log("Listening on Port:3000, http://localhost:3000");
    })
    
  })
  .catch((err)=>{console.log(err)})

// connect to database
// mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true })
//   .then((result) => app.listen(3000))
//   .catch((err) => console.log(err));
  
  

//init view engine
app.set("view engine", "ejs");

//load static assets
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//login route
app.get("/", (req, res) => {
  res.render("login", { title: "Blockberry | Login" });
});

//register route
app.get("/register", (req, res) => {
  res.render("register", { title: "Blockberry | Register" });
});

//main route
app.get("/main", (req, res) => {
  res.render("main", { title: "Blockberry | Main" });
});

///////////////////////////////////////////

//create web token

const maxAge = 3*24*60*60;

const createToken = (id) => {
  return jwt.sign({id}, "signature secret", {
    expiresIn: maxAge
  });
}

///////////////////////////////////////////




//POST REQUEST, REGISTER & VALIDATE NEW USER

app.post("/register", async (req, res) => {
  //VALIDATION BEFORE ADDING NEW USER TO THE DATABASE
  const { error } = validationSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message) ;
  };

  //CHECK IF USER IS ALREADY IN THE DATABASE
  const emailFound = await User.findOne({email : req.body.email});
  if (emailFound) {
    return res.status(400).send("Email is already registered.");
  };

  //HASH THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //ADD NEW USER TO THE DATABASE
  const user = new User({
    //ACCESSING HTML FORM VALUES  (name = "" is required)
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword    
  });
  user.save()
    .then((result) => {
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: user._id});
      // res.redirect("/main");
    })
    .catch((err) => {
      console.log(err);
    })
});



//POST REQUEST, LOGIN EXSITING USER

app.post("/login", async (req, res) => {
  //VALIDATION BEFORE LOGIN
  const { error } = loginSchema.validate(req.body);
  if (error) {
    console.log(res.status(400).send(error.details[0].message)) ;
  };

  //CHECK IF USER IS ALREADY IN THE DATABASE
  const account = await User.findOne({email : req.body.email});
  if (!account) {
    console.log(res.status(400).send("Account information is incorrect.(e)")) ;
  };

  //CHECK PASSWORD IS CORRECT
  const validPassword = await bcrypt.compare(req.body.password, account.password);
  if (!validPassword) {
    console.log(res.status(400).send("Account information is incorrect.(p)")) ;
  };

  res.redirect("/main");

});
