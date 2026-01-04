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
				exportWidth: 50,
			},
			{
				id: "sector_name",
				label: t("Sector Name"),
				minWidth: 300,
				sticky: true,
				format: "string",
				exportWidth: 50,
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
				exportWidth: 30,
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
				exportWidth: 30,
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
				exportWidth: 30,
			},
			{
				id: "total_budget_percent",
				label: t("% of Grand Total"),
				minWidth: 100,
				group: "projects_budget",
				format: "percentage",
				exportWidth: 25,
			},
		],
		[t]
	);

	// Calculate grand total from all data
	const calculateGrandTotal = useMemo(() => {
		return (data) => {
			let grandTotal = 0;
			data.forEach((item) => {
				const newBudget = Number(item.new_projects_budget) || 0;
				const inprogressBudget = Number(item.inprogress_projects_budget) || 0;
				grandTotal += newBudget + inprogressBudget;
			});
			return grandTotal;
		};
	}, []);

	// Transform data with percentage calculations including grand total percentages
	const transformData = useMemo(() => {
		return (rawData) => {
			// First, calculate the grand total from all data
			const grandTotal = calculateGrandTotal(rawData);

			return rawData.map((item) => {
				const newCount = Number(item.new_projects_count) || 0;
				const inprogressCount = Number(item.inprogress_project_count) || 0;
				const newBudget = Number(item.new_projects_budget) || 0;
				const inprogressBudget = Number(item.inprogress_projects_budget) || 0;
				const totalBudget = newBudget + inprogressBudget;

				// Calculate percentages (for New vs In Progress) - internal to sector
				const newBudgetPercent =
					totalBudget > 0 ? (newBudget / totalBudget) * 100 : 0;
				const inprogressBudgetPercent =
					totalBudget > 0 ? (inprogressBudget / totalBudget) * 100 : 0;

				// Calculate percentage of grand total
				const totalBudgetPercent =
					grandTotal > 0 ? (totalBudget / grandTotal) * 100 : 0;

				return {
					...item,
					total_projects_count: newCount + inprogressCount,
					total_projects_budget: totalBudget,
					new_projects_budget_percent: newBudgetPercent,
					inprogress_projects_budget_percent: inprogressBudgetPercent,
					total_budget_percent: totalBudgetPercent,
				};
			});
		};
	}, [calculateGrandTotal]);

	// Calculate category totals with percentages
	const calculateTotals = (groupedData, columnsConfig) => {
		const totals = {};
		let grandTotal = 0;

		// First pass: calculate category totals and grand total
		Object.entries(groupedData).forEach(([categoryName, categoryData]) => {
			totals[categoryName] = {
				new_projects_count: 0,
				inprogress_project_count: 0,
				total_projects_count: 0,
				new_projects_budget: 0,
				inprogress_projects_budget: 0,
				total_projects_budget: 0,
				new_projects_budget_percent: 0,
				inprogress_projects_budget_percent: 0,
				total_budget_percent: 0,
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

		// Second pass: add percentages to totals (including grand total percentage)
		Object.entries(totals).forEach(([categoryName, categoryTotal]) => {
			// Calculate category internal percentages
			const categoryTotalBudget = categoryTotal.total_projects_budget;
			const newBudgetPercent =
				categoryTotalBudget > 0
					? (categoryTotal.new_projects_budget / categoryTotalBudget) * 100
					: 0;
			const inprogressBudgetPercent =
				categoryTotalBudget > 0
					? (categoryTotal.inprogress_projects_budget / categoryTotalBudget) *
						100
					: 0;

			totals[categoryName].new_projects_budget_percent = newBudgetPercent;
			totals[categoryName].inprogress_projects_budget_percent =
				inprogressBudgetPercent;
			totals[categoryName].total_budget_percent =
				grandTotal > 0
					? (categoryTotal.total_projects_budget / grandTotal) * 100
					: 0;
		});

		// Add grand total row
		if (grandTotal > 0) {
			const grandTotalRow = {
				new_projects_count: 0,
				inprogress_project_count: 0,
				total_projects_count: 0,
				new_projects_budget: 0,
				inprogress_projects_budget: 0,
				total_projects_budget: grandTotal,
				new_projects_budget_percent: 0,
				inprogress_projects_budget_percent: 0,
				total_budget_percent: 100, // Grand total is 100% of itself
			};

			// Sum all category totals for grand total row
			Object.values(totals).forEach((categoryTotal) => {
				grandTotalRow.new_projects_count += categoryTotal.new_projects_count;
				grandTotalRow.inprogress_project_count +=
					categoryTotal.inprogress_project_count;
				grandTotalRow.total_projects_count +=
					categoryTotal.total_projects_count;
				grandTotalRow.new_projects_budget += categoryTotal.new_projects_budget;
				grandTotalRow.inprogress_projects_budget +=
					categoryTotal.inprogress_projects_budget;
			});

			// Calculate percentages for grand total row
			grandTotalRow.new_projects_budget_percent =
				grandTotal > 0
					? (grandTotalRow.new_projects_budget / grandTotal) * 100
					: 0;
			grandTotalRow.inprogress_projects_budget_percent =
				grandTotal > 0
					? (grandTotalRow.inprogress_projects_budget / grandTotal) * 100
					: 0;

			totals["GRAND_TOTAL"] = grandTotalRow;
		}

		return totals;
	};

	// Prepare export data with row colors and grand total percentages
	const prepareExportData = useMemo(() => {
		return (filteredData, groupedData, calculatedTotals, translation) => {
			const exportRows = [];
			const grandTotal =
				calculatedTotals.GRAND_TOTAL?.total_projects_budget || 0;

			// Add Grand Total row first with orange color
			if (calculatedTotals.GRAND_TOTAL) {
				const grandTotalRow = {
					sector_category_name: translation("GRAND TOTAL"),
					sector_name: "",
					new_projects_count: calculatedTotals.GRAND_TOTAL.new_projects_count,
					inprogress_project_count:
						calculatedTotals.GRAND_TOTAL.inprogress_project_count,
					total_projects_count:
						calculatedTotals.GRAND_TOTAL.total_projects_count,
					new_projects_budget: calculatedTotals.GRAND_TOTAL.new_projects_budget,
					new_projects_budget_percent:
						calculatedTotals.GRAND_TOTAL.new_projects_budget_percent,
					inprogress_projects_budget:
						calculatedTotals.GRAND_TOTAL.inprogress_projects_budget,
					inprogress_projects_budget_percent:
						calculatedTotals.GRAND_TOTAL.inprogress_projects_budget_percent,
					total_projects_budget: grandTotal,
					total_budget_percent: 100,
					row_color: "#FFE5CC", // Light orange color for Excel
					row_type: "grand_total",
				};
				exportRows.push(grandTotalRow);
			}

			// Add category and sector rows
			Object.entries(groupedData).forEach(([categoryName, categoryData]) => {
				const categoryTotals = calculatedTotals[categoryName] || {};

				// Add category totals row with light blue color
				const categoryTotalRow = {
					sector_category_name: categoryName,
					sector_name: translation("Category Total"),
					new_projects_count: categoryTotals.new_projects_count || 0,
					inprogress_project_count:
						categoryTotals.inprogress_project_count || 0,
					total_projects_count: categoryTotals.total_projects_count || 0,
					new_projects_budget: categoryTotals.new_projects_budget || 0,
					new_projects_budget_percent:
						categoryTotals.new_projects_budget_percent || 0,
					inprogress_projects_budget:
						categoryTotals.inprogress_projects_budget || 0,
					inprogress_projects_budget_percent:
						categoryTotals.inprogress_projects_budget_percent || 0,
					total_projects_budget: categoryTotals.total_projects_budget || 0,
					total_budget_percent: categoryTotals.total_budget_percent || 0,
					row_color: "#E2EFDA", 
					row_type: "category_total",
				};
				exportRows.push(categoryTotalRow);

				// Add sector rows (using transformed data from filteredData)
				categoryData.items.forEach((sector) => {
					// Find the transformed sector data
					const transformedSector = filteredData.find(
						(item) =>
							item.sector_category_name === categoryName &&
							item.sector_name === sector.sector_name
					);

					const exportRow = {
						sector_category_name: categoryName,
						sector_name: sector.sector_name,
						new_projects_count: sector.new_projects_count,
						inprogress_project_count: sector.inprogress_project_count,
						total_projects_count: sector.total_projects_count,
						new_projects_budget: sector.new_projects_budget,
						new_projects_budget_percent:
							transformedSector?.new_projects_budget_percent || 0,
						inprogress_projects_budget: sector.inprogress_projects_budget,
						inprogress_projects_budget_percent:
							transformedSector?.inprogress_projects_budget_percent || 0,
						total_projects_budget: sector.total_projects_budget || 0,
						total_budget_percent: transformedSector?.total_budget_percent || 0,
					};
					exportRows.push(exportRow);
				});
			});

			return exportRows;
		};
	}, []);

	// Custom group row renderer that also handles grand total row
	const renderGroupRow = (row, toggleGroup, t, isGrandTotal = false) => {
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

		// Check if this is a grand total row
		if (isGrandTotal) {
			return (
				<tr
					key="grand-total-row"
					className="grand-total-row"
					style={{ backgroundColor: "#FFE5CC" }}
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
									<strong>{t("GRAND TOTAL")}</strong>
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
									{/* Empty for grand total row */}
								</td>
							);
						} else if (row[col.id] !== undefined) {
							return (
								<td key={col.id} data-column={col.id}>
									<strong>{formatValue(row[col.id], col.format)}</strong>
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
		}

		// Regular group row
		return (
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
	};

	// Get grand total row data
	const grandTotalRow = useMemo(() => {
		// Calculate grand total from all data
		const grandTotal = calculateGrandTotal(data);

		// Calculate other totals
		let newProjectsCount = 0;
		let inprogressProjectCount = 0;
		let totalProjectsCount = 0;
		let newProjectsBudget = 0;
		let inprogressProjectsBudget = 0;

		data.forEach((item) => {
			newProjectsCount += Number(item.new_projects_count) || 0;
			inprogressProjectCount += Number(item.inprogress_project_count) || 0;
			newProjectsBudget += Number(item.new_projects_budget) || 0;
			inprogressProjectsBudget += Number(item.inprogress_projects_budget) || 0;
		});

		totalProjectsCount = newProjectsCount + inprogressProjectCount;

		// Calculate percentages
		const newProjectsBudgetPercent =
			grandTotal > 0 ? (newProjectsBudget / grandTotal) * 100 : 0;
		const inprogressProjectsBudgetPercent =
			grandTotal > 0 ? (inprogressProjectsBudget / grandTotal) * 100 : 0;

		return {
			sector_category_name: t("GRAND TOTAL"),
			sector_name: "",
			new_projects_count: newProjectsCount,
			inprogress_project_count: inprogressProjectCount,
			total_projects_count: totalProjectsCount,
			new_projects_budget: newProjectsBudget,
			new_projects_budget_percent: newProjectsBudgetPercent,
			inprogress_projects_budget: inprogressProjectsBudget,
			inprogress_projects_budget_percent: inprogressProjectsBudgetPercent,
			total_projects_budget: grandTotal,
			total_budget_percent: 100,
		};
	}, [data, calculateGrandTotal, t]);

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
			grandTotalRow={grandTotalRow}
			searchFields={["sector_name", "sector_category_name"]}
			searchPlaceholder="Search by sector or category..."
			tableName="Project Finance By Status"
			exportSearchParams={exportSearchParams}
			tableClass={tableClass}
		/>
	);
};

export default ProjectStatusReport;
