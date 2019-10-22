import express from "express";
import logger from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import indexRouter from "./routes";

require("dotenv").config();
const { PORT, COOKIE_SECRET } = process.env;

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(cookieParser(COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);

app.use("/", indexRouter);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(PORT, () =>
  console.log(`Listening on:✅  http://localhost:${PORT}`)
);
