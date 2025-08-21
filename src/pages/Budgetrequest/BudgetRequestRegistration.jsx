import React, { useEffect, useMemo, useState, Suspense, lazy } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchBudgetRequests,
  useAddBudgetRequest,
  useUpdateBudgetRequest,
  useDeleteBudgetRequest,
} from "../../queries/budget_request_query";
import { useFetchProject } from "../../queries/project_query";
import {
  useFetchBudgetYears,
  usePopulateBudgetYears,
} from "../../queries/budgetyear_query";
import { useSearchRequestCategorys } from "../../queries/requestcategory_query";

import { useTranslation } from "react-i18next";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";
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
  Card,
  CardBody,
  Badge,
} from "reactstrap";
import { toast } from "react-toastify";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import RightOffCanvas from "../../components/Common/RightOffCanvas";
const BudgetRequestAmount = lazy(() => import("../Budgetrequestamount/index"));
const BudgetRequestTask = lazy(() => import("../Budgetrequesttask/index"));
const BudgetExSource = lazy(() => import("../Budgetexsource/index"));

const BudgetRequestModal = lazy(() => import("./BudgetRequestModal"));
const AttachFileModal = lazy(
  () => import("../../components/Common/AttachFileModal"),
);
const ConvInfoModal = lazy(
  () => import("../../pages/Conversationinformation/ConvInfoModal"),
);
import {
  alphanumericValidation,
  formattedAmountValidation,
} from "../../utils/Validation/validation";
import DatePicker from "../../components/Common/DatePicker";
import { PAGE_ID } from "../../constants/constantFile";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import {
  createKeyValueMap,
  createMultiLangKeyValueMap,
} from "../../utils/commonMethods";
import AsyncSelectField from "../../components/Common/AsyncSelectField";
import InputField from "../../components/Common/InputField";
import { toEthiopian } from "../../utils/commonMethods";

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
const BudgetRequestModel = (props) => {
  const { isActive, status, startDate, totalActualBudget } = props;
  const location = useLocation();
  const id = Number(location.pathname.split("/")[2]);
  const param = {
    project_id: id,
    request_type: "single",
    prj_total_actual_budget: totalActualBudget,
  };
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [actionModal, setActionModal] = useState(false);
  const [fileModal, setFileModal] = useState(false);
  const [convModal, setConvModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [budgetRequest, setBudgetRequest] = useState(null);

  const [budgetRequestMetaData, setBudgetRequestMetaData] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);

  const {
    data: projectStatusData,
    isLoading: isPrsLoading,
    isError: isPrsError,
  } = useFetchProjectStatuss();

  const { data, isLoading, isFetching, isError, error, refetch } =
    useFetchBudgetRequests(param);
  const {
    data: budgetYearData,
    isLoading: bdyLoading,
    isError: bdyIsError,
  } = usePopulateBudgetYears();

  const categoryParam = { rqc_gov_active: 1 };
  const {
    data: bgCategoryOptionsData,
    isLoading: isBcLoading,
    isBcError,
  } = useSearchRequestCategorys(categoryParam);
  const addBudgetRequest = useAddBudgetRequest();
  const updateBudgetRequest = useUpdateBudgetRequest();
  const deleteBudgetRequest = useDeleteBudgetRequest();

  const { userId } = useAuthUser();
  const project = useFetchProject(id, userId, true);

  const handleAddBudgetRequest = async (data) => {
    try {
      await addBudgetRequest.mutateAsync(data);
      toast.success(t("add_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(t("add_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleUpdateBudgetRequest = async (data) => {
    try {
      await updateBudgetRequest.mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(t("update_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };

  // validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      bdr_budget_year_id:
        (budgetRequest && budgetRequest.bdr_budget_year_id) || "",
      bdr_requested_amount:
        (budgetRequest && budgetRequest.bdr_requested_amount) || "",
      bdr_project_id: id,
      bdr_requested_date_ec:
        (budgetRequest && budgetRequest.bdr_requested_date_ec) || "",
      bdr_requested_date_gc:
        (budgetRequest && budgetRequest.bdr_requested_date_gc) || "",

      bdr_request_type: (budgetRequest && budgetRequest.bdr_request_type) || "",
      bdr_physical_baseline:
        (budgetRequest && budgetRequest.bdr_physical_baseline) || "",
      bdr_physical_planned:
        (budgetRequest && budgetRequest.bdr_physical_planned) || "",
      bdr_financial_baseline:
        (budgetRequest && budgetRequest.bdr_financial_baseline) || "",
      bdr_description: (budgetRequest && budgetRequest.bdr_description) || "",
      bdr_status: (budgetRequest && budgetRequest.bdr_status) || "",
      bdr_request_status:
        (budgetRequest && budgetRequest.bdr_request_status) || "",
      bdr_request_category_id:
        (budgetRequest && budgetRequest.bdr_request_category_id) || "",

      is_deletable: (budgetRequest && budgetRequest.is_deletable) || 1,
      is_editable: (budgetRequest && budgetRequest.is_editable) || 1,
    },

    validationSchema: Yup.object({
      bdr_budget_year_id: Yup.string().required(t("bdr_budget_year_id")),
      bdr_request_type: Yup.string().required(t("bdr_request_type")),
      // bdr_request_category_id: Yup.string()
      //   .required(t("bdr_request_category_id"))
      //   .test(
      //     "unique-year-category-combination",
      //     t("This category already exists for the selected budget year."),
      //     function (value) {
      //       const { bdr_budget_year_id } = this.parent;
      //       return !data?.data.some(
      //         (item) =>
      //           parseInt(item.bdr_budget_year_id) ==
      //             parseInt(bdr_budget_year_id) &&
      //           parseInt(item.bdr_request_category_id) == parseInt(value)
      //       );
      //     }
      //   ),
      bdr_request_category_id: Yup.string()
        .required(t("bdr_request_category_id"))
        .test(
          "unique-year-category-combination",
          t("This category already exists for the selected budget year."),
          function (value) {
            const { bdr_budget_year_id } = this.parent;
            const currentId = isEdit ? budgetRequest?.bdr_id : null;

            // Skip if no value selected yet
            if (!value || !bdr_budget_year_id) return true;

            return !data?.data.some(
              (item) =>
                item.bdr_id !== currentId && // Exclude current record when editing
                parseInt(item.bdr_budget_year_id) ===
                  parseInt(bdr_budget_year_id) &&
                parseInt(item.bdr_request_category_id) === parseInt(value),
            );
          },
        ),

      bdr_requested_amount: formattedAmountValidation(
        1000,
        10000000000,
        true,
      ).test(
        "total-budget-check",
        t("Requested amount exceeds remaining project budget"),
        function (value) {
          // Assuming budget category has ID 1 (confirm this from your data)
          const isBudgetCategory =
            parseInt(this.parent.bdr_request_category_id) === 1;
          if (!isBudgetCategory) return true;

          const requestedAmount = parseFloat(value) || 0;
          if (isNaN(requestedAmount)) return true;

          const currentData = data?.data || [];
          const editingId = isEdit ? budgetRequest?.bdr_id : null;

          // Calculate total without the current edited item
          const currentTotalWithoutThis = currentData.reduce((total, item) => {
            if (editingId && item.bdr_id === editingId) return total;
            if (parseInt(item.bdr_request_category_id) === 1) {
              // Only sum budget category items
              return total + Number(item.bdr_requested_amount || 0);
            }
            return total;
          }, 0);

          // Calculate new total if this amount is added/updated
          const newTotal = currentTotalWithoutThis + requestedAmount;

          return newTotal <= totalActualBudget;
        },
      ),
      bdr_requested_date_gc: Yup.string().required(t("bdr_requested_date_gc")),
      bdr_physical_baseline: Yup.number()
        .min(0, t("min_error", { field: t("bdr_physical_baseline"), min: 0 }))
        .max(
          100,
          t("max_error", { field: t("bdr_physical_baseline"), max: 100 }),
        )
        .required(t("bdr_physical_baseline")),
      bdr_physical_planned: Yup.number()
        .min(1, t("min_error", { field: t("bdr_physical_planned"), min: 1 }))
        .max(
          100,
          t("max_error", { field: t("bdr_physical_planned"), max: 100 }),
        )
        .required(t("bdr_physical_planned")),
      bdr_financial_baseline: formattedAmountValidation(0, 10000000000, true),
      bdr_description: alphanumericValidation(3, 425, false),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updatedBudgetRequest = {
          bdr_id: budgetRequest ? budgetRequest.bdr_id : 0,
          bdr_budget_year_id: parseInt(values.bdr_budget_year_id),
          bdr_requested_amount: parseFloat(values.bdr_requested_amount),
          bdr_requested_date_ec: values.bdr_requested_date_ec,
          bdr_requested_date_gc: values.bdr_requested_date_gc,
          bdr_description: values.bdr_description,
          bdr_request_status: values.bdr_request_status,
          bdr_request_type: parseInt(values.bdr_request_type),
          bdr_physical_baseline: parseInt(values.bdr_physical_baseline),
          bdr_physical_planned: parseInt(values.bdr_physical_planned),
          bdr_financial_baseline: parseFloat(values.bdr_financial_baseline),
          bdr_request_category_id: values.bdr_request_category_id,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        handleUpdateBudgetRequest(updatedBudgetRequest);
      } else {
        const newBudgetRequest = {
          bdr_budget_year_id: parseInt(values.bdr_budget_year_id),
          bdr_project_id: id,
          bdr_request_type: parseInt(values.bdr_request_type),
          bdr_physical_baseline: parseInt(values.bdr_physical_baseline),
          bdr_physical_planned: parseInt(values.bdr_physical_planned),
          bdr_financial_baseline: parseFloat(values.bdr_financial_baseline),
          bdr_requested_amount: parseFloat(values.bdr_requested_amount),
          bdr_requested_date_ec: values.bdr_requested_date_ec,
          bdr_requested_date_gc: values.bdr_requested_date_gc,
          bdr_description: values.bdr_description,
          bdr_request_status: 1,
          bdr_request_category_id: parseInt(values.bdr_request_category_id),
        };
        handleAddBudgetRequest(newBudgetRequest);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const toggleActionModal = () => setActionModal(!actionModal);
  const toggleFileModal = () => setFileModal(!fileModal);
  const toggleConvModal = () => setConvModal(!convModal);

  const budgetYearMap = useMemo(() => {
    return createKeyValueMap(budgetYearData?.data || [], "bdy_id", "bdy_name");
  }, [budgetYearData]);

  const projectStatusMap = useMemo(() => {
    return createMultiLangKeyValueMap(
      projectStatusData?.data || [],
      "prs_id",
      {
        en: "prs_status_name_en",
        am: "prs_status_name_am",
        or: "prs_status_name_or",
      },
      lang,
      (item) => item.prs_id === 5 || item.prs_id === 6,
    );
  }, [projectStatusData, lang]);

  const RequestCatagoryMap = useMemo(() => {
    return createMultiLangKeyValueMap(
      bgCategoryOptionsData?.data || [],
      "rqc_id",
      {
        en: "rqc_name_en",
        am: "rqc_name_am",
        or: "rqc_name_or",
      },
      lang,
      (category) => (status < 5 ? [1].includes(category.rqc_id) : true),
    );
  }, [bgCategoryOptionsData, status, lang]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setBudgetRequest(null);
    } else {
      setModal(true);
    }
  };

  const handleBudgetRequestClick = (arg) => {
    const budgetRequest = arg;
    setBudgetRequest({
      bdr_id: budgetRequest.bdr_id,
      bdr_budget_year_id: budgetRequest.bdr_budget_year_id,
      bdr_requested_amount: budgetRequest.bdr_requested_amount,
      bdr_project_id: budgetRequest.bdr_project_id,
      bdr_request_type: budgetRequest.bdr_request_type,
      bdr_physical_baseline: budgetRequest.bdr_physical_baseline,
      bdr_physical_planned: budgetRequest.bdr_physical_planned,
      bdr_financial_baseline: budgetRequest.bdr_financial_baseline,
      bdr_requested_date_ec: budgetRequest.bdr_requested_date_ec,
      bdr_requested_date_gc: budgetRequest.bdr_requested_date_gc,
      bdr_description: budgetRequest.bdr_description,
      bdr_request_status: budgetRequest.bdr_request_status,
      bdr_request_category_id: budgetRequest.bdr_request_category_id,
      is_deletable: budgetRequest.is_deletable,
      is_editable: budgetRequest.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (budgetRequest) => {
    setBudgetRequest(budgetRequest);
    setDeleteModal(true);
  };

  const handleDeleteBudgetRequest = async () => {
    if (budgetRequest && budgetRequest.bdr_id) {
      try {
        const id = budgetRequest.bdr_id;
        await deleteBudgetRequest.mutateAsync(id);
        toast.success(`Budget Request ${id} deleted successfully`, {
          autoClose: 2000,
        });
      } catch (error) {
        toast.error(`Failed to delete Budget Request ${budgetRequest.bdr_id}`, {
          autoClose: 2000,
        });
      }
      setDeleteModal(false);
    }
  };

  const handleBudgetRequestClicks = () => {
    setIsEdit(false);
    setBudgetRequest("");
    toggle();
  };

  const handleClick = (data) => {
    setShowCanvas(!showCanvas);
    setBudgetRequestMetaData(data);
  };

  const calculateBudgetAllocated = (currentData, editingId = null) => {
    if (!currentData || !currentData.data) return 0;

    return currentData.data.reduce((total, item) => {
      // Only count budget category items (assuming ID 1)
      if (parseInt(item.bdr_request_category_id) !== 1) return total;

      // If editing, exclude the item being edited from the total
      if (editingId && item.bdr_id === editingId) return total;

      return total + Number(item.bdr_requested_amount || 0);
    }, 0);
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "bdr_budget_year_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {budgetYearMap[cellProps.row.original.bdr_budget_year_id] || ""}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdr_request_category_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {RequestCatagoryMap[
                cellProps.row.original.bdr_request_category_id
              ] || ""}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdr_request_type",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {projectStatusMap[cellProps.row.original.bdr_request_type] || ""}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdr_requested_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                Number(
                  cellProps.row.original.bdr_requested_amount,
                ).toLocaleString(),
                30,
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdr_requested_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ getValue }) => <span>{toEthiopian(getValue()) || "-"}</span>,
      },

      {
        header: "",
        accessorKey: "bdr_released_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                Number(
                  cellProps.row.original.bdr_released_amount,
                ).toLocaleString(),
                30,
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdr_released_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ getValue }) => <span>{toEthiopian(getValue()) || "-"}</span>,
      },
      {
        header: t("bdr_request_status"),
        accessorKey: "bdr_request_status",
        enableSorting: false,
        enableColumnFilter: false,
        cell: (cellProps) => {
          const badgeClass = cellProps.row.original.color_code;
          return (
            <Badge className={`font-size-12 badge-soft-${badgeClass}`}>
              {cellProps.row.original.status_name}
            </Badge>
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
              color="primary"
              className="btn-sm"
              onClick={() => {
                const data = cellProps.row.original;
                toggleViewModal();
                setTransaction(data);
              }}
            >
              {t("view_detail")}
            </Button>
          );
        },
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
    if (1 == 1) {
      baseColumns.push({
        header: t("Action"),
        accessorKey: t("Action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              {data?.previledge?.is_role_editable == 1 &&
                cellProps.row.original?.is_editable == 1 &&
                cellProps.row.original?.bdr_request_status == 1 && (
                  <Button
                    size="sm"
                    color="none"
                    className="text-success"
                    onClick={() => {
                      const data = cellProps.row.original;
                      handleBudgetRequestClick(data);
                    }}
                  >
                    <i
                      className="mdi mdi-pencil font-size-18"
                      id="edittooltip"
                    />
                    <UncontrolledTooltip placement="top" target="edittooltip">
                      Edit
                    </UncontrolledTooltip>
                  </Button>
                )}
              {data?.previledge?.is_role_deletable == 9 &&
                cellProps.row.original?.is_deletable == 9 && (
                  <div>
                    <Button
                      size="sm"
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
                      <UncontrolledTooltip
                        placement="top"
                        target="deletetooltip"
                      >
                        Delete
                      </UncontrolledTooltip>
                    </Button>

                    <Button
                      size="sm"
                      color="none"
                      className="text-secondary me-2"
                      onClick={() => handleClick(cellProps.row.original)}
                    >
                      <i
                        className="mdi mdi-cog font-size-18"
                        id="viewtooltip"
                      />
                      <UncontrolledTooltip placement="top" target="viewtooltip">
                        Budget Request Detail
                      </UncontrolledTooltip>
                    </Button>
                  </div>
                )}
            </div>
          );
        },
      });
    }
    if (project?.data?.request_role == "approver") {
      baseColumns.push({
        header: t("take_action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm"
              onClick={() => {
                const data = cellProps.row.original;
                toggleActionModal();
                setTransaction(data);
              }}
            >
              {t("take_action")}
            </Button>
          );
        },
      });
    }
    return baseColumns;
  }, [handleBudgetRequestClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <LazyLoader>
        {modal1 && (
          <BudgetRequestModal
            isOpen={modal1}
            toggle={toggleViewModal}
            transaction={transaction}
          />
        )}
        {fileModal && (
          <AttachFileModal
            isOpen={fileModal}
            toggle={toggleFileModal}
            projectId={id}
            ownerTypeId={PAGE_ID.PROJ_BUDGET_REQUEST}
            ownerId={transaction?.bdr_id}
          />
        )}
        {convModal && (
          <ConvInfoModal
            isOpen={convModal}
            toggle={toggleConvModal}
            ownerTypeId={PAGE_ID.PROJ_BUDGET_REQUEST}
            ownerId={transaction?.bdr_id}
          />
        )}
      </LazyLoader>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteBudgetRequest}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteBudgetRequest.isPending}
      />
      {isLoading || project.isLoading ? (
        <Spinners />
      ) : (
        <TableContainer
          columns={columns}
          data={data?.data}
          isGlobalFilter={true}
          isAddButton={data?.previledge?.is_role_can_add == 1}
          isCustomPageSize={true}
          handleUserClick={handleBudgetRequestClicks}
          isPagination={true}
          SearchPlaceholder={t("filter_placeholder")}
          buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
          buttonName={t("add")}
          tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
          theadClass="table-light"
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
          infoIcon={true}
          refetch={refetch}
          isFetching={isFetching}
        />
      )}
      <Modal isOpen={modal} toggle={toggle} className="modal-xl">
        <ModalHeader toggle={toggle} tag="h4">
          {!!isEdit
            ? t("edit") + " " + t("budget_request")
            : t("add") + " " + t("budget_request")}
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
              <Col className="col-12 mb-3">
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>{t("Total_Project_Budget")} : </strong>{" "}
                        {totalActualBudget
                          ? totalActualBudget.toLocaleString()
                          : "0"}
                      </div>
                      <div>
                        <strong>{t("Allocated")} : </strong>{" "}
                        {calculateBudgetAllocated(data).toLocaleString()}
                      </div>
                      <div
                        className={
                          calculateBudgetAllocated(data) > totalActualBudget
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        <strong>{t("Remaining")} : </strong>{" "}
                        {(
                          totalActualBudget - calculateBudgetAllocated(data)
                        ).toLocaleString()}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <AsyncSelectField
                fieldId="bdr_budget_year_id"
                validation={validation}
                isRequired
                className="col-md-4 mb-3"
                optionMap={budgetYearMap}
                isLoading={bdyLoading}
                isError={bdyIsError}
              />
              <AsyncSelectField
                fieldId="bdr_request_type"
                validation={validation}
                isRequired
                className="col-md-4 mb-3"
                optionMap={projectStatusMap}
                isLoading={isPrsLoading}
                isError={isPrsError}
              />
              <AsyncSelectField
                fieldId="bdr_request_category_id"
                validation={validation}
                isRequired
                className="col-md-4 mb-3"
                optionMap={RequestCatagoryMap}
                isLoading={isBcLoading}
                isError={isBcError}
              />
              <FormattedAmountField
                validation={validation}
                fieldId={"bdr_requested_amount"}
                isRequired={true}
                className="col-md-4 mb-3"
                allowDecimal={true}
              />
              <FormattedAmountField
                validation={validation}
                fieldId={"bdr_physical_planned"}
                label={t("bdr_physical_planned") + " " + t("in_percent")}
                isRequired={true}
                className="col-md-4 mb-3"
                allowDecimal={true}
              />
              <FormattedAmountField
                validation={validation}
                fieldId={"bdr_physical_baseline"}
                label={t("bdr_physical_baseline") + " " + t("in_percent")}
                isRequired={true}
                className="col-md-4 mb-3"
                allowDecimal={true}
              />
              <FormattedAmountField
                validation={validation}
                fieldId={"bdr_financial_baseline"}
                isRequired={true}
                className="col-md-4 mb-3"
                allowDecimal={true}
              />
              <Col className="col-md-4 mb-3">
                <DatePicker
                  isRequired={true}
                  validation={validation}
                  componentId="bdr_requested_date_gc"
                />
              </Col>
              <InputField
                type="textarea"
                validation={validation}
                fieldId={"bdr_description"}
                isRequired={false}
                className="col-md-12 mb-3"
                maxLength={400}
              />
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  {addBudgetRequest.isPending ||
                  updateBudgetRequest.isPending ? (
                    <Button
                      color="success"
                      type="submit"
                      className="save-user"
                      disabled={
                        addBudgetRequest.isPending ||
                        updateBudgetRequest.isPending ||
                        !validation.dirty
                      }
                    >
                      <Spinner size={"sm"} color="#fff" className="me-2" />
                      {t("Save")}
                    </Button>
                  ) : (
                    <Button
                      color="success"
                      type="submit"
                      className="save-user"
                      disabled={
                        addBudgetRequest.isPending ||
                        updateBudgetRequest.isPending ||
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
      {showCanvas && (
        <RightOffCanvas
          handleClick={handleClick}
          showCanvas={showCanvas}
          canvasWidth={84}
          name={t("budget_request")}
          id={budgetRequestMetaData.bdr_id}
          components={{
            [t("budget_request_amount")]: BudgetRequestAmount,
            [t("budget_request_task")]: BudgetRequestTask,
            [t("budget_ex_source")]: BudgetExSource,
          }}
        />
      )}
    </React.Fragment>
  );
};
BudgetRequestModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default BudgetRequestModel;
