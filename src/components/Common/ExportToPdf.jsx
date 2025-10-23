import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../assets/fonts/NotoSansEthiopic-Regular-normal";
import "../../assets/fonts/NotoSansEthiopic-Bold-normal";
import { useTranslation } from "react-i18next";
import { DropdownItem } from "reactstrap";
import { FaFilePdf } from "react-icons/fa";
import { transformTableName } from "../../utils/commonMethods";
import logo from "../../assets/images/logo-light.png";

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

	/** =====================
	 * Helper Functions
	 * ===================== */

	// Get all leaf columns from nested structure
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

	// Count leaf columns in a nested structure
	const countLeaves = (col) => {
		if (!col.columns || col.columns.length === 0) return 1;
		return col.columns.reduce((sum, child) => sum + countLeaves(child), 0);
	};

	// Get maximum depth of nested columns
	const getDepth = (cols) => {
		let max = 1;
		cols.forEach((c) => {
			if (c.columns && c.columns.length > 0) {
				max = Math.max(max, 1 + getDepth(c.columns));
			}
		});
		return max;
	};

	// Build header rows for nested columns structure
	const buildHeaderRows = (columns) => {
		const maxDepth = getDepth(columns);
		const rows = Array.from({ length: maxDepth }, () => []);

		const processColumn = (col, depth, currentColStart) => {
			const currentRow = rows[depth];
			const isGroup = !!col.columns;
			const leafSpan = isGroup ? countLeaves(col) : 1;
			const rowSpan = isGroup ? 1 : maxDepth - depth;
			const currentColEnd = currentColStart + leafSpan - 1;

			currentRow.push({
				label: t(col.label || col.key),
				colStart: currentColStart,
				colSpan: leafSpan,
				rowSpan: rowSpan,
				isGroup: isGroup,
			});

			if (isGroup) {
				let nextChildColStart = currentColStart;
				col.columns.forEach((childCol) => {
					const childLeafSpan = countLeaves(childCol);
					processColumn(childCol, depth + 1, nextChildColStart);
					nextChildColStart += childLeafSpan;
				});
			}

			return leafSpan;
		};

		// Add SN column to all rows
		const snHeader = {
			label: t("SN"),
			colStart: 1,
			colSpan: 1,
			rowSpan: maxDepth,
			isSN: true,
		};

		rows[0].push(snHeader);

		// Add placeholder SN cells for remaining rows
		for (let i = 1; i < maxDepth; i++) {
			rows[i].push({
				label: "",
				colStart: 1,
				colSpan: 1,
				rowSpan: 1,
				isSN: true,
				isPlaceholder: true,
			});
		}

		// Process data columns
		let currentDataColStart = 2; // Data starts after SN column
		columns.forEach((col) => {
			const span = processColumn(col, 0, currentDataColStart);
			currentDataColStart += span;
		});

		return rows;
	};

	// Convert header rows to autoTable format
	const buildAutoTableHeaders = (headerRows) => {
		const autoTableHeaders = [];

		headerRows.forEach((row, rowIndex) => {
			const autoTableRow = [];

			row.forEach((headerCell) => {
				if (headerCell.isPlaceholder) {
					// Skip placeholder cells as they're covered by merged cells
					return;
				}

				const cellConfig = {
					content: headerCell.label,
					styles: {
						halign: "center",
						valign: "middle",
						fontStyle: "bold",
						fillColor: COLORS.accent,
						textColor: COLORS.white,
						lineColor: COLORS.white,
						lineWidth: 0.5,
					},
				};

				if (headerCell.colSpan > 1) {
					cellConfig.colSpan = headerCell.colSpan;
				}
				if (headerCell.rowSpan > 1) {
					cellConfig.rowSpan = headerCell.rowSpan;
				}

				autoTableRow.push(cellConfig);
			});

			if (autoTableRow.length > 0) {
				autoTableHeaders.push(autoTableRow);
			}
		});

		return autoTableHeaders;
	};

	// Get cell value with formatting
	const getCellValue = (row, column, rowIndex) => {
		if (column.key === "sn") {
			return (rowIndex + 1).toString();
		}

		const rawValue = row[column.key];

		if (column.type === "number") {
			const cleaned = rawValue?.toString().replace(/,/g, "");
			const num = parseFloat(cleaned);
			return !isNaN(num)
				? num.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})
				: "0.00";
		}

		if (column.type === "percentage") {
			const numericPart = rawValue?.toString().replace("%", "").trim();
			const percent = parseFloat(numericPart);
			return !isNaN(percent) ? `${percent.toFixed(2)}%` : "0.00%";
		}

		return column.format ? column.format(rawValue, row) : (rawValue ?? "");
	};

	// Chunk columns for multi-page tables
	const chunkColumns = (columns, chunkSize) => {
		const leafColumns = getLeafColumns(columns);
		const chunks = [];

		for (let i = 0; i < leafColumns.length; i += chunkSize) {
			const leafChunk = leafColumns.slice(i, i + chunkSize);
			const chunk = reconstructNestedChunk(columns, leafChunk, i);
			chunks.push(chunk);
		}

		return chunks;
	};

	// Reconstruct nested structure from leaf chunks
	const reconstructNestedChunk = (columns, leafChunk, startIndex) => {
		const leafIndices = new Set(
			leafChunk.map((_, index) => startIndex + index)
		);
		let currentIndex = 0;

		const reconstruct = (cols) => {
			const result = [];

			for (const col of cols) {
				if (col.columns) {
					const reconstructedChildren = reconstruct(col.columns);
					if (reconstructedChildren.length > 0) {
						result.push({
							...col,
							columns: reconstructedChildren,
						});
					}
				} else {
					if (leafIndices.has(currentIndex)) {
						result.push({ ...col });
					}
					currentIndex++;
				}
			}

			return result;
		};

		return reconstruct(columns);
	};

	// Calculate totals for numeric columns in a chunk
	const calculateChunkTotals = (chunkLeafColumns) => {
		const totals = chunkLeafColumns.map((col) => {
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
				return total.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				});
			}
			return "";
		});
		return totals;
	};

	// Convert image to base64 for PDF
	const getLogoBase64 = () => {
		return new Promise((resolve) => {
			const img = new Image();
			img.crossOrigin = "Anonymous";
			img.src = logo;

			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);
				resolve(canvas.toDataURL("image/png"));
			};

			img.onerror = () => {
				console.error("Failed to load logo image");
				resolve(null);
			};
		});
	};

	/** =====================
	 * Main Export Handler
	 * ===================== */
	const handleExportToPDF = async () => {
		if (!tableData || tableData.length === 0 || exportColumns.length === 0) {
			console.error("No data or exportColumns to export.");
			return;
		}

		// Create PDF document
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

		// Add logo
		try {
			const logoDataUrl = await getLogoBase64();
			if (logoDataUrl) {
				const logoWidth = 35;
				const logoHeight = 25;
				const logoX = (pageWidth - logoWidth) / 2;
				const logoY = currentY;

				doc.addImage(logoDataUrl, "PNG", logoX, logoY, logoWidth, logoHeight);
				currentY += logoHeight + 5;
			}
		} catch (error) {
			console.error("Error loading logo:", error);
		}

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
		currentY += 15;

		// Add search criteria if provided
		if (Object.keys(exportSearchParams).length > 0) {
			// Search Criteria Header
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

					if (currentY > doc.internal.pageSize.getHeight() - 20) {
						doc.addPage();
						currentY = margin;
					}
				}
			});

			currentY += 4;
		}
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

		// Split columns into chunks
		const columnChunks = chunkColumns(exportColumns, MAX_COLS_PER_TABLE);
		const totalChunks = columnChunks.length;

		// Process each chunk of columns
		columnChunks.forEach((chunk, chunkIndex) => {
			// Add continuation header for subsequent chunks
			if (chunkIndex > 0) {
				doc.addPage();
				currentY = margin;

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

			// Get leaf columns for this chunk
			const chunkLeafColumns = getLeafColumns(chunk);

			// Build headers for this chunk
			const headerRows = buildHeaderRows(chunk);
			const autoTableHeaders = buildAutoTableHeaders(headerRows);

			// Prepare table data
			const dataRows = tableData.map((row, rowIndex) => {
				const rowData = [
					(rowIndex + 1).toString(), // SN column
					...chunkLeafColumns.map((col) => getCellValue(row, col, rowIndex)),
				];
				return rowData;
			});

			// Build column styles
			const columnStyles = {
				0: {
					// SN column
					cellWidth: 20,
					halign: "center",
					fillColor: COLORS.lightBlue,
					fontStyle: "bold",
					lineColor: COLORS.lightGray,
				},
			};

			chunkLeafColumns.forEach((col, idx) => {
				const columnIndex = idx + 1;
				columnStyles[columnIndex] = {
					halign:
						col.type === "number" || col.type === "percentage"
							? "right"
							: "left",
					lineColor: COLORS.lightGray,
				};

				if (col.width) {
					columnStyles[columnIndex].cellWidth = col.width;
				}
			});

			// Add the table for this chunk
			autoTable(doc, {
				head: autoTableHeaders,
				body: dataRows,
				startY: currentY,
				margin: { left: margin, right: margin },
				styles: {
					font: "NotoSansEthiopic-Regular",
					fontSize: 9,
					cellPadding: 4,
					lineColor: COLORS.lightGray,
					lineWidth: 0.3,
					textColor: [0, 0, 0],
				},
				headStyles: {
					font: "NotoSansEthiopic-Bold",
					fillColor: COLORS.accent,
					textColor: COLORS.white,
					fontStyle: "bold",
					lineWidth: 0.5,
					lineColor: COLORS.white,
					minCellHeight: 8,
					halign: "center",
				},
				bodyStyles: {
					font: "NotoSansEthiopic-Regular",
					fontSize: 9,
					lineColor: COLORS.lightGray,
					lineWidth: 0.3,
					textColor: [0, 0, 0],
				},
				alternateRowStyles: {
					fillColor: COLORS.lightBlue,
				},
				columnStyles: columnStyles,
				theme: "grid",
				didDrawPage: function (data) {
					const currentPage = data.pageNumber;
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

			currentY = doc.lastAutoTable.finalY + 10;

			// Add totals row for this chunk
			const numericColumnsInChunk = chunkLeafColumns.filter(
				(col) => col.type === "number"
			);
			if (numericColumnsInChunk.length > 0) {
				// Calculate totals for this specific chunk
				const chunkTotals = calculateChunkTotals(chunkLeafColumns);

				// Create totals row with "Total" label and calculated totals
				const totalsRow = [t("total"), ...chunkTotals];

				// Add totals row with light orange background
				autoTable(doc, {
					body: [totalsRow],
					startY: currentY,
					margin: { left: margin, right: margin },
					styles: {
						font: "NotoSansEthiopic-Bold",
						fontSize: 9,
						cellPadding: 4,
						fillColor: COLORS.orange,
						fontStyle: "bold",
						lineColor: COLORS.lightGray,
						lineWidth: 0.3,
						textColor: [0, 0, 0],
					},
					columnStyles: columnStyles,
					theme: "grid",
				});

				currentY = doc.lastAutoTable.finalY + 10;
			}

			// Add continuation notice
			if (chunkIndex < totalChunks - 1) {
				doc.setFontSize(10);
				doc.setTextColor(...COLORS.gray);
				doc.setFont("NotoSansEthiopic-Regular", "normal");
				drawCenteredText(`${t("table_continues_next_page")}...`, currentY);
			}
		});

		// Handle signatures and page numbers
		let totalPageCount = doc.internal.getNumberOfPages();
		doc.setPage(totalPageCount);

		let currentYFinal = doc.lastAutoTable
			? doc.lastAutoTable.finalY + 10
			: margin;
		const lastPageHeight = doc.internal.pageSize.getHeight();
		let addedSignaturePage = false;

		if (currentYFinal > lastPageHeight - 50) {
			doc.addPage();
			totalPageCount += 1;
			addedSignaturePage = true;
			doc.setPage(totalPageCount);
			currentYFinal = margin;
		}

		// Add page numbers
		for (let i = 1; i <= totalPageCount; i++) {
			doc.setPage(i);
			doc.setFontSize(10);
			doc.setTextColor(100, 100, 100);
			doc.setFont("NotoSansEthiopic-Regular", "normal");
			const pageHeight = doc.internal.pageSize.getHeight();
			drawCenteredText(`Page ${i} of ${totalPageCount}`, pageHeight - 10);
		}

		// Add signatures
		doc.setPage(totalPageCount);
		const signatureY = addedSignaturePage ? margin + 20 : currentYFinal + 20;

		doc.setFontSize(11);
		doc.setFont("NotoSansEthiopic-Bold", "normal");
		doc.text(
			`${t("prepared_by")}: ________________________`,
			margin,
			signatureY
		);
		doc.text(
			`${t("approved_by")}: ________________________`,
			pageWidth / 2,
			signatureY
		);

		doc.setFontSize(9);
		doc.setTextColor(255, 0, 0);
		drawCenteredText(t("confidential_notice"), signatureY + 20);

		// Save PDF
		const dateStr = new Date().toLocaleDateString().replace(/\//g, "-");
		const safeTableName = transformTableName(tableName);
		doc.save(`${safeTableName}_report_${dateStr}.pdf`);
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
