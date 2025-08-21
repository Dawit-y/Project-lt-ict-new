import React from "react";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import { DropdownItem } from "reactstrap";
import { FaFileWord } from "react-icons/fa";

const ExportToDOCX = ({
  tableData,
  tablename,
  includeKey = [],
  dropdownItem = false,
}) => {
  const { t } = useTranslation();
  const headerText = tablename; // Custom header text
  const footerText = "Prepared by: ____"; // Custom footer text

  const handleExportToDOCX = async () => {
    if (!tableData || tableData.length === 0) return;

    const filteredKeys = Object.keys(tableData[0]).filter((key) =>
      includeKey.includes(key),
    );

    // Build the table header row
    const headerRow = new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Index")],
          width: { size: 1000, type: WidthType.DXA },
        }),
        ...filteredKeys.map(
          (key) =>
            new TableCell({
              children: [new Paragraph(t(key))],
              width: { size: 2000, type: WidthType.DXA },
            }),
        ),
      ],
    });

    // Build the data rows
    const dataRows = tableData.map((row, rowIndex) => {
      return new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph((rowIndex + 1).toString())],
          }),
          ...filteredKeys.map(
            (key) =>
              new TableCell({
                children: [new Paragraph(row[key]?.toString() || "")],
              }),
          ),
        ],
      });
    });

    // Create the DOCX document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: headerText,
              heading: "Heading1",
              spacing: { after: 200 },
            }),
            new Table({
              rows: [headerRow, ...dataRows],
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
            }),
            new Paragraph({ text: "", spacing: { after: 200 } }),
            new Paragraph(footerText),
          ],
        },
      ],
    });

    // Save the file
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${tablename || "table_data"}.docx`);
  };

  if (dropdownItem) {
    return (
      <DropdownItem onClick={handleExportToDOCX} disabled={!tableData?.length}>
        <FaFileWord className="me-1" />
        {t("exportToDocx")}
      </DropdownItem>
    );
  }

  return (
    <button
      className="btn btn-soft-success"
      onClick={handleExportToDOCX}
      disabled={!tableData || tableData.length === 0}
    >
      <FaFileWord className="me-1" />
      {t("exportToDocx")}
    </button>
  );
};

export default ExportToDOCX;
