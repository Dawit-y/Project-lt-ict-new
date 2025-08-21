import { Button } from "reactstrap";
import { FaFileExcel, FaPrint } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";

const addStructuredTable = (worksheet, title, headers, dataRows, startRow) => {
  const merges = [];

  // Add title row
  const titleRow = worksheet.getRow(startRow);
  titleRow.getCell(1).value = title;
  titleRow.font = { bold: true, size: 12 };
  titleRow.alignment = { horizontal: "center" };
  worksheet.mergeCells(startRow, 1, startRow, 10);
  startRow++;

  // Add header rows
  headers.forEach((headerRow, rowIdx) => {
    const excelRow = worksheet.getRow(startRow + rowIdx);
    let colIndex = 1;
    headerRow.forEach((cell) => {
      excelRow.getCell(colIndex).value = cell.value;
      excelRow.getCell(colIndex).font = { bold: true };
      excelRow.getCell(colIndex).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" },
      };
      excelRow.getCell(colIndex).alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      const rowspan = cell.rowspan || 1;
      const colspan = cell.colspan || 1;

      if (rowspan > 1 || colspan > 1) {
        merges.push({
          s: { r: startRow + rowIdx, c: colIndex },
          e: { r: startRow + rowIdx + rowspan - 1, c: colIndex + colspan - 1 },
        });
      }

      colIndex += colspan;
    });
  });

  // Add data rows
  dataRows.forEach((dataRow) => {
    const row = worksheet.addRow(dataRow);
    row.eachCell((cell) => {
      cell.alignment = { horizontal: "center" };
    });
  });

  // Return how many rows were written
  return {
    merges,
    rowsWritten: headers.length + dataRows.length + 1, // +1 for title
  };
};

export const ExportBudgetRequestTablesToExcel = ({
  brAmountsData,
  brTasksData,
  expendCodeMap,
}) => {
  const { t } = useTranslation();
  const amountTableHeaders = [
    [
      { value: "", rowspan: 2 },
      { value: "", rowspan: 2 },
      { value: "", rowspan: 2 },
      { value: "", rowspan: 2 },
      { value: t("source_of_finance"), colspan: 6 },
    ],
    [
      { value: "", rowspan: 1 },
      { value: "", rowspan: 1 },
      { value: "", rowspan: 1 },
      { value: "", rowspan: 1 },
      { value: "", rowspan: 1 },
      { value: "", rowspan: 1 },
      { value: t("external_assistance"), colspan: 2 },
      { value: t("foreign_debt"), colspan: 2 },
    ],
    [
      { value: t("s_n") },
      { value: t("expenditure_code") },
      { value: t("current_year_expense") },
      { value: t("requested_amount") },
      { value: t("gov_requested") },
      { value: t("internal_requested") },
      { value: t("support_requested") },
      { value: t("support_code") },
      { value: t("credit_requested") },
      { value: t("credit_code") },
    ],
  ];

  const taskTableHeaders = [
    [
      { value: t("s_n"), rowspan: 2 },
      { value: t("task_name"), rowspan: 2 },
      { value: t("measurement"), rowspan: 2 },
      { value: t("performance_last_year"), colspan: 2 },
      { value: t("performance_this_year"), colspan: 2 },
      { value: t("plans_coming_year"), colspan: 2 },
    ],
    [
      { value: "" },
      { value: "" },
      { value: "" },
      { value: t("physical") },
      { value: t("financial") },
      { value: t("physical") },
      { value: t("financial") },
      { value: t("physical") },
      { value: t("financial") },
    ],
  ];

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Budget Request", {
      views: [{ showGridLines: false }],
    });

    const now = new Date().toLocaleDateString();
    const orgName = worksheet.addRow([t("state_of_oromia")]);
    const reportTitle = worksheet.addRow(["Budget Request Report"]);
    const dateRow = worksheet.addRow([`Date: ${now}`]);

    [orgName, reportTitle].forEach((row) => {
      row.font = { bold: true, size: 14 };
      row.alignment = { horizontal: "center" };
    });

    dateRow.font = { italic: true };
    dateRow.alignment = { horizontal: "left" };

    worksheet.mergeCells("A1:J1");
    worksheet.mergeCells("A2:J2");
    worksheet.mergeCells("A3:J3");
    worksheet.addRow([]);

    // === Amount Table ===
    const amountDataRows = brAmountsData.map((row, idx) => [
      idx + 1,
      expendCodeMap[row.bra_expenditure_code_id],
      parseFloat(row.bra_current_year_expense || 0),
      parseFloat(row.bra_requested_amount || 0),
      parseFloat(row.bra_source_government_requested || 0),
      parseFloat(row.bra_source_internal_requested || 0),
      parseFloat(row.bra_source_support_requested || 0),
      row.bra_source_support_code || "-",
      parseFloat(row.bra_source_credit_requested || 0),
      row.bra_source_credit_code || "-",
    ]);

    const amountResult = addStructuredTable(
      worksheet,
      "Budget Request Amounts",
      amountTableHeaders,
      amountDataRows,
      worksheet.rowCount + 2,
    );

    // === Task Table ===
    const taskDataRows = brTasksData.map((row, index) => [
      index + 1,
      row.brt_task_name,
      row.brt_measurement,
      row.brt_previous_year_physical != null
        ? `${row.brt_previous_year_physical}%`
        : "-",
      row.brt_previous_year_financial != null
        ? parseFloat(row.brt_previous_year_financial)
        : "-",
      row.brt_current_year_physical != null
        ? `${row.brt_current_year_physical}%`
        : "-",
      row.brt_current_year_financial != null
        ? parseFloat(row.brt_current_year_financial)
        : "-",
      row.brt_next_year_physical != null
        ? `${row.brt_next_year_physical}%`
        : "-",
      row.brt_next_year_financial != null
        ? parseFloat(row.brt_next_year_financial)
        : "-",
    ]);

    const taskResult = addStructuredTable(
      worksheet,
      "Budget Request Tasks",
      taskTableHeaders,
      taskDataRows,
      worksheet.rowCount + 3,
    );

    // Apply merges
    [...amountResult.merges, ...taskResult.merges].forEach(({ s, e }) => {
      try {
        worksheet.mergeCells(s.r, s.c, e.r, e.c);
        worksheet.getCell(s.r, s.c).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      } catch (e) {
        console.warn("Merge issue:", e.message);
      }
    });

    // Apply borders only to data rows
    worksheet.eachRow((row, rowNumber) => {
      // Skip org name, report title, date, blank line, and section titles
      const isBorderedRow =
        rowNumber > 4 &&
        rowNumber !== amountResult.startRow &&
        rowNumber !== taskResult.startRow;

      if (isBorderedRow) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    // Adjust column widths
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 0;
        maxLength = Math.max(maxLength, length);
      });
      column.width = Math.min(Math.max(maxLength + 2, 8), 20);
    });

    // Add footer
    worksheet.addRow([]);
    const footerRow = worksheet.addRow(["Prepared by: ______"]);
    footerRow.font = { italic: true };

    // Download
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `budget_request_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  return (
    <Button color="success" onClick={handleExport}>
      <FaFileExcel className="" />
    </Button>
  );
};

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
      <FaPrint className="" />
    </Button>
  );
};
