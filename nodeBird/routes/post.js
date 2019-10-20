import { isLoggedIn } from "../middlewares";
import db from "../models";

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Post, HashTag, User } = db;

const router = express.Router();

fs.readdir("uploads", error => {
  if (error) {
    console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
    fs.mkdirSync("uploads");
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      userId: req.user.id
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag =>
          HashTag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() }
          })
        )
      );
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/hashtag", async (req, res, next) => {
  const {
    query: { hashtag: query }
  } = req;
  if (!query) {
    res.redirect("/");
  }
  try {
    const hashtag = await HashTag.findOne({ title: query });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }
    res.render("main", {
      title: `${query} | NodeBird`,
      user: req.user,
      twits: posts
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
