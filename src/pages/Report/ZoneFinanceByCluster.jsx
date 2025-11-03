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

const ZoneBudgetByClustersTable = ({
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

	// Static fields that should NOT be treated as clusters
	const staticFields = useMemo(() => ["zone_id", "zone_name"], []);

	// Dynamically extract clusters from the first data item
	const clusters = useMemo(() => {
		if (!data || data.length === 0) return [];

		const firstItem = data[0];
		const clusterFields = Object.keys(firstItem).filter(
			(key) => !staticFields.includes(key)
		);

		return clusterFields.map((cluster) => ({
			id: cluster,
			label: t(cluster) || cluster,
			field: cluster,
		}));
	}, [data, staticFields, t]);

	// Calculate cluster totals and grand total
	const clusterTotals = useMemo(() => {
		const totals = {};
		let grandTotal = 0;

		// Initialize cluster totals
		clusters.forEach((cluster) => {
			totals[cluster.field] = 0;
		});

		// Calculate totals for each cluster
		data.forEach((zone) => {
			clusters.forEach((cluster) => {
				const value = Number(zone[cluster.field]) || 0;
				totals[cluster.field] += value;
				grandTotal += value;
			});
		});

		return { clusterTotals: totals, grandTotal };
	}, [data, clusters]);

	const columnsConfig = useMemo(
		() => [
			{
				id: "zone_name",
				label: t("Zone Name"),
				visible: true,
				minWidth: 250,
				sticky: true,
			},
			...clusters.map((cluster) => ({
				id: cluster.field,
				label: cluster.label,
				visible: true,
				minWidth: 150,
				clusterId: cluster.id,
			})),
			{
				id: "zone_total_budget",
				label: t("Zone Total"),
				visible: true,
				minWidth: 150,
			},
			{
				id: "zone_total_percent",
				label: t("Zone %"),
				visible: true,
				minWidth: 80,
			},
		],
		[t, clusters]
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

	// Prepare all rows for rendering
	const allRows = useMemo(() => {
		const rows = [];

		// Add zone rows
		filteredData.forEach((zone, index) => {
			let zoneTotal = 0;

			// Calculate zone total
			clusters.forEach((cluster) => {
				zoneTotal += Number(zone[cluster.field]) || 0;
			});

			rows.push({
				type: "zone",
				...zone,
				zoneTotal,
				zonePercent:
					clusterTotals.grandTotal > 0
						? (zoneTotal / clusterTotals.grandTotal) * 100
						: 0,
			});
		});

		// Add totals row
		if (filteredData.length > 0) {
			rows.push({
				type: "total",
				zone_name: t("Total"),
				clusterTotals: clusterTotals.clusterTotals,
				grandTotal: clusterTotals.grandTotal,
			});
		}

		return rows;
	}, [filteredData, clusters, clusterTotals, t]);

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

			clusters.forEach((cluster) => {
				const value = Number(zone[cluster.field]) || 0;
				zoneTotal += value;
				zoneRow[cluster.label] = value;
			});

			zoneRow[t("Zone Total")] = zoneTotal;
			zoneRow[t("Zone %")] =
				clusterTotals.grandTotal > 0
					? (zoneTotal / clusterTotals.grandTotal) * 100
					: 0;
			exportRows.push(zoneRow);
		});

		return exportRows;
	}, [filteredData, clusters, clusterTotals, t]);

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

		// Clusters group
		const clustersGroup = {
			key: "clusters",
			label: t("Clusters"),
			columns: [],
		};

		clusters.forEach((cluster) => {
			if (!hiddenColumns.includes(cluster.field)) {
				clustersGroup.columns.push({
					key: cluster.label,
					label: cluster.label,
					width: 20,
					type: "number",
				});
			}
		});

		// Zone totals group
		const totalsGroup = {
			key: "zone_totals",
			label: t("Zone Totals"),
			columns: [],
		};

		if (!hiddenColumns.includes("zone_total_budget")) {
			totalsGroup.columns.push({
				key: t("Zone Total"),
				label: t("Zone Total"),
				width: 20,
				type: "number",
			});
		}

		if (!hiddenColumns.includes("zone_total_percent")) {
			totalsGroup.columns.push({
				key: t("Zone %"),
				label: t("Zone %"),
				width: 15,
				type: "percentage",
			});
		}

		// Combine all groups
		const result = [...baseColumns];
		if (clustersGroup.columns.length > 0) result.push(clustersGroup);
		if (totalsGroup.columns.length > 0) result.push(totalsGroup);

		return result;
	}, [hiddenColumns, clusters, t]);

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

				{/* Cluster Budgets */}
				{clusters.map((cluster) => {
					if (!hiddenColumns.includes(cluster.field)) {
						const value = Number(row[cluster.field]) || 0;
						return (
							<td key={cluster.field} data-column={cluster.field}>
								{formatCurrency(value)}
							</td>
						);
					}
					return null;
				})}

				{/* Zone Total Budget */}
				{!hiddenColumns.includes("zone_total_budget") && (
					<td data-column="zone_total_budget">
						{formatCurrency(row.zoneTotal)}
					</td>
				)}

				{/* Zone Total Percentage */}
				{!hiddenColumns.includes("zone_total_percent") && (
					<td data-column="zone_total_percent">
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

				{/* Cluster Totals */}
				{clusters.map((cluster) => {
					if (!hiddenColumns.includes(cluster.field)) {
						const value = row.clusterTotals[cluster.field] || 0;
						return (
							<td key={cluster.field} data-column={cluster.field}>
								<strong>{formatCurrency(value)}</strong>
							</td>
						);
					}
					return null;
				})}

				{/* Grand Total Budget */}
				{!hiddenColumns.includes("zone_total_budget") && (
					<td data-column="zone_total_budget">
						<strong>{formatCurrency(row.grandTotal)}</strong>
					</td>
				)}

				{/* Grand Total Percentage */}
				{!hiddenColumns.includes("zone_total_percent") && (
					<td data-column="zone_total_percent">
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
							tableName="Zone Budget by Clusters"
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
					id="zone-budget-by-clusters-table"
					ref={tableRef}
					className={`table ${tableClass}`}
					style={{ width: "100%", fontSize: "0.85rem", minWidth: "1400px" }}
				>
					<thead ref={headerRowRef}>
						{/* Row 1: Main Groups */}
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

							{/* Clusters Group */}
							{clusters.some(
								(cluster) => !hiddenColumns.includes(cluster.field)
							) && (
								<th
									colSpan={
										clusters.filter(
											(cluster) => !hiddenColumns.includes(cluster.field)
										).length
									}
									data-column="clusters_group"
								>
									{t("Clusters")}
								</th>
							)}

							{/* Zone Totals Group */}
							{(!hiddenColumns.includes("zone_total_budget") ||
								!hiddenColumns.includes("zone_total_percent")) && (
								<th
									colSpan={
										(!hiddenColumns.includes("zone_total_budget") ? 1 : 0) +
										(!hiddenColumns.includes("zone_total_percent") ? 1 : 0)
									}
									data-column="zone_totals_group"
								>
									{t("Zone Totals")}
								</th>
							)}
						</tr>

						{/* Row 2: Individual Column Headers */}
						<tr>
							{/* Cluster subgroups */}
							{clusters.map(
								(cluster) =>
									!hiddenColumns.includes(cluster.field) && (
										<th key={cluster.field} data-column={cluster.field}>
											{cluster.label}
										</th>
									)
							)}

							{/* Zone totals subgroups */}
							{!hiddenColumns.includes("zone_total_budget") && (
								<th key="zone_total_budget" data-column="zone_total_budget">
									{t("Zone Total")}
								</th>
							)}
							{!hiddenColumns.includes("zone_total_percent") && (
								<th key="zone_total_percent" data-column="zone_total_percent">
									{t("Zone %")}
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
									colSpan={visibleColumns.length + 1} // +1 for group headers
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

export default ZoneBudgetByClustersTable;
