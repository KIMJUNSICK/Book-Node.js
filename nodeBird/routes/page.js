import express from "express";
import { isLoggedIn, isNotLoggedIn } from "../middlewares";
import db from "../models";

const { User, Post } = db;
const router = express.Router();

router.get("/", (req, res, next) => {
  Post.findAll({
    include: {
      model: User,
      attributes: ["id", "nick"]
    },
    order: [["createdAt", "DESC"]]
  })
    .then(posts => {
      res.render("main", {
        title: "NodeBird",
        twits: posts,
        user: req.user,
        loginError: req.flash("loginError")
      });
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", {
    title: "회원가입 - NodeBird",
    user: req.user,
    joinError: req.flash("joinError")
  });
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird", user: req.user });
});

module.exports = router;
