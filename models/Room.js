// models/Room.js
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Single", "Double", "Triple"],
  },
  capacity: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
   isOccupied: Boolean,

   occupants: [
    {
      residentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident',
      },
      checkInDate: Date,
    },
  ],
  occupiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
