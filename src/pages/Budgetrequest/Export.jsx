
import { Button } from "reactstrap";
import * as XLSX from "xlsx";
import { FaPrint, FaFileExcel } from "react-icons/fa6";


export const PrintBudgetRequestTables = () => {
  const handlePrint = () => {
    // Get the two tables
    const amountTable = document.getElementById("budget-request-amount-table");
    const taskTable = document.getElementById("budget-request-task-table");

    // Create a new print window
    const printWindow = window.open("", "_blank", "width=900,height=700");

    // Write the content to the new window
    printWindow.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th, td {
              border: 1px solid #333;
              padding: 8px;
              text-align: center;
            }
            h5 {
              text-align: center;
              margin: 20px 0 10px;
            }
          </style>
        </head>
        <body>
          ${amountTable?.outerHTML || ""}
          ${taskTable?.outerHTML || ""}
        </body>
      </html>
    `);

    // Wait for content to load, then print
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <Button color="primary" onClick={handlePrint}>
      <FaPrint className="me-1" />
    </Button>
  );
};


export const ExportBudgetRequestTablesToExcel = () => {
  const handleExport = () => {
    const amountTable = document.getElementById("budget-request-amount-table");
    const taskTable = document.getElementById("budget-request-task-table");

    if (!amountTable || !taskTable) return;

    const wb = XLSX.utils.book_new();

    // Convert tables to arrays
    const amountData = XLSX.utils.sheet_to_json(
      XLSX.utils.table_to_sheet(amountTable),
      { header: 1 }
    );
    const taskData = XLSX.utils.sheet_to_json(
      XLSX.utils.table_to_sheet(taskTable),
      { header: 1 }
    );

    // Add header and footer
    const header = [
      ["Organization Name", "", "", "", "", "", "", "", "", ""],
      ["Budget Request Report", "", "", "", "", "", "", "", "", ""],
      ["Date: " + new Date().toLocaleDateString(), "", "", "", "", "", "", "", "", ""],
      [], // spacing
    ];
    const footer = [
      [], // spacing
      ["Prepared by: ______", "", "", "", "", "", "", "", "", ""],
    ];

    // Combine everything
    const combinedData = [...header, ...amountData, [], ...taskData, ...footer];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(combinedData);

    // Merge header cells
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }, // Org name
      { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } }, // Report title
      { s: { r: 2, c: 0 }, e: { r: 2, c: 9 } }, // Date
    ];

    // Wider columns
    const maxCol = Math.max(
      ...Object.keys(ws)
        .filter((k) => k[0] !== "!")
        .map((k) => XLSX.utils.decode_cell(k).c)
    );
    ws["!cols"] = new Array(maxCol + 1).fill({ wch: 20 });

    // Convert % numbers to text like "40%"
    Object.keys(ws).forEach((key) => {
      if (key[0] === "!") return;
      const cell = ws[key];
      if (typeof cell.v === "number" && cell.v > 0 && cell.v < 1) {
        cell.v = `${(cell.v * 100).toFixed(0)}%`;
        cell.t = "s";
      }
    });

    XLSX.utils.book_append_sheet(wb, ws, "Budget Request");
    XLSX.writeFile(wb, "budget_request_data.xlsx");
  };

  return (
    <Button color="success" onClick={handleExport}>
      <FaFileExcel className="me-1" />
    </Button>
  );
};
