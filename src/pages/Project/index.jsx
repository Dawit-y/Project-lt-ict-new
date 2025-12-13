// ProjectModel.js (updated)
import React, { useEffect, useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CardBody } from "reactstrap";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
	useFetchChildProjects,
	useAddProject,
	useDeleteProject,
	useUpdateProject,
} from "../../queries/project_query";
import { useTranslation } from "react-i18next";
import { Button, Col, Row, UncontrolledTooltip, Card, Badge } from "reactstrap";
import { toast } from "react-toastify";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import TreeForProject from "./TreeForProject";
import ProjectFormModal from "./ProjectFormModal";
import ProjectRegionalStructureModal from "./ProjectRegionalStructureModal";
import { FaAlignLeft } from "react-icons/fa";

const ProjectModel = () => {
	document.title = "Projects";
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const [modal, setModal] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [project, setProject] = useState(null);
	const [selectedNode, setSelectedNode] = useState(null);
	const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);

	const { param, isValidParam } = useMemo(() => {
		const param = {
			parent_id: selectedNode?.data?.pri_id,
			prj_woreda_id: selectedNode?.data?.woreda_id,
		};

		const isValidParam =
			Object.keys(param).length > 0 &&
			Object.values(param).every(
				(value) => value !== null && value !== undefined
			) &&
			selectedNode?.data?.level === "output";

		return { param, isValidParam };
	}, [selectedNode]);

	const { data, isLoading, error, isError, refetch } = useFetchChildProjects(
		param,
		isValidParam
	);

	const addProject = useAddProject();
	const updateProject = useUpdateProject();
	const deleteProject = useDeleteProject();

	const handleSubmit = async (values, isEdit, project, selectedNode) => {
		if (isEdit) {
			const updateProjectData = {
				prj_id: project.prj_id,
				prj_name: values.prj_name,
				prj_name_am: values.prj_name_am,
				prj_name_en: values.prj_name_en,
				prj_code: values.prj_code,
				prj_project_status_id: values.prj_project_status_id,
				prj_project_category_id: values.prj_project_category_id,
				prj_project_budget_source_id: values.prj_project_budget_source_id,
				prj_total_estimate_budget: parseFloat(values.prj_total_estimate_budget),
				prj_total_actual_budget: parseFloat(values.prj_total_actual_budget),
				prj_geo_location: values.prj_geo_location,
				prj_sector_id: Number(selectedNode?.data?.sector_id),
				prj_location_region_id: Number(values.prj_location_region_id),
				prj_location_zone_id: Number(values.prj_location_zone_id),
				prj_location_woreda_id: Number(values.prj_location_woreda_id),
				prj_location_kebele_id: values.prj_location_kebele_id,
				prj_location_description: values.prj_location_description,
				prj_owner_region_id: Number(selectedNode.data.region_id),
				prj_owner_zone_id: Number(selectedNode.data.zone_id),
				prj_owner_woreda_id: Number(selectedNode.data.woreda_id),
				prj_owner_kebele_id: values.prj_owner_kebele_id,
				prj_owner_description: values.prj_owner_description,
				prj_start_date_et: values.prj_start_date_et,
				prj_start_date_gc: values.prj_start_date_gc,
				prj_start_date_plan_et: values.prj_start_date_plan_et,
				prj_start_date_plan_gc: values.prj_start_date_plan_gc,
				prj_end_date_actual_et: values.prj_end_date_actual_et,
				prj_end_date_actual_gc: values.prj_end_date_actual_gc,
				prj_end_date_plan_gc: values.prj_end_date_plan_gc,
				prj_end_date_plan_et: values.prj_end_date_plan_et,
				prj_outcome: values.prj_outcome,
				prj_deleted: values.prj_deleted,
				prj_remark: values.prj_remark,
				prj_created_date: values.prj_created_date,
				prj_owner_id: values.prj_owner_id,
				prj_urban_ben_number: values.prj_urban_ben_number,
				prj_rural_ben_number: values.prj_rural_ben_number,
				prj_program_id: 1,
				parent_id: Number(selectedNode.data.pri_id),
				object_type_id: 5,
				prj_measurement_unit: values.prj_measurement_unit,
				prj_measured_figure: values.prj_measured_figure,
			};
			// update Project
			await handleUpdateProject(updateProjectData);
		} else {
			const newProject = {
				prj_name: values.prj_name,
				prj_name_am: values.prj_name_am,
				prj_name_en: values.prj_name_en,
				prj_code: values.prj_code,
				prj_project_status_id: values.prj_project_status_id,
				prj_project_category_id: values.prj_project_category_id,
				prj_project_budget_source_id: values.prj_project_budget_source_id,
				prj_total_estimate_budget: parseFloat(values.prj_total_estimate_budget),
				prj_total_actual_budget: parseFloat(values.prj_total_actual_budget),
				prj_geo_location: values.prj_geo_location,
				prj_sector_id: Number(selectedNode?.data?.sector_id),
				prj_location_region_id: Number(values.prj_location_region_id),
				prj_location_zone_id: Number(values.prj_location_zone_id),
				prj_location_woreda_id: Number(values.prj_location_woreda_id),
				prj_location_kebele_id: values.prj_location_kebele_id,
				prj_location_description: values.prj_location_description,
				prj_owner_region_id: Number(selectedNode.data.region_id),
				prj_owner_zone_id: Number(selectedNode.data.zone_id),
				prj_owner_woreda_id: Number(selectedNode.data.woreda_id),
				prj_owner_kebele_id: values.prj_owner_kebele_id,
				prj_owner_description: values.prj_owner_description,
				prj_start_date_et: values.prj_start_date_et,
				prj_start_date_gc: values.prj_start_date_gc,
				prj_start_date_plan_et: values.prj_start_date_plan_et,
				prj_start_date_plan_gc: values.prj_start_date_plan_gc,
				prj_end_date_actual_et: values.prj_end_date_actual_et,
				prj_end_date_actual_gc: values.prj_end_date_actual_gc,
				prj_end_date_plan_gc: values.prj_end_date_plan_gc,
				prj_end_date_plan_et: values.prj_end_date_plan_et,
				prj_outcome: values.prj_outcome,
				prj_deleted: values.prj_deleted,
				prj_remark: values.prj_remark,
				prj_created_date: values.prj_created_date,
				prj_owner_id: values.prj_owner_id,
				prj_urban_ben_number: values.prj_urban_ben_number,
				prj_rural_ben_number: values.prj_rural_ben_number,
				prj_program_id: 1,
				parent_id: Number(selectedNode.data.pri_id),
				object_type_id: 5,
				prj_measurement_unit: values.prj_measurement_unit,
				prj_measured_figure: values.prj_measured_figure,
			};
			// save new Project
			await handleAddProject(newProject);
		}
	};

	const handleStructureSubmit = async (values) => {
		try {
			await updateProject.mutateAsync(values);
			toast.success(t("update_success"), {
				autoClose: 3000,
			});
			setIsStructureModalOpen(false);
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleAddProject = async (data) => {
		try {
			await addProject.mutateAsync(data);
			toast.success(t("add_success"), {
				autoClose: 3000,
			});
			toggle();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("add_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleUpdateProject = async (data) => {
		try {
			await updateProject.mutateAsync(data);
			toast.success(t("update_success"), {
				autoClose: 3000,
			});
			toggle();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleDeleteProject = async () => {
		if (project && project.prj_id) {
			try {
				const id = project.prj_id;
				await deleteProject.mutateAsync(id);
				toast.success(t("delete_success"), {
					autoClose: 3000,
				});
				setDeleteModal(false);
			} catch (error) {
				toast.error(t("delete_success"), {
					autoClose: 3000,
				});
			}
		}
	};

	const toggle = () => {
		if (modal) {
			setModal(false);
			setProject(null);
		} else {
			setModal(true);
		}
	};

	const [breadcrumb, setBreadcrumb] = useState([]);
	const getBreadcrumbPath = (node) => {
		const breadcrumbArray = [];
		while (node && node.data) {
			breadcrumbArray.unshift(node.data);
			if (node.data.name === "oromia") break;
			node = node.parent;
		}
		setBreadcrumb((prev) =>
			JSON.stringify(prev) !== JSON.stringify(breadcrumbArray)
				? breadcrumbArray
				: prev
		);
	};

	useEffect(() => {
		if (selectedNode) {
			getBreadcrumbPath(selectedNode);
		}
	}, [lang]);

	const handleNodeSelect = useCallback((node) => {
		setSelectedNode(node);
		getBreadcrumbPath(node);
	}, []);

	const handleProjectClick = (arg) => {
		const project = arg;
		setProject(project);
		setIsEdit(true);
		toggle();
	};

	const handleOpenStructureModal = (project) => {
		setProject(project);
		setIsStructureModalOpen(true);
	};

	//delete projects
	const [deleteModal, setDeleteModal] = useState(false);
	const onClickDelete = (project) => {
		setProject(project);
		setDeleteModal(true);
	};

	const handleProjectClicks = () => {
		setIsEdit(false);
		setProject("");
		toggle();
	};

	const getTranslatedName = (node) => {
		if (lang === "en" && node.add_name_en) return node.add_name_en;
		if (lang === "am" && node.add_name_am) return node.add_name_am;
		return node.name;
	};

	const columns = useMemo(() => {
		const baseColumns = [
			{
				header: t("prj_name"),
				accessorKey: "prj_name",
				enableSorting: true,
				enableColumnFilter: false,
				cell: (cellProps) => {
					return (
						<span>
							{cellProps.row.original.footer
								? t("Total")
								: cellProps.getValue()}
						</span>
					);
				},
			},
			{
				header: t("prj_code"),
				accessorKey: "prj_code",
				enableSorting: true,
				enableColumnFilter: false,
				cell: (cellProps) => {
					return (
						<span>
							{cellProps.row.original.footer
								? t("Total")
								: cellProps.getValue()}
						</span>
					);
				},
			},
			{
				header: t("zone_owner"),
				accessorKey: "add_name_or",
				enableSorting: true,
				enableColumnFilter: false,
				cell: (cellProps) => {
					return (
						<span>
							{cellProps.row.original.footer
								? t("Total")
								: cellProps.getValue()}
						</span>
					);
				},
			},
			{
				header: t("prs_status"),
				accessorKey: "bdr_request_status",
				enableSorting: true,
				enableColumnFilter: false,
				cell: (cellProps) => {
					const badgeClass = cellProps.row.original.color_code;
					return (
						<Badge className={`font-size-12 badge-soft-${badgeClass}`}>
							{cellProps.row.original.status_name}
						</Badge>
					);
				},
			},
			{
				header: t("prj_total_estimate_budget"),
				accessorKey: "prj_total_estimate_budget",
				enableSorting: true,
				enableColumnFilter: false,
				cell: (cellProps) => {
					const value = cellProps.getValue();
					return (
						<span>
							{cellProps.row.original.footer
								? value
									? `$${value.toLocaleString()}`
									: ""
								: value
									? `${value.toLocaleString()}`
									: ""}
						</span>
					);
				},
			},
		];
		if (selectedNode?.data?.prj_object_type_id === 4) {
			baseColumns.push({
				header: t("view_details"),
				accessorKey: "view_details",
				enableSorting: false,
				enableColumnFilter: false,
				cell: (cellProps) => {
					if (cellProps.row.original.footer) {
						return "";
					}
					const { prj_id } = cellProps.row.original || {};
					return (
						<Link
							to={`/Projectdetail/${prj_id}#budget_request`}
							target="_blank"
						>
							<Button type="button" className="btn-sm mb-1 default" outline>
								<i className="fa fa-eye"></i>
							</Button>
						</Link>
					);
				},
			});
		}
		if (
			data?.previledge?.is_role_editable == 1 ||
			data?.previledge?.is_role_deletable == 1
		) {
			baseColumns.push({
				header: t("Action"),
				accessorKey: t("Action"),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (cellProps) => {
					return (
						<div className="d-flex gap-1">
							{data?.previledge?.is_role_editable == 1 &&
								cellProps.row.original?.is_editable == 1 && (
									<Button
										color="None"
										size="sm"
										className="text-success"
										onClick={() => {
											const data = cellProps.row.original;
											handleProjectClick(data);
										}}
									>
										<i
											className="mdi mdi-pencil font-size-18"
											id="edittooltip"
										/>
										<UncontrolledTooltip placement="top" target="edittooltip">
											Edit
										</UncontrolledTooltip>
									</Button>
								)}
							<Button
								color="None"
								size="sm"
								className="text-success"
								onClick={() => handleOpenStructureModal(cellProps.row.original)}
							>
								<FaAlignLeft size={18} />
							</Button>
						</div>
					);
				},
			});
		}
		return baseColumns;
	}, [data, handleProjectClick, onClickDelete, t]);

	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}

	return (
		<div className="w-100">
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteProject}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteProject.isPending}
			/>
			<ProjectRegionalStructureModal
				isOpen={isStructureModalOpen}
				toggle={() => setIsStructureModalOpen(!isStructureModalOpen)}
				project={project}
				onSubmit={handleStructureSubmit}
				isLoading={updateProject.isPending}
			/>
			<ProjectFormModal
				isOpen={modal}
				toggle={toggle}
				isEdit={isEdit}
				project={project}
				selectedNode={selectedNode}
				onSubmit={handleSubmit}
				projectsData={data}
				isLoading={addProject.isPending || updateProject.isPending}
			/>
			<div className="page-content">
				<div className="w-100 h-100">
					<Breadcrumbs />
					<div
						className="d-flex gap-2"
						style={{ display: "flex", flexWrap: "nowrap", height: "100%" }}
					>
						<div style={{ flex: "0 0 25%", minWidth: "250px", height: "100%" }}>
							<TreeForProject onNodeSelect={handleNodeSelect} />
						</div>

						<div style={{ flex: "0 0 75%", minWidth: "600px" }}>
							{breadcrumb.length > 0 && (
								<Card className="w-100 d-flex">
									<CardBody className="w-100 d-flex flex-wrap text-break p-3">
										{breadcrumb.map((node, index) => (
											<span key={index} className="me-1 text-break mb-1">
												{getTranslatedName(node)}{" "}
												{index < breadcrumb.length - 1 && (
													<strong>{" > "}</strong>
												)}
											</span>
										))}
									</CardBody>
								</Card>
							)}
							{selectedNode?.data?.level === "output" && (
								<div className="w-100">
									<Card>
										<CardBody>
											<TableContainer
												columns={columns}
												data={data?.data || []}
												isLoading={isLoading}
												isGlobalFilter={true}
												isAddButton={data?.previledge?.is_role_can_add === 1}
												isCustomPageSize={true}
												handleUserClick={handleProjectClicks}
												isPagination={true}
												SearchPlaceholder={t("filter_placeholder")}
												buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
												buttonName={t("add") + " " + t("project")}
												tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
												theadClass="table-light"
												pagination="pagination"
												paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
												excludeKey={["is_editable", "is_deletable"]}
												tableName="Project Data"
											/>
										</CardBody>
									</Card>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
ProjectModel.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};
export default ProjectModel;
