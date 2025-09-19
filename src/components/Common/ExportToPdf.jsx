import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../assets/fonts/NotoSansEthiopic-Regular-normal";
import "../../assets/fonts/NotoSansEthiopic-Bold-normal";
import { useTranslation } from "react-i18next";
import { DropdownItem } from "reactstrap";
import { FaFilePdf } from "react-icons/fa";

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

const MAX_COLS_PER_TABLE = 7;

const ExportToPDF = ({
	tableData,
	tableName,
	exportColumns = [],
	dropdownItem = false,
	exportSearchParams = {},
}) => {
	const { t } = useTranslation();

	// Helper function to chunk columns into groups
	const chunkColumns = (columns, chunkSize) => {
		const chunks = [];
		for (let i = 0; i < columns.length; i += chunkSize) {
			chunks.push(columns.slice(i, i + chunkSize));
		}
		return chunks;
	};

	const handleExportToPDF = () => {
		if (!tableData || tableData.length === 0 || exportColumns.length === 0) {
			console.error("No data or exportColumns to export.");
			return;
		}

		// Create PDF document with appropriate orientation
		const doc = new jsPDF({
			orientation: "landscape",
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
		doc.setFont("NotoSansEthiopic-Bold", "normal");
		drawCenteredText(t("organization_name"), currentY);
		currentY += 10;

		// Add report title
		doc.setFontSize(14);
		doc.setTextColor(...COLORS.secondary);
		doc.setFont("NotoSansEthiopic-Bold", "normal");
		drawCenteredText(`${tableName} ${t("report")}`, currentY);
		currentY += 8;

		// Add generation date
		const currentDate = new Date().toLocaleString();
		doc.setFontSize(10);
		doc.setTextColor(0, 0, 0);
		doc.setFont("NotoSansEthiopic-Regular", "normal");
		drawCenteredText(`${t("generated_on")}: ${currentDate}`, currentY);
		currentY += 10;

		// Add search criteria if provided
		if (Object.keys(exportSearchParams).length > 0) {
			// Search Criteria Header with background color
			doc.setFillColor(...COLORS.lightBlue);
			doc.rect(margin, currentY, pageWidth - 2 * margin, 8, "F");
			doc.setFontSize(12);
			doc.setTextColor(...COLORS.gray);
			doc.setFont("NotoSansEthiopic-Bold", "normal");
			doc.text(t("search_criteria"), margin + 5, currentY + 5);
			currentY += 15;

			// Search Criteria Values
			doc.setFontSize(11);
			doc.setFont("NotoSansEthiopic-Regular", "normal");
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

			currentY += 4;

			// Data Summary Header
			doc.setFillColor(...COLORS.green);
			doc.rect(margin, currentY, pageWidth - 2 * margin, 8, "F");
			doc.setTextColor(...COLORS.gray);
			doc.setFont("NotoSansEthiopic-Bold", "normal");
			doc.text(t("data_summary"), margin + 5, currentY + 5);
			currentY += 15;

			// Total Records
			doc.setTextColor(0, 0, 0);
			doc.setFont("NotoSansEthiopic-Bold", "normal");
			doc.text(
				`${t("total_records")}: ${tableData.length}`,
				margin + 5,
				currentY
			);
			currentY += 10;
		}

		// Split columns into chunks
		const columnChunks = chunkColumns(exportColumns, MAX_COLS_PER_TABLE);
		const totalChunks = columnChunks.length;

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

		// Process each chunk of columns
		columnChunks.forEach((chunk, chunkIndex) => {
			// Add a continuation header for subsequent chunks
			if (chunkIndex > 0) {
				doc.addPage();
				currentY = margin;

				// Add continuation header
				doc.setFillColor(...COLORS.lightBlue);
				doc.rect(margin, currentY, pageWidth - 2 * margin, 8, "F");
				doc.setFontSize(12);
				doc.setTextColor(...COLORS.gray);
				doc.setFont("NotoSansEthiopic-Bold", "normal");
				doc.text(
					`${t("table_continued")} (${chunkIndex + 1}/${totalChunks})`,
					margin + 5,
					currentY + 5
				);
				currentY += 15;
			}

			// Prepare table data for this chunk
			const headers = ["SN", ...chunk.map((col) => t(col.label))];
			const dataRows = tableData.map((row, index) => {
				const rowData = [
					index + 1,
					...chunk.map((col) => {
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

			// Add column styles for this chunk
			const columnStyles = {
				0: {
					// Serial number column
					cellWidth: 15,
					halign: "center",
				},
			};

			chunk.forEach((col, idx) => {
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

			// Add the table for this chunk
			autoTable(doc, {
				head: [headers],
				body: dataRows,
				startY: currentY,
				margin: { left: margin, right: margin },
				styles: {
					font: "NotoSansEthiopic-Regular",
					fontSize: 10,
					cellPadding: 3,
					lineColor: COLORS.lightGray,
					lineWidth: 0.5,
				},
				headStyles: {
					font: "NotoSansEthiopic-Regular",
					fillColor: COLORS.accent,
					textColor: COLORS.white,
					fontStyle: "bold",
					lineWidth: 0.5,
					lineColor: COLORS.accent,
				},
				bodyStyles: {
					font: "NotoSansEthiopic-Regular",
				},
				alternateRowStyles: {
					fillColor: COLORS.lightBlue,
				},
				columnStyles: columnStyles,
				theme: "grid",
				didDrawPage: function (data) {
					const currentPage = data.pageNumber;
					// Header
					doc.setFontSize(10);
					doc.setTextColor(100, 100, 100);
					doc.setFont("NotoSansEthiopic-Regular", "normal");
					if (currentPage !== 1) {
						drawCenteredText(
							`${tableName} ${t("report")} - ${t("part")} ${chunkIndex + 1}/${totalChunks}`,
							10
						);
					}
				},
			});

			// Update currentY position after drawing the table
			currentY = doc.lastAutoTable.finalY + 10;

			// Add totals row for this chunk if it contains numeric columns
			const numericColumnsInChunk = chunk.filter(
				(col) => col.type === "number"
			);
			if (numericColumnsInChunk.length > 0) {
				// Create totals row data for this chunk
				const totalsRow = ["Total"];
				chunk.forEach((col) => {
					const colIndex = numericColumns.findIndex((nc) => nc.key === col.key);
					if (colIndex !== -1) {
						totalsRow.push(totals[colIndex]);
					} else {
						totalsRow.push("");
					}
				});

				autoTable(doc, {
					body: [totalsRow],
					startY: currentY,
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

				// Update currentY position after drawing the totals row
				currentY = doc.lastAutoTable.finalY + 10;
			}

			// Add continuation notice if there are more chunks
			if (chunkIndex < totalChunks - 1) {
				doc.setFontSize(10);
				doc.setTextColor(...COLORS.gray);
				doc.setFont("NotoSansEthiopic-Regular", "normal");
				drawCenteredText(`${t("table_continues_next_page")}...`, currentY);
			}
		});

		let totalPageCount = doc.internal.getNumberOfPages();
		// Go to the last page
		doc.setPage(totalPageCount);

		// Get the current Y position on the last page
		currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : margin;

		// Check if there's enough space for signatures (need about 50 units)
		const lastPageHeight = doc.internal.pageSize.getHeight();
		let addedSignaturePage = false;

		if (currentY > lastPageHeight - 50) {
			// Not enough space, add a new page
			doc.addPage();
			totalPageCount += 1;
			addedSignaturePage = true;

			// Set to the new page for signatures
			doc.setPage(totalPageCount);
			currentY = margin; // Reset Y position for the new page
		}

		// Update page numbers for ALL pages (only once, after all content)
		for (let i = 1; i <= totalPageCount; i++) {
			doc.setPage(i);
			doc.setFontSize(10);
			doc.setTextColor(100, 100, 100);
			doc.setFont("NotoSansEthiopic-Regular", "normal");

			// Footer - add page number to bottom
			const pageHeight = doc.internal.pageSize.getHeight();
			drawCenteredText(`Page ${i} of ${totalPageCount}`, pageHeight - 10);
		}

		// Set back to the last page for signatures
		doc.setPage(totalPageCount);

		// Calculate Y position for signatures
		// If we added a signature page, start from the top
		const signatureY = addedSignaturePage ? margin + 20 : currentY + 20;

		// Prepared by section
		doc.setFontSize(11);
		doc.setFont("NotoSansEthiopic-Bold", "normal");
		doc.text(
			`${t("prepared_by")}: ________________________`,
			margin,
			signatureY
		);

		// Approved by section
		doc.setFont("NotoSansEthiopic-Bold", "normal");
		doc.text(
			`${t("approved_by")}: ________________________`,
			pageWidth / 2,
			signatureY
		);

		// Confidential notice
		doc.setFontSize(9);
		doc.setTextColor(255, 0, 0);
		drawCenteredText(t("confidential_notice"), signatureY + 20);

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
