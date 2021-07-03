import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, default: false },
  CIN: { type: String, default: "" },
  CNE: { type: String, default: "" },
  Apo: { type: Number, default: null },
  Module: { type: String, default: null },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isEnable: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isProf: { type: Boolean, default: false },
  isResp: { type: Boolean, default: false },
  isAll: { type: Boolean, default: false },
  enable: { type: Number, default: 10001 },
  re: { type: String },
  id: { type: String }
});

export default mongoose.model("User", userSchema);
