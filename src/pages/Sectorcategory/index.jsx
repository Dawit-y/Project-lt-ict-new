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
  getSectorCategory as onGetSectorCategory,
  addSectorCategory as onAddSectorCategory,
  updateSectorCategory as onUpdateSectorCategory,
  deleteSectorCategory as onDeleteSectorCategory,
} from "../../store/sectorcategory/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import SectorCategoryModal from "./SectorCategoryModal";
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

const SectorCategoryModel = () => {
  //meta title
  document.title = " SectorCategory";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [sectorCategory, setSectorCategory] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      psc_status: (sectorCategory && sectorCategory.psc_status) || "",
      psc_name: (sectorCategory && sectorCategory.psc_name) || "",
      psc_code: (sectorCategory && sectorCategory.psc_code) || "",
      psc_sector_id: (sectorCategory && sectorCategory.psc_sector_id) || "",
      psc_description: (sectorCategory && sectorCategory.psc_description) || "",

      is_deletable: (sectorCategory && sectorCategory.is_deletable) || 1,
      is_editable: (sectorCategory && sectorCategory.is_editable) || 1,
    },

    validationSchema: Yup.object({
      //psc_status: Yup.string().required(t("psc_status")),
      //psc_name: Yup.string().required(t("psc_name")),
      psc_name: Yup.string()
        .required(t("psc_name"))
        .test("unique-code", t("Already exists"), (value) => {
          return !data.some((item) => item.psc_name == value);
        }),
      //psc_code: Yup.string().required(t("psc_code")),
      //psc_description: Yup.string().required(t("psc_description")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateSectorCategory = {
          psc_id: sectorCategory ? sectorCategory.psc_id : 0,
          psc_status: values.psc_status,
          psc_name: values.psc_name,
          psc_code: values.psc_code,
          psc_sector_id: values.psc_sector_id,
          psc_description: values.psc_description,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update SectorCategory
        dispatch(onUpdateSectorCategory(updateSectorCategory));
        validation.resetForm();
      } else {
        const newSectorCategory = {
          psc_status: values.psc_status,
          psc_name: values.psc_name,
          psc_code: values.psc_code,
          psc_sector_id: values.psc_sector_id,
          psc_description: values.psc_description,
        };
        // save new SectorCategorys
        dispatch(onAddSectorCategory(newSectorCategory));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch SectorCategory on component mount
  useEffect(() => {
    dispatch(onGetSectorCategory());
  }, [dispatch]);

  const sectorCategoryProperties = createSelector(
    (state) => state.SectorCategoryR, // this is geting from  reducer
    (SectorCategoryReducer) => ({
      // this is from Project.reducer
      sectorCategory: SectorCategoryReducer.sectorCategory,
      loading: SectorCategoryReducer.loading,
      update_loading: SectorCategoryReducer.update_loading,
    })
  );

  const {
    sectorCategory: { data, previledge },
    loading,
    update_loading,
  } = useSelector(sectorCategoryProperties);

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
    setSectorCategory(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setSectorCategory(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setSectorCategory(null);
    } else {
      setModal(true);
    }
  };

  const handleSectorCategoryClick = (arg) => {
    const sectorCategory = arg;
    // console.log("handleSectorCategoryClick", sectorCategory);
    setSectorCategory({
      psc_status: sectorCategory.psc_status,
      psc_id: sectorCategory.psc_id,
      psc_name: sectorCategory.psc_name,
      psc_code: sectorCategory.psc_code,
      psc_sector_id: sectorCategory.psc_sector_id,
      psc_description: sectorCategory.psc_description,

      is_deletable: sectorCategory.is_deletable,
      is_editable: sectorCategory.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (sectorCategory) => {
    setSectorCategory(sectorCategory);
    setDeleteModal(true);
  };

  const handleDeleteSectorCategory = () => {
    if (sectorCategory && sectorCategory.psc_id) {
      dispatch(onDeleteSectorCategory(sectorCategory.psc_id));
      setDeleteModal(false);
    }
  };
  const handleSectorCategoryClicks = () => {
    setIsEdit(false);
    setSectorCategory("");
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
        accessorKey: "psc_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.psc_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "psc_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.psc_code, 30) || "-"}
            </span>
          );
        },
      },
     
      {
        header: "",
        accessorKey: "psc_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.psc_description, 30) || "-"}
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
                    handleSectorCategoryClick(data);
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
  }, [handleSectorCategoryClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

  return (
    <React.Fragment>
      <SectorCategoryModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteSectorCategory}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("sector_category")}
            breadcrumbItem={t("sector_category")}
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
                      handleUserClick={handleSectorCategoryClicks}
                      isPagination={true}
                      SearchPlaceholder={t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("sector_category")}
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
                ? t("edit") + " " + t("sector_category")
                : t("add") + " " + t("sector_category")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateSectorCategory(validation.values, modalCallback);
                  } else {
                    onAddSectorCategory(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3" style={{ display: 'none'}}>
                    <Label>{t("psc_status")}</Label>
                    <Input
                      name="psc_status"
                      type="select"
                      className="form-select"
                      onChange={(e) => {
                        validation.setFieldValue(
                          "psc_status",
                          Number(e.target.value)
                        );
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.psc_status}
                    >
                      <option value={""}>Select status</option>
                      <option value={1}>{t("Active")}</option>
                      <option value={0}>{t("Inactive")}</option>
                    </Input>
                    {validation.touched.psc_status &&
                    validation.errors.psc_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psc_status}
                      </FormFeedback>
                    ) : null}
                  </Col>
             
                  <Col className="col-md-6 mb-3">
                    <Label>{t("psc_name")}<span className="text-danger">*</span></Label>
                    <Input
                      name="psc_name"
                      type="text"
                      placeholder={t("psc_name")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psc_name || ""}
                      invalid={
                        validation.touched.psc_name &&
                        validation.errors.psc_name
                          ? true
                          : false
                      }
                      maxLength={40}
                    />
                    {validation.touched.psc_name &&
                    validation.errors.psc_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psc_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("psc_code")}</Label>
                    <Input
                      name="psc_code"
                      type="text"
                      placeholder={t("psc_code")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psc_code || ""}
                      invalid={
                        validation.touched.psc_code &&
                        validation.errors.psc_code
                          ? true
                          : false
                      }
                      maxLength={40}
                    />
                    {validation.touched.psc_code &&
                    validation.errors.psc_code ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psc_code}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  
                  <Col className="col-md-6 mb-3">
                    <Label>{t("psc_description")}</Label>
                    <Input
                      name="psc_description"
                      type="textarea"
                      rows={2}
                      placeholder={t("psc_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psc_description || ""}
                      invalid={
                        validation.touched.psc_description &&
                        validation.errors.psc_description
                          ? true
                          : false
                      }
                      maxLength={100}
                    />
                    {validation.touched.psc_description &&
                    validation.errors.psc_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psc_description}
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
SectorCategoryModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default SectorCategoryModel;
