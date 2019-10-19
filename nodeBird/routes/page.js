import express from "express";
import { isLoggedIn, isNotLoggedIn } from "../middlewares";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("main", {
    title: "NodeBird",
    twits: [],
    user: req.user,
    loginError: req.flash("loginError")
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
