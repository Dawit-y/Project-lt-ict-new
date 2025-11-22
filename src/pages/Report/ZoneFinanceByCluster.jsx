import React, { useMemo } from "react";
import ReportTable from "./ReportTable";
import { useTranslation } from "react-i18next";

const ZoneBudgetByClustersTable = ({
	data = [],
	exportSearchParams,
	tableClass = "",
}) => {
	const { t } = useTranslation();
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
			...clusters.map((cluster) => ({
				id: cluster.field,
				label: cluster.label,
				minWidth: 150,
				format: "currency",
				group: "clusters",
			})),
			{
				id: "zone_total_budget",
				label: t("Zone Total"),
				minWidth: 150,
				format: "currency",
				group: "zone_totals",
			},
			{
				id: "zone_total_percent",
				label: t("Zone %"),
				minWidth: 80,
				format: "percentage",
				group: "zone_totals",
			},
		],
		[t, clusters]
	);

	// Transform data to include calculated totals
	const transformData = useMemo(() => {
		return (rawData) => {
			return rawData.map((zone) => {
				let zoneTotal = 0;

				// Calculate zone total
				clusters.forEach((cluster) => {
					zoneTotal += Number(zone[cluster.field]) || 0;
				});

				return {
					...zone,
					zone_total_budget: zoneTotal,
					zone_total_percent:
						clusterTotals.grandTotal > 0
							? (zoneTotal / clusterTotals.grandTotal) * 100
							: 0,
				};
			});
		};
	}, [clusters, clusterTotals.grandTotal]);

	// Calculate totals for groups
	const calculateTotals = useMemo(() => {
		return (groupedData, columns) => {
			const totals = {};

			// Add grand total row
			totals["grand_total"] = {};
			columns.forEach((col) => {
				if (col.id === "zone_name") {
					totals["grand_total"][col.id] = t("Total");
				} else if (col.format === "currency") {
					if (col.id === "zone_total_budget") {
						totals["grand_total"][col.id] = clusterTotals.grandTotal;
					} else if (clusterTotals.clusterTotals[col.id] !== undefined) {
						totals["grand_total"][col.id] = clusterTotals.clusterTotals[col.id];
					}
				} else if (
					col.format === "percentage" &&
					col.id === "zone_total_percent"
				) {
					totals["grand_total"][col.id] = 100;
				}
			});

			return totals;
		};
	}, [clusterTotals, t]);

	// Custom render for total row
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
						if (col.id === "zone_name") {
							return (
								<td
									key={col.id}
									data-column={col.id}
									className={col.sticky ? "sticky-column" : ""}
									style={col.sticky ? { left: 0 } : {}}
								>
									{isTotalRow ? <strong>{row[col.id]}</strong> : row[col.id]}
								</td>
							);
						}

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

				clusters.forEach((cluster) => {
					const value = Number(zone[cluster.field]) || 0;
					zoneRow[cluster.label] = value;
				});

				zoneRow[translation("Zone Total")] = zone.zone_total_budget;
				zoneRow[translation("Zone %")] = zone.zone_total_percent;
				exportRows.push(zoneRow);
			});

			// Add total row
			if (calculatedTotals.grand_total) {
				const totalRow = {
					level: translation("Total"),
					zone_name: translation("Total"),
				};

				clusters.forEach((cluster) => {
					totalRow[cluster.label] =
						calculatedTotals.grand_total[cluster.field] || 0;
				});

				totalRow[translation("Zone Total")] =
					calculatedTotals.grand_total.zone_total_budget;
				totalRow[translation("Zone %")] = 100;
				exportRows.push(totalRow);
			}

			return exportRows;
		};
	}, [clusters]);

	// Search fields configuration
	const searchFields = useMemo(() => ["zone_name"], []);

	return (
		<ReportTable
			data={data}
			columnsConfig={columnsConfig}
			exportSearchParams={exportSearchParams}
			tableClass={tableClass}
			tableName="Zone Budget by Clusters"
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

export default ZoneBudgetByClustersTable;
