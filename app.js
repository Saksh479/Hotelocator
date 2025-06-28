if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const expressError = require("./utils/expressError.js");
const express = require("express");
const app = express();
const flash = require("connect-flash");
const mongoose = require("mongoose");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const hotelRoutes = require("./routes/hotels");
const reviewRoutes = require("./routes/reviews");
const passport = require("passport");
const mongoSanitize = require("express-mongo-sanitize");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const port = process.env.PORT || 3002;
const userRoutes = require("./routes/users");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/hotelocator"; // Use local MongoDB for development
const MongoStore = require("connect-mongo");

// Initialize database connection
main().catch((err) => console.log(err));

// Basic Express setup
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(methodOverride("_method"));
app.use(helmet({ contentSecurityPolicy: false }));

app.use(
  mongoSanitize({
    replaceWith: "_",
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`);
    },
  })
);
app.use(flash());

const secret = process.env.SECRET || "thisisasecret";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});

const sessionConfig = {
  // store, // Temporarily disable store for testing
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    //secure: true,
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

app.use("/hotels", hotelRoutes);

app.use("/hotels/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

//
async function main() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.error(error);
  }
}

app.get("/", (req, res) => res.render("home"));

app.all("*", (req, res, next) => {
  next(new expressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  const { message = "Something went wrong!", status = 500 } = err;
  if (!res.headersSent) {
    res.status(status).render("error", { err, message, status });
  }
});

app.listen(port, () => console.log(`http://localhost:${port}`));

module.exports = app;
