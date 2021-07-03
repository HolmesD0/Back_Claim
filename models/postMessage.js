import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  creator: String,
  creatorToken: String,
  DR: String,
  TDR: String,
  Faculty: String,
  CIN: String,
  CNE: String,
  Apo: Number,
  forAdmin: {
    type: Boolean,
    default: false
  },
  forProf: {
    type: Boolean,
    default: false
  },
  isArch: {
    type: Boolean,
    default: false
  },
  isDel: {
    type: Boolean,
    default: false
  },
  email: String,
  title: String,
  content: String,
  tags: [String],
  selectedFile: String,
  module: String,
  ResPAS: {
    type: String,
    default: ""
  },
  ResPAF: {
    type: String,
    default: ""
  },
  likeCount: {
    type: Number,
    default: 0
  },
  createAt: {
    type: Date,
    default: new Date()
  },
  state: {
    type: String,
    default: "Pending"
  },
  priority: {
    type: Number,
    default: 0
  }
});

const PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;
