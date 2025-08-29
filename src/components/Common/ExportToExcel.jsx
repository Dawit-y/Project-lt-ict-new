import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import { DropdownItem } from "reactstrap";
import { FaFileExcel } from "react-icons/fa";

const ExportToExcel = ({
	tableData,
	tableName,
	exportColumns = [],
	dropdownItem = false,
	exportSearchParams = {},
}) => {
	const { t } = useTranslation();

	const handleExportToExcel = async () => {
		if (!tableData || tableData.length === 0 || exportColumns.length === 0) {
			console.error("No data or exportColumns to export.");
			return;
		}

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Table Data");

		const dateStr = new Date().toLocaleDateString();
		const currentDate = new Date().toLocaleString();

		// Add company/organization header
		const orgRow = worksheet.addRow([t("organization_name")]);
		orgRow.font = { bold: true, size: 16, color: { argb: "1F4E78" } };
		orgRow.alignment = { horizontal: "center" };
		worksheet.mergeCells(1, 1, 1, exportColumns.length);

		// Add report title
		const titleRow = worksheet.addRow([`${tableName} ${t("report")}`]);
		titleRow.font = { bold: true, size: 14, color: { argb: "2F5496" } };
		titleRow.alignment = { horizontal: "center" };
		worksheet.mergeCells(2, 1, 2, exportColumns.length);

		// Add export timestamp
		const dateRow = worksheet.addRow([`${t("generated_on")}: ${currentDate}`]);
		dateRow.font = { italic: true, size: 10 };
		dateRow.alignment = { horizontal: "center" };
		worksheet.mergeCells(3, 1, 3, exportColumns.length);

		// Add spacer
		worksheet.addRow([]);

		// Add search criteria section if search params exist
		if (Object.keys(exportSearchParams).length > 0) {
			// Search Criteria Header
			const criteriaHeader = worksheet.addRow([t("search_criteria")]);
			criteriaHeader.font = { bold: true, size: 12, color: { argb: "44546A" } };
			criteriaHeader.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "D9E1F2" },
			};
			worksheet.mergeCells(5, 1, 5, exportColumns.length);

			// Add search parameters dynamically based on keys
			let rowNumber = 6;

			Object.entries(exportSearchParams).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== "") {
					// Try to get translation for the key, fallback to the key itself
					const displayKey = t(key, { defaultValue: key });
					worksheet.addRow([`${displayKey}: ${value}`]);
					rowNumber++;
				}
			});

			// Format search criteria rows
			for (let i = 6; i < rowNumber; i++) {
				const row = worksheet.getRow(i);
				row.font = { size: 11 };
				row.getCell(1).value = `• ${row.getCell(1).value}`; // Add bullet points
			}

			// Add spacer after search criteria
			worksheet.addRow([]);
			rowNumber++;

			// Add data summary header
			const dataHeader = worksheet.addRow([t("data_summary")]);
			dataHeader.font = { bold: true, size: 12, color: { argb: "44546A" } };
			dataHeader.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "E2EFDA" },
			};
			worksheet.mergeCells(rowNumber, 1, rowNumber, exportColumns.length);
			rowNumber++;

			// Add record count
			const countRow = worksheet.addRow([
				`${t("total_records")}: ${tableData.length}`,
			]);
			countRow.font = { bold: true };
			worksheet.mergeCells(rowNumber, 1, rowNumber, exportColumns.length);
			rowNumber++;

			// Add spacer before table
			worksheet.addRow([]);
			rowNumber++;
		}

		// Add table headers with styling
		const headerLabels = exportColumns.map((col) => t(col.label));
		const headerRow = worksheet.addRow(headerLabels);
		headerRow.font = { bold: true, size: 12, color: { argb: "FFFFFF" } };
		headerRow.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "4472C4" }, // Professional blue
		};
		headerRow.alignment = { vertical: "middle", horizontal: "center" };
		headerRow.border = {
			top: { style: "thin", color: { argb: "000000" } },
			left: { style: "thin", color: { argb: "000000" } },
			bottom: { style: "thin", color: { argb: "000000" } },
			right: { style: "thin", color: { argb: "000000" } },
		};

		// Add table rows with alternating colors
		tableData.forEach((row, index) => {
			const rowData = exportColumns.map((col) => {
				const rawValue = row[col.key];

				if (col.type === "number") {
					const cleaned = rawValue?.toString().replace(/,/g, "");
					const num = parseFloat(cleaned);
					return !isNaN(num) ? num : null;
				}

				if (col.type === "percentage") {
					const numericPart = rawValue?.toString().replace("%", "").trim();
					const percent = parseFloat(numericPart);
					return !isNaN(percent) ? percent / 100 : null;
				}

				return col.format ? col.format(rawValue, row) : (rawValue ?? "");
			});

			const addedRow = worksheet.addRow(rowData);

			// Alternate row colors for better readability
			if (index % 2 === 0) {
				addedRow.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "D9E1F2" }, // Light blue
				};
			}

			exportColumns.forEach((col, colIdx) => {
				const cell = addedRow.getCell(colIdx + 1);

				if (col.type === "number") {
					cell.numFmt = "#,##0.00";
					cell.alignment = { horizontal: "right" };
				}

				if (col.type === "percentage") {
					cell.numFmt = "0.00%";
					cell.alignment = { horizontal: "right" };
				}

				// Add borders to all cells
				cell.border = {
					top: { style: "thin", color: { argb: "B4C6E7" } },
					left: { style: "thin", color: { argb: "B4C6E7" } },
					bottom: { style: "thin", color: { argb: "B4C6E7" } },
					right: { style: "thin", color: { argb: "B4C6E7" } },
				};
			});
		});

		// Add footer section
		const lastRow = worksheet.lastRow.number;
		worksheet.addRow([]);

		// Add totals row if there are numeric columns
		const numericColumns = exportColumns.filter((col) => col.type === "number");
		if (numericColumns.length > 0) {
			// Calculate totals for each numeric column
			const totals = exportColumns.map((col, index) => {
				if (col.type === "number") {
					// Sum up all values in this column
					let total = 0;
					for (let i = 0; i < tableData.length; i++) {
						const rawValue = tableData[i][col.key];
						if (rawValue !== undefined && rawValue !== null) {
							const cleaned = rawValue.toString().replace(/,/g, "");
							const num = parseFloat(cleaned);
							if (!isNaN(num)) {
								total += num;
							}
						}
					}
					// Format as locale string with commas
					return total.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					});
				}
				return index === 0 ? t("total") : "";
			});

			const totalsRow = worksheet.addRow(totals);

			totalsRow.font = { bold: true };
			totalsRow.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "FCE4D6" }, // Light orange
			};

			// Apply number formatting to the numeric cells in totals row
			exportColumns.forEach((col, colIdx) => {
				if (col.type === "number") {
					const cell = totalsRow.getCell(colIdx + 1);
					cell.alignment = { horizontal: "right" };
					// Remove any existing number format since we're using formatted strings
					cell.numFmt = undefined;
				}
			});
		}

		// Add prepared by and approval sections
		worksheet.addRow([]);
		const preparedByRow = worksheet.addRow([
			`${t("prepared_by")}: ________________________`,
		]);
		preparedByRow.font = { italic: true };
		worksheet.mergeCells(
			preparedByRow.number,
			1,
			preparedByRow.number,
			Math.floor(exportColumns.length / 2)
		);

		const approvedByRow = worksheet.addRow([
			`${t("approved_by")}: ________________________`,
		]);
		approvedByRow.font = { italic: true };
		worksheet.mergeCells(
			approvedByRow.number,
			Math.ceil(exportColumns.length / 2) + 1,
			approvedByRow.number,
			exportColumns.length
		);

		// Add confidentiality notice
		const confidentialRow = worksheet.addRow([t("confidential_notice")]);
		confidentialRow.font = { italic: true, size: 9, color: { argb: "FF0000" } };
		confidentialRow.alignment = { horizontal: "center" };
		worksheet.mergeCells(
			confidentialRow.number,
			1,
			confidentialRow.number,
			exportColumns.length
		);

		// Set column widths based on content
		exportColumns.forEach((col, idx) => {
			const column = worksheet.getColumn(idx + 1);
			column.width = Math.max(15, col.label.length + 5); // Minimum width 15, adjust based on label length
		});

		// Generate and save file
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		const fileName = tableName || "Table";
		saveAs(blob, `${tableName}_Report_${dateStr.replace(/\//g, "-")}.xlsx`);
	};

	if (dropdownItem) {
		return (
			<DropdownItem
				onClick={handleExportToExcel}
				disabled={!tableData || tableData.length === 0}
			>
				<FaFileExcel className="me-1" />
				{t("exportToExcel")}
			</DropdownItem>
		);
	}

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
