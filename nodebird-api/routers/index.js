import express from "express";
import uuidv4 from "uuid/v4";
import db from "../models";

const { User, Domain } = db;

const router = express.Router();

router.get("/", (req, res, next) => {
  User.findOne({
    where: { id: req.user && req.user.id },
    include: { model: Domain }
  })
    .then(user => {
      res.render("login", {
        user,
        loginError: req.flash("loginError"),
        domains: user && user.domains
      });
    })
    .catch(err => next(err));
});

router.post("/domain", (req, res, next) => {
  Domain.create({
    userId: req.user.id,
    host: req.body.host,
    type: req.body.type,
    clientSecret: uuidv4()
  })
    .then(() => res.redirect("/"))
    .catch(err => next(err));
});

export default router;
