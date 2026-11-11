const adminModel = require("../models/adminModel");

const getSaleOrderSummary = async (req, res) => {
  try {
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;
    const gender = req.query.gender || null;
    const productCategory = req.query.productCategory || null;
    const ageGroup = req.query.ageGroup || null;
    const status = req.query.status || null;
    const sortBy = req.query.sortBy || null;
    const groupBy = req.query.groupBy || null;

    const rows = await adminModel.getSaleOrderSummary(
      startDate,
      endDate,
      gender,
      productCategory,
      ageGroup,
      status,
      sortBy,
      groupBy
    );

    res.json({ success: true, rows });
  } catch (err) {
    console.error(err);
    // P0001 error message
    if (err.code === "P0001") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { getSaleOrderSummary };