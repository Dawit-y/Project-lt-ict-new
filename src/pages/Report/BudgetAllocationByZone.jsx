import React, { useMemo } from "react";
import ReportTable from "./ReportTable";
import { useTranslation } from "react-i18next";

const BudgetAllocationTable = ({ data = [], exportSearchParams }) => {
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
		return [
			...new Set(zoneFields.map((field) => field.replace(/_req|_app/, ""))),
		].map((zone) => ({
			id: zone,
			label: t(zone) || zone,
			appField: `${zone}_app`,
		}));
	}, [data, staticFields, t]);

	const columnsConfig = useMemo(
		() => [
			{
				id: "sector_category",
				label: t("Sector Category"),
				sticky: true,
				minWidth: 250,
			},
			{
				id: "sector_name",
				label: t("Sector Name"),
				sticky: true,
				minWidth: 300,
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
			},
		],
		[t, zones]
	);

	const calculateTotals = (groupedData) => {
		const totals = {};
		Object.entries(groupedData).forEach(([category, categoryData]) => {
			totals[category] = { total_approved: 0 };
			zones.forEach((zone) => (totals[category][zone.appField] = 0));

			categoryData.items.forEach((sector) => {
				zones.forEach((zone) => {
					const value = Number(sector[zone.appField]) || 0;
					totals[category][zone.appField] += value;
					totals[category].total_approved += value;
				});
			});
		});
		return totals;
	};

	return (
		<ReportTable
			data={data}
			columnsConfig={columnsConfig}
			groupBy="sector_category"
			headerStructure="grouped"
			calculateTotals={calculateTotals}
			searchFields={["sector_name", "sector_category"]}
			searchPlaceholder="Search by sector or category..."
			tableName="Budget Allocation"
			exportSearchParams={exportSearchParams}
		/>
	);
};

export default BudgetAllocationTable;
