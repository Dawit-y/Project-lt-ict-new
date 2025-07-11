import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchProjectPerformances,
  useAddProjectPerformance,
  useDeleteProjectPerformance,
  useUpdateProjectPerformance,
} from "../../queries/projectperformance_query";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";
import { usePopulateBudgetYears } from "../../queries/budgetyear_query";
import { useFetchBudgetMonths } from "../../queries/budgetmonth_query";
import ProjectPerformanceModal from "./ProjectPerformanceModal";
import { useTranslation } from "react-i18next";
import {
  Button,
  Col,
  Row,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Label,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardHeader,
  Badge,
} from "reactstrap";
import { PAGE_ID } from "../../constants/constantFile";
import { formattedAmountValidation } from "../../utils/Validation/validation";
import { toast } from "react-toastify";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import { convertToNumericValue } from "../../utils/commonMethods";
const AttachFileModal = lazy(() =>
  import("../../components/Common/AttachFileModal")
);
const ConvInfoModal = lazy(() =>
  import("../../pages/Conversationinformation/ConvInfoModal")
);

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const LazyLoader = ({ children }) => (
  <Suspense fallback={<Spinner color="primary" />}>{children}</Suspense>
);

const ProjectPerformanceModel = (props) => {
  document.title = "Project Performance";
  const { passedId, isActive, startDate, totalActualBudget } = props;
  const param = {
    prp_project_id: passedId,
    request_type: "single",
    prj_total_actual_budget: totalActualBudget,
  };
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // State management
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [entryMode, setEntryMode] = useState("planned"); // 'planned' or 'actual'
  const [isEdit, setIsEdit] = useState(false);
  const [projectPerformance, setProjectPerformance] = useState(null);
  const [transaction, setTransaction] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Quarter1");
  const [selectedYear, setSelectedYear] = useState("");
  const [fileModal, setFileModal] = useState(false);
  const [convModal, setConvModal] = useState(false);

  // Default values for hidden fields

  const DEFAULT_MONTH = 1; // January as default
  const DEFAULT_PHYSICAL_PERFORMANCE = 0;
  const DEFAULT_PHYSICAL_PLANNED = 0;
  const DEFAULT_REGION_PHYSICAL = 0;
  const DEFAULT_TOTAL_BUDGET_USED = 0;
  const DEFAULT_BUDGET_PLANNED = 0;
  const DEFAULT_REGION_BUDGET = 0;

  // Data fetching
  const { data, isLoading, isFetching, error, isError, refetch } =
    useFetchProjectPerformances(param, isActive);
  const addProjectPerformance = useAddProjectPerformance();
  const updateProjectPerformance = useUpdateProjectPerformance();
  const deleteProjectPerformance = useDeleteProjectPerformance();
  const { data: bgYearsOptionsData } = usePopulateBudgetYears();
  const { data: budgetMonthData } = useFetchBudgetMonths();
  const { data: projectStatusData } = useFetchProjectStatuss();

  const toggleFileModal = () => setFileModal(!fileModal);
  const toggleConvModal = () => setConvModal(!convModal);

  // Mappings
  const budgetYearMap = useMemo(() => {
    return (
      bgYearsOptionsData?.data?.reduce((acc, year) => {
        acc[year.bdy_id] = year.bdy_name;
        return acc;
      }, {}) || {}
    );
  }, [bgYearsOptionsData]);

  const budgetMonthMap = useMemo(() => {
    return (
      budgetMonthData?.data?.reduce((acc, month) => {
        acc[month.bdm_id] = month.bdm_month;
        return acc;
      }, {}) || {}
    );
  }, [budgetMonthData]);

  const projectStatusMap = useMemo(() => {
    return (
      projectStatusData?.data?.reduce((acc, status) => {
        acc[status.prs_id] =
          lang === "en"
            ? status.prs_status_name_en
            : lang === "am"
              ? status.prs_status_name_am
              : status.prs_status_name_or;
        return acc;
      }, {}) || {}
    );
  }, [projectStatusData, lang]);

  const isPlanned = entryMode === "planned";
  const isActual = entryMode === "actual";

  const validateUniqueYear = (yearId) => {
    if (!yearId) return true; // Skip if no year selected

    // Ensure we have data and it's an array
    if (!data?.data || !Array.isArray(data.data)) return true;

    // Convert yearId to number for consistent comparison
    const numericYearId = Number(yearId);

    // Check if this year already exists in the data
    const existingEntries = data.data.filter(
      (item) => Number(item.prp_budget_year_id) === numericYearId
    );

    // If editing, we should have exactly 0 or 1 matching entries (the current one)
    if (isEdit && projectPerformance) {
      const currentEntryYear = Number(projectPerformance.prp_budget_year_id);
      if (currentEntryYear === numericYearId) {
        // If editing the same year, it's valid
        return existingEntries.length <= 1;
      }
      // If changing to a different year, check if it exists
      return existingEntries.length === 0;
    }

    // For new entries, just check if the year exists
    return existingEntries.length === 0;
  };

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      prp_project_id: passedId,
      prj_total_actual_budget: totalActualBudget,
      prp_project_status_id: projectPerformance?.prp_project_status_id || "1",
      prp_budget_year_id: projectPerformance?.prp_budget_year_id || "",
      prp_budget_month_id:
        projectPerformance?.prp_budget_month_id || DEFAULT_MONTH,

      is_new_actual_entry:
        projectPerformance?.prp_record_date_gc &&
        projectPerformance.prp_record_date_gc !==
        new Date().toISOString().split("T")[0],
      prp_record_date_gc:
        projectPerformance?.prp_record_date_gc ||
        new Date().toISOString().split("T")[0],

      prp_description: projectPerformance?.prp_description || "",
      prp_physical_performance:
        projectPerformance?.prp_physical_performance ||
        DEFAULT_PHYSICAL_PERFORMANCE,
      prp_quarter_id: projectPerformance?.prp_quarter_id || "1",
      // Monthly values
      ...Array.from({ length: 12 }, (_, i) => ({
        [`prp_pyhsical_planned_month_${i + 1}`]: projectPerformance?.[
          `prp_pyhsical_planned_month_${i + 1}`
        ]
          ? Number(
            projectPerformance[`prp_pyhsical_planned_month_${i + 1}`]
          ).toLocaleString()
          : "0",
        [`prp_pyhsical_actual_month_${i + 1}`]: projectPerformance?.[
          `prp_pyhsical_actual_month_${i + 1}`
        ]
          ? Number(
            projectPerformance[`prp_pyhsical_actual_month_${i + 1}`]
          ).toLocaleString()
          : "0",
        [`prp_finan_planned_month_${i + 1}`]: projectPerformance?.[
          `prp_finan_planned_month_${i + 1}`
        ]
          ? Number(
            projectPerformance[`prp_finan_planned_month_${i + 1}`]
          ).toLocaleString()
          : "0",
        [`prp_finan_actual_month_${i + 1}`]: projectPerformance?.[
          `prp_finan_actual_month_${i + 1}`
        ]
          ? Number(
            projectPerformance[`prp_finan_actual_month_${i + 1}`]
          ).toLocaleString()
          : "0",
        [`prp_status_month_${i + 1}`]:
          projectPerformance?.[`prp_status_month_${i + 1}`] || "",
      })).reduce((acc, curr) => ({ ...acc, ...curr })),
      // Summary fields
      prp_physical_planned: projectPerformance?.prp_physical_planned
        ? Number(projectPerformance.prp_physical_planned).toLocaleString()
        : DEFAULT_PHYSICAL_PLANNED.toString(),
      prp_budget_planned: projectPerformance?.prp_budget_planned
        ? Number(projectPerformance.prp_budget_planned).toLocaleString()
        : DEFAULT_BUDGET_PLANNED.toString(),
      prp_budget_by_region: projectPerformance?.prp_budget_by_region
        ? Number(projectPerformance.prp_budget_by_region).toLocaleString()
        : DEFAULT_REGION_BUDGET.toString(),
      prp_physical_by_region: projectPerformance?.prp_physical_by_region
        ? Number(projectPerformance.prp_physical_by_region).toLocaleString()
        : DEFAULT_REGION_PHYSICAL.toString(),
      prp_budget_baseline: projectPerformance?.prp_budget_baseline
        ? Number(projectPerformance.prp_budget_baseline).toLocaleString()
        : "0",
      prp_physical_baseline: projectPerformance?.prp_physical_baseline
        ? Number(projectPerformance.prp_physical_baseline).toLocaleString()
        : "0",
      prp_total_budget_used: projectPerformance?.prp_total_budget_used
        ? Number(projectPerformance.prp_total_budget_used).toLocaleString()
        : DEFAULT_TOTAL_BUDGET_USED.toString(),
    },

    validationSchema: Yup.object().shape({
      ...Array.from({ length: 12 }, (_, i) => ({
        [`prp_pyhsical_planned_month_${i + 1}`]: isPlanned
          ? formattedAmountValidation(0, 100, true)
          : Yup.string().notRequired(),
        [`prp_pyhsical_actual_month_${i + 1}`]: isActual
          ? formattedAmountValidation(0, 100, true)
          : Yup.string().notRequired(),
        [`prp_finan_planned_month_${i + 1}`]: isPlanned
          ? formattedAmountValidation(0, 10000000000, true)
          : Yup.string().notRequired(),
        [`prp_finan_actual_month_${i + 1}`]: isActual
          ? formattedAmountValidation(0, 10000000000, true)
          : Yup.string().notRequired(),
        [`prp_status_month_${i + 1}`]: isActual
          ? Yup.number().test(
            "status-validation",
            t(
              'Status is required when actual values are entered & Only "New" or "No" status is allowed when both actuals are 0'
            ),
            function (value) {
              const physicalActual = convertToNumericValue(
                this.parent[`prp_pyhsical_actual_month_${i + 1}`] || "0"
              );
              const financialActual = convertToNumericValue(
                this.parent[`prp_finan_actual_month_${i + 1}`] || "0"
              );

              if (physicalActual === 0 && financialActual === 0) {
                return !value || value === 5;
              }
              return !!value;
            }
          )
          : Yup.number().notRequired(),
      })).reduce((acc, curr) => ({ ...acc, ...curr })),

      // Physical Baseline validation
      prp_physical_baseline: Yup.string().test(
        "physical-baseline-range",
        t("Physical baseline must be between 0 and 100"),
        function (value) {
          const numValue = convertToNumericValue(value || "0");
          return numValue >= 0 && numValue <= 100;
        }
      ),

      // Budget Baseline validation
      prp_budget_baseline: Yup.string().test(
        "budget-baseline-range",
        t("Budget baseline must be a positive number"),
        function (value) {
          const numValue = convertToNumericValue(value || "0");
          return numValue >= 0;
        }
      ),

      // Add new form-level validation fields for the sums
      _sumPhysicalPlanned: Yup.string().when([], {
        is: () => isPlanned,
        then: () =>
          Yup.string().test("sum-physical-planned", function () {
            const sum = Array.from({ length: 12 }, (_, i) =>
              convertToNumericValue(
                this.parent[`prp_pyhsical_planned_month_${i + 1}`] || "0"
              )
            ).reduce((a, b) => a + b, 0);

            if (sum > 100) {
              return this.createError({
                message: t(
                  `Sum of physical planned values (${sum}%) exceeds 100%`
                ),
              });
            }
            return true;
          }),
      }),

      _sumFinancialPlanned: Yup.string().when([], {
        is: () => isPlanned,
        then: () =>
          Yup.string().test("sum-financial-planned", function () {
            const sum = Array.from({ length: 12 }, (_, i) =>
              convertToNumericValue(
                this.parent[`prp_finan_planned_month_${i + 1}`] || "0"
              )
            ).reduce((a, b) => a + b, 0);
            const totalBudget = convertToNumericValue(totalActualBudget || "0");
            console.log("amount " + totalBudget);
            if (totalBudget <= 0) {
              return this.createError({
                message: t("Total project budget is not available or invalid"),
              });
            }

            if (sum > totalBudget) {
              return this.createError({
                message: t(
                  `Sum of financial planned values (${sum.toLocaleString()}) exceeds total project budget (${totalBudget.toLocaleString()})`
                ),
              });
            }
            return true;
          }),
      }),

      _sumPhysicalActual: Yup.string().when([], {
        is: () => isActual,
        then: () =>
          Yup.string().test("sum-physical-actual", function () {
            const sum = Array.from({ length: 12 }, (_, i) =>
              convertToNumericValue(
                this.parent[`prp_pyhsical_actual_month_${i + 1}`] || "0"
              )
            ).reduce((a, b) => a + b, 0);

            if (sum > 100) {
              return this.createError({
                message: t(
                  `Sum of physical actual values (${sum}%) exceeds 100%`
                ),
              });
            }
            return true;
          }),
      }),

      prp_description: Yup.string().notRequired(),

      prp_budget_year_id: Yup.number()
        .required(t("Year is required"))
        .test(
          "unique-year",
          t("This year already has an entry. Please select a different year."),
          function (value) {
            return validateUniqueYear(value);
          }
        ),

      is_new_actual_entry: Yup.boolean(),

      prp_record_date_gc: Yup.date()
        .when("is_new_actual_entry", {
          is: true,
          then: (schema) =>
            schema
              .required(t("Entry date is required for new actual entries"))
              .max(new Date(), t("Entry date cannot be in the future")),
          otherwise: (schema) => schema.notRequired(),
        })
        .nullable(),
    }),

    validateOnBlur: true,
    validateOnChange: false,

    onSubmit: (values) => {
      const payload = {
        prp_project_id: passedId,
        prj_total_actual_budget: totalActualBudget,
        prp_project_status_id: "1",
        prp_budget_year_id: values.prp_budget_year_id,
        prp_budget_month_id: DEFAULT_MONTH,

        prp_record_date_gc: values.is_new_actual_entry
          ? values.prp_record_date_gc
          : new Date().toISOString().split("T")[0],

        prp_description: values.prp_description || null,
        prp_physical_performance: DEFAULT_PHYSICAL_PERFORMANCE,
        prp_quarter_id: values.prp_quarter_id,
        // Summary fields with default values
        prp_physical_planned: DEFAULT_PHYSICAL_PLANNED,
        prp_budget_planned: DEFAULT_BUDGET_PLANNED,
        prp_budget_by_region: DEFAULT_REGION_BUDGET,
        prp_physical_by_region: DEFAULT_REGION_PHYSICAL,
        prp_budget_baseline: convertToNumericValue(values.prp_budget_baseline),
        prp_physical_baseline: convertToNumericValue(
          values.prp_physical_baseline
        ),
        prp_total_budget_used: DEFAULT_TOTAL_BUDGET_USED,
      };

      // Add monthly values
      for (let i = 1; i <= 12; i++) {
        // Physical and financial values
        payload[`prp_pyhsical_planned_month_${i}`] = convertToNumericValue(
          values[`prp_pyhsical_planned_month_${i}`] || "0"
        );
        payload[`prp_pyhsical_actual_month_${i}`] = convertToNumericValue(
          values[`prp_pyhsical_actual_month_${i}`] || "0"
        );
        payload[`prp_finan_planned_month_${i}`] = convertToNumericValue(
          values[`prp_finan_planned_month_${i}`] || "0"
        );
        payload[`prp_finan_actual_month_${i}`] = convertToNumericValue(
          values[`prp_finan_actual_month_${i}`] || "0"
        );
        // Status values - use project status for all months when in planned mode
        if (
          entryMode === "actual" &&
          values[`prp_status_month_${i}`] !== undefined
        ) {
          payload[`prp_status_month_${i}`] = values[`prp_status_month_${i}`];
        }
      }

      if (isEdit && projectPerformance?.prp_id) {
        payload.prp_id = projectPerformance.prp_id;
      }

      if (isEdit) {
        handleUpdateProjectPerformance(payload);
      } else {
        handleAddProjectPerformance(payload);
      }
    },
  });

  // Handle year change to filter months
  const handleYearChange = (e) => {
    const yearId = e.target.value;
    setSelectedYear(yearId);
    validation.setFieldValue("prp_budget_year_id", yearId);
  };
  // CRUD Operations
  const handleAddProjectPerformance = async (data) => {
    try {
      await addProjectPerformance.mutateAsync(data);
      toast.success(t("add_success"), { autoClose: 2000 });
      validation.resetForm();
    } catch (error) {
      toast.error(t("add_failure"), { autoClose: 2000 });
    }
    toggle();
  };

  const handleUpdateProjectPerformance = async (data) => {
    try {
      await updateProjectPerformance.mutateAsync(data);
      toast.success(t("update_success"), { autoClose: 2000 });
      validation.resetForm();
    } catch (error) {
      toast.error(t("update_failure"), { autoClose: 2000 });
    }
    toggle();
  };

  const handleDeleteProjectPerformance = async () => {
    if (projectPerformance?.prp_id) {
      try {
        await deleteProjectPerformance.mutateAsync(projectPerformance.prp_id);
        toast.success(t("delete_success"), { autoClose: 2000 });
      } catch (error) {
        toast.error(t("delete_failure"), { autoClose: 2000 });
      }
      setDeleteModal(false);
    }
  };
  const onClickDelete = (result) => {
    setProjectPerformance(result);
    setDeleteModal(true);
  };

  // UI Handlers
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectPerformance(null);
      setEntryMode("planned");
      setSelectedYear("");
    } else {
      setModal(true);
    }
  };

  const toggleViewModal = () => setModal1(!modal1);

  const handleEditPlanned = (data) => {
    setProjectPerformance(data);
    setEntryMode("planned");
    setSelectedYear(data.prp_budget_year_id);
    populateForm(data);
    setIsEdit(true);
    toggle();
  };

  const handleAddActuals = (data) => {
    setProjectPerformance(data);
    setEntryMode("actual");
    setSelectedYear(data.prp_budget_year_id);
    populateForm(data);
    setIsEdit(true);
    toggle();
  };

  const handleAddNew = () => {
    setProjectPerformance(null);
    setEntryMode("planned");
    setSelectedYear("");
    setIsEdit(false);
    toggle();
  };

  const populateForm = (data) => {
    const hasCustomDate =
      data.prp_record_date_gc &&
      data.prp_record_date_gc !== new Date().toISOString().split("T")[0];
    const values = {
      prp_project_id: passedId,
      prj_total_actual_budget: totalActualBudget,
      prp_project_status_id: "1",
      prp_budget_year_id: data.prp_budget_year_id,
      prp_budget_month_id: DEFAULT_MONTH,

      is_new_actual_entry: hasCustomDate,
      prp_record_date_gc:
        data.prp_record_date_gc || new Date().toISOString().split("T")[0],

      prp_description: data.prp_description,
      prp_physical_performance: DEFAULT_PHYSICAL_PERFORMANCE,
      prp_quarter_id: data.prp_quarter_id,
      // Monthly values
      ...Array.from({ length: 12 }, (_, i) => ({
        [`prp_pyhsical_planned_month_${i + 1}`]: data[
          `prp_pyhsical_planned_month_${i + 1}`
        ]
          ? Number(data[`prp_pyhsical_planned_month_${i + 1}`]).toLocaleString()
          : "0",
        [`prp_pyhsical_actual_month_${i + 1}`]: data[
          `prp_pyhsical_actual_month_${i + 1}`
        ]
          ? Number(data[`prp_pyhsical_actual_month_${i + 1}`]).toLocaleString()
          : "0",
        [`prp_finan_planned_month_${i + 1}`]: data[
          `prp_finan_planned_month_${i + 1}`
        ]
          ? Number(data[`prp_finan_planned_month_${i + 1}`]).toLocaleString()
          : "0",
        [`prp_finan_actual_month_${i + 1}`]: data[
          `prp_finan_actual_month_${i + 1}`
        ]
          ? Number(data[`prp_finan_actual_month_${i + 1}`]).toLocaleString()
          : "0",
        [`prp_status_month_${i + 1}`]: data[`prp_status_month_${i + 1}`] || "",
      })).reduce((acc, curr) => ({ ...acc, ...curr })),
      // Summary fields
      prp_physical_planned: DEFAULT_PHYSICAL_PLANNED.toString(),
      prp_budget_planned: DEFAULT_BUDGET_PLANNED.toString(),
      prp_budget_by_region: DEFAULT_REGION_BUDGET.toString(),
      prp_physical_by_region: DEFAULT_REGION_PHYSICAL.toString(),
      prp_budget_baseline: data.prp_budget_baseline
        ? Number(data.prp_budget_baseline).toLocaleString()
        : "0",
      prp_physical_baseline: data.prp_physical_baseline
        ? Number(data.prp_physical_baseline).toLocaleString()
        : "0",
      prp_total_budget_used: DEFAULT_TOTAL_BUDGET_USED.toString(),
    };
    validation.setValues(values);
  };

  // Columns configuration - Simplified to show only relevant fields

  const columns = useMemo(() => {
    // Define the month groupings for each quarter
    const quarterDefinitions = [
      [11, 12, 1], // Q1
      [2, 3, 4], // Q2
      [5, 6, 7], // Q3
      [8, 9, 10], // Q4
    ];

    const baseColumns = [
      {
        header: t("prp_budget_year"),
        accessorKey: "prp_budget_year_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) =>
          budgetYearMap[cellProps.row.original.prp_budget_year_id] || "-",
      },
      {
        header: t("prp_record_date_gc"),
        accessorKey: "prp_record_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => cellProps.row.original.prp_record_date_gc || "-",
      },

      // Create quarter columns based on custom definitions
      ...quarterDefinitions
        .map((quarterMonths, quarterIndex) => [
          {
            header: `${t("q")}${quarterIndex + 1} ${t("physical_planned")}`,
            accessorKey: `quarter_${quarterIndex + 1}_physical_planned`,
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cellProps) => {
              // Sum the 3 months for this quarter
              const sum = quarterMonths.reduce((total, month) => {
                const value =
                  cellProps.row.original[
                  `prp_pyhsical_planned_month_${month}`
                  ] || 0;
                return total + Number(value);
              }, 0);
              return sum ? truncateText(sum.toLocaleString(), 15) : "-";
            },
          },
          {
            header: `${t("q")}${quarterIndex + 1} ${t("financial_planned")}`,
            accessorKey: `quarter_${quarterIndex + 1}_financial_planned`,
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cellProps) => {
              const sum = quarterMonths.reduce((total, month) => {
                const value =
                  cellProps.row.original[`prp_finan_planned_month_${month}`] ||
                  0;
                return total + Number(value);
              }, 0);
              return sum ? truncateText(sum.toLocaleString(), 15) : "-";
            },
          },
          {
            header: `${t("q")}${quarterIndex + 1} ${t("physical_actual")}`,
            accessorKey: `quarter_${quarterIndex + 1}_physical_actual`,
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cellProps) => {
              const sum = quarterMonths.reduce((total, month) => {
                const value =
                  cellProps.row.original[
                  `prp_pyhsical_actual_month_${month}`
                  ] || 0;
                return total + Number(value);
              }, 0);
              return sum ? truncateText(sum.toLocaleString(), 15) : "-";
            },
          },
          {
            header: `${t("q")}${quarterIndex + 1} ${t("financial_actual")}`,
            accessorKey: `quarter_${quarterIndex + 1}_financial_actual`,
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cellProps) => {
              const sum = quarterMonths.reduce((total, month) => {
                const value =
                  cellProps.row.original[`prp_finan_actual_month_${month}`] ||
                  0;
                return total + Number(value);
              }, 0);
              return sum ? truncateText(sum.toLocaleString(), 15) : "-";
            },
          },
        ])
        .flat(),
      {
        header: t("prp_budget_baseline"),
        accessorKey: "prp_budget_baseline",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) =>
          truncateText(
            Number(cellProps.row.original.prp_budget_baseline).toLocaleString(),
            15
          ) || "-",
      },
      {
        header: t("prp_physical_baseline"),
        accessorKey: "prp_physical_baseline",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) =>
          truncateText(
            Number(
              cellProps.row.original.prp_physical_baseline
            ).toLocaleString(),
            15
          ) || "-",
      },
      {
        header: t("view_detail"),
        cell: (cellProps) => (
          <Button
            color="primary"
            size="sm"
            onClick={() => {
              setTransaction(cellProps.row.original);
              toggleViewModal();
            }}
          >
            {t("view_detail")}
          </Button>
        ),
      },
      {
        header: t("attach_files"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <Button
              outline
              type="button"
              color="success"
              className="btn-sm"
              onClick={() => {
                toggleFileModal();
                setTransaction(cellProps.row.original);
              }}
            >
              {t("attach_files")}
            </Button>
          );
        },
      },
      {
        header: t("Message"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <Button
              outline
              type="button"
              color="primary"
              className="btn-sm"
              onClick={() => {
                toggleConvModal();
                setTransaction(cellProps.row.original);
              }}
            >
              {t("Message")}
            </Button>
          );
        },
      },
    ];

    if (data?.previledge?.is_role_editable == 1) {
      baseColumns.push({
        header: t("Action"),
        cell: (cellProps) => (
          <div className="d-flex gap-2">
            <Button
              color="none"
              className="text-success"
              size="sm"
              onClick={() => handleEditPlanned(cellProps.row.original)}
              id={`editPlanned-${cellProps.row.id}`}
            >
              <i className="mdi mdi-pencil font-size-18" />
            </Button>
            <UncontrolledTooltip target={`editPlanned-${cellProps.row.id}`}>
              Edit Planned Values
            </UncontrolledTooltip>

            <Button
              color="none"
              className="text-primary"
              size="sm"
              onClick={() => handleAddActuals(cellProps.row.original)}
              id={`addActuals-${cellProps.row.id}`}
            >
              <i className="mdi mdi-chart-line font-size-18" />
            </Button>
            <UncontrolledTooltip target={`addActuals-${cellProps.row.id}`}>
              Enter Actual Values
            </UncontrolledTooltip>
            {cellProps.row.original.is_deletable == 1 && (
              <>
                <Button
                  color="none"
                  className="text-danger"
                  size="sm"
                  onClick={() => onClickDelete(cellProps.row.original)}
                  id={`delete-${cellProps.row.id}`}
                >
                  <i className="mdi mdi-delete font-size-18" />
                </Button>
                <UncontrolledTooltip target={`delete-${cellProps.row.id}`}>
                  Delete
                </UncontrolledTooltip>
              </>
            )}
          </div>
        ),
      });
    }

    return baseColumns;
  }, [projectStatusMap, budgetYearMap, budgetMonthMap, data]);

  // Effect to populate form when projectPerformance changes
  useEffect(() => {
    if (projectPerformance) {
      populateForm(projectPerformance);
    }
  }, [projectPerformance]);

  return (
		<React.Fragment>
			<LazyLoader>
				{fileModal && (
					<AttachFileModal
						isOpen={fileModal}
						toggle={toggleFileModal}
						projectId={passedId}
						ownerTypeId={PAGE_ID.PROJ_PERFORMANCE}
						ownerId={transaction?.prp_id}
					/>
				)}
				{convModal && (
					<ConvInfoModal
						isOpen={convModal}
						toggle={toggleConvModal}
						ownerTypeId={PAGE_ID.PROJ_PERFORMANCE}
						ownerId={transaction?.prp_id ?? null}
					/>
				)}
			</LazyLoader>
			<ProjectPerformanceModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
				budgetYearMap={budgetYearMap}
				budgetMonthMap={budgetMonthMap}
				projectStatusMap={projectStatusMap}
			/>

			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteProjectPerformance}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteProjectPerformance.isPending}
			/>

			{isLoading ? (
				<Spinners />
			) : (
				<TableContainer
					columns={columns}
					data={data?.data || []}
					isGlobalFilter={true}
					isAddButton={data?.previledge?.is_role_can_add == 1}
					isCustomPageSize={true}
					handleUserClick={handleAddNew}
					isPagination={true}
					SearchPlaceholder={t("filter_placeholder")}
					buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
					buttonName={t("add_planned")}
					tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
					theadClass="table-light"
					pagination="pagination"
					paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
					refetch={refetch}
					isFetching={isFetching}
				/>
			)}

			<Modal isOpen={modal} toggle={toggle} size="xl">
				<ModalHeader toggle={toggle} className="border-0 pb-0">
					<h4 className="mb-0">
						{isEdit
							? `${t(
									entryMode === "planned"
										? `${t("edit_planned")}`
										: `${t("enter_actuals")}`
							  )}`
							: `${t("add_planned")}`}
						<Badge
							color={entryMode === "planned" ? "info" : "success"}
							className="ms-2"
						>
							{t(entryMode)}
						</Badge>
					</h4>
				</ModalHeader>

				<ModalBody className="pt-1">
					<Form onSubmit={validation.handleSubmit}>
						{/* Summary Section - Only show baseline fields */}
						<Card className="mt-3 border-light shadow-sm">
							<CardHeader className="bg-light">
								<h5 className="mb-0">{t("baseline_values")}</h5>
								<small className="text-muted">
									{t("total_project_budget")}:{" "}
									{Number(totalActualBudget).toLocaleString()}
								</small>
							</CardHeader>
							<CardBody>
								<Row>
									<Col md={4}>
										<Label className="fw-medium">{t("year")}</Label>
										<Input
											name="prp_budget_year_id"
											type="select"
											className="form-select"
											onChange={handleYearChange}
											value={validation.values.prp_budget_year_id || ""}
											invalid={
												validation.touched.prp_budget_year_id &&
												!!validation.errors.prp_budget_year_id
											}
											disabled={isEdit}
										>
											<option value="">{t("select")}</option>
											{bgYearsOptionsData?.data?.map((data) => (
												<option key={data.bdy_id} value={data.bdy_id}>
													{data.bdy_name}
												</option>
											))}
										</Input>
										<FormFeedback>
											{validation.errors.prp_budget_year_id}
										</FormFeedback>
									</Col>
									<Col md={4}>
										<FormattedAmountField
											validation={validation}
											fieldId="prp_physical_baseline"
											label={t("prp_physical_baseline")}
											isRequired={true}
											max={100}
										/>
									</Col>
									<Col md={4}>
										<FormattedAmountField
											validation={validation}
											fieldId="prp_budget_baseline"
											label={t("prp_budget_baseline")}
											isRequired={true}
										/>
									</Col>
								</Row>

								{/* New Actual Entry Checkbox and Date Picker - Only show in actual mode */}
								{entryMode === "actual" && (
									<Row className="mt-3">
										<Col md={4}>
											<div className="form-check">
												<Input
													type="checkbox"
													id="is_new_actual_entry"
													name="is_new_actual_entry"
													className="form-check-input"
													checked={validation.values.is_new_actual_entry}
													onChange={(e) => {
														validation.setFieldValue(
															"is_new_actual_entry",
															e.target.checked
														);
														if (!e.target.checked) {
															validation.setFieldValue(
																"prp_record_date_gc",
																new Date().toISOString().split("T")[0]
															);
														}
													}}
												/>
												<Label
													htmlFor="is_new_actual_entry"
													className="form-check-label fw-medium"
												>
													{t("new_actual_entry")}
												</Label>
											</div>
										</Col>
										{validation.values.is_new_actual_entry && (
											<Col md={4}>
												<Label className="fw-medium">{t("entry_date")}</Label>
												<Input
													name="prp_record_date_gc"
													type="date"
													onChange={validation.handleChange}
													onBlur={validation.handleBlur}
													value={validation.values.prp_record_date_gc}
													max={new Date().toISOString().split("T")[0]}
													invalid={
														validation.touched.prp_record_date_gc &&
														!!validation.errors.prp_record_date_gc
													}
												/>
												{validation.errors.prp_record_date_gc && (
													<div className="text-danger small mt-1">
														{validation.errors.prp_record_date_gc}
													</div>
												)}
											</Col>
										)}
									</Row>
								)}
							</CardBody>
						</Card>
						{/* Quarterly Tabs */}
						<Nav tabs className="nav-tabs-custom mb-3 justify-content-center">
							{["Quarter1", "Quarter2", "Quarter3", "Quarter4"].map(
								(quarter, idx) => (
									<NavItem key={idx} className="mx-3">
										<NavLink
											className={`cursor-pointer ${
												activeTab === quarter ? "active" : ""
											}`}
											onClick={() => setActiveTab(quarter)}
										>
											{t(quarter)}
										</NavLink>
									</NavItem>
								)
							)}
						</Nav>

						<Card className="mt-3 border-light shadow-sm">
							<CardHeader className="bg-light">
								<h6 className="mb-0">{t("budget_summary")}</h6>
							</CardHeader>
							<CardBody>
								<Row>
									<Col md={4}>
										<div className="d-flex justify-content-between">
											<span className="fw-medium">
												{t("total_physical_planned_you_entered")}:
											</span>
											<span>
												{Array.from({ length: 12 }, (_, i) =>
													convertToNumericValue(
														validation.values[
															`prp_pyhsical_planned_month_${i + 1}`
														] || "0"
													)
												).reduce((a, b) => a + b, 0)}
												%
											</span>
										</div>
										{validation.errors._sumPhysicalPlanned && (
											<div className="text-danger small mt-1">
												{validation.errors._sumPhysicalPlanned}
											</div>
										)}
									</Col>

									<Col md={4}>
										<div className="d-flex justify-content-between">
											<span className="fw-medium">
												{t("total_financial_planned_you_entered")}:
											</span>
											<span>
												{Array.from({ length: 12 }, (_, i) =>
													convertToNumericValue(
														validation.values[
															`prp_finan_planned_month_${i + 1}`
														] || "0"
													)
												)
													.reduce((a, b) => a + b, 0)
													.toLocaleString()}{" "}
												{t("birr")}
											</span>
										</div>
										{validation.errors._sumFinancialPlanned && (
											<div className="text-danger small mt-1">
												{validation.errors._sumFinancialPlanned}
											</div>
										)}
									</Col>

									<Col md={4}>
										<div className="d-flex justify-content-between">
											<span className="fw-medium">
												{t("total_physical_actual_you_entered")}:
											</span>
											<span>
												{Array.from({ length: 12 }, (_, i) =>
													convertToNumericValue(
														validation.values[
															`prp_pyhsical_actual_month_${i + 1}`
														] || "0"
													)
												).reduce((a, b) => a + b, 0)}
												%
											</span>
										</div>
										{validation.errors._sumPhysicalActual && (
											<div className="text-danger small mt-1">
												{validation.errors._sumPhysicalActual}
											</div>
										)}
									</Col>
								</Row>
							</CardBody>
						</Card>

						{/* Quarterly Input Groups */}
						<TabContent activeTab={activeTab}>
							{["Quarter1", "Quarter2", "Quarter3", "Quarter4"].map(
								(quarter) => {
									const months = {
										Quarter1: [11, 12, 1],
										Quarter2: [2, 3, 4],
										Quarter3: [5, 6, 7],
										Quarter4: [8, 9, 10],
									}[quarter];

									return (
										<TabPane tabId={quarter} key={quarter}>
											<Card className="border-light shadow-sm">
												<CardBody>
													<Row>
														{months.map((month) => (
															<Col md={4} key={month} className="mb-3">
																<Card className="h-100">
																	<CardHeader className="bg-light py-2">
																		<h6 className="mb-0">
																			{t("month")} {month}
																		</h6>
																	</CardHeader>
																	<CardBody>
																		{entryMode === "planned" ? (
																			<>
																				<FormattedAmountField
																					validation={validation}
																					fieldId={`prp_pyhsical_planned_month_${month}`}
																					label={t("physical_planned_%")}
																					isRequired={true}
																					max={100}
																				/>
																				<FormattedAmountField
																					validation={validation}
																					fieldId={`prp_finan_planned_month_${month}`}
																					label={t("financial_planned")}
																					isRequired={true}
																				/>
																			</>
																		) : (
																			<>
																				<FormattedAmountField
																					validation={validation}
																					fieldId={`prp_pyhsical_actual_month_${month}`}
																					label={t("physical_actual_%")}
																					isRequired={true}
																					max={100}
																				/>
																				<FormattedAmountField
																					validation={validation}
																					fieldId={`prp_finan_actual_month_${month}`}
																					label={t("financial_actual")}
																					isRequired={true}
																				/>

																				<div className="mb-3">
																					{/* Label with dynamic rules */}
																					<Label
																						htmlFor={`prp_status_month_${month}`}
																						className="form-label mb-1 fw-medium"
																					>
																						{t("status")}

																						{/* Conditional red asterisk */}
																						{(convertToNumericValue(
																							validation.values[
																								`prp_pyhsical_actual_month_${month}`
																							] || "0"
																						) > 0 ||
																							convertToNumericValue(
																								validation.values[
																									`prp_finan_actual_month_${month}`
																								] || "0"
																							) > 0) && (
																							<span className="text-danger ms-1">
																								*
																							</span>
																						)}

																						{/* Dynamic tooltip */}
																						<span
																							id={`status-tooltip-${month}`}
																							className="ms-1 text-muted cursor-help"
																						>
																							<i className="ri-information-line"></i>
																						</span>
																						<UncontrolledTooltip
																							target={`status-tooltip-${month}`}
																						>
																							{t(
																								convertToNumericValue(
																									validation.values[
																										`prp_pyhsical_actual_month_${month}`
																									] || "0"
																								) > 0 ||
																									convertToNumericValue(
																										validation.values[
																											`prp_finan_actual_month_${month}`
																										] || "0"
																									) > 0
																									? "Status is required when actual values exist"
																									: "Optional when both actuals are 0 (can select 'New' or leave empty)"
																							)}
																						</UncontrolledTooltip>
																					</Label>

																					{/* Dropdown */}
																					<Input
																						id={`prp_status_month_${month}`}
																						name={`prp_status_month_${month}`}
																						type="select"
																						value={
																							validation.values[
																								`prp_status_month_${month}`
																							] || ""
																						}
																						onChange={validation.handleChange}
																						onBlur={validation.handleBlur}
																						invalid={Boolean(
																							validation.touched[
																								`prp_status_month_${month}`
																							] &&
																								validation.errors[
																									`prp_status_month_${month}`
																								]
																						)}
																					>
																						<option value="">
																							{t("no_status")}
																						</option>
																						{projectStatusData?.data
																							?.filter(
																								(status) => status.prs_id >= 5
																							)
																							.map((status) => (
																								<option
																									key={status.prs_id}
																									value={status.prs_id}
																									disabled={
																										convertToNumericValue(
																											validation.values[
																												`prp_pyhsical_actual_month_${month}`
																											] || "0"
																										) === 0 &&
																										convertToNumericValue(
																											validation.values[
																												`prp_finan_actual_month_${month}`
																											] || "0"
																										) === 0 &&
																										status.prs_id !== 5
																									}
																								>
																									{lang === "en"
																										? status.prs_status_name_en
																										: lang === "am"
																										? status.prs_status_name_am
																										: status.prs_status_name_or}
																								</option>
																							))}
																					</Input>

																					{/* Error Message */}
																					{validation.errors[
																						`prp_status_month_${month}`
																					] && (
																						<div className="text-danger small mt-1">
																							{
																								validation.errors[
																									`prp_status_month_${month}`
																								]
																							}
																						</div>
																					)}
																				</div>
																			</>
																		)}
																	</CardBody>
																</Card>
															</Col>
														))}
													</Row>
												</CardBody>
											</Card>
										</TabPane>
									);
								}
							)}
						</TabContent>

						{/* Description */}
						<Card className="mt-3 border-light shadow-sm">
							<CardBody>
								<Label className="fw-medium">
									{t("description")}
									<small className="text-muted ms-1">({t("optional")})</small>
								</Label>
								<Input
									name="prp_description"
									type="textarea"
									rows="5"
									placeholder={t("description")}
									onChange={validation.handleChange}
									value={validation.values.prp_description || ""}
								/>
							</CardBody>
						</Card>

						{/* Submit Button */}
						<div className="text-end mt-4">
							<Button
								color="success"
								type="submit"
								disabled={
									addProjectPerformance.isPending ||
									updateProjectPerformance.isPending ||
									!validation.dirty
								}
							>
								{addProjectPerformance.isPending ||
								updateProjectPerformance.isPending ? (
									<>
										<Spinner size="sm" className="me-2" />
										{t("saving")}...
									</>
								) : (
									t("save")
								)}
							</Button>
						</div>
					</Form>
				</ModalBody>
			</Modal>
		</React.Fragment>
	);
};

ProjectPerformanceModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectPerformanceModel;
