const User = require("../model/user.js");
const jwt = require("jsonwebtoken");


//HANDLE ERRORS
const handleErrors = (err) => {

  console.log(err.message, err.code);
  let errors = { name: "", email: "", password: ""};

  //INCORRECT EMAIL
  if (err.message === "Incorrect email."){
    errors.email = "Email address has not been registered."
  }

  //INCORRECT PASSWORD
  if (err.message === "Incorrect password."){
    errors.email = "Invalid password."
  }

  //DUPLICATE ERROR CODE
  if (err.code === 11000) {
    errors.email = "Email address is already registered.";
    return errors;
  }

  //VALIDATION ERRORS
  if (err.message.includes("User validation failed")) {   
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}


//CREATE JWT

const maxAge = 3*24*60*60; //3 DAYS IN SECONDS

const creatToken = (id) => {
  return jwt.sign(
    { id }, 
    "when the mountains blow in the wind like leaves", 
    {expiresIn: maxAge}
    )};



module.exports.signup_get = (req, res) => {
    res.render("signup", { title: "Blockberry | Signup" });
};


module.exports.login_get = (req, res) => {
    res.render("login", { title: "Blockberry | Login" });
};

module.exports.portfolio_get = (req, res) => {
  res.render("portfolio", { title: "Blockberry | Portfolio" });
};

module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({ name, email, password });
        const token = creatToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge*1000 });
        res.status(201).json({ user: user._id }); 
           
    } 
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    };
  };



module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = creatToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge*1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
  };


module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1});
  res.redirect("/");
}

