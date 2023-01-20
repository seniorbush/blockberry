
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const { addAbortSignal } = require("stream");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");


dotenv.config({path: "./.env"});

//MIDDLEWARE, LOAD STATIC ASSETS
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//VIEW ENGINE
app.set("view engine", "ejs");


//DATABASE CONNECTION
const dbURI = "mongodb+srv://seniorbush:rmu9yrk-TVH7ycg2rpz@atlascluster.fa2z3u9.mongodb.net/blockberry?retryWrites=true&w=majority"
mongoose.connect(dbURI, {useNewUrlParser:true})
  .then((result) => {
    console.log("Connected to Database");
    app.listen(3000, () => {
      console.log("http://localhost:3000");
    })
    
  })
  .catch((err)=>{console.log(err)});


///ROUTE
app.get("*", checkUser);
app.get("/", requireAuth, (req, res) => res.render("home", { title: "Blockberry | Main" }));
app.get("/portfolio", requireAuth, (req, res) => res.render("portfolio", { title: "Blockberry | Portfolio" }));
app.use(authRoutes);





