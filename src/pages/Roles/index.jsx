import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import { toast } from "react-toastify";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import {
  useFetchRoles,
  useAddRoles,
  useUpdateRoles,
  useDeleteRoles,
} from "../../queries/roles_query";
import RolesModal from "./RolesModal";
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
} from "reactstrap";
import RightOffCanvas from "../../components/Common/RightOffCanvas";
import Permission from "../../pages/Permission";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { alphanumericValidation } from "../../utils/Validation/validation";
const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const RolesModel = () => {
  //meta title
  document.title = " Roles";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [RoleMetaData, setRoleMetaData] = useState({});
  const [showCanvas, setShowCanvas] = useState(false);

  const [roles, setRoles] = useState(null);
  const { data, isLoading, error, isError, refetch } = useFetchRoles();
  const addRoles = useAddRoles();
  const updateRoles = useUpdateRoles();
  const deleteRoles = useDeleteRoles();

  const handleAddRoles = async (data) => {
    try {
      await addRoles.mutateAsync(data);
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

  const handleUpdateRoles = async (data) => {
    try {
      await updateRoles.mutateAsync(data);
      toast.success(`data updated successfully`, {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(`Failed to update Data`, {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleDeleteRoles = async () => {
    if (roles && roles.rol_id) {
      try {
        const id = roles.rol_id;
        console.log("role id", id);
        await deleteRoles.mutateAsync(id);
        toast.success(`Data deleted successfully`, {
          autoClose: 2000,
        });
        validation.resetForm();
      } catch (error) {
        toast.error(`Failed to delete Data`, {
          autoClose: 2000,
        });
      }
      setDeleteModal(false);
    }
  };
  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,
    initialValues: {
      rol_name: (roles && roles.rol_name) || "",
      rol_description: (roles && roles.rol_description) || "",
      rol_status: (roles && roles.rol_status) || "",
      is_deletable: (roles && roles.is_deletable) || 1,
      is_editable: (roles && roles.is_editable) || 1,
    },
    validationSchema: Yup.object({
      rol_name: alphanumericValidation(3, 20, true).test(
        "unique-role-id",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) => item.rol_name == value && item.rol_id !== roles?.rol_id
          );
        }
      ),
      rol_description: alphanumericValidation(3, 425, false),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateRoles = {
          rol_id: roles ? roles.rol_id : 0,
          rol_name: values.rol_name,
          rol_description: values.rol_description,
          rol_status: values.rol_status,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update Roles
        handleUpdateRoles(updateRoles);
      } else {
        const newRoles = {
          rol_name: values.rol_name,
          rol_description: values.rol_description,
          rol_status: values.rol_status,
        };
        // save new Roless
        handleAddRoles(newRoles);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  useEffect(() => {
    setRoles(data?.data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data?.data) && !!isEdit) {
      setRoles(data?.data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setRoles(null);
    } else {
      setModal(true);
    }
  };

  const handleRolesClick = (arg) => {
    const roles = arg;
    setRoles({
      rol_id: roles.rol_id,
      rol_name: roles.rol_name,
      rol_description: roles.rol_description,
      rol_status: roles.rol_status,
      is_deletable: roles.is_deletable,
      is_editable: roles.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const handleClick = (data) => {
    setShowCanvas(!showCanvas); // Toggle canvas visibility
    setRoleMetaData(data);
  };

  const onClickDelete = (roles) => {
    setRoles(roles);
    setDeleteModal(true);
  };

  const handleRolesClicks = () => {
    setIsEdit(false);
    setRoles("");
    toggle();
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "rol_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rol_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "rol_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rol_description, 30) || "-"}
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
                // onSelectItem(data);
                setTransaction(data);
                toggleViewModal(data);
              }}
            >
              {t("view_detail")}
            </Button>
          );
        },
      },
    ];
    if (
      data?.previledge?.is_role_editable ||
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
              {(cellProps.row.original?.is_editable ||
                cellProps.row.original?.is_role_editable) && (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleRolesClick(data);
                  }}
                >
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </Link>
              )}

              {(cellProps.row.original?.is_deletable ||
                cellProps.row.original?.is_role_deletable) && (
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
              {/* side slider */}
              {cellProps.row.original.is_editable && (
                <Link
                  to="#"
                  className="text-secondary"
                  onClick={() => {
                    const roledata = cellProps.row.original;
                    handleClick(roledata);
                  }}
                >
                  <i className="mdi mdi-eye font-size-18" id="viewtooltip" />

                  <UncontrolledTooltip placement="top" target="viewtooltip">
                    View
                  </UncontrolledTooltip>
                </Link>
              )}
            </div>
          );
        },
      });
    }

    return baseColumns;
  }, [handleRolesClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <RolesModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteRoles}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteRoles.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title={t("roles")} breadcrumbItem={t("roles")} />
          {isLoading ? (
            <Spinners />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={data?.data || []}
                      isGlobalFilter={true}
                      isAddButton={true}
                      isCustomPageSize={true}
                      handleUserClick={handleRolesClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("roles")}
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
                ? t("edit") + " " + t("roles")
                : t("add") + " " + t("roles")}
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
                    <Label>{t("rol_name")}</Label>
                    <Input
                      name="rol_name"
                      type="text"
                      placeholder={t("rol_name")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.rol_name || ""}
                      invalid={
                        validation.touched.rol_name &&
                        validation.errors.rol_name
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.rol_name &&
                    validation.errors.rol_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.rol_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("rol_description")}</Label>
                    <Input
                      name="rol_description"
                      type="textarea"
                      placeholder={t("rol_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.rol_description || ""}
                      invalid={
                        validation.touched.rol_description &&
                        validation.errors.rol_description
                          ? true
                          : false
                      }
                      maxLength={50}
                    />
                    {validation.touched.rol_description &&
                    validation.errors.rol_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.rol_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addRoles.isPending || updateRoles.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addRoles.isPending ||
                            updateRoles.isPending ||
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
                            addRoles.isPending ||
                            updateRoles.isPending ||
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

      {showCanvas && (
        <RightOffCanvas
          handleClick={handleClick}
          showCanvas={showCanvas}
          canvasWidth={84}
          data={RoleMetaData}
          id={RoleMetaData.rol_id}
          name={RoleMetaData.rol_name}
          components={{ Permission: Permission }}
        />
      )}
    </React.Fragment>
  );
};
RolesModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default RolesModel;
