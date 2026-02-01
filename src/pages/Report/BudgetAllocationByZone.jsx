import React, { useMemo } from "react";
import ReportTable from "./ReportTable";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const BudgetAllocationTable = ({
	data = [],
	exportSearchParams,
	tableClass = "",
}) => {
	const { t } = useTranslation();

	const staticFields = [
		"sector_id",
		"sector_cat",
		"sector_name",
		"sector_category",
	];

	const zones = useMemo(() => {
		if (!data || data.length === 0) return [];
		const firstItem = data[0];
		const zoneFields = Object.keys(firstItem).filter(
			(key) =>
				!staticFields.includes(key) &&
				(key.endsWith("_req") || key.endsWith("_app"))
		);
		// Get unique zone names (remove _req/_app suffix)
		const uniqueZones = [
			...new Set(zoneFields.map((field) => field.replace(/_req|_app/, ""))),
		];

		return uniqueZones.map((zone) => ({
			id: zone,
			label: t(zone) || zone,
			appField: `${zone}_app`,
			reqField: `${zone}_req`,
		}));
	}, [data, staticFields, t]);

	const columnsConfig = useMemo(
		() => [
			{
				id: "sector_category",
				label: t("Sector Category"),
				sticky: true,
				minWidth: 250,
				format: "string",
				exportWidth: 50,
			},
			{
				id: "sector_name",
				label: t("Sector Name"),
				sticky: true,
				minWidth: 300,
				format: "string",
				exportWidth: 50,
			},
			...zones.map((zone) => ({
				id: zone.appField,
				label: zone.label,
				minWidth: 150,
				format: "currency",
				group: "zones",
			})),
			{
				id: "total_approved",
				label: t("Total Approved"),
				minWidth: 150,
				format: "currency",
				exportWidth: 30,
			},
		],
		[t, zones]
	);

	// Transform data to calculate total_approved
	const transformData = (data) => {
		if (!data || data.length === 0) return [];

		return data.map((item) => {
			let totalApproved = 0;

			// Calculate total from all zone approval fields
			zones.forEach((zone) => {
				totalApproved += Number(item[zone.appField]) || 0;
			});

			return {
				...item,
				total_approved: totalApproved,
			};
		});
	};

	// Calculate category totals
	const calculateTotals = (groupedData, columnsConfig) => {
		const totals = {};

		Object.entries(groupedData).forEach(([categoryName, categoryData]) => {
			totals[categoryName] = {};

			// Initialize zone totals
			zones.forEach((zone) => {
				totals[categoryName][zone.appField] = 0;
			});
			totals[categoryName].total_approved = 0;

			// Sum up all sectors in this category
			categoryData.items.forEach((sector) => {
				zones.forEach((zone) => {
					const value = Number(sector[zone.appField]) || 0;
					totals[categoryName][zone.appField] += value;
					totals[categoryName].total_approved += value;
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
				const sectorRow = {
					sector_category: categoryName,
					sector_name: sector.sector_name,
				};
				zones.forEach((zone) => {
					sectorRow[zone.appField] = Number(sector[zone.appField]) || 0;
				});
				sectorRow["total_approved"] = sector.total_approved || 0;

				exportRows.push(sectorRow);
			});
		});

		return exportRows;
	};
	// Custom group row renderer
	const renderGroupRow = (row, toggleGroup, t) => {
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
			<tr
				key={`group-${row.groupName}`}
				className="group-row"
				onClick={() => toggleGroup(row.groupName)}
			>
				{columnsConfig.map((col) => {
					if (col.id === "sector_category") {
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

	return (
		<ReportTable
			data={data}
			columnsConfig={columnsConfig}
			groupBy="sector_category"
			headerStructure="grouped"
			transformData={transformData}
			calculateTotals={calculateTotals}
			prepareExportData={prepareExportData}
			renderGroupRow={renderGroupRow}
			searchFields={["sector_name", "sector_category"]}
			searchPlaceholder="Search by sector or category..."
			tableName="Budget Allocation"
			exportSearchParams={exportSearchParams}
			tableClass={tableClass}
		/>
	);
};

export default BudgetAllocationTable;
