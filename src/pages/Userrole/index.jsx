import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchUserRoles,
  useAddUserRoles,
  useUpdateUserRoles,
  useDeleteUserRoles,
} from "../../queries/user_role_query.jsx";
import { useFetchRoles } from "../../queries/roles_query.jsx";
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
  InputGroup,
} from "reactstrap";
import UserRoleModal from "./UserRoleModal.jsx";
import DynamicDetailsModal from "../../components/Common/DynamicDetailsModal";
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
} from "../../utils/Validation/validation";
import { createSelectOptions } from "../../utils/commonMethods.js";
import { toast } from "react-toastify";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler.jsx";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const UserRoleModel = (props) => {
  const { passedId, isActive } = props;
  const param = { user_id: passedId };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const { data, isLoading, error, isError, refetch } = useFetchUserRoles(
    param,
    isActive,
  );
  const { data: rolesData } = useFetchRoles();
  const rolesOptions = createSelectOptions(
    rolesData?.data || [],
    "rol_id",
    "rol_name",
  );

  const addUserRole = useAddUserRoles();
  const updateUserRole = useUpdateUserRoles();
  const deleteUserRole = useDeleteUserRoles();
  //START CRUD
  const handleAddUserRole = async (data) => {
		try {
			await addUserRole.mutateAsync(data);
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
	const handleUpdateUserRole = async (data) => {
		try {
			await updateUserRole.mutateAsync(data);
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
  const handleDeleteUserRole = async () => {
    if (userRole && userRole.url_id) {
      try {
        const id = userRole.url_id;
        await deleteUserRole.mutateAsync(id);
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
  // validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      url_user_id: (userRole && userRole.url_user_id) || "",
      url_role_id: userRole && userRole.url_role_id,
      url_description: (userRole && userRole.url_description) || "",
      url_status: userRole && userRole.url_status,
      is_deletable: (userRole && userRole.is_deletable) || 1,
      is_editable: (userRole && userRole.is_editable) || 1,
    },
    validationSchema: Yup.object({
      url_role_id: Yup.number()
        .required(t("url_role_id"))
        .test("unique-role-id", t("Already exists"), (value) => {
          return !data?.data.some(
            (item) =>
              item.url_role_id == value && item.url_id !== userRole?.url_id,
          );
        }),
      url_description: alphanumericValidation(3, 425, false),
      url_status: Yup.string().required(t("url_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateUserRole = {
          url_id: userRole ? userRole.url_id : 0,
          url_role_id: values.url_role_id,
          url_user_id: values.url_user_id,
          url_description: values.url_description,
          url_status: values.url_status,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        handleUpdateUserRole(updateUserRole);
      } else {
        const newUserRole = {
          url_user_id: passedId,
          url_description: values.url_description,
          url_status: values.url_status,
          url_role_id: Number(values.url_role_id),
        };
        handleAddUserRole(newUserRole);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const roleDataMap = useMemo(() => {
    return rolesData?.data.reduce((acc, role) => {
      acc[role.rol_id] = role.rol_name;
      return acc;
    }, {});
  }, [rolesData?.data]);

  useEffect(() => {
    setUserRole(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setUserRole(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setUserRole(null);
    } else {
      setModal(true);
    }
  };

  const handleUserRoleClick = (arg) => {
    const userRole = arg;
    setUserRole({
      url_id: userRole.url_id,
      url_role_id: userRole.url_role_id,
      url_user_id: userRole.url_user_id,
      url_description: userRole.url_description,
      url_role_name: userRole.rol_name,
      url_status: userRole.url_status,
      is_deletable: userRole.is_deletable,
      is_editable: userRole.is_editable,
    });

    setIsEdit(true);
    toggle();
  };

  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (userRole) => {
    setUserRole(userRole);
    setDeleteModal(true);
  };

  const handleUserRoleClicks = () => {
    setIsEdit(false);
    setUserRole("");
    toggle();
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "url_role_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const roleId = cellProps.row.original.url_role_id;
          const roleName = roleDataMap?.[roleId] ?? "Unknown Role";
          return <span>{roleName}</span>;
        },
      },
      {
        header: "",
        accessorKey: "url_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.url_description, 30) || "-"}
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
        enableSorting: false,
        cell: (cellProps) => {
          return (
						<div className="d-flex gap-1">
							{cellProps.row.original.is_editable ==1 && (
                <Button
                  size="sm"
									color="Link"
									className="text-success"
									onClick={() => {
										const data = cellProps.row.original;
										handleUserRoleClick(data);
									}}
								>
									<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
									<UncontrolledTooltip placement="top" target="edittooltip">
										Edit
									</UncontrolledTooltip>
								</Button>
							)}

							{cellProps.row.original.is_deletable ==1 && (
                <Button
                  size="sm"
									color="Link"
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
								</Button>
							)}
						</div>
					);
        },
      });
    }

    return baseColumns;
  }, [handleUserRoleClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <UserRoleModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteUserRole}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteUserRole.isPending}
      />
      {isLoading ? (
        <Spinners />
      ) : (
        <TableContainer
          columns={columns}
          data={data?.data}
          isGlobalFilter={true}
          isAddButton={data?.previledge?.is_role_can_add == 1}
          isCustomPageSize={true}
          handleUserClick={handleUserRoleClicks}
          isPagination={true}
          SearchPlaceholder={t("filter_placeholder")}
          buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
          buttonName={t("add") + " " + t("user_role")}
          tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
          theadClass="table-light"
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
        />
      )}
      <Modal isOpen={modal} toggle={toggle} className="modal-xl">
        <ModalHeader toggle={toggle} tag="h4">
          {!!isEdit
            ? t("edit") + " " + t("user_role")
            : t("add") + " " + t("user_role")}
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
                <Label>{t("url_role_id")}</Label>

                <Input
                  name="url_role_id"
                  type="select"
                  className="form-select"
                  onChange={(e) => {
                    validation.setFieldValue(
                      "url_role_id",
                      Number(e.target.value),
                    );
                  }}
                  onBlur={validation.handleBlur}
                  value={validation.values.url_role_id}
                  invalid={
                    validation.touched.url_role_id &&
                    Boolean(validation.errors.url_role_id)
                  }
                >
                  <option value={null}>Select Role</option>
                  {rolesOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(`${option.label}`)}
                    </option>
                  ))}
                </Input>
                {validation.touched.url_role_id &&
                validation.errors.url_role_id ? (
                  <FormFeedback type="invalid">
                    {validation.errors.url_role_id}
                  </FormFeedback>
                ) : null}
              </Col>

              <Col className="col-md-6 mb-3">
                <Label>{t("url_description")}</Label>
                <Input
                  name="url_description"
                  type="textarea"
                  placeholder={t("url_description")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.url_description || ""}
                  invalid={
                    validation.touched.url_description &&
                    validation.errors.url_description
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.url_description &&
                validation.errors.url_description ? (
                  <FormFeedback type="invalid">
                    {validation.errors.url_description}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col className="col-md-6 mb-3">
                <Label>{t("url_status")}</Label>
                <Input
                  name="url_status"
                  type="select"
                  className="form-select"
                  onChange={(e) => {
                    validation.setFieldValue(
                      "url_status",
                      Number(e.target.value),
                    );
                  }}
                  onBlur={validation.handleBlur}
                  value={validation.values.url_status}
                  invalid={
                    validation.touched.url_status &&
                    Boolean(validation.errors.url_status)
                  }
                >
                  <option value={null}>Select status</option>
                  <option value={1}>{t("Active")}</option>
                  <option value={0}>{t("Inactive")}</option>
                </Input>
                {validation.touched.url_status &&
                validation.errors.url_status ? (
                  <FormFeedback type="invalid">
                    {validation.errors.url_status}
                  </FormFeedback>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  {addUserRole.isPending || updateUserRole.isPending ? (
                    <Button
                      color="success"
                      type="submit"
                      className="save-user"
                      disabled={
                        addUserRole.isPending ||
                        updateUserRole.isPending ||
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
                        addUserRole.isPending ||
                        updateUserRole.isPending ||
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
UserRoleModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default UserRoleModel;
