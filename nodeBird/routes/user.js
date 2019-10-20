import express from "express";
import db from "../models";
import { isLoggedIn } from "../middlewares";

const { User } = db;
const router = express.Router();

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    await user.addFollowing(parseInt(req.params.id, 10));
    res.send("success");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default router;
