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
import { financialReportOneExportColumns } from "../../utils/exportColumnsForReport";

const FinancialProjectsTable = ({
	data = [],
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
	const [expandedSectors, setExpandedSectors] = useState({});

	const tableRef = useRef(null);
	const headerRowRef = useRef(null);

	const columnsConfig = useMemo(
		() => [
			{
				id: "prj_name",
				label: t("Project Name"),
				visible: true,
				minWidth: 150,
				sticky: true,
			},
			{
				id: "prj_measurement_unit",
				label: t("Unit"),
				visible: true,
				minWidth: 60,
			},
			{
				id: "prj_measured_figure",
				label: t("Measured Figure"),
				visible: true,
				minWidth: 80,
			},
			{
				id: "prj_status",
				label: t("Status"),
				visible: true,
				minWidth: 80,
			},
			{
				id: "sector",
				label: t("Sector"),
				visible: true,
				minWidth: 100,
			},
			{
				id: "project_category",
				label: t("Category"),
				visible: true,
				minWidth: 100,
			},
			{
				id: "prj_code",
				label: t("Project Code"),
				visible: true,
				minWidth: 80,
				sticky: true,
			},
			{
				id: "prj_location_description",
				label: t("Specific Site"),
				visible: true,
				minWidth: 120,
			},
			{
				id: "zone",
				label: t("Zone"),
				visible: true,
				minWidth: 100,
			},
			{
				id: "woreda",
				label: t("Woreda"),
				visible: true,
				minWidth: 100,
			},
			{
				id: "start_year",
				label: t("Start Year"),
				visible: true,
				minWidth: 60,
			},
			{
				id: "end_year",
				label: t("End Year"),
				visible: true,
				minWidth: 60,
			},
			{
				id: "bdr_before_previous_year_physical",
				label: t("Before Previous Year"),
				visible: true,
				minWidth: 80,
			},
			{
				id: "bdr_previous_year_physical",
				label: t("Previous Year"),
				visible: true,
				minWidth: 80,
			},
			{
				id: "bdr_physical_baseline",
				label: t("Physical Baseline"),
				visible: true,
				minWidth: 80,
			},
			// Physical Action Plan Group
			{
				id: "bdr_physical_planned",
				label: t("Physical Planned"),
				visible: true,
				minWidth: 80,
			},
			{
				id: "bdr_physical_approved",
				label: t("Physical Approved"),
				visible: true,
				minWidth: 80,
			},
			// Budget Information
			{
				id: "prj_total_estimate_budget",
				label: t("Total Estimated Budget"),
				visible: true,
				minWidth: 100,
			},
			{
				id: "bdr_before_previous_year_financial",
				label: t("Before Previous Year"),
				visible: true,
				minWidth: 80,
			},
			{
				id: "bdr_previous_year_financial",
				label: t("Previous Year"),
				visible: true,
				minWidth: 80,
			},
			{
				id: "bdr_financial_baseline",
				label: t("Financial Baseline"),
				visible: true,
				minWidth: 80,
			},
			// Current Budget Plan Group
			{
				id: "bdr_requested_amount",
				label: t("Requested Amount"),
				visible: true,
				minWidth: 80,
			},
			{
				id: "bdr_released_amount",
				label: t("Released Amount"),
				visible: true,
				minWidth: 80,
			},
			// Supported by budgetary sources Group
			{
				id: "bdr_source_government_approved",
				label: t("Government Approved"),
				visible: true,
				minWidth: 80,
			},
			{
				id: "bdr_source_internal_requested",
				label: t("Internal Requested"),
				visible: true,
				minWidth: 80,
			},
			{
				id: "bdr_source_other_approved",
				label: t("Other Approved"),
				visible: true,
				minWidth: 80,
			},
			{
				id: "total",
				label: t("Total"),
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

	// Filter data based on search term
	const filteredData = useMemo(() => {
		if (!searchTerm) return data;
		const lowerSearchTerm = searchTerm.toLowerCase();
		return data.filter(
			(project) =>
				(project.sector &&
					project.sector.toLowerCase().includes(lowerSearchTerm)) ||
				(project.prj_name &&
					project.prj_name.toLowerCase().includes(lowerSearchTerm)) ||
				(project.prj_code &&
					project.prj_code.toLowerCase().includes(lowerSearchTerm))
		);
	}, [data, searchTerm]);

	// Group data by sector and project name
	const groupedData = useMemo(() => {
		if (!filteredData) return {};
		return filteredData.reduce((acc, project) => {
			const sector = project.sector || t("Other Sector");
			const projectName = project.prj_name || t("Unnamed Project");
			if (!acc[sector]) acc[sector] = {};
			if (!acc[sector][projectName]) acc[sector][projectName] = { entries: [] };
			acc[sector][projectName].entries.push(project);
			return acc;
		}, {});
	}, [filteredData, t]);

	// Toggle sector expansion
	const toggleSector = (sectorName) => {
		setExpandedSectors((prev) => ({
			...prev,
			[sectorName]: !prev[sectorName],
		}));
	};

	// Prepare all rows for rendering
	const allRows = useMemo(() => {
		const rows = [];
		let projectCounter = 1;

		Object.entries(groupedData || {}).forEach(([sectorName, projects]) => {
			const isExpanded = expandedSectors[sectorName] !== false;

			rows.push({
				type: "sector",
				sectorName,
				projectCount: Object.keys(projects).length,
				isExpanded,
			});

			if (isExpanded) {
				Object.entries(projects || {}).forEach(([projectName, projectData]) => {
					const projectList = Array.isArray(projectData.entries)
						? projectData.entries
						: [projectData];
					const rowSpan = projectList.length;

					const commonValues = {
						prj_measurement_unit: projectList[0]?.prj_measurement_unit || " ",
						prj_status: projectList[0]?.prj_status || " ",
						sector: sectorName,
						project_category: projectList[0]?.project_category || " ",
						prj_location_description:
							projectList[0]?.prj_location_description || " ",
						zone: projectList[0]?.zone || " ",
						woreda: projectList[0]?.woreda || " ",
						start_year: projectList[0]?.start_year || " ",
						end_year: projectList[0]?.end_year || " ",
						prj_total_estimate_budget:
							projectList[0]?.prj_total_estimate_budget || " ",
						rowSpan,
					};

					projectList.forEach((proj, index) => {
						rows.push({
							type: "project",
							...proj,
							projectSN: index === 0 ? projectCounter : null,
							showMergedCells: index === 0,
							commonValues,
							sectorName,
							projectName,
						});
					});

					projectCounter++;
				});
			}
		});

		return rows;
	}, [groupedData, expandedSectors, t]);

	// Pagination
	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;
	const currentRows = allRows.slice(indexOfFirstRow, indexOfLastRow);
	const totalPages = Math.ceil(allRows.length / rowsPerPage);

	// Count unique projects for display
	const uniqueProjectNamesCount = useMemo(() => {
		const projectNames = new Set();
		currentRows.forEach((row) => {
			if (row.type === "project" && row.showMergedCells) {
				projectNames.add(row.projectName);
			}
		});
		return projectNames.size;
	}, [currentRows]);

	const totalUniqueProjectNames = useMemo(() => {
		const projectNames = new Set();
		Object.values(groupedData || {}).forEach((projects) => {
			Object.keys(projects || {}).forEach((projectName) => {
				projectNames.add(projectName);
			});
		});
		return projectNames.size;
	}, [groupedData]);

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

	// Render project row
	const renderProjectRow = (row, index) => {
		const hasNoProjectName = !row.prj_name || row.prj_name.trim() === "";

		// Calculate totals
		const governmentApproved = Number(row.bdr_source_government_approved) || 0;
		const internalRequested = Number(row.bdr_source_internal_requested) || 0;
		const otherApproved = Number(row.bdr_source_other_approved) || 0;
		const budgetSourcesTotal =
			governmentApproved + internalRequested + otherApproved;

		return (
			<tr
				key={row.id || index}
				className={hasNoProjectName ? "no-project-name" : ""}
				style={{ textAlign: "center" }}
			>
				{/* Merged cells for project-level data */}
				{row.showMergedCells && (
					<>
						<td
							rowSpan={row.commonValues.rowSpan}
							className="sticky-column"
							style={{ left: 0 }}
						>
							<b>
								{row.prj_name || (
									<span style={{ color: "#6c757d", fontStyle: "italic" }}>
										{t("Unnamed Project")}
									</span>
								)}
							</b>
						</td>
						<td rowSpan={row.commonValues.rowSpan}>
							{row.commonValues.prj_measurement_unit}
						</td>
						<td rowSpan={row.commonValues.rowSpan}>
							{row.prj_measured_figure}
						</td>
						<td rowSpan={row.commonValues.rowSpan}>
							{row.commonValues.prj_status}
						</td>
						<td rowSpan={row.commonValues.rowSpan}>
							{row.commonValues.sector}
						</td>
						<td rowSpan={row.commonValues.rowSpan}>
							{row.commonValues.project_category}
						</td>
						<td
							rowSpan={row.commonValues.rowSpan}
							className="sticky-column"
							style={{ left: 150 }}
						>
							<b>{row.prj_code}</b>
						</td>
						<td rowSpan={row.commonValues.rowSpan}>
							{row.commonValues.prj_location_description}
						</td>
						<td rowSpan={row.commonValues.rowSpan}>{row.commonValues.zone}</td>
						<td rowSpan={row.commonValues.rowSpan}>
							{row.commonValues.woreda}
						</td>
						<td rowSpan={row.commonValues.rowSpan}>
							{row.commonValues.start_year}
						</td>
						<td rowSpan={row.commonValues.rowSpan}>
							{row.commonValues.end_year}
						</td>
					</>
				)}

				{/* Physical performance data */}
				<td>
					{Number(row.bdr_before_previous_year_physical)?.toLocaleString() ||
						""}
				</td>
				<td>
					{Number(row.bdr_previous_year_physical)?.toLocaleString() || ""}
				</td>
				<td>{Number(row.bdr_physical_baseline)?.toLocaleString() || ""}</td>

				{/* Physical Action Plan */}
				<td>{Number(row.bdr_physical_planned)?.toLocaleString() || ""}</td>
				<td>{Number(row.bdr_physical_approved)?.toLocaleString() || ""}</td>

				{/* Budget information */}
				<td>
					{row.showMergedCells
						? Number(
								row.commonValues.prj_total_estimate_budget
							)?.toLocaleString()
						: ""}
				</td>
				<td>
					{Number(row.bdr_before_previous_year_financial)?.toLocaleString() ||
						""}
				</td>
				<td>
					{Number(row.bdr_previous_year_financial)?.toLocaleString() || ""}
				</td>
				<td>{Number(row.bdr_financial_baseline)?.toLocaleString() || ""}</td>

				{/* Current Budget Plan */}
				<td>{Number(row.bdr_requested_amount)?.toLocaleString() || ""}</td>
				<td>{Number(row.bdr_released_amount)?.toLocaleString() || ""}</td>

				{/* Supported by budgetary sources */}
				<td>{governmentApproved.toLocaleString()}</td>
				<td>{internalRequested.toLocaleString()}</td>
				<td>{otherApproved.toLocaleString()}</td>
				<td>{budgetSourcesTotal.toLocaleString()}</td>
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
							placeholder={t("Search...")}
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
							tableData={data}
							tableName="FinancialProjectsTable"
							exportColumns={financialReportOneExportColumns}
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

          .no-project-name {
            background-color: rgba(255, 193, 7, 0.05);
            border-left: 1px solid #ffc107 !important;
            border-right: 1px solid #ffc107 !important;
          }
          .no-project-name td:first-child {
            border-left: 1px solid #ffc107 !important;
          }
          .no-project-name td:last-child {
            border-right: 1px solid #ffc107 !important;
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
          .sector-row {
            background-color: #e8f4f0 !important;
            cursor: pointer;
            font-weight: bold;
            position: sticky;
            left: 0;
            z-index: 1;
          }
          .sector-row td {
            position: sticky;
            left: 0;
            background-color: #e8f4f0 !important;
          }
          .sector-row:hover {
            background-color: #d4e8e0 !important;
          }
          .sector-toggle {
            margin-right: 8px;
            transition: transform 0.2s;
          }
          .sector-collapsed .sector-toggle {
            transform: rotate(-90deg);
          }
          .sticky-column:nth-child(1) { left: 0; }
          .sticky-column:nth-child(7) { left: 150px; }
          .sticky-header:nth-child(1) { left: 0; }
          .sticky-header:nth-child(7) { left: 150px; }
        `}</style>

				{/* Table */}
				<table
					id="financial-projects-table"
					ref={tableRef}
					className={`table ${tableClass}`}
					style={{ width: "100%", fontSize: "0.85rem", minWidth: "1200px" }}
				>
					<thead ref={headerRowRef}>
						{/* Row 1: Main Groups */}
						<tr>
							<th rowSpan={3}>{t("Project Name")}</th>
							<th rowSpan={3}>{t("Unit")}</th>
							<th rowSpan={3}>{t("Measured Figure")}</th>
							<th rowSpan={3}>{t("Status")}</th>
							<th rowSpan={3}>{t("Sector")}</th>
							<th rowSpan={3}>{t("Category")}</th>
							<th rowSpan={3}>{t("Project Code")}</th>
							<th rowSpan={3}>{t("Specific Site")}</th>
							<th rowSpan={3}>{t("Zone")}</th>
							<th rowSpan={3}>{t("Woreda")}</th>
							<th rowSpan={3}>{t("Start Year")}</th>
							<th rowSpan={3}>{t("End Year")}</th>

							{/* Physical Performance */}
							<th colSpan={3}>{t("Physical Performance")}</th>

							{/* Physical Action Plan */}
							<th colSpan={2}>{t("Physical Action Plan")}</th>

							{/* Budget Information */}
							<th colSpan={4}>{t("Budget Information")}</th>

							{/* Current Budget Plan */}
							<th colSpan={2}>{t("Current Budget Plan")}</th>

							{/* Supported by budgetary sources */}
							<th colSpan={4}>{t("Supported by budgetary sources")}</th>
						</tr>

						{/* Row 2: Subgroups */}
						<tr>
							{/* Physical Performance subgroups */}
							<th rowSpan={2}>{t("Before Previous Year")}</th>
							<th rowSpan={2}>{t("Previous Year")}</th>
							<th rowSpan={2}>{t("Physical Baseline")}</th>

							{/* Physical Action Plan subgroups */}
							<th rowSpan={2}>{t("Physical Planned")}</th>
							<th rowSpan={2}>{t("Physical Approved")}</th>

							{/* Budget Information subgroups */}
							<th rowSpan={2}>{t("Total Estimate Budget")}</th>
							<th rowSpan={2}>{t("Before Previous Year")}</th>
							<th rowSpan={2}>{t("Previous Year")}</th>
							<th rowSpan={2}>{t("Financial Baseline")}</th>

							{/* Current Budget Plan subgroups */}
							<th rowSpan={2}>{t("Requested Amount")}</th>
							<th rowSpan={2}>{t("Released Amount")}</th>

							{/* Supported by budgetary sources subgroups */}
							<th rowSpan={2}>{t("Government Approved")}</th>
							<th rowSpan={2}>{t("Internal Requested")}</th>
							<th rowSpan={2}>{t("Other Approved")}</th>
							<th rowSpan={2}>{t("Total")}</th>
						</tr>
					</thead>

					<tbody>
						{currentRows.length > 0 ? (
							currentRows.map((row, index) => {
								if (row.type === "sector") {
									const isExpanded = row.isExpanded;
									return (
										<tr
											key={`sector-${row.sectorName}`}
											className={`sector-row ${isExpanded ? "" : "sector-collapsed"}`}
											onClick={() => toggleSector(row.sectorName)}
										>
											<td
												colSpan={columnsConfig.length}
												style={{
													position: "sticky",
													left: 0,
													zIndex: 1,
													background: "#e8f4f0",
												}}
											>
												<span className="sector-toggle">
													{isExpanded ? <FaChevronDown /> : <FaChevronRight />}
												</span>
												{row.sectorName} ({row.projectCount} {t("projects")})
											</td>
										</tr>
									);
								}

								return renderProjectRow(row, index);
							})
						) : (
							<tr>
								<td
									colSpan={columnsConfig.length}
									style={{ textAlign: "center", padding: "2rem" }}
								>
									{searchTerm
										? t("No projects match your search criteria.")
										: t("No projects available.")}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{totalUniqueProjectNames > 0 && (
				<div className="d-flex justify-content-between align-items-center mt-3">
					<div className="text-muted small">
						<h6>
							{t("Showing")} {uniqueProjectNamesCount} {t("of")}{" "}
							{totalUniqueProjectNames} {t("projects")}
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

export default FinancialProjectsTable;
