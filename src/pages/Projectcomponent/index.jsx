import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
//import components

import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchProjectComponents,
  useSearchProjectComponents,
  useAddProjectComponent,
  useDeleteProjectComponent,
  useUpdateProjectComponent,
} from "../../queries/projectcomponent_query";
import ProjectComponentModal from "./ProjectComponentModal";
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
import "react-toastify/dist/ReactToastify.css";

const RequiredIndicator = () => <span className="text-danger">*</span>;

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectComponentModel = (props) => {
  //meta title
  document.title = " ProjectComponent";
  const { passedId, isActive, status, startDate } = props;
  const param = { project_id: passedId, request_type: "single" };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectComponent, setProjectComponent] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, isFetching, error, isError, refetch } =
    useFetchProjectComponents(param, isActive);
  const addProjectComponent = useAddProjectComponent();
  const updateProjectComponent = useUpdateProjectComponent();
  const deleteProjectComponent = useDeleteProjectComponent();

  //START CRUD
  const handleAddProjectComponent = async (data) => {
    try {
      await addProjectComponent.mutateAsync(data);
      toast.success(t("add_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("add_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleUpdateProjectComponent = async (data) => {
    try {
      await updateProjectComponent.mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("update_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleDeleteProjectComponent = async () => {
    if (projectComponent && projectComponent.pcm_id) {
      try {
        const id = projectComponent.pcm_id;
        await deleteProjectComponent.mutateAsync(id);
        toast.success(t("delete_success"), {
          autoClose: 2000,
        });
      } catch (error) {
        toast.success(t("delete_failure"), {
          autoClose: 2000,
        });
      }
      setDeleteModal(false);
    }
  };
  //END CRUD

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,
    initialValues: {
      pcm_project_id: passedId,
      pcm_component_name:
        (projectComponent && projectComponent.pcm_component_name) || "",
      pcm_unit_measurement:
        (projectComponent && projectComponent.pcm_unit_measurement) || "",
      pcm_amount: (projectComponent && projectComponent.pcm_amount) || "",
      pcm_description:
        (projectComponent && projectComponent.pcm_description) || "",
      is_deletable: (projectComponent && projectComponent.is_deletable) || 1,
      is_editable: (projectComponent && projectComponent.is_editable) || 1,
    },
    validationSchema: Yup.object({
      pcm_project_id: Yup.string().required(t("pcm_project_id")),
      pcm_component_name: Yup.string().required(t("pcm_component_name")),
      pcm_unit_measurement: Yup.string().required(t("pcm_unit_measurement")),
      pcm_amount: Yup.string().required(t("pcm_amount")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectComponent = {
          pcm_id: projectComponent ? projectComponent.pcm_id : 0,
          pcm_project_id: passedId,
          pcm_component_name: values.pcm_component_name,
          pcm_unit_measurement: values.pcm_unit_measurement,
          pcm_amount: values.pcm_amount,
          pcm_description: values.pcm_description,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectComponent
        handleUpdateProjectComponent(updateProjectComponent);
      } else {
        const newProjectComponent = {
          pcm_project_id: passedId,
          pcm_component_name: values.pcm_component_name,
          pcm_unit_measurement: values.pcm_unit_measurement,
          pcm_amount: values.pcm_amount,
          pcm_description: values.pcm_description,
        };
        // save new ProjectComponent
        handleAddProjectComponent(newProjectComponent);
      }
    },
  });

  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch ProjectComponent on component mount
  useEffect(() => {
    setProjectComponent(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectComponent(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectComponent(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectComponentClick = (arg) => {
    const projectComponent = arg;
    setProjectComponent({
      pcm_id: projectComponent.pcm_id,
      pcm_project_id: projectComponent.pcm_project_id,
      pcm_component_name: projectComponent.pcm_component_name,
      pcm_unit_measurement: projectComponent.pcm_unit_measurement,
      pcm_amount: projectComponent.pcm_amount,
      pcm_description: projectComponent.pcm_description,
      is_deletable: projectComponent.is_deletable,
      is_editable: projectComponent.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (projectComponent) => {
    setProjectComponent(projectComponent);
    setDeleteModal(true);
  };

  const handleProjectComponentClicks = () => {
    setIsEdit(false);
    setProjectComponent("");
    toggle();
  };

  //START UNCHANGED
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "pcm_component_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pcm_component_name, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pcm_unit_measurement",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pcm_unit_measurement, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pcm_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pcm_amount, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pcm_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pcm_description, 30) || "-"}
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
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              {cellProps.row.original.is_editable == 1 && (
                <Link
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleProjectComponentClick(data);
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
  }, [handleProjectComponentClick, toggleViewModal, onClickDelete]);

  return (
		<React.Fragment>
			<ProjectComponentModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
			/>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteProjectComponent}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteProjectComponent.isPending}
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
					handleUserClick={handleProjectComponentClicks}
					isPagination={true}
					SearchPlaceholder={26 + " " + t("Results") + "..."}
					buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
					buttonName={t("add")}
					tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
					theadClass="table-light"
					pagination="pagination"
					paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
					refetch={refetch}
					isFetching={isFetching}
				/>
			)}
			<Modal isOpen={modal} toggle={toggle} className="modal-xl">
				<ModalHeader toggle={toggle} tag="h4">
					{!!isEdit
						? t("edit") + " " + t("project_component")
						: t("add") + " " + t("project_component")}
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
									{t("pcm_component_name")} <RequiredIndicator />
								</Label>
								<Input
									name="pcm_component_name"
									type="text"
									placeholder={t("pcm_component_name")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.pcm_component_name || ""}
									invalid={
										validation.touched.pcm_component_name &&
										validation.errors.pcm_component_name
											? true
											: false
									}
								/>
								{validation.touched.pcm_component_name &&
								validation.errors.pcm_component_name ? (
									<FormFeedback type="invalid">
										{validation.errors.pcm_component_name}
									</FormFeedback>
								) : null}
							</Col>
							<Col className="col-md-6 mb-3">
								<Label>
									{t("pcm_unit_measurement")} <RequiredIndicator />
								</Label>
								<Input
									name="pcm_unit_measurement"
									type="text"
									placeholder={t("pcm_unit_measurement")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.pcm_unit_measurement || ""}
									invalid={
										validation.touched.pcm_unit_measurement &&
										validation.errors.pcm_unit_measurement
											? true
											: false
									}
								/>
								{validation.touched.pcm_unit_measurement &&
								validation.errors.pcm_unit_measurement ? (
									<FormFeedback type="invalid">
										{validation.errors.pcm_unit_measurement}
									</FormFeedback>
								) : null}
							</Col>
							<Col className="col-md-6 mb-3">
								<Label>
									{t("pcm_amount")} <RequiredIndicator />
								</Label>
								<Input
									name="pcm_amount"
									type="text"
									placeholder={t("pcm_amount")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.pcm_amount || ""}
									invalid={
										validation.touched.pcm_amount &&
										validation.errors.pcm_amount
											? true
											: false
									}
								/>
								{validation.touched.pcm_amount &&
								validation.errors.pcm_amount ? (
									<FormFeedback type="invalid">
										{validation.errors.pcm_amount}
									</FormFeedback>
								) : null}
							</Col>
							<Col className="col-md-6 mb-3">
								<Label>{t("pcm_description")}</Label>
								<Input
									name="pcm_description"
									type="textarea"
									placeholder={t("pcm_description")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.pcm_description || ""}
									invalid={
										validation.touched.pcm_description &&
										validation.errors.pcm_description
											? true
											: false
									}
									rows="3"
								/>
								{validation.touched.pcm_description &&
								validation.errors.pcm_description ? (
									<FormFeedback type="invalid">
										{validation.errors.pcm_description}
									</FormFeedback>
								) : null}
							</Col>
						</Row>
						<Row>
							<Col>
								<div className="text-end">
									{addProjectComponent.isPending ||
									updateProjectComponent.isPending ? (
										<Button
											color="success"
											type="submit"
											className="save-user"
											disabled={
												addProjectComponent.isPending ||
												updateProjectComponent.isPending ||
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
												addProjectComponent.isPending ||
												updateProjectComponent.isPending ||
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

ProjectComponentModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectComponentModel;
