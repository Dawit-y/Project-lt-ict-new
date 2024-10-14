import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
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
  getSectorInformation as onGetSectorInformation,
  addSectorInformation as onAddSectorInformation,
  updateSectorInformation as onUpdateSectorInformation,
  deleteSectorInformation as onDeleteSectorInformation,
} from "../../store/sectorinformation/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import SectorInformationModal from "./SectorInformationModal";
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

const SectorInformationModel = () => {
  //meta title
  document.title = " SectorInformation";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [sectorInformation, setSectorInformation] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS
  const [sectorCategoryOptions, setSectorCategoryOptions] = useState([]);
  const [selectedSectorCategory, setSelectedSectorCategory] = useState("");

  useEffect(() => {
    const fetchSectorCategory = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}sector_category/listgrid`
        );
        const transformedData = response.data.data.map((item) => ({
          label: item.psc_name.toString(),
          value: item.psc_name.toString(),
        }));
        const optionsWithDefault = [
          { label: "select budget year", value: "" },
          ...transformedData,
        ];
        setSectorCategoryOptions(optionsWithDefault);
      } catch (error) {
        console.error("Error fetching budget years:", error);
      }
    };
    fetchSectorCategory();
  }, []);
  const handleSectorCategoryChange = (e) => {
    setSelectedSectorCategory(e.target.value);
    validation.setFieldValue("sci_sector_category_id", e.target.value);
  };
  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      sci_name_or: (sectorInformation && sectorInformation.sci_name_or) || "",
      sci_name_am: (sectorInformation && sectorInformation.sci_name_am) || "",
      sci_name_en: (sectorInformation && sectorInformation.sci_name_en) || "",
      sci_code: (sectorInformation && sectorInformation.sci_code) || "",
      sci_available_at_region:
        (sectorInformation && sectorInformation.sci_available_at_region) || "",
      sci_available_at_zone:
        (sectorInformation && sectorInformation.sci_available_at_zone) || "",
      sci_available_at_woreda:
        (sectorInformation && sectorInformation.sci_available_at_woreda) || "",
      sci_description:
        (sectorInformation && sectorInformation.sci_description) || "",
      sci_status: (sectorInformation && sectorInformation.sci_status) || "",

      is_deletable: (sectorInformation && sectorInformation.is_deletable) || 1,
      is_editable: (sectorInformation && sectorInformation.is_editable) || 1,
    },

    validationSchema: Yup.object({
      sci_name_or: Yup.string().required(t("sci_name_or")),
      sci_name_am: Yup.string().required(t("sci_name_am")),
      sci_name_en: Yup.string().required(t("sci_name_en")),
      sci_code: Yup.string().required(t("sci_code")),
      sci_available_at_region: Yup.string().required(
        t("sci_available_at_region")
      ),
      sci_available_at_zone: Yup.string().required(t("sci_available_at_zone")),
      sci_available_at_woreda: Yup.string().required(
        t("sci_available_at_woreda")
      ),
      sci_description: Yup.string().required(t("sci_description")),
      sci_status: Yup.string().required(t("sci_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateSectorInformation = {
          sci_id: sectorInformation ? sectorInformation.sci_id : 0,
          sci_name_or: values.sci_name_or,
          sci_name_am: values.sci_name_am,
          sci_name_en: values.sci_name_en,
          sci_code: values.sci_code,
          sci_available_at_region: values.sci_available_at_region,
          sci_available_at_zone: values.sci_available_at_zone,
          sci_available_at_woreda: values.sci_available_at_woreda,
          sci_description: values.sci_description,
          sci_status: values.sci_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update SectorInformation
        dispatch(onUpdateSectorInformation(updateSectorInformation));
        validation.resetForm();
      } else {
        const newSectorInformation = {
          sci_name_or: values.sci_name_or,
          sci_name_am: values.sci_name_am,
          sci_name_en: values.sci_name_en,
          sci_code: values.sci_code,
          sci_available_at_region: values.sci_available_at_region,
          sci_available_at_zone: values.sci_available_at_zone,
          sci_available_at_woreda: values.sci_available_at_woreda,
          sci_description: values.sci_description,
          sci_status: values.sci_status,
        };
        // save new SectorInformations
        dispatch(onAddSectorInformation(newSectorInformation));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch SectorInformation on component mount
  useEffect(() => {
    dispatch(onGetSectorInformation());
  }, [dispatch]);

  const sectorInformationProperties = createSelector(
    (state) => state.SectorInformationR, // this is geting from  reducer
    (SectorInformationReducer) => ({
      // this is from Project.reducer
      sectorInformation: SectorInformationReducer.sectorInformation,
      loading: SectorInformationReducer.loading,
      update_loading: SectorInformationReducer.update_loading,
    })
  );

  const {
    sectorInformation: { data, previledge },
    loading,
    update_loading,
  } = useSelector(sectorInformationProperties);

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
    setSectorInformation(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setSectorInformation(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setSectorInformation(null);
    } else {
      setModal(true);
    }
  };

  const handleSectorInformationClick = (arg) => {
    const sectorInformation = arg;
    // console.log("handleSectorInformationClick", sectorInformation);
    setSectorInformation({
      sci_id: sectorInformation.sci_id,
      sci_name_or: sectorInformation.sci_name_or,
      sci_name_am: sectorInformation.sci_name_am,
      sci_name_en: sectorInformation.sci_name_en,
      sci_code: sectorInformation.sci_code,
      sci_available_at_region: sectorInformation.sci_available_at_region,
      sci_available_at_zone: sectorInformation.sci_available_at_zone,
      sci_available_at_woreda: sectorInformation.sci_available_at_woreda,
      sci_description: sectorInformation.sci_description,
      sci_status: sectorInformation.sci_status,

      is_deletable: sectorInformation.is_deletable,
      is_editable: sectorInformation.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (sectorInformation) => {
    setSectorInformation(sectorInformation);
    setDeleteModal(true);
  };

  const handleDeleteSectorInformation = () => {
    if (sectorInformation && sectorInformation.sci_id) {
      dispatch(onDeleteSectorInformation(sectorInformation.sci_id));
      setDeleteModal(false);
    }
  };
  const handleSectorInformationClicks = () => {
    setIsEdit(false);
    setSectorInformation("");
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
        accessorKey: "sci_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.sci_name_or, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "sci_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.sci_name_am, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "sci_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.sci_name_en, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "sci_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.sci_code, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "sci_available_at_region",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.sci_available_at_region,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "sci_available_at_zone",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.sci_available_at_zone, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "sci_available_at_woreda",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.sci_available_at_woreda,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "sci_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.sci_description, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "sci_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.sci_status, 30) || `${cellProps.row.original.sci_status}`}
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
                    handleSectorInformationClick(data);
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
  }, [handleSectorInformationClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

  return (
    <React.Fragment>
      <SectorInformationModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteSectorInformation}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("sector_information")}
            breadcrumbItem={t("sector_information")}
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
                      handleUserClick={handleSectorInformationClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("sector_information")}
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
                ? t("edit") + " " + t("sector_information")
                : t("add") + " " + t("sector_information")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateSectorInformation(validation.values, modalCallback);
                  } else {
                    onAddSectorInformation(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sci_name_or")}</Label>
                    <Input
                      name="sci_name_or"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sci_name_or || ""}
                      invalid={
                        validation.touched.sci_name_or &&
                        validation.errors.sci_name_or
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.sci_name_or &&
                    validation.errors.sci_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sci_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sci_name_am")}</Label>
                    <Input
                      name="sci_name_am"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sci_name_am || ""}
                      invalid={
                        validation.touched.sci_name_am &&
                        validation.errors.sci_name_am
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.sci_name_am &&
                    validation.errors.sci_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sci_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sci_name_en")}</Label>
                    <Input
                      name="sci_name_en"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sci_name_en || ""}
                      invalid={
                        validation.touched.sci_name_en &&
                        validation.errors.sci_name_en
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.sci_name_en &&
                    validation.errors.sci_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sci_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sci_code")}</Label>
                    <Input
                      name="sci_code"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sci_code || ""}
                      invalid={
                        validation.touched.sci_code &&
                        validation.errors.sci_code
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.sci_code &&
                    validation.errors.sci_code ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sci_code}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sci_sector_category_id")}</Label>
                    <Input
                      name="sci_sector_category_id"
                      type="select"
                      className="form-select"
                      onChange={handleSectorCategoryChange}
                      onBlur={validation.handleBlur}
                      value={selectedSectorCategory}
                    >
                      {sectorCategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`${option.label}`)}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.sci_sector_category_id &&
                    validation.errors.sci_sector_category_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sci_sector_category_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sci_available_at_region")}</Label>
                    <Input
                      name="sci_available_at_region"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sci_available_at_region || ""}
                      invalid={
                        validation.touched.sci_available_at_region &&
                        validation.errors.sci_available_at_region
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.sci_available_at_region &&
                    validation.errors.sci_available_at_region ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sci_available_at_region}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sci_available_at_zone")}</Label>
                    <Input
                      name="sci_available_at_zone"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sci_available_at_zone || ""}
                      invalid={
                        validation.touched.sci_available_at_zone &&
                        validation.errors.sci_available_at_zone
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.sci_available_at_zone &&
                    validation.errors.sci_available_at_zone ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sci_available_at_zone}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sci_available_at_woreda")}</Label>
                    <Input
                      name="sci_available_at_woreda"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sci_available_at_woreda || ""}
                      invalid={
                        validation.touched.sci_available_at_woreda &&
                        validation.errors.sci_available_at_woreda
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.sci_available_at_woreda &&
                    validation.errors.sci_available_at_woreda ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sci_available_at_woreda}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sci_description")}</Label>
                    <Input
                      name="sci_description"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sci_description || ""}
                      invalid={
                        validation.touched.sci_description &&
                        validation.errors.sci_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.sci_description &&
                    validation.errors.sci_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sci_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("sci_status")}</Label>
                    <Input
                      name="sci_status"
                      type="select"
                      className="form-select"
                      onChange={(e) => {
                        validation.setFieldValue(
                          "sci_status",
                          Number(e.target.value)
                        );
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.sci_status}
                    >
                      <option value={""}>Select status</option>
                      <option value={1}>{t("Active")}</option>
                      <option value={0}>{t("Inactive")}</option>
                    </Input>
                    {validation.touched.sci_status &&
                    validation.errors.sci_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.sci_status}
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
SectorInformationModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default SectorInformationModel;
