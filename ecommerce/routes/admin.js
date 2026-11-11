const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.get(
  "/dashboard/salesOrderSummary",
  verifyToken,
  verifyAdmin,
  adminController.getSaleOrderSummary
);

module.exports = router;