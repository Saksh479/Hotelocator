const express = require("express");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const router = express.Router();
const users = require("../controllers/users");

router.get("/register", (req, res) => {res.render("users/register");});

router.post("/register", catchAsync(users.register));

router.get("/login", users.renderLogin);

router.post("/login", passport.authenticate('local',{failureFlash:true ,failureRedirect: "/login" }) 
,catchAsync(users.login));

router.get("/logout", users.logout);


module.exports = router;