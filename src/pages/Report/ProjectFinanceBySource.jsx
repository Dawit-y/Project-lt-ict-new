import React, { useMemo } from "react";
import ReportTable from "./ReportTable";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ProjectFinanceBySource = ({
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
			// Number of Projects group
			{
				id: "requested_budget_count",
				label: t("Requested"),
				minWidth: 100,
				group: "projects",
				format: "number",
			},
			{
				id: "approved_budget_count",
				label: t("Approved"),
				minWidth: 100,
				group: "projects",
				format: "number",
			},
			{
				id: "approval_rate",
				label: t("Approval Rate"),
				minWidth: 100,
				group: "projects",
				format: "percentage",
			},
			{
				id: "requested_amount",
				label: t("Requested Amount"),
				minWidth: 150,
				format: "currency",
				exportWidth: 25,
			},
			// Budget by Source group
			{
				id: "gov_approved_value",
				label: t("Government"),
				minWidth: 120,
				group: "budget",
				format: "currency",
				exportWidth: 25,
			},
			{
				id: "gov_approved_percentage",
				label: t("Gov %"),
				minWidth: 80,
				group: "budget",
				format: "percentage",
			},

			{
				id: "support_approved",
				label: t("Support"),
				minWidth: 120,
				group: "budget",
				format: "currency",
			},
			{
				id: "credit_approved",
				label: t("Credit"),
				minWidth: 120,
				group: "budget",
				format: "currency",
			},
			{
				id: "other_approved",
				label: t("Other"),
				minWidth: 120,
				group: "budget",
				format: "currency",
			},
			{
				id: "internal_approved",
				label: t("Internal"),
				minWidth: 120,
				group: "budget",
				format: "currency",
			},
			{
				id: "total_approved",
				label: t("Total Approved"),
				minWidth: 150,
				group: "budget",
				format: "currency",
				exportWidth: 25,
			},
			{
				id: "total_approved_percentage",
				label: t("% of Grand Total"),
				minWidth: 100,
				group: "budget",
				format: "percentage",
			},
			{
				id: "approved_vs_requested_percentage",
				label: t("% of Requested"),
				minWidth: 100,
				group: "budget",
				format: "percentage",
			},
		],
		[t]
	);

	// Transform data with complex calculations
	const transformData = useMemo(() => {
		return (data) => {
			if (!data || data.length === 0) return [];

			// First, calculate grand total of all approved budgets
			let grandTotalApproved = 0;
			data.forEach((item) => {
				const gov = Number(item.gov_approved) || 0;
				const support = Number(item.support_approved) || 0;
				const credit = Number(item.credit_approved) || 0;
				const other = Number(item.other_approved) || 0;
				const internal = Number(item.internal_approved) || 0;
				grandTotalApproved += gov + support + credit + other + internal;
			});

			return data.map((item) => {
				const gov = Number(item.gov_approved) || 0;
				const support = Number(item.support_approved) || 0;
				const credit = Number(item.credit_approved) || 0;
				const other = Number(item.other_approved) || 0;
				const internal = Number(item.internal_approved) || 0;
				const requestedAmount = Number(item.requested_amount) || 0;

				const totalApproved = gov + support + credit + other + internal;

				// Calculate approval rate (count based)
				const requestedCount = Number(item.requested_budget_count) || 0;
				const approvedCount = Number(item.approved_budget_count) || 0;
				const approvalRate =
					requestedCount > 0 ? (approvedCount / requestedCount) * 100 : 0;

				// Calculate government percentage of total approved
				const govPercentage =
					totalApproved > 0 ? (gov / totalApproved) * 100 : 0;

				// Calculate total approved percentage of grand total
				const totalApprovedPercentage =
					grandTotalApproved > 0
						? (totalApproved / grandTotalApproved) * 100
						: 0;

				// Calculate approved vs requested percentage (amount based)
				const approvedVsRequestedPercentage =
					requestedAmount > 0 ? (totalApproved / requestedAmount) * 100 : 0;

				return {
					...item,
					requested_amount: requestedAmount,
					gov_approved_value: gov,
					gov_approved_percentage: govPercentage,
					approval_rate: approvalRate,
					total_approved: totalApproved,
					total_approved_percentage: totalApprovedPercentage, // % of grand total
					approved_vs_requested_percentage: approvedVsRequestedPercentage, // % of requested amount
				};
			});
		};
	}, []);

	// Calculate category totals with percentages
	const calculateTotals = (groupedData, columnsConfig) => {
		const totals = {};

		// First, calculate grand totals across all categories
		let grandTotalRequestedAmount = 0;
		let grandTotalApproved = 0;

		Object.entries(groupedData).forEach(([categoryName, categoryData]) => {
			totals[categoryName] = {
				requested_budget_count: 0,
				approved_budget_count: 0,
				approval_rate: 0,
				requested_amount: 0,
				gov_approved_value: 0,
				gov_approved_percentage: 0,
				support_approved: 0,
				credit_approved: 0,
				other_approved: 0,
				internal_approved: 0,
				total_approved: 0,
				total_approved_percentage: 0,
				approved_vs_requested_percentage: 0,
			};

			// Sum up all sectors in this category
			categoryData.items.forEach((sector) => {
				totals[categoryName].requested_budget_count +=
					Number(sector.requested_budget_count) || 0;
				totals[categoryName].approved_budget_count +=
					Number(sector.approved_budget_count) || 0;
				totals[categoryName].requested_amount +=
					Number(sector.requested_amount) || 0;
				totals[categoryName].gov_approved_value +=
					Number(sector.gov_approved_value) || 0;
				totals[categoryName].support_approved +=
					Number(sector.support_approved) || 0;
				totals[categoryName].credit_approved +=
					Number(sector.credit_approved) || 0;
				totals[categoryName].other_approved +=
					Number(sector.other_approved) || 0;
				totals[categoryName].internal_approved +=
					Number(sector.internal_approved) || 0;
				totals[categoryName].total_approved +=
					Number(sector.total_approved) || 0;
			});

			// Accumulate grand totals
			grandTotalRequestedAmount += totals[categoryName].requested_amount;
			grandTotalApproved += totals[categoryName].total_approved;

			// Calculate approval rate for the category
			if (totals[categoryName].requested_budget_count > 0) {
				totals[categoryName].approval_rate =
					(totals[categoryName].approved_budget_count /
						totals[categoryName].requested_budget_count) *
					100;
			}

			// Calculate government percentage for the category
			if (totals[categoryName].total_approved > 0) {
				totals[categoryName].gov_approved_percentage =
					(totals[categoryName].gov_approved_value /
						totals[categoryName].total_approved) *
					100;
			}
		});

		// Second pass: calculate percentages against grand totals
		Object.entries(totals).forEach(([categoryName, categoryTotal]) => {
			// Calculate category's total approved as percentage of grand total approved
			totals[categoryName].total_approved_percentage =
				grandTotalApproved > 0
					? (categoryTotal.total_approved / grandTotalApproved) * 100
					: 0;

			// Calculate approved vs requested percentage for category
			totals[categoryName].approved_vs_requested_percentage =
				categoryTotal.requested_amount > 0
					? (categoryTotal.total_approved / categoryTotal.requested_amount) *
						100
					: 0;
		});

		return totals;
	};

	// Prepare export data with calculated values
	const prepareExportData = (
		filteredData,
		groupedData,
		calculatedTotals,
		t
	) => {
		const exportRows = [];

		// Calculate grand totals from all filtered data
		let grandTotalRequestedAmount = 0;
		let grandTotalApproved = 0;

		filteredData.forEach((sector) => {
			grandTotalRequestedAmount += Number(sector.requested_amount) || 0;
			grandTotalApproved += Number(sector.total_approved) || 0;
		});

		Object.entries(groupedData).forEach(([categoryName, categoryData]) => {
			categoryData.items.forEach((sector) => {
				const totalApproved = Number(sector.total_approved) || 0;
				const requestedAmount = Number(sector.requested_amount) || 0;

				// Calculate total approved percentage of grand total
				const totalApprovedPercentage =
					grandTotalApproved > 0
						? (totalApproved / grandTotalApproved) * 100
						: 0;

				// Calculate approved vs requested percentage
				const approvedVsRequestedPercentage =
					requestedAmount > 0 ? (totalApproved / requestedAmount) * 100 : 0;

				const exportRow = {
					level: t("Sector"),
					sector_category_name: categoryName,
					sector_name: sector.sector_name,
					requested_budget_count: sector.requested_budget_count,
					approved_budget_count: sector.approved_budget_count,
					approval_rate: sector.approval_rate,
					requested_amount: requestedAmount,
					gov_approved_value: sector.gov_approved_value,
					gov_approved_percentage: sector.gov_approved_percentage,
					support_approved: sector.support_approved,
					credit_approved: sector.credit_approved,
					other_approved: sector.other_approved,
					internal_approved: sector.internal_approved,
					total_approved: totalApproved,
					total_approved_percentage: totalApprovedPercentage, // % of grand total
					approved_vs_requested_percentage: approvedVsRequestedPercentage, // % of requested amount
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

	// Custom data row renderer to display all calculated values
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
					return `${Number(value).toFixed(2)}%`;
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
				return `${Number(value).toFixed(2)}%`;
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
			renderDataRow={renderDataRow}
			searchFields={["sector_name", "sector_category_name"]}
			searchPlaceholder="Search by sector or category..."
			tableName="Project Finance By Source"
			exportSearchParams={exportSearchParams}
			tableClass={tableClass}
		/>
	);
};

export default ProjectFinanceBySource;
