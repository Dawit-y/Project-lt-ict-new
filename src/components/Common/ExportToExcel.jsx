import React from "react";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

const ExportToExcel = ({ tableData, tablename }) => {
  const { t } = useTranslation(); // Initialize translation

  // Function to export data to Excel
  const handleExportToExcel = () => {
    // Ensure tableData is not empty
    if (!tableData || tableData.length === 0) {
      console.error("No data to export.");
      return;
    }

    const headers = Object.keys(tableData[0]).map((key) => t(key)); // Localize headers

    const dataRows = tableData.map((row) => {
      return Object.values(row); // Get values from each row
    });

    const combinedData = [headers, ...dataRows];

    const worksheet = XLSX.utils.aoa_to_sheet(combinedData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Table Data");
    // make dounload able
    XLSX.writeFile(workbook, `table_${tablename}.xlsx`);
  };

  return (
    <button className="btn btn-primary mb-2" onClick={handleExportToExcel}>
      {t("exportToExcel")} {/* Localize button text */}
    </button>
  );
};

export default ExportToExcel;
