import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchProjectStakeholders,
  useAddProjectStakeholder,
  useDeleteProjectStakeholder,
  useUpdateProjectStakeholder,
} from "../../queries/projectstakeholder_query";

import { useFetchStakeholderTypes } from "../../queries/stakeholdertype_query";
import ProjectStakeholderModal from "./ProjectStakeholderModal";
import { useTranslation } from "react-i18next";
import { alphanumericValidation,amountValidation,numberValidation,dropdownValidation } from '../../utils/Validation/validation';
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
import "react-toastify/dist/ReactToastify.css";
import { createSelectOptions } from "../../utils/commonMethods";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectStakeholderModel = (props) => {
  const { passedId, isActive } = props;
  const param = { project_id: passedId };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectStakeholder, setProjectStakeholder] = useState(null);

  const { data, isLoading, error, isError, refetch } =
    useFetchProjectStakeholders(param, isActive);
  const { data: stakeholderTypeData } = useFetchStakeholderTypes();
  const stakeholderTypeOptions = createSelectOptions(
    stakeholderTypeData?.data || [],
    "sht_id",
    "sht_type_name_en"
  );

  const addProjectStakeholder = useAddProjectStakeholder();
  const updateProjectStakeholder = useUpdateProjectStakeholder();
  const deleteProjectStakeholder = useDeleteProjectStakeholder();
  //START CRUD
  const handleAddProjectStakeholder = async (data) => {
    try {
      await addProjectStakeholder.mutateAsync(data);
      toast.success(`Data added successfully`, {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error("Failed to add data", {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleUpdateProjectStakeholder = async (data) => {
    try {
      await updateProjectStakeholder.mutateAsync(data);
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
  const handleDeleteProjectStakeholder = async () => {
    if (projectStakeholder && projectStakeholder.emp_id) {
      try {
        const id = projectStakeholder.emp_id;
        await deleteProjectStakeholder.mutateAsync(id);
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

  // validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      psh_project_id: passedId,
      psh_name: (projectStakeholder && projectStakeholder.psh_name) || "",
      psh_representative_name:
        (projectStakeholder && projectStakeholder.psh_representative_name) ||
        "",
      psh_representative_phone:
        (projectStakeholder && projectStakeholder.psh_representative_phone) ||
        "",
      psh_role: (projectStakeholder && projectStakeholder.psh_role) || "",
      psh_description:
        (projectStakeholder && projectStakeholder.psh_description) || "",
      psh_status: (projectStakeholder && projectStakeholder.psh_status) || "",

      is_deletable:
        (projectStakeholder && projectStakeholder.is_deletable) || 1,
      is_editable: (projectStakeholder && projectStakeholder.is_editable) || 1,
      psh_stakeholder_type:
        (projectStakeholder && projectStakeholder.psh_stakeholder_type) || "",
    },

    validationSchema: Yup.object({
      // psh_project_id: Yup.string().required(t("psh_project_id")),
      psh_name: alphanumericValidation(3, 200, true),
      psh_stakeholder_type: dropdownValidation(1,300,true),
      psh_representative_name: alphanumericValidation(3, 200, true),
      psh_representative_phone: alphanumericValidation(3, 24, true),
      psh_role: alphanumericValidation(3, 425, false),
      psh_description: alphanumericValidation(3, 425, false)
      //psh_status: Yup.string().required(t("psh_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectStakeholder = {
          psh_id: projectStakeholder ? projectStakeholder.psh_id : 0,
          psh_project_id: values.psh_project_id,
          psh_name: values.psh_name,
          psh_representative_name: values.psh_representative_name,
          psh_representative_phone: values.psh_representative_phone,
          psh_role: values.psh_role,
          psh_description: values.psh_description,
          psh_status: values.psh_status,
          psh_stakeholder_type: values.psh_stakeholder_type,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        handleUpdateProjectStakeholder(updateProjectStakeholder);
        
      } else {
        const newProjectStakeholder = {
          psh_project_id: values.psh_project_id,
          psh_name: values.psh_name,
          psh_representative_name: values.psh_representative_name,
          psh_representative_phone: values.psh_representative_phone,
          psh_role: values.psh_role,
          psh_description: values.psh_description,
          psh_status: values.psh_status,
          psh_stakeholder_type: values.psh_stakeholder_type,
        };
        handleAddProjectStakeholder(newProjectStakeholder);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  useEffect(() => {
    setProjectStakeholder(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectStakeholder(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectStakeholder(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectStakeholderClick = (arg) => {
    const projectStakeholder = arg;
    setProjectStakeholder({
      psh_id: projectStakeholder.psh_id,
      psh_project_id: projectStakeholder.psh_project_id,
      psh_name: projectStakeholder.psh_name,
      psh_representative_name: projectStakeholder.psh_representative_name,
      psh_representative_phone: projectStakeholder.psh_representative_phone,
      psh_role: projectStakeholder.psh_role,
      psh_description: projectStakeholder.psh_description,
      psh_status: projectStakeholder.psh_status,
      psh_stakeholder_type: projectStakeholder.psh_stakeholder_type,
      is_deletable: projectStakeholder.is_deletable,
      is_editable: projectStakeholder.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (projectStakeholder) => {
    setProjectStakeholder(projectStakeholder);
    setDeleteModal(true);
  };

  const handleProjectStakeholderClicks = () => {
    setIsEdit(false);
    setProjectStakeholder("");
    toggle();
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "psh_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.psh_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "psh_representative_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.psh_representative_name,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "psh_representative_phone",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.psh_representative_phone,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "psh_role",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.psh_role, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "psh_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.psh_description, 30) || "-"}
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
                    handleProjectStakeholderClick(data);
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
  }, [handleProjectStakeholderClick, toggleViewModal, onClickDelete]);

  if (isError) {
    <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <ProjectStakeholderModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectStakeholder}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProjectStakeholder.isPending}
      />
      <div className={passedId ? "" : "page-content"}>
        <div className="container-fluid1">
          {passedId ? null : (
            <Breadcrumbs
              title={t("project_stakeholder")}
              breadcrumbItem={t("project_stakeholder")}
            />
          )}
          {isLoading ? (
            <Spinners />
          ) : (
            <TableContainer
              columns={columns}
              data={data?.data || []}
              isGlobalFilter={true}
              isAddButton={true}
              isCustomPageSize={true}
              handleUserClick={handleProjectStakeholderClicks}
              isPagination={true}
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
                ? t("edit") + " " + t("project_stakeholder")
                : t("add") + " " + t("project_stakeholder")}
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
                      {t("psh_name")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="psh_name"
                      type="text"
                      placeholder={t("psh_name")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psh_name || ""}
                      invalid={
                        validation.touched.psh_name &&
                        validation.errors.psh_name
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.psh_name &&
                    validation.errors.psh_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psh_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("psh_stakeholder_type")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="psh_stakeholder_type"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psh_stakeholder_type || ""}
                      invalid={
                        validation.touched.psh_stakeholder_type &&
                        validation.errors.psh_stakeholder_type
                          ? true
                          : false
                      }
                    >
                      <option value="">Select Stakeholder Type</option>
                      {stakeholderTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`${option.label}`)}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.psh_stakeholder_type &&
                    validation.errors.psh_stakeholder_type ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psh_stakeholder_type}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("psh_representative_name")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="psh_representative_name"
                      type="text"
                      placeholder={t("psh_representative_name")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psh_representative_name || ""}
                      invalid={
                        validation.touched.psh_representative_name &&
                        validation.errors.psh_representative_name
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.psh_representative_name &&
                    validation.errors.psh_representative_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psh_representative_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("psh_representative_phone")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="psh_representative_phone"
                      type="text"
                      placeholder={t("psh_representative_phone")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psh_representative_phone || ""}
                      invalid={
                        validation.touched.psh_representative_phone &&
                        validation.errors.psh_representative_phone
                          ? true
                          : false
                      }
                      maxLength={24}
                    />
                    {validation.touched.psh_representative_phone &&
                    validation.errors.psh_representative_phone ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psh_representative_phone}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("psh_role")}</Label>
                    <Input
                      name="psh_role"
                      type="textarea"
                      placeholder={t("psh_role")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psh_role || ""}
                      invalid={
                        validation.touched.psh_role &&
                        validation.errors.psh_role
                          ? true
                          : false
                      }
                      maxLength={425}
                    />
                    {validation.touched.psh_role &&
                    validation.errors.psh_role ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psh_role}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("psh_description")}</Label>
                    <Input
                      name="psh_description"
                      type="textarea"
                      placeholder={t("psh_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psh_description || ""}
                      invalid={
                        validation.touched.psh_description &&
                        validation.errors.psh_description
                          ? true
                          : false
                      }
                      maxLength={425}
                    />
                    {validation.touched.psh_description &&
                    validation.errors.psh_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psh_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addProjectStakeholder.isPending ||
                      updateProjectStakeholder.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled
                        >
                          <Spinner size={"sm"} color="#fff" />
                          {t("Save")}
                        </Button>
                      ) : (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
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
ProjectStakeholderModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProjectStakeholderModel;
