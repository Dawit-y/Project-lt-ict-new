import React, { useMemo } from "react";
import ReportTable from "./ReportTable";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ProjectActualPhysicalPerformanceReportsTable = ({ data = [], exportSearchParams }) => {
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
				sticky: true,
				exportWidth: 50,
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
				id: "prp_physical_baseline",
				label: t("Physical Baseline"),
				minWidth: 100,
				format: "percentage",
			},
			{
				id: "prp_physical_planned",
				label: t("Physical Planned"),
				minWidth: 100,
				format: "percentage",
			},
			// Q1 Group
			{
				id: "prp_pyhsical_actual_month_11",
				label: t("Jul"),
				minWidth: 80,
				format: "percentage",
				group: "q1",
			},
			{
				id: "prp_pyhsical_actual_month_12",
				label: t("Aug"),
				minWidth: 80,
				format: "percentage",
				group: "q1",
			},
			{
				id: "prp_pyhsical_actual_month_1",
				label: t("Sep"),
				minWidth: 80,
				format: "percentage",
				group: "q1",
			},
			{
				id: "quarter1total",
				label: t("Q1 Total"),
				minWidth: 80,
				format: "percentage",
				group: "q1",
			},
			// Q2 Group
			{
				id: "prp_pyhsical_actual_month_2",
				label: t("Oct"),
				minWidth: 80,
				format: "percentage",
				group: "q2",
			},
			{
				id: "prp_pyhsical_actual_month_3",
				label: t("Nov"),
				minWidth: 80,
				format: "percentage",
				group: "q2",
			},
			{
				id: "prp_pyhsical_actual_month_4",
				label: t("Dec"),
				minWidth: 80,
				format: "percentage",
				group: "q2",
			},
			{
				id: "quarter2total",
				label: t("Q2 Total"),
				minWidth: 80,
				format: "percentage",
				group: "q2",
			},
			// Q3 Group
			{
				id: "prp_pyhsical_actual_month_5",
				label: t("Jan"),
				minWidth: 80,
				format: "percentage",
				group: "q3",
			},
			{
				id: "prp_pyhsical_actual_month_6",
				label: t("Feb"),
				minWidth: 80,
				format: "percentage",
				group: "q3",
			},
			{
				id: "prp_pyhsical_actual_month_7",
				label: t("Mar"),
				minWidth: 80,
				format: "percentage",
				group: "q3",
			},
			{
				id: "quarter3total",
				label: t("Q3 Total"),
				minWidth: 80,
				format: "percentage",
				group: "q3",
			},
			// Q4 Group
			{
				id: "prp_pyhsical_actual_month_8",
				label: t("Apr"),
				minWidth: 80,
				format: "percentage",
				group: "q4",
			},
			{
				id: "prp_pyhsical_actual_month_9",
				label: t("May"),
				minWidth: 80,
				format: "percentage",
				group: "q4",
			},
			{
				id: "prp_pyhsical_actual_month_10",
				label: t("Jun"),
				minWidth: 80,
				format: "percentage",
				group: "q4",
			},
			{
				id: "quarter4total",
				label: t("Q4 Total"),
				minWidth: 80,
				format: "percentage",
				group: "q4",
			},
			{
				id: "year_total",
				label: t("Year Total"),
				minWidth: 100,
				format: "percentage",
			},
			{
				id: "upto_year_total",
				label: t("Upto Year Total"),
				minWidth: 100,
				format: "percentage",
			},
		],
		[t]
	);

	// Transform data - ONLY calculate quarter and year totals, no sector totals
	const transformData = (data) => {
		if (!Array.isArray(data)) return [];

		return data.map((item, index) => {
			// Calculate quarter totals from months (individual project calculations only)
			const q1 =
				(Number(item.prp_pyhsical_actual_month_11) || 0) +
				(Number(item.prp_pyhsical_actual_month_12) || 0) +
				(Number(item.prp_pyhsical_actual_month_1) || 0);

			const q2 =
				(Number(item.prp_pyhsical_actual_month_2) || 0) +
				(Number(item.prp_pyhsical_actual_month_3) || 0) +
				(Number(item.prp_pyhsical_actual_month_4) || 0);

			const q3 =
				(Number(item.prp_pyhsical_actual_month_5) || 0) +
				(Number(item.prp_pyhsical_actual_month_6) || 0) +
				(Number(item.prp_pyhsical_actual_month_7) || 0);

			const q4 =
				(Number(item.prp_pyhsical_actual_month_8) || 0) +
				(Number(item.prp_pyhsical_actual_month_9) || 0) +
				(Number(item.prp_pyhsical_actual_month_10) || 0);

			const yearTotal = q1 + q2 + q3 + q4;
			const uptoYearTotal = Number(item.prp_physical_baseline) + yearTotal;
			return {
				id: index,
				// Use the original field names directly from API response
				sector: item.sector || item.sci_name_en || item.sci_name || "",
				prj_code: item.prj_code || "",
				prj_name: item.prj_name || "",
				prj_measurement_unit: item.prj_measurement_unit || "",
				budgetyear: item.budgetyear || "",
				prp_physical_baseline: item.prp_physical_baseline,
				prp_physical_planned: item.prp_physical_planned,
				prp_pyhsical_actual_month_11: item.prp_pyhsical_actual_month_11,
				prp_pyhsical_actual_month_12: item.prp_pyhsical_actual_month_12,
				prp_pyhsical_actual_month_1: item.prp_pyhsical_actual_month_1,
				prp_pyhsical_actual_month_2: item.prp_pyhsical_actual_month_2,
				prp_pyhsical_actual_month_3: item.prp_pyhsical_actual_month_3,
				prp_pyhsical_actual_month_4: item.prp_pyhsical_actual_month_4,
				prp_pyhsical_actual_month_5: item.prp_pyhsical_actual_month_5,
				prp_pyhsical_actual_month_6: item.prp_pyhsical_actual_month_6,
				prp_pyhsical_actual_month_7: item.prp_pyhsical_actual_month_7,
				prp_pyhsical_actual_month_8: item.prp_pyhsical_actual_month_8,
				prp_pyhsical_actual_month_9: item.prp_pyhsical_actual_month_9,
				prp_pyhsical_actual_month_10: item.prp_pyhsical_actual_month_10,
				quarter1total: q1,
				quarter2total: q2,
				quarter3total: q3,
				quarter4total: q4,
				year_total: yearTotal,
				upto_year_total: uptoYearTotal
			};
		});
	};

	// No sector totals needed for performance data
	const calculateTotals = () => {
		return {}; // Return empty object since we don't need sector totals
	};

	// Simple group row renderer - shows sector and project count only
	const renderGroupRow = (row, toggleGroup, t) => {
		return (
			<tr
				key={`group-${row.groupName}`}
				className="group-row"
				onClick={() => toggleGroup(row.groupName)}
			>
				{columnsConfig.map((col) => {
					if (col.id === "sector") {
						return (
							<td
								key={col.id}
								data-column={col.id}
								className="sticky-column"
								style={{ left: 0 }}
								colSpan={columnsConfig.length} // Span all columns
							>
								<span className="group-toggle me-2">
									{row.isExpanded ? <FaChevronDown /> : <FaChevronRight />}
								</span>
								<strong>{row.groupName}</strong>
								<span className="ms-3">
									({row.itemCount} {t("projects")})
								</span>
							</td>
						);
					}
					return null; // Don't render other columns in group row
				})}
			</tr>
		);
	};

	// Simple data row renderer
	const renderDataRow = (row, index, t) => {
		return (
			<tr key={`data-${row.id || index}`}>
				{columnsConfig.map((col) => {
					const value = row[col.id];

					// Handle sticky columns with fixed positions
					if (col.sticky) {
						let leftPosition = 0;
						if (col.id === "prj_code") leftPosition = 150;
						else if (col.id === "prj_name") leftPosition = 250;

						return (
							<td
								key={col.id}
								data-column={col.id}
								className="sticky-column"
								style={{ left: leftPosition }}
							>
								{value || ""}
							</td>
						);
					}

					return (
						<td key={col.id} data-column={col.id}>
							{formatValue(value, col.format)}
						</td>
					);
				})}
			</tr>
		);
	};

	// Helper function for formatting
	const formatValue = (value, format = "string") => {
		if (value === null || value === undefined || value === "" || value === " ")
			return "-";

		switch (format) {
			case "number":
				const num = Number(value);
				return isNaN(num)
					? "-"
					: num.toLocaleString("en-US", {
							minimumFractionDigits: 0,
							maximumFractionDigits: 2,
						});
			default:
				return value.toString();
		}
	};

	// Simple export data preparation - use transformed data directly
	const prepareExportData = (filteredData) => {
		if (!Array.isArray(filteredData)) return [];

		return filteredData.map((item) => ({
			// Match exact field names from transformed data
			Sector: item.sector || "",
			"Project Code": item.prj_code || "",
			"Project Name": item.prj_name || "",
			Unit: item.prj_measurement_unit || "",
			"Budget Year": item.budgetyear || "",
			"Physical Baseline": formatNumberForExport(item.prp_physical_baseline),
			"Physical Planned": formatNumberForExport(item.prp_physical_planned),
			"Jul (Q1)": formatNumberForExport(item.prp_pyhsical_actual_month_11),
			"Aug (Q1)": formatNumberForExport(item.prp_pyhsical_actual_month_12),
			"Sep (Q1)": formatNumberForExport(item.prp_pyhsical_actual_month_1),
			"Q1 Total": formatNumberForExport(item.quarter1total),
			"Oct (Q2)": formatNumberForExport(item.prp_pyhsical_actual_month_2),
			"Nov (Q2)": formatNumberForExport(item.prp_pyhsical_actual_month_3),
			"Dec (Q2)": formatNumberForExport(item.prp_pyhsical_actual_month_4),
			"Q2 Total": formatNumberForExport(item.quarter2total),
			"Jan (Q3)": formatNumberForExport(item.prp_pyhsical_actual_month_5),
			"Feb (Q3)": formatNumberForExport(item.prp_pyhsical_actual_month_6),
			"Mar (Q3)": formatNumberForExport(item.prp_pyhsical_actual_month_7),
			"Q3 Total": formatNumberForExport(item.quarter3total),
			"Apr (Q4)": formatNumberForExport(item.prp_pyhsical_actual_month_8),
			"May (Q4)": formatNumberForExport(item.prp_pyhsical_actual_month_9),
			"Jun (Q4)": formatNumberForExport(item.prp_pyhsical_actual_month_10),
			"Q4 Total": formatNumberForExport(item.quarter4total),
			"Year Total": formatNumberForExport(item.year_total),
			"Upto Year Total": formatNumberForExport(item.upto_year_total),
		}));
	};

	// Helper function for export numbers
	const formatNumberForExport = (value) => {
		if (value === null || value === undefined || value === "" || value === " ")
			return 0;
		const num = Number(value);
		return isNaN(num) ? 0 : num;
	};

	return (
		<ReportTable
			data={data}
			columnsConfig={columnsConfig}
			groupBy="sector"
			headerStructure="grouped"
			transformData={transformData}
			searchFields={["sector", "prj_name", "prj_code"]}
			searchPlaceholder="Search by sector, project name, or code..."
			tableName="Project Physical Performance"
			exportSearchParams={exportSearchParams}
			expandable={true}
		/>
	);
};

export default ProjectActualPhysicalPerformanceReportsTable;
