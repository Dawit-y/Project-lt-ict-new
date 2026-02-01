import { useMemo } from "react";
import { useFetchSectorInformations } from "../queries/sectorinformation_query";
import { useFetchProjectStatuss } from "../queries/projectstatus_query";
import { createMultiLangKeyValueMap } from "./commonMethods";
import { useTranslation } from "react-i18next";
import { useFetchProjectCategorys } from "../queries/projectcategory_query";
import { toEthiopian } from "../utils/commonMethods";
export const getDepartmentType = (user) => {
	if (!user) return null;
	if (user?.usr_officer_id > 0) return "Expert";
	if (user?.usr_team_id > 0) return "Team Leader";
	if (user?.usr_directorate_id > 0) return "Director";
	if (user?.usr_department_id > 0) return "All Department";
	return null;
};

export const useUserExportColumns = () => {
	const { i18n, t } = useTranslation();

	const { data: sectorInformationData } = useFetchSectorInformations();

	const sectorInformationMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			sectorInformationData?.data || [],
			"sci_id",
			{
				en: "sci_name_en",
				am: "sci_name_am",
				or: "sci_name_or",
			},
			i18n.language
		);
	}, [sectorInformationData, i18n.language]);

	const userTypeMap = useMemo(() => {
		return {
			1: t("Governmental"),
			2: t("CSO"),
			4: t("CSO Director"),
			3: t("Citizenship"),
		};
	});

	const exportColumns = useMemo(
		() => [
			{
				key: "usr_full_name",
				label: t("usr_full_name"),
				format: (val) => (val ? val : "-"),
				width: 60,
			},
			{
				key: "usr_email",
				label: t("usr_email"),
				format: (val) => (val ? val : "-"),
				width: 40,
			},
			{
				key: "usr_phone_number",
				label: t("usr_phone_number"),
				format: (val) => (val ? String(val) : "-"),
			},
			{
				key: "usr_sector_id",
				label: t("usr_sector_id"),
				format: (val) => sectorInformationMap[val] ?? "-",
				width: 40,
			},
			{
				key: "dep_name",
				label: t("Department"),
				format: (_, row) => getDepartmentType(row) ?? "-",
			},
			{
				key: "usr_user_type",
				label: t("usr_user_type"),
				format: (val) => userTypeMap[val] ?? "-",
			},
		],
		[t, sectorInformationMap]
	);

	return exportColumns;
};

export const monitoringExportColumns = [
	{ key: "prj_name", label: "prj_name", width: 60 },
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

export const ProjectPlanExportColumns = [
	{ key: "pld_name", label: "pld_name" },
	{ key: "prj_name", label: "prj_name", width: 60 },
	{ key: "prj_code", label: "prj_code" },
	{ key: "pld_start_date_gc", label: "pld_start_date_gc" },
	{ key: "pld_end_date_gc", label: "pld_end_date_gc" },
];

export const citizenshipProjectExportColumns = [
	{
		key: "prj_name",
		label: "prj_name",
		width: 60,
	},
	{
		key: "prj_code",
		label: "prj_code",
		width: 40,
	},
	{
		key: "zone_name",
		label: "prj_owner_zone_id",
	},
	{
		key: "sector_name",
		label: "prj_sector_id",
		width: 40,
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
		key: "sector_name",
		label: "prj_sector_id",
		width: 40,
	},
	{
		key: "prj_name",
		label: "prj_name",
		width: 60,
	},
	{
		key: "prj_code",
		label: "prj_code",
		width: 40,
	},
	{
		key: "zone_name",
		label: "prj_owner_zone_id",
	},
	{
		key: "status_name",
		label: "prs_status",
	},
	{
		key: "prj_end_date_plan_gc",
		label: "prj_end_date_plan_gc",
		format: (val) => toEthiopian(val) || "-"
	},
	{
		key: "prj_total_estimate_budget",
		label: "prj_total_estimate_budget",
		format: (val) => (val != null ? parseFloat(val).toLocaleString() : "0"),
		type: "number",
		width: 30,
	},
];

export const useCsoProjectExportColumns = () => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	const {
		data: projectCategoryData,
		isLoading: isPctLoading,
		isError: isPctError,
	} = useFetchProjectCategorys();

	const projectCategoryMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			projectCategoryData?.data || [],
			"pct_id",
			{
				en: "pct_name_en",
				am: "pct_name_am",
				or: "pct_name_or",
			},
			lang
		);
	}, [projectCategoryData, lang]);

	const exportColumns = useMemo(
		() => [
			{
				key: "cso_name",
				label: t("cso_name"),
				width: 60,
				format: (val) => val || "-",
			},
			{
				key: "prj_name",
				label: t("prj_name"),
				width: 60,
				format: (val) => val || "-",
			},
			{
				key: "prj_code",
				label: t("prj_code"),
				width: 40,
				format: (val) => val || "-",
			},
			{
				key: "prj_project_category_id",
				label: t("prj_project_category_id"),
				format: (val) => projectCategoryMap[val] ?? "-",
				width: 50,
			},
			{
				key: "status_name",
				label: t("prs_status"),
				format: (val) => val || "-",
			},
			{
				key: "prj_total_estimate_budget",
				label: t("prj_total_estimate_budget"),
				format: (val) => (val != null ? parseFloat(val).toLocaleString() : "0"),
				type: "number",
				width: 30,
			},
		],
		[t, projectCategoryMap]
	);

	return exportColumns;
};

