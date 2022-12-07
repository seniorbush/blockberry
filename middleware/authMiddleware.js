const jwt = require("jsonwebtoken");
const User = require("../model/user");


//PROTECT ROUTES FROM UN-AUTHENTICATED USERS
const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt

    //CHECK JWT EXSITS & IS VALID
    if (token) {
        jwt.verify(token, "when the mountains blow in the wind like leaves", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/login");
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        res.redirect("/login");
    }
}


//CHECK CURRENT USER
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "when the mountains blow in the wind like leaves", async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}




module.exports = { requireAuth, checkUser };

