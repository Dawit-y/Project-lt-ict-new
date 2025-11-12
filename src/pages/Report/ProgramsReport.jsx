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
import { transformProgramsBySector } from "../../queries/programinfo_query";

const ProgramHierarchyTable = ({
	data = [],
	exportSearchParams,
	t = (key) => key,
	tableClass = "",
}) => {
	const transformedData = useMemo(() => {
		return transformProgramsBySector(data);
	}, [data]);
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
	const [expandedNodes, setExpandedNodes] = useState({});

	const tableRef = useRef(null);
	const headerRowRef = useRef(null);

	const columnsConfig = useMemo(
		() => [
			{
				id: "name",
				label: t("Name"),
				visible: true,
				minWidth: 300,
				sticky: true,
			},
			{
				id: "level",
				label: t("Level"),
				visible: true,
				minWidth: 120,
			},
			{
				id: "program_code",
				label: t("Program Code"),
				visible: true,
				minWidth: 120,
			},
			{
				id: "start_date",
				label: t("Start Date"),
				visible: true,
				minWidth: 100,
			},
			{
				id: "end_date",
				label: t("End Date"),
				visible: true,
				minWidth: 100,
			},
			{
				id: "duration",
				label: t("Duration"),
				visible: true,
				minWidth: 80,
			},
			{
				id: "sector_name",
				label: t("Sector"),
				visible: true,
				minWidth: 150,
			},
			{
				id: "children_count",
				label: t("Children Count"),
				visible: true,
				minWidth: 100,
			},
			{
				id: "output_count",
				label: t("Outputs"),
				visible: true,
				minWidth: 80,
			},
		],
		[t]
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

	// Flatten hierarchical data for display
	const flattenHierarchy = (
		nodes,
		level = 0,
		parentExpanded = true,
		path = []
	) => {
		let rows = [];

		nodes.forEach((node) => {
			const nodePath = [...path, node.id];
			const nodeKey = nodePath.join("-");
			const isExpanded = expandedNodes[nodeKey] !== false && parentExpanded;
			const hasChildren = node.children && node.children.length > 0;

			// Calculate outputs count
			const outputCount = countOutputs(node);

			// Calculate duration
			const duration = calculateDuration(
				node.pri_start_date,
				node.pri_end_date
			);

			// Get object type label
			const objectType = getObjectTypeLabel(
				node.level,
				node.pri_object_type_id
			);

			// Add current node
			rows.push({
				...node,
				type: "node",
				level: node.level,
				levelDepth: level,
				nodeKey,
				isExpanded,
				hasChildren,
				outputCount,
				duration,
				objectType,
				sector_name: node.sci_name_en,
				children_count: hasChildren ? node.children.length : 0,
				program_code: node.pri_program_code || "---",
				start_date: node.pri_start_date || "---",
				end_date: node.pri_end_date || "---",
				description: node.pri_description || "---",
			});

			// Add children if expanded
			if (hasChildren && isExpanded) {
				const childRows = flattenHierarchy(
					node.children,
					level + 1,
					isExpanded,
					nodePath
				);
				rows = [...rows, ...childRows];
			}
		});

		return rows;
	};

	// Count outputs in hierarchy
	const countOutputs = (node) => {
		if (!node.children || node.children.length === 0) {
			return node.level === "output" ? 1 : 0;
		}

		return node.children.reduce(
			(count, child) => count + countOutputs(child),
			0
		);
	};

	// Calculate duration in years
const calculateDuration = (startDate, endDate) => {
	if (!startDate || !endDate || startDate === "---" || endDate === "---")
		return "---";

	try {
		// Normalize the date format by replacing forward slashes
		const normalizedStartDate = startDate.replace(/\//g, "-");
		const normalizedEndDate = endDate.replace(/\//g, "-");

		const start = new Date(normalizedStartDate);
		const end = new Date(normalizedEndDate);

		// Check if dates are valid
		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			return "---";
		}

		// Calculate difference in years with better precision
		const diffTime = Math.abs(end - start);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		const diffYears = diffDays / 365.25;

		// Format based on duration
		if (diffYears < 1) {
			const diffMonths = Math.round(diffDays / 30.44);
			return `${diffMonths} ${t("months")}`;
		} else {
			const years = Math.round(diffYears * 10) / 10; // Round to 1 decimal place
			return `${years} ${t("years")}`;
		}
	} catch {
		return "---";
	}
};

	// Get object type label
	const getObjectTypeLabel = (level, objectTypeId) => {
		if (level === "sector") return t("Sector");
		if (level === "program") return t("Program");
		if (level === "subprogram") return t("Subprogram");
		if (level === "output") return t("Output");

		// Fallback based on object_type_id
		switch (objectTypeId) {
			case 1:
				return t("Program");
			case 2:
				return t("Sector");
			case 3:
				return t("Subprogram");
			case 4:
				return t("Output");
			default:
				return t("Unknown");
		}
	};

	// Toggle node expansion
	const toggleNode = (nodeKey) => {
		setExpandedNodes((prev) => ({
			...prev,
			[nodeKey]: !prev[nodeKey],
		}));
	};

	// Filter data based on search term
	const filteredData = useMemo(() => {
		if (!searchTerm) return transformedData;
		const lowerSearchTerm = searchTerm.toLowerCase();

		const filterNode = (node) => {
			const matches =
				(node.name && node.name.toLowerCase().includes(lowerSearchTerm)) ||
				(node.pri_name_or &&
					node.pri_name_or.toLowerCase().includes(lowerSearchTerm)) ||
				(node.pri_program_code &&
					node.pri_program_code.toLowerCase().includes(lowerSearchTerm)) ||
				(node.pri_description &&
					node.pri_description.toLowerCase().includes(lowerSearchTerm));

			if (matches) return true;

			// Check children recursively
			if (node.children && node.children.length > 0) {
				return node.children.some(filterNode);
			}

			return false;
		};

		return transformedData.filter(filterNode);
	}, [transformedData, searchTerm]);

	// Prepare flattened data for rendering
	const allRows = useMemo(() => {
		return flattenHierarchy(filteredData);
	}, [filteredData, expandedNodes]);

	// Pagination
	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;
	const currentRows = allRows.slice(indexOfFirstRow, indexOfLastRow);
	const totalPages = Math.ceil(allRows.length / rowsPerPage);

	// Prepare data for export
	const exportData = useMemo(() => {
		return allRows.map((row) => ({
			level: t(row.level.charAt(0).toUpperCase() + row.level.slice(1)),
			name: row.name,
			program_code: row.program_code,
			// object_type: row.objectType,
			start_date: row.start_date,
			end_date: row.end_date,
			duration: row.duration,
			description: row.description,
			sector_name: row.sector_name,
			children_count: row.children_count,
			output_count: row.outputCount,
		}));
	}, [allRows]);

	// Filter export columns based on visibility
	const visibleExportColumns = useMemo(() => {
		return columnsConfig
			.filter((col) => !hiddenColumns.includes(col.id))
			.map((col) => ({
				key: col.id,
				label: col.label,
				width: col.id === "name" ? 60 : 20,
			}));
	}, [hiddenColumns, columnsConfig]);

	// Event handlers
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	const toggleDropdown = () => setDropdownOpen((prev) => !prev);

	// Column resizing handlers (same as original)
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

	// Pagination items generator (same as original)
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

	// Get level color
	const getLevelColor = (level) => {
		switch (level) {
			case "sector":
				return "#e8f4f0"; // Light green
			case "program":
				return "#e3f2fd"; // Light blue
			case "subprogram":
				return "#fff3e0"; // Light orange
			case "output":
				return "#f3e5f5"; // Light purple
			default:
				return "#fafafa"; // Light gray
		}
	};

	// Get level text color
	const getLevelTextColor = (level) => {
		switch (level) {
			case "sector":
				return "#1b5e20"; // Dark green
			case "program":
				return "#0d47a1"; // Dark blue
			case "subprogram":
				return "#e65100"; // Dark orange
			case "output":
				return "#4a148c"; // Dark purple
			default:
				return "#000000"; // Black
		}
	};

	// Render node row
	const renderNodeRow = (row, index) => {
		const indent = row.levelDepth * 24;
		const backgroundColor = getLevelColor(row.level);
		const textColor = getLevelTextColor(row.level);
		const isExpandable = row.hasChildren;

		return (
			<tr
				key={row.nodeKey}
				style={{
					backgroundColor,
					color: textColor,
					fontWeight: row.level === "sector" ? "bold" : "normal",
				}}
			>
				{/* Name with toggle */}
				{!hiddenColumns.includes("name") && (
					<td
						data-column="name"
						className="sticky-column"
						style={{
							left: 0,
							paddingLeft: `${8 + indent}px`,
							fontWeight: row.level === "sector" ? "bold" : "normal",
						}}
					>
						<div className="d-flex align-items-center">
							{isExpandable && (
								<span
									className="sector-toggle me-2"
									onClick={(e) => {
										e.stopPropagation();
										toggleNode(row.nodeKey);
									}}
									style={{ cursor: "pointer" }}
								>
									{row.isExpanded ? <FaChevronDown /> : <FaChevronRight />}
								</span>
							)}
							{!isExpandable && (
								<span className="me-2" style={{ width: "16px" }}></span>
							)}
							<span>
								{row.name || row.pri_name_or || t("Unnamed")}
								{row.level === "sector" && (
									<span
										className="ms-2 text-muted"
										style={{ fontSize: "0.8rem" }}
									>
										({row.children_count} {t("programs")})
									</span>
								)}
							</span>
						</div>
					</td>
				)}

				{/* Level */}
				{!hiddenColumns.includes("level") && (
					<td data-column="level" style={{ paddingLeft: `${8 + indent}px` }}>
						{t(row.level.charAt(0).toUpperCase() + row.level.slice(1))}
					</td>
				)}

				{/* Program Code */}
				{!hiddenColumns.includes("program_code") && (
					<td data-column="program_code">{row.program_code}</td>
				)}

				{/* Start Date */}
				{!hiddenColumns.includes("start_date") && (
					<td data-column="start_date">{row.start_date}</td>
				)}

				{/* End Date */}
				{!hiddenColumns.includes("end_date") && (
					<td data-column="end_date">{row.end_date}</td>
				)}

				{/* Duration */}
				{!hiddenColumns.includes("duration") && (
					<td data-column="duration">{row.duration}</td>
				)}

				{/* Sector Name */}
				{!hiddenColumns.includes("sector_name") && (
					<td data-column="sector_name">{row.sector_name}</td>
				)}

				{/* Children Count */}
				{!hiddenColumns.includes("children_count") && (
					<td data-column="children_count">
						{row.children_count > 0 ? row.children_count : "-"}
					</td>
				)}

				{/* Output Count */}
				{!hiddenColumns.includes("output_count") && (
					<td data-column="output_count">
						{row.outputCount > 0 ? row.outputCount : "-"}
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
							placeholder={t("Search by name, code ...")}
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
							tableName="Program Hierarchy"
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
            background-color: inherit !important;
          }
          .sticky-header {
            position: sticky;
            left: 0;
            z-index: 2;
            background-color: #f8f9fa !important;
          }
          .sector-toggle {
            transition: transform 0.2s;
            cursor: pointer;
          }
          .sticky-column:nth-child(1) { left: 0; }
          .sticky-header:nth-child(1) { left: 0; }
        `}</style>

				{/* Table */}
				<table
					id="program-hierarchy-table"
					ref={tableRef}
					className={`table ${tableClass}`}
					style={{ width: "100%", fontSize: "0.85rem", minWidth: "1000px" }}
				>
					<thead ref={headerRowRef}>
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
							currentRows.map((row, index) => renderNodeRow(row, index))
						) : (
							<tr>
								<td
									colSpan={visibleColumns.length}
									style={{ textAlign: "center", padding: "2rem" }}
								>
									{searchTerm
										? t("No programs match your search criteria.")
										: t("No programs available.")}
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

export default ProgramHierarchyTable;
