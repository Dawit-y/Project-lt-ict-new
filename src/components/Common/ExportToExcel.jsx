import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import { DropdownItem, Button } from "reactstrap";
import { FaFileExcel } from "react-icons/fa";

const ExportToExcel = ({
	tableData,
	tableName,
	exportColumns = [],
	dropdownItem = false,
	exportSearchParams = {},
}) => {
	const { t } = useTranslation();

	/** =====================
	 * Helpers
	 ===================== */

	const getLeafColumns = (columns) => {
		const result = [];
		const traverse = (cols) => {
			cols.forEach((col) => {
				if (col.columns) traverse(col.columns);
				else result.push(col);
			});
		};
		traverse(columns);
		return result;
	};

	const countLeaves = (col) => {
		if (!col.columns || col.columns.length === 0) return 1;
		return col.columns.reduce((sum, child) => sum + countLeaves(child), 0);
	};

	const getDepth = (cols) => {
		let max = 1;
		cols.forEach((c) => {
			if (c.columns && c.columns.length > 0) {
				max = Math.max(max, 1 + getDepth(c.columns));
			}
		});
		return max;
	};

	// --- CRITICAL FIX: REWRITING buildHeaderRows for absolute indexing ---
	const buildHeaderRows = (columns) => {
		const maxDepth = getDepth(columns);
		const rows = Array.from({ length: maxDepth }, () => []);

		// The key here is tracking column start/end points using a recursive data structure.

		const processColumn = (col, depth, currentColStart) => {
			const currentRow = rows[depth];
			const isGroup = !!col.columns;
			const leafSpan = isGroup ? countLeaves(col) : 1;
			const rowSpan = isGroup ? 1 : maxDepth - depth;
			const currentColEnd = currentColStart + leafSpan - 1;

			currentRow.push({
				label: t(col.label),
				colStart: currentColStart,
				colSpan: leafSpan,
				rowSpan: rowSpan,
				isGroup: isGroup,
			});

			if (isGroup) {
				let nextChildColStart = currentColStart;
				col.columns.forEach((childCol) => {
					// Recursively call for children
					const childLeafSpan = countLeaves(childCol);
					processColumn(childCol, depth + 1, nextChildColStart);
					nextChildColStart += childLeafSpan;
				});
			}

			// Return the number of leaf columns processed by this node
			return leafSpan;
		};

		// 1. Process SN column - Add to ALL rows with proper merging
		const snHeader = {
			label: t("SN"),
			colStart: 1,
			colSpan: 1,
			rowSpan: maxDepth,
			isSN: true,
		};

		// Add SN header only to the first row
		rows[0].push(snHeader);

		// For subsequent rows, add empty placeholder cells that will be covered by the merge
		for (let i = 1; i < maxDepth; i++) {
			rows[i].push({
				label: "", // EMPTY label for placeholder
				colStart: 1,
				colSpan: 1,
				rowSpan: 1,
				isSN: true,
				isPlaceholder: true, // Mark as placeholder
			});
		}

		// 2. Process Data columns
		let currentDataColStart = 2; // Data starts after SN (column 1)
		columns.forEach((col) => {
			const span = processColumn(col, 0, currentDataColStart);
			currentDataColStart += span;
		});

		return rows;
	};

	/** =====================
	 * Export Handler
	 * ===================== */
	const handleExportToExcel = async () => {
		if (!tableData?.length || !exportColumns?.length) {
			console.error("No data or exportColumns to export.");
			return;
		}

		try {
			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet(tableName || "Table Data");
			const leafColumns = getLeafColumns(exportColumns);
			const dataColumnsCount = leafColumns.length + 1; // +1 for SN
			const dateStr = new Date().toLocaleDateString().replace(/\//g, "-");
			const currentDate = new Date().toLocaleString();

			// Styling constants
			const HEADER_BG = "4472C4";
			const HEADER_FONT_COLOR = "FFFFFF";
			const SEARCH_PARAM_BG = "D9E1F2";
			const ROW_COLOR_1 = "D9E1F2";
			const ROW_COLOR_2 = "FFFFFF";
			const BORDER_COLOR = "B4C6E7";

			/** ======= TITLE & META ======= */
			worksheet.mergeCells(1, 1, 1, dataColumnsCount);
			worksheet.getCell(1, 1).value = t("organization_name");
			Object.assign(worksheet.getCell(1, 1), {
				font: { bold: true, size: 16, color: { argb: "1F4E78" } },
				alignment: { horizontal: "center" },
			});

			worksheet.mergeCells(2, 1, 2, dataColumnsCount);
			worksheet.getCell(2, 1).value = `${tableName} ${t("report")}`;
			Object.assign(worksheet.getCell(2, 1), {
				font: { bold: true, size: 14, color: { argb: "2F5496" } },
				alignment: { horizontal: "center" },
			});

			worksheet.mergeCells(3, 1, 3, dataColumnsCount);
			worksheet.getCell(3, 1).value = `${t("generated_on")}: ${currentDate}`;
			Object.assign(worksheet.getCell(3, 1), {
				font: { italic: true, size: 10 },
				alignment: { horizontal: "center" },
			});

			worksheet.addRow([]); // Blank line

			/** ======= SEARCH PARAMS ======= */
			let currentRow = 5;
			if (Object.keys(exportSearchParams).length > 0) {
				const headerRow = worksheet.addRow([]);
				headerRow.getCell(1).value = t("search_criteria");
				worksheet.mergeCells(currentRow, 1, currentRow, dataColumnsCount);
				Object.assign(headerRow.getCell(1), {
					font: { bold: true, size: 12, color: { argb: "44546A" } },
					alignment: { horizontal: "left" },
					fill: {
						type: "pattern",
						pattern: "solid",
						fgColor: { argb: SEARCH_PARAM_BG },
					},
				});
				currentRow++;

				Object.entries(exportSearchParams).forEach(([k, v]) => {
					if (v !== undefined && v !== null && v !== "") {
						const row = worksheet.addRow([]);
						row.getCell(1).value = `• ${t(k)}: ${v}`;
						worksheet.mergeCells(row.number, 1, row.number, dataColumnsCount);
						row.alignment = { horizontal: "left" };
						currentRow++;
					}
				});
				worksheet.addRow([]); // Blank line after search params
				currentRow = worksheet.lastRow.number + 1;
			}

			// --- Data Summary Header ---
			const dataHeader = worksheet.addRow([]);
			dataHeader.getCell(1).value = t("data_summary"); // Fixed from 2 to 1
			dataHeader.font = { bold: true, size: 12, color: { argb: "44546A" } };
			dataHeader.alignment = { horizontal: "left" };
			for (let i = 1; i <= dataColumnsCount; i++) {
				// Changed from i=2 to i=1
				dataHeader.getCell(i).fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "E2EFDA" },
				};
			}
			worksheet.mergeCells(currentRow, 1, currentRow, dataColumnsCount); // Fixed from 2 to 1
			currentRow++;

			// --- Total Records Row ---
			const countRow = worksheet.addRow([]);
			countRow.getCell(1).value = `${t("total_records")}: ${tableData.length}`;
			countRow.font = { bold: true };
			countRow.alignment = { horizontal: "left" };
			worksheet.mergeCells(currentRow, 1, currentRow, dataColumnsCount);
			currentRow++;

			worksheet.addRow([]);
			currentRow++;

			/** ======= HEADER ROWS ======= */
			const headerRows = buildHeaderRows(exportColumns);
			const headerStartRow = currentRow;

			// Pre-create rows to avoid "A Cell needs a Row" error during merge styling
			for (let i = 0; i < headerRows.length; i++) {
				worksheet.getRow(headerStartRow + i) || worksheet.addRow({});
			}

			// Utility function for applying header styles
			const applyHeaderStyle = (cell) => {
				cell.font = {
					bold: true,
					size: 12,
					color: { argb: HEADER_FONT_COLOR },
				};
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: HEADER_BG },
				};
				cell.alignment = { vertical: "middle", horizontal: "center" };
				cell.border = {
					top: { style: "thin" },
					left: { style: "thin" },
					bottom: { style: "thin" },
					right: { style: "thin" },
				};
			};

			// Create header cells and apply merging/styling
			headerRows.forEach((row, rowIndex) => {
				const excelRowNumber = headerStartRow + rowIndex;

				row.forEach((headerCell) => {
					const startRow = excelRowNumber;
					const startCol = headerCell.colStart;
					const isMerged = headerCell.colSpan > 1 || headerCell.rowSpan > 1;

					const cell = worksheet.getCell(startRow, startCol);

					// Set value only if it's NOT a placeholder
					if (!headerCell.isPlaceholder) {
						cell.value = headerCell.label;
					}
					applyHeaderStyle(cell);

					// Handle merging
					if (isMerged) {
						const endRow = startRow + headerCell.rowSpan - 1;
						const endCol = startCol + headerCell.colSpan - 1;

						worksheet.mergeCells(startRow, startCol, endRow, endCol);

						// Style all merged cells
						for (let r = startRow; r <= endRow; r++) {
							for (let c = startCol; c <= endCol; c++) {
								const mergedCell = worksheet.getCell(r, c);

								// Only apply styling to non-anchor cells
								if (r !== startRow || c !== startCol) {
									applyHeaderStyle(mergedCell);
								}
							}
						}
					}
				});
			});

			// Re-anchor currentRow after headers
			currentRow = worksheet.lastRow.number + 1;

			// Re-anchor currentRow after headers
			currentRow = worksheet.lastRow.number + 1;

			/** ======= DATA ROWS ======= */
			tableData.forEach((row, idx) => {
				const rowData = [
					idx + 1,
					...leafColumns.map((col) => {
						const val = row[col.key];

						// Handle numeric/percentage types
						if (col.type === "number") {
							const num = parseFloat(val?.toString().replace(/,/g, "") || 0);
							return isNaN(num) ? null : num;
						}
						if (col.type === "percentage") {
							const pct = parseFloat(val?.toString().replace(/%/g, "") || 0);
							return isNaN(pct) ? null : pct / 100;
						}

						return col.format ? col.format(val, row) : (val ?? "");
					}),
				];

				const excelRow = worksheet.addRow(rowData);
				const rowColor = idx % 2 === 0 ? ROW_COLOR_1 : ROW_COLOR_2;

				// Apply styling to ALL cells in the data row
				excelRow.eachCell((cell, colNumber) => {
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: { argb: rowColor },
					};
					cell.border = {
						top: { style: "thin", color: { argb: BORDER_COLOR } },
						left: { style: "thin", color: { argb: BORDER_COLOR } },
						bottom: { style: "thin", color: { argb: BORDER_COLOR } },
						right: { style: "thin", color: { argb: BORDER_COLOR } },
					};

					if (colNumber === 1) cell.alignment = { horizontal: "center" };

					const col = leafColumns[colNumber - 2];
					if (col?.type === "number") {
						cell.numFmt = "#,##0.00";
						cell.alignment = { horizontal: "right" };
					} else if (col?.type === "percentage") {
						cell.numFmt = "0.00%";
						cell.alignment = { horizontal: "right" };
					}
				});
			});

			/** ======= TOTALS ======= */
			const numericCols = leafColumns.filter((c) => c.type === "number");
			if (numericCols.length) {
				const totals = [
					t("total"),
					...leafColumns.map((col) => {
						if (col.type === "number") {
							return tableData.reduce((sum, r) => {
								const num = parseFloat(
									r[col.key]?.toString().replace(/,/g, "") || 0
								);
								return isNaN(num) ? sum : sum + num;
							}, 0);
						}
						return "";
					}),
				];
				const totalsRow = worksheet.addRow(totals);
				totalsRow.font = { bold: true };
				totalsRow.eachCell((cell, colNumber) => {
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: { argb: "FCE4D6" },
					};
					cell.border = {
						top: { style: "thin", color: { argb: BORDER_COLOR } },
						left: { style: "thin", color: { argb: BORDER_COLOR } },
						bottom: { style: "thin", color: { argb: BORDER_COLOR } },
						right: { style: "thin", color: { argb: BORDER_COLOR } },
					};

					if (colNumber > 1 && leafColumns[colNumber - 2]?.type === "number") {
						cell.numFmt = "#,##0.00";
						cell.alignment = { horizontal: "right" };
					}
				});
			}

			/** ======= FOOTER ======= */
			worksheet.addRow([]);
			worksheet.addRow([`${t("prepared_by")}: ________________________`]);
			worksheet.addRow([`${t("approved_by")}: ________________________`]);
			const confRow = worksheet.addRow([t("confidential_notice")]);
			worksheet.mergeCells(confRow.number, 1, confRow.number, dataColumnsCount);
			Object.assign(confRow.getCell(1), {
				alignment: { horizontal: "center" },
				font: { italic: true, size: 9, color: { argb: "FF0000" } },
			});

			/** ======= COLUMN WIDTHS ======= */
			worksheet.getColumn(1).width = 8;
			leafColumns.forEach((col, i) => {
				const column = worksheet.getColumn(i + 2);
				column.width =
					col.width || Math.max(15, (t(col.label).length || 15) * 1.5);
			});

			/** ======= SAVE FILE ======= */
			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			saveAs(blob, `${tableName}_Report_${dateStr}.xlsx`);
		} catch (error) {
			console.error("Error during Excel export:", error);
		}
	};

	/** =====================
	 * Render
	 * ===================== */
	if (dropdownItem) {
		return (
			<DropdownItem onClick={handleExportToExcel} disabled={!tableData?.length}>
				<FaFileExcel className="me-1" />
				{t("exportToExcel")}
			</DropdownItem>
		);
	}

	return (
		<Button
			color="success"
			className="btn btn-soft-success mb-2"
			onClick={handleExportToExcel}
			disabled={
				!tableData || !Array.isArray(tableData) || tableData.length === 0
			}
		>
			<FaFileExcel className="me-1" />
			{t("exportToExcel")}
		</Button>
	);
};

export default ExportToExcel;