export const useCsoActivityExportColumns = () => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	const {
		data: projectCategoryData,
		isLoading: isPctLoading,
		isError: isPctError,
	} = useFetchProjectCategorys();

	const projectCategoryMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			projectCategoryData?.data || [],
			"pct_id",
			{
				en: "pct_name_en",
				am: "pct_name_am",
				or: "pct_name_or",
			},
			lang
		);
	}, [projectCategoryData, lang]);

	const exportColumns = useMemo(
		() => [
			{
				key: "prj_name",
				label: t("prj_name"),
				width: 60,
				format: (val) => val || "-",
			},
			{
				key: "prj_project_category_id",
				label: t("prj_project_category_id"),
				format: (val) => projectCategoryMap[val] ?? "-",
				width: 50,
			},
			{
				key: "prj_measurement_unit",
				label: t("prj_measurement_unit"),
				format: (val) => val || "-",
			},
			{
				key: "prj_measured_figure",
				label: t("prj_measured_figure"),
				format: (val) => val || "-",
			},
			{
				key: "prj_total_estimate_budget",
				label: t("prj_total_estimate_budget"),
				format: (val) => (val != null ? parseFloat(val).toLocaleString() : "0"),
				type: "number",
				width: 30,
			},
		],
		[t, projectCategoryMap]
	);

	return exportColumns;
};

