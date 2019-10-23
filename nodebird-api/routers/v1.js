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

router.get("/posts/my", verifyToken, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
    .then(posts => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        message: "Server Error"
      });
    });
});

router.get("/posts/hashtag/:title", verifyToken, async (req, res) => {
  try {
    const hashtag = await HashTag.findOne({
      where: { title: req.params.title }
    });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: "Not Found"
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: "Server Error"
    });
  }
});

export default router;
