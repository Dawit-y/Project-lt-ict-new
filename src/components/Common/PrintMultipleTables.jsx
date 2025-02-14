import React from "react";
import { useTranslation } from "react-i18next";
import { FOOTER_TEXT, COPYRIGHT_YEAR } from "../../constants/constantFile";
import { UncontrolledTooltip } from "reactstrap";

const PrintMultipleTables = ({ tables = [], columnsToIgnore = 2, title }) => {
    const { t } = useTranslation();

    const printPage = () => {
        const printWindow = window.open("", "_blank", `width=${window.screen.width},height=${window.screen.height}`);
        printWindow.document.open();

        let tableContent = tables.map(({ tablename, data, excludeKey = [] }) => {
            if (!data || data.length === 0) return "";

            // Get table headers excluding specified keys and translate them
            const headers = Object.keys(data[0])
                .filter((key) => !excludeKey.includes(key))
                .map((key) => t(key));

            return `
        <div style="margin-bottom: 20px;">
          <h2 style="text-align: start; font-size: 16px; font-weight: 900; font-family: 'Arial Black', sans-serif;">${t(tablename)}</h2>
          <table class="print-table">
            <thead>
              <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${Object.keys(row)
                    .filter((key) => !excludeKey.includes(key))
                    .map(key => `<td>${row[key] || ""}</td>`)
                    .join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
        }).join("");

        printWindow.document.write(`
      <html>
      <head>
        <title>${t(`${title || "printed_data"}`)}</title>
        <style>
          @page { size: A4 landscape; margin: 20px; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
          h2 { color: #333; font-size: 14px; margin-bottom: 10px; }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            table-layout: auto;
          }
          .print-table th, .print-table td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
            word-wrap: break-word;
            white-space: normal;
            max-width: 150px;
          }
          
          .print-table th:nth-last-child(-n+${columnsToIgnore}), 
          .print-table td:nth-last-child(-n+${columnsToIgnore}) {
            display: none;
          }

          .footer {
            text-align: center; 
            margin-top: 20px; 
            font-size: 10px; 
          }

          .scale-content {
            transform: scale(0.9);
            transform-origin: top left;
          }
        </style>
      </head>
      <body class="scale-content">
        ${getCustomHeader()}
        ${tableContent}
        ${getCustomFooter()}
      </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    };

    const getCustomHeader = () => `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="font-size: 18px;">${t(`${title || "Printed Data"}`)}</h1>
      <p style="font-size: 12px;">${t("date")}: ${new Date().toLocaleDateString()}</p>
    </div>
  `;

    const getCustomFooter = () => `
    <div class="footer">
      <p>© ${COPYRIGHT_YEAR} ${t(FOOTER_TEXT)}. ${t("All rights reserved.")}</p>
    </div>
  `;

    return (
        <div id="print-cont">
            <button
                className="btn btn-soft-primary"
                onClick={printPage}
                disabled={!tables || tables.length === 0}
            >
                {t("print")}
                <UncontrolledTooltip placement="top" target="print-cont">
                    {t("print_tooltip")}
                </UncontrolledTooltip>
            </button>
        </div>
    );
};

export default PrintMultipleTables;
