import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "staff", "resident"],
      default: "resident",
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    checkInStatus: {
      type: String,
      enum: ["checked-in", "checked-out"],
      default: "checked-out",
    },
    resetToken: {
      type: String,
    },
    resetTokenExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("User", userSchema);
