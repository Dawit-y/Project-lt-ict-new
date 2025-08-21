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
