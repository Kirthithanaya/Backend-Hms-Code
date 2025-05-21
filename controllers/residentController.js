// controllers/residentController.js
import Resident from "../models/Resident.js";

export const createResident = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      roomNumber,
      checkInDate,
      emergencyContact,
      address,
      preferences,
    } = req.body;

    const existing = await Resident.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Resident already exists" });
    }

    const resident = new Resident({
      name,
      email,
      phone,
      roomNumber,
      checkInDate,
      emergencyContact,
      address,
      preferences,
    });

    await resident.save();

    res.status(201).json({ message: "Resident created", resident });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all residents (Admin only)
export const getAllResidents = async (req, res) => {
  try {
    const residents = await Resident.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Residents fetched successfully", residents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Update Resident
export const updateResident = async (req, res) => {
  try {
    const {
      id,
      name,
      email,
      phone,
      roomNumber,
      checkInDate,
      address,
      emergencyContact,
      preferences,
    } = req.body;

    const resident = await Resident.findById(id);
    if (!resident)
      return res.status(404).json({ message: "Resident not found" });

    resident.name = name || resident.name;
    resident.email = email || resident.email;
    resident.phone = phone || resident.phone;
    resident.roomNumber = roomNumber || resident.roomNumber;
    resident.checkInDate = checkInDate || resident.checkInDate;
    resident.address = address || resident.address;
    resident.emergencyContact = emergencyContact || resident.emergencyContact;
    resident.preferences = preferences || resident.preferences;

    await resident.save();

    res
      .status(200)
      .json({ message: "Resident updated successfully", resident });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete a resident by ID
export const deleteResident = async (req, res) => {
  try {
    const { id } = req.params;

    const resident = await Resident.findById(id);
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }

    await Resident.findByIdAndDelete(id);
    res.status(200).json({ message: "Resident deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
