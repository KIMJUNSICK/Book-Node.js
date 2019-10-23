import express from "express";
import axios from "axios";

const router = express.Router();
const URL = "http://localhost:4001/v2";

axios.defaults.headers.origin = "http://localhost:4002";

const requestData = async (req, api) => {
  try {
    if (!req.session.jwt) {
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET
      });
      req.session.jwt = tokenResult.data.token;
    }
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt }
    });
  } catch (err) {
    console.error(err);
    if (err.response.status < 500) {
      return err.response;
    }
    throw err;
  }
};

router.get("/", (req, res) => {
  res.render("main", { key: process.env.CLIENT_SECRET });
});

router.get("/test", async (req, res) => {
  const result = await requestData(req, "/test");
  return res.json(result.data);
});

router.get("/myposts", async (req, res, next) => {
  try {
    const result = await requestData(req, "/posts/my");
    res.json(result.data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/search/:hashtag", async (req, res, next) => {
  try {
    const result = await requestData(
      req,
      `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`
    );
    res.json(result.data);
  } catch (err) {
    if (err.code) {
      console.error(err);
      next(err);
    }
  }
});

export default router;
