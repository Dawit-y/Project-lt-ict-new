export const monitoringExportColumns = [
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

// Helper function to sum monthly values for quarters
function sumMonthlyValues(row, months, prefix) {
	const sum = months.reduce((total, month) => {
		const value = Number(row[`${prefix}${month}`]) || 0;
		return total + value;
	}, 0);
	return sum ? sum.toLocaleString() : "-";
}

export const projectPerformanceExportColumns = [
	{ key: "prp_record_date_gc", label: "prp_record_date_gc" },

	// Quarter 1 columns
	// {
	// 	key: "quarter_1_physical_planned",
	// 	label: "Q1 physical_planned",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [11, 12, 1], "prp_pyhsical_planned_month_"),
	// },
	// {
	// 	key: "quarter_1_financial_planned",
	// 	label: "Q1 financial_planned",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [11, 12, 1], "prp_finan_planned_month_"),
	// },
	// {
	// 	key: "quarter_1_physical_actual",
	// 	label: "Q1 physical_actual",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [11, 12, 1], "prp_pyhsical_actual_month_"),
	// },
	// {
	// 	key: "quarter_1_financial_actual",
	// 	label: "Q1 financial_actual",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [11, 12, 1], "prp_finan_actual_month_"),
	// },

	// // Quarter 2 columns
	// {
	// 	key: "quarter_2_physical_planned",
	// 	label: "Q2 physical_planned",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [2, 3, 4], "prp_pyhsical_planned_month_"),
	// },
	// {
	// 	key: "quarter_2_financial_planned",
	// 	label: "Q2 financial_planned",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [2, 3, 4], "prp_finan_planned_month_"),
	// },
	// {
	// 	key: "quarter_2_physical_actual",
	// 	label: "Q2 physical_actual",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [2, 3, 4], "prp_pyhsical_actual_month_"),
	// },
	// {
	// 	key: "quarter_2_financial_actual",
	// 	label: "Q2 financial_actual",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [2, 3, 4], "prp_finan_actual_month_"),
	// },

	// // Quarter 3 columns
	// {
	// 	key: "quarter_3_physical_planned",
	// 	label: "Q3 physical_planned",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [5, 6, 7], "prp_pyhsical_planned_month_"),
	// },
	// {
	// 	key: "quarter_3_financial_planned",
	// 	label: "Q3 financial_planned",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [5, 6, 7], "prp_finan_planned_month_"),
	// },
	// {
	// 	key: "quarter_3_physical_actual",
	// 	label: "Q3 physical_actual",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [5, 6, 7], "prp_pyhsical_actual_month_"),
	// },
	// {
	// 	key: "quarter_3_financial_actual",
	// 	label: "Q3 financial_actual",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [5, 6, 7], "prp_finan_actual_month_"),
	// },

	// // Quarter 4 columns
	// {
	// 	key: "quarter_4_physical_planned",
	// 	label: "Q4 physical_planned",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [8, 9, 10], "prp_pyhsical_planned_month_"),
	// },
	// {
	// 	key: "quarter_4_financial_planned",
	// 	label: "Q4 financial_planned",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [8, 9, 10], "prp_finan_planned_month_"),
	// },
	// {
	// 	key: "quarter_4_physical_actual",
	// 	label: "Q4 physical_actual",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [8, 9, 10], "prp_pyhsical_actual_month_"),
	// },
	// {
	// 	key: "quarter_4_financial_actual",
	// 	label: "Q4 financial_actual",
	// 	format: (_, row) =>
	// 		sumMonthlyValues(row, [8, 9, 10], "prp_finan_actual_month_"),
	// },

	{
		key: "prp_budget_baseline",
		label: "prp_budget_baseline",
		format: (val) => (val ? Number(val).toLocaleString() : "-"),
	},
	{
		key: "prp_physical_baseline",
		label: "prp_physical_baseline",
		format: (val) => (val ? Number(val).toLocaleString() : "-"),
	},
	{
		key: "prp_total_budget_used",
		label: "prp_total_budget_used",
		format: (val) => (val ? val.toFixed(2) : "0.00"),
	},
	{ key: "prp_physical_performance", label: "prp_physical_performance" },
];

export const projectContractorExportColumns = [
	{ key: "cni_name", label: "cni_name" },
	{ key: "cni_contractor_type", label: "cni_contractor_type" },
	{ key: "cni_tin_num", label: "cni_tin_num" },
	{ key: "cni_vat_num", label: "cni_vat_num" },
	{
		key: "cni_total_contract_price",
		label: "cni_total_contract_price",
		type: "number",
		format: (val) => (val ? Number(val).toLocaleString() : "-"),
	},
	{ key: "cni_contract_start_date_gc", label: "cni_contract_start_date_gc" },
	{ key: "cni_contract_end_date_gc", label: "cni_contract_end_date_gc" },
	{ key: "cni_contact_person", label: "cni_contact_person" },
	{ key: "cni_phone_number", label: "cni_phone_number" },
];

export const projectHandoverExportColumns = [
	{ key: "prh_handover_date_gc", label: "prh_handover_date_gc" },
	{ key: "prh_description", label: "prh_description" },
];

export const budgetSourceExportColumns = [
	{
		key: "bsr_amount",
		label: "bsr_amount",
		format: (val) => Number(val).toLocaleString(),
		type: "number",
	},
	{
		key: "bsr_description",
		label: "bsr_description",
		format: (val) => val ?? "-",
	},
];

export const projectPaymentExportColumns = [
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

export const projectEmployeeExportColumns = [
	{ key: "emp_id_no", label: "emp_id_no" },
	{ key: "emp_full_name", label: "emp_full_name" },
	{ key: "emp_email", label: "emp_email" },
	{ key: "emp_phone_num", label: "emp_phone_num" },
	{ key: "emp_role", label: "emp_role" },
	{ key: "emp_start_date_gc", label: "emp_start_date_gc" },
];

export const projectStakeholderExportColumns = [
	{ key: "psh_name", label: "psh_name" },
	{ key: "psh_stakeholder_type", label: "psh_stakeholder_type" },
	{ key: "psh_representative_name", label: "psh_representative_name" },
	{ key: "psh_representative_phone", label: "psh_representative_phone" },
	{ key: "psh_role", label: "psh_role" },
];

export const budgetRequestExportColumns = [
	{ key: "bdy_name", label: "bdy_name" },
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

export const ProjectPlanExportColumns = [
	{ key: "pld_name", label: "pld_name" },
	{ key: "pld_start_date_gc", label: "pld_start_date_gc" },
	{ key: "pld_end_date_gc", label: "pld_end_date_gc" },
];

export const projectBudgetExpenditureExportColumns = [
	{ key: "pbe_budget_code", label: "pbe_budget_code" },
	{ key: "pbe_budget_year", label: "pbe_budget_year" },
	{ key: "pbe_budget_month", label: "pbe_budget_month" },
	{
		key: "ppe_amount",
		label: "ppe_amount",
		format: (val) =>
			val != null
				? new Intl.NumberFormat("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}).format(val)
				: "0.00",
		type: "number",
	},
];

export const procurementExportColumns = [
	{
		key: "pri_total_procurement_amount",
		label: "pri_total_procurement_amount",
		type: "number",
		format: (val) => (val ? Number(val).toLocaleString() : "-"),
	},
	{ key: "pri_bid_opening_date", label: "pri_bid_opening_date" },
	{ key: "pri_bid_closing_date", label: "pri_bid_closing_date" },
	{ key: "pri_bid_award_date", label: "pri_bid_award_date" },
];

export const projectComponentExportColumns = [
	{
		key: "pcm_component_name",
		label: "pcm_component_name",
		format: (val) => val ?? "-",
	},
	{
		key: "pcm_unit_measurement",
		label: "pcm_unit_measurement",
		format: (val) => val ?? "-",
	},
	{
		key: "pcm_amount",
		label: "pcm_amount",
		format: (val) => Number(val).toLocaleString(),
		type: "number",
	},
	{
		key: "pcm_description",
		label: "pcm_description",
		format: (val) => val ?? "-",
	},
];

export const implementingAreaExportColumns = [
	// {
	// 	key: "pia_sector_id",
	// 	label: "sector",
	// 	format: (val) => sectorsMap?.[val] ?? "-",
	// },
	{
		key: "pia_budget_amount",
		label: "pia_budget_amount",
		format: (val) => Number(val).toLocaleString(),
		type: "number",
	},
	{
		key: "pia_site",
		label: "site",
		format: (val) => val ?? "-",
	},
	{
		key: "pia_geo_location",
		label: "pia_geo_location",
		format: (val) => val ?? "-",
	},
	{
		key: "pia_description",
		label: "description",
		format: (val) => val ?? "-",
	},
];
