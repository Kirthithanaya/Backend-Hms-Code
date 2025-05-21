// controllers/roomController.
import Room from "../models/Room.js";
import User from "../models/userModel.js";
import Resident from "../models/Resident.js";

// Create new room (Admin only)
export const createRoom = async (req, res) => {
  const { roomNumber, type, capacity } = req.body;

  if (!roomNumber || !type || !capacity) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: "Room already exists" });
    }

    const newRoom = new Room({
      roomNumber,
      type,
      capacity,
    });

    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all rooms (Admin only)
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate(
      "occupants.residentId",
      "name email"
    ); // populate optional
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all rooms (Resident access)export const getAllRoomsForResident = async (req, res) => {
export const getAllRoomsForResident = async (req, res) => {
  try {
    const rooms = await Room.find()
      .select("-__v")
      .populate("occupants.residentId", "name email");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Resident check-in

export const checkInRoom = async (req, res) => {
  const { roomNumber, residentId } = req.body;

  if (!roomNumber || !residentId) {
    return res
      .status(400)
      .json({ message: "roomNumber and residentId are required." });
  }

  try {
    const room = await Room.findOne({ roomNumber });

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    // Check if room is full
    if (room.occupants.length >= room.capacity) {
      return res.status(400).json({ message: "Room is fully occupied." });
    }

    // Check if resident already checked in
    const alreadyCheckedIn = room.occupants.find(
      (occ) => occ.residentId.toString() === residentId
    );

    if (alreadyCheckedIn) {
      return res
        .status(400)
        .json({ message: "Resident already checked into this room." });
    }

    // Add occupant
    room.occupants.push({
      residentId,
      checkInDate: new Date(),
    });

    // Update availability
    if (room.occupants.length + 1 >= room.capacity) {
      room.isAvailable = false;
    }

    await room.save();

    res.status(200).json({ message: "Check-in successful", room });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllRoomCheckIns = async (req, res) => {
  try {
    const rooms = await Room.find().populate(
      "occupants.residentId",
      "name email"
    );

    const roomData = rooms.map((room) => ({
      roomNumber: room.roomNumber,
      type: room.type,
      capacity: room.capacity,
      isAvailable: room.isAvailable,
      occupants: room.occupants.map((occupant) => ({
        residentName: occupant.residentId?.name || "Unknown",
        residentEmail: occupant.residentId?.email || "Unknown",
        checkInDate: occupant.checkInDate,
        checkOutDate: occupant.checkOutDate,
      })),
    }));

    res.status(200).json(roomData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Resident Check-Out Room using roomNumber from body
export const checkOutRoom = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roomNumber } = req.body;

    if (!roomNumber) {
      return res.status(400).json({ message: "Room number is required" });
    }

    // Find room by roomNumber
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is an occupant
    const occupantIndex = room.occupants.findIndex(
      (occ) => occ.residentId.toString() === userId.toString()
    );

    if (occupantIndex === -1) {
      return res
        .status(400)
        .json({ message: "User is not an occupant of this room" });
    }

    // Set checkOutDate and remove occupant
    room.occupants[occupantIndex].checkOutDate = new Date();
    room.occupants.splice(occupantIndex, 1);

    // Update availability
    room.isAvailable = room.occupants.length < room.capacity;

    await room.save();

    // Update user info
    const user = await User.findById(userId);
    user.roomNumber = null;
    user.checkInStatus = "checked-out";
    await user.save();

    res.status(200).json({ message: "User checked out successfully" });
  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    // Validate
    if (!roomNumber) {
      return res.status(400).json({ message: "Room number is required" });
    }

    // Find the room
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Prevent deleting if the room is occupied

    // Delete the room
    await Room.deleteOne({ roomNumber });

    res
      .status(200)
      .json({ message: `Room ${roomNumber} deleted successfully` });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Assign a room to a resident
export const assignRoom = async (req, res) => {
  try {
    const { residentId, roomNumber } = req.body;

    // Validate input

    // Check if resident exists
    const resident = await Resident.findById(residentId);

    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }

    // Check if resident already has a room assigned
    if (resident.assignedRoom) {
      return res
        .status(400)
        .json({ message: "Resident already has a room assigned" });
    }

    // Find room by room number
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check room availability
    if (!room.isAvailable || room.occupants.length >= room.capacity) {
      return res.status(400).json({ message: "Room is full or not available" });
    }

    // Assign room to resident
    room.occupants.push(resident._id);
    if (room.occupants.length >= room.capacity) {
      room.isAvailable = false;
    }

    resident.assignedRoom = room._id;

    // Save both updates
    await room.save();
    await resident.save();

    return res.status(200).json({
      message: `Room ${room.roomNumber} successfully assigned to ${resident.name}`,
      room,
      resident,
    });
  } catch (error) {
    console.error("Error in assignRoom:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
