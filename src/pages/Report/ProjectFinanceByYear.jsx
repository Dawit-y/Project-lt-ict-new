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
import {
	FaSearch,
	FaEye,
	FaEyeSlash,
	FaColumns,
	FaChevronDown,
	FaChevronRight,
} from "react-icons/fa";
import ExportToExcel from "../../components/Common/ExportToExcel";

const BudgetByYearsTable = ({
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
	const [expandedCategories, setExpandedCategories] = useState({});

	const tableRef = useRef(null);
	const headerRowRef = useRef(null);

	// Static fields that should NOT be treated as years
	const staticFields = useMemo(
		() => [
			"sector_id",
			"sector_category_id",
			"sector_name",
			"sector_category_name",
		],
		[]
	);

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

	const columnsConfig = useMemo(
		() => [
			{
				id: "sector_category_name",
				label: t("Sector Category"),
				visible: true,
				minWidth: 250,
				sticky: true,
			},
			{
				id: "sector_name",
				label: t("Sector Name"),
				visible: true,
				minWidth: 300,
				sticky: true,
			},
			...years.map((year) => ({
				id: year.field,
				label: year.label,
				visible: true,
				minWidth: 120,
				yearId: year.id,
			})),
			{
				id: "total_budget",
				label: t("Total Budget"),
				visible: true,
				minWidth: 150,
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

	// Group data by sector category
	const groupedData = useMemo(() => {
		if (!data) return {};

		return data.reduce((acc, item) => {
			const category = item.sector_category_name || t("Uncategorized");
			if (!acc[category]) {
				acc[category] = {
					sector_category_id: item.sector_category_id,
					sectors: [],
					totals: {},
				};
			}
			acc[category].sectors.push(item);
			return acc;
		}, {});
	}, [data, t]);

	// Calculate totals for each category
	const calculateCategoryTotals = useMemo(() => {
		const totals = {};

		Object.entries(groupedData).forEach(([category, categoryData]) => {
			totals[category] = {};

			// Initialize year totals
			years.forEach((year) => {
				totals[category][year.field] = 0;
			});
			totals[category].total_budget = 0;

			// Sum up all sectors in this category
			categoryData.sectors.forEach((sector) => {
				years.forEach((year) => {
					const value = Number(sector[year.field]) || 0;
					totals[category][year.field] += value;
					totals[category].total_budget += value;
				});
			});
		});

		return totals;
	}, [groupedData, years]);

	// Filter data based on search term
	const filteredData = useMemo(() => {
		if (!searchTerm) return data;
		const lowerSearchTerm = searchTerm.toLowerCase();
		return data.filter(
			(item) =>
				(item.sector_name &&
					item.sector_name.toLowerCase().includes(lowerSearchTerm)) ||
				(item.sector_category_name &&
					item.sector_category_name.toLowerCase().includes(lowerSearchTerm))
		);
	}, [data, searchTerm]);

	// Regroup filtered data
	const filteredGroupedData = useMemo(() => {
		if (!filteredData) return {};

		return filteredData.reduce((acc, item) => {
			const category = item.sector_category_name || t("Uncategorized");
			if (!acc[category]) {
				acc[category] = {
					sector_category_id: item.sector_category_id,
					sectors: [],
					totals: {},
				};
			}
			acc[category].sectors.push(item);
			return acc;
		}, {});
	}, [filteredData, t]);

	// Prepare all rows for rendering
	const allRows = useMemo(() => {
		const rows = [];

		Object.entries(filteredGroupedData).forEach(
			([categoryName, categoryData]) => {
				const isExpanded = expandedCategories[categoryName] !== false;

				// Add category row
				rows.push({
					type: "category",
					categoryName,
					sectorCount: categoryData.sectors.length,
					isExpanded,
					totals: calculateCategoryTotals[categoryName] || {},
				});

				// Add sector rows if expanded
				if (isExpanded) {
					categoryData.sectors.forEach((sector, index) => {
						// Calculate sector total
						let sectorTotal = 0;
						years.forEach((year) => {
							sectorTotal += Number(sector[year.field]) || 0;
						});

						rows.push({
							type: "sector",
							...sector,
							sectorTotal,
							categoryName,
						});
					});
				}
			}
		);

		return rows;
	}, [filteredGroupedData, expandedCategories, calculateCategoryTotals, years]);

	// Toggle category expansion
	const toggleCategory = (categoryName) => {
		setExpandedCategories((prev) => ({
			...prev,
			[categoryName]: !prev[categoryName],
		}));
	};

	// Pagination
	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;
	const currentRows = allRows.slice(indexOfFirstRow, indexOfLastRow);
	const totalPages = Math.ceil(allRows.length / rowsPerPage);

	// Prepare data for export
	const exportData = useMemo(() => {
		const exportRows = [];

		Object.entries(filteredGroupedData).forEach(
			([categoryName, categoryData]) => {
				// Add individual sector rows
				categoryData.sectors.forEach((sector) => {
					let sectorTotal = 0;
					const sectorRow = {
						level: t("Sector"),
						sector_category_name: categoryName,
						sector_name: sector.sector_name,
					};

					years.forEach((year) => {
						const value = Number(sector[year.field]) || 0;
						sectorTotal += value;
						sectorRow[year.field] = value.toLocaleString();
					});

					sectorRow["total_budget"] = sectorTotal.toLocaleString();
					exportRows.push(sectorRow);
				});
			}
		);

		return exportRows;
	}, [filteredGroupedData, years, t]);

	// Filter export columns based on visibility
	const visibleExportColumns = useMemo(() => {
		const baseColumns = [
			{
				key: "sector_category_name",
				label: t("Sector Category"),
				width: 50,
				type: "string",
			},
			{
				key: "sector_name",
				label: t("Sector Name"),
				width: 40,
				type: "string",
			},
		];

		// Years group
		const yearsGroup = {
			key: "budget_by_years",
			label: t("Budget by Years"),
			columns: [],
		};

		years.forEach((year) => {
			if (!hiddenColumns.includes(year.field)) {
				yearsGroup.columns.push({
					key: year.field,
					label: year.label,
					width: 20,
					type: "number",
				});
			}
		});

		// Total budget
		if (!hiddenColumns.includes("total_budget")) {
			yearsGroup.columns.push({
				key: "total_budget",
				label: t("Total Budget"),
				width: 20,
				type: "number",
			});
		}

		// Only add years group if it has columns
		const result = [...baseColumns];
		if (yearsGroup.columns.length > 0) result.push(yearsGroup);

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

	// Render category row
	const renderCategoryRow = (row) => {
		return (
			<tr
				key={`category-${row.categoryName}`}
				className="category-row"
				onClick={() => toggleCategory(row.categoryName)}
			>
				{/* Sector Category */}
				{!hiddenColumns.includes("sector_category_name") && (
					<td
						data-column="sector_category_name"
						className="sticky-column"
						style={{ left: 0 }}
					>
						<span className="sector-toggle me-2">
							{row.isExpanded ? <FaChevronDown /> : <FaChevronRight />}
						</span>
						<strong>{row.categoryName}</strong>
					</td>
				)}

				{/* Sector Name */}
				{!hiddenColumns.includes("sector_name") && (
					<td
						data-column="sector_name"
						className="sticky-column"
						style={{ left: 250 }}
					>
						<strong>
							{row.sectorCount} {t("Sectors")}
						</strong>
					</td>
				)}

				{/* Year Budgets */}
				{years.map((year) => {
					if (!hiddenColumns.includes(year.field)) {
						return (
							<td key={year.field} data-column={year.field}>
								<strong>{formatCurrency(row.totals[year.field])}</strong>
							</td>
						);
					}
					return null;
				})}

				{/* Total Budget */}
				{!hiddenColumns.includes("total_budget") && (
					<td data-column="total_budget">
						<strong>{formatCurrency(row.totals.total_budget)}</strong>
					</td>
				)}
			</tr>
		);
	};

	// Render sector row
	const renderSectorRow = (row, index) => {
		return (
			<tr key={`sector-${row.sector_id}-${index}`}>
				{/* Sector Category - Empty for sector rows */}
				{!hiddenColumns.includes("sector_category_name") && (
					<td
						data-column="sector_category_name"
						className="sticky-column"
						style={{ left: 0 }}
					>
						{/* Empty for alignment */}
					</td>
				)}

				{/* Sector Name */}
				{!hiddenColumns.includes("sector_name") && (
					<td
						data-column="sector_name"
						className="sticky-column"
						style={{ left: 250, paddingLeft: "30px" }}
					>
						{row.sector_name}
					</td>
				)}

				{/* Year Budgets */}
				{years.map((year) => {
					if (!hiddenColumns.includes(year.field)) {
						const value = Number(row[year.field]) || 0;
						return (
							<td key={year.field} data-column={year.field}>
								{formatCurrency(value)}
							</td>
						);
					}
					return null;
				})}

				{/* Total Budget */}
				{!hiddenColumns.includes("total_budget") && (
					<td data-column="total_budget">{formatCurrency(row.sectorTotal)}</td>
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
							placeholder={t("Search by sector or category...")}
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
							tableName="Project Finance by Years"
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

						.category-row {
								background-color: #e8f4f0 !important;
								cursor: pointer;
								font-weight: bold;
						}
						.category-row:hover {
								background-color: #d4e8e0 !important;
						}
						.category-row td {
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
								z-index: 1;
								background-color: white !important;
						}
						.sticky-header {
								position: sticky;
								z-index: 2;
								background-color: #f8f9fa !important;
						}
						.sector-toggle {
								margin-right: 8px;
								transition: transform 0.2s;
						}

						/* Fixed sticky positioning - each column gets its own specific left position */
						.sticky-column:nth-child(1) { 
								left: 0px; 
								min-width: 250px;
						}
						.sticky-column:nth-child(2) { 
								left: 250px; 
								min-width: 300px;
						}
						.sticky-header:nth-child(1) { 
								left: 0px; 
								min-width: 250px;
						}
						.sticky-header:nth-child(2) { 
								left: 250px; 
								min-width: 300px;
						}
        `}</style>

				{/* Table */}
				<table
					id="budget-by-years-table"
					ref={tableRef}
					className={`table ${tableClass}`}
					style={{ width: "100%", fontSize: "0.85rem", minWidth: "1400px" }}
				>
					<thead ref={headerRowRef}>
						{/* Row 1: Main Groups */}
						<tr>
							{!hiddenColumns.includes("sector_category_name") && (
								<th
									rowSpan={2}
									data-column="sector_category_name"
									className="sticky-header"
									style={{ left: 0 }}
								>
									{t("Sector Category")}
								</th>
							)}
							{!hiddenColumns.includes("sector_name") && (
								<th
									rowSpan={2}
									data-column="sector_name"
									className="sticky-header"
									style={{ left: 250 }}
								>
									{t("Sector Name")}
								</th>
							)}

							{/* Budget by Years Group */}
							{years.some((year) => !hiddenColumns.includes(year.field)) && (
								<th
									colSpan={
										years.filter((year) => !hiddenColumns.includes(year.field))
											.length
									}
									data-column="years_group"
								>
									{t("Budget by Years")}
								</th>
							)}

							{!hiddenColumns.includes("total_budget") && (
								<th rowSpan={2} data-column="total_budget">
									{t("Total Budget")}
								</th>
							)}
						</tr>

						{/* Row 2: Individual Column Headers */}
						<tr>
							{/* Year subgroups */}
							{years.map(
								(year) =>
									!hiddenColumns.includes(year.field) && (
										<th key={year.field} data-column={year.field}>
											{year.label}
										</th>
									)
							)}
						</tr>
					</thead>

					<tbody>
						{currentRows.length > 0 ? (
							currentRows.map((row, index) => {
								if (row.type === "category") {
									return renderCategoryRow(row);
								} else {
									return renderSectorRow(row, index);
								}
							})
						) : (
							<tr>
								<td
									colSpan={visibleColumns.length + 1} // +1 for group headers
									style={{ textAlign: "center", padding: "2rem" }}
								>
									{searchTerm
										? t("No sectors match your search criteria.")
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

export default BudgetByYearsTable;