export const budgetRequestExportColumns = [
	{ key: "bdy_name", label: "bdy_name" },
	{ key: "prj_name", label: "prj_name", width: 60 },
	{ key: "prj_code", label: "prj_code", width: 40 },
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
	{ key: "prj_name", label: "prj_name", width: 60 },
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
		width: 60,
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

export const usePerformanceExportColumns = () => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const { data: projectStatusData } = useFetchProjectStatuss();
	const projectStatusMap = useMemo(() => {
		return (
			projectStatusData?.data?.reduce((acc, project_status) => {
				acc[project_status.prs_id] =
					lang === "en"
						? project_status.prs_status_name_en
						: lang === "am"
							? project_status.prs_status_name_am
							: project_status.prs_status_name_or;
				return acc;
			}, {}) || {}
		);
	}, [projectStatusData, lang]);

	const exportColumns = useMemo(
		() => [
			{
				key: "prp_budget_year_id",
				label: "prp_budget_year_id",
				format: (val, row) => row.year_name || "-",
			},
			{ key: "prj_name", label: "prj_name", width: 60 },
			{ key: "prj_code", label: "prj_code" },
			{
				key: "prp_project_status_id",
				label: t("prp_project_status_id"),
				format: (val) => {
					return projectStatusMap[val] || "-";
				},
			},
			{ key: "prp_record_date_gc", label: "prp_record_date_gc" },

			// Quarter 1
			{
				key: "quarter_1",
				label: "Quarter 1",
				columns: [
					{
						key: "quarter_1_planned",
						label: "Planned",
						columns: [
							{
								key: "quarter_1_physical_planned",
								label: "Physical Planned",
								format: (_, row) =>
									sumMonthlyValues(
										row,
										[11, 12, 1],
										"prp_pyhsical_planned_month_"
									),
							},
							{
								key: "quarter_1_financial_planned",
								label: "Financial Planned",
								format: (_, row) =>
									sumMonthlyValues(
										row,
										[11, 12, 1],
										"prp_finan_planned_month_"
									),
							},
						],
					},
					{
						key: "quarter_1_actual",
						label: "Actual",
						columns: [
							{
								key: "quarter_1_physical_actual",
								label: "Physical Actual",
								format: (_, row) =>
									sumMonthlyValues(
										row,
										[11, 12, 1],
										"prp_pyhsical_actual_month_"
									),
							},
							{
								key: "quarter_1_financial_actual",
								label: "Financial Actual",
								format: (_, row) =>
									sumMonthlyValues(row, [11, 12, 1], "prp_finan_actual_month_"),
							},
						],
					},
				],
			},

			// Quarter 2
			{
				key: "quarter_2",
				label: "Quarter 2",
				columns: [
					{
						key: "quarter_2_planned",
						label: "Planned",
						columns: [
							{
								key: "quarter_2_physical_planned",
								label: "Physical Planned",
								format: (_, row) =>
									sumMonthlyValues(
										row,
										[2, 3, 4],
										"prp_pyhsical_planned_month_"
									),
							},
							{
								key: "quarter_2_financial_planned",
								label: "Financial Planned",
								format: (_, row) =>
									sumMonthlyValues(row, [2, 3, 4], "prp_finan_planned_month_"),
							},
						],
					},
					{
						key: "quarter_2_actual",
						label: "Actual",
						columns: [
							{
								key: "quarter_2_physical_actual",
								label: "Physical Actual",
								format: (_, row) =>
									sumMonthlyValues(
										row,
										[2, 3, 4],
										"prp_pyhsical_actual_month_"
									),
							},
							{
								key: "quarter_2_financial_actual",
								label: "Financial Actual",
								format: (_, row) =>
									sumMonthlyValues(row, [2, 3, 4], "prp_finan_actual_month_"),
							},
						],
					},
				],
			},

			// Quarter 3
			{
				key: "quarter_3",
				label: "Quarter 3",
				columns: [
					{
						key: "quarter_3_planned",
						label: "Planned",
						columns: [
							{
								key: "quarter_3_physical_planned",
								label: "Physical Planned",
								format: (_, row) =>
									sumMonthlyValues(
										row,
										[5, 6, 7],
										"prp_pyhsical_planned_month_"
									),
							},
							{
								key: "quarter_3_financial_planned",
								label: "Financial Planned",
								format: (_, row) =>
									sumMonthlyValues(row, [5, 6, 7], "prp_finan_planned_month_"),
							},
						],
					},
					{
						key: "quarter_3_actual",
						label: "Actual",
						columns: [
							{
								key: "quarter_3_physical_actual",
								label: "Physical Actual",
								format: (_, row) =>
									sumMonthlyValues(
										row,
										[5, 6, 7],
										"prp_pyhsical_actual_month_"
									),
							},
							{
								key: "quarter_3_financial_actual",
								label: "Financial Actual",
								format: (_, row) =>
									sumMonthlyValues(row, [5, 6, 7], "prp_finan_actual_month_"),
							},
						],
					},
				],
			},

			// Quarter 4
			{
				key: "quarter_4",
				label: "Quarter 4",
				columns: [
					{
						key: "quarter_4_planned",
						label: "Planned",
						columns: [
							{
								key: "quarter_4_physical_planned",
								label: "Physical Planned",
								format: (_, row) =>
									sumMonthlyValues(
										row,
										[8, 9, 10],
										"prp_pyhsical_planned_month_"
									),
							},
							{
								key: "quarter_4_financial_planned",
								label: "Financial Planned",
								format: (_, row) =>
									sumMonthlyValues(row, [8, 9, 10], "prp_finan_planned_month_"),
							},
						],
					},
					{
						key: "quarter_4_actual",
						label: "Actual",
						columns: [
							{
								key: "quarter_4_physical_actual",
								label: "Physical Actual",
								format: (_, row) =>
									sumMonthlyValues(
										row,
										[8, 9, 10],
										"prp_pyhsical_actual_month_"
									),
							},
							{
								key: "quarter_4_financial_actual",
								label: "Financial Actual",
								format: (_, row) =>
									sumMonthlyValues(row, [8, 9, 10], "prp_finan_actual_month_"),
							},
						],
					},
				],
			},

			// Baseline and Summary Information
			{
				key: "baseline_summary",
				label: "Baseline & Summary",
				columns: [
					{
						key: "baseline",
						label: "Baseline",
						columns: [
							{
								key: "prp_budget_baseline",
								label: "Budget Baseline",
								format: (val) => (val ? Number(val).toLocaleString() : "-"),
							},
							{
								key: "prp_physical_baseline",
								label: "Physical Baseline",
								format: (val) => (val ? Number(val).toLocaleString() : "-"),
							},
						],
					},
					{
						key: "performance_summary",
						label: "Performance Summary",
						columns: [
							{
								key: "prp_total_budget_used",
								label: "Total Budget Used",
								format: (val) => (val ? val.toFixed(2) : "0.00"),
							},
							{
								key: "prp_physical_performance",
								label: "Physical Performance",
							},
						],
					},
				],
			},
		],
		[t, projectStatusMap]
	);

	return exportColumns;
};

