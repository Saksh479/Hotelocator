const User = require("../models/user");

module.exports.register = async(req, res) => {
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
}

module.exports.renderLogin = (req, res) => {
    const redirectUrl = req.session.returnTo || "/hotels";
    res.render("users/login", {redirectUrl});
}

module.exports.login = async(req, res) => {
    req.flash("success", `Welcome back! ${req.user.username}`);
    const redirectUrl = req.body.returnTo || "/hotels";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "Logged out!");
        res.redirect('/hotels');
      });
}