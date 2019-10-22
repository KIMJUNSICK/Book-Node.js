import express from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares";
import db from "../models";

const { User, Domain, Post, HashTag } = db;

const router = express.Router();

router.post("/token", async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ["nick", "id"]
      }
    });

    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: "this domain is not registered. Register first!"
      });
    }

    const token = jwt.sign(
      {
        id: domain.user.id,
        nick: domain.user.nick
      },
      process.env.JWT_SECRET,
      { expiresIn: "1m", issuer: "nodebird" }
    );

    return res.json({
      code: 200,
      message: "Token is issued",
      token
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: 500,
      message: "Server Error"
    });
  }
});

router.get("/test", verifyToken, (req, res) => {
  res.json(req.decoded);
});

export default router;
