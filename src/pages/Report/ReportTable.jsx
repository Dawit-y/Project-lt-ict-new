import React, { useState, useMemo, useRef, useEffect , lazy, Suspense, useCallback} from "react";
import {
	Card,
	CardBody,
	Input,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Button,
	Spinner
} from "reactstrap";
import {
	FaSearch,
	FaEye,
	FaEyeSlash,
	FaColumns,
	FaChevronDown,
	FaChevronRight,
} from "react-icons/fa";
//import ExportToExcel from "../../components/Common/ExportToExcel";
const LazyExportToExcel = lazy(() => import("../../components/Common/ExportToExcel"));
import { useTranslation } from "react-i18next";

const ReportTable = ({
	data = [],
	columnsConfig = [],
	exportSearchParams,
	tableClass = "",
	tableName = "Report",
	// Grouping configuration
	groupBy = null,
	expandable = true,
	// Header configuration
	headerStructure = "simple", // 'simple' | 'grouped'
	// Custom rendering
	renderGroupRow = null,
	renderDataRow = null,
	// Data processing
	calculateTotals = null,
	prepareExportData = null,
	// Data transformations
	transformData = null,
	// Search configuration
	searchFields = [],
	searchPlaceholder = "Search...",
}) => {
	const { t } = useTranslation();
	// State management
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
	const [expandedGroups, setExpandedGroups] = useState({});

	const tableRef = useRef(null);
	const headerRowRef = useRef(null);
	const [activeExport, setActiveExport] = useState(null);
	// Initialize column widths
	useEffect(() => {
		const initialWidths = {};
		columnsConfig.forEach((col) => {
			initialWidths[col.id] = col.minWidth || 100;
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

	// Transform data if provided
	const transformedData = useMemo(() => {
		if (transformData) {
			return transformData(data);
		}
		return data;
	}, [data, transformData]);

	// Filter data based on search term
	const filteredData = useMemo(() => {
		if (!searchTerm || searchFields.length === 0) return transformedData;

		const lowerSearchTerm = searchTerm.toLowerCase();
		return transformedData.filter((item) =>
			searchFields.some((field) =>
				item[field]?.toString().toLowerCase().includes(lowerSearchTerm)
			)
		);
	}, [transformedData, searchTerm, searchFields]);

	// Group data if groupBy is specified
	const groupedData = useMemo(() => {
		if (!groupBy || !filteredData)
			return { [t("All")]: { items: filteredData } };

		return filteredData.reduce((acc, item) => {
			const groupKey = item[groupBy] || t("Ungrouped");
			if (!acc[groupKey]) {
				acc[groupKey] = { items: [] };
			}
			acc[groupKey].items.push(item);
			return acc;
		}, {});
	}, [filteredData, groupBy, t]);

	// Calculate totals if provided
	const calculatedTotals = useMemo(() => {
		if (!calculateTotals) return {};
		return calculateTotals(groupedData, columnsConfig);
	}, [groupedData, calculateTotals, columnsConfig]);

	// Prepare all rows for rendering
	const allRows = useMemo(() => {
		const rows = [];

		Object.entries(groupedData).forEach(([groupName, groupData]) => {
			const isExpanded = expandedGroups[groupName] !== false;

			// Add group row if expandable
			if (expandable && groupBy) {
				rows.push({
					type: "group",
					groupName,
					itemCount: groupData.items.length,
					isExpanded,
					totals: calculatedTotals[groupName] || {},
				});
			}

			// Add data rows if expanded or not expandable
			if (!expandable || isExpanded) {
				groupData.items.forEach((item, index) => {
					rows.push({
						type: "data",
						...item,
						groupName,
					});
				});
			}
		});

		return rows;
	}, [groupedData, expandedGroups, calculatedTotals, expandable, groupBy]);

	// Toggle group expansion
	const toggleGroup = (groupName) => {
		setExpandedGroups((prev) => ({
			...prev,
			[groupName]: !prev[groupName],
		}));
	};

	// Pagination
	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;
	const currentRows = allRows.slice(indexOfFirstRow, indexOfLastRow);
	const totalPages = Math.ceil(allRows.length / rowsPerPage);

	// Prepare data for export
	const exportData = useMemo(() => {
		if (prepareExportData) {
			return prepareExportData(filteredData, groupedData, calculatedTotals, t);
		}

		// Default export preparation
		const exportRows = [];
		Object.entries(groupedData).forEach(([groupName, groupData]) => {
			groupData.items.forEach((item) => {
				const exportRow = { group: groupName };
				columnsConfig.forEach((col) => {
					if (!hiddenColumns.includes(col.id)) {
						const value = item[col.id];
						exportRow[col.id] =
							col.format === "number" || col.format === "currency"
								? Number(value) || 0
								: value;
					}
				});
				exportRows.push(exportRow);
			});
		});
		return exportRows;
	}, [
		filteredData,
		groupedData,
		calculatedTotals,
		prepareExportData,
		t,
		columnsConfig,
		hiddenColumns,
	]);

	// Filter export columns based on visibility
	const visibleExportColumns = useMemo(() => {
		const baseColumns = columnsConfig
			.filter((col) => !hiddenColumns.includes(col.id) && !col.group)
			.map((col) => ({
				key: col.id,
				label: col.label,
				width: col.exportWidth || 20,
				type:
					col.format === "number" || col.format === "currency"
						? "number"
						: col.format === "percentage"
							? "percentage"
							: "string",
			}));

		// Handle grouped columns for export
		const columnGroups = {};
		columnsConfig.forEach((col) => {
			if (!hiddenColumns.includes(col.id) && col.group) {
				if (!columnGroups[col.group]) {
					columnGroups[col.group] = {
						key: col.group,
						label: t(col.group) || col.group,
						columns: [],
					};
				}
				columnGroups[col.group].columns.push({
					key: col.id,
					label: col.label,
					width: col.exportWidth || 15,
					type:
						col.format === "number" || col.format === "currency"
							? "number"
							: col.format === "percentage"
								? "percentage"
								: "string",
				});
			}
		});

		// Add grouped columns to result
		const result = [...baseColumns];
		Object.values(columnGroups).forEach((group) => {
			if (group.columns.length > 0) {
				result.push(group);
			}
		});

		return result;
	}, [hiddenColumns, columnsConfig, t]);

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

	// Get visible columns for table rendering
	const visibleColumns = useMemo(() => {
		return columnsConfig.filter((col) => !hiddenColumns.includes(col.id));
	}, [columnsConfig, hiddenColumns]);

	// Helper functions
	const formatValue = (value, format = "string") => {
		if (value === null || value === undefined || value === "") return "-";

		switch (format) {
			case "currency":
				return new Intl.NumberFormat("en-ET", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}).format(value);
			case "percentage":
				return `${Number(value).toFixed(2)}%`;
			case "number":
				return Number(value).toLocaleString();
			default:
				return value.toString();
		}
	};

	const getStickyPosition = (columnId) => {
		const stickyColumns = columnsConfig.filter(
			(col) => col.sticky && !hiddenColumns.includes(col.id)
		);
		const index = stickyColumns.findIndex((col) => col.id === columnId);
		if (index === -1) return 0;

		let position = 0;
		for (let i = 0; i < index; i++) {
			position +=
				columnWidths[stickyColumns[i].id] || stickyColumns[i].minWidth || 100;
		}
		return position;
	};

	const renderHeader = () => {
		if (headerStructure === "simple") {
			return (
				<tr>
					{columnsConfig.map(
						(col) =>
							!hiddenColumns.includes(col.id) && (
								<th
									key={col.id}
									data-column={col.id}
									className={col.sticky ? "sticky-header" : ""}
									style={{
										minWidth: `${columnWidths[col.id] || col.minWidth}px`,
										position: "relative",
										left: col.sticky ? getStickyPosition(col.id) : "auto",
									}}
								>
									{t(col.label)}
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
			);
		}

		// Grouped header structure
		const groups = {};
		columnsConfig.forEach((col) => {
			if (hiddenColumns.includes(col.id)) return;

			const groupName = col.group;
			if (groupName && groupName !== "default") {
				if (!groups[groupName]) groups[groupName] = [];
				groups[groupName].push(col);
			}
		});

		const hasGroups = Object.keys(groups).length > 0;

		return (
			<>
				{hasGroups && (
					<tr>
						{columnsConfig.map((col) => {
							if (hiddenColumns.includes(col.id)) return null;

							if (col.group && col.group !== "default") {
								const groupCols = groups[col.group];
								const isFirstInGroup = groupCols[0].id === col.id;

								if (isFirstInGroup) {
									return (
										<th
											key={`${col.group}-header`}
											colSpan={groupCols.length}
											data-column={`${col.group}_group`}
										>
											{t(col.group) || col.group}
										</th>
									);
								}
								return null;
							} else {
								// Non-grouped columns get individual cells
								return (
									<th key={col.id} rowSpan={2} data-column={col.id}>
										{t(col.label)}
									</th>
								);
							}
						})}
					</tr>
				)}
				<tr>
					{columnsConfig.map((col) => {
						if (hiddenColumns.includes(col.id)) return null;

						// Only render individual column headers for grouped columns
						if (col.group && col.group !== "default") {
							return (
								<th
									key={col.id}
									data-column={col.id}
									className={col.sticky ? "sticky-header" : ""}
									style={{
										minWidth: `${columnWidths[col.id] || col.minWidth}px`,
										position: "relative",
										left: col.sticky ? getStickyPosition(col.id) : "auto",
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
							);
						} else if (!col.group) {
							// Non-grouped columns were already rendered in first row
							return null;
						}
						return null;
					})}
				</tr>
			</>
		);
	};

	// Default renderers
	const defaultRenderGroupRow = (row) => (
		<tr
			key={`group-${row.groupName}`}
			className="group-row"
			onClick={() => toggleGroup(row.groupName)}
		>
			{columnsConfig.map((col) => {
				if (hiddenColumns.includes(col.id)) return null;

				let content = "";
				if (col.id === groupBy) {
					content = (
						<>
							<span className="group-toggle me-2">
								{row.isExpanded ? <FaChevronDown /> : <FaChevronRight />}
							</span>
							<strong>{row.groupName}</strong>
						</>
					);
				} else if (col.sticky && col.id !== groupBy) {
					content = (
						<strong>
							{row.itemCount} {t("items")}
						</strong>
					);
				} else if (row.totals[col.id] !== undefined) {
					content = (
						<strong>{formatValue(row.totals[col.id], col.format)}</strong>
					);
				}

				return (
					<td
						key={col.id}
						data-column={col.id}
						className={col.sticky ? "sticky-column" : ""}
						style={col.sticky ? { left: getStickyPosition(col.id) } : {}}
					>
						{content}
					</td>
				);
			})}
		</tr>
	);

	const defaultRenderDataRow = (row, index) => (
		<tr key={`data-${row.id || index}`}>
			{columnsConfig.map((col) => {
				if (hiddenColumns.includes(col.id)) return null;

				const value = row[col.id];
				const isGroupColumn = col.id === groupBy;

				return (
					<td
						key={col.id}
						data-column={col.id}
						className={col.sticky ? "sticky-column" : ""}
						style={col.sticky ? { left: getStickyPosition(col.id) } : {}}
					>
						{isGroupColumn && expandable ? "" : formatValue(value, col.format)}
					</td>
				);
			})}
		</tr>
	);

	const renderRow = (row, index) => {
		if (row.type === "group") {
			return renderGroupRow
				? renderGroupRow(row, toggleGroup, t)
				: defaultRenderGroupRow(row);
		} else {
			return renderDataRow
				? renderDataRow(row, index, t)
				: defaultRenderDataRow(row, index);
		}
	};

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

	return (
		<div style={{ width: "100%", overflowX: "auto" }}>
			{/* Search and Controls Card */}
			<Card className="mb-3">
				<CardBody className="d-flex justify-content-between align-items-center">
					<div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
						<Input
							type="text"
							placeholder={t(searchPlaceholder)}
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
						<Suspense fallback={<Spinner size="sm" />}>
		{activeExport === 1 && (
			<LazyExportToExcel
				tableData={exportData}
							tableName={tableName}
							exportColumns={visibleExportColumns}
							exportSearchParams={exportSearchParams}
				autoRun
				onDone={() => setActiveExport(null)}
			/>
		)}
</Suspense>
<Button 
						color="outline-primary"
						className="mb-2"
						onClick={() => setActiveExport(1)}>
			Export to Excel
		</Button>
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

					.group-row {
						background-color: #e8f4f0 !important;
						cursor: pointer;
						font-weight: bold;
					}
					.group-row:hover {
						background-color: #d4e8e0 !important;
					}
					.group-row td {
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
					.group-toggle {
						margin-right: 8px;
						transition: transform 0.2s;
					}
				`}</style>

				{/* Table */}
				<table
					ref={tableRef}
					className={`table ${tableClass}`}
					style={{ width: "100%", fontSize: "0.85rem", minWidth: "1200px" }}
				>
					<thead ref={headerRowRef}>{renderHeader()}</thead>

					<tbody>
						{currentRows.length > 0 ? (
							currentRows.map((row, index) => renderRow(row, index))
						) : (
							<tr>
								<td
									colSpan={visibleColumns.length}
									style={{ textAlign: "center", padding: "2rem" }}
								>
									{searchTerm
										? t("No items match your search criteria.")
										: t("No data available.")}
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

export default ReportTable;
