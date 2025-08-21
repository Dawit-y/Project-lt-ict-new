import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import { DropdownItem } from "reactstrap";
import { FaFileExcel } from "react-icons/fa";

const ExportToExcel = ({
  tableData,
  tableName,
  exportColumns = [],
  dropdownItem = false,
}) => {
  const { t } = useTranslation();

  const handleExportToExcel = async () => {
    if (!tableData || tableData.length === 0 || exportColumns.length === 0) {
      console.error("No data or exportColumns to export.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Table Data");

    const dateStr = new Date().toLocaleDateString();

    // Add custom header rows
    worksheet.addRow([t("Organization Name")]);
    worksheet.addRow([t("Report Title")]);
    worksheet.addRow(["Date: " + dateStr]);
    worksheet.addRow([]); // Spacer

    // Merge cells for custom headers
    [1, 2, 3].forEach((rowIdx) => {
      worksheet.mergeCells(rowIdx, 1, rowIdx, exportColumns.length);
      worksheet.getCell(rowIdx, 1).font = { bold: true, size: 14 };
    });

    // Add table headers with styling
    const headerLabels = exportColumns.map((col) => t(col.label));
    const headerRow = worksheet.addRow(headerLabels);
    headerRow.font = { bold: true, size: 12 };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D3D3D3" }, // Light gray
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add table rows
    tableData.forEach((row) => {
      const rowData = exportColumns.map((col) => {
        const rawValue = row[col.key];

        if (col.type === "number") {
          const cleaned = rawValue?.toString().replace(/,/g, "");
          const num = parseFloat(cleaned);
          return !isNaN(num) ? num : null;
        }

        if (col.type === "percentage") {
          // Convert "50%" → 0.5
          const numericPart = rawValue?.toString().replace("%", "").trim();
          const percent = parseFloat(numericPart);
          return !isNaN(percent) ? percent / 100 : null;
        }

        return col.format ? col.format(rawValue, row) : (rawValue ?? "");
      });

      const addedRow = worksheet.addRow(rowData);

      exportColumns.forEach((col, colIdx) => {
        const cell = addedRow.getCell(colIdx + 1);

        if (col.type === "number") {
          cell.numFmt = "#,##0.00";
        }

        if (col.type === "percentage") {
          cell.numFmt = "0.00%";
        }
      });
    });

    // Add footer
    worksheet.addRow([]);
    const preparedByRow = worksheet.addRow([t("Prepared by: ______")]);
    worksheet.mergeCells(
      preparedByRow.number,
      1,
      preparedByRow.number,
      exportColumns.length,
    );
    preparedByRow.getCell(1).font = { italic: true };

    // Set minimum column widths
    exportColumns.forEach((_, idx) => {
      const column = worksheet.getColumn(idx + 1);
      column.width = 20;
    });

    // Generate and save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const fileName = tableName || "Table";
    saveAs(blob, `${fileName}_${dateStr}.xlsx`);
  };

  if (dropdownItem) {
    return (
      <DropdownItem
        onClick={handleExportToExcel}
        disabled={!tableData || tableData.length === 0}
      >
        <FaFileExcel className="me-1" />
        {t("exportToExcel")}
      </DropdownItem>
    );
  }

  return (
    <button
      className="btn btn-soft-primary"
      onClick={handleExportToExcel}
      disabled={!tableData || tableData.length === 0}
    >
      {t("exportToExcel")}
    </button>
  );
};

export default ExportToExcel;
