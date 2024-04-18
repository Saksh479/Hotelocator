const User = require("../models/user");
const express = require("express");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post("/register", catchAsync(async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
          if (err) return next(err);
            req.flash("success", "Welcome to Hotelocator!");
            res.redirect("/hotels");
          });
      } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
      }
}));

router.get("/login", (req, res) => {
    const redirectUrl = req.session.returnTo || "/hotels";
    res.render("users/login", {redirectUrl});
});
router.post("/login", passport.authenticate('local',
{failureFlash:true ,failureRedirect: "/login" }) 
,catchAsync(async(req, res) => {
    req.flash("success", `Welcome back! ${req.user.username}`);
    const redirectUrl = req.body.returnTo || "/hotels";
    res.redirect(redirectUrl);
}));
router.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "Logged out!");
        res.redirect('/hotels');
      });
});


module.exports = router;