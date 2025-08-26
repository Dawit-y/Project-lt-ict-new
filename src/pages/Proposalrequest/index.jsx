import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchProposalRequests,
  useSearchProposalRequests,
  useAddProposalRequest,
  useDeleteProposalRequest,
  useUpdateProposalRequest,
} from "../../queries/proposalrequest_query";
import { useFetchRequestStatuss } from "../../queries/requeststatus_query";
import { useFetchRequestCategorys } from "../../queries/requestcategory_query";
import ProposalRequestModal from "./ProposalRequestModal";
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
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import { createSelectOptions } from "../../utils/commonMethods";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import DatePicker from "../../components/Common/DatePicker";
import { alphanumericValidation } from "../../utils/Validation/validation";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProposalRequestModel = (props) => {
  document.title = "Proposal Request";

  const { passedId, isActive } = props;
  const param = { project_id: passedId };

  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [proposalRequest, setProposalRequest] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } = useFetchProposalRequests(
    param,
    isActive,
  );

  const { data: statusData } = useFetchRequestStatuss();
  const statusOptions = createSelectOptions(
    statusData?.data || [],
    "rqs_id",
    "rqs_name_or",
  );
  const statusMap = useMemo(() => {
    return (
      statusData?.data?.reduce((acc, year) => {
        acc[year.rqs_id] = year.rqs_name_or;
        return acc;
      }, {}) || {}
    );
  }, [statusData]);

  const { data: categoryData } = useFetchRequestCategorys();
  const categoryOptions = createSelectOptions(
    categoryData?.data || [],
    "rqc_id",
    "rqc_name_or",
  );

  const categoryMap = useMemo(() => {
    return (
      categoryData?.data?.reduce((acc, year) => {
        acc[year.rqc_id] = year.rqc_name_or;
        return acc;
      }, {}) || {}
    );
  }, [categoryData]);

  const addProposalRequest = useAddProposalRequest();
  const updateProposalRequest = useUpdateProposalRequest();
  const deleteProposalRequest = useDeleteProposalRequest();
  //START CRUD
  const handleAddProposalRequest = async (data) => {
		try {
			await addProposalRequest.mutateAsync(data);
			toast.success(t("add_success"), {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("add_failure"), { autoClose: 3000 });
			}
		}
	};
	const handleUpdateProposalRequest = async (data) => {
		try {
			await updateProposalRequest.mutateAsync(data);
			toast.success(t("update_success"), {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};
  const handleDeleteProposalRequest = async () => {
    if (proposalRequest && proposalRequest.prr_id) {
      try {
        const id = proposalRequest.prr_id;
        await deleteProposalRequest.mutateAsync(id);
        toast.success(t("delete_success"), {
					autoClose: 3000,
				});
      } catch (error) {
        toast.error(t("delete_failure"), {
					autoClose: 3000,
				});
      }
      setDeleteModal(false);
    }
  };

  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,
    initialValues: {
      prr_title: (proposalRequest && proposalRequest.prr_title) || "",
      prr_project_id: (proposalRequest && proposalRequest.prr_project_id) || "",
      prr_request_status_id:
        (proposalRequest && proposalRequest.prr_request_status_id) || "",
      prr_request_category_id:
        (proposalRequest && proposalRequest.prr_request_category_id) || "",
      prr_request_date_et:
        (proposalRequest && proposalRequest.prr_request_date_et) || "",
      prr_request_date_gc:
        (proposalRequest && proposalRequest.prr_request_date_gc) || "",
      prr_description:
        (proposalRequest && proposalRequest.prr_description) || "",
      prr_status: (proposalRequest && proposalRequest.prr_status) || "",

      is_deletable: (proposalRequest && proposalRequest.is_deletable) || 1,
      is_editable: (proposalRequest && proposalRequest.is_editable) || 1,
    },
    validationSchema: Yup.object({
      prr_title: alphanumericValidation(2, 100, true),
      prr_request_status_id: Yup.string().required(t("prr_request_status_id")),
      prr_request_category_id: Yup.string().required(
        t("prr_request_category_id"),
      ),
      prr_request_date_gc: Yup.string().required(t("prr_request_date_gc")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProposalRequest = {
          prr_id: proposalRequest?.prr_id,
          prr_title: values.prr_title,
          prr_project_id: passedId,
          prr_request_status_id: values.prr_request_status_id,
          prr_request_category_id: values.prr_request_category_id,
          prr_request_date_et: values.prr_request_date_et,
          prr_request_date_gc: values.prr_request_date_gc,
          prr_description: values.prr_description,
          prr_status: 0,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProposalRequest
        handleUpdateProposalRequest(updateProposalRequest);
      } else {
        const newProposalRequest = {
          prr_title: values.prr_title,
          prr_project_id: passedId,
          prr_request_status_id: values.prr_request_status_id,
          prr_request_category_id: values.prr_request_category_id,
          prr_request_date_et: values.prr_request_date_et,
          prr_request_date_gc: values.prr_request_date_gc,
          prr_description: values.prr_description,
          prr_status: 0,
        };
        // save new ProposalRequest
        handleAddProposalRequest(newProposalRequest);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch ProposalRequest on component mount
  useEffect(() => {
    setProposalRequest(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProposalRequest(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProposalRequest(null);
    } else {
      setModal(true);
    }
  };
  const handleProposalRequestClick = (arg) => {
    const proposalRequest = arg;
    // console.log("handleProposalRequestClick", proposalRequest);
    setProposalRequest({
      prr_id: proposalRequest.prr_id,
      prr_title: proposalRequest.prr_title,
      prr_project_id: proposalRequest.prr_project_id,
      prr_request_status_id: proposalRequest.prr_request_status_id,
      prr_request_category_id: proposalRequest.prr_request_category_id,
      prr_request_date_et: proposalRequest.prr_request_date_et,
      prr_request_date_gc: proposalRequest.prr_request_date_gc,
      prr_description: proposalRequest.prr_description,
      prr_status: proposalRequest.prr_status,
      is_deletable: proposalRequest.is_deletable,
      is_editable: proposalRequest.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (proposalRequest) => {
    setProposalRequest(proposalRequest);
    setDeleteModal(true);
  };
  const handleProposalRequestClicks = () => {
    setIsEdit(false);
    setProposalRequest("");
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
        accessorKey: "prr_title",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prr_title, 30) || "-"}
            </span>
          );
        },
      },

      {
        header: "",
        accessorKey: "prr_request_status_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {/* {truncateText(cellProps.row.original.prr_request_status_id, 30) ||
                "-"} */}
              {statusMap[cellProps.row.original.prr_request_status_id] || ""}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prr_request_category_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {/* {truncateText(
                cellProps.row.original.prr_request_category_id,
                30
              ) || "-"} */}
              {categoryMap[cellProps.row.original.prr_request_category_id] ||
                ""}
            </span>
          );
        },
      },

      {
        header: "",
        accessorKey: "prr_request_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prr_request_date_gc, 30) ||
                "-"}
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
              color="primary"
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
      data?.previledge?.is_role_editable == 1 ||
      data?.previledge?.is_role_deletable == 1
    ) {
      baseColumns.push({
				header: t("Action"),
				accessorKey: t("Action"),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (cellProps) => {
					return (
						<div className="d-flex gap-3">
							{cellProps.row.original.is_editable == 1 && (
								<Link
									to="#"
									className="text-success"
									onClick={() => {
										const data = cellProps.row.original;
										handleProposalRequestClick(data);
									}}
								>
									<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
									<UncontrolledTooltip placement="top" target="edittooltip">
										Edit
									</UncontrolledTooltip>
								</Link>
							)}
							{cellProps.row.original.is_deletable == 1 && (
								<Link
									to="#"
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
								</Link>
							)}
						</div>
					);
				},
			});
    }
    return baseColumns;
  }, [handleProposalRequestClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <ProposalRequestModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProposalRequest}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProposalRequest.isPending}
      />
      {isLoading || isSearchLoading ? (
        <Spinners />
      ) : (
        <TableContainer
          columns={columns}
          data={showSearchResult ? searchResults?.data : data?.data || []}
          isGlobalFilter={true}
          isAddButton={data?.previledge?.is_role_can_add == 1}
          isCustomPageSize={true}
          handleUserClick={handleProposalRequestClicks}
          isPagination={true}
          // SearchPlaceholder="26 records..."
          SearchPlaceholder={26 + " " + t("Results") + "..."}
          buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
          buttonName={t("add")}
          tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
          theadClass="table-light"
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
        />
      )}
      <Modal isOpen={modal} toggle={toggle} className="modal-xl">
        <ModalHeader toggle={toggle} tag="h4">
          {!!isEdit
            ? t("edit") + " " + t("proposal_request")
            : t("add") + " " + t("proposal_request")}
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
                  {t("prr_title")}
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  name="prr_title"
                  type="text"
                  placeholder={t("prr_title")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.prr_title || ""}
                  invalid={
                    validation.touched.prr_title && validation.errors.prr_title
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.prr_title && validation.errors.prr_title ? (
                  <FormFeedback type="invalid">
                    {validation.errors.prr_title}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col className="col-md-6 mb-3">
                <Label>
                  {t("prr_request_status_id")}
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  name="prr_request_status_id"
                  type="select"
                  className="form-select"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.prr_request_status_id || ""}
                  invalid={
                    validation.touched.prr_request_status_id &&
                    validation.errors.prr_request_status_id
                      ? true
                      : false
                  }
                >
                  <option value={null}>{t("select request status")}</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(`${option.label}`)}
                    </option>
                  ))}
                </Input>
                {validation.touched.prr_request_status_id &&
                validation.errors.prr_request_status_id ? (
                  <FormFeedback type="invalid">
                    {validation.errors.prr_request_status_id}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col className="col-md-6 mb-3">
                <Label>
                  {t("prr_request_category_id")}
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  name="prr_request_category_id"
                  type="select"
                  className="form-select"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.prr_request_category_id || ""}
                  invalid={
                    validation.touched.prr_request_category_id &&
                    validation.errors.prr_request_category_id
                      ? true
                      : false
                  }
                >
                  <option value={null}>{t("select request category")}</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(`${option.label}`)}
                    </option>
                  ))}
                </Input>
                {validation.touched.prr_request_category_id &&
                validation.errors.prr_request_category_id ? (
                  <FormFeedback type="invalid">
                    {validation.errors.prr_request_category_id}
                  </FormFeedback>
                ) : null}
              </Col>
              {/* <Col className="col-md-6 mb-3">
                <Label>{t("prr_request_date_et")}</Label>
                <Input
                  name="prr_request_date_et"
                  type="text"
                  placeholder={t("prr_request_date_et")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.prr_request_date_et || ""}
                  invalid={
                    validation.touched.prr_request_date_et &&
                    validation.errors.prr_request_date_et
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.prr_request_date_et &&
                validation.errors.prr_request_date_et ? (
                  <FormFeedback type="invalid">
                    {validation.errors.prr_request_date_et}
                  </FormFeedback>
                ) : null}
              </Col> */}
              <Col className="col-md-6 mb-3">
                <Label>{t("prr_request_date_gc")}</Label>
                <DatePicker
                  isRequired={true}
                  validation={validation}
                  componentId={"prr_request_date_gc"}
                />
              </Col>
              <Col className="col-md-12 mb-3">
                <Label>{t("prr_description")}</Label>
                <Input
                  name="prr_description"
                  type="textarea"
                  rows={5}
                  placeholder={t("prr_description")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.prr_description || ""}
                  invalid={
                    validation.touched.prr_description &&
                    validation.errors.prr_description
                      ? true
                      : false
                  }
                />
                {validation.touched.prr_description &&
                validation.errors.prr_description ? (
                  <FormFeedback type="invalid">
                    {validation.errors.prr_description}
                  </FormFeedback>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  {addProposalRequest.isPending ||
                  updateProposalRequest.isPending ? (
                    <Button
                      color="success"
                      type="submit"
                      className="save-user"
                      disabled={
                        addProposalRequest.isPending ||
                        updateProposalRequest.isPending ||
                        !validation.dirty
                      }
                    >
                      <Spinner size={"sm"} color="light" className="me-2" />
                      {t("Save")}
                    </Button>
                  ) : (
                    <Button
                      color="success"
                      type="submit"
                      className="save-user"
                      disabled={
                        addProposalRequest.isPending ||
                        updateProposalRequest.isPending ||
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
    </React.Fragment>
  );
};
ProposalRequestModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProposalRequestModel;
