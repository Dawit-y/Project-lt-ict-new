import React, { useMemo } from "react";
import ReportTable from "./ReportTable";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ProjectStatusReport = ({
	data = [],
	exportSearchParams,
	tableClass = "",
}) => {
	const { t } = useTranslation();
	const columnsConfig = useMemo(
		() => [
			{
				id: "sector_category_name",
				label: t("Sector Category"),
				minWidth: 250,
				sticky: true,
				format: "string",
			},
			{
				id: "sector_name",
				label: t("Sector Name"),
				minWidth: 300,
				sticky: true,
				format: "string",
			},
			// Projects Count group
			{
				id: "new_projects_count",
				label: t("New"),
				minWidth: 100,
				group: "projects_count",
				format: "number",
			},
			{
				id: "inprogress_project_count",
				label: t("In Progress"),
				minWidth: 100,
				group: "projects_count",
				format: "number",
			},
			{
				id: "total_projects_count",
				label: t("Total"),
				minWidth: 100,
				group: "projects_count",
				format: "number",
			},
			// Projects Budget group
			{
				id: "new_projects_budget",
				label: t("New Budget"),
				minWidth: 150,
				group: "projects_budget",
				format: "currency",
				exportWidth: 25,
			},
			{
				id: "new_projects_budget_percent",
				label: t("% of Total"),
				minWidth: 80,
				group: "projects_budget",
				format: "percentage",
			},
			{
				id: "inprogress_projects_budget",
				label: t("In Progress Budget"),
				minWidth: 150,
				group: "projects_budget",
				format: "currency",
				exportWidth: 25,
			},
			{
				id: "inprogress_projects_budget_percent",
				label: t("% of Total"),
				minWidth: 80,
				group: "projects_budget",
				format: "percentage",
			},
			{
				id: "total_projects_budget",
				label: t("Total Budget"),
				minWidth: 150,
				group: "projects_budget",
				format: "currency",
				exportWidth: 25,
			},
			{
				id: "total_budget_percent",
				label: t("% of Grand Total"),
				minWidth: 80,
				group: "projects_budget",
				format: "percentage",
			},
		],
		[t]
	);

	// Transform data with percentage calculations
	const transformData = useMemo(() => {
		return (data) => {
			if (!data || data.length === 0) return [];

			// First, calculate grand total of all sectors
			let grandTotal = 0;
			data.forEach((item) => {
				const newBudget = Number(item.new_projects_budget) || 0;
				const inprogressBudget = Number(item.inprogress_projects_budget) || 0;
				grandTotal += newBudget + inprogressBudget;
			});

			return data.map((item) => {
				const newCount = Number(item.new_projects_count) || 0;
				const inprogressCount = Number(item.inprogress_project_count) || 0;
				const newBudget = Number(item.new_projects_budget) || 0;
				const inprogressBudget = Number(item.inprogress_projects_budget) || 0;
				const totalBudget = newBudget + inprogressBudget;

				// Calculate percentages
				const newBudgetPercent =
					totalBudget > 0 ? (newBudget / totalBudget) * 100 : 0;
				const inprogressBudgetPercent =
					totalBudget > 0 ? (inprogressBudget / totalBudget) * 100 : 0;
				// FIXED: Calculate percentage out of grand total
				const totalBudgetPercent =
					grandTotal > 0 ? (totalBudget / grandTotal) * 100 : 0;

				return {
					...item,
					total_projects_count: newCount + inprogressCount,
					total_projects_budget: totalBudget,
					new_projects_budget_percent: newBudgetPercent,
					inprogress_projects_budget_percent: inprogressBudgetPercent,
					total_budget_percent: totalBudgetPercent, // Now shows % of grand total
				};
			});
		};
	}, []);

	// Calculate category totals with percentages
	const calculateTotals = (groupedData, columnsConfig) => {
		const totals = {};

		// First pass: calculate category totals and grand total
		let grandTotal = 0;

		Object.entries(groupedData).forEach(([categoryName, categoryData]) => {
			totals[categoryName] = {
				new_projects_count: 0,
				inprogress_project_count: 0,
				total_projects_count: 0,
				new_projects_budget: 0,
				inprogress_projects_budget: 0,
				total_projects_budget: 0,
			};

			categoryData.items.forEach((sector) => {
				totals[categoryName].new_projects_count +=
					Number(sector.new_projects_count) || 0;
				totals[categoryName].inprogress_project_count +=
					Number(sector.inprogress_project_count) || 0;
				totals[categoryName].total_projects_count +=
					Number(sector.total_projects_count) || 0;
				totals[categoryName].new_projects_budget +=
					Number(sector.new_projects_budget) || 0;
				totals[categoryName].inprogress_projects_budget +=
					Number(sector.inprogress_projects_budget) || 0;
				totals[categoryName].total_projects_budget +=
					Number(sector.total_projects_budget) || 0;
			});

			grandTotal += totals[categoryName].total_projects_budget;
		});

		// Second pass: add percentages to totals
		Object.entries(totals).forEach(([categoryName, categoryTotal]) => {
			// Category's percentage of grand total
			totals[categoryName].total_budget_percent =
				grandTotal > 0
					? (categoryTotal.total_projects_budget / grandTotal) * 100
					: 0;
		});

		return totals;
	};

	// Prepare export data with calculated values - FIXED
	const prepareExportData = (
		filteredData,
		groupedData,
		calculatedTotals,
		t
	) => {
		const exportRows = [];

		// First, calculate grand total from all filtered data
		let grandTotal = 0;
		filteredData.forEach((sector) => {
			const newBudget = Number(sector.new_projects_budget) || 0;
			const inprogressBudget = Number(sector.inprogress_projects_budget) || 0;
			grandTotal += newBudget + inprogressBudget;
		});

		Object.entries(groupedData).forEach(([categoryName, categoryData]) => {
			categoryData.items.forEach((sector) => {
				const totalBudget = Number(sector.total_projects_budget) || 0;

				// FIXED: Calculate percentage out of grand total (not category total)
				const totalPercentage =
					grandTotal > 0 ? (totalBudget / grandTotal) * 100 : 0;

				const exportRow = {
					level: t("Sector"),
					sector_category_name: categoryName,
					sector_name: sector.sector_name,
					new_projects_count: sector.new_projects_count,
					inprogress_project_count: sector.inprogress_project_count,
					total_projects_count: sector.total_projects_count,
					new_projects_budget: sector.new_projects_budget,
					new_projects_budget_percent: sector.new_projects_budget_percent,
					inprogress_projects_budget: sector.inprogress_projects_budget,
					inprogress_projects_budget_percent:
						sector.inprogress_projects_budget_percent,
					total_projects_budget: totalBudget,
					total_budget_percent: totalPercentage, // Now shows % of grand total
				};
				exportRows.push(exportRow);
			});
		});

		return exportRows;
	};

	// Custom group row renderer for better styling
	const renderGroupRow = (row, toggleGroup, t) => (
		<tr
			key={`group-${row.groupName}`}
			className="group-row"
			onClick={() => toggleGroup(row.groupName)}
		>
			{columnsConfig.map((col) => {
				if (col.id === "sector_category_name") {
					return (
						<td
							key={col.id}
							data-column={col.id}
							className="sticky-column"
							style={{ left: 0 }}
						>
							<span className="group-toggle me-2">
								{row.isExpanded ? <FaChevronDown /> : <FaChevronRight />}
							</span>
							<strong>{row.groupName}</strong>
						</td>
					);
				} else if (col.id === "sector_name") {
					return (
						<td
							key={col.id}
							data-column={col.id}
							className="sticky-column"
							style={{ left: 250 }}
						>
							<strong>
								{row.itemCount} {t("Sectors")}
							</strong>
						</td>
					);
				} else if (row.totals[col.id] !== undefined) {
					return (
						<td key={col.id} data-column={col.id}>
							<strong>{formatValue(row.totals[col.id], col.format)}</strong>
						</td>
					);
				}
				return (
					<td key={col.id} data-column={col.id}>
						{/* Empty for alignment */}
					</td>
				);
			})}
		</tr>
	);

	// Custom data row renderer to show total_budget_percent in table
	const renderDataRow = (row, index, t) => {
		const formatValue = (value, format = "string") => {
			if (value === null || value === undefined || value === "") return "-";

			switch (format) {
				case "currency":
					return new Intl.NumberFormat("en-ET", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}).format(value);
				case "percentage":
					return `${Number(value).toFixed(1)}%`;
				case "number":
					return Number(value).toLocaleString();
				default:
					return value.toString();
			}
		};

		return (
			<tr key={`data-${row.id || index}`}>
				{columnsConfig.map((col) => {
					const value = row[col.id];

					// Apply sticky styles
					const stickyStyle = col.sticky
						? {
								position: "sticky",
								left: col.id === "sector_category_name" ? 0 : 250,
								zIndex: 1,
								backgroundColor: "white",
							}
						: {};

					return (
						<td
							key={col.id}
							data-column={col.id}
							className={col.sticky ? "sticky-column" : ""}
							style={stickyStyle}
						>
							{formatValue(value, col.format)}
						</td>
					);
				})}
			</tr>
		);
	};

	// Helper function for formatting (used in custom renderer)
	const formatValue = (value, format = "string") => {
		if (value === null || value === undefined || value === "") return "-";

		switch (format) {
			case "currency":
				return new Intl.NumberFormat("en-ET", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}).format(value);
			case "percentage":
				return `${Number(value).toFixed(1)}%`;
			case "number":
				return Number(value).toLocaleString();
			default:
				return value.toString();
		}
	};

	return (
		<ReportTable
			data={data}
			columnsConfig={columnsConfig}
			groupBy="sector_category_name"
			headerStructure="grouped"
			transformData={transformData}
			calculateTotals={calculateTotals}
			prepareExportData={prepareExportData}
			renderGroupRow={renderGroupRow}
			renderDataRow={renderDataRow} // Added custom data row renderer
			searchFields={["sector_name", "sector_category_name"]}
			searchPlaceholder="Search by sector or category..."
			tableName="Project Finance By Status"
			exportSearchParams={exportSearchParams}
			tableClass={tableClass}
		/>
	);
};

export default ProjectStatusReport;
