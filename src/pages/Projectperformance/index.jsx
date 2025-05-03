import React, { useEffect, useMemo, useState } from "react";
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
import { formattedAmountValidation } from "../../utils/Validation/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import { convertToNumericValue } from "../../utils/commonMethods";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectPerformanceModel = (props) => {
  document.title = "Project Performance";
  const { passedId, isActive, startDate } = props;
  const param = { prp_project_id: passedId, request_type: "single" };
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

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      prp_project_id: passedId,
      prp_project_status_id: projectPerformance?.prp_project_status_id || "1",
      prp_budget_year_id: projectPerformance?.prp_budget_year_id || "",
      prp_budget_month_id:
        projectPerformance?.prp_budget_month_id || DEFAULT_MONTH,
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

                // When both are 0: allow empty or status=5 only
                if (physicalActual === 0 && financialActual === 0) {
                  return !value || value === 5;
                }

                // When any actual > 0: status becomes required
                if (physicalActual > 0 || financialActual > 0) {
                  return !!value;
                }

                return true;
              }
            )
          : Yup.number().notRequired(),
      })).reduce((acc, curr) => ({ ...acc, ...curr })),
      prp_description: Yup.string().notRequired(),
      // Summary fields validation
      prp_budget_year_id: Yup.number().required(t("Year is required")),
      prp_physical_baseline: formattedAmountValidation(0, 100, true),
      prp_budget_baseline: formattedAmountValidation(0, 10000000000, true),
    }),

    validateOnBlur: true,
    validateOnChange: false,

    onSubmit: (values) => {
      const payload = {
        prp_project_id: passedId,
        prp_project_status_id: "1",
        prp_budget_year_id: values.prp_budget_year_id,
        prp_budget_month_id: DEFAULT_MONTH,
        prp_record_date_gc: new Date().toISOString().split("T")[0],
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
    const values = {
      prp_project_id: passedId,
      prp_project_status_id: "1",
      prp_budget_year_id: data.prp_budget_year_id,
      prp_budget_month_id: DEFAULT_MONTH,
      prp_record_date_gc: new Date().toISOString().split("T")[0],
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
        header: "Year",
        accessorKey: "prp_budget_year_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) =>
          budgetYearMap[cellProps.row.original.prp_budget_year_id] || "-",
      },
      // Create quarter columns based on custom definitions
      ...quarterDefinitions
        .map((quarterMonths, quarterIndex) => [
          {
            header: `Q${quarterIndex + 1} Physical Planned`,
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
            header: `Q${quarterIndex + 1} Financial Planned`,
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
            header: `Q${quarterIndex + 1} Physical Actual`,
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
            header: `Q${quarterIndex + 1} Financial Actual`,
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
        header: "Baseline Budget",
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
        header: "Baseline Physical",
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
    ];

    if (data?.previledge?.is_role_editable == 1) {
      baseColumns.push({
        header: t("Action"),
        cell: (cellProps) => (
          <div className="d-flex gap-2">
            <Button
              color="success"
              size="sm"
              onClick={() => handleEditPlanned(cellProps.row.original)}
              id={`editPlanned-${cellProps.row.id}`}
            >
              <i className="mdi mdi-pencil" />
            </Button>
            <UncontrolledTooltip target={`editPlanned-${cellProps.row.id}`}>
              Edit Planned Values
            </UncontrolledTooltip>

            <Button
              color="secondary"
              size="sm"
              onClick={() => handleAddActuals(cellProps.row.original)}
              id={`addActuals-${cellProps.row.id}`}
            >
              <i className="mdi mdi-chart-line" />
            </Button>
            <UncontrolledTooltip target={`addActuals-${cellProps.row.id}`}>
              Enter Actual Values
            </UncontrolledTooltip>
            {cellProps.row.original.is_deletable == 1 && (
              <>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => onClickDelete(cellProps.row.original)}
                  id={`delete-${cellProps.row.id}`}
                >
                  <i className="mdi mdi-delete-outline" />
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
                  entryMode === "planned" ? "edit_planned" : "enter_actuals"
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
                <h5 className="mb-0">{t("Baseline Values")}</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={4}>
                    <Label className="fw-medium">{t("Year")}</Label>
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
                      label={t("Physical Baseline %")}
                      isRequired={true}
                      max={100}
                    />
                  </Col>
                  <Col md={4}>
                    <FormattedAmountField
                      validation={validation}
                      fieldId="prp_budget_baseline"
                      label={t("Budget Baseline")}
                      isRequired={true}
                    />
                  </Col>
                </Row>
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
                      {quarter}
                    </NavLink>
                  </NavItem>
                )
              )}
            </Nav>

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
                                    <h6 className="mb-0">Month {month}</h6>
                                  </CardHeader>
                                  <CardBody>
                                    {entryMode === "planned" ? (
                                      <>
                                        <FormattedAmountField
                                          validation={validation}
                                          fieldId={`prp_pyhsical_planned_month_${month}`}
                                          label={t("Physical Planned %")}
                                          isRequired={true}
                                          max={100}
                                        />
                                        <FormattedAmountField
                                          validation={validation}
                                          fieldId={`prp_finan_planned_month_${month}`}
                                          label={t("Financial Planned")}
                                          isRequired={true}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <FormattedAmountField
                                          validation={validation}
                                          fieldId={`prp_pyhsical_actual_month_${month}`}
                                          label={t("Physical Actual %")}
                                          isRequired={true}
                                          max={100}
                                        />
                                        <FormattedAmountField
                                          validation={validation}
                                          fieldId={`prp_finan_actual_month_${month}`}
                                          label={t("Financial Actual")}
                                          isRequired={true}
                                        />

                                        <div className="mb-3">
                                          {/* Label with dynamic rules */}
                                          <Label
                                            htmlFor={`prp_status_month_${month}`}
                                            className="form-label mb-1 fw-medium"
                                          >
                                            {t("Status")}

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
                                              {t("No Status")}
                                            </option>
                                            {projectStatusData?.data
      ?.filter((status) => status.prs_id >= 5)
      .map((status) => (
        <option
          key={status.prs_id}
          value={status.prs_id}
          disabled={
            convertToNumericValue(
              validation.values[`prp_pyhsical_actual_month_${month}`] || "0"
            ) === 0 &&
            convertToNumericValue(
              validation.values[`prp_finan_actual_month_${month}`] || "0"
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
                  {t("Description")}
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
                color="primary"
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
      <ToastContainer />
    </React.Fragment>
  );
};

ProjectPerformanceModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectPerformanceModel;
