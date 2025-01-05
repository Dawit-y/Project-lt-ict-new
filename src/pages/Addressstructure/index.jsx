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
  getAddressStructure as onGetAddressStructure,
  addAddressStructure as onAddAddressStructure,
  updateAddressStructure as onUpdateAddressStructure,
  deleteAddressStructure as onDeleteAddressStructure,
} from "../../store/addressstructure/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import AddressStructureModal from "./AddressStructureModal";
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
  FormGroup,
  Badge,
} from "reactstrap";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const AddressStructureModel = () => {
  //meta title
  document.title = " AddressStructure";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [addressStructure, setAddressStructure] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      add_name_or: (addressStructure && addressStructure.add_name_or) || "",
      add_name_am: (addressStructure && addressStructure.add_name_am) || "",
      add_name_en: (addressStructure && addressStructure.add_name_en) || "",
      add_type: (addressStructure && addressStructure.add_type) || "",
      add_parent_id: (addressStructure && addressStructure.add_parent_id) || "",
      add_phone: (addressStructure && addressStructure.add_phone) || "",
      add_description:
        (addressStructure && addressStructure.add_description) || "",
      add_status: (addressStructure && addressStructure.add_status) || "",

      is_deletable: (addressStructure && addressStructure.is_deletable) || 1,
      is_editable: (addressStructure && addressStructure.is_editable) || 1,
    },

    validationSchema: Yup.object({
      add_name_or: Yup.string().required(t("add_name_or")),
      add_name_am: Yup.string().required(t("add_name_am")),
      add_name_en: Yup.string().required(t("add_name_en")),
      add_type: Yup.string().required(t("add_type")),
      add_parent_id: Yup.string().required(t("add_parent_id")),
      add_phone: Yup.string().required(t("add_phone")),
      add_description: Yup.string().required(t("add_description")),
      add_status: Yup.string().required(t("add_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateAddressStructure = {
          add_id: addressStructure ? addressStructure.add_id : 0,
          add_name_or: values.add_name_or,
          add_name_am: values.add_name_am,
          add_name_en: values.add_name_en,
          add_type: values.add_type,
          add_parent_id: values.add_parent_id,
          add_phone: values.add_phone,
          add_description: values.add_description,
          add_status: values.add_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update AddressStructure
        dispatch(onUpdateAddressStructure(updateAddressStructure));
        validation.resetForm();
      } else {
        const newAddressStructure = {
          add_name_or: values.add_name_or,
          add_name_am: values.add_name_am,
          add_name_en: values.add_name_en,
          add_type: values.add_type,
          add_parent_id: values.add_parent_id,
          add_phone: values.add_phone,
          add_description: values.add_description,
          add_status: values.add_status,
        };
        // save new AddressStructures
        dispatch(onAddAddressStructure(newAddressStructure));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch AddressStructure on component mount
  useEffect(() => {
    dispatch(onGetAddressStructure());
  }, [dispatch]);

  const addressStructureProperties = createSelector(
    (state) => state.AddressStructureR, // this is geting from  reducer
    (AddressStructureReducer) => ({
      // this is from Project.reducer
      addressStructure: AddressStructureReducer.addressStructure,
      loading: AddressStructureReducer.loading,
      update_loading: AddressStructureReducer.update_loading,
    })
  );

  const {
    addressStructure: { data, previledge },
    loading,
    update_loading,
  } = useSelector(addressStructureProperties);

  useEffect(() => {
    console.log("update_loading in useEffect", update_loading);
    setModal(false);
  }, [update_loading]);

  const selectSearchProperties = createSelector(
    (state) => state.search,
    (search) => ({
      results: search.results,
    })
  );

  const { results } = useSelector(selectSearchProperties);

  const [isLoading, setLoading] = useState(loading);
  useEffect(() => {
    setAddressStructure(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setAddressStructure(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setAddressStructure(null);
    } else {
      setModal(true);
    }
  };

  const handleAddressStructureClick = (arg) => {
    const addressStructure = arg;
    // console.log("handleAddressStructureClick", addressStructure);
    setAddressStructure({
      add_id: addressStructure.add_id,
      add_name_or: addressStructure.add_name_or,
      add_name_am: addressStructure.add_name_am,
      add_name_en: addressStructure.add_name_en,
      add_type: addressStructure.add_type,
      add_parent_id: addressStructure.add_parent_id,
      add_phone: addressStructure.add_phone,
      add_description: addressStructure.add_description,
      add_status: addressStructure.add_status,

      is_deletable: addressStructure.is_deletable,
      is_editable: addressStructure.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (addressStructure) => {
    setAddressStructure(addressStructure);
    setDeleteModal(true);
  };

  const handleDeleteAddressStructure = () => {
    if (addressStructure && addressStructure.add_id) {
      dispatch(onDeleteAddressStructure(addressStructure.add_id));
      setDeleteModal(false);
    }
  };
  const handleAddressStructureClicks = () => {
    setIsEdit(false);
    setAddressStructure("");
    toggle();
  };
  const handleSearch = () => {
    setSearchLoading(true); // Set loading to true when search is initiated// Update filtered data with search results
    setShowSearchResults(true); // Show search results
    setSearchLoading(false);
  };

  const handleClearSearch = () => {
    setShowSearchResults(false);
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "add_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.add_name_or, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "add_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.add_name_am, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "add_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.add_name_en, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "add_type",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.add_type, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "add_parent_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.add_parent_id, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "add_phone",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.add_phone, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "add_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.add_description, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "add_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.add_status, 30) ||
                `${cellProps.row.original.add_status}`}
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
    if (previledge?.is_role_editable && previledge?.is_role_deletable) {
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
                    handleAddressStructureClick(data);
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
  }, [handleAddressStructureClick, toggleViewModal, onClickDelete]);

  if (isError) {
    <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <AddressStructureModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteAddressStructure}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("address_structure")}
            breadcrumbItem={t("address_structure")}
          />
          {isLoading || searchLoading ? (
            <Spinners setLoading={setLoading} />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={showSearchResults ? results : data}
                      isGlobalFilter={true}
                      isAddButton={true}
                      isCustomPageSize={true}
                      handleUserClick={handleAddressStructureClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={t("filter_placeholder")}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("address_structure")}
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
                ? t("edit") + " " + t("address_structure")
                : t("add") + " " + t("address_structure")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateAddressStructure(validation.values, modalCallback);
                  } else {
                    onAddAddressStructure(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("add_name_or")}</Label>
                    <Input
                      name="add_name_or"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.add_name_or || ""}
                      invalid={
                        validation.touched.add_name_or &&
                        validation.errors.add_name_or
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.add_name_or &&
                    validation.errors.add_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.add_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("add_name_am")}</Label>
                    <Input
                      name="add_name_am"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.add_name_am || ""}
                      invalid={
                        validation.touched.add_name_am &&
                        validation.errors.add_name_am
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.add_name_am &&
                    validation.errors.add_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.add_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("add_name_en")}</Label>
                    <Input
                      name="add_name_en"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.add_name_en || ""}
                      invalid={
                        validation.touched.add_name_en &&
                        validation.errors.add_name_en
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.add_name_en &&
                    validation.errors.add_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.add_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("add_type")}</Label>
                    <Input
                      name="add_type"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.add_type || ""}
                      invalid={
                        validation.touched.add_type &&
                        validation.errors.add_type
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.add_type &&
                    validation.errors.add_type ? (
                      <FormFeedback type="invalid">
                        {validation.errors.add_type}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("add_parent_id")}</Label>
                    <Input
                      name="add_parent_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.add_parent_id || ""}
                      invalid={
                        validation.touched.add_parent_id &&
                        validation.errors.add_parent_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.add_parent_id &&
                    validation.errors.add_parent_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.add_parent_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("add_phone")}</Label>
                    <Input
                      name="add_phone"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.add_phone || ""}
                      invalid={
                        validation.touched.add_phone &&
                        validation.errors.add_phone
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.add_phone &&
                    validation.errors.add_phone ? (
                      <FormFeedback type="invalid">
                        {validation.errors.add_phone}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("add_description")}</Label>
                    <Input
                      name="add_description"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.add_description || ""}
                      invalid={
                        validation.touched.add_description &&
                        validation.errors.add_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.add_description &&
                    validation.errors.add_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.add_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("add_status")}</Label>
                    <Input
                      name="add_status"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.add_status || ""}
                      invalid={
                        validation.touched.add_status &&
                        validation.errors.add_status
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.add_status &&
                    validation.errors.add_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.add_status}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {update_loading ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={update_loading || !validation.dirty}
                        >
                          <Spinner size={"sm"} color="#fff" />
                          {t("Save")}
                        </Button>
                      ) : (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={update_loading || !validation.dirty}
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
    </React.Fragment>
  );
};
AddressStructureModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default AddressStructureModel;
