import React, { useEffect, useMemo, useState, Suspense, lazy } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchProjectKpiResults,
  useAddProjectKpiResult,
  useDeleteProjectKpiResult,
  useUpdateProjectKpiResult,
  useSearchProjectKpiResults,
} from "../../queries/projectkpiresult_query";
import { formattedAmountValidation } from "../../utils/Validation/validation";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import { convertToNumericValue } from "../../utils/commonMethods";
import ProjectKpiResultModal from "./ProjectKpiResultModal";
import { useTranslation } from "react-i18next";
import { PAGE_ID } from "../../constants/constantFile";
const AttachFileModal = lazy(
  () => import("../../components/Common/AttachFileModal"),
);
const ConvInfoModal = lazy(
  () => import("../../pages/Conversationinformation/ConvInfoModal"),
);
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePopulateBudgetYears } from "../../queries/budgetyear_query";
import { useFetchProjectKpis } from "../../queries/projectkpi_query";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

// Loader Component for Suspense
const LazyLoader = ({ children }) => (
  <Suspense fallback={<Spinner color="primary" />}>{children}</Suspense>
);

const ProjectKpiResultModel = (props) => {
  document.title = "Project KPI Results";
  const { passedId, isActive, status, startDate } = props;
  const param = { project_id: passedId, request_type: "single" };
  const { t } = useTranslation();

  // State management
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [entryMode, setEntryMode] = useState("planned"); // 'planned' or 'actual'
  const [isEdit, setIsEdit] = useState(false);
  const [projectKpiResult, setProjectKpiResult] = useState(null);
  const [transaction, setTransaction] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Quarter1");

  const [fileModal, setFileModal] = useState(false);
  const [convModal, setConvModal] = useState(false);

  const [showSearchResult, setShowSearchResult] = useState(false);

  // Data fetching
  const { data, isLoading, isFetching, error, isError, refetch } =
    useSearchProjectKpiResults(param, isActive);
  const addProjectKpiResult = useAddProjectKpiResult();
  const updateProjectKpiResult = useUpdateProjectKpiResult();
  const deleteProjectKpiResult = useDeleteProjectKpiResult();
  const { data: bgYearsOptionsData } = usePopulateBudgetYears();
  const { data: kpiOptionsData } = useFetchProjectKpis();

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

  const kpiMap = useMemo(() => {
    return (
      kpiOptionsData?.data?.reduce((acc, year) => {
        acc[year.kpi_id] = year.kpi_name_or;
        return acc;
      }, {}) || {}
    );
  }, [kpiOptionsData]);

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      kpr_project_id: passedId,
      kpr_project_kpi_id: projectKpiResult?.kpr_project_kpi_id || "",
      kpr_year_id: projectKpiResult?.kpr_year_id || "",
      ...Array.from({ length: 12 }, (_, i) => ({
        [`kpr_planned_month_${i + 1}`]: projectKpiResult?.[
          `kpr_planned_month_${i + 1}`
        ]
          ? Number(
              projectKpiResult[`kpr_planned_month_${i + 1}`],
            ).toLocaleString()
          : "0", // Default to "0" instead of empty string
        [`kpr_actual_month_${i + 1}`]: projectKpiResult?.[
          `kpr_actual_month_${i + 1}`
        ]
          ? Number(
              projectKpiResult[`kpr_actual_month_${i + 1}`],
            ).toLocaleString()
          : "0", // Default to "0" instead of empty string
      })).reduce((acc, curr) => ({ ...acc, ...curr })),
      kpr_description: projectKpiResult?.kpr_description || "",
      is_deletable: projectKpiResult?.is_deletable || 1,
      is_editable: projectKpiResult?.is_editable || 1,
    },

    validationSchema: Yup.object().shape({
      kpr_project_id: Yup.string().required(t("kpr_project_id")),
      kpr_project_kpi_id: Yup.string().required(t("kpr_project_kpi_id")),
      kpr_year_id: Yup.string().required(t("kpr_year_id")),
      ...Array.from({ length: 12 }, (_, i) => ({
        [`kpr_planned_month_${i + 1}`]:
          entryMode === "planned"
            ? formattedAmountValidation(0, 10000000000, true)
            : Yup.string().notRequired(),
        [`kpr_actual_month_${i + 1}`]:
          entryMode === "actual"
            ? formattedAmountValidation(0, 10000000000, true)
            : Yup.string().notRequired(),
      })).reduce((acc, curr) => ({ ...acc, ...curr })),
      kpr_description: Yup.string().notRequired(),
    }),

    validateOnBlur: true,
    validateOnChange: false,

    onSubmit: (values) => {
      // Create base payload
      const payload = {
        kpr_project_id: passedId,
        kpr_project_kpi_id: values.kpr_project_kpi_id,
        kpr_year_id: values.kpr_year_id,
        kpr_description: values.kpr_description || null,
      };

      // Add monthly values based on entry mode
      if (entryMode === "planned") {
        for (let i = 1; i <= 12; i++) {
          payload[`kpr_planned_month_${i}`] = convertToNumericValue(
            values[`kpr_planned_month_${i}`] || "0",
          );
          // Clear actual values when submitting planned values
          payload[`kpr_actual_month_${i}`] =
            projectKpiResult?.[`kpr_actual_month_${i}`] || 0;
        }
      } else {
        for (let i = 1; i <= 12; i++) {
          // Preserve planned values when submitting actuals
          payload[`kpr_planned_month_${i}`] =
            projectKpiResult?.[`kpr_planned_month_${i}`] || 0;
          payload[`kpr_actual_month_${i}`] = convertToNumericValue(
            values[`kpr_actual_month_${i}`] || "0",
          );
        }
      }

      // Add ID if editing
      if (isEdit && projectKpiResult?.kpr_id) {
        payload.kpr_id = projectKpiResult.kpr_id;
      }

      // Submit based on mode
      if (isEdit) {
        handleUpdateProjectKpiResult(payload);
      } else {
        handleAddProjectKpiResult(payload);
      }
    },
  });

  // CRUD Operations
  const handleAddProjectKpiResult = async (data) => {
    try {
      await addProjectKpiResult.mutateAsync(data);
      toast.success(t("add_success"), { autoClose: 2000 });
      validation.resetForm();
    } catch (error) {
      toast.error(t("add_failure"), { autoClose: 2000 });
    }
    toggle();
  };

  const handleUpdateProjectKpiResult = async (data) => {
    try {
      await updateProjectKpiResult.mutateAsync(data);
      toast.success(t("update_success"), { autoClose: 2000 });
      validation.resetForm();
    } catch (error) {
      toast.error(t("update_failure"), { autoClose: 2000 });
    }
    toggle();
  };

  const handleDeleteProjectKpiResult = async () => {
    if (projectKpiResult?.kpr_id) {
      try {
        await deleteProjectKpiResult.mutateAsync(projectKpiResult.kpr_id);
        toast.success(t("delete_success"), { autoClose: 2000 });
      } catch (error) {
        toast.error(t("delete_failure"), { autoClose: 2000 });
      }
      setDeleteModal(false);
    }
  };

  // UI Handlers
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectKpiResult(null);
      setEntryMode("planned");
    } else {
      setModal(true);
    }
  };

  const toggleViewModal = () => setModal1(!modal1);

  const handleEditPlanned = (data) => {
    setProjectKpiResult(data);
    setEntryMode("planned");
    populateForm(data);
    setIsEdit(true);
    toggle();
  };

  const handleAddActuals = (data) => {
    setProjectKpiResult(data);
    setEntryMode("actual");
    populateForm(data);
    setIsEdit(true);
    toggle();
  };

  const handleAddNew = () => {
    setProjectKpiResult(null);
    setEntryMode("planned");
    setIsEdit(false);
    toggle();
  };

  const populateForm = (data) => {
    const values = {
      kpr_project_id: passedId,
      kpr_project_kpi_id: data.kpr_project_kpi_id,
      kpr_year_id: data.kpr_year_id,
      ...Array.from({ length: 12 }, (_, i) => ({
        [`kpr_planned_month_${i + 1}`]: data[`kpr_planned_month_${i + 1}`]
          ? Number(data[`kpr_planned_month_${i + 1}`]).toLocaleString()
          : "0", // Default to "0"
        [`kpr_actual_month_${i + 1}`]: data[`kpr_actual_month_${i + 1}`]
          ? Number(data[`kpr_actual_month_${i + 1}`]).toLocaleString()
          : "0", // Default to "0"
      })).reduce((acc, curr) => ({ ...acc, ...curr })),
      kpr_description: data.kpr_description,
    };
    validation.setValues(values);
  };
  const onClickDelete = (result) => {
    setProjectKpiResult(result);
    setDeleteModal(true);
  };

  // Columns configuration

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "KPI",
        accessorKey: "kpr_project_kpi_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) =>
          kpiMap[cellProps.row.original.kpr_project_kpi_id] || "",
      },
      {
        header: "Year",
        accessorKey: "kpr_year_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) =>
          budgetYearMap[cellProps.row.original.kpr_year_id] || "",
      },
      // Quarter columns
      ...[
        {
          name: "Q1",
          months: [11, 12, 1], // Month numbers as they appear in the data
        },
        {
          name: "Q2",
          months: [2, 3, 4],
        },
        {
          name: "Q3",
          months: [5, 6, 7],
        },
        {
          name: "Q4",
          months: [8, 9, 10],
        },
      ]
        .map((quarter) => [
          {
            header: `Planned ${quarter.name}`,
            accessorKey: `planned_${quarter.name}`,
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cellProps) => {
              const sum = quarter.months.reduce((total, month) => {
                const value =
                  cellProps.row.original[`kpr_planned_month_${month}`];
                return total + (Number(value) || 0);
              }, 0);
              return sum ? truncateText(Number(sum).toLocaleString(), 15) : "-";
            },
          },
          {
            header: `Actual ${quarter.name}`,
            accessorKey: `actual_${quarter.name}`,
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cellProps) => {
              const sum = quarter.months.reduce((total, month) => {
                const value =
                  cellProps.row.original[`kpr_actual_month_${month}`];
                return total + (Number(value) || 0);
              }, 0);
              return sum ? truncateText(Number(sum).toLocaleString(), 15) : "-";
            },
          },
        ])
        .flat(),
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
            <>
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
            </>
          </div>
        ),
      });
    }

    return baseColumns;
  }, [kpiMap, budgetYearMap, data, handleEditPlanned, handleAddActuals]);

  // Effect to populate form when projectKpiResult changes
  useEffect(() => {
    if (projectKpiResult) {
      populateForm(projectKpiResult);
    }
  }, [projectKpiResult]);

  return (
    <React.Fragment>
      <LazyLoader>
        {fileModal && (
          <AttachFileModal
            isOpen={fileModal}
            toggle={toggleFileModal}
            projectId={passedId}
            ownerTypeId={PAGE_ID.PROJ_KPI_RESULT}
            ownerId={transaction?.kpr_id}
          />
        )}
        {convModal && (
          <ConvInfoModal
            isOpen={convModal}
            toggle={toggleConvModal}
            ownerTypeId={PAGE_ID.PROJ_KPI_RESULT}
            ownerId={transaction?.kpr_id ?? null}
          />
        )}
      </LazyLoader>
      <ProjectKpiResultModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectKpiResult}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProjectKpiResult.isPending}
      />

      {isLoading ? (
        <Spinners />
      ) : (
        <TableContainer
          columns={columns}
          data={showSearchResult ? results : data?.data || []}
          isGlobalFilter={true}
          isAddButton={data?.previledge?.is_role_can_add == 1}
          isCustomPageSize={true}
          handleUserClick={handleAddNew}
          isPagination={true}
          SearchPlaceholder={26 + " " + t("Results") + "..."}
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
                  entryMode === "planned" ? "edit_planned" : "enter_actuals",
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
            {/* KPI & Year Selection */}
            <Card className="mb-4 border-light shadow-sm">
              <CardBody>
                <Row>
                  <Col md={6}>
                    <Label className="fw-medium">
                      {t("kpr_project_kpi_id")}
                    </Label>
                    <Input
                      name="kpr_project_kpi_id"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      value={validation.values.kpr_project_kpi_id || ""}
                      invalid={
                        validation.touched.kpr_project_kpi_id &&
                        !!validation.errors.kpr_project_kpi_id
                      }
                      disabled={isEdit}
                    >
                      <option value="">{t("select")}</option>
                      {kpiOptionsData?.data?.map((data) => (
                        <option key={data.kpi_id} value={data.kpi_id}>
                          {data.kpi_name_or}
                        </option>
                      ))}
                    </Input>
                    <FormFeedback>
                      {validation.errors.kpr_project_kpi_id}
                    </FormFeedback>
                  </Col>

                  <Col md={6}>
                    <Label className="fw-medium">{t("kpr_year_id")}</Label>
                    <Input
                      name="kpr_year_id"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      value={validation.values.kpr_year_id || ""}
                      invalid={
                        validation.touched.kpr_year_id &&
                        !!validation.errors.kpr_year_id
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
                    <FormFeedback>{validation.errors.kpr_year_id}</FormFeedback>
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
                ),
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
                                      <FormattedAmountField
                                        validation={validation}
                                        fieldId={`kpr_planned_month_${month}`}
                                        label={t("planned")}
                                        isRequired={true}
                                      />
                                    ) : (
                                      <FormattedAmountField
                                        validation={validation}
                                        fieldId={`kpr_actual_month_${month}`}
                                        label={t("actual")}
                                        isRequired={true}
                                      />
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
                },
              )}
            </TabContent>

            {/* Description */}
            <Card className="mt-3 border-light shadow-sm">
              <CardBody>
                <Label className="fw-medium">
                  {t("kpr_description")}
                  <small className="text-muted ms-1">({t("optional")})</small>
                </Label>
                <Input
                  name="kpr_description"
                  type="textarea"
                  rows="2"
                  placeholder={t("description")}
                  onChange={validation.handleChange}
                  value={validation.values.kpr_description || ""}
                />
              </CardBody>
            </Card>

            {/* Submit Button */}
            <div className="text-end mt-4">
              <Button
                color="primary"
                type="submit"
                disabled={
                  addProjectKpiResult.isPending ||
                  updateProjectKpiResult.isPending ||
                  !validation.dirty
                }
              >
                {addProjectKpiResult.isPending ||
                updateProjectKpiResult.isPending ? (
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

ProjectKpiResultModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectKpiResultModel;
