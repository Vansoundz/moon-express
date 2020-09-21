import { Schema, model, Types } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  socialMedia: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
  },
  properties: [
    {
      type: Types.ObjectId,
      ref: "property",
    },
  ],
  image: { type: String },
});

const User = model("user", UserSchema);
export default User;
