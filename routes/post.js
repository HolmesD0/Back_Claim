import express from "express";

import {
  getAll,
  getPosts,
  getPost,
  createPost,
  updatePost,
  likePost,
  deletePost,
  countAll
} from "../controller/post.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/all", getAll);
router.get("/count", countAll);
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.post("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);

export default router;
