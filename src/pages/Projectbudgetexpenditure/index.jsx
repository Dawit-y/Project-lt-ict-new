import React, { useEffect, useMemo, useState, lazy } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useParams } from "react-router-dom";
import { isEmpty, update } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchProjectBudgetExpenditures,
  useSearchProjectBudgetExpenditures,
  useAddProjectBudgetExpenditure,
  useDeleteProjectBudgetExpenditure,
  useUpdateProjectBudgetExpenditure,
} from "../../queries/projectbudgetexpenditure_query";
import { useFetchProject } from "../../queries/project_query";
import { useFetchBudgetYears } from "../../queries/budgetyear_query";
import { useFetchBudgetMonths } from "../../queries/budgetmonth_query";
import ProjectBudgetExpenditureModal from "./ProjectBudgetExpenditureModal";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../hooks/useAuthUser";
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
  FormGroup,
  Badge,
  InputGroup,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
} from "../../utils/Validation/validation";
const AdvancedSearch = lazy(() => import("../../components/Common/AdvancedSearch"));
const FetchErrorHandler = lazy(() => import("../../components/Common/FetchErrorHandler"));
const Flatpickr = lazy(() => import("react-flatpickr"));
const BudgetExipDetail = lazy(() => import("../Budgetexipdetail/index"));
const RightOffCanvas = lazy(() => import("../../components/Common/RightOffCanvas"));
const Breadcrumb = lazy(() => import("../../components/Common/Breadcrumb"));

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectBudgetExpenditureModel = () => {
  const location = useLocation();
  const id = Number(location.pathname.split("/")[2]);
  const param = { project_id: id, request_type: "single" };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [projectBudgetExpenditure, setProjectBudgetExpenditure] =
    useState(null);
  const [budgetExMetaData, setbudgetExMetaData] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, isFetching, error, isError, refetch } =
    useFetchProjectBudgetExpenditures(param);
  const { data: budgetYearData } = useFetchBudgetYears();
  const { data: budgetMonthData } = useFetchBudgetMonths();
  const addProjectBudgetExpenditure = useAddProjectBudgetExpenditure();
  const updateProjectBudgetExpenditure = useUpdateProjectBudgetExpenditure();
  const deleteProjectBudgetExpenditure = useDeleteProjectBudgetExpenditure();

  const { user: storedUser, isLoading: authLoading, userId } = useAuthUser();
  const project = useFetchProject(id, userId, true);
  const [rowIsSelected, setRowIsSelected] = useState(null);
  //START CRUD
  const handleAddProjectBudgetExpenditure = async (data) => {
    try {
      await addProjectBudgetExpenditure.mutateAsync(data);
      toast.success(t("add_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("add_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleUpdateProjectBudgetExpenditure = async (data) => {
    try {
      await updateProjectBudgetExpenditure.mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("update_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleDeleteProjectBudgetExpenditure = async () => {
    if (projectBudgetExpenditure && projectBudgetExpenditure.pbe_id) {
      try {
        const id = projectBudgetExpenditure.pbe_id;
        await deleteProjectBudgetExpenditure.mutateAsync(id);
        toast.success(t("delete_success"), {
          autoClose: 2000,
        });
      } catch (error) {
        toast.success(t("delete_failure"), {
          autoClose: 2000,
        });
      }
      setDeleteModal(false);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      pbe_project_id: id,
      pbe_reason:
        (projectBudgetExpenditure && projectBudgetExpenditure.pbe_reason) || "",

      pbe_budget_year_id:
        (projectBudgetExpenditure &&
          projectBudgetExpenditure.pbe_budget_year_id) ||
        "",

      pbe_budget_month_id:
        (projectBudgetExpenditure &&
          projectBudgetExpenditure.pbe_budget_month_id) ||
        "",

      pbe_used_date_ec:
        (projectBudgetExpenditure &&
          projectBudgetExpenditure.pbe_used_date_ec) ||
        "",
      pbe_used_date_gc:
        (projectBudgetExpenditure &&
          projectBudgetExpenditure.pbe_used_date_gc) ||
        "",
      ppe_amount:
        (projectBudgetExpenditure && projectBudgetExpenditure.ppe_amount) || "",
      pbe_status:
        (projectBudgetExpenditure && projectBudgetExpenditure.pbe_status) || "",
      pbe_description:
        (projectBudgetExpenditure &&
          projectBudgetExpenditure.pbe_description) ||
        "",
      pbe_created_date:
        (projectBudgetExpenditure &&
          projectBudgetExpenditure.pbe_created_date) ||
        "",

      is_deletable:
        (projectBudgetExpenditure && projectBudgetExpenditure.is_deletable) ||
        1,
      is_editable:
        (projectBudgetExpenditure && projectBudgetExpenditure.is_editable) || 1,
    },

    validationSchema: Yup.object({
      pbe_reason: alphanumericValidation(3, 200, true),
      pbe_budget_year_id: numberValidation(1, 50, true).test(
        "unique-role-id",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) =>
              item.pbe_budget_year_id == value &&
              item.pbe_id !== projectBudgetExpenditure?.pbe_id
          );
        }
      ),
      pbe_budget_month_id: numberValidation(1, 12, true),
      //pbe_used_date_gc: Yup.string().required(t("pbe_used_date_gc")),
      ppe_amount: amountValidation(1000, 1000000000),
      pbe_description: alphanumericValidation(3, 425, false),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectBudgetExpenditure = {
          pbe_id: projectBudgetExpenditure?.pbe_id,
          pbe_reason: values.pbe_reason,
          pbe_budget_year_id: parseInt(values.pbe_budget_year_id),
          pbe_budget_month_id: parseInt(values.pbe_budget_month_id),
          pbe_used_date_ec: values.pbe_used_date_ec,
          pbe_used_date_gc: values.pbe_used_date_gc,
          ppe_amount: values.ppe_amount,
          pbe_status: values.pbe_status,
          pbe_description: values.pbe_description,
          pbe_created_date: values.pbe_created_date,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectBudgetExpenditure
        handleUpdateProjectBudgetExpenditure(updateProjectBudgetExpenditure);
      } else {
        const newProjectBudgetExpenditure = {
          pbe_reason: values.pbe_reason,
          pbe_project_id: id,
          pbe_budget_year_id: parseInt(values.pbe_budget_year_id),
          pbe_budget_month_id: parseInt(values.pbe_budget_month_id),
          pbe_used_date_ec: values.pbe_used_date_ec,
          pbe_used_date_gc: values.pbe_used_date_gc,
          ppe_amount: values.ppe_amount,
          pbe_status: values.pbe_status,
          pbe_description: values.pbe_description,
          pbe_created_date: values.pbe_created_date,
        };
        // save new ProjectBudgetExpenditure
        handleAddProjectBudgetExpenditure(newProjectBudgetExpenditure);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const budgetYearMap = useMemo(() => {
    return (
      budgetYearData?.data?.reduce((acc, year) => {
        acc[year.bdy_id] = year.bdy_name;
        return acc;
      }, {}) || {}
    );
  }, [budgetYearData]);
  const budgetMonthMap = useMemo(() => {
    return (
      budgetMonthData?.data?.reduce((acc, month) => {
        acc[month.bdm_id] = month.bdm_month;
        return acc;
      }, {}) || {}
    );
  }, [budgetMonthData]);

  // Fetch ProjectBudgetExpenditure on component mount
  useEffect(() => {
    setProjectBudgetExpenditure(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectBudgetExpenditure(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectBudgetExpenditure(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectBudgetExpenditureClick = (arg) => {
    const projectBudgetExpenditure = arg;
    // console.log("handleProjectBudgetExpenditureClick", projectBudgetExpenditure);
    setProjectBudgetExpenditure({
      pbe_id: projectBudgetExpenditure.pbe_id,
      pbe_reason: projectBudgetExpenditure.pbe_reason,
      pbe_project_id: projectBudgetExpenditure.pbe_project_id,
      pbe_budget_year_id: projectBudgetExpenditure.pbe_budget_year_id,
      pbe_budget_month_id: projectBudgetExpenditure.pbe_budget_month_id,

      pbe_used_date_ec: projectBudgetExpenditure.pbe_used_date_ec,
      pbe_used_date_gc: projectBudgetExpenditure.pbe_used_date_gc,
      ppe_amount: projectBudgetExpenditure.ppe_amount,
      pbe_status: projectBudgetExpenditure.pbe_status,
      pbe_description: projectBudgetExpenditure.pbe_description,
      pbe_created_date: projectBudgetExpenditure.pbe_created_date,

      is_deletable: projectBudgetExpenditure.is_deletable,
      is_editable: projectBudgetExpenditure.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  const handleClick = (data) => {
    setShowCanvas(!showCanvas);
    setbudgetExMetaData(data);
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (projectBudgetExpenditure) => {
    setProjectBudgetExpenditure(projectBudgetExpenditure);
    setDeleteModal(true);
  };

  const handleProjectBudgetExpenditureClicks = () => {
    setIsEdit(false);
    setProjectBudgetExpenditure("");
    toggle();
  };
  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };
  //START UNCHANGED
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "pbe_reason",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pbe_reason, 30) || "-"}
            </span>
          );
        },
      },

      {
        header: "",
        accessorKey: "pbe_budget_year",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {budgetYearMap[cellProps.row.original.pbe_budget_year_id] || ""}
            </span>
          );
        },
      },

      {
        header: "",
        accessorKey: "pbe_budget_month",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {budgetMonthMap[cellProps.row.original.pbe_budget_month_id] || ""}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "ppe_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.ppe_amount, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: t("view_detail"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <Button
              type="button"
              color="soft-primary"
              className="btn-sm"
              onClick={() => {
                const data = cellProps.row.original;
                toggleViewModal(data);
                setTransaction(cellProps.row.original);
              }}
            >
              {t("view_detail")}
            </Button>
          );
        },
      },
    ];
    if (
      data?.previledge?.is_role_editable &&
      data?.previledge?.is_role_deletable
    ) {
      baseColumns.push({
        header: t("Action"),
        accessorKey: t("Action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-1">
              {(cellProps.row.original?.is_editable ||
                cellProps.row.original?.is_role_editable) && (
                  <Button
                    to="#"
                    color="none"
                    className="text-success"
                    onClick={() => {
                      const data = cellProps.row.original;
                      handleProjectBudgetExpenditureClick(data);
                    }}
                  >
                    <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                    <UncontrolledTooltip placement="top" target="edittooltip">
                      Edit
                    </UncontrolledTooltip>
                  </Button>
                )}

              {(cellProps.row.original?.is_deletable === 9 ||
                cellProps.row.original?.is_role_deletable === 9) && (
                  <Button
                    to="#"
                    color="none"
                    className="text-danger"
                    onClick={() => {
                      const data = cellProps.row.original;
                      onClickDelete(data);
                    }}
                  >
                    <i
                      className="mdi mdi-delete font-size-18"
                      id="deletetooltip"
                    />
                    <UncontrolledTooltip placement="top" target="deletetooltip">
                      Delete
                    </UncontrolledTooltip>
                  </Button>
                )}
              <Button
                to="#"
                color="none"
                className="text-secondary"
                onClick={() => handleClick(cellProps.row.original)}
              >
                <i className="mdi mdi-cog font-size-18" id="viewtooltip" />
                <UncontrolledTooltip placement="top" target="viewtooltip">
                  Detail
                </UncontrolledTooltip>
              </Button>
            </div>
          );
        },
      });
    }

    return baseColumns;
  }, [handleProjectBudgetExpenditureClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <ProjectBudgetExpenditureModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectBudgetExpenditure}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProjectBudgetExpenditure.isPending}
      />
      <>
        <div>
          <div>
            {/* <Breadcrumb /> */}
            {isLoading || isSearchLoading || project.isLoading ? (
              <Spinners />
            ) : (
              <Row>
                {/* TableContainer for displaying data */}
                <Col lg={12}>
                  <Card>
                    <CardBody>
                      <TableContainer
                        columns={columns}
                        data={
                          showSearchResult
                            ? searchResults?.data
                            : data?.data || []
                        }
                        isGlobalFilter={true}
                        isAddButton={true}
                        isCustomPageSize={true}
                        handleUserClick={handleProjectBudgetExpenditureClicks}
                        isPagination={true}
                        SearchPlaceholder={t("filter_placeholder")}
                        buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                        buttonName={t("add")}
                        tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                        theadClass="table-light"
                        pagination="pagination"
                        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                        refetch={refetch}
                        isFetching={isFetching}
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}
            <Modal isOpen={modal} toggle={toggle} className="modal-xl">
              <ModalHeader toggle={toggle} tag="h4">
                {!!isEdit
                  ? t("edit") + " " + t("project_budget_expenditure")
                  : t("add") + " " + t("project_budget_expenditure")}
              </ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                >
                  <Row>
                    <Col className="col-md-6 mb-3">
                      <Label>
                        {t("pbe_budget_year_id")}{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="pbe_budget_year_id"
                        id="pbe_budget_year_id"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.pbe_budget_year_id || ""}
                        invalid={
                          validation.touched.pbe_budget_year_id &&
                            validation.errors.pbe_budget_year_id
                            ? true
                            : false
                        }
                      >
                        <option value="">{t("select_one")}</option>
                        {budgetYearData?.data?.map((data) => (
                          <option key={data.bdy_id} value={data.bdy_id}>
                            {data.bdy_name}
                          </option>
                        ))}
                      </Input>
                      {validation.touched.pbe_budget_year_id &&
                        validation.errors.pbe_budget_year_id ? (
                        <FormFeedback type="invalid">
                          {validation.errors.pbe_budget_year_id}
                        </FormFeedback>
                      ) : null}
                    </Col>
                    <Col className="col-md-6 mb-3">
                      <Label>
                        {t("pbe_budget_month_id")}{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="pbe_budget_month_id"
                        id="pbe_budget_month_id"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.pbe_budget_month_id || ""}
                        invalid={
                          validation.touched.pbe_budget_month_id &&
                            validation.errors.pbe_budget_month_id
                            ? true
                            : false
                        }
                      >
                        <option value="">{t("select_one")}</option>
                        {budgetMonthData?.data?.map((data) => (
                          <option key={data.bdm_id} value={data.bdm_id}>
                            {data.bdm_month}
                          </option>
                        ))}
                      </Input>
                      {validation.touched.pbe_budget_month_id &&
                        validation.errors.pbe_budget_month_id ? (
                        <FormFeedback type="invalid">
                          {validation.errors.pbe_budget_month_id}
                        </FormFeedback>
                      ) : null}
                    </Col>
                    <Col className="col-md-6 mb-3">
                      <Label>
                        {t("pbe_reason")}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="pbe_reason"
                        type="text"
                        placeholder={t("pbe_reason")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.pbe_reason || ""}
                        invalid={
                          validation.touched.pbe_reason &&
                            validation.errors.pbe_reason
                            ? true
                            : false
                        }
                        maxLength={100}
                      />
                      {validation.touched.pbe_reason &&
                        validation.errors.pbe_reason ? (
                        <FormFeedback type="invalid">
                          {validation.errors.pbe_reason}
                        </FormFeedback>
                      ) : null}
                    </Col>
                    <Col className="col-md-6 mb-3">
                      <Label>
                        {t("ppe_amount")}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        name="ppe_amount"
                        type="number"
                        placeholder={t("ppe_amount")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.ppe_amount || ""}
                        invalid={
                          validation.touched.ppe_amount &&
                            validation.errors.ppe_amount
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.ppe_amount &&
                        validation.errors.ppe_amount ? (
                        <FormFeedback type="invalid">
                          {validation.errors.ppe_amount}
                        </FormFeedback>
                      ) : null}
                    </Col>

                    <Col className="col-md-6 mb-3">
                      <Label>{t("pbe_description")}</Label>
                      <Input
                        name="pbe_description"
                        type="textarea"
                        rows={2}
                        placeholder={t("pbe_description")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.pbe_description || ""}
                        invalid={
                          validation.touched.pbe_description &&
                            validation.errors.pbe_description
                            ? true
                            : false
                        }
                        maxLength={425}
                      />
                      {validation.touched.pbe_description &&
                        validation.errors.pbe_description ? (
                        <FormFeedback type="invalid">
                          {validation.errors.pbe_description}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="text-end">
                        {addProjectBudgetExpenditure.isPending ||
                          updateProjectBudgetExpenditure.isPending ? (
                          <Button
                            color="success"
                            type="submit"
                            className="save-user"
                            disabled={
                              addProjectBudgetExpenditure.isPending ||
                              updateProjectBudgetExpenditure.isPending ||
                              !validation.dirty
                            }
                          >
                            <Spinner
                              size={"sm"}
                              color="light"
                              className="me-2"
                            />
                            {t("Save")}
                          </Button>
                        ) : (
                          <Button
                            color="success"
                            type="submit"
                            className="save-user"
                            disabled={
                              addProjectBudgetExpenditure.isPending ||
                              updateProjectBudgetExpenditure.isPending ||
                              !validation.dirty
                            }
                          >
                            {t("Save")}
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Form>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </>
      {showCanvas && (
        <RightOffCanvas
          handleClick={handleClick}
          showCanvas={showCanvas}
          canvasWidth={84}
          name={""}
          id={budgetExMetaData.pbe_id}
          components={{
            [t("budget_exip_detail")]: BudgetExipDetail,
          }}
        />
      )}
    </React.Fragment>
  );
};
ProjectBudgetExpenditureModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProjectBudgetExpenditureModel;
