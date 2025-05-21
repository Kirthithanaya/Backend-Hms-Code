import MaintenanceRequest from "../models/MaintenanceRequest.js";
import User from "../models/userModel.js";

// Create Maintenance Request (Resident)
export const createMaintenanceRequest = async (req, res) => {
  try {
    const { roomNumber, issueTitle, issueDescription, priority } = req.body;

    if (!roomNumber || !issueTitle || !issueDescription || !priority) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const request = new MaintenanceRequest({
      resident: req.user.id,
      roomNumber,
      issueTitle,
      issueDescription,
      priority,
    });

    const savedRequest = await request.save();

    res.status(201).json(savedRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Residentb get my requests
export const getMyMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({
      resident: req.user.id,
    }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching resident requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Admin GetAll ResidentRequset
export const getAllRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate("resident", "name email") // optional: get resident name & email
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Failed to fetch all requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin assigns maintenance request to staff with roomNumber and adminId

export const assignRequest = async (req, res) => {
  try {
    const { roomNumber, staffId } = req.body;
    const adminId = req.user.id;

    if (!roomNumber || !staffId) {
      return res
        .status(400)
        .json({ message: "Room number and staff ID are required" });
    }

    // Optional: validate staffId
    const staff = await User.findById(staffId);
    if (!staff || staff.role !== "staff") {
      return res.status(400).json({ message: "Invalid staff member" });
    }

    // Find latest unassigned request for the room
    const request = await MaintenanceRequest.findOne({
      roomNumber,
      assignedTo: null,
    }).sort({ createdAt: -1 });

    if (!request) {
      return res
        .status(404)
        .json({ message: "No unassigned request found for this room" });
    }

    // Assign request
    request.assignedTo = staffId;
    request.assignedBy = adminId;
    request.status = "In Progress";

    await request.save();

    res.status(200).json({
      message: "Request assigned successfully",
      roomNumber,
      assignedTo: staffId,
      assignedBy: adminId,
      requestId: request._id,
    });
  } catch (error) {
    console.error("Error assigning request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// admin UpdateRequest

export const updateRequestStatus = async (req, res) => {
  try {
    const { roomNumber, status } = req.body;

    if (!roomNumber || !status) {
      return res
        .status(400)
        .json({ message: "Room number and new status are required" });
    }

    // Find the latest request for that room
    const request = await MaintenanceRequest.findOne({ roomNumber }).sort({
      createdAt: -1,
    });

    if (!request) {
      return res
        .status(404)
        .json({ message: "No request found for this room" });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      message: "Request status updated successfully",
      requestId: request._id,
      roomNumber,
      newStatus: request.status,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete request

export const deleteRequest = async (req, res) => {
  try {
    const { roomNumber } = req.body;

    if (!roomNumber) {
      return res.status(400).json({ message: "Room number is required" });
    }

    // Find the most recent request for the room
    const request = await MaintenanceRequest.findOne({ roomNumber }).sort({
      createdAt: -1,
    });

    if (!request) {
      return res
        .status(404)
        .json({ message: "No request found for this room" });
    }

    await request.deleteOne();

    res.status(200).json({
      message: "Request deleted successfully",
      roomNumber: request.roomNumber,
      deletedRequestId: request._id,
    });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ message: "Server error" });
  }
};
