import React from "react";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

const ExportToExcel = ({ tableData, tablename, excludeKey = [] }) => {
  const { t } = useTranslation();

  const handleExportToExcel = () => {
    if (!tableData || tableData.length === 0) {
      console.error("No data to export.");
      return;
    }

    const filteredKeys = Object.keys(tableData[0]).filter(
      (key) => !excludeKey.includes(key)
    );

    const headers = filteredKeys.map((key) => t(key));
    const dataRows = tableData.map((row) =>
      filteredKeys.map((key) => row[key])
    );

    const combinedData = [headers, ...dataRows];

    const worksheet = XLSX.utils.aoa_to_sheet(combinedData);
    const workbook = XLSX.utils.book_new();
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
