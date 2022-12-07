const { Router} =  require('express');
const authConroller = require("../controllers/authController");

const router = Router();


router.get("/signup", authConroller.signup_get);
router.post("/signup", authConroller.signup_post);

router.get("/login", authConroller.login_get);
router.post("/login", authConroller.login_post);

router.get("/logout", authConroller.logout_get);

router.get("/portfolio", authConroller.portfolio_get);


module.exports = router;
  

