const express = require("express");
const app = express();
const flash = require("connect-flash");
const mongoose = require("mongoose");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const hotelRoutes = require('./routes/hotels')
const reviewRoutes = require('./routes/reviews')
const expressError = require("./utils/expressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const port = 3000;

const userRoutes = require("./routes/users"); 

app.use(express.urlencoded({ extended: true }));
main().catch((err) => console.log(err));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use("/css",express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js",express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use(methodOverride("_method"));

app.use(flash());
const sessionConfig = {
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },  
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.deleted = req.flash("deleted");
  res.locals.loggedInUser = req.user;
  next();
}); 

app.use('/hotels',hotelRoutes);

app.use('/hotels/:id/reviews',reviewRoutes);
app.use('/',userRoutes);

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/hotelocator", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (error) {
    handleError(error);
  }
} 



app.get("/", (req, res) => res.render("pages/home"));


app.all("*", (req, res, next) => {
  next(new expressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  const { message, status = 500 } = err;
  res.render("error", { err, message, status});
});
 
app.listen(port, () => console.log(`http://localhost:${port}`));