// Helper function to sum monthly values for quarters
function sumMonthlyValues(row, months, prefix) {
	const sum = months.reduce((total, month) => {
		const value = Number(row[`${prefix}${month}`]) || 0;
		return total + value;
	}, 0);
	return sum ? sum.toLocaleString() : "-";
}

export const projectBudgetExpenditureExportColumns = [
	{ key: "prj_name", label: "prj_name", width: 60 },
	{ key: "prj_code", label: "prj_code" },
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

export const projectEmployeeExportColumns = [
	{ key: "prj_name", label: "prj_name", width: 60 },
	{ key: "prj_code", label: "prj_code" },
	{ key: "emp_id_no", label: "emp_id_no" },
	{ key: "emp_full_name", label: "emp_full_name" },
	{ key: "emp_email", label: "emp_email" },
	{ key: "emp_phone_num", label: "emp_phone_num" },
	{ key: "emp_role", label: "emp_role" },
	{ key: "emp_start_date_gc", label: "emp_start_date_gc" },
];

export const projectContractorExportColumns = [
	{ key: "prj_name", label: "prj_name", width: 60 },
	// prj_code is hidden in the original, so we exclude it from exports too
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

export const projectBudgetPlanExportColumns = [
	{ key: "prj_name", label: "prj_name", width: 60 },
	{ key: "prj_code", label: "prj_code" },
	{ key: "bpl_budget_year", label: "bpl_budget_year" },
	{ key: "bpl_budget_code", label: "bpl_budget_code" },
	{
		key: "bpl_amount",
		label: "bpl_amount",
		type: "number",
		format: (val) => (val ? Number(val).toLocaleString() : "-"),
	},
];

export const projectStakeholderExportColumns = [
	{ key: "prj_name", label: "prj_name", width: 60 },
	{ key: "prj_code", label: "prj_code" },
	{ key: "psh_name", label: "psh_name" },
	{ key: "psh_stakeholder_type", label: "psh_stakeholder_type" },
	{ key: "psh_representative_name", label: "psh_representative_name" },
	{ key: "psh_representative_phone", label: "psh_representative_phone" },
	{ key: "psh_role", label: "psh_role" },
];

export const projectHandoverExportColumns = [
	{ key: "prj_name", label: "prj_name", width: 60 },
	{ key: "prj_code", label: "prj_code" },
	{ key: "prh_handover_date_gc", label: "prh_handover_date_gc" },
];

export const procurementExportColumns = [
	{ key: "prj_name", label: "prj_name", width: 60 },
	{ key: "prj_code", label: "prj_code" },
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

export const useCsoExportColumns = () => {
	const { t } = useTranslation();

	const csoTypes = useMemo(
		() => [
			{ value: 1, label: t("Local") },
			{ value: 2, label: t("International") },
		],
		[t]
	);

	const csoTypesMap = useMemo(
		() =>
			Object.fromEntries(csoTypes.map(({ value, label }) => [value, label])),
		[csoTypes]
	);

	const exportColumns = useMemo(
		() => [
			{
				key: "cso_name",
				label: t("cso_name"),
				format: (val) => val || "-",
				width: 60,
			},
			{
				key: "cso_type",
				label: t("cso_type"),
				format: (val) => csoTypesMap[val] ?? "-",
				width: 20,
			},
			{
				key: "cso_contact_person",
				label: t("cso_contact_person"),
				format: (val) => val || "-",
				width: 20,
			},
			{
				key: "cso_code",
				label: t("cso_code"),
				format: (val) => val || "-",
			},
			// {
			// 	key: "cso_address",
			// 	label: t("cso_address"),
			// 	format: (val) => val || "-",
			// },
			{
				key: "cso_phone",
				label: t("cso_phone"),
				format: (val) => val || "-",
			},
			{
				key: "cso_email",
				label: t("cso_email"),
				format: (val) => val || "-",
			},
			{
				key: "cso_status",
				label: t("cso_status"),
				format: (val) => (val === 1 ? t("Approved") : t("Requested")),
			},
		],
		[t, csoTypesMap]
	);

	return exportColumns;
};

export const programExportColumns = [
	{
		key: "pri_id",
		label: "pri_id",
		format: (val) => val || "-",
	},
	{
		key: "pri_name_or",
		label: "pri_name_or",
		format: (val) => val || "-",
	},
	{
		key: "pri_name_or",
		label: "pri_name_or",
		format: (val) => val || "-",
	},
	{
		key: "pri_name_am",
		label: "pri_name_am",
		format: (val) => val || "-",
	},
	{
		key: "pri_name_en",
		label: "pri_name_en",
		format: (val) => val || "-",
	},
	{
		key: "pri_program_code",
		label: "pri_program_code",
		format: (val) => val || "-",
	},
];
