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

  const result = await query(
    `SELECT * FROM get_sale_order_summary(
      $1::date,
      $2::date,
      $3::char,
      $4::varchar,
      $5::varchar,
      $6::varchar,
      $7::varchar,
      $8::varchar
    )`,
    [startDate, endDate, gender, productCategory, ageGroup, status, sortBy, groupBy]
  );
  return result.rows;
};

module.exports = { getSaleOrderSummary };