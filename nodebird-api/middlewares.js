import jwt from "jsonwebtoken";
import RateLimit from "express-rate-limit";

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("You have to login");
  }
};

export const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};

export const verifyToken = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(419).json({
        code: 419,
        message: "token is expired"
      });
    }
    return res.status(401).json({
      code: 401,
      message: "Token is not valid"
    });
  }
};

export const apiLimiter = new RateLimit({
  windowMs: 60 * 1000,
  max: 1,
  delayMs: 0,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode,
      message: "You can only request once a minute."
    });
  }
});

export const deprecated = (req, res) => {
  return res.status(410).json({
    code: 410,
    message: "new version has been released. Use new version!"
  });
};
