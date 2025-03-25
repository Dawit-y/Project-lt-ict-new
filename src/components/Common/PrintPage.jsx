import React from "react";
import { useTranslation } from "react-i18next";

const PrintPage = ({ tableData, tablename, excludeKey = [], gridRef, columnDefs, columnsToIgnore = 0 }) => {
  const { t } = useTranslation();

  // Function to get printable content
  const getPrintableContent = () => {
    if (gridRef.current) {
      //const gridHtml = gridRef.current.api.getDataAsHtml();
      const rowCount = gridRef.current.api.getDisplayedRowCount(); // Get total displayed rows
      const printableData = [];

      // Loop through all displayed rows
      for (let i = 0; i < rowCount; i++) {
        const rowNode = gridRef.current.api.getDisplayedRowAtIndex(i); // Get row node by index
        const rowData = { ...rowNode.data };
        rowData.sn = i + 1;
        printableData.push(rowData);
      }
      // Construct HTML table
      let html = `<table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">`;
      // Add table headers
      html += `<thead><tr>`;
      columnDefs.forEach((col) => {
        if (!excludeKey.includes(col.field)) { // Exclude columns based on excludeKey
          html += `<th>${col.headerName || col.field}</th>`;
        }
      });
      html += `</tr></thead>`;
      // Add table rows
      html += `<tbody>`;
      printableData.forEach((row) => {
        html += `<tr>`;
        columnDefs.forEach((col) => {
          // if (!excludeKey.includes(col.field)) { // Exclude columns based on excludeKey
          html += `<td>${typeof row[col.field] === "number"
            ? row[col.field].toLocaleString()
            : row[col.field]}</td>`;
          // }
        });
        html += `</tr>`;
      });
      html += `</tbody></table>`;
      return html;
    }
    return "";
  };
  // Function to generate custom header
  const getCustomHeader = () => {
    return `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1>${tablename}</h1>
        <p>Report Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
    `;
  };
  // Function to generate custom footer
  const getCustomFooter = () => {
    return `
      <div style="text-align: center; margin-top: 20px; font-size: 12px;">
        <p>© 2023 Your Company Name. All rights reserved.</p>
      </div>
    `;
  };

  // Function to handle printing
  const printPage = () => {
    const modalContent = getPrintableContent();
    const customHeader = getCustomHeader();
    const customFooter = getCustomFooter();

    const printWindow = window.open("", "_blank", `width=${window.screen.width},height=${window.screen.height}`);
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>${tablename}</title>
          <style>
            .ag-header-cell-menu-button,
            .ag-pinned-left-header,
            .ag-pinned-right-header {
              display: none !important;
            }

            /* Adjust table layout */
            .ag-theme-alpine .ag-cell {
              border: 1px solid #000 !important;
            }

            /* Add a title to the printed page */
            .ag-grid-print-title {
              display: block;
              text-align: center;
              font-size: 20px;
              margin-bottom: 20px;
            }

            /* General styles */
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h1 {
              color: #333;
              font-size: 16px;
            }

            /* Bootstrap-like table styles */
            table {
              width: 100%;
              max-width: 100%;
              margin-bottom: 1rem;
              background-color: transparent;
              border-collapse: collapse;
            }
            table th,
            table td {
              padding: 0.25rem;
              vertical-align: top;
              border-top: 1px solid #dee2e6;
            }
            table thead th {
              vertical-align: bottom;
              border-bottom: 2px solid #ddd;
              background-color: #f8f9fa;
              color: #495057;
            }
            table tbody + tbody {
              border-top: 1px solid #ddd;
            }
            table.table-striped tbody tr:nth-of-type(odd) {
              background-color: rgba(0, 0, 0, 0.05);
            }
            table.table-bordered {
              border: 1px solid #ddd;
            }
            table.table-bordered th,
            table.table-bordered td {
              border: 1px solid #ddd;
            }

            /* Print-specific styles */
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .no-print {
                display: none; /* Hide elements with the class "no-print" */
              }
              table {
                border-collapse: collapse !important;
              }
              table th,
              table td {
                border: 1px solid #000 !important;
                font-size: 12px;
              }
              table th:nth-last-child(-n+${columnsToIgnore}),
              table td:nth-last-child(-n+${columnsToIgnore}) {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          ${customHeader}
          ${modalContent}
          ${customFooter}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div id="print-cont">
      <button
        className="btn btn-soft-primary"
        onClick={printPage}
        disabled={!tableData || tableData.length === 0}
      >
        {t("print")}
      </button>

    </div>
  );
};
export default PrintPage;