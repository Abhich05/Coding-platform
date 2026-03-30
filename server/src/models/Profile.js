import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    bio: String,
    skills: [String],
    avatarUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Profile", ProfileSchema);
