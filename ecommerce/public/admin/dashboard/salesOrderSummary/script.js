// Basic instructions are provided to guide students.
// Students are required to implement any additional code deem necessary
// for their app to work.
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Redirect non-admins away
  if (!token || parseInt(role) !== 1) {
    window.location.href = "/auth/login";
    return;
  }

  const username = localStorage.getItem("username") || "Admin";
  document.getElementById("navUsername").textContent = username;

  // Set default date range: last 6 months to today
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  document.getElementById("endDate").value = formatDate(today);
  document.getElementById("startDate").value = formatDate(sixMonthsAgo);
});

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// =============================================================
// TODO: Implement this function to load the sales order summary
// This function should:
// 1. Read the filter values from the form
// 2. Send a GET request to the API endpoint with the filters
// 3. Display the results in the table 
// 4. Update the stat cards with the summary data
// =============================================================
async function loadSummary() {
  const token = localStorage.getItem("token");
  const msgEl = document.getElementById("message");
  msgEl.className = "message hidden";

  // 1. Read the filter values from the form
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const productCategory = document.getElementById("productCategory").value;
  const sortBy = document.getElementById("sortBy").value;
  const gender = document.getElementById("genderFilter").value;
  const status = document.getElementById("statusFilter").value;

  // 2. Put the filters into the URL 
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  params.append("productCategory", productCategory);
  params.append("sortBy", sortBy);
  params.append("gender", gender);
  params.append("status", status);

  try {
    const res = await fetch(
      "/api/admin/dashboard/salesOrderSummary?" + params.toString(),
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();

    if (data.success) {
      // 3. Show the table 
      renderTable(data.rows);
      // 4. Update the stat cards
      updateStatCards(data.rows);
    } else {
      showMessage(msgEl, data.message, "error");
      clearTable();
    }
  } catch (err) {
    showMessage(msgEl, "Failed to load data. Please try again.", "error");
  }
}

// =============================================================
// TODO: Implement this function to render the table
// This function should:
// 1. Accept an array of rows as a parameter
// 2. Loop through the rows and generate HTML table rows
// 3. Dispaly the rows in the table body
// =============================================================
function renderTable(rows) {
  const tbody = document.getElementById("summaryTableBody");
  const countEl = document.getElementById("resultCount");

  countEl.textContent = `${rows.length} records found`;

  // Nothing matched the filters
  if (rows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="table-placeholder">No records match your filters.</td>
      </tr>`;
    return;
  }

  // Build one table row for each record
  let html = "";
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const orderDate = new Date(row.orderDatetime).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    html += `
      <tr>
        <td>#${row.orderId}</td>
        <td>${orderDate}</td>
        <td>${row.customerName}</td>
        <td>${row.gender === "M" ? "Male" : "Female"}</td>
        <td>${row.productName}</td>
        <td>${row.category}</td>
        <td>${row.quantity}</td>
        <td>S$${parseFloat(row.unitPrice).toFixed(2)}</td>
        <td>S$${parseFloat(row.totalAmount).toFixed(2)}</td>
        <td>${row.status}</td>
      </tr>`;
  }

  tbody.innerHTML = html;
}

// =============================================================
// TODO: Implement this function to update the stat cards
// This function should:
// 1. Accept an array of rows as a parameter
// 2. Calculate the total orders, total revenue, total customers
//    and average order value 
// 3. Display the values in the stat cards
// =============================================================
function updateStatCards(rows) {
  let totalRevenue = 0;
  const orderIds = [];
  const customers = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    totalRevenue += parseFloat(row.totalAmount);

    // count each order ID once
    if (!orderIds.includes(row.orderId)) {
      orderIds.push(row.orderId);
    }

    if (!customers.includes(row.customerName)) {
      customers.push(row.customerName);
    }
  }

  const totalOrders = orderIds.length;
  let avgOrder = 0;
  if (totalOrders > 0) {
    avgOrder = totalRevenue / totalOrders;
  }

  document.getElementById("statTotalOrders").textContent = totalOrders;
  document.getElementById("statTotalRevenue").textContent = "S$" + totalRevenue.toFixed(2);
  document.getElementById("statTotalCustomers").textContent = customers.length;
  document.getElementById("statAvgOrder").textContent = "S$" + avgOrder.toFixed(2);
}

function clearTable() {
  const tbody = document.getElementById("summaryTableBody");
  const countEl = document.getElementById("resultCount");
  countEl.textContent = "No data loaded";
  tbody.innerHTML = `
    <tr>
      <td colspan="10" class="table-placeholder">
        <div class="placeholder-content">
          <div class="placeholder-icon">📊</div>
          <p>Use the filters above and click <strong>Search</strong> to load data.</p>
        </div>
      </td>
    </tr>`;

  // Reset stat cards
  ["statTotalOrders", "statTotalRevenue", "statTotalCustomers", "statAvgOrder"]
    .forEach((id) => {
      document.getElementById(id).textContent = "–";
    });
}

function resetFilters() {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  document.getElementById("startDate").value = formatDate(sixMonthsAgo);
  document.getElementById("endDate").value = formatDate(today);
  document.getElementById("productCategory").value = "";
  document.getElementById("sortBy").value = "order_date";
  document.getElementById("genderFilter").value = "";
  document.getElementById("statusFilter").value = "";

  clearTable();
  document.getElementById("message").className = "message hidden";
}

// =============================================================
// TODO: Implement this function to export the table as CSV
// This function should:
// 1. Read the table rows from the HTML table
// 2. Convert the rows to CSV format
// 3. Trigger a file download
// =============================================================
function exportCSV() {
  const msgEl = document.getElementById("message");
  const tableRows = document.querySelectorAll("#summaryTable tr");

  // Only the header row plus the placeholder row means there is no data
  if (tableRows.length <= 2 && document.querySelector(".table-placeholder")) {
    showMessage(msgEl, "No data to export. Click Search first.", "error");
    return;
  }

  // 1 and 2. Read each row and turn it into a line of CSV text
  let csv = "";
  for (let i = 0; i < tableRows.length; i++) {
    const cells = tableRows[i].querySelectorAll("th, td");
    const values = [];
    for (let j = 0; j < cells.length; j++) {
      // Wrap each value in quotes so commas inside names don't break the file
      values.push('"' + cells[j].textContent.trim().replace(/"/g, '""') + '"');
    }
    csv += values.join(",") + "\n";
  }

  // 3. Trigger the download
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "sales_order_summary.csv";
  link.click();
}

function showMessage(el, msg, type) {
  el.textContent = msg;
  el.className = `message ${type}`;
}

function logout() {
  localStorage.clear();
  window.location.href = "/auth/login";
}