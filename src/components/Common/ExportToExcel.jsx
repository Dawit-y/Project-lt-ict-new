import React from "react";
import * as XLSX from "xlsx";

const ExportToExcel = ({ tableData ,tablename}) => {

  // Function to export data to Excel
  const handleExportToExcel = () => {
    // 1. Convert table data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(tableData);

    // 2. Create a new workbook
    const workbook = XLSX.utils.book_new();

    // 3. Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table Data");

    // 4. Create Excel file and download it
    XLSX.writeFile(workbook, `table_${tablename}.xlsx`);
  };

  return (
    <button className="btn btn-secondary" onClick={handleExportToExcel}>
    Export to Excel
  </button>
  
  );
};

export default ExportToExcel;
