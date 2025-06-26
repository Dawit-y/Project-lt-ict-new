// export columns for lookups
export const monitoringEvaluationTypeExportColumns = [
  { key: "met_name_or", label: "met_name_or" },
  { key: "met_name_am", label: "met_name_am" },
  { key: "met_name_en", label: "met_name_en" },
  { key: "met_code", label: "met_code" },
  {
    key: "met_status",
    label: "Status",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
  {
    key: "met_gov_active",
    label: "met_gov_active",
    type: "boolean",
    format: (val) => (val ? "Yes" : "No"),
  },
  {
    key: "met_cso_active",
    label: "met_cso_active",
    type: "boolean",
    format: (val) => (val ? "Yes" : "No"),
  },
  {
    key: "met_monitoring_active",
    label: "met_monitoring_active",
    type: "boolean",
    format: (val) => (val ? "Yes" : "No"),
  },
  {
    key: "met_evaluation_active",
    label: "met_evaluation_active",
    type: "boolean",
    format: (val) => (val ? "Yes" : "No"),
  },
];

export const kpiExportColumns = [
  { key: "kpi_name_or", label: "kpi_name_or" },
  { key: "kpi_name_am", label: "kpi_name_am" },
  { key: "kpi_name_en", label: "kpi_name_en" },
  { key: "kpi_unit_measurement", label: "kpi_unit_measurement" },
  { key: "kpi_description", label: "kpi_description" },
  {
    key: "kpi_status",
    label: "kpi_status",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const budgetYearExportColumns = [
  { key: "bdy_name", label: "bdy_name" },
  { key: "bdy_code", label: "bdy_code" },
  {
    key: "bdy_status",
    label: "bdy_status",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const procurementStageExportColumns = [
  { key: "pst_name_or", label: "pst_name_or" },
  { key: "pst_name_en", label: "pst_name_en" },
  { key: "pst_name_am", label: "pst_name_am" },
  { key: "pst_description", label: "pst_description" },
  {
    key: "pst_status",
    label: "pst_status",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const procurementMethodExportColumns = [
  { key: "prm_name_or", label: "prm_name_or" },
  { key: "prm_name_en", label: "prm_name_en" },
  { key: "prm_name_am", label: "prm_name_am" },
  { key: "prm_description", label: "prm_description" },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const budgetSourceExportColumns = [
  { key: "pbs_name_or", label: "pbs_name_or" },
  { key: "pbs_name_am", label: "pbs_name_am" },
  { key: "pbs_name_en", label: "pbs_name_en" },
  { key: "pbs_code", label: "pbs_code" },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const projectCategoryExportColumns = [
  { key: "pct_name_or", label: "pct_name_or" },
  { key: "pct_name_am", label: "pct_name_am" },
  { key: "pct_name_en", label: "pct_name_en" },
  { key: "pct_code", label: "pct_code" },
  {
    key: "pct_owner_type_id",
    label: "pct_owner_type_id",
    format: (val) => {
      if (val === 1) return "Gov";
      if (val === 2) return "CSO";
      if (val === 3) return "Citizenship";
      return "-";
    },
  },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const documentTypeExportColumns = [
  { key: "pdt_doc_name_or", label: "pdt_doc_name_or" },
  { key: "pdt_doc_name_am", label: "pdt_doc_name_am" },
  { key: "pdt_doc_name_en", label: "pdt_doc_name_en" },
  { key: "pdt_code", label: "pdt_code" },
  { key: "pdt_description", label: "pdt_description" },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const sectorInformationExportColumns = [
  { key: "sci_name_or", label: "sci_name_or" },
  { key: "sci_name_am", label: "sci_name_am" },
  { key: "sci_name_en", label: "sci_name_en" },
  { key: "sci_code", label: "sci_code" },
  {
    key: "sci_available_at_region",
    label: "sci_available_at_region",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
  {
    key: "sci_available_at_zone",
    label: "sci_available_at_zone",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
  {
    key: "sci_available_at_woreda",
    label: "sci_available_at_woreda",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const contractTerminationReasonExportColumns = [
  { key: "ctr_reason_name_or", label: "ctr_reason_name_or" },
  { key: "ctr_reason_name_am", label: "ctr_reason_name_am" },
  { key: "ctr_reason_name_en", label: "ctr_reason_name_en" },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const projectStatusExportColumns = [
  { key: "prs_status_name_or", label: "prs_status_name_or" },
  { key: "prs_status_name_am", label: "prs_status_name_am" },
  { key: "prs_status_name_en", label: "prs_status_name_en" },

  { key: "prs_order_number", label: "prs_order_number" },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const contractorTypeExportColumns = [
  { key: "cnt_type_name_or", label: "cnt_type_name_or" },
  { key: "cnt_type_name_am", label: "cnt_type_name_am" },
  { key: "cnt_type_name_en", label: "cnt_type_name_en" },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const sectorCategoryExportColumns = [
  { key: "psc_name", label: "psc_name" },
  { key: "psc_code", label: "psc_code" },
  {
    key: "psc_gov_active",
    label: "psc_gov_active",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
  {
    key: "psc_cso_active",
    label: "psc_cso_active",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
  {
    key: "psc_citizenship_active",
    label: "psc_citizenship_active",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const stakeholderTypeExportColumns = [
  { key: "sht_type_name_or", label: "sht_type_name_or" },
  { key: "sht_type_name_am", label: "sht_type_name_am" },
  { key: "sht_type_name_en", label: "sht_type_name_en" },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const expenditureCodeExportColumns = [
  { key: "pec_name", label: "pec_name" },
  { key: "pec_code", label: "pec_code" },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const budgetMonthExportColumns = [
  { key: "bdm_month", label: "bdm_month" },
  { key: "bdm_name_or", label: "bdm_name_or" },
  { key: "bdm_name_am", label: "bdm_name_am" },
  { key: "bdm_name_en", label: "bdm_name_en" },
  { key: "bdm_code", label: "bdm_code" },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const paymentCategoryExportColumns = [
  { key: "pyc_name_or", label: "pyc_name_or" },
  { key: "pyc_name_am", label: "pyc_name_am" },
  { key: "pyc_name_en", label: "pyc_name_en" },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const requestStatusExportColumns = [
  { key: "rqs_name_or", label: "rqs_name_or" },
  { key: "rqs_name_am", label: "rqs_name_am" },
  { key: "rqs_name_en", label: "rqs_name_en" },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];

export const requestCategoryExportColumns = [
  { key: "rqc_name_or", label: "rqc_name_or" },
  { key: "rqc_name_am", label: "rqc_name_am" },
  { key: "rqc_name_en", label: "rqc_name_en" },
  {
    key: "rqc_gov_active",
    label: "rqc_gov_active",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
  {
    key: "rqc_cso_active",
    label: "rqc_cso_active",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
  {
    key: "is_inactive",
    label: "is_inactive",
    format: (val) => (val === 1 ? "Yes" : "No"),
  },
];
