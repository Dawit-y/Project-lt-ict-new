import React, { useState, useMemo, useRef, useEffect } from "react";
import {
	Card,
	CardBody,
	Input,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Button,
} from "reactstrap";
import { FaSearch, FaEye, FaEyeSlash, FaColumns } from "react-icons/fa";
import ExportToExcel from "../../components/Common/ExportToExcel";

const ZoneBudgetByYearsTable = ({
	data = [],
	exportSearchParams,
	t = (key) => key,
	tableClass = "",
}) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(50);
	const [searchTerm, setSearchTerm] = useState("");
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [hiddenColumns, setHiddenColumns] = useState([]);
	const [columnWidths, setColumnWidths] = useState({});
	const [isResizing, setIsResizing] = useState(false);
	const [resizingColumn, setResizingColumn] = useState(null);
	const [startX, setStartX] = useState(0);
	const [startWidth, setStartWidth] = useState(0);

	const tableRef = useRef(null);
	const headerRowRef = useRef(null);

	// Static fields that should NOT be treated as years
	const staticFields = useMemo(() => ["zone_id", "zone_name"], []);

	// Dynamically extract years from the first data item
	const years = useMemo(() => {
		if (!data || data.length === 0) return [];

		const firstItem = data[0];
		const yearFields = Object.keys(firstItem).filter(
			(key) => !staticFields.includes(key)
		);

		// Sort years numerically
		return yearFields
			.map((year) => ({
				id: year,
				label: year,
				field: year,
				yearValue: parseInt(year),
			}))
			.sort((a, b) => a.yearValue - b.yearValue);
	}, [data, staticFields]);

	// Calculate year totals and percentages
	const yearTotals = useMemo(() => {
		const totals = {};

		// Initialize totals
		years.forEach((year) => {
			totals[year.field] = 0;
		});

		// Calculate totals for each year
		data.forEach((zone) => {
			years.forEach((year) => {
				const value = Number(zone[year.field]) || 0;
				totals[year.field] += value;
			});
		});

		return totals;
	}, [data, years]);

	const columnsConfig = useMemo(
		() => [
			{
				id: "zone_name",
				label: t("Zone Name"),
				visible: true,
				minWidth: 250,
				sticky: true,
			},
			...years.flatMap((year) => [
				{
					id: `${year.field}_budget`,
					label: t("Budget"),
					visible: true,
					minWidth: 120,
					yearField: year.field,
					type: "budget",
				},
				{
					id: `${year.field}_percent`,
					label: t("%"),
					visible: true,
					minWidth: 80,
					yearField: year.field,
					type: "percent",
				},
			]),
			{
				id: "total_budget",
				label: t("Total Budget"),
				visible: true,
				minWidth: 150,
			},
			{
				id: "total_percent",
				label: t("Total %"),
				visible: true,
				minWidth: 80,
			},
		],
		[t, years]
	);

	// Initialize column widths
	useEffect(() => {
		const initialWidths = {};
		columnsConfig.forEach((col) => {
			initialWidths[col.id] = col.minWidth;
		});
		setColumnWidths(initialWidths);
	}, [columnsConfig]);

	// Column visibility toggle
	const toggleColumn = (columnId) => {
		setHiddenColumns((prev) =>
			prev.includes(columnId)
				? prev.filter((id) => id !== columnId)
				: [...prev, columnId]
		);
	};

	// Filter data based on search term
	const filteredData = useMemo(() => {
		if (!searchTerm) return data;
		const lowerSearchTerm = searchTerm.toLowerCase();
		return data.filter(
			(zone) =>
				zone.zone_name && zone.zone_name.toLowerCase().includes(lowerSearchTerm)
		);
	}, [data, searchTerm]);

	// Calculate total budget across all years and zones
	const grandTotalBudget = useMemo(() => {
		let total = 0;
		data.forEach((zone) => {
			years.forEach((year) => {
				total += Number(zone[year.field]) || 0;
			});
		});
		return total;
	}, [data, years]);

	// Prepare all rows for rendering
	const allRows = useMemo(() => {
		const rows = [];

		// Add zone rows
		filteredData.forEach((zone, index) => {
			let zoneTotal = 0;

			// Calculate zone total
			years.forEach((year) => {
				zoneTotal += Number(zone[year.field]) || 0;
			});

			rows.push({
				type: "zone",
				...zone,
				zoneTotal,
				zonePercent:
					grandTotalBudget > 0 ? (zoneTotal / grandTotalBudget) * 100 : 0,
			});
		});

		// Add totals row
		if (filteredData.length > 0) {
			rows.push({
				type: "total",
				zone_name: t("Total"),
				yearTotals,
				grandTotal: grandTotalBudget,
			});
		}

		return rows;
	}, [filteredData, years, yearTotals, grandTotalBudget, t]);

	// Pagination
	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;
	const currentRows = allRows.slice(indexOfFirstRow, indexOfLastRow);
	const totalPages = Math.ceil(allRows.length / rowsPerPage);

	// Prepare data for export
	const exportData = useMemo(() => {
		const exportRows = [];

		// Add zone rows
		filteredData.forEach((zone) => {
			let zoneTotal = 0;
			const zoneRow = {
				level: t("Zone"),
				zone_name: zone.zone_name,
			};

			years.forEach((year) => {
				const value = Number(zone[year.field]) || 0;
				zoneTotal += value;
				const percent =
					yearTotals[year.field] > 0
						? (value / yearTotals[year.field]) * 100
						: 0;

				zoneRow[`${year.label} Budget`] = value;
				zoneRow[`${year.label} %`] = percent;
			});

			zoneRow[t("Total Budget")] = zoneTotal;
			zoneRow[t("Total %")] =
				grandTotalBudget > 0 ? (zoneTotal / grandTotalBudget) * 100 : 0;
			exportRows.push(zoneRow);
		});

		// Add totals row
		// if (filteredData.length > 0) {
		// 	const totalRow = {
		// 		level: t("Total"),
		// 		zone_name: t("Total"),
		// 	};

		// 	years.forEach((year) => {
		// 		const value = yearTotals[year.field] || 0;
		// 		const percent =
		// 			grandTotalBudget > 0 ? (value / grandTotalBudget) * 100 : 0;

		// 		totalRow[`${year.label} Budget`] = value;
		// 		totalRow[`${year.label} %`] = percent;
		// 	});

		// 	totalRow[t("Total Budget")] = grandTotalBudget;
		// 	totalRow[t("Total %")] = 100;
		// 	exportRows.push(totalRow);
		// }

		return exportRows;
	}, [filteredData, years, yearTotals, grandTotalBudget, t]);

	// Filter export columns based on visibility
	const visibleExportColumns = useMemo(() => {
		const baseColumns = [
			{
				key: "zone_name",
				label: t("Zone Name"),
				width: 30,
				type: "string",
			},
		];

		// Years groups
		const yearGroups = years
			.map((year) => {
				const yearGroup = {
					key: `year_${year.label}`,
					label: year.label,
					columns: [],
				};

				if (!hiddenColumns.includes(`${year.field}_budget`)) {
					yearGroup.columns.push({
						key: `${year.label} Budget`,
						label: t("Budget"),
						width: 25,
						type: "number",
					});
				}

				if (!hiddenColumns.includes(`${year.field}_percent`)) {
					yearGroup.columns.push({
						key: `${year.label} %`,
						label: t("%"),
						width: 10,
						type: "percentage",
					});
				}

				return yearGroup;
			})
			.filter((group) => group.columns.length > 0);

		// Total group
		const totalGroup = {
			key: "totals",
			label: t("Totals"),
			columns: [],
		};

		if (!hiddenColumns.includes("total_budget")) {
			totalGroup.columns.push({
				key: t("Total Budget"),
				label: t("Total Budget"),
				width: 25,
				type: "number",
			});
		}

		if (!hiddenColumns.includes("total_percent")) {
			totalGroup.columns.push({
				key: t("Total %"),
				label: t("Total %"),
				width: 10,
				type: "percentage",
			});
		}

		// Combine all groups
		const result = [...baseColumns, ...yearGroups];
		if (totalGroup.columns.length > 0) result.push(totalGroup);

		return result;
	}, [hiddenColumns, years, t]);

	// Event handlers
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	const toggleDropdown = () => setDropdownOpen((prev) => !prev);

	// Column resizing handlers
	const startResizing = (columnId, e) => {
		setIsResizing(true);
		setResizingColumn(columnId);
		setStartX(e.clientX);

		const headerCells = headerRowRef.current?.querySelectorAll("th") || [];
		let currentWidth = 0;
		headerCells.forEach((cell) => {
			if (cell.dataset.column === columnId) {
				currentWidth = cell.offsetWidth;
			}
		});
		setStartWidth(currentWidth);

		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";
	};

	const resizeColumn = (e) => {
		if (isResizing && resizingColumn) {
			const width = startWidth + (e.clientX - startX);
			const minWidth =
				columnsConfig.find((col) => col.id === resizingColumn)?.minWidth || 50;

			if (width >= minWidth) {
				setColumnWidths((prev) => ({
					...prev,
					[resizingColumn]: width,
				}));
			}
		}
	};

	const stopResizing = () => {
		if (isResizing) {
			setIsResizing(false);
			setResizingColumn(null);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		}
	};

	// Apply column visibility and widths
	useEffect(() => {
		if (tableRef.current) {
			columnsConfig.forEach((col) => {
				const cells = tableRef.current.querySelectorAll(
					`th[data-column="${col.id}"], td[data-column="${col.id}"]`
				);
				cells.forEach((cell) => {
					cell.style.display = hiddenColumns.includes(col.id) ? "none" : "";
					if (columnWidths[col.id]) {
						cell.style.minWidth = `${columnWidths[col.id]}px`;
						cell.style.width = `${columnWidths[col.id]}px`;
					}
				});
			});
		}
	}, [hiddenColumns, columnsConfig, columnWidths]);

	// Event listeners for resizing
	useEffect(() => {
		document.addEventListener("mousemove", resizeColumn);
		document.addEventListener("mouseup", stopResizing);

		return () => {
			document.removeEventListener("mousemove", resizeColumn);
			document.removeEventListener("mouseup", stopResizing);
		};
	}, [isResizing, resizingColumn, startX, startWidth]);

	// Pagination items generator
	const getPaginationItems = () => {
		const items = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				items.push(
					<li
						key={i}
						className={`page-item ${currentPage === i ? "active" : ""}`}
					>
						<button className="page-link" onClick={() => paginate(i)}>
							{i}
						</button>
					</li>
				);
			}
		} else {
			let startPage, endPage;

			if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
				startPage = 1;
				endPage = maxVisiblePages;
			} else if (currentPage + Math.floor(maxVisiblePages / 2) >= totalPages) {
				startPage = totalPages - maxVisiblePages + 1;
				endPage = totalPages;
			} else {
				startPage = currentPage - Math.floor(maxVisiblePages / 2);
				endPage = currentPage + Math.floor(maxVisiblePages / 2);
			}

			if (startPage > 1) {
				items.push(
					<li key={1} className="page-item">
						<button className="page-link" onClick={() => paginate(1)}>
							1
						</button>
					</li>
				);
				if (startPage > 2) {
					items.push(
						<li key="ellipsis-start" className="page-item disabled">
							<span className="page-link">...</span>
						</li>
					);
				}
			}

			for (let i = startPage; i <= endPage; i++) {
				items.push(
					<li
						key={i}
						className={`page-item ${currentPage === i ? "active" : ""}`}
					>
						<button className="page-link" onClick={() => paginate(i)}>
							{i}
						</button>
					</li>
				);
			}

			if (endPage < totalPages) {
				if (endPage < totalPages - 1) {
					items.push(
						<li key="ellipsis-end" className="page-item disabled">
							<span className="page-link">...</span>
						</li>
					);
				}
				items.push(
					<li key={totalPages} className="page-item">
						<button className="page-link" onClick={() => paginate(totalPages)}>
							{totalPages}
						</button>
					</li>
				);
			}
		}

		return items;
	};

	// Get visible columns for table rendering
	const visibleColumns = useMemo(() => {
		return columnsConfig.filter((col) => !hiddenColumns.includes(col.id));
	}, [columnsConfig, hiddenColumns]);

	// Format currency
	const formatCurrency = (value) => {
		if (!value && value !== 0) return "-";
		return new Intl.NumberFormat("en-ET", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);
	};

	// Format percentage
	const formatPercentage = (value) => {
		if (!value && value !== 0) return "-";
		return `${value.toFixed(1)}%`;
	};

	// Render zone row
	const renderZoneRow = (row, index) => {
		return (
			<tr key={`zone-${row.zone_id}-${index}`}>
				{/* Zone Name */}
				{!hiddenColumns.includes("zone_name") && (
					<td
						data-column="zone_name"
						className="sticky-column"
						style={{ left: 0 }}
					>
						{row.zone_name}
					</td>
				)}

				{/* Year Budgets and Percentages */}
				{years.map((year) => {
					const budgetField = `${year.field}_budget`;
					const percentField = `${year.field}_percent`;
					const value = Number(row[year.field]) || 0;
					const percent =
						yearTotals[year.field] > 0
							? (value / yearTotals[year.field]) * 100
							: 0;

					return (
						<React.Fragment key={year.field}>
							{!hiddenColumns.includes(budgetField) && (
								<td data-column={budgetField}>{formatCurrency(value)}</td>
							)}
							{!hiddenColumns.includes(percentField) && (
								<td data-column={percentField}>{formatPercentage(percent)}</td>
							)}
						</React.Fragment>
					);
				})}

				{/* Total Budget */}
				{!hiddenColumns.includes("total_budget") && (
					<td data-column="total_budget">{formatCurrency(row.zoneTotal)}</td>
				)}

				{/* Total Percentage */}
				{!hiddenColumns.includes("total_percent") && (
					<td data-column="total_percent">
						{formatPercentage(row.zonePercent)}
					</td>
				)}
			</tr>
		);
	};

	// Render total row
	const renderTotalRow = (row, index) => {
		return (
			<tr key="total-row" className="total-row">
				{/* Zone Name */}
				{!hiddenColumns.includes("zone_name") && (
					<td
						data-column="zone_name"
						className="sticky-column"
						style={{ left: 0 }}
					>
						<strong>{row.zone_name}</strong>
					</td>
				)}

				{/* Year Totals and Percentages */}
				{years.map((year) => {
					const budgetField = `${year.field}_budget`;
					const percentField = `${year.field}_percent`;
					const value = row.yearTotals[year.field] || 0;
					const percent =
						grandTotalBudget > 0 ? (value / grandTotalBudget) * 100 : 0;

					return (
						<React.Fragment key={year.field}>
							{!hiddenColumns.includes(budgetField) && (
								<td data-column={budgetField}>
									<strong>{formatCurrency(value)}</strong>
								</td>
							)}
							{!hiddenColumns.includes(percentField) && (
								<td data-column={percentField}>
									<strong>{formatPercentage(percent)}</strong>
								</td>
							)}
						</React.Fragment>
					);
				})}

				{/* Grand Total Budget */}
				{!hiddenColumns.includes("total_budget") && (
					<td data-column="total_budget">
						<strong>{formatCurrency(row.grandTotal)}</strong>
					</td>
				)}

				{/* Grand Total Percentage */}
				{!hiddenColumns.includes("total_percent") && (
					<td data-column="total_percent">
						<strong>100%</strong>
					</td>
				)}
			</tr>
		);
	};

	return (
		<div style={{ width: "100%", overflowX: "auto" }}>
			{/* Search and Controls Card */}
			<Card className="mb-3">
				<CardBody className="d-flex justify-content-between align-items-center">
					<div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
						<Input
							type="text"
							placeholder={t("Search by zone name...")}
							value={searchTerm}
							onChange={handleSearchChange}
							className="form-control"
							style={{ paddingLeft: "35px" }}
						/>
						<FaSearch
							style={{
								position: "absolute",
								left: "12px",
								top: "50%",
								transform: "translateY(-50%)",
								color: "#6c757d",
								fontSize: "1rem",
							}}
						/>
					</div>
					<div className="d-flex align-items-center">
						<ExportToExcel
							tableData={exportData}
							tableName="Zone Finance by Years"
							exportColumns={visibleExportColumns}
							exportSearchParams={exportSearchParams}
						/>
						<Dropdown
							isOpen={dropdownOpen}
							toggle={toggleDropdown}
							className="ms-2"
						>
							<DropdownToggle
								tag={Button}
								color="secondary"
								className="btn btn-soft-primary mb-2"
								style={{
									padding: "0.375rem 0.75rem",
									fontSize: "0.875rem",
								}}
							>
								<FaColumns className="me-1" />
								{t("Columns")}
							</DropdownToggle>
							<DropdownMenu
								end
								style={{ maxHeight: "300px", overflowY: "auto" }}
							>
								<DropdownItem header>{t("Toggle Columns")}</DropdownItem>
								{columnsConfig.map((col) => (
									<DropdownItem
										key={col.id}
										onClick={() => toggleColumn(col.id)}
										className="d-flex justify-content-between align-items-center"
									>
										<span>{col.label}</span>
										{hiddenColumns.includes(col.id) ? (
											<FaEyeSlash />
										) : (
											<FaEye />
										)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
				</CardBody>
			</Card>

			{/* Table Container */}
			<div
				style={{
					overflowX: "auto",
					width: "100%",
					borderRadius: "4px",
					marginBottom: "1rem",
				}}
			>
				<style>{`
					table {
						border-collapse: collapse !important;
						border: 1px solid #000 !important;
					}

					thead, tbody, tr, th, td {
						border: 2px solid #000 !important;
					}

					.total-row {
						background-color: #e8f4f0 !important;
						font-weight: bold;
					}
					.total-row td {
						background-color: #e8f4f0 !important;
					}
					.resize-handle {
						position: absolute;
						top: 0;
						right: 0;
						width: 2px;
						height: 100%;
						background: rgba(0, 0, 0, 0.1);
						cursor: col-resize;
					}
					.resize-handle:hover {
						background: rgba(0, 0, 0, 0.3);
					}
					th {
						position: relative;
						background-color: #f8f9fa !important;
					}
					.sticky-column {
						position: sticky;
						left: 0;
						z-index: 1;
						background-color: white !important;
					}
					.sticky-header {
						position: sticky;
						left: 0;
						z-index: 2;
						background-color: #f8f9fa !important;
					}
				`}</style>

				{/* Table */}
				<table
					id="zone-budget-by-years-table"
					ref={tableRef}
					className={`table ${tableClass}`}
					style={{ width: "100%", fontSize: "0.85rem", minWidth: "1600px" }}
				>
					<thead ref={headerRowRef}>
						{/* Row 1: Year Groups */}
						<tr>
							{!hiddenColumns.includes("zone_name") && (
								<th
									rowSpan={2}
									data-column="zone_name"
									className="sticky-header"
									style={{ left: 0 }}
								>
									{t("Zone Name")}
								</th>
							)}

							{/* Year Groups */}
							{years.map((year) => (
								<th
									key={year.field}
									colSpan={
										(!hiddenColumns.includes(`${year.field}_budget`) ? 1 : 0) +
										(!hiddenColumns.includes(`${year.field}_percent`) ? 1 : 0)
									}
									data-column={`year_${year.field}_group`}
								>
									{year.label}
								</th>
							))}

							{/* Total Group */}
							{(!hiddenColumns.includes("total_budget") ||
								!hiddenColumns.includes("total_percent")) && (
								<th
									colSpan={
										(!hiddenColumns.includes("total_budget") ? 1 : 0) +
										(!hiddenColumns.includes("total_percent") ? 1 : 0)
									}
									data-column="total_group"
								>
									{t("Total")}
								</th>
							)}
						</tr>

						{/* Row 2: Individual Column Headers */}
						<tr>
							{/* Year subgroups */}
							{years.flatMap((year) => [
								!hiddenColumns.includes(`${year.field}_budget`) && (
									<th
										key={`${year.field}_budget`}
										data-column={`${year.field}_budget`}
									>
										{t("Budget")}
									</th>
								),
								!hiddenColumns.includes(`${year.field}_percent`) && (
									<th
										key={`${year.field}_percent`}
										data-column={`${year.field}_percent`}
									>
										{t("%")}
									</th>
								),
							])}

							{/* Total subgroups */}
							{!hiddenColumns.includes("total_budget") && (
								<th key="total_budget" data-column="total_budget">
									{t("Total Budget")}
								</th>
							)}
							{!hiddenColumns.includes("total_percent") && (
								<th key="total_percent" data-column="total_percent">
									{t("Total %")}
								</th>
							)}
						</tr>
					</thead>

					<tbody>
						{currentRows.length > 0 ? (
							currentRows.map((row, index) => {
								if (row.type === "total") {
									return renderTotalRow(row, index);
								} else {
									return renderZoneRow(row, index);
								}
							})
						) : (
							<tr>
								<td
									colSpan={visibleColumns.length + years.length} // + years.length for group headers
									style={{ textAlign: "center", padding: "2rem" }}
								>
									{searchTerm
										? t("No zones match your search criteria.")
										: t("No budget data available.")}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{allRows.length > 0 && (
				<div className="d-flex justify-content-between align-items-center mt-3">
					<div className="text-muted small">
						<h6>
							{t("Showing")} {Math.min(rowsPerPage, currentRows.length)}{" "}
							{t("of")} {allRows.length} {t("items")}
						</h6>
					</div>

					<div className="d-flex align-items-center ms-auto">
						<nav aria-label="Table pagination">
							<ul className="pagination mb-0" style={{ fontSize: "1rem" }}>
								<li
									className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
								>
									<button
										className="page-link"
										onClick={() => paginate(1)}
										disabled={currentPage === 1}
										style={{ padding: "0.5rem 0.75rem" }}
									>
										&laquo;
									</button>
								</li>
								<li
									className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
								>
									<button
										className="page-link"
										onClick={() => paginate(currentPage - 1)}
										disabled={currentPage === 1}
										style={{ padding: "0.5rem 0.75rem" }}
									>
										&lsaquo;
									</button>
								</li>

								{getPaginationItems()}

								<li
									className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
								>
									<button
										className="page-link"
										onClick={() => paginate(currentPage + 1)}
										disabled={currentPage === totalPages}
										style={{ padding: "0.5rem 0.75rem" }}
									>
										&rsaquo;
									</button>
								</li>
								<li
									className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
								>
									<button
										className="page-link"
										onClick={() => paginate(totalPages)}
										disabled={currentPage === totalPages}
										style={{ padding: "0.5rem 0.75rem" }}
									>
										&raquo;
									</button>
								</li>
							</ul>
						</nav>

						<div className="ms-3 position-relative" style={{ width: "80px" }}>
							<select
								className="form-control form-control-sm"
								value={rowsPerPage}
								onChange={(e) => {
									setRowsPerPage(Number(e.target.value));
									setCurrentPage(1);
								}}
								style={{
									appearance: "none",
									background: "transparent",
									paddingRight: "25px",
									width: "100%",
								}}
							>
								{[50, 100, 200, 300, 500].map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
								<option value={-1}>{t("All")}</option>
							</select>
							<span
								style={{
									position: "absolute",
									top: "50%",
									right: "10px",
									pointerEvents: "none",
									transform: "translateY(-50%)",
									fontSize: "1rem",
								}}
							>
								▼
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ZoneBudgetByYearsTable;
