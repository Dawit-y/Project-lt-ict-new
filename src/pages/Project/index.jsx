import React, {
	useEffect,
	useMemo,
	useState,
	useRef,
	useCallback,
} from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import * as Yup from "yup";
import { useFormik } from "formik";
import { CardBody, Spinner } from "reactstrap";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns2";
import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
	useFetchProjects,
	useSearchProjects,
	useFetchChildProjects,
	useAddProject,
	useDeleteProject,
	useUpdateProject,
} from "../../queries/project_query";
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
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
	Badge,
} from "reactstrap";
import {
	alphanumericValidation,
	amountValidation,
	numberValidation,
	onlyAmharicValidation,
	formattedAmountValidation,
} from "../../utils/Validation/validation";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import { toast } from "react-toastify";
import {
	createSelectOptions,
	createMultiSelectOptions,
	convertToNumericValue,
	createMultiLangKeyValueMap,
} from "../../utils/commonMethods";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import TreeForProject from "./TreeForProject";
import DatePicker from "../../components/Common/DatePicker";
import AsyncSelectField from "../../components/Common/AsyncSelectField";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";
import InputField from "../../components/Common/InputField";

const ProjectModel = () => {
	document.title = "Projects";
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const [modal, setModal] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [project, setProject] = useState(null);
	const [selectedNode, setSelectedNode] = useState(null);
	const { data: projectStatusData } = useFetchProjectStatuss();

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

	const {
		data: projectCategoryData,
		isLoading: prCategoryLoading,
		isError: prCategoryIsError,
	} = useFetchProjectCategorys();
	const projectCategoryMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			projectCategoryData?.data || [],
			"pct_id",
			{
				en: "pct_name_en",
				am: "pct_name_am",
				or: "pct_name_or",
			},
			lang,
			(item) => item.pct_owner_type_id === 1
		);
	}, [projectCategoryData, lang]);

	const addProject = useAddProject();
	const updateProject = useUpdateProject();
	const deleteProject = useDeleteProject();

	const handleAddProject = async (data) => {
		try {
			await addProject.mutateAsync(data);
			toast.success(t("add_success"), {
				autoClose: 2000,
			});
			validation.resetForm();
		} catch (error) {
			toast.error(t("add_failure"), {
				autoClose: 2000,
			});
		}
		toggle();
	};

	const handleUpdateProject = async (data) => {
		try {
			await updateProject.mutateAsync(data);
			toast.success(t("update_success"), {
				autoClose: 2000,
			});
			validation.resetForm();
		} catch (error) {
			toast.error(t("update_failure"), {
				autoClose: 2000,
			});
		}
		toggle();
	};

	const handleDeleteProject = async () => {
		if (project && project.prj_id) {
			try {
				const id = project.prj_id;
				await deleteProject.mutateAsync(id);
				toast.success(t("delete_success"), {
					autoClose: 2000,
				});
			} catch (error) {
				toast.error(t("delete_success"), {
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
			prj_name: (project && project.prj_name) || "",
			prj_name_am: (project && project.prj_name_am) || "",
			prj_name_en: (project && project.prj_name_en) || "",
			prj_code: (project && project.prj_code) || "",
			prj_project_status_id: (project && project.prj_project_status_id) || "",
			prj_project_category_id:
				(project && project.prj_project_category_id) || "",
			prj_project_budget_source_id:
				(project && project.prj_project_budget_source_id) || "",
			prj_total_estimate_budget:
				(project && project.prj_total_estimate_budget) || "",
			prj_total_actual_budget:
				(project && project.prj_total_actual_budget) || "",
			prj_geo_location: (project && project.prj_geo_location) || "",
			prj_sector_id: (project && project.prj_sector_id) || "",
			prj_location_region_id:
				(project && project.prj_location_region_id) ||
				selectedNode?.data?.region_id,
			prj_location_zone_id:
				(project && project.prj_location_zone_id) ||
				selectedNode?.data?.zone_id,
			prj_location_woreda_id:
				(project && project.prj_location_woreda_id) ||
				selectedNode?.data?.woreda_id,
			prj_location_kebele_id: (project && project.prj_location_kebele_id) || "",
			prj_location_description:
				(project && project.prj_location_description) || "",
			//prj_owner_region_id: (project && project.prj_owner_region_id) || "",
			/*prj_owner_zone_id: (project && project.prj_owner_zone_id) || "",
      prj_owner_woreda_id: (project && project.prj_owner_woreda_id) || "",
      prj_owner_kebele_id: (project && project.prj_owner_kebele_id) || "",*/
			prj_owner_description: (project && project.prj_owner_description) || "",
			prj_start_date_et: (project && project.prj_start_date_et) || "",
			prj_start_date_gc: (project && project.prj_start_date_gc) || "",
			prj_start_date_plan_et: (project && project.prj_start_date_plan_et) || "",
			prj_start_date_plan_gc: (project && project.prj_start_date_plan_gc) || "",
			prj_end_date_actual_et: (project && project.prj_end_date_actual_et) || "",
			prj_end_date_actual_gc: (project && project.prj_end_date_actual_gc) || "",
			prj_end_date_plan_gc: (project && project.prj_end_date_plan_gc) || "",
			prj_end_date_plan_et: (project && project.prj_end_date_plan_et) || "",
			prj_outcome: (project && project.prj_outcome) || "",
			prj_deleted: (project && project.prj_deleted) || "",
			prj_remark: (project && project.prj_remark) || "",
			prj_created_date: (project && project.prj_created_date) || "",
			prj_owner_id: (project && project.prj_owner_id) || "",
			prj_urban_ben_number: (project && project.prj_urban_ben_number) || "",
			prj_rural_ben_number: (project && project.prj_rural_ben_number) || "",
			// prj_department_id: (project && project.prj_department_id) || "",
			is_deletable: (project && project.is_deletable) || 1,
			is_editable: (project && project.is_editable) || 1,
			prj_measurement_unit: (project && project.prj_measurement_unit) || "",
			prj_measured_figure: (project && project.prj_measured_figure) || "",
		},

		validationSchema: Yup.object({
			prj_name: alphanumericValidation(3, 200, true).test(
				"unique-prj_name",
				t("Already exists"),
				(value) => {
					return !data?.data.some(
						(item) => item.prj_name == value && item.prj_id !== project?.prj_id
					);
				}
			),
			prj_name_am: onlyAmharicValidation(3, 200, false),
			prj_name_en: alphanumericValidation(3, 200, true).test(
				"unique-prj_name_en",
				t("Already exists"),
				(value) => {
					return !data?.data.some(
						(item) =>
							item.prj_name_en == value && item.prj_id !== project?.prj_id
					);
				}
			),
			prj_code: alphanumericValidation(3, 20, false),
			/*test(
        "unique-prj_code",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) => item.prj_code == value && item.prj_id !== project?.prj_id
          );
        }
      ),*/
			//prj_project_status_id: Yup.string().required(t('prj_project_status_id')),
			prj_project_category_id: numberValidation(1, 200, true),
			//prj_project_budget_source_id: Yup.string().required(t('prj_project_budget_source_id')),
			prj_total_estimate_budget: formattedAmountValidation(
				1000,
				1000000000000,
				true
			),
			prj_total_actual_budget: formattedAmountValidation(
				1000,
				1000000000000,
				false
			),
			//prj_geo_location: Yup.string().required(t('prj_geo_location')),
			//prj_sector_id: Yup.string().required(t("prj_sector_id")),
			prj_location_region_id: Yup.string().required(
				t("prj_location_region_id")
			),
			prj_location_zone_id: Yup.string().required(t("prj_location_zone_id")),
			prj_start_date_plan_gc: Yup.string().required(
				t("prj_start_date_plan_gc")
			),
			prj_end_date_plan_gc: Yup.string().required(t("prj_end_date_plan_gc")),
			prj_location_woreda_id: Yup.string().required(
				t("prj_location_woreda_id")
			),
			//prj_department_id: Yup.string().required(t("prj_department_id")),
			prj_urban_ben_number: numberValidation(0, 10000000, false),
			prj_rural_ben_number: numberValidation(0, 10000000, false),
			prj_location_description: alphanumericValidation(3, 425, false),
			//prj_outcome: alphanumericValidation(3, 425, true),
			prj_remark: alphanumericValidation(3, 425, false),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			if (isEdit) {
				const updateProject = {
					prj_id: project.prj_id,
					prj_name: values.prj_name,
					prj_name_am: values.prj_name_am,
					prj_name_en: values.prj_name_en,
					prj_code: values.prj_code,
					prj_project_status_id: values.prj_project_status_id,
					prj_project_category_id: values.prj_project_category_id,
					prj_project_budget_source_id: values.prj_project_budget_source_id,
					prj_total_estimate_budget: parseFloat(
						values.prj_total_estimate_budget
					),
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
					//prj_department_id: Number(values.prj_department_id),
					prj_program_id: 1,
					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
					parent_id: Number(selectedNode.data.pri_id),
					object_type_id: 5,
					prj_measurement_unit: values.prj_measurement_unit,
					prj_measured_figure: convertToNumericValue(
						values.prj_measured_figure
					),
				};
				// update Project
				handleUpdateProject(updateProject);
			} else {
				const newProject = {
					prj_name: values.prj_name,
					prj_name_am: values.prj_name_am,
					prj_name_en: values.prj_name_en,
					prj_code: values.prj_code,
					prj_project_status_id: values.prj_project_status_id,
					prj_project_category_id: values.prj_project_category_id,
					prj_project_budget_source_id: values.prj_project_budget_source_id,
					prj_total_estimate_budget: parseFloat(
						values.prj_total_estimate_budget
					),
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
					//prj_department_id: Number(values.prj_department_id),
					prj_program_id: 1,
					parent_id: Number(selectedNode.data.pri_id),
					object_type_id: 5,
					prj_measurement_unit: values.prj_measurement_unit,
					prj_measured_figure: convertToNumericValue(
						values.prj_measured_figure
					),
				};
				// save new Project
				handleAddProject(newProject);
			}
		},
	});
	useEffect(() => {
		setProject(data);
	}, [data]);

	useEffect(() => {
		if (!isEmpty(data) && !!isEdit) {
			setProject(data);
			setIsEdit(false);
		}
	}, [data]);

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
	const projectStatusOptions = useMemo(() => {
		return (
			projectStatusData?.data
				?.filter((type) => type.prs_id === 5 || type.prs_id === 6)
				.map((type) => ({
					label: type.prs_status_name_or,
					value: type.prs_id,
				})) || []
		);
	}, [projectStatusData]);
	const handleProjectClick = (arg) => {
		const project = arg;
		setProject({
			prj_id: project.prj_id,
			prj_name: project.prj_name,
			prj_name_am: project.prj_name_am,
			prj_name_en: project.prj_name_en,
			prj_code: project.prj_code,
			prj_project_status_id: project.prj_project_status_id,
			prj_project_category_id: project.prj_project_category_id,
			prj_project_budget_source_id: project.prj_project_budget_source_id,
			prj_total_estimate_budget: project.prj_total_estimate_budget,
			prj_total_actual_budget: project.prj_total_actual_budget,
			prj_geo_location: project.prj_geo_location,
			prj_sector_id: project.prj_sector_id,
			prj_location_region_id: project.prj_location_region_id,
			prj_location_zone_id: project.prj_location_zone_id,
			prj_location_woreda_id: project.prj_location_woreda_id,
			prj_location_kebele_id: project.prj_location_kebele_id,
			prj_location_description: project.prj_location_description,
			prj_owner_region_id: project.prj_owner_region_id,
			prj_owner_zone_id: project.prj_owner_zone_id,
			prj_owner_woreda_id: project.prj_owner_woreda_id,
			prj_owner_kebele_id: project.prj_owner_kebele_id,
			prj_owner_description: project.prj_owner_description,
			prj_start_date_et: project.prj_start_date_et,
			prj_start_date_gc: project.prj_start_date_gc,
			prj_start_date_plan_et: project.prj_start_date_plan_et,
			prj_start_date_plan_gc: project.prj_start_date_plan_gc,
			prj_end_date_actual_et: project.prj_end_date_actual_et,
			prj_end_date_actual_gc: project.prj_end_date_actual_gc,
			prj_end_date_plan_gc: project.prj_end_date_plan_gc,
			prj_end_date_plan_et: project.prj_end_date_plan_et,
			prj_outcome: project.prj_outcome,
			prj_deleted: project.prj_deleted,
			prj_remark: project.prj_remark,
			prj_created_date: project.prj_created_date,
			prj_owner_id: project.prj_owner_id,
			prj_urban_ben_number: project.prj_urban_ben_number,
			prj_rural_ben_number: project.prj_rural_ben_number,
			//prj_department_id: project.prj_department_id,
			is_deletable: project.is_deletable,
			is_editable: project.is_editable,
			prj_measurement_unit: project.prj_measurement_unit,
			prj_measured_figure: project.prj_measured_figure,
		});
		setIsEdit(true);
		toggle();
	};
	//delete projects
	const [deleteModal, setDeleteModal] = useState(false);
	const onClickDelete = (project) => {
		setProject(project);
		setDeleteModal(true);
	};

	const handleProjectClicks = () => {
		validation.resetForm();
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
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<div className="d-flex gap-3">
							{data?.previledge?.is_role_editable == 1 &&
								cellProps.row.original?.is_editable == 1 && (
									<Link
										to="#"
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
									</Link>
								)}
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
			<div className="page-content">
				<div className="w-100 h-100">
					<Breadcrumbs title={t("project")} breadcrumbItem={t("project")} />
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
			<Modal isOpen={modal} toggle={toggle} className="modal-xl">
				<ModalHeader toggle={toggle} tag="h4">
					{!!isEdit
						? t("edit") + " " + t("project")
						: t("add") + " " + t("project")}
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
							<Col className="col-md-12 mb-3">
								<CascadingDropdowns
									validation={validation}
									dropdown1name="prj_location_region_id"
									dropdown2name="prj_location_zone_id"
									dropdown3name="prj_location_woreda_id"
									isEdit={isEdit}
								/>
							</Col>
							<InputField
								type="textarea"
								validation={validation}
								fieldId={"prj_location_description"}
								isRequired={false}
								className="col-md-12 mb-3"
								maxLength={400}
							/>
							<InputField
								type="text"
								validation={validation}
								fieldId="prj_name"
								onChange={(e) => {
									validation.handleChange(e);
									validation.setFieldValue("prj_name_en", e.target.value);
								}}
								isRequired={true}
								className="col-md-4 mb-3"
								maxLength={200}
							/>
							<InputField
								type="text"
								validation={validation}
								fieldId={"prj_name_am"}
								isRequired={false}
								className="col-md-4 mb-3"
								maxLength={200}
							/>
							<InputField
								type="text"
								validation={validation}
								fieldId={"prj_name_en"}
								isRequired={true}
								className="col-md-4 mb-3"
								maxLength={200}
							/>
							<InputField
								type="text"
								validation={validation}
								fieldId={"prj_code"}
								isRequired={false}
								className="col-md-4 mb-3"
								maxLength={200}
							/>
							<AsyncSelectField
								fieldId="prj_project_category_id"
								validation={validation}
								isRequired
								className="col-md-4 mb-3"
								optionMap={projectCategoryMap}
								isLoading={prCategoryLoading}
								isError={prCategoryIsError}
							/>
							<FormattedAmountField
								validation={validation}
								fieldId={"prj_total_estimate_budget"}
								isRequired={true}
								allowDecimal={true}
								className={"col-md-4 mb-3"}
							/>
							<FormattedAmountField
								validation={validation}
								fieldId={"prj_total_actual_budget"}
								isRequired={false}
								allowDecimal={true}
								className={"col-md-4 mb-3"}
							/>
							<Col className="col-md-4 mb-3">
								<DatePicker
									isRequired={true}
									componentId={"prj_start_date_plan_gc"}
									validation={validation}
								/>
							</Col>
							<Col className="col-md-4 mb-3">
								<DatePicker
									isRequired={true}
									componentId={"prj_end_date_plan_gc"}
									validation={validation}
									minDate={validation.values.prj_start_date_plan_gc}
								/>
							</Col>
							<FormattedAmountField
								validation={validation}
								fieldId={"prj_urban_ben_number"}
								isRequired={false}
								className="col-md-2 mb-3"
								allowDecimal={false}
							/>
							<FormattedAmountField
								validation={validation}
								fieldId={"prj_rural_ben_number"}
								isRequired={false}
								className="col-md-2 mb-3"
								allowDecimal={false}
							/>
							<Col className="col-md-2 mb-3">
								<Label>{t("Total Beneficiaries")}</Label>
								<Input
									type="number"
									readOnly
									value={
										(Number(validation.values.prj_urban_ben_number) || 0) +
										(Number(validation.values.prj_rural_ben_number) || 0)
									}
									className="bg-light"
								/>
							</Col>
							<InputField
								type="text"
								validation={validation}
								fieldId={"prj_measurement_unit"}
								isRequired={false}
								className="col-md-3 mb-3"
								maxLength={200}
							/>
							<FormattedAmountField
								validation={validation}
								fieldId={"prj_measured_figure"}
								isRequired={false}
								allowDecimal={true}
							/>
							<InputField
								type="textarea"
								validation={validation}
								fieldId={"prj_outcome"}
								isRequired={false}
								className="col-md-6 mb-3"
								maxLength={400}
								rows={3}
							/>
							<InputField
								type="textarea"
								validation={validation}
								fieldId={"prj_remark"}
								isRequired={false}
								className="col-md-6 mb-3"
								maxLength={400}
								rows={3}
							/>
						</Row>
						<Row>
							<Col>
								<div className="text-end">
									<Button
										color="success"
										type="submit"
										className="save-user"
										disabled={
											addProject.isPending ||
											updateProject.isPending ||
											!validation.dirty
										}
									>
										{(addProject.isPending || updateProject.isPending) && (
											<Spinner size="sm" color="light" className="me-2" />
										)}
										{t("Save")}
									</Button>
								</div>
							</Col>
						</Row>
					</Form>
				</ModalBody>
			</Modal>
		</div>
	);
};
ProjectModel.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};
export default ProjectModel;
