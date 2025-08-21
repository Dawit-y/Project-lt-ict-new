import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTranslation } from "react-i18next";
import { DropdownItem } from "reactstrap";
import { FaFilePdf } from "react-icons/fa";

const ExportToPDF = ({
  tableData,
  tableName,
  exportColumns = [],
  dropdownItem = false,
  extraContext = {}, // Optional: pass transactionTypes, visitTypes, etc.
}) => {
  const { t } = useTranslation();
  const headerText = tableName;
  const footerText = `${t("preparedBy") || "Prepared by"}: ____`;
  const dateStr = new Date().toLocaleDateString();

  const addHeaderFooter = (doc) => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(12);
      doc.text(headerText, 14, 10);

      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height || pageSize.getHeight();
      doc.setFontSize(10);
      doc.text(footerText, 14, pageHeight - 10);
    }
  };

  const handleExportToPDF = () => {
    if (!tableData || tableData.length === 0 || exportColumns.length === 0) {
      console.error("No data or exportColumns to export.");
      return;
    }

    const chunkSize = 7;
    const columnChunks = [];
    for (let i = 0; i < exportColumns.length; i += chunkSize) {
      columnChunks.push(exportColumns.slice(i, i + chunkSize));
    }

    const doc = new jsPDF({ orientation: "landscape" });
    let startY = 20;

    columnChunks.forEach((colChunk, index) => {
      if (index > 0) {
        startY += 80;
        if (startY + 50 > doc.internal.pageSize.height) {
          doc.addPage();
          startY = 20;
        }
      }

      // ✅ Use translated headers
      const headers = ["#", ...colChunk.map((col) => t(col.label || col.key))];

      // ✅ Format cell values, passing context
      const dataRows = tableData.map((row, rowIndex) => [
        rowIndex + 1,
        ...colChunk.map((col) =>
          col.format
            ? col.format(row[col.key], row, rowIndex, { t, ...extraContext })
            : (row[col.key] ?? ""),
        ),
      ]);

      autoTable(doc, {
        head: [headers],
        body: dataRows,
        startY,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] },
        theme: "grid",
        showHead: "everyPage",
      });

      startY = doc.lastAutoTable.finalY + 10;
    });

    addHeaderFooter(doc);
    doc.save(`${tableName || "table_data"}_${dateStr}.pdf`);
  };

  if (dropdownItem) {
    return (
      <DropdownItem
        onClick={handleExportToPDF}
        disabled={!tableData || tableData.length === 0}
      >
        <FaFilePdf className="me-1" />
        {t("exportToPdf")}
      </DropdownItem>
    );
  }

  return (
    <button
      className="btn btn-soft-primary"
      onClick={handleExportToPDF}
      disabled={!tableData || tableData.length === 0}
    >
      {t("exportToPdf")}
    </button>
  );
};

export default ExportToPDF;
