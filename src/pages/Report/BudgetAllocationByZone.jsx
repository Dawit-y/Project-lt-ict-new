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

const BudgetAllocationTable = ({
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

	// Static fields that should NOT be treated as zones
	const staticFields = useMemo(
		() => ["sector_id", "sector_cat", "sector_name", "sector_category"],
		[]
	);

	// Dynamically extract zones from the first data item
	const zones = useMemo(() => {
		if (!data || data.length === 0) return [];

		const firstItem = data[0];
		const zoneFields = Object.keys(firstItem).filter(
			(key) =>
				!staticFields.includes(key) &&
				(key.endsWith("_req") || key.endsWith("_app"))
		);

		// Extract unique zone names (remove _req/_app suffixes)
		const zoneNames = [
			...new Set(
				zoneFields.map((field) => {
					if (field.endsWith("_req")) return field.replace("_req", "");
					if (field.endsWith("_app")) return field.replace("_app", "");
					return field;
				})
			),
		];

		return zoneNames.map((zone) => ({
			id: zone,
			label: t(zone) || zone,
			reqField: `${zone}_req`,
			appField: `${zone}_app`,
		}));
	}, [data, staticFields, t]);

	const columnsConfig = useMemo(
		() => [
			{
				id: "sector_category",
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
			...zones.map((zone) => ({
				id: zone.appField,
				label: `${zone.label}`,
				visible: true,
				minWidth: 150,
				zoneId: zone.id,
			})),
			{
				id: "total_approved",
				label: t("Total Approved"),
				visible: true,
				minWidth: 150,
			},
		],
		[t, zones]
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
			const category = item.sector_category || t("Uncategorized");
			if (!acc[category]) {
				acc[category] = {
					sector_cat: item.sector_cat, // Updated field name
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

			// Initialize zone totals
			zones.forEach((zone) => {
				totals[category][zone.appField] = 0;
			});
			totals[category].total_approved = 0;

			// Sum up all sectors in this category
			categoryData.sectors.forEach((sector) => {
				zones.forEach((zone) => {
					const value = Number(sector[zone.appField]) || 0;
					totals[category][zone.appField] += value;
					totals[category].total_approved += value;
				});
			});
		});

		return totals;
	}, [groupedData, zones]);

	// Filter data based on search term
	const filteredData = useMemo(() => {
		if (!searchTerm) return data;
		const lowerSearchTerm = searchTerm.toLowerCase();
		return data.filter(
			(item) =>
				(item.sector_name &&
					item.sector_name.toLowerCase().includes(lowerSearchTerm)) ||
				(item.sector_category &&
					item.sector_category.toLowerCase().includes(lowerSearchTerm))
		);
	}, [data, searchTerm]);

	// Regroup filtered data
	const filteredGroupedData = useMemo(() => {
		if (!filteredData) return {};

		return filteredData.reduce((acc, item) => {
			const category = item.sector_category || t("Uncategorized");
			if (!acc[category]) {
				acc[category] = {
					sector_cat: item.sector_cat, // Updated field name
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
						zones.forEach((zone) => {
							sectorTotal += Number(sector[zone.appField]) || 0;
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
	}, [filteredGroupedData, expandedCategories, calculateCategoryTotals, zones]);

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
						sector_category: categoryName,
						sector_name: sector.sector_name,
					};

					zones.forEach((zone) => {
						const value = Number(sector[zone.appField]) || 0;
						sectorTotal += value;
						sectorRow[zone.appField] = value.toLocaleString();
					});

					sectorRow["total_approved"] = sectorTotal.toLocaleString();
					exportRows.push(sectorRow);
				});
			}
		);

		return exportRows;
	}, [filteredGroupedData, calculateCategoryTotals, zones, t]);

	// Filter export columns based on visibility
	const visibleExportColumns = useMemo(() => {
		return columnsConfig
			.filter((col) => !hiddenColumns.includes(col.id))
			.map((col) => ({
				key: col.id,
				label: col.label,
				width:
					col.id === "sector_name"
						? 50
						: col.id === "sector_category"
							? 60
							: 20,
				type:
					col.id === "sector_name" || col.id === "sector_category"
						? "string"
						: "number",
			}));
	}, [hiddenColumns, columnsConfig]);

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
				{!hiddenColumns.includes("sector_category") && (
					<td
						data-column="sector_category"
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

				{/* Zone Approved Budgets */}
				{zones.map((zone) => {
					if (!hiddenColumns.includes(zone.appField)) {
						return (
							<td key={zone.appField} data-column={zone.appField}>
								<strong>{formatCurrency(row.totals[zone.appField])}</strong>
							</td>
						);
					}
					return null;
				})}

				{/* Total Approved */}
				{!hiddenColumns.includes("total_approved") && (
					<td data-column="total_approved">
						<strong>{formatCurrency(row.totals.total_approved)}</strong>
					</td>
				)}
			</tr>
		);
	};

	// Render sector row
	const renderSectorRow = (row, index) => {
		return (
			<tr key={`sector-${row.sector_name}-${index}`}>
				{/* Sector Category - Empty for sector rows */}
				{!hiddenColumns.includes("sector_category") && (
					<td
						data-column="sector_category"
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

				{/* Zone Approved Budgets */}
				{zones.map((zone) => {
					if (!hiddenColumns.includes(zone.appField)) {
						const value = Number(row[zone.appField]) || 0;
						return (
							<td key={zone.appField} data-column={zone.appField}>
								{formatCurrency(value)}
							</td>
						);
					}
					return null;
				})}

				{/* Total Approved */}
				{!hiddenColumns.includes("total_approved") && (
					<td data-column="total_approved">
						{formatCurrency(row.sectorTotal)}
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
							tableName="Budget Allocation"
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
					id="budget-allocation-table"
					ref={tableRef}
					className={`table ${tableClass}`}
					style={{ width: "100%", fontSize: "0.85rem", minWidth: "1200px" }}
				>
					<thead ref={headerRowRef}>
						<tr>
							{columnsConfig.map(
								(col) =>
									!hiddenColumns.includes(col.id) && (
										<th
											key={col.id}
											data-column={col.id}
											className={col.sticky ? "" : ""}
											style={{
												minWidth: `${columnWidths[col.id] || col.minWidth}px`,
												position: "relative",
											}}
										>
											{col.label}
											{!col.sticky && (
												<div
													className="resize-handle"
													onMouseDown={(e) => startResizing(col.id, e)}
												/>
											)}
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
									colSpan={visibleColumns.length}
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

export default BudgetAllocationTable;
