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
		const dataColumnsCount = exportColumns.length + 1;

		const orgRow = worksheet.addRow([t("organization_name")]);
		orgRow.font = { bold: true, size: 16, color: { argb: "1F4E78" } };
		orgRow.alignment = { horizontal: "center" };
		worksheet.mergeCells(1, 1, 1, dataColumnsCount);

		const titleRow = worksheet.addRow([`${tableName} ${t("report")}`]);
		titleRow.font = { bold: true, size: 14, color: { argb: "2F5496" } };
		titleRow.alignment = { horizontal: "center" };
		worksheet.mergeCells(2, 1, 2, dataColumnsCount);

		const dateRow = worksheet.addRow([`${t("generated_on")}: ${currentDate}`]);
		dateRow.font = { italic: true, size: 10 };
		dateRow.alignment = { horizontal: "center" };
		worksheet.mergeCells(3, 1, 3, dataColumnsCount);

		worksheet.addRow([]);

		let currentRow = 5;

		if (Object.keys(exportSearchParams).length > 0) {
			// --- Search Criteria Header ---
			const criteriaHeader = worksheet.addRow([]);
			criteriaHeader.getCell(2).value = t("search_criteria");
			criteriaHeader.font = { bold: true, size: 12, color: { argb: "44546A" } };
			criteriaHeader.alignment = { horizontal: "left" };
			for (let i = 2; i <= dataColumnsCount; i++) {
				criteriaHeader.getCell(i).fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "D9E1F2" },
				};
			}
			worksheet.mergeCells(currentRow, 2, currentRow, dataColumnsCount);
			currentRow++;

			// --- Search Criteria Values ---
			Object.entries(exportSearchParams).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== "") {
					const displayKey = t(key, { defaultValue: key });
					const paramRow = worksheet.addRow([]);
					paramRow.getCell(2).value = `${displayKey}: ${value}`;
					paramRow.alignment = { horizontal: "left" };
					for (let i = 2; i <= dataColumnsCount; i++) {
						paramRow.getCell(i).fill = {
							type: "pattern",
							pattern: "solid",
							fgColor: { argb: "FFFFFF" },
						};
					}
					worksheet.mergeCells(currentRow, 2, currentRow, dataColumnsCount);
					currentRow++;
				}
			});

			// --- Bullet Points ---
			for (let i = 6; i < currentRow; i++) {
				const row = worksheet.getRow(i);
				row.font = { size: 11 };
				const cell = row.getCell(2);
				if (cell.value) {
					cell.value = `• ${cell.value}`;
				}
			}

			worksheet.addRow([]);
			currentRow++;

			// --- Data Summary Header ---
			const dataHeader = worksheet.addRow([]);
			dataHeader.getCell(2).value = t("data_summary");
			dataHeader.font = { bold: true, size: 12, color: { argb: "44546A" } };
			dataHeader.alignment = { horizontal: "left" };
			for (let i = 2; i <= dataColumnsCount; i++) {
				dataHeader.getCell(i).fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "E2EFDA" },
				};
			}
			worksheet.mergeCells(currentRow, 2, currentRow, dataColumnsCount);
			currentRow++;

			// --- Total Records Row ---
			const countRow = worksheet.addRow([]);
			countRow.getCell(2).value = `${t("total_records")}: ${tableData.length}`;
			countRow.font = { bold: true };
			countRow.alignment = { horizontal: "left" };
			worksheet.mergeCells(currentRow, 2, currentRow, dataColumnsCount);
			currentRow++;

			worksheet.addRow([]);
			currentRow++;
		} else {
			currentRow = 5;
		}

		const headerLabels = [t("SN"), ...exportColumns.map((col) => t(col.label))];
		const headerRow = worksheet.addRow(headerLabels);
		headerRow.font = { bold: true, size: 12, color: { argb: "FFFFFF" } };

		for (let i = 1; i <= dataColumnsCount; i++) {
			const cell = headerRow.getCell(i);
			cell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "4472C4" },
			};
			cell.alignment = { vertical: "middle", horizontal: "center" };
			cell.border = {
				top: { style: "thin", color: { argb: "000000" } },
				left: { style: "thin", color: { argb: "000000" } },
				bottom: { style: "thin", color: { argb: "000000" } },
				right: { style: "thin", color: { argb: "000000" } },
			};
		}

		tableData.forEach((row, index) => {
			const rowData = [
				index + 1,
				...exportColumns.map((col) => {
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
				}),
			];

			const addedRow = worksheet.addRow(rowData);
			const rowColor = index % 2 === 0 ? "D9E1F2" : "FFFFFF";

			for (let i = 1; i <= dataColumnsCount; i++) {
				const cell = addedRow.getCell(i);
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: rowColor },
				};

				cell.border = {
					top: { style: "thin", color: { argb: "B4C6E7" } },
					left: { style: "thin", color: { argb: "B4C6E7" } },
					bottom: { style: "thin", color: { argb: "B4C6E7" } },
					right: { style: "thin", color: { argb: "B4C6E7" } },
				};

				if (i === 1) {
					cell.alignment = { horizontal: "center" };
					continue;
				}

				const col = exportColumns[i - 2];
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

		worksheet.addRow([]);

		const numericColumns = exportColumns.filter((col) => col.type === "number");
		if (numericColumns.length > 0) {
			const totals = [
				t("total"),
				...exportColumns.map((col) => {
					if (col.type === "number") {
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
						return total;
					}
					return "";
				}),
			];

			const totalsRow = worksheet.addRow(totals);
			totalsRow.font = { bold: true };

			for (let i = 1; i <= dataColumnsCount; i++) {
				totalsRow.getCell(i).fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "FCE4D6" },
				};
			}

			exportColumns.forEach((col, colIdx) => {
				if (col.type === "number") {
					const cell = totalsRow.getCell(colIdx + 2);
					cell.numFmt = "#,##0.00";
					cell.alignment = { horizontal: "right" };
				}
			});
		}

		worksheet.addRow([]);
		const preparedByRow = worksheet.addRow([
			`${t("prepared_by")}: ________________________`,
			"",
		]);
		preparedByRow.font = { italic: true };
		preparedByRow.alignment = { horizontal: "left" };
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
			"",
		]);
		approvedByRow.font = { italic: true };
		approvedByRow.alignment = { horizontal: "left" };
		const approvedByEndCol = Math.floor(dataColumnsCount / 2);
		if (approvedByEndCol > 1) {
			worksheet.mergeCells(
				approvedByRow.number,
				1,
				approvedByRow.number,
				approvedByEndCol
			);
		}

		const confidentialRow = worksheet.addRow([t("confidential_notice")]);
		confidentialRow.font = { italic: true, size: 9, color: { argb: "FF0000" } };
		confidentialRow.alignment = { horizontal: "center" };
		worksheet.mergeCells(
			confidentialRow.number,
			1,
			confidentialRow.number,
			dataColumnsCount
		);

		const snColumn = worksheet.getColumn(1);
		snColumn.width = 8;
		snColumn.alignment = { horizontal: "center" };

		exportColumns.forEach((col, idx) => {
			const column = worksheet.getColumn(idx + 2);

			if (col.width) {
				column.width = col.width;
			} else {
				const headerWidth = col.label.length * 1.5;
				let maxDataWidth = 0;

				tableData.forEach((row) => {
					const value = row[col.key];
					if (value !== null && value !== undefined) {
						const strValue = String(value);
						maxDataWidth = Math.max(maxDataWidth, strValue.length);
					}
				});

				column.width = Math.min(
					50,
					Math.max(15, Math.max(headerWidth, maxDataWidth) + 2)
				);
			}
		});

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
