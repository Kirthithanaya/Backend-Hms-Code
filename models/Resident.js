import mongoose from "mongoose";

const residentSchema = new mongoose.Schema(
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

    phone: {
      type: String,
    },

    address: {
      type: String,
    },

    preferences: {
      type: String,
      enum: ["Single", "Double", "Triple"],
      required: true,
    },
    floor: {
      type: String,
      default: null,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },

    roomNumber: {
      type: String,
      default: null,
    },

    assignedRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },

    checkInDate: {
      type: Date,
    },

    checkOutDate: {
      type: Date,
    },

    roomFee: {
      type: Number,
    },

    utilityCharges: {
      type: Number,
    },

    additionalServices: {
      type: Number,
    },

    paymentPlan: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      default: "monthly",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "Stripe", "PayPal"],
      default: "cash",
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    emergencyContact: { type: String },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resident", residentSchema);
