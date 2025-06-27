import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    profilePic: {
      id: String,
      url: String,
    },

    // 👇 New Badges Field Added
   badges: {
  firstPost: { type: Boolean, default: false },
  oneFollower: { type: Boolean, default: false },    // Add this
  fiveFollowers: { type: Boolean, default: false },
  chatter: { type: Boolean, default: false },
}

  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
