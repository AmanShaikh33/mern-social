import TryCatch from "../utils/Trycatch.js";
import { User } from "../models/userModel.js";
import getDataUrl from "../utils/urlGenrator.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json(user);
});

export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user)
    return res.status(404).json({
      message: "No User with is id",
    });

  res.json(user);
});

export const followandUnfollowUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  const loggedInUser = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "No user with this ID" });
  }

  if (user._id.toString() === loggedInUser._id.toString()) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  if (user.followers.includes(loggedInUser._id)) {
    // Unfollow
    user.followers = user.followers.filter(
      (followerId) => followerId.toString() !== loggedInUser._id.toString()
    );
    loggedInUser.followings = loggedInUser.followings.filter(
      (followingId) => followingId.toString() !== user._id.toString()
    );

    await user.save();
    await loggedInUser.save();

    return res.json({ message: "User unfollowed" });
  } else {
    // Follow
    user.followers.push(loggedInUser._id);
    loggedInUser.followings.push(user._id);

    await loggedInUser.save(); // Save loggedInUser first

    // Badge Logic
    let badgeUnlocked = false;

    if (
      user.followers.length === 1 &&
      !user.badges.oneFollower // Change this key if your schema uses a different name
    ) {
      user.badges.oneFollower = true;
      badgeUnlocked = true;
    }

    if (
      user.followers.length === 5 &&
      !user.badges.fiveFollowers
    ) {
      user.badges.fiveFollowers = true;
      badgeUnlocked = true;
    }

    await user.save(); // Save user after updating badges and followers

    return res.json({
      message: badgeUnlocked
        ? "User followed. Badge unlocked!"
        : "User followed",
      badges: user.badges,
    });
  }
});




export const userFollowerandFollowingData = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers", "-password")
    .populate("followings", "-password");

  const followers = user.followers;
  const followings = user.followings;

  res.json({
    followers,
    followings,
    badges: user.badges,
  });
});

export const updateProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { name } = req.body;

  if (name) {
    user.name = name;
  }

  const file = req.file;
  if (file) {
    const fileUrl = getDataUrl(file);

    await cloudinary.v2.uploader.destroy(user.profilePic.id);

    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);

    user.profilePic.id = myCloud.public_id;
    user.profilePic.url = myCloud.secure_url;
  }

  await user.save();

  res.json({
    message: "Profile updated",
  });
});

export const updatePassword = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { oldPassword, newPassword } = req.body;

  const comparePassword = await bcrypt.compare(oldPassword, user.password);

  if (!comparePassword)
    return res.status(400).json({
      message: "Wrong old password",
    });

  user.password = await bcrypt.hash(newPassword, 10);

  await user.save();

  res.json({
    message: "Password Updated",
  });
});
