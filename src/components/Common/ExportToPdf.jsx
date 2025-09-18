import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTranslation } from "react-i18next";
import { DropdownItem } from "reactstrap";
import { FaFilePdf } from "react-icons/fa";

// Corporate color scheme
const COLORS = {
	primary: [31, 78, 120], // Dark blue: #1F4E78
	secondary: [47, 84, 150], // Medium blue: #2F5496
	accent: [68, 114, 196], // Light blue: #4472C4
	lightBlue: [217, 225, 242], // Very light blue: #D9E1F2
	green: [226, 239, 218], // Light green: #E2EFDA
	orange: [252, 228, 214], // Light orange: #FCE4D6
	white: [255, 255, 255],
	gray: [68, 84, 106], // Dark gray: #44546A
	lightGray: [180, 198, 231], // Border gray: #B4C6E7
};

const ExportToPDF = ({
	tableData,
	tableName,
	exportColumns = [],
	dropdownItem = false,
	exportSearchParams = {},
}) => {
	const { t } = useTranslation();

	const handleExportToPDF = () => {
		if (!tableData || tableData.length === 0 || exportColumns.length === 0) {
			console.error("No data or exportColumns to export.");
			return;
		}

		// Calculate total width to determine orientation
		const totalWidth =
			exportColumns.reduce((sum, col) => sum + (col.width || 20), 0) + 15; // +15 for SN column
		const shouldUseLandscape = totalWidth > 180; // If total width > 180mm, use landscape

		// Create PDF document with appropriate orientation
		const doc = new jsPDF({
			orientation: shouldUseLandscape ? "landscape" : "portrait",
		});
		const pageWidth = doc.internal.pageSize.getWidth();
		const margin = 14;
		let currentY = margin;

		// Helper function for centered text
		const drawCenteredText = (text, y) => {
			const textWidth = doc.getTextWidth(text);
			const x = (pageWidth - textWidth) / 2;
			doc.text(text, x, y);
		};

		// Add organization header
		doc.setFontSize(16);
		doc.setTextColor(...COLORS.primary);
		doc.setFont(undefined, "bold");
		drawCenteredText(t("organization_name"), currentY);
		currentY += 10;

		// Add report title
		doc.setFontSize(14);
		doc.setTextColor(...COLORS.secondary);
		drawCenteredText(`${tableName} ${t("report")}`, currentY);
		currentY += 8;

		// Add generation date
		const currentDate = new Date().toLocaleString();
		doc.setFontSize(10);
		doc.setTextColor(0, 0, 0);
		doc.setFont(undefined, "italic");
		drawCenteredText(`${t("generated_on")}: ${currentDate}`, currentY);
		currentY += 15;

		// Add search criteria if provided
		if (Object.keys(exportSearchParams).length > 0) {
			// Search Criteria Header with background color
			doc.setFillColor(...COLORS.lightBlue);
			doc.rect(margin, currentY, pageWidth - 2 * margin, 8, "F");
			doc.setFontSize(12);
			doc.setTextColor(...COLORS.gray);
			doc.setFont(undefined, "bold");
			doc.text(t("search_criteria"), margin + 5, currentY + 5);
			currentY += 15;

			// Search Criteria Values
			doc.setFontSize(11);
			doc.setFont(undefined, "normal");
			doc.setTextColor(0, 0, 0);

			Object.entries(exportSearchParams).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== "") {
					const displayKey = t(key, { defaultValue: key });
					doc.text(`• ${displayKey}: ${value}`, margin + 5, currentY);
					currentY += 6;

					// Check if we need a new page
					if (currentY > doc.internal.pageSize.getHeight() - 20) {
						doc.addPage();
						currentY = margin;
					}
				}
			});

			currentY += 15;

			// Data Summary Header
			doc.setFillColor(...COLORS.green);
			doc.rect(margin, currentY, pageWidth - 2 * margin, 8, "F");
			doc.setTextColor(...COLORS.gray);
			doc.setFont(undefined, "bold");
			doc.text(t("data_summary"), margin + 5, currentY + 5);
			currentY += 15;

			// Total Records
			doc.setTextColor(0, 0, 0);
			doc.setFont(undefined, "bold");
			doc.text(
				`${t("total_records")}: ${tableData.length}`,
				margin + 5,
				currentY
			);
			currentY += 15;
		}

		// Prepare table data
		const headers = ["SN", ...exportColumns.map((col) => t(col.label))];
		const dataRows = tableData.map((row, index) => {
			const rowData = [
				index + 1,
				...exportColumns.map((col) => {
					const rawValue = row[col.key];

					if (col.type === "number") {
						const cleaned = rawValue?.toString().replace(/,/g, "");
						const num = parseFloat(cleaned);
						return !isNaN(num)
							? num.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})
							: null;
					}

					if (col.type === "percentage") {
						const numericPart = rawValue?.toString().replace("%", "").trim();
						const percent = parseFloat(numericPart);
						return !isNaN(percent) ? `${percent.toFixed(2)}%` : null;
					}

					return col.format ? col.format(rawValue, row) : (rawValue ?? "");
				}),
			];
			return rowData;
		});

		// Calculate totals for numeric columns
		const numericColumns = exportColumns.filter((col) => col.type === "number");
		const totals = numericColumns.map((col) => {
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
			return total.toLocaleString(undefined, {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		});

		// Add the main data table with custom column widths
		const columnStyles = {
			0: {
				// Serial number column
				cellWidth: 15,
				halign: "center",
			},
		};

		exportColumns.forEach((col, idx) => {
			if (col.width) {
				columnStyles[idx + 1] = { cellWidth: col.width };
			}

			if (col.type === "number" || col.type === "percentage") {
				columnStyles[idx + 1] = {
					...columnStyles[idx + 1],
					halign: "right",
				};
			}
		});

		autoTable(doc, {
			head: [headers],
			body: dataRows,
			startY: currentY,
			margin: { left: margin, right: margin },
			styles: {
				fontSize: 10,
				cellPadding: 3,
				lineColor: COLORS.lightGray,
				lineWidth: 0.5,
			},
			headStyles: {
				fillColor: COLORS.accent,
				textColor: COLORS.white,
				fontStyle: "bold",
				lineWidth: 0.5,
				lineColor: COLORS.accent,
			},
			alternateRowStyles: {
				fillColor: COLORS.lightBlue,
			},
			columnStyles: columnStyles,
			theme: "grid",
			didDrawPage: function (data) {
				// Add header and footer to each subsequent page
				const pageCount = doc.internal.getNumberOfPages();
				const currentPage = data.pageNumber;

				// Header
				if (currentPage !== 1) {
					doc.setFontSize(10);
					doc.setTextColor(100, 100, 100);
					drawCenteredText(`${tableName} ${t("report")}`, 10);
				}

				// Footer
				const pageHeight = doc.internal.pageSize.getHeight();
				drawCenteredText(
					`Page ${currentPage} of ${pageCount}`,
					pageHeight - 10
				);
			},
		});

		// Add totals row
		if (numericColumns.length > 0) {
			const finalY = doc.lastAutoTable.finalY + 10;

			// Create totals row data
			const totalsRow = ["Total"];
			exportColumns.forEach((col, idx) => {
				const colIndex = numericColumns.findIndex((nc) => nc.key === col.key);
				if (colIndex !== -1) {
					totalsRow.push(totals[colIndex]);
				} else {
					totalsRow.push("");
				}
			});

			autoTable(doc, {
				body: [totalsRow],
				startY: finalY,
				margin: { left: margin, right: margin },
				styles: {
					fontSize: 10,
					cellPadding: 3,
					fillColor: COLORS.orange,
					fontStyle: "bold",
					lineColor: COLORS.lightGray,
					lineWidth: 0.5,
				},
				columnStyles: columnStyles,
				theme: "grid",
			});
		}

		// Add signature sections and confidential notice
		const finalY = doc.lastAutoTable
			? doc.lastAutoTable.finalY + 20
			: currentY + 100;

		// Prepared by section
		doc.setFontSize(11);
		doc.setFont(undefined, "italic");
		doc.text(`${t("prepared_by")}: ________________________`, margin, finalY);

		// Approved by section
		doc.text(
			`${t("approved_by")}: ________________________`,
			pageWidth / 2,
			finalY
		);

		// Confidential notice
		doc.setFontSize(9);
		doc.setTextColor(255, 0, 0);
		drawCenteredText(t("confidential_notice"), finalY + 20);

		// Save the PDF
		const dateStr = new Date().toLocaleDateString().replace(/\//g, "-");
		doc.save(`${tableName}_Report_${dateStr}.pdf`);
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
