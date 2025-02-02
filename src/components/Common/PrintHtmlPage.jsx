import React from "react";
import { useTranslation } from "react-i18next";
import {FOOTER_TEXT,COPYRIGHT_YEAR} from "../../constants/constantFile";
import {
  UncontrolledTooltip
} from "reactstrap";
const PrintHtmlPage = ({ tableData, tablename, excludeKey = [], columnsToIgnore=2 }) => {
  const { t } = useTranslation();
 //START PRINT
  const printPage = (event) => {
    console.log(event);
    const customHeader = getCustomHeader();
    const customFooter = getCustomFooter();
    const button = event.currentTarget;
    //const printableElement = button.closest("#printable-content");
    //const modalContent = printableElement.innerHTML;
    const modalContent = document.getElementById("printable-table").innerHTML;
    const printWindow = window.open("", "_blank", `width=${window.screen.width},height=${window.screen.height}`);
    printWindow.document.open();
    printWindow.document.write(`
      <html>
      <head>
      <title>${tablename}</title>
      <style>
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
          font-size:12px;
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
    // Function to generate custom header
  const getCustomHeader = () => {
    return `
    <div style="text-align: center; margin-bottom: 20px;">
    <h1>${tablename}</h1>
    <p>Printed on: ${new Date().toLocaleDateString()}</p>
    </div>
    `;
  };
  // Function to generate custom footer
  const getCustomFooter = () => {
    return `
    <div style="text-align: center; margin-top: 20px; font-size: 12px;">
    <p>© ${COPYRIGHT_YEAR} ${FOOTER_TEXT}. All rights reserved.</p>
    </div>
    `;
  };
//END PRINT
  return (
    <div id="print-cont">
    <button
    className="btn btn-soft-primary"
    onClick={printPage}
    disabled={!tableData || tableData.length === 0}
    >
    {t("print")}
    <UncontrolledTooltip placement="top" target="print-cont">
                    {t("print_tooltip")}
    </UncontrolledTooltip>
    </button>
    </div>
    );
};
export default PrintHtmlPage;