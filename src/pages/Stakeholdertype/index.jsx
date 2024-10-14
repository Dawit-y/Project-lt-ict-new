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
  getStakeholderType as onGetStakeholderType,
  addStakeholderType as onAddStakeholderType,
  updateStakeholderType as onUpdateStakeholderType,
  deleteStakeholderType as onDeleteStakeholderType,
} from "../../store/stakeholdertype/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import StakeholderTypeModal from "./StakeholderTypeModal";
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
import { ToastContainer } from "react-toastify";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const StakeholderTypeModel = () => {
  //meta title
  document.title = " StakeholderType";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [stakeholderType, setStakeholderType] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      sht_type_name_or:
        (stakeholderType && stakeholderType.sht_type_name_or) || "",
      sht_type_name_am:
        (stakeholderType && stakeholderType.sht_type_name_am) || "",
      sht_type_name_en:
        (stakeholderType && stakeholderType.sht_type_name_en) || "",
      sht_description:
        (stakeholderType && stakeholderType.sht_description) || "",
      sht_status: (stakeholderType && stakeholderType.sht_status) || "",

      is_deletable: (stakeholderType && stakeholderType.is_deletable) || 1,
      is_editable: (stakeholderType && stakeholderType.is_editable) || 1,
    },

    validationSchema: Yup.object({
      sht_type_name_or: Yup.string().required(t("sht_type_name_or")),
      sht_type_name_am: Yup.string().required(t("sht_type_name_am")),
      sht_type_name_en: Yup.string().required(t("sht_type_name_en")),
      sht_description: Yup.string().required(t("sht_description")),
      sht_status: Yup.string().required(t("sht_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateStakeholderType = {
          sht_id: stakeholderType ? stakeholderType.sht_id : 0,
          // sht_id:stakeholderType.sht_id,
          sht_type_name_or: values.sht_type_name_or,
          sht_type_name_am: values.sht_type_name_am,
          sht_type_name_en: values.sht_type_name_en,
          sht_description: values.sht_description,
          sht_status: values.sht_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update StakeholderType
        dispatch(onUpdateStakeholderType(updateStakeholderType));
        validation.resetForm();
      } else {
        const newStakeholderType = {
          sht_type_name_or: values.sht_type_name_or,
          sht_type_name_am: values.sht_type_name_am,
          sht_type_name_en: values.sht_type_name_en,
          sht_description: values.sht_description,
          sht_status: values.sht_status,
        };
        // save new StakeholderTypes
        dispatch(onAddStakeholderType(newStakeholderType));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch StakeholderType on component mount
  useEffect(() => {
    dispatch(onGetStakeholderType());
  }, [dispatch]);

  const stakeholderTypeProperties = createSelector(
    (state) => state.StakeholderTypeR, // this is geting from  reducer
    (StakeholderTypeReducer) => ({
      // this is from Project.reducer
      stakeholderType: StakeholderTypeReducer.stakeholderType,
      loading: StakeholderTypeReducer.loading,
      update_loading: StakeholderTypeReducer.update_loading,
    })
  );

  const {
    stakeholderType: { data, previledge },
    loading,
    update_loading,
  } = useSelector(stakeholderTypeProperties);

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
    setStakeholderType(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setStakeholderType(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setStakeholderType(null);
    } else {
      setModal(true);
    }
  };

  const handleStakeholderTypeClick = (arg) => {
    const stakeholderType = arg;
    // console.log("handleStakeholderTypeClick", stakeholderType);
    setStakeholderType({
      sht_id: stakeholderType.sht_id,
      sht_type_name_or: stakeholderType.sht_type_name_or,
      sht_type_name_am: stakeholderType.sht_type_name_am,
      sht_type_name_en: stakeholderType.sht_type_name_en,
      sht_description: stakeholderType.sht_description,
      sht_status: stakeholderType.sht_status,

      is_deletable: stakeholderType.is_deletable,
      is_editable: stakeholderType.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (stakeholderType) => {
    setStakeholderType(stakeholderType);
    setDeleteModal(true);
  };

  const handleDeleteStakeholderType = () => {
    if (stakeholderType && stakeholderType.sht_id) {
      dispatch(onDeleteStakeholderType(stakeholderType.sht_id));
      setDeleteModal(false);
    }
  };
  const handleStakeholderTypeClicks = () => {
    setIsEdit(false);
    setStakeholderType("");
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
        accessorKey: "sht_type_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.sht_type_name_or, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "sht_type_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.sht_type_name_am, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "sht_type_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.sht_type_name_en, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "sht_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.sht_description, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "sht_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.sht_status, 30) || `${cellProps.row.original.sht_status}`}
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
                    handleStakeholderTypeClick(data);
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
  }, [handleStakeholderTypeClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

  return (
    <React.Fragment>
      <StakeholderTypeModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteStakeholderType}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("stakeholder_type")}
            breadcrumbItem={t("stakeholder_type")}
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
                      handleUserClick={handleStakeholderTypeClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("stakeholder_type")}
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
                ? t("edit") + " " + t("stakeholder_type")
                : t("add") + " " + t("stakeholder_type")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateStakeholderType(validation.values, modalCallback);
                  } else {
                    onAddStakeholderType(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sht_type_name_or")}</Label>
                    <Input
                      name="sht_type_name_or"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sht_type_name_or || ""}
                      invalid={
                        validation.touched.sht_type_name_or &&
                        validation.errors.sht_type_name_or
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.sht_type_name_or &&
                    validation.errors.sht_type_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sht_type_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sht_type_name_am")}</Label>
                    <Input
                      name="sht_type_name_am"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sht_type_name_am || ""}
                      invalid={
                        validation.touched.sht_type_name_am &&
                        validation.errors.sht_type_name_am
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.sht_type_name_am &&
                    validation.errors.sht_type_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sht_type_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sht_type_name_en")}</Label>
                    <Input
                      name="sht_type_name_en"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sht_type_name_en || ""}
                      invalid={
                        validation.touched.sht_type_name_en &&
                        validation.errors.sht_type_name_en
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.sht_type_name_en &&
                    validation.errors.sht_type_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sht_type_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sht_description")}</Label>
                    <Input
                      name="sht_description"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sht_description || ""}
                      invalid={
                        validation.touched.sht_description &&
                        validation.errors.sht_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.sht_description &&
                    validation.errors.sht_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sht_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sht_status")}</Label>
                    <Input
                      name="sht_status"
                      type="select"
                      className="form-select"
                      onChange={(e) => {
                        validation.setFieldValue(
                          "sht_status",
                          Number(e.target.value)
                        );
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.sht_status}
                    >
                      <option value={""}>Select status</option>
                      <option value={1}>{t("Active")}</option>
                      <option value={0}>{t("Inactive")}</option>
                    </Input>
                    {validation.touched.sht_status &&
                    validation.errors.sht_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sht_status}
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
      <ToastContainer />
    </React.Fragment>
  );
};
StakeholderTypeModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default StakeholderTypeModel;
