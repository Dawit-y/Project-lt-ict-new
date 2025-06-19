export const monitoringExportColumns = [
	{ key: "prj_name", label: "prj_name" },
	{ key: "prj_code", label: "prj_code" },
	{
		key: "mne_physical_region",
		label: "mne_physical_region",
		format: (val) => (val ? `${val}%` : "-"),
		type: "percentage",
	},
	{
		key: "mne_financial_region",
		label: "mne_financial_region",
		format: (val) => Number(val).toLocaleString(),
		type: "number",
	},
	{
		key: "mne_physical_zone",
		label: "mne_physical_zone",
		format: (val) => (val ? `${val}%` : "-"),
		type: "percentage",
	},
	{
		key: "mne_financial_zone",
		label: "mne_financial_zone",
		format: (val) => Number(val).toLocaleString(),
		type: "number",
	},
	{
		key: "mne_physical",
		label: "mne_physical",
		format: (val) => (val ? `${val}%` : "-"),
		type: "percentage",
	},
	{
		key: "mne_financial",
		label: "mne_financial",
		format: (val) => Number(val).toLocaleString(),
		type: "number",
	},
	{ key: "mne_record_date", label: "mne_record_date" },
	{ key: "mne_start_date", label: "mne_start_date" },
	{ key: "mne_end_date", label: "mne_end_date" },
];

export const citizenshipProjectExportColumns = [
	{
		key: "prj_name",
		label: "prj_name",
	},
	{
		key: "prj_code",
		label: "prj_code",
	},
	{
		key: "zone_name",
		label: "prj_owner_zone_id",
	},
	{
		key: "sector_name",
		label: "prj_sector_id",
	},
	{
		key: "status_name",
		label: "prs_status",
	},
	{
		key: "prj_total_estimate_budget",
		label: "prj_total_estimate_budget",
		format: (val) => (val != null ? parseFloat(val).toLocaleString() : "0"),
		type: "number",
	},
];

export const projectExportColumns = [
	{
		key: "prj_name",
		label: "prj_name",
	},
	{
		key: "prj_code",
		label: "prj_code",
	},
	{
		key: "zone_name",
		label: "prj_owner_zone_id",
	},
	{
		key: "sector_name",
		label: "prj_sector_id",
	},
	{
		key: "status_name",
		label: "prs_status",
	},
	{
		key: "prj_total_estimate_budget",
		label: "prj_total_estimate_budget",
		format: (val) => (val != null ? parseFloat(val).toLocaleString() : "0"),
		type: "number",
	},
];

export const budgetRequestExportColumns = [
	{ key: "bdy_name", label: "bdy_name" },
	{
		key: "bdr_request_type",
		label: "bdr_request_type",
		format: (val) => projectStatusMap[val],
	},
	{
		key: "bdr_request_category_id",
		label: "bdr_request_category_id",
		format: (val) => bgCategoryMap[val],
	},
	{ key: "prj_name", label: "prj_name" },
	{ key: "prj_code", label: "prj_code" },
	{
		key: "status_name",
		label: "bdr_request_status",
	},
	{
		key: "bdr_requested_amount",
		label: "bdr_requested_amount",
		format: (val) => parseFloat(val).toLocaleString(),
		type: "number",
	},
	{
		key: "bdr_released_amount",
		label: "bdr_released_amount",
		format: (val) => parseFloat(val).toLocaleString(),
		type: "number",
	},
	{
		key: "bdr_requested_date_gc",
		label: "bdr_requested_date_gc",
	},
	{
		key: "bdr_released_date_gc",
		label: "bdr_released_date_gc",
	},
];

export const approverBdrExportColumns = [
	{ key: "bdy_name", label: "bdy_name" },
	{
		key: "bdr_request_type",
		label: "bdr_request_type",
		format: (val) => projectStatusMap[val],
	},
	{
		key: "bdr_request_category_id",
		label: "bdr_request_category_id",
		format: (val) => bgCategoryMap[val],
	},
	{ key: "prj_name", label: "prj_name" },
	{ key: "prj_code", label: "prj_code" },
	{
		key: "status_name",
		label: "bdr_request_status",
	},
	{
		key: "bdr_requested_amount",
		label: "bdr_requested_amount",
		format: (val) => parseFloat(val).toLocaleString(),
		type: "number",
	},
	{
		key: "bdr_released_amount",
		label: "bdr_released_amount",
		format: (val) => parseFloat(val).toLocaleString(),
		type: "number",
	},
	{
		key: "bdr_requested_date_gc",
		label: "bdr_requested_date_gc",
	},
	{
		key: "bdr_released_date_gc",
		label: "bdr_released_date_gc",
	},
];

export const projectPaymentExportColumns = [
	{
		key: "prj_name",
		label: "prj_name",
	},
	{
		key: "prj_code",
		label: "prj_code",
	},
	{
		key: "prp_payment_date_gc",
		label: "prp_payment_date_gc",
	},
	{
		key: "prp_payment_amount",
		label: "prp_payment_amount",
		format: (val) => parseFloat(val).toLocaleString(),
		type: "number",
	},
	{
		key: "prp_payment_percentage",
		label: "prp_payment_percentage",
		format: (val) => (val ? `${val}%` : "-"),
		type: "percentage",
	},
];
