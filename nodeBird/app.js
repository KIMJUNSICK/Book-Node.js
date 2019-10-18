import flash from "connect-flash";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import logger from "morgan";
import path from "path";
import db from "./models";
import pageRouter from "./routes/page";

// .env
dotenv.config();

// db
const { sequelize } = db;

// express
const app = express();
sequelize.sync();

// set
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// middeware
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);
app.use(flash());

// router
// 'use', not 'get'
app.use("/", pageRouter);

// 404 middleware
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// start server
app.listen(process.env.PORT, () =>
  console.log("Listening on: ✅  http://localhost:4000")
);
