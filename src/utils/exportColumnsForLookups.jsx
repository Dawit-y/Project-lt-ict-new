// export columns for lookups
export const kpiExportColumns = [
	{
		key: "kpi_name_or",
		label: "kpi_name_or",
	},
	{
		key: "kpi_name_am",
		label: "kpi_name_am",
	},
	{
		key: "kpi_name_en",
		label: "kpi_name_en",
	},
	{
		key: "kpi_unit_measurement",
		label: "kpi_unit_measurement",
	},
	{
		key: "kpi_status",
		label: "is_inactive",
		format: (val) => (val === 1 ? "yes" : "no"),
	},
	{
		key: "kpi_description",
		label: "kpi_description",
	},
];
