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

const CsoProjectsTable = ({
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

	const columnsConfig = useMemo(
		() => [
			{
				id: "cso_name",
				label: t("CSO Name"),
				visible: true,
				minWidth: 150,
				sticky: true,
			},
			{
				id: "cso_type",
				label: t("CSO Type"),
				visible: true,
				minWidth: 100,
			},
			{
				id: "prj_name",
				label: t("Project Name"),
				visible: true,
				minWidth: 200,
			},
			// Operational Area Group
			{
				id: "zone_name",
				label: t("Zone"),
				visible: true,
				minWidth: 120,
				group: "operational_area",
			},
			{
				id: "woreda_name",
				label: t("Woreda"),
				visible: true,
				minWidth: 120,
				group: "operational_area",
			},
			{
				id: "prj_date_agreement_signed",
				label: t("Date Agreement Signed"),
				visible: true,
				minWidth: 120,
			},
			// Duration Group
			{
				id: "prj_start_date_plan_gc",
				label: t("Start Date"),
				visible: true,
				minWidth: 100,
				group: "duration",
			},
			{
				id: "prj_end_date_plan_gc",
				label: t("End Date"),
				visible: true,
				minWidth: 100,
				group: "duration",
			},
			{
				id: "duration",
				label: t("Duration (Days)"),
				visible: true,
				minWidth: 100,
				group: "duration",
			},
			// Direct Beneficiaries Group
			{
				id: "prj_direct_ben_male",
				label: t("Male"),
				visible: true,
				minWidth: 80,
				group: "direct_beneficiaries",
			},
			{
				id: "prj_direct_ben_female",
				label: t("Female"),
				visible: true,
				minWidth: 80,
				group: "direct_beneficiaries",
			},
			{
				id: "direct_beneficiaries_total",
				label: t("Total"),
				visible: true,
				minWidth: 80,
				group: "direct_beneficiaries",
			},
			// Indirect Beneficiaries Group
			{
				id: "prj_indirect_ben_male",
				label: t("Male"),
				visible: true,
				minWidth: 80,
				group: "indirect_beneficiaries",
			},
			{
				id: "prj_indirect_ben_female",
				label: t("Female"),
				visible: true,
				minWidth: 80,
				group: "indirect_beneficiaries",
			},
			{
				id: "indirect_beneficiaries_total",
				label: t("Total"),
				visible: true,
				minWidth: 80,
				group: "indirect_beneficiaries",
			},
			// Budget Categories Group
			{
				id: "prj_admin_cost",
				label: t("Admin Cost"),
				visible: true,
				minWidth: 100,
				group: "budget_categories",
			},
			{
				id: "prj_program_cost",
				label: t("Program Cost"),
				visible: true,
				minWidth: 100,
				group: "budget_categories",
			},
			{
				id: "total_budget",
				label: t("Total"),
				visible: true,
				minWidth: 100,
				group: "budget_categories",
			},
			{
				id: "prj_remark",
				label: t("Signatory Bodies (Sectors)"),
				visible: true,
				minWidth: 150,
			},
			{
				id: "prj_funding_agency",
				label: t("Donors"),
				visible: true,
				minWidth: 150,
			},
			// Address Group
			{
				id: "cso_email",
				label: t("Email"),
				visible: true,
				minWidth: 150,
				group: "address",
			},
			{
				id: "cso_phone",
				label: t("Phone"),
				visible: true,
				minWidth: 120,
				group: "address",
			},
		],
		[t]
	);

	// Export columns configuration with grouped structure
	const exportColumnsConfig = useMemo(
		() => [
			{
				key: "cso_name",
        label: t("CSO Name"),
        width: 40
			},
			{
				key: "cso_type",
				label: t("CSO Type"),
			},
			{
				key: "prj_name",
        label: t("Project Name"),
        width: 60
			},
			{
				key: "operational_area",
				label: t("Operational Area (Project Location)"),
				columns: [
					{
						key: "zone_name",
						label: t("Zone"),
					},
					{
						key: "woreda_name",
						label: t("Woreda"),
					},
				],
			},
			{
				key: "prj_date_agreement_signed",
				label: t("Date Agreement Signed"),
			},
			{
				key: "duration",
				label: t("Duration of the Project"),
				columns: [
					{
						key: "prj_start_date_plan_gc",
						label: t("Start Date"),
					},
					{
						key: "prj_end_date_plan_gc",
						label: t("End Date"),
					},
					{
						key: "duration",
						label: t("Duration (Days)"),
					},
				],
			},
			{
				key: "direct_beneficiaries",
				label: t("Direct Beneficiaries"),
				columns: [
					{
						key: "prj_direct_ben_male",
						label: t("Male"),
						type: "number",
					},
					{
						key: "prj_direct_ben_female",
						label: t("Female"),
						type: "number",
					},
					{
						key: "direct_beneficiaries_total",
						label: t("Total"),
						type: "number",
					},
				],
			},
			{
				key: "indirect_beneficiaries",
				label: t("Indirect Beneficiaries"),
				columns: [
					{
						key: "prj_indirect_ben_male",
						label: t("Male"),
						type: "number",
					},
					{
						key: "prj_indirect_ben_female",
						label: t("Female"),
						type: "number",
					},
					{
						key: "indirect_beneficiaries_total",
						label: t("Total"),
						type: "number",
					},
				],
			},
			{
				key: "budget_categories",
				label: t("Budget Categories"),
				columns: [
					{
						key: "prj_admin_cost",
						label: t("Admin Cost"),
						type: "number",
					},
					{
						key: "prj_program_cost",
						label: t("Program Cost"),
						type: "number",
					},
					{
						key: "total_budget",
						label: t("Total"),
            type: "number",
            width: 30
					},
				],
			},
			{
				key: "prj_remark",
				label: t("Signatory Bodies (Sectors)"),
			},
			{
				key: "prj_funding_agency",
				label: t("Donors"),
			},
			{
				key: "address",
				label: t("Address"),
				columns: [
					{
						key: "cso_email",
						label: t("Email"),
					},
					{
						key: "cso_phone",
						label: t("Phone"),
					},
				],
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

	// Parse date function
	const parseDate = (dateString) => {
		if (!dateString) return null;

		// Handle MM/DD/YYYY format
		const parts = dateString.split("/");
		if (parts.length === 3) {
			return new Date(parts[2], parts[0] - 1, parts[1]);
		}

		// Try default Date parsing
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? null : date;
	};

	// Calculate duration in days
	const calculateDuration = (startDateStr, endDateStr) => {
		const startDate = parseDate(startDateStr);
		const endDate = parseDate(endDateStr);

		if (!startDate || !endDate) return null;

		const diffTime = Math.abs(endDate - startDate);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	// Process data for display and export
	const processedData = useMemo(() => {
		return data.map((item) => {
			const directBenMale = Number(item.prj_direct_ben_male) || 0;
			const directBenFemale = Number(item.prj_direct_ben_female) || 0;
			const indirectBenMale = Number(item.prj_indirect_ben_male) || 0;
			const indirectBenFemale = Number(item.prj_indirect_ben_female) || 0;
			const adminCost = Number(item.prj_admin_cost) || 0;
			const programCost = Number(item.prj_program_cost) || 0;

			// Convert CSO type for both display and export
			const csoType =
				item.cso_type === "1"
					? t("Local")
					: item.cso_type === "2"
						? t("International")
						: item.cso_type || "";

			return {
				...item,
				cso_type: csoType,
				// Calculate duration
				duration: calculateDuration(
					item.prj_start_date_plan_gc,
					item.prj_end_date_plan_gc
				),
				// Calculate totals
				direct_beneficiaries_total: directBenMale + directBenFemale,
				indirect_beneficiaries_total: indirectBenMale + indirectBenFemale,
				total_budget: adminCost + programCost,
			};
		});
	}, [data, t]);

	// Filter data based on search term
	const filteredData = useMemo(() => {
		if (!searchTerm) return processedData;
		const lowerSearchTerm = searchTerm.toLowerCase();
		return processedData.filter(
			(project) =>
				(project.cso_name &&
					project.cso_name.toLowerCase().includes(lowerSearchTerm)) ||
				(project.prj_name &&
					project.prj_name.toLowerCase().includes(lowerSearchTerm)) ||
				(project.prj_funding_agency &&
					project.prj_funding_agency.toLowerCase().includes(lowerSearchTerm))
		);
	}, [processedData, searchTerm]);

	// Prepare data for export
	const exportData = useMemo(() => {
		return filteredData;
	}, [filteredData]);

	// Filter export columns based on visibility
	const visibleExportColumns = useMemo(() => {
		const filterColumnsRecursive = (columns) => {
			return columns
				.filter((col) => {
					if (col.columns) {
						// For group columns, check if any child columns are visible
						const visibleChildren = filterColumnsRecursive(col.columns);
						return visibleChildren.length > 0;
					} else {
						// For regular columns, check visibility
						return !hiddenColumns.includes(col.key);
					}
				})
				.map((col) => {
					if (col.columns) {
						// Return group with filtered children
						return {
							...col,
							columns: filterColumnsRecursive(col.columns),
						};
					}
					return col;
				});
		};

		return filterColumnsRecursive(exportColumnsConfig);
	}, [hiddenColumns, exportColumnsConfig]);

	// Pagination
	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;
	const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
	const totalPages = Math.ceil(filteredData.length / rowsPerPage);

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

	// Format number with commas
	const formatNumber = (num) => {
		if (num === null || num === undefined) return "";
		return Number(num).toLocaleString();
	};

	// Format date for display
	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = parseDate(dateString);
		if (!date) return dateString;
		return date.toLocaleDateString();
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
							tableData={exportData}
							tableName="CSO Projects Data"
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
            background-color: #e8f4f0 !important;
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
            background-color: #e8f4f0 !important;
          }
          .sticky-column:nth-child(1) { left: 0; }
          .sticky-header:nth-child(1) { left: 0; }
        `}</style>

				{/* Table */}
				<table
					id="cso-projects-table"
					ref={tableRef}
					className={`table ${tableClass}`}
					style={{ width: "100%", fontSize: "0.85rem", minWidth: "1200px" }}
				>
					<thead ref={headerRowRef}>
						{/* Row 1: Main Groups */}
						<tr>
							{!hiddenColumns.includes("cso_name") && (
								<th
									rowSpan={2}
									data-column="cso_name"
									className="sticky-header"
								>
									{t("CSO Name")}
								</th>
							)}
							{!hiddenColumns.includes("cso_type") && (
								<th rowSpan={2} data-column="cso_type">
									{t("CSO Type")}
								</th>
							)}
							{!hiddenColumns.includes("prj_name") && (
								<th rowSpan={2} data-column="prj_name">
									{t("Project Name")}
								</th>
							)}

							{/* Operational Area Group */}
							{(!hiddenColumns.includes("zone_name") ||
								!hiddenColumns.includes("woreda_name")) && (
								<th colSpan={2} data-column="operational_area">
									{t("Operational Area (Project Location)")}
								</th>
							)}

							{!hiddenColumns.includes("prj_date_agreement_signed") && (
								<th rowSpan={2} data-column="prj_date_agreement_signed">
									{t("Date Agreement Signed")}
								</th>
							)}

							{/* Duration Group */}
							{(!hiddenColumns.includes("prj_start_date_plan_gc") ||
								!hiddenColumns.includes("prj_end_date_plan_gc") ||
								!hiddenColumns.includes("duration")) && (
								<th colSpan={3} data-column="duration">
									{t("Duration of the Project")}
								</th>
							)}

							{/* Direct Beneficiaries Group */}
							{(!hiddenColumns.includes("prj_direct_ben_male") ||
								!hiddenColumns.includes("prj_direct_ben_female") ||
								!hiddenColumns.includes("direct_beneficiaries_total")) && (
								<th colSpan={3} data-column="direct_beneficiaries">
									{t("Direct Beneficiaries")}
								</th>
							)}

							{/* Indirect Beneficiaries Group */}
							{(!hiddenColumns.includes("prj_indirect_ben_male") ||
								!hiddenColumns.includes("prj_indirect_ben_female") ||
								!hiddenColumns.includes("indirect_beneficiaries_total")) && (
								<th colSpan={3} data-column="indirect_beneficiaries">
									{t("Indirect Beneficiaries")}
								</th>
							)}

							{/* Budget Categories Group */}
							{(!hiddenColumns.includes("prj_admin_cost") ||
								!hiddenColumns.includes("prj_program_cost") ||
								!hiddenColumns.includes("total_budget")) && (
								<th colSpan={3} data-column="budget_categories">
									{t("Budget Categories")}
								</th>
							)}

							{!hiddenColumns.includes("prj_remark") && (
								<th rowSpan={2} data-column="prj_remark">
									{t("Signatory Bodies (Sectors)")}
								</th>
							)}
							{!hiddenColumns.includes("prj_funding_agency") && (
								<th rowSpan={2} data-column="prj_funding_agency">
									{t("Donors")}
								</th>
							)}

							{/* Address Group */}
							{(!hiddenColumns.includes("cso_email") ||
								!hiddenColumns.includes("cso_phone")) && (
								<th colSpan={2} data-column="address">
									{t("Address")}
								</th>
							)}
						</tr>

						{/* Row 2: Subgroups */}
						<tr>
							{/* Operational Area subgroups */}
							{!hiddenColumns.includes("zone_name") && (
								<th data-column="zone_name">{t("Zone")}</th>
							)}
							{!hiddenColumns.includes("woreda_name") && (
								<th data-column="woreda_name">{t("Woreda")}</th>
							)}

							{/* Duration subgroups */}
							{!hiddenColumns.includes("prj_start_date_plan_gc") && (
								<th data-column="prj_start_date_plan_gc">{t("Start Date")}</th>
							)}
							{!hiddenColumns.includes("prj_end_date_plan_gc") && (
								<th data-column="prj_end_date_plan_gc">{t("End Date")}</th>
							)}
							{!hiddenColumns.includes("duration") && (
								<th data-column="duration">{t("Duration (Days)")}</th>
							)}

							{/* Direct Beneficiaries subgroups */}
							{!hiddenColumns.includes("prj_direct_ben_male") && (
								<th data-column="prj_direct_ben_male">{t("Male")}</th>
							)}
							{!hiddenColumns.includes("prj_direct_ben_female") && (
								<th data-column="prj_direct_ben_female">{t("Female")}</th>
							)}
							{!hiddenColumns.includes("direct_beneficiaries_total") && (
								<th data-column="direct_beneficiaries_total">{t("Total")}</th>
							)}

							{/* Indirect Beneficiaries subgroups */}
							{!hiddenColumns.includes("prj_indirect_ben_male") && (
								<th data-column="prj_indirect_ben_male">{t("Male")}</th>
							)}
							{!hiddenColumns.includes("prj_indirect_ben_female") && (
								<th data-column="prj_indirect_ben_female">{t("Female")}</th>
							)}
							{!hiddenColumns.includes("indirect_beneficiaries_total") && (
								<th data-column="indirect_beneficiaries_total">{t("Total")}</th>
							)}

							{/* Budget Categories subgroups */}
							{!hiddenColumns.includes("prj_admin_cost") && (
								<th data-column="prj_admin_cost">{t("Admin Cost")}</th>
							)}
							{!hiddenColumns.includes("prj_program_cost") && (
								<th data-column="prj_program_cost">{t("Program Cost")}</th>
							)}
							{!hiddenColumns.includes("total_budget") && (
								<th data-column="total_budget">{t("Total")}</th>
							)}

							{/* Address subgroups */}
							{!hiddenColumns.includes("cso_email") && (
								<th data-column="cso_email">{t("Email")}</th>
							)}
							{!hiddenColumns.includes("cso_phone") && (
								<th data-column="cso_phone">{t("Phone")}</th>
							)}
						</tr>
					</thead>

					<tbody>
						{currentRows.length > 0 ? (
							currentRows.map((row, index) => (
								<tr key={row.id || index} style={{ textAlign: "center" }}>
									{/* CSO Name */}
									{!hiddenColumns.includes("cso_name") && (
										<td className="sticky-column" data-column="cso_name">
											{row.cso_name}
										</td>
									)}

									{/* CSO Type */}
									{!hiddenColumns.includes("cso_type") && (
										<td data-column="cso_type">{row.cso_type}</td>
									)}

									{/* Project Name */}
									{!hiddenColumns.includes("prj_name") && (
										<td data-column="prj_name">
											<b>{row.prj_name}</b>
										</td>
									)}

									{/* Operational Area */}
									{!hiddenColumns.includes("zone_name") && (
										<td data-column="zone_name">{row.zone_name}</td>
									)}
									{!hiddenColumns.includes("woreda_name") && (
										<td data-column="woreda_name">{row.woreda_name}</td>
									)}

									{/* Date Agreement Signed */}
									{!hiddenColumns.includes("prj_date_agreement_signed") && (
										<td data-column="prj_date_agreement_signed">
											{formatDate(row.prj_date_agreement_signed)}
										</td>
									)}

									{/* Duration */}
									{!hiddenColumns.includes("prj_start_date_plan_gc") && (
										<td data-column="prj_start_date_plan_gc">
											{formatDate(row.prj_start_date_plan_gc)}
										</td>
									)}
									{!hiddenColumns.includes("prj_end_date_plan_gc") && (
										<td data-column="prj_end_date_plan_gc">
											{formatDate(row.prj_end_date_plan_gc)}
										</td>
									)}
									{!hiddenColumns.includes("duration") && (
										<td data-column="duration">
											{row.duration ? formatNumber(row.duration) : ""}
										</td>
									)}

									{/* Direct Beneficiaries */}
									{!hiddenColumns.includes("prj_direct_ben_male") && (
										<td data-column="prj_direct_ben_male">
											{formatNumber(row.prj_direct_ben_male)}
										</td>
									)}
									{!hiddenColumns.includes("prj_direct_ben_female") && (
										<td data-column="prj_direct_ben_female">
											{formatNumber(row.prj_direct_ben_female)}
										</td>
									)}
									{!hiddenColumns.includes("direct_beneficiaries_total") && (
										<td data-column="direct_beneficiaries_total">
											{formatNumber(row.direct_beneficiaries_total)}
										</td>
									)}

									{/* Indirect Beneficiaries */}
									{!hiddenColumns.includes("prj_indirect_ben_male") && (
										<td data-column="prj_indirect_ben_male">
											{formatNumber(row.prj_indirect_ben_male)}
										</td>
									)}
									{!hiddenColumns.includes("prj_indirect_ben_female") && (
										<td data-column="prj_indirect_ben_female">
											{formatNumber(row.prj_indirect_ben_female)}
										</td>
									)}
									{!hiddenColumns.includes("indirect_beneficiaries_total") && (
										<td data-column="indirect_beneficiaries_total">
											{formatNumber(row.indirect_beneficiaries_total)}
										</td>
									)}

									{/* Budget Categories */}
									{!hiddenColumns.includes("prj_admin_cost") && (
										<td data-column="prj_admin_cost">
											{formatNumber(row.prj_admin_cost)}
										</td>
									)}
									{!hiddenColumns.includes("prj_program_cost") && (
										<td data-column="prj_program_cost">
											{formatNumber(row.prj_program_cost)}
										</td>
									)}
									{!hiddenColumns.includes("total_budget") && (
										<td data-column="total_budget">
											{formatNumber(row.total_budget)}
										</td>
									)}

									{/* Signatory Bodies */}
									{!hiddenColumns.includes("prj_remark") && (
										<td data-column="prj_remark">{row.prj_remark}</td>
									)}

									{/* Donors */}
									{!hiddenColumns.includes("prj_funding_agency") && (
										<td data-column="prj_funding_agency">
											{row.prj_funding_agency}
										</td>
									)}

									{/* Address */}
									{!hiddenColumns.includes("cso_email") && (
										<td data-column="cso_email">{row.cso_email}</td>
									)}
									{!hiddenColumns.includes("cso_phone") && (
										<td data-column="cso_phone">{row.cso_phone}</td>
									)}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={visibleColumns.length}
									style={{ textAlign: "center", padding: "2rem" }}
								>
									{searchTerm
										? t("No CSO projects match your search criteria.")
										: t("No CSO projects available.")}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{filteredData.length > 0 && (
				<div className="d-flex justify-content-between align-items-center mt-3">
					<div className="text-muted small">
						<h6>
							{t("Showing")} {Math.min(currentRows.length, rowsPerPage)}{" "}
							{t("of")} {filteredData.length} {t("projects")}
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

export default CsoProjectsTable;
