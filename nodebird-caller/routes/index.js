import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", (req, res) => res.send("Home"));

router.get("/test", async (req, res, next) => {
  try {
    if (!req.session.jwt) {
      const tokenResult = await axios.post("http://localhost:4001/v1/token", {
        clientSecret: process.env.CLIENT_SECRET
      });
      if (tokenResult.data && tokenResult.data.code === 200) {
        console.log(tokenResult.data.token);
        req.session.jwt = tokenResult.data.token;
      } else {
        return res.json(tokenResult.data);
      }
    }

    const result = await axios.get("http://localhost:4001/v1/test", {
      headers: { authorization: req.session.jwt }
    });
    return res.json(result.data);
  } catch (err) {
    console.error(err);
    if (err.response.status === 419) {
      return res.json(err.response.data);
    }
    return next(err);
  }
});

export default router;
