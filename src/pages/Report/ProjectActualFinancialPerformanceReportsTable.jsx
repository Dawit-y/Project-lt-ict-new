import React, { useMemo } from "react";
import ReportTable from "./ReportTable";
import { useTranslation } from "react-i18next";

const ProjectActualFinancialPerformanceReportsTable = ({
	data = [],
	exportSearchParams,
}) => {
	const { t } = useTranslation();

	const columnsConfig = useMemo(
		() => [
			{
				id: "sector",
				label: t("Sector"),
				minWidth: 150,
				sticky: true,
				exportWidth: 40,
			},
			{
				id: "prj_code",
				label: t("Project Code"),
				minWidth: 100,
				sticky: true,
			},
			{
				id: "prj_name",
				label: t("Project Name"),
				minWidth: 200,
				exportWidth: 50,
				sticky: true,
			},
			{
				id: "prj_measurement_unit",
				label: t("Unit"),
				minWidth: 80,
			},
			{
				id: "budgetyear",
				label: t("Budget Year"),
				minWidth: 80,
			},
			{
				id: "prp_budget_baseline",
				label: t("Financial Baseline"),
				minWidth: 120,
				format: "currency",
			},
			{
				id: "prp_budget_planned",
				label: t("Financial Planned"),
				minWidth: 120,
				format: "currency",
			},
			// Q1 Group
			{
				id: "prp_finan_actual_month_11",
				label: t("Jul"),
				minWidth: 80,
				format: "currency",
				group: "q1",
			},
			{
				id: "prp_finan_actual_month_12",
				label: t("Aug"),
				minWidth: 80,
				format: "currency",
				group: "q1",
			},
			{
				id: "prp_finan_actual_month_1",
				label: t("Sep"),
				minWidth: 80,
				format: "currency",
				group: "q1",
			},
			{
				id: "quarter1total",
				label: t("Q1 Total"),
				minWidth: 100,
				format: "currency",
				group: "q1",
			},
			// Q2 Group
			{
				id: "prp_finan_actual_month_2",
				label: t("Oct"),
				minWidth: 80,
				format: "currency",
				group: "q2",
			},
			{
				id: "prp_finan_actual_month_3",
				label: t("Nov"),
				minWidth: 80,
				format: "currency",
				group: "q2",
			},
			{
				id: "prp_finan_actual_month_4",
				label: t("Dec"),
				minWidth: 80,
				format: "currency",
				group: "q2",
			},
			{
				id: "quarter2total",
				label: t("Q2 Total"),
				minWidth: 100,
				format: "currency",
				group: "q2",
			},
			// Q3 Group
			{
				id: "prp_finan_actual_month_5",
				label: t("Jan"),
				minWidth: 80,
				format: "currency",
				group: "q3",
			},
			{
				id: "prp_finan_actual_month_6",
				label: t("Feb"),
				minWidth: 80,
				format: "currency",
				group: "q3",
			},
			{
				id: "prp_finan_actual_month_7",
				label: t("Mar"),
				minWidth: 80,
				format: "currency",
				group: "q3",
			},
			{
				id: "quarter3total",
				label: t("Q3 Total"),
				minWidth: 100,
				format: "currency",
				group: "q3",
			},
			// Q4 Group
			{
				id: "prp_finan_actual_month_8",
				label: t("Apr"),
				minWidth: 80,
				format: "currency",
				group: "q4",
			},
			{
				id: "prp_finan_actual_month_9",
				label: t("May"),
				minWidth: 80,
				format: "currency",
				group: "q4",
			},
			{
				id: "prp_finan_actual_month_10",
				label: t("Jun"),
				minWidth: 80,
				format: "currency",
				group: "q4",
			},
			{
				id: "quarter4total",
				label: t("Q4 Total"),
				minWidth: 100,
				format: "currency",
				group: "q4",
			},
			{
				id: "year_total",
				label: t("Year Total"),
				minWidth: 120,
				format: "currency",
			},
			{
				id: "upto_year_total",
				label: t("Upto Year Total"),
				minWidth: 120,
				format: "currency",
			}
		],
		[t]
	);

	// Transform data with calculated totals - SIMPLIFIED
	const transformData = (data) => {
		if (!Array.isArray(data)) return [];

		return data.map((item, index) => {
			// Calculate quarter totals from months
			const q1 =
				(Number(item.prp_finan_actual_month_11) || 0) +
				(Number(item.prp_finan_actual_month_12) || 0) +
				(Number(item.prp_finan_actual_month_1) || 0);

			const q2 =
				(Number(item.prp_finan_actual_month_2) || 0) +
				(Number(item.prp_finan_actual_month_3) || 0) +
				(Number(item.prp_finan_actual_month_4) || 0);

			const q3 =
				(Number(item.prp_finan_actual_month_5) || 0) +
				(Number(item.prp_finan_actual_month_6) || 0) +
				(Number(item.prp_finan_actual_month_7) || 0);

			const q4 =
				(Number(item.prp_finan_actual_month_8) || 0) +
				(Number(item.prp_finan_actual_month_9) || 0) +
				(Number(item.prp_finan_actual_month_10) || 0);

			const yearTotal = q1 + q2 + q3 + q4;
			const uptoYearTotal = yearTotal + Number(item.prp_budget_baseline);

			// Return simple object with all fields - NO custom id or complex transformations
			return {
				// Keep original field names as they are
				sector: item.sector || "",
				prj_code: item.prj_code || "",
				prj_name: item.prj_name || "",
				prj_measurement_unit: item.prj_measurement_unit || "",
				budgetyear: item.budgetyear || "",
				prp_budget_baseline: item.prp_budget_baseline,
				prp_budget_planned: item.prp_budget_planned,
				prp_finan_actual_month_11: item.prp_finan_actual_month_11,
				prp_finan_actual_month_12: item.prp_finan_actual_month_12,
				prp_finan_actual_month_1: item.prp_finan_actual_month_1,
				prp_finan_actual_month_2: item.prp_finan_actual_month_2,
				prp_finan_actual_month_3: item.prp_finan_actual_month_3,
				prp_finan_actual_month_4: item.prp_finan_actual_month_4,
				prp_finan_actual_month_5: item.prp_finan_actual_month_5,
				prp_finan_actual_month_6: item.prp_finan_actual_month_6,
				prp_finan_actual_month_7: item.prp_finan_actual_month_7,
				prp_finan_actual_month_8: item.prp_finan_actual_month_8,
				prp_finan_actual_month_9: item.prp_finan_actual_month_9,
				prp_finan_actual_month_10: item.prp_finan_actual_month_10,
				quarter1total: q1,
				quarter2total: q2,
				quarter3total: q3,
				quarter4total: q4,
				year_total: yearTotal,
				upto_year_total: uptoYearTotal,
			};
		});
	};

	// SIMPLIFIED calculateTotals - only return what's needed for display
	const calculateTotals = (groupedData) => {
		const totals = {};

		Object.entries(groupedData).forEach(([sectorName, sectorData]) => {
			totals[sectorName] = {
				prp_budget_baseline: 0,
				prp_budget_planned: 0,
				quarter1total: 0,
				quarter2total: 0,
				quarter3total: 0,
				quarter4total: 0,
				year_total: 0,
				upto_year_total: 0,
			};

			sectorData.items.forEach((project) => {
				totals[sectorName].prp_budget_baseline +=
					Number(project.prp_budget_baseline) || 0;
				totals[sectorName].prp_budget_planned +=
					Number(project.prp_budget_planned) || 0;
				totals[sectorName].quarter1total += Number(project.quarter1total) || 0;
				totals[sectorName].quarter2total += Number(project.quarter2total) || 0;
				totals[sectorName].quarter3total += Number(project.quarter3total) || 0;
				totals[sectorName].quarter4total += Number(project.quarter4total) || 0;
				totals[sectorName].year_total += Number(project.year_total) || 0;
				totals[sectorName].upto_year_total += Number(project.upto_year_total) || 0;
			});
		});

		return totals;
	};
	return (
		<ReportTable
			data={data}
			columnsConfig={columnsConfig}
			groupBy="sector"
			headerStructure="grouped"
			transformData={transformData}
			calculateTotals={calculateTotals}
			searchFields={["sector", "prj_name", "prj_code"]}
			searchPlaceholder="Search by sector, project name, or code..."
			tableName="Project Financial Performance"
			exportSearchParams={exportSearchParams}
			expandable={true}
		/>
	);
};
export default ProjectActualFinancialPerformanceReportsTable;