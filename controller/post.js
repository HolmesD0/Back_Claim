import express from "express";
import mongoose from "mongoose";

import PostMessage from "../models/postMessage.js";
import UserModal from "../models/user.js";

const router = express.Router();

export const getAll = async (req, res) => {
  try {
    const postMessages = await UserModal.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPostMessage = new PostMessage({ ...post, creatorToken: req.userId });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { state, priority, ResPAS, ResPAF } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = await PostMessage.findByIdAndUpdate(
    id,
    { state, priority, ResPAS, ResPAF, creatorToken: req.userId },
    { new: true }
  );

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const type = req.body.type;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);
  console.log(type);

  if (type === "Admin" || type === "Prof") {
    post.isArch = true;
    post.isDel = true;
  } else post.isArch = true;

  await post.save();

  res.json({ message: "Post deleted successfully." });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true
  });
  res.status(200).json(updatedPost);
};

export const countAll = async (req, res) => {
  try {
    const Accounts = await UserModal.count();
    const Messages = await PostMessage.count();
    const Timer = await PostMessage.find();

    res.status(200).json({
      message: Messages,
      account: Accounts,
      date: Timer[Messages - 1].createAt
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
