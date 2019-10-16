import express from "express";

const router = express.router();

router.get("/", (req, res, next) => {
  res.render("home", {
    title: "NodeBird",
    twits: [],
    user: null,
    loginError: req.flash("loginError")
  });
});

router.get("/join", (req, res) => {
  res.render("join", {
    title: "Join - NodeBird",
    user: null,
    joinError: req.flash("joinError")
  });
});

router.get("/profile", (req, res) => {
  res.render("profile", { title: "My Info - NodeBird", user: null });
});

export default router;
