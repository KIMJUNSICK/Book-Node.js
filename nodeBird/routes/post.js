import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { isLoggedIn } from "../middlewares";
import db from "../models";

const { Post, HashTag, User } = db;
const router = express.Router();

// fs
fs.readdir("uploads", err => {
  if (err) {
    console.error("folder of Uploads not found, Made dir");
    fs.mkdirSync("uploads");
  }
});

// upload middleware
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(
        null,
        path.basename(file.originalname, ext) + new Date().valueOf() + ext
      );
    }
  })
});

router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

// upload post
const upload2 = multer();
router.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      userId: req.user.id
    });
    const hashtags = req.body.content.match(/#[^\s]*/g);
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
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// hashtag
router.get("/hashtag", async (req, res, next) => {
  const {
    query: { hashtag: query }
  } = req;
  if (!query) {
    return res.redirect("/");
  }
  try {
    const hashtag = await HashTag.findAll({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }
    return res.render("main", {
      title: `${query} | NodeBird`,
      user: req.user,
      twits: posts
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;
