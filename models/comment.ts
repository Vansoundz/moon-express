import { model, Schema, Types } from "mongoose";

const Comment = new Schema({
  user: { type: Types.ObjectId, ref: "user" },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now() },
});

export default model("comment", Comment);
