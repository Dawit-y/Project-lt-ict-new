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
		const dataColumnsCount = exportColumns.length;

		// Add company/organization header
		const orgRow = worksheet.addRow([t("organization_name")]);
		orgRow.font = { bold: true, size: 16, color: { argb: "1F4E78" } };
		orgRow.alignment = { horizontal: "center" };
		// Only merge the actual data columns
		worksheet.mergeCells(1, 1, 1, dataColumnsCount);

		// Add report title
		const titleRow = worksheet.addRow([`${tableName} ${t("report")}`]);
		titleRow.font = { bold: true, size: 14, color: { argb: "2F5496" } };
		titleRow.alignment = { horizontal: "center" };
		// Only merge the actual data columns
		worksheet.mergeCells(2, 1, 2, dataColumnsCount);

		// Add export timestamp
		const dateRow = worksheet.addRow([`${t("generated_on")}: ${currentDate}`]);
		dateRow.font = { italic: true, size: 10 };
		dateRow.alignment = { horizontal: "center" };
		// Only merge the actual data columns
		worksheet.mergeCells(3, 1, 3, dataColumnsCount);

		// Add spacer
		worksheet.addRow([]);

		// Track the current row number for proper merging
		let currentRow = 5;

		// Add search criteria section if search params exist
		if (Object.keys(exportSearchParams).length > 0) {
			// Search Criteria Header
			const criteriaHeader = worksheet.addRow([t("search_criteria")]);
			criteriaHeader.font = { bold: true, size: 12, color: { argb: "44546A" } };
			// Apply background color only to data columns
			for (let i = 1; i <= dataColumnsCount; i++) {
				criteriaHeader.getCell(i).fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "D9E1F2" },
				};
			}
			// Only merge the actual data columns
			worksheet.mergeCells(currentRow, 1, currentRow, dataColumnsCount);
			currentRow++;

			// Add search parameters dynamically based on keys
			Object.entries(exportSearchParams).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== "") {
					// Try to get translation for the key, fallback to the key itself
					const displayKey = t(key, { defaultValue: key });
					const paramRow = worksheet.addRow([`${displayKey}: ${value}`]);
					// Apply background color only to data columns
					for (let i = 1; i <= dataColumnsCount; i++) {
						paramRow.getCell(i).fill = {
							type: "pattern",
							pattern: "solid",
							fgColor: { argb: "FFFFFF" }, // White background for criteria rows
						};
					}
					// Only merge the actual data columns
					worksheet.mergeCells(currentRow, 1, currentRow, dataColumnsCount);
					currentRow++;
				}
			});

			// Format search criteria rows
			for (let i = 6; i < currentRow; i++) {
				const row = worksheet.getRow(i);
				row.font = { size: 11 };
				const cell = row.getCell(1);
				cell.value = `• ${cell.value}`; // Add bullet points
			}

			// Add spacer after search criteria
			worksheet.addRow([]);
			currentRow++;

			// Add data summary header
			const dataHeader = worksheet.addRow([t("data_summary")]);
			dataHeader.font = { bold: true, size: 12, color: { argb: "44546A" } };
			// Apply background color only to data columns
			for (let i = 1; i <= dataColumnsCount; i++) {
				dataHeader.getCell(i).fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "E2EFDA" },
				};
			}
			// Only merge the actual data columns
			worksheet.mergeCells(currentRow, 1, currentRow, dataColumnsCount);
			currentRow++;

			// Add record count
			const countRow = worksheet.addRow([
				`${t("total_records")}: ${tableData.length}`,
			]);
			countRow.font = { bold: true };
			// Only merge the actual data columns
			worksheet.mergeCells(currentRow, 1, currentRow, dataColumnsCount);
			currentRow++;

			// Add spacer before table
			worksheet.addRow([]);
			currentRow++;
		} else {
			// If no search params, set currentRow to where the table starts
			currentRow = 5;
		}

		// Add table headers with styling
		const headerLabels = exportColumns.map((col) => t(col.label));
		const headerRow = worksheet.addRow(headerLabels);
		headerRow.font = { bold: true, size: 12, color: { argb: "FFFFFF" } };

		// Apply styling only to data columns
		for (let i = 1; i <= dataColumnsCount; i++) {
			const cell = headerRow.getCell(i);
			cell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "4472C4" }, // Professional blue
			};
			cell.alignment = { vertical: "middle", horizontal: "center" };
			cell.border = {
				top: { style: "thin", color: { argb: "000000" } },
				left: { style: "thin", color: { argb: "000000" } },
				bottom: { style: "thin", color: { argb: "000000" } },
				right: { style: "thin", color: { argb: "000000" } },
			};
		}

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
			const rowColor = index % 2 === 0 ? "D9E1F2" : "FFFFFF";

			// Apply background color and borders only to data columns
			for (let i = 1; i <= dataColumnsCount; i++) {
				const cell = addedRow.getCell(i);
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: rowColor },
				};

				// Add borders to all cells
				cell.border = {
					top: { style: "thin", color: { argb: "B4C6E7" } },
					left: { style: "thin", color: { argb: "B4C6E7" } },
					bottom: { style: "thin", color: { argb: "B4C6E7" } },
					right: { style: "thin", color: { argb: "B4C6E7" } },
				};

				// Apply formatting based on column type
				const col = exportColumns[i - 1];
				if (col && col.type === "number") {
					cell.numFmt = "#,##0.00";
					cell.alignment = { horizontal: "right" };
				}

				if (col && col.type === "percentage") {
					cell.numFmt = "0.00%";
					cell.alignment = { horizontal: "right" };
				}
			}
		});

		// Add footer section
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

			// Apply background color only to data columns
			for (let i = 1; i <= dataColumnsCount; i++) {
				totalsRow.getCell(i).fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "FCE4D6" }, // Light orange
				};
			}

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
			"", // Empty cell for the rest of the columns
		]);
		preparedByRow.font = { italic: true };
		// Only merge the first half of data columns
		const preparedByEndCol = Math.floor(dataColumnsCount / 2);
		if (preparedByEndCol > 1) {
			worksheet.mergeCells(
				preparedByRow.number,
				1,
				preparedByRow.number,
				preparedByEndCol
			);
		}

		const approvedByRow = worksheet.addRow([
			`${t("approved_by")}: ________________________`,
			"", // Empty cell for the rest of the columns
		]);
		approvedByRow.font = { italic: true };
		// Only merge the second half of data columns
		const approvedByEndCol = Math.floor(dataColumnsCount / 2);
		if (approvedByEndCol > 1) {
			worksheet.mergeCells(
				approvedByRow.number,
				1,
				approvedByRow.number,
				approvedByEndCol
			);
		}

		// Add confidentiality notice
		const confidentialRow = worksheet.addRow([t("confidential_notice")]);
		confidentialRow.font = { italic: true, size: 9, color: { argb: "FF0000" } };
		confidentialRow.alignment = { horizontal: "center" };
		// Only merge the actual data columns
		worksheet.mergeCells(
			confidentialRow.number,
			1,
			confidentialRow.number,
			dataColumnsCount
		);

		// Set column widths based on content or custom width
		exportColumns.forEach((col, idx) => {
			const column = worksheet.getColumn(idx + 1);

			// Use custom width if provided, otherwise calculate based on content
			if (col.width) {
				column.width = col.width;
			} else {
				// Calculate width based on header and data content
				const headerWidth = col.label.length * 1.5;
				let maxDataWidth = 0;

				// Check data values for this column
				tableData.forEach((row) => {
					const value = row[col.key];
					if (value !== null && value !== undefined) {
						const strValue = String(value);
						maxDataWidth = Math.max(maxDataWidth, strValue.length);
					}
				});

				// Set width with some padding (minimum 15, maximum 50)
				column.width = Math.min(
					50,
					Math.max(15, Math.max(headerWidth, maxDataWidth) + 2)
				);
			}
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
