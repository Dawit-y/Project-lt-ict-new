export const projectPhysicalPerformanceExportColumns = [
	{ key: "project_name", label: "project_name" },
	{ key: "project_code", label: "project_code" },
	{
		key: "physical_region",
		label: "physical_region",
		format: (val) => (val ? `${val}%` : "-"),
		type: "percentage",
	},
	{
		key: "financial_region",
		label: "financial_region",
		format: (val) => Number(val).toLocaleString(),
		type: "number",
	},
	{
		key: "physical_zone",
		label: "physical_zone",
		format: (val) => (val ? `${val}%` : "-"),
		type: "percentage",
	},
	{
		key: "financial_zone",
		label: "financial_zone",
		format: (val) => Number(val).toLocaleString(),
		type: "number",
	},
	{
		key: "overall_physical",
		label: "overall_physical",
		format: (val) => (val ? `${val}%` : "-"),
		type: "percentage",
	},
	{
		key: "overall_financial",
		label: "overall_financial",
		format: (val) => Number(val).toLocaleString(),
		type: "number",
	},
	{ key: "record_date", label: "record_date" },
	{ key: "start_date", label: "start_date" },
	{ key: "end_date", label: "end_date" },
];

export const financialReportOneExportColumns = [
	{
		key: "prj_name",
		label: "Project Name",
		width: 60,
	},
	{
		key: "prj_measurement_unit",
		label: "Unit",
	},
	{
		key: "prj_measured_figure",
		label: "Measured Figure",
	},
	{
		key: "prj_status",
		label: "Status",
	},
	{
		key: "sector",
		label: "Sector",
		width: 60,
	},
	{
		key: "project_category",
		label: "Category",
		width: 40,
	},
	{
		key: "prj_code",
		label: "Project Code",
		width: 30,
	},
	{
		key: "Location Information",
		label: "Location Information",
		columns: [
			{
				key: "prj_specific_site",
				label: "Specific Site",
			},
			{
				key: "zone",
				label: "Zone",
			},
			{
				key: "woreda",
				label: "Woreda",
			},
		],
	},
	{
		key: "start_year",
		label: "Start Year",
	},
	{
		key: "end_year",
		label: "End Year",
	},

	// Physical Performance
	{
		key: "physical_performance",
		label: "Physical Performance",
		columns: [
			{
				key: "bdr_before_previous_year_physical",
				label: "Before Previous Year",
			},
			{
				key: "bdr_previous_year_physical",
				label: "Previous Year",
			},
			{
				key: "bdr_physical_baseline",
				label: "Physical Baseline",
			},
		],
	},

	// Physical Action Plan
	{
		key: "physical_action_plan",
		label: "Physical Action Plan",
		columns: [
			{
				key: "bdr_physical_planned",
				label: "Physical Planned",
				type: "number",
			},
			{
				key: "bdr_physical_approved",
				label: "Physical Approved",
				type: "number",
			},
		],
	},

	// Budget Information
	{
		key: "budget_information",
		label: "Budget Information",
		columns: [
			{
				key: "prj_total_estimate_budget",
				label: "Total Estimate Budget",
				type: "number",
				format: (val) => (val ? parseFloat(val).toLocaleString() : "0"),
			},
			{
				key: "bdr_before_previous_year_financial",
				label: "Before Previous Year",
				type: "number",
				format: (val) => (val ? parseFloat(val).toLocaleString() : "0"),
			},
			{
				key: "bdr_previous_year_financial",
				label: "Previous Year",
				type: "number",
				format: (val) => (val ? parseFloat(val).toLocaleString() : "0"),
			},
			{
				key: "bdr_financial_baseline",
				label: "Financial Baseline",
				type: "number",
				format: (val) => (val ? parseFloat(val).toLocaleString() : "0"),
			},
		],
	},

	// Current Budget Plan
	{
		key: "current_budget_plan",
		label: "Current Budget Plan",
		columns: [
			{
				key: "bdr_requested_amount",
				label: "Requested Amount",
				type: "number",
				format: (val) => (val ? parseFloat(val).toLocaleString() : "0"),
			},
			{
				key: "bdr_released_amount",
				label: "Released Amount",
				type: "number",
				format: (val) => (val ? parseFloat(val).toLocaleString() : "0"),
			},
		],
	},

	// Supported by budgetary sources
	{
		key: "budgetary_sources",
		label: "Supported by budgetary sources",
		columns: [
			{
				key: "bdr_source_government_approved",
				label: "Government",
				type: "number",
				format: (val) => (val ? parseFloat(val).toLocaleString() : "0"),
				width: 30,
			},
			{
				key: "bdr_source_internal_requested",
				label: "Internal",
				type: "number",
				format: (val) => (val ? parseFloat(val).toLocaleString() : "0"),
			},
			{
				key: " bdr_source_other_approved ",
				label: "Other",
				type: "number",
				format: (val) => (val ? parseFloat(val).toLocaleString() : "0"),
			},
		],
	},
];
