import express from "express";
import {
  signin,
  signup,
  setting,
  pass,
  enable,
  account,
  update
} from "../controller/user.js";
const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/setting", setting);
router.post("/pass", pass);
router.post("/enable", enable);
router.post("/update", update);
router.post("/account", account);

export default router;
