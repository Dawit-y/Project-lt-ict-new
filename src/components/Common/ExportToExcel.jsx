import React from "react";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
const ExportToExcel = ({ tableData, tablename, includeKey = [] }) => {
  const { t } = useTranslation();
  const handleExportToExcel = () => {
    if (!tableData || tableData.length === 0) {
      console.error("No data to export.");
      return;
    }
    const filteredKeys = Object.keys(tableData[0]).filter(
      (key) => includeKey.includes(key)
      );
    const headers = filteredKeys.map((key) => t(key));
    const dataRows = tableData.map((row) =>
      filteredKeys.map((key) => row[key])
      );
    const header = [
  ["Organization Name", "", ""], // Merged cells for the company name
  ["Report Title", "", ""], // Merged cells for the report title
  ["Date: " + new Date().toLocaleDateString(), "", ""], // Dynamic date
  [], // Empty row for spacing
  ];
    const footer = [
  [], // Empty row for spacing
  ["Prepared by: ______", "", ""]
  ];
    //const combinedData = [headers, ...dataRows];
    const combinedData = [...header, headers, ...dataRows, ...footer];
    const worksheet = XLSX.utils.aoa_to_sheet(combinedData);
    const workbook = XLSX.utils.book_new();
    const numCols = headers.length; // Number of columns to merge
    worksheet["!merges"] = [
      // Merge header rows
      { s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } }, // Merge row 1 (Company Name)
      { s: { r: 1, c: 0 }, e: { r: 1, c: numCols - 1 } }, // Merge row 2 (Report Title)
      { s: { r: 2, c: 0 }, e: { r: 2, c: numCols - 1 } }, // Merge row 3 (Date)
      // Merge footer rows
      {
        s: { r: combinedData.length - 2, c: 0 },
        e: { r: combinedData.length - 2, c: numCols - 1 },
      }, // Merge footer row 1 (Prepared by)
      {
        s: { r: combinedData.length - 1, c: 0 },
        e: { r: combinedData.length - 1, c: numCols - 1 },
      }, // Merge footer row 2 (End of Report)
      ];
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table Data");
    XLSX.writeFile(workbook, `table_${tablename}.xlsx`);
  };
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