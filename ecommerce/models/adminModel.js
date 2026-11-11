const { query } = require("../config/database");

const getSaleOrderSummary = async (
  startDate,
  endDate,
  gender,
  productCategory,
  ageGroup,
  status,
  sortBy,
  groupBy
) => {
  // TODO: get_sale_order_summary
  const result = await query(
    `TODO: SELECT * FROM get_sale_order_summary(...)`,
    [startDate, endDate, gender, productCategory, ageGroup, status, sortBy, groupBy]
  );
  return result.rows;
};

module.exports = { getSaleOrderSummary };