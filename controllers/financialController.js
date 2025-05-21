import Payment from "../models/Payment.js";
import Room from "../models/Room.js";
import Expense from "../models/Expense.js";
export const createPayment = async (req, res) => {
  const { residentId, amount, method } = req.body;
  const payment = await Payment.create({ residentId, amount, method });
  res.status(201).json(payment);
};

export const getPayments = async (req, res) => {
  const payments = await Payment.find().populate("residentId", "name email");
  res.status(200).json(payments);
};

export const createExpense = async (req, res) => {
  const { category, amount, description } = req.body;
  const expense = await Expense.create({ category, amount, description });
  res.status(201).json(expense);
};

export const getExpenses = async (req, res) => {
  const expenses = await Expense.find();
  res.status(200).json(expenses);
};

export const getOverviewReport = async (req, res) => {
  const payments = await Payment.find();
  const expenses = await Expense.find();
  const rooms = await Room.find();

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const occupiedRooms = rooms.filter((r) => r.isOccupied).length;
  const occupancyRate = rooms.length ? (occupiedRooms / rooms.length) * 100 : 0;

  res.json({ totalRevenue, totalExpenses, netProfit, occupancyRate });
};

export const getMonthlyTrends = async (req, res) => {
  const year = new Date().getFullYear();

  const payments = await Payment.aggregate([
    { $match: { date: { $gte: new Date(`${year}-01-01`) } } },
    {
      $group: {
        _id: { $month: "$date" },
        revenue: { $sum: "$amount" },
      },
    },
  ]);

  const expenses = await Expense.aggregate([
    { $match: { date: { $gte: new Date(`${year}-01-01`) } } },
    {
      $group: {
        _id: { $month: "$date" },
        expense: { $sum: "$amount" },
      },
    },
  ]);

  res.json({ payments, expenses });
};
