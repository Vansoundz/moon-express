import { Schema, Types, model } from "mongoose";

const propertySchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  bedrooms: {
    type: Number,
  },
  bathrooms: {
    type: Number,
  },
  image: { type: String },
  comments: [{ type: Types.ObjectId, ref: "comment" }],
  likes: [{ type: Types.ObjectId, ref: "user" }],
  date: {
    type: Date,
    default: Date.now(),
  },
});

export default model("property", propertySchema);
