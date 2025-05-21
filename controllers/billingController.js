import Billing from "../models/Billing.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const generateInvoice = async (req, res) => {
  try {
    const {
      resident,
      roomNumber,
      roomFee,
      utilities,
      services,
      discount,
      lateFee,
      paymentMethod,
    } = req.body;

    const totalAmount = roomFee + utilities + services + lateFee - discount;

    const bill = await Billing.create({
      resident,
      roomNumber,
      roomFee,
      utilities,
      services,
      discount,
      lateFee,
      totalAmount,
      paymentMethod,
    });

    res.status(201).json({ message: "Invoice created", bill });
  } catch (error) {
    console.error("Generate invoice error:", error);
    res
      .status(500)
      .json({ message: "Failed to create invoice", error: error.message });
  }
};

// GET all invoices (Admin)
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Billing.find()
      .populate("resident", "name email") // Assuming `User` model has `name` and `email`
      .sort({ createdAt: -1 });

    res.status(200).json({ invoices });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch invoices", error: error.message });
  }
};

export const getMyInvoices = async (req, res) => {
  try {
    const residentId = req.user._id;

    const invoices = await Billing.find({ resident: residentId }).populate(
      "resident",
      "name email"
    );

    res.status(200).json({ invoices });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch your invoices", error: error.message });
  }
};

// Resident - Process Payment
export const processPayment = async (req, res) => {
  try {
    const { billId, method } = req.body;

    // Validate inputs
    if (!billId || !method) {
      return res
        .status(400)
        .json({ message: "billId and method are required" });
    }

    // Find the bill and populate resident
    const bill = await Billing.findById(billId).populate("resident");
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // Check if already paid
    if (bill.paid) {
      return res.status(400).json({ message: "Bill already paid" });
    }

    // Validate Stripe amount limit (Stripe only supports up to $999,999.99)
    if (method === "Stripe" && bill.totalAmount > 999999.99) {
      return res.status(400).json({
        message: "Payment failed",
        error: "Amount exceeds Stripe limit. Use PayPal or Cash for this bill.",
      });
    }

    // Process based on method
    if (method === "Stripe") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(bill.totalAmount * 100), // convert to cents
        currency: "usd",
        metadata: {
          billId: bill._id.toString(),
          residentId: bill.resident._id.toString(),
        },
      });

      // Mark as paid (simulate success, in prod use Stripe webhooks)
      bill.paid = true;
      bill.paymentMethod = "Stripe";
      bill.paymentIntentId = paymentIntent.id;
      await bill.save();

      return res.status(200).json({
        message: "Stripe payment processed",
        bill,
        clientSecret: paymentIntent.client_secret,
      });
    } else if (method === "Cash") {
      bill.paid = true;
      bill.paymentMethod = "Cash";
      await bill.save();

      return res.status(200).json({ message: "Cash payment successful", bill });
    } else if (method === "PayPal") {
      bill.paid = true;
      bill.paymentMethod = "PayPal";
      bill.paymentIntentId = "simulated-paypal-id";
      await bill.save();

      return res
        .status(200)
        .json({ message: "PayPal payment successful", bill });
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }
  } catch (error) {
    console.error("Process payment error:", error);
    return res.status(500).json({
      message: "Payment failed",
      error: error?.message || "Server error",
    });
  }
};

// Resident - Get Payment History
export const getPaymentHistory = async (req, res) => {
  try {
    const residentId = req.user.id;

    const paidBills = await Billing.find({ resident: residentId, paid: true })
      .sort({ createdAt: -1 })
      .select("-__v")
      .populate("resident", "name email");

    return res.status(200).json({ history: paidBills });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return res.status(500).json({
      message: "Failed to fetch payment history",
      error: error.message || "Server error",
    });
  }
};

// DELETE INVOICE - Admin
// ADMIN: Delete Invoice
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Invoice ID is required" });
    }

    const invoice = await Billing.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.paid) {
      return res.status(400).json({ message: "Cannot delete a paid invoice" });
    }

    await Billing.findByIdAndDelete(id);

    return res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Admin deleteInvoice error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete invoice", error: error.message });
  }
};
