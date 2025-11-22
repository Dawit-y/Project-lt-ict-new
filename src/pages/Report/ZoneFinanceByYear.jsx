import React, { useMemo } from "react";
import ReportTable from "./ReportTable";
import { useTranslation } from "react-i18next";

const ZoneBudgetByYearsTable = ({
	data = [],
	exportSearchParams,
	tableClass = "",
}) => {
	const { t } = useTranslation();
	// Static fields that should NOT be treated as years
	const staticFields = useMemo(() => ["zone_id", "zone_name"], []);

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

	// Calculate year totals and grand total
	const yearTotals = useMemo(() => {
		const totals = {};
		let grandTotal = 0;

		// Initialize totals
		years.forEach((year) => {
			totals[year.field] = 0;
		});

		// Calculate totals for each year
		data.forEach((zone) => {
			years.forEach((year) => {
				const value = Number(zone[year.field]) || 0;
				totals[year.field] += value;
				grandTotal += value;
			});
		});

		return { yearTotals: totals, grandTotal };
	}, [data, years]);

	// Prepare columns configuration
	const columnsConfig = useMemo(
		() => [
			{
				id: "zone_name",
				label: t("Zone Name"),
				minWidth: 250,
				sticky: true,
				group: "zone_info",
			},
			...years.flatMap((year) => [
				{
					id: `${year.field}_budget`,
					label: t("Budget"),
					minWidth: 120,
					format: "currency",
					yearField: year.field,
					group: `year_${year.field}`,
				},
				{
					id: `${year.field}_percent`,
					label: t("%"),
					minWidth: 80,
					format: "percentage",
					yearField: year.field,
					group: `year_${year.field}`,
				},
			]),
			{
				id: "total_budget",
				label: t("Total Budget"),
				minWidth: 150,
				format: "currency",
				group: "zone_totals",
			},
			{
				id: "total_percent",
				label: t("Total %"),
				minWidth: 80,
				format: "percentage",
				group: "zone_totals",
			},
		],
		[t, years]
	);

	// Transform data to include calculated values
	const transformData = useMemo(() => {
		return (rawData) => {
			return rawData.map((zone) => {
				let zoneTotal = 0;

				// Calculate zone total across all years
				years.forEach((year) => {
					zoneTotal += Number(zone[year.field]) || 0;
				});

				// Create new object with calculated fields
				const transformedZone = { ...zone };

				// Add year-specific calculated fields
				years.forEach((year) => {
					const value = Number(zone[year.field]) || 0;
					const percent =
						yearTotals.yearTotals[year.field] > 0
							? (value / yearTotals.yearTotals[year.field]) * 100
							: 0;

					transformedZone[`${year.field}_budget`] = value;
					transformedZone[`${year.field}_percent`] = percent;
				});

				// Add total fields
				transformedZone.total_budget = zoneTotal;
				transformedZone.total_percent =
					yearTotals.grandTotal > 0
						? (zoneTotal / yearTotals.grandTotal) * 100
						: 0;

				return transformedZone;
			});
		};
	}, [years, yearTotals]);

	// Calculate totals for the grand total row
	const calculateTotals = useMemo(() => {
		return (groupedData, columns) => {
			const totals = {};

			// Add grand total row
			totals["grand_total"] = {};
			columns.forEach((col) => {
				if (col.id === "zone_name") {
					totals["grand_total"][col.id] = t("Total");
				} else if (col.yearField) {
					// Handle year-specific columns
					if (col.format === "currency") {
						totals["grand_total"][col.id] =
							yearTotals.yearTotals[col.yearField] || 0;
					} else if (col.format === "percentage") {
						const yearValue = yearTotals.yearTotals[col.yearField] || 0;
						totals["grand_total"][col.id] =
							yearTotals.grandTotal > 0
								? (yearValue / yearTotals.grandTotal) * 100
								: 0;
					}
				} else if (col.id === "total_budget") {
					totals["grand_total"][col.id] = yearTotals.grandTotal;
				} else if (col.id === "total_percent") {
					totals["grand_total"][col.id] = 100;
				}
			});

			return totals;
		};
	}, [yearTotals, t]);

	// Custom render for data rows including total row
	const renderDataRow = useMemo(() => {
		return (row, index, translation) => {
			// Check if this is the total row
			const isTotalRow = row.zone_name === t("Total");

			return (
				<tr
					key={`data-${row.zone_id || index}`}
					className={isTotalRow ? "total-row" : ""}
				>
					{columnsConfig.map((col) => {
						const value = row[col.id];
						let displayValue = "-";

						if (value !== null && value !== undefined && value !== "") {
							switch (col.format) {
								case "currency":
									displayValue = new Intl.NumberFormat("en-ET", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									}).format(value);
									break;
								case "percentage":
									displayValue = `${Number(value).toFixed(1)}%`;
									break;
								default:
									displayValue = value.toString();
							}
						}

						return (
							<td
								key={col.id}
								data-column={col.id}
								className={col.sticky ? "sticky-column" : ""}
								style={col.sticky ? { left: 0 } : {}}
							>
								{isTotalRow ? <strong>{displayValue}</strong> : displayValue}
							</td>
						);
					})}
				</tr>
			);
		};
	}, [columnsConfig, t]);

	// Prepare data for export
	const prepareExportData = useMemo(() => {
		return (filteredData, groupedData, calculatedTotals, translation) => {
			const exportRows = [];

			// Add zone rows
			filteredData.forEach((zone) => {
				const zoneRow = {
					level: translation("Zone"),
					zone_name: zone.zone_name,
				};

				years.forEach((year) => {
					const value = Number(zone[year.field]) || 0;
					const percent =
						yearTotals.yearTotals[year.field] > 0
							? (value / yearTotals.yearTotals[year.field]) * 100
							: 0;

					zoneRow[`${year.label} Budget`] = value;
					zoneRow[`${year.label} %`] = percent;
				});

				zoneRow[translation("Total Budget")] = zone.total_budget;
				zoneRow[translation("Total %")] = zone.total_percent;
				exportRows.push(zoneRow);
			});

			// Add total row
			if (calculatedTotals.grand_total) {
				const totalRow = {
					level: translation("Total"),
					zone_name: translation("Total"),
				};

				years.forEach((year) => {
					const value = yearTotals.yearTotals[year.field] || 0;
					const percent =
						yearTotals.grandTotal > 0
							? (value / yearTotals.grandTotal) * 100
							: 0;

					totalRow[`${year.label} Budget`] = value;
					totalRow[`${year.label} %`] = percent;
				});

				totalRow[translation("Total Budget")] = yearTotals.grandTotal;
				totalRow[translation("Total %")] = 100;
				exportRows.push(totalRow);
			}

			return exportRows;
		};
	}, [years, yearTotals, t]);

	// Search fields configuration
	const searchFields = useMemo(() => ["zone_name"], []);

	return (
		<ReportTable
			data={data}
			columnsConfig={columnsConfig}
			exportSearchParams={exportSearchParams}
			tableClass={tableClass}
			tableName="Zone Finance by Years"
			// Header configuration
			headerStructure="grouped"
			// Custom rendering
			renderDataRow={renderDataRow}
			// Data processing
			calculateTotals={calculateTotals}
			prepareExportData={prepareExportData}
			transformData={transformData}
			// Search configuration
			searchFields={searchFields}
			searchPlaceholder="Search by zone name..."
			// Disable grouping since we're handling totals differently
			groupBy={null}
			expandable={false}
		/>
	);
};

export default ZoneBudgetByYearsTable;
