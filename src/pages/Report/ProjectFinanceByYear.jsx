import React, { useMemo } from "react";
import ReportTable from "./ReportTable";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const BudgetByYearsTable = ({
	data = [],
	exportSearchParams,
	tableClass = "",
}) => {
	const { t } = useTranslation();
	// Static fields that should NOT be treated as years
	const staticFields = useMemo(
		() => [
			"sector_id",
			"sector_category_id",
			"sector_name",
			"sector_category_name",
		],
		[]
	);

	// Dynamically extract years from the first data item
	const years = useMemo(() => {
		if (!data || data.length === 0) return [];

		const firstItem = data[0];
		const yearFields = Object.keys(firstItem).filter(
			(key) => !staticFields.includes(key)
		);

		// Sort years numerically
		return yearFields
			.map((year) => ({
				id: year,
				label: year,
				field: year,
				yearValue: parseInt(year),
			}))
			.sort((a, b) => a.yearValue - b.yearValue);
	}, [data, staticFields]);

	// Create columns config dynamically
	const columnsConfig = useMemo(() => {
		const baseColumns = [
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
				sticky: false,
				format: "string",
			},
		];

		const yearColumns = years.map((year) => ({
			id: year.field,
			label: year.label,
			minWidth: 120,
			group: "budget_by_years",
			format: "currency",
			exportWidth: 20,
		}));

		const totalColumn = {
			id: "total_budget",
			label: t("Total Budget"),
			minWidth: 150,
			group: "budget_by_years",
			format: "currency",
			exportWidth: 30,
		};

		return [...baseColumns, ...yearColumns, totalColumn];
	}, [t, years]);

	// Transform data to calculate totals
	const transformData = (data) => {
		return data.map((item) => {
			let sectorTotal = 0;

			// Calculate total for each sector
			years.forEach((year) => {
				sectorTotal += Number(item[year.field]) || 0;
			});

			return {
				...item,
				total_budget: sectorTotal,
			};
		});
	};

	// Calculate category totals
	const calculateTotals = (groupedData, columnsConfig) => {
		const totals = {};

		Object.entries(groupedData).forEach(([categoryName, categoryData]) => {
			totals[categoryName] = {};

			// Initialize year totals
			years.forEach((year) => {
				totals[categoryName][year.field] = 0;
			});
			totals[categoryName].total_budget = 0;

			// Sum up all sectors in this category
			categoryData.items.forEach((sector) => {
				years.forEach((year) => {
					const value = Number(sector[year.field]) || 0;
					totals[categoryName][year.field] += value;
					totals[categoryName].total_budget += value;
				});
			});
		});

		return totals;
	};

	// Prepare data for export
	const prepareExportData = (
		filteredData,
		groupedData,
		calculatedTotals,
		t
	) => {
		const exportRows = [];

		Object.entries(groupedData).forEach(([categoryName, categoryData]) => {
			categoryData.items.forEach((sector) => {
				let sectorTotal = 0;
				const sectorRow = {
					level: t("Sector"),
					sector_category_name: categoryName,
					sector_name: sector.sector_name,
				};

				years.forEach((year) => {
					const value = Number(sector[year.field]) || 0;
					sectorTotal += value;
					sectorRow[year.field] = value;
				});

				sectorRow["total_budget"] = sectorTotal;
				exportRows.push(sectorRow);
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
			searchFields={["sector_name", "sector_category_name"]}
			searchPlaceholder="Search by sector or category..."
			tableName="Project Finance by Years"
			exportSearchParams={exportSearchParams}
			tableClass={tableClass}
		/>
	);
};

export default BudgetByYearsTable;
