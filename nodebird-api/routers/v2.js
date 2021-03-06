import express from "express";
import url from "url";
import jwt from "jsonwebtoken";
import cors from "cors";
import { verifyToken, apiLimiter } from "../middlewares";
import db from "../models";

const { User, Domain, Post, HashTag } = db;

const router = express.Router();

router.use(async (req, res, next) => {
  const domain = await Domain.findOne({
    where: { host: url.parse(req.get("origin")).host }
  });
  if (domain) {
    cors({ origin: req.get("origin") })(req, res, next);
  } else {
    next();
  }
});

router.post("/token", apiLimiter, async (req, res) => {
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
      { expiresIn: "30m", issuer: "nodebird" }
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

router.get("/test", verifyToken, apiLimiter, (req, res) => {
  res.json(req.decoded);
});

router.get("/posts/my", verifyToken, apiLimiter, (req, res) => {
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

router.get(
  "/posts/hashtag/:title",
  verifyToken,
  apiLimiter,
  async (req, res) => {
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
  }
);

export default router;
