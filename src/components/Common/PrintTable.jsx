import React from "react";
import { useTranslation } from "react-i18next";
import { DropdownItem } from "reactstrap";
import { FaPrint } from "react-icons/fa";

const PrintTable = ({
  tableData,
  tableName,
  exportColumns = [],
  dropdownItem = false,
}) => {
  const { t } = useTranslation();

  const handlePrint = () => {
    if (!tableData || tableData.length === 0 || exportColumns.length === 0) {
      console.error("No data or exportColumns to export.");
      return;
    }

    const chunkSize = 6; // Number of columns per table
    const columnChunks = [];
    for (let i = 0; i < exportColumns.length; i += chunkSize) {
      columnChunks.push(exportColumns.slice(i, i + chunkSize));
    }

    const title = tableName || t("Report");
    const date = new Date().toLocaleDateString();

    let bodyHtml = `
      <h2 style="text-align: center;">${title}</h2>
      <p style="text-align: center;">${date}</p>
    `;

    columnChunks.forEach((colChunk, chunkIndex) => {
      const tableHeaders = colChunk
        .map(
          (col) =>
            `<th style="border: 1px solid #ccc; padding: 8px; background: #f0f0f0;">${t(
              col.label,
            )}</th>`,
        )
        .join("");

      const tableRows = tableData
        .map((row) => {
          return `<tr>${colChunk
            .map((col) => {
              const value = row[col.key];
              const formatted = col.format ? col.format(value) : value;
              return `<td style="border: 1px solid #ccc; padding: 8px;">${
                formatted ?? ""
              }</td>`;
            })
            .join("")}</tr>`;
        })
        .join("");

      bodyHtml += `
        <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
          <thead><tr>${tableHeaders}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
        <div style="page-break-after: always;"></div>
      `;
    });

    bodyHtml += `
      <p style="margin-top: 40px;">${t("Prepared by")}: __________________</p>
    `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            @media print {
              table { page-break-inside: avoid; }
              div { page-break-after: always; }
            }
          </style>
        </head>
        <body>${bodyHtml}</body>
      </html>
    `);
    newWindow.document.close();

    newWindow.onload = function () {
      newWindow.focus();
      newWindow.print();
      newWindow.close();
    };
  };

  if (dropdownItem) {
    return (
      <DropdownItem
        onClick={handlePrint}
        disabled={!tableData || tableData.length === 0}
      >
        <FaPrint className="me-1" />
        {t("print")}
      </DropdownItem>
    );
  }

  return (
    <button
      className="btn btn-soft-primary"
      onClick={handlePrint}
      disabled={!tableData || tableData.length === 0}
    >
      {t("print")}
    </button>
  );
};

export default PrintTable;
