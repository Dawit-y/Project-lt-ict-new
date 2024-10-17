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
//  import role page index

import {
  getPermission as onGetPermission,
  addPermission as onAddPermission,
  updatePermission as onUpdatePermission,
  deletePermission as onDeletePermission,
} from "../../store/permission/actions";

import { getPages } from "../../store/pages/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import PermissionModal from "./PermissionModal";
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

const PermissionModel = (props) => {
  // get data from tab page
  const { passedId } = props;
  //meta title
  document.title = " Permission";

  const { t } = useTranslation();

  //  add new
  const [selectedItem, setSelectedItem] = useState(null);
  // console.log("selected item",selectedItem.passedId)
  // const [pageId, setPageId] = useState(null);

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [permission, setPermission] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,
    //  selectedItem={selectedItem}

    initialValues: {
      pem_page_id: (permission && permission.pem_page_id) || "",
      pag_id: (permission && permission.pag_id) || "",
      pag_name: (permission && permission.pag_name) || "",
      pem_id: (permission && permission.pem_id) || "",
      pem_role_id: passedId,
      pem_enabled: (permission && permission.pem_enabled) || "",
      pem_edit: (permission && permission.pem_edit) || "",
      pem_insert: (permission && permission.pem_insert) || "",
      pem_view: (permission && permission.pem_view) || "",
      pem_delete: (permission && permission.pem_delete) || "",
      pem_show: (permission && permission.pem_show) || "",
      pem_search: (permission && permission.pem_search) || "",
      pem_description: (permission && permission.pem_description) || "",
      pem_status: (permission && permission.pem_status) || "",

      is_deletable: (permission && permission.is_deletable) || 1,
      is_editable: (permission && permission.is_editable) || 1,
    },

    validationSchema: Yup.object({
      // pem_page_id: Yup.number().required(t("pem_page_id")),
      // pem_id: Yup.number().required(t("pem_role_id")),
      pem_enabled: Yup.number().required(t("pem_enabled")),
      pem_edit: Yup.number().required(t("pem_edit")),
      pem_insert: Yup.number().required(t("pem_insert")),
      pem_view: Yup.number().required(t("pem_view")),
      pem_delete: Yup.number().required(t("pem_delete")),
      pem_show: Yup.number().required(t("pem_show")),
      pem_search: Yup.number().required(t("pem_search")),
      pem_description: Yup.string().required(t("pem_description")),
      // pem_status: Yup.number().required(t("pem_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updatePermission = {
          // pem_id: permission ? permission.pem_id : 0,
          pag_id: values.pag_id,
          pag_name: values.pag_name,
          pem_id: values.pem_id,
          pem_page_id: values.pem_page_id,
          pem_role_id: passedId,
          pem_enabled: values.pem_enabled,
          pem_edit: values.pem_edit,
          pem_insert: values.pem_insert,
          pem_view: values.pem_view,
          pem_delete: values.pem_delete,
          pem_show: values.pem_show,
          pem_search: values.pem_search,
          pem_description: values.pem_description,
          pem_status: values.pem_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update Permission
        dispatch(onUpdatePermission(updatePermission));
        validation.resetForm();
      } else {
        const newPermission = {
          pem_id: values.pem_id,
          pem_page_id: values.pem_page_id,
          pem_role_id: passedId,
          pem_enabled: values.pem_enabled,
          pem_edit: values.pem_edit,
          pem_insert: values.pem_insert,
          pem_view: values.pem_view,
          pem_delete: values.pem_delete,
          pem_show: values.pem_show,
          pem_search: values.pem_search,
          pem_description: values.pem_description,
          pem_status: values.pem_status,
        };
        // save new Permissions
        dispatch(onAddPermission(newPermission));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch Permission on component mount
  useEffect(() => {
    dispatch(onGetPermission(passedId));
    dispatch(getPages());
  }, [dispatch]);

  const permissionProperties = createSelector(
    (state) => state.PermissionR, // this is geting from  reducer
    (PermissionReducer) => ({
      // this is from Project.reducer
      permission: PermissionReducer.permission,
      loading: PermissionReducer.loading,
      update_loading: PermissionReducer.update_loading,
    })
  );

  const {
    permission: { data, previledge },
    loading,
    update_loading,
  } = useSelector(permissionProperties);

  const pagesProperties = createSelector(
    (state) => state.PagesR, // this is geting from  reducer
    (PagesReducer) => ({
      // this is from Project.reducer
      pages: PagesReducer.pages,
      loading: PagesReducer.loading,
      update_loading: PagesReducer.update_loading,
    })
  );

  const {
    pages: { data: pagesData, previledge: pagesPreviledge },
    loading: pagesLoading,
    update_loading: pagesUpdateLoading,
  } = useSelector(pagesProperties);

  useEffect(() => {
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
    setPermission(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setPermission(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setPermission(null);
    } else {
      setModal(true);
    }
  };

  const handlePermissionClick = (arg) => {
    const permission = arg;
    // console.log("handlePermissionClick", permission);
    setPermission({
      pag_id: permission.pag_id,
      pag_name: permission.pag_name,
      pem_id: permission.pem_id,
      pem_page_id: permission.pag_id,
      pem_role_id: permission.pem_role_id,
      pem_enabled: permission.pem_enabled,
      pem_edit: permission.pem_edit,
      pem_insert: permission.pem_insert,
      pem_view: permission.pem_view,
      pem_delete: permission.pem_delete,
      pem_show: permission.pem_show,
      pem_search: permission.pem_search,
      pem_description: permission.pem_description,
      pem_status: permission.pem_status,

      is_deletable: permission.is_deletable,
      is_editable: permission.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (permission) => {
    setPermission(permission);
    setDeleteModal(true);
  };

  const handleDeletePermission = () => {
    if (permission && permission.pem_id) {
      dispatch(onDeletePermission(permission.pem_id));
      setDeleteModal(false);
    }
  };
  const handlePermissionClicks = () => {
    setIsEdit(false);
    setPermission("");
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
        accessorKey: "page_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <span>{cellProps.row.original.pag_name}</span>;
        },
      },
      {
        header: "",
        accessorKey: "pem_role_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <span>{cellProps.row.original.pem_role_id}</span>;
        },
      },
      {
        header: "",
        accessorKey: "pem_enabled",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <span>{cellProps.row.original.pem_enabled}</span>;
        },
      },
      {
        header: "",
        accessorKey: "pem_edit",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <span>{cellProps.row.original.pem_edit}</span>;
        },
      },
      {
        header: "",
        accessorKey: "pem_insert",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <span>{cellProps.row.original.pem_insert}</span>;
        },
      },
      {
        header: "",
        accessorKey: "pem_view",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <span>{cellProps.row.original.pem_view}</span>;
        },
      },
      {
        header: "",
        accessorKey: "pem_delete",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <span>{cellProps.row.original.pem_delete}</span>;
        },
      },
      {
        header: "",
        accessorKey: "pem_show",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <span>{cellProps.row.original.pem_show}</span>;
        },
      },
      {
        header: "",
        accessorKey: "pem_search",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <span>{cellProps.row.original.pem_search}</span>;
        },
      },
      {
        header: "",
        accessorKey: "pem_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pem_description, 30) || "-"}
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
                    setSelectedItem(data);
                    handlePermissionClick(data);
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
  }, [handlePermissionClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

  return (
    <React.Fragment>
      <PermissionModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeletePermission}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div>
        <div className="container-fluid">
          <Breadcrumbs title={t("roles")} breadcrumbItem={t("permission")} />
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
                      handleUserClick={handlePermissionClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("permission")}
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
                ? `${t("edit")} ${t("permission")} ${"for"} ${
                    selectedItem?.pag_name
                  } ${t("page")}`
                : `${t("add")} ${t("permission")}`}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  // const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdatePermission(validation.values);
                  } else {
                    onAddPermission(validation.values);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pem_enabled")}</Label>
                    <Input
                      type="select"
                      name="pem_enabled"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pem_enabled || ""}
                      invalid={
                        validation.touched.pem_enabled &&
                        validation.errors.pem_enabled
                          ? true
                          : false
                      }
                    >
                      <option value="">{t("select_enabled_option")}</option>{" "}
                      {/* Default option */}
                      <option value={1}>{t("Yes")}</option>
                      <option value={2}>{t("No")}</option>
                    </Input>
                    {validation.touched.pem_enabled &&
                    validation.errors.pem_enabled ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pem_enabled}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  {/* edit */}
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pem_edit")}</Label>
                    <Input
                      type="select"
                      name="pem_edit"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pem_edit || ""}
                      invalid={
                        validation.touched.pem_edit &&
                        validation.errors.pem_edit
                          ? true
                          : false
                      }
                    >
                      <option value="">{t("select_edit_option")}</option>{" "}
                      {/* Default option */}
                      <option value={1}>{t("Yes")}</option>
                      <option value={2}>{t("No")}</option>
                    </Input>
                    {validation.touched.pem_edit &&
                    validation.errors.pem_edit ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pem_edit}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  {/* insert  */}
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pem_insert")}</Label>
                    <Input
                      type="select"
                      name="pem_insert"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pem_insert || ""}
                      invalid={
                        validation.touched.pem_insert &&
                        validation.errors.pem_insert
                          ? true
                          : false
                      }
                    >
                      <option value="">{t("select_insert_option")}</option>{" "}
                      {/* Default option */}
                      <option value={1}>{t("Yes")}</option>
                      <option value={2}>{t("No")}</option>
                    </Input>
                    {validation.touched.pem_insert &&
                    validation.errors.pem_insert ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pem_insert}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  {/* view */}
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pem_view")}</Label>
                    <Input
                      type="select"
                      name="pem_view"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pem_view || ""}
                      invalid={
                        validation.touched.pem_view &&
                        validation.errors.pem_view
                          ? true
                          : false
                      }
                    >
                      <option value="">{t("select_view_option")}</option>{" "}
                      {/* Default option */}
                      <option value={1}>{t("Yes")}</option>
                      <option value={2}>{t("No")}</option>
                    </Input>
                    {validation.touched.pem_view &&
                    validation.errors.pem_view ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pem_view}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  {/* delete */}
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pem_delete")}</Label>
                    <Input
                      type="select"
                      name="pem_delete"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pem_delete || ""}
                      invalid={
                        validation.touched.pem_delete &&
                        validation.errors.pem_delete
                          ? true
                          : false
                      }
                    >
                      <option value="">{t("select_delete_option")}</option>{" "}
                      {/* Default option */}
                      <option value={1}>{t("Yes")}</option>
                      <option value={2}>{t("No")}</option>
                    </Input>
                    {validation.touched.pem_delete &&
                    validation.errors.pem_delete ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pem_delete}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  {/* show */}
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pem_show")}</Label>
                    <Input
                      type="select"
                      name="pem_show"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pem_show || ""}
                      invalid={
                        validation.touched.pem_show &&
                        validation.errors.pem_show
                          ? true
                          : false
                      }
                    >
                      <option value="">{t("select_show_option")}</option>{" "}
                      {/* Default option */}
                      <option value={1}>{t("Show")}</option>
                      <option value={2}>{t("Hide")}</option>
                      <option value={3}>{t("Custom")}</option>
                    </Input>
                    {validation.touched.pem_show &&
                    validation.errors.pem_show ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pem_show}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  {/* search value */}
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pem_search")}</Label>
                    <Input
                      type="select"
                      name="pem_search"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pem_search || ""}
                      invalid={
                        validation.touched.pem_search &&
                        validation.errors.pem_search
                          ? true
                          : false
                      }
                    >
                      <option value="">{t("select_search_option")}</option>{" "}
                      {/* Default option */}
                      <option value={1}>{t("All")}</option>
                      <option value={2}>{t("Owner")}</option>
                      <option value={3}>{t("None")}</option>
                    </Input>
                    {validation.touched.pem_search &&
                    validation.errors.pem_search ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pem_search}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  <Col className="col-md-6 mb-3">
                    <Label>{t("pem_description")}</Label>
                    <Input
                      name="pem_description"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pem_description || ""}
                      invalid={
                        validation.touched.pem_description &&
                        validation.errors.pem_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pem_description &&
                    validation.errors.pem_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pem_description}
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
PermissionModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default PermissionModel;
