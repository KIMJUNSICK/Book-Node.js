import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "passport";
import logger from "morgan";
import session from "express-session";
import flash from "connect-flash";
import dotenv from "dotenv";
import db from "./models";
import passportConfig from "./passport";

import authRouter from "./routers/auth";
import indexRouter from "./routers";
import v1Router from "./routers/v1";

dotenv.config();

const { PORT } = process.env;

// db
const { sequelize } = db;

const app = express();
sequelize.sync();
passportConfig(passport);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// middleware
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
app.use(passport.initialize());
app.use(passport.session());

// router
app.use("/auth", authRouter);
app.use("/", indexRouter);
app.use("/v1", v1Router);

// 404 middleware
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// listen
app.listen(PORT, () =>
  console.log(`Listening on: ✅  http://localhost:${PORT}`)
);
