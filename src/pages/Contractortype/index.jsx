import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import SearchComponent from "../../components/Common/SearchComponent";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import {
  useFetchContractorTypes,
  useSearchContractorTypes,
  useAddContractorType,
  useDeleteContractorType,
  useUpdateContractorType,
} from "../../queries/contractortype_query";
import ContractorTypeModal from "./ContractorTypeModal";
import { useTranslation } from "react-i18next";

import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

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
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ContractorTypeModel = () => {
  //meta title
  document.title = " ContractorType";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [contractorType, setContractorType] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } =
    useFetchContractorTypes();

  const addContractorType = useAddContractorType();
  const updateContractorType = useUpdateContractorType();
  const deleteContractorType = useDeleteContractorType();
  //START CRUD
  const handleAddContractorType = async (data) => {
    try {
      await addContractorType.mutateAsync(data);
      toast.success(`Data added successfully`, {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to add data", {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleUpdateContractorType = async (data) => {
    try {
      await updateContractorType.mutateAsync(data);
      toast.success(`data updated successfully`, {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(`Failed to update Data`, {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleDeleteContractorType = async () => {
    if (contractorType && contractorType.cnt_id) {
      try {
        const id = contractorType.cnt_id;
        await deleteContractorType.mutateAsync(id);
        toast.success(`Data deleted successfully`, {
          autoClose: 2000,
        });
      } catch (error) {
        toast.error(`Failed to delete Data`, {
          autoClose: 2000,
        });
      }
      setDeleteModal(false);
    }
  };
  //END CRUD
  //START FOREIGN CALLS

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      cnt_type_name_or:
        (contractorType && contractorType.cnt_type_name_or) || "",
      cnt_type_name_am:
        (contractorType && contractorType.cnt_type_name_am) || "",
      cnt_type_name_en:
        (contractorType && contractorType.cnt_type_name_en) || "",
      cnt_description: (contractorType && contractorType.cnt_description) || "",
      cnt_status: (contractorType && contractorType.cnt_status) || "",

      is_deletable: (contractorType && contractorType.is_deletable) || 1,
      is_editable: (contractorType && contractorType.is_editable) || 1,
    },

    validationSchema: Yup.object({
      cnt_type_name_or: Yup.string()
        .required(t("cnt_type_name_or"))
        .test("unique-cnt_type_name_or", t("Already exists"), (value) => {
          return !data?.data.some(
            (item) =>
              item.cnt_type_name_or == value &&
              item.cnt_id !== contractorType?.cnt_id
          );
        }),
      cnt_type_name_am: Yup.string().required(t("cnt_type_name_am")),
      cnt_type_name_en: Yup.string().required(t("cnt_type_name_en")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateContractorType = {
          cnt_id: contractorType?.cnt_id,
          cnt_type_name_or: values.cnt_type_name_or,
          cnt_type_name_am: values.cnt_type_name_am,
          cnt_type_name_en: values.cnt_type_name_en,
          cnt_description: values.cnt_description,
          cnt_status: values.cnt_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ContractorType
        handleUpdateContractorType(updateContractorType);
        validation.resetForm();
      } else {
        const newContractorType = {
          cnt_type_name_or: values.cnt_type_name_or,
          cnt_type_name_am: values.cnt_type_name_am,
          cnt_type_name_en: values.cnt_type_name_en,
          cnt_description: values.cnt_description,
          cnt_status: values.cnt_status,
        };
        // save new ContractorType
        handleAddContractorType(newContractorType);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch ContractorType on component mount
  useEffect(() => {
    setContractorType(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setContractorType(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setContractorType(null);
    } else {
      setModal(true);
    }
  };

  const handleContractorTypeClick = (arg) => {
    const contractorType = arg;
    // console.log("handleContractorTypeClick", contractorType);
    setContractorType({
      cnt_id: contractorType.cnt_id,
      cnt_type_name_or: contractorType.cnt_type_name_or,
      cnt_type_name_am: contractorType.cnt_type_name_am,
      cnt_type_name_en: contractorType.cnt_type_name_en,
      cnt_description: contractorType.cnt_description,
      cnt_status: contractorType.cnt_status,

      is_deletable: contractorType.is_deletable,
      is_editable: contractorType.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (contractorType) => {
    setContractorType(contractorType);
    setDeleteModal(true);
  };

  const handleContractorTypeClicks = () => {
    setIsEdit(false);
    setContractorType("");
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
        accessorKey: "cnt_type_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.cnt_type_name_or, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "cnt_type_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.cnt_type_name_am, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "cnt_type_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.cnt_type_name_en, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "cnt_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.cnt_description, 30) || "-"}
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
            <div className="d-flex gap-3">
              {cellProps.row.original.is_editable && (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleContractorTypeClick(data);
                  }}
                >
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </Link>
              )}

              {cellProps.row.original.is_deletable && (
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
  }, [handleContractorTypeClick, toggleViewModal, onClickDelete]);

  return (
    <React.Fragment>
      <ContractorTypeModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteContractorType}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteContractorType.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("contractor_type")}
            breadcrumbItem={t("contractor_type")}
          />
          <AdvancedSearch
            searchHook={useSearchContractorTypes}
            textSearchKeys={["cnt_type_name_or"]}
            dropdownSearchKeys={[]}
            checkboxSearchKeys={[]}
            onSearchResult={handleSearchResults}
            setIsSearchLoading={setIsSearchLoading}
            setSearchResults={setSearchResults}
            setShowSearchResult={setShowSearchResult}
          />
          {isLoading || isSearchLoading ? (
            <Spinners />
          ) : (
            <Row>
              <Col xs="12">
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
                      handleUserClick={handleContractorTypeClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("contractor_type")}
                      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                      theadClass="table-light"
                      pagination="pagination"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          <Modal isOpen={modal} toggle={toggle} className="modal-xl">
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit
                ? t("edit") + " " + t("contractor_type")
                : t("add") + " " + t("contractor_type")}
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
                    <Label>{t("cnt_type_name_or")}</Label>
                    <Input
                      name="cnt_type_name_or"
                      type="text"
                      placeholder={t("cnt_type_name_or")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.cnt_type_name_or || ""}
                      invalid={
                        validation.touched.cnt_type_name_or &&
                        validation.errors.cnt_type_name_or
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.cnt_type_name_or &&
                    validation.errors.cnt_type_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.cnt_type_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("cnt_type_name_am")}</Label>
                    <Input
                      name="cnt_type_name_am"
                      type="text"
                      placeholder={t("cnt_type_name_am")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.cnt_type_name_am || ""}
                      invalid={
                        validation.touched.cnt_type_name_am &&
                        validation.errors.cnt_type_name_am
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.cnt_type_name_am &&
                    validation.errors.cnt_type_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.cnt_type_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("cnt_type_name_en")}</Label>
                    <Input
                      name="cnt_type_name_en"
                      type="text"
                      placeholder={t("cnt_type_name_en")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.cnt_type_name_en || ""}
                      invalid={
                        validation.touched.cnt_type_name_en &&
                        validation.errors.cnt_type_name_en
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.cnt_type_name_en &&
                    validation.errors.cnt_type_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.cnt_type_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("cnt_description")}</Label>
                    <Input
                      name="cnt_description"
                      type="textarea"
                      placeholder={t("cnt_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.cnt_description || ""}
                      invalid={
                        validation.touched.cnt_description &&
                        validation.errors.cnt_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.cnt_description &&
                    validation.errors.cnt_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.cnt_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addContractorType.isPending ||
                      updateContractorType.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addContractorType.isPending ||
                            updateContractorType.isPending ||
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
                            addContractorType.isPending ||
                            updateContractorType.isPending ||
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
      <ToastContainer />
    </React.Fragment>
  );
};
ContractorTypeModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ContractorTypeModel;
