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

const ProjectFinanceBySource = ({
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
			// Number of Projects group
			{
				id: "requested_budget_count",
				label: t("Requested"),
				visible: true,
				minWidth: 100,
				group: "projects",
			},
			{
				id: "approved_budget_count",
				label: t("Approved"),
				visible: true,
				minWidth: 100,
				group: "projects",
			},
			{
				id: "approval_rate",
				label: t("Approval Rate"),
				visible: true,
				minWidth: 100,
				group: "projects",
			},
			// Budget by Source group
			{
				id: "gov_approved_value",
				label: t("Government"),
				visible: true,
				minWidth: 120,
				group: "gov_budget",
			},
			{
				id: "gov_approved_percentage",
				label: t("Gov %"),
				visible: true,
				minWidth: 80,
				group: "gov_budget",
			},
			{
				id: "support_approved",
				label: t("Support"),
				visible: true,
				minWidth: 120,
				group: "budget",
			},
			{
				id: "credit_approved",
				label: t("Credit"),
				visible: true,
				minWidth: 120,
				group: "budget",
			},
			{
				id: "other_approved",
				label: t("Other"),
				visible: true,
				minWidth: 120,
				group: "budget",
			},
			{
				id: "internal_approved",
				label: t("Internal"),
				visible: true,
				minWidth: 120,
				group: "budget",
			},
			{
				id: "total_approved",
				label: t("Total Approved"),
				visible: true,
				minWidth: 150,
			},
			{
				id: "total_approved_percentage",
				label: t("Total %"),
				visible: true,
				minWidth: 100,
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

	// Calculate totals for each category including percentages
	const calculateCategoryTotals = useMemo(() => {
		const totals = {};

		Object.entries(groupedData).forEach(([category, categoryData]) => {
			totals[category] = {
				requested_budget_count: 0,
				approved_budget_count: 0,
				approval_rate: 0,
				gov_approved: 0,
				gov_approved_percentage: 0,
				support_approved: 0,
				credit_approved: 0,
				other_approved: 0,
				internal_approved: 0,
				total_approved: 0,
				total_approved_percentage: 100, // Category total should always be 100% of itself
			};

			// Sum up all sectors in this category
			categoryData.sectors.forEach((sector) => {
				totals[category].requested_budget_count +=
					Number(sector.requested_budget_count) || 0;
				totals[category].approved_budget_count +=
					Number(sector.approved_budget_count) || 0;
				totals[category].gov_approved += Number(sector.gov_approved) || 0;
				totals[category].support_approved +=
					Number(sector.support_approved) || 0;
				totals[category].credit_approved += Number(sector.credit_approved) || 0;
				totals[category].other_approved += Number(sector.other_approved) || 0;
				totals[category].internal_approved +=
					Number(sector.internal_approved) || 0;

				// Calculate total approved for this sector
				const sectorTotal =
					(Number(sector.gov_approved) || 0) +
					(Number(sector.support_approved) || 0) +
					(Number(sector.credit_approved) || 0) +
					(Number(sector.other_approved) || 0) +
					(Number(sector.internal_approved) || 0);

				totals[category].total_approved += sectorTotal;
			});

			// Calculate approval rate for the category
			if (totals[category].requested_budget_count > 0) {
				totals[category].approval_rate =
					(totals[category].approved_budget_count /
						totals[category].requested_budget_count) *
					100;
			}

			// Calculate government percentage for the category
			if (totals[category].total_approved > 0) {
				totals[category].gov_approved_percentage =
					(totals[category].gov_approved / totals[category].total_approved) *
					100;
			}
		});

		return totals;
	}, [groupedData]);

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

	// Prepare all rows for rendering with correct percentage calculations
	const allRows = useMemo(() => {
		const rows = [];

		Object.entries(filteredGroupedData).forEach(
			([categoryName, categoryData]) => {
				const isExpanded = expandedCategories[categoryName] !== false;
				const categoryTotals = calculateCategoryTotals[categoryName] || {};

				// Add category row
				rows.push({
					type: "category",
					categoryName,
					sectorCount: categoryData.sectors.length,
					isExpanded,
					totals: categoryTotals,
				});

				// Add sector rows if expanded
				if (isExpanded) {
					categoryData.sectors.forEach((sector, index) => {
						// Calculate sector total
						const sectorTotal =
							(Number(sector.gov_approved) || 0) +
							(Number(sector.support_approved) || 0) +
							(Number(sector.credit_approved) || 0) +
							(Number(sector.other_approved) || 0) +
							(Number(sector.internal_approved) || 0);

						// Calculate approval rate
						const approvalRate =
							sector.requested_budget_count > 0
								? (sector.approved_budget_count /
										sector.requested_budget_count) *
									100
								: 0;

						// Calculate government percentage (out of sector total)
						const govPercentage =
							sectorTotal > 0 ? (sector.gov_approved / sectorTotal) * 100 : 0;

						// Calculate total approved percentage (out of CATEGORY total)
						const totalPercentage =
							categoryTotals.total_approved > 0
								? (sectorTotal / categoryTotals.total_approved) * 100
								: 0;

						rows.push({
							type: "sector",
							...sector,
							sectorTotal,
							approvalRate,
							govPercentage,
							totalPercentage,
							categoryName,
						});
					});
				}
			}
		);

		return rows;
	}, [filteredGroupedData, expandedCategories, calculateCategoryTotals]);

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

		// Helper function to safely parse numbers
		const safeParseNumber = (value) => {
			if (value === null || value === undefined || value === "") return 0;
			const parsed = parseFloat(value);
			return isNaN(parsed) ? 0 : parsed;
		};

		Object.entries(filteredGroupedData).forEach(
			([categoryName, categoryData]) => {
				const categoryTotals = calculateCategoryTotals[categoryName] || {};

				// Add individual sector rows
				categoryData.sectors.forEach((sector) => {
					const gov = safeParseNumber(sector.gov_approved);
					const support = safeParseNumber(sector.support_approved);
					const credit = safeParseNumber(sector.credit_approved);
					const other = safeParseNumber(sector.other_approved);
					const internal = safeParseNumber(sector.internal_approved);
					const total = gov + support + credit + other + internal;

					const approvalRate =
						sector.requested_budget_count > 0
							? (sector.approved_budget_count / sector.requested_budget_count) *
								100
							: 0;

					const govPercentage = total > 0 ? (gov / total) * 100 : 0;

					// Calculate total percentage relative to category total
					const totalPercentage =
						categoryTotals.total_approved > 0
							? (total / categoryTotals.total_approved) * 100
							: 0;

					const sectorRow = {
						level: t("Sector"),
						sector_category_name: categoryName,
						sector_name: sector.sector_name,
						requested_budget_count: sector.requested_budget_count,
						approved_budget_count: sector.approved_budget_count,
						approval_rate: approvalRate,
						gov_approved: gov,
						gov_approved_percentage: govPercentage,
						support_approved: support,
						credit_approved: credit,
						other_approved: other,
						internal_approved: internal,
						total_approved: total,
						total_approved_percentage: totalPercentage,
					};
					exportRows.push(sectorRow);
				});
			}
		);

		return exportRows;
	}, [filteredGroupedData, t, calculateCategoryTotals]);

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

		// Number of Projects group
		const projectsGroup = {
			key: "number_of_projects",
			label: t("Number of Projects"),
			columns: [],
		};

		if (!hiddenColumns.includes("requested_budget_count")) {
			projectsGroup.columns.push({
				key: "requested_budget_count",
				label: t("Requested"),
				width: 20,
				type: "number",
			});
		}

		if (!hiddenColumns.includes("approved_budget_count")) {
			projectsGroup.columns.push({
				key: "approved_budget_count",
				label: t("Approved"),
				width: 20,
				type: "number",
			});
		}

		if (!hiddenColumns.includes("approval_rate")) {
			projectsGroup.columns.push({
				key: "approval_rate",
				label: t("Approval Rate"),
				width: 20,
				type: "percentage",
			});
		}

		// Government Budget group
		const govBudgetGroup = {
			key: "government_budget",
			label: t("Government Budget"),
			columns: [],
		};

		if (!hiddenColumns.includes("gov_approved_value")) {
			govBudgetGroup.columns.push({
				key: "gov_approved",
				label: t("Government"),
				width: 20,
				type: "number",
			});
		}

		if (!hiddenColumns.includes("gov_approved_percentage")) {
			govBudgetGroup.columns.push({
				key: "gov_approved_percentage",
				label: t("Gov %"),
				width: 15,
				type: "percentage",
			});
		}

		// Budget by Source group (including total approved)
		const budgetGroup = {
			key: "budget_by_source",
			label: t("Budget by Source"),
			columns: [],
		};

		const budgetColumns = [
			{ id: "support_approved", label: t("Support") },
			{ id: "credit_approved", label: t("Credit") },
			{ id: "other_approved", label: t("Other") },
			{ id: "internal_approved", label: t("Internal") },
			{ id: "total_approved", label: t("Total Approved") },
			{ id: "total_approved_percentage", label: t("Total %") },
		];

		budgetColumns.forEach((col) => {
			if (!hiddenColumns.includes(col.id)) {
				budgetGroup.columns.push({
					key: col.id,
					label: col.label,
					width: 20,
					type:
						col.id === "total_approved_percentage" ? "percentage" : "number",
				});
			}
		});

		// Only add groups if they have columns
		const result = [...baseColumns];
		if (projectsGroup.columns.length > 0) result.push(projectsGroup);
		if (govBudgetGroup.columns.length > 0) result.push(govBudgetGroup);
		if (budgetGroup.columns.length > 0) result.push(budgetGroup);

		return result;
	}, [hiddenColumns, t]);

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
		return `${value.toFixed(2)}%`;
	};

	// Format count
	const formatCount = (value) => {
		if (!value && value !== 0) return "-";
		return value.toString();
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

				{/* Number of Projects */}
				{!hiddenColumns.includes("requested_budget_count") && (
					<td data-column="requested_budget_count">
						<strong>{formatCount(row.totals.requested_budget_count)}</strong>
					</td>
				)}
				{!hiddenColumns.includes("approved_budget_count") && (
					<td data-column="approved_budget_count">
						<strong>{formatCount(row.totals.approved_budget_count)}</strong>
					</td>
				)}
				{!hiddenColumns.includes("approval_rate") && (
					<td data-column="approval_rate">
						<strong>{formatPercentage(row.totals.approval_rate)}</strong>
					</td>
				)}

				{/* Government Budget */}
				{!hiddenColumns.includes("gov_approved_value") && (
					<td data-column="gov_approved_value">
						<strong>{formatCurrency(row.totals.gov_approved)}</strong>
					</td>
				)}
				{!hiddenColumns.includes("gov_approved_percentage") && (
					<td data-column="gov_approved_percentage">
						<strong>
							{formatPercentage(row.totals.gov_approved_percentage)}
						</strong>
					</td>
				)}

				{/* Other Budget Sources */}
				{!hiddenColumns.includes("support_approved") && (
					<td data-column="support_approved">
						<strong>{formatCurrency(row.totals.support_approved)}</strong>
					</td>
				)}
				{!hiddenColumns.includes("credit_approved") && (
					<td data-column="credit_approved">
						<strong>{formatCurrency(row.totals.credit_approved)}</strong>
					</td>
				)}
				{!hiddenColumns.includes("other_approved") && (
					<td data-column="other_approved">
						<strong>{formatCurrency(row.totals.other_approved)}</strong>
					</td>
				)}
				{!hiddenColumns.includes("internal_approved") && (
					<td data-column="internal_approved">
						<strong>{formatCurrency(row.totals.internal_approved)}</strong>
					</td>
				)}

				{/* Total Approved */}
				{!hiddenColumns.includes("total_approved") && (
					<td data-column="total_approved">
						<strong>{formatCurrency(row.totals.total_approved)}</strong>
					</td>
				)}
				{!hiddenColumns.includes("total_approved_percentage") && (
					<td data-column="total_approved_percentage">
						<strong>
							{formatPercentage(row.totals.total_approved_percentage)}
						</strong>
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

				{/* Number of Projects */}
				{!hiddenColumns.includes("requested_budget_count") && (
					<td data-column="requested_budget_count">
						{formatCount(row.requested_budget_count)}
					</td>
				)}
				{!hiddenColumns.includes("approved_budget_count") && (
					<td data-column="approved_budget_count">
						{formatCount(row.approved_budget_count)}
					</td>
				)}
				{!hiddenColumns.includes("approval_rate") && (
					<td data-column="approval_rate">
						{formatPercentage(row.approvalRate)}
					</td>
				)}

				{/* Government Budget */}
				{!hiddenColumns.includes("gov_approved_value") && (
					<td data-column="gov_approved_value">
						{formatCurrency(row.gov_approved)}
					</td>
				)}
				{!hiddenColumns.includes("gov_approved_percentage") && (
					<td data-column="gov_approved_percentage">
						{formatPercentage(row.govPercentage)}
					</td>
				)}

				{/* Other Budget Sources */}
				{!hiddenColumns.includes("support_approved") && (
					<td data-column="support_approved">
						{formatCurrency(row.support_approved)}
					</td>
				)}
				{!hiddenColumns.includes("credit_approved") && (
					<td data-column="credit_approved">
						{formatCurrency(row.credit_approved)}
					</td>
				)}
				{!hiddenColumns.includes("other_approved") && (
					<td data-column="other_approved">
						{formatCurrency(row.other_approved)}
					</td>
				)}
				{!hiddenColumns.includes("internal_approved") && (
					<td data-column="internal_approved">
						{formatCurrency(row.internal_approved)}
					</td>
				)}

				{/* Total Approved */}
				{!hiddenColumns.includes("total_approved") && (
					<td data-column="total_approved">
						{formatCurrency(row.sectorTotal)}
					</td>
				)}
				{!hiddenColumns.includes("total_approved_percentage") && (
					<td data-column="total_approved_percentage">
						{formatPercentage(row.totalPercentage)}
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
							tableName="Project Finance By Source"
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

					/* Fixed sticky positioning */
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
					id="sector-budget-summary-table"
					ref={tableRef}
					className={`table ${tableClass}`}
					style={{ width: "100%", fontSize: "0.85rem", minWidth: "1600px" }}
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

							{/* Number of Projects Group */}
							{(!hiddenColumns.includes("requested_budget_count") ||
								!hiddenColumns.includes("approved_budget_count") ||
								!hiddenColumns.includes("approval_rate")) && (
								<th colSpan={3} data-column="projects_group">
									{t("Number of Projects")}
								</th>
							)}

							{/* Government Budget Group */}
							{(!hiddenColumns.includes("gov_approved_value") ||
								!hiddenColumns.includes("gov_approved_percentage")) && (
								<th colSpan={2} data-column="gov_budget_group">
									{t("Government Budget")}
								</th>
							)}

							{/* Budget by Source Group - NOW INCLUDES TOTAL APPROVED AND PERCENTAGE */}
							{(!hiddenColumns.includes("support_approved") ||
								!hiddenColumns.includes("credit_approved") ||
								!hiddenColumns.includes("other_approved") ||
								!hiddenColumns.includes("internal_approved") ||
								!hiddenColumns.includes("total_approved") ||
								!hiddenColumns.includes("total_approved_percentage")) && (
								<th
									colSpan={
										(!hiddenColumns.includes("support_approved") ? 1 : 0) +
										(!hiddenColumns.includes("credit_approved") ? 1 : 0) +
										(!hiddenColumns.includes("other_approved") ? 1 : 0) +
										(!hiddenColumns.includes("internal_approved") ? 1 : 0) +
										(!hiddenColumns.includes("total_approved") ? 1 : 0) +
										(!hiddenColumns.includes("total_approved_percentage")
											? 1
											: 0)
									}
									data-column="budget_group"
								>
									{t("Budget by Source")}
								</th>
							)}
						</tr>

						{/* Row 2: Individual Column Headers */}
						<tr>
							{/* Number of Projects subgroups */}
							{!hiddenColumns.includes("requested_budget_count") && (
								<th data-column="requested_budget_count">{t("Requested")}</th>
							)}
							{!hiddenColumns.includes("approved_budget_count") && (
								<th data-column="approved_budget_count">{t("Approved")}</th>
							)}
							{!hiddenColumns.includes("approval_rate") && (
								<th data-column="approval_rate">{t("Approval Rate")}</th>
							)}

							{/* Government Budget subgroups */}
							{!hiddenColumns.includes("gov_approved_value") && (
								<th data-column="gov_approved_value">{t("Government")}</th>
							)}
							{!hiddenColumns.includes("gov_approved_percentage") && (
								<th data-column="gov_approved_percentage">{t("Gov %")}</th>
							)}

							{/* Budget by Source subgroups - NOW INCLUDES TOTAL APPROVED AND PERCENTAGE */}
							{!hiddenColumns.includes("support_approved") && (
								<th data-column="support_approved">{t("Support")}</th>
							)}
							{!hiddenColumns.includes("credit_approved") && (
								<th data-column="credit_approved">{t("Credit")}</th>
							)}
							{!hiddenColumns.includes("other_approved") && (
								<th data-column="other_approved">{t("Other")}</th>
							)}
							{!hiddenColumns.includes("internal_approved") && (
								<th data-column="internal_approved">{t("Internal")}</th>
							)}
							{!hiddenColumns.includes("total_approved") && (
								<th data-column="total_approved">{t("Total Approved")}</th>
							)}
							{!hiddenColumns.includes("total_approved_percentage") && (
								<th data-column="total_approved_percentage">{t("Total %")}</th>
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
									colSpan={visibleColumns.length + 2} // +2 for additional group headers
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

export default ProjectFinanceBySource;
