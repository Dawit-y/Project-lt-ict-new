import React, {
	useEffect,
	useMemo,
	useState,
	useRef,
	useCallback,
} from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
	useFetchProjects,
	useAddProject,
	useUpdateProject,
	useDeleteProject,
	useFindProjects,
} from "../../queries/cso_project_query";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../hooks/useAuthUser";
import Spinners from "../../components/Common/Spinner";
import {
	alphanumericValidation,
	amountValidation,
	formattedAmountValidation,
	numberValidation,
	onlyAmharicValidation,
} from "../../utils/Validation/validation";
import { toast } from "react-toastify";
import ProjectTabs from "./ProjectTabs";
import RegionProjectTab from "./RegionProjectTab";
import ProjectForm from "./ProjectForm";
import ActivityForm from "./ActivityForm";

const ProjectModel = () => {
	document.title = "CSO Projects";
	const { t } = useTranslation();
	const [modal, setModal] = useState(false);
	const [modalActivity, setModalActivity] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [project, setProject] = useState(null);
	const [leftBudget, setLeftBudget] = useState(null);
	const [currentActiveTab, setCurrentActiveTab] = useState({
		tab: 1,
		selectedId: null,
		selectedCsoId: null,
	});

	const handleTabChange = (newTab, selectedId = null, selectedCsoId) => {
		setCurrentActiveTab((prev) => ({
			...prev,
			tab: newTab,
			selectedId: selectedId !== null ? selectedId : prev.selectedId,
			selectedCsoId:
				selectedCsoId !== null ? selectedCsoId : prev.selectedCsoId,
		}));
	};

	const { user: storedUser, userId } = useAuthUser();
	const userType = storedUser?.usr_user_type;
	const csoId = storedUser?.usr_owner_id;
	const { data, isLoading, error, isError, refetch } = useFindProjects(
		{ object_type_id: 1 },
		true,
		userId
	);

	const addProject = useAddProject();
	const updateProject = useUpdateProject();
	const deleteProject = useDeleteProject();

	const handleAddProject = async (data) => {
		try {
			await addProject.mutateAsync(data);
			toast.success(t("add_success"), {
				autoClose: 3000,
			});
			validation.resetForm();
		} catch (error) {
			toast.error(t("add_failure"), {
				autoClose: 3000,
			});
		}
		(isUserType2 && isTab2) || (!isUserType2 && isTab1)
			? toggle()
			: toggleActivity();
	};

	const handleUpdateProject = async (data) => {
		try {
			await updateProject.mutateAsync(data);
			toast.success(t("update_success"), {
				autoClose: 3000,
			});
			validation.resetForm();
		} catch (error) {
			toast.error(t("update_failure"), {
				autoClose: 3000,
			});
		}
		(isUserType2 && isTab2) || (!isUserType2 && isTab1)
			? toggle()
			: toggleActivity();
	};
	const handleDeleteProject = async () => {
		if (project && project.prj_id) {
			try {
				const id = project.prj_id;
				await deleteProject.mutateAsync(id);
				toast.success(t("delete_success"), {
					autoClose: 3000,
				});
			} catch (error) {
				toast.error(t("delete_success"), {
					autoClose: 3000,
				});
			}
			setDeleteModal(false);
		}
	};

	const isUserType2 = userType === 2;

	const isTab1 = useMemo(
		() => currentActiveTab?.tab === 1,
		[currentActiveTab?.tab]
	);
	const isTab2 = useMemo(
		() => currentActiveTab?.tab === 2,
		[currentActiveTab?.tab]
	);

	const projectSchema = Yup.object({
		prj_name: alphanumericValidation(3, 200, true),
		prj_name_am: onlyAmharicValidation(3, 200, false),
		prj_name_en: alphanumericValidation(3, 200, true),
		prj_code: alphanumericValidation(3, 20, false),
		prj_project_category_id: numberValidation(1, 200, true),
		prj_cluster_id: Yup.number().required(t("prj_cluster_id")),
		prj_total_actual_budget: formattedAmountValidation(
			1000,
			1000000000000,
			true
		).test(
			"admin-program-budget-check-budget",
			t(
				"Sum of admin cost and program cost should be equal with total actual budget"
			),
			function (budget) {
				const { prj_admin_cost, prj_program_cost } = this.parent;
				const adminCost = prj_admin_cost || 0;
				const programCost = prj_program_cost || 0;
				const total = adminCost + programCost;

				return total <= (budget || 0);
			}
		),
		prj_total_estimate_budget: formattedAmountValidation(
			1000,
			1000000000000,
			true
		),
		prj_start_date_plan_gc: Yup.string().required(t("prj_start_date_plan_gc")),
		prj_end_date_plan_gc: Yup.string().required(t("prj_end_date_plan_gc")),
		prj_location_region_id: Yup.string().required(t("prj_location_region_id")),
		prj_location_zone_id: Yup.string().required(t("prj_location_zone_id")),
		prj_location_woreda_id: Yup.string().required(t("prj_location_woreda_id")),
		prj_urban_ben_number: numberValidation(0, 1000000000000, false),
		prj_rural_ben_number: numberValidation(0, 1000000000000, false),
		prj_admin_cost: numberValidation(0, 1000000000000, true).test(
			"admin-program-budget-check-admin",
			t(
				"Sum of admin cost and program cost should be equal with total actual budget"
			),
			function (adminCost) {
				const { prj_program_cost, prj_total_actual_budget } = this.parent;
				const programCost = prj_program_cost || 0;
				const total = (adminCost || 0) + programCost;
				const budget = prj_total_actual_budget || 0;

				return total == budget;
			}
		),

		prj_program_cost: numberValidation(0, 1000000000000, true).test(
			"admin-program-budget-check-program",
			t(
				"Sum of admin cost and program cost should be equal with total actual budget"
			),
			function (programCost) {
				const { prj_admin_cost, prj_total_actual_budget } = this.parent;
				const adminCost = prj_admin_cost || 0;
				const total = adminCost + (programCost || 0);
				const budget = prj_total_actual_budget || 0;

				return total == budget;
			}
		),
		prj_male_participant: numberValidation(0, 1000000000000, true),
		prj_female_participant: numberValidation(0, 1000000000000, true),
		prj_location_description: alphanumericValidation(3, 425, false),
		prj_remark: alphanumericValidation(3, 425, false),

		prj_direct_ben_male: formattedAmountValidation(0, 1000000000000, false),
		prj_direct_ben_female: formattedAmountValidation(0, 1000000000000, false),
		prj_indirect_ben_male: formattedAmountValidation(0, 1000000000000, false),
		prj_indirect_ben_female: formattedAmountValidation(0, 1000000000000, false),
		prj_date_agreement_signed: Yup.string().nullable(),
		prj_agreement_signed_level: Yup.string().nullable(),
	});

	const activitySchema = Yup.object({
		prj_name: alphanumericValidation(3, 300, true),
		prj_total_actual_budget: formattedAmountValidation(1000, leftBudget, true),
		prj_project_category_id: numberValidation(1, 200, true),
		prj_measurement_unit: alphanumericValidation(2, 200, false),
		prj_measured_figure: formattedAmountValidation(0, 10000000000, false),
	});

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
			prj_cluster_id: (project && project.prj_cluster_id) || "",
			prj_project_budget_source_id:
				(project && project.prj_project_budget_source_id) || "",
			prj_total_estimate_budget:
				(project && project.prj_total_estimate_budget) || "",
			prj_total_actual_budget:
				(project && project.prj_total_actual_budget) || "",
			prj_geo_location: (project && project.prj_geo_location) || "",
			prj_sector_id: (project && project.prj_sector_id) || "",
			prj_location_region_id: (project && project.prj_location_region_id) || "",
			prj_location_zone_id: (project && project.prj_location_zone_id) || "",
			prj_location_woreda_id: (project && project.prj_location_woreda_id) || "",
			prj_location_kebele_id: (project && project.prj_location_kebele_id) || "",
			prj_location_description:
				(project && project.prj_location_description) || "",
			prj_owner_region_id: (project && project.prj_owner_region_id) || "",
			prj_owner_zone_id: (project && project.prj_owner_zone_id) || "",
			prj_owner_woreda_id: (project && project.prj_owner_woreda_id) || "",
			prj_owner_kebele_id: (project && project.prj_owner_kebele_id) || "",
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
			prj_admin_cost: (project && project.prj_admin_cost) || "",
			prj_program_cost: (project && project.prj_program_cost) || "",
			prj_male_participant: (project && project.prj_male_participant) || "",
			prj_female_participant: (project && project.prj_female_participant) || "",
			prj_measurement_unit: (project && project.prj_measurement_unit) || "",
			prj_measured_figure: (project && project.prj_measured_figure) || "",

			prj_direct_ben_male: (project && project.prj_direct_ben_male) || "",
			prj_direct_ben_female: (project && project.prj_direct_ben_female) || "",
			prj_indirect_ben_male: (project && project.prj_indirect_ben_male) || "",
			prj_indirect_ben_female:
				(project && project.prj_indirect_ben_female) || "",
			prj_date_agreement_signed:
				(project && project.prj_date_agreement_signed) || "",
			prj_agreement_signed_level:
				(project && project.prj_agreement_signed_level) || "",
		},

		validationSchema:
			(isUserType2 && isTab2) || (!isUserType2 && isTab1)
				? projectSchema
				: activitySchema,
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
					prj_cluster_id: values.prj_cluster_id,
					prj_project_budget_source_id: values.prj_project_budget_source_id,
					prj_total_estimate_budget: values.prj_total_estimate_budget,
					prj_total_actual_budget: values.prj_total_actual_budget,
					prj_geo_location: values.prj_geo_location,
					prj_location_region_id: Number(values.prj_location_region_id),
					prj_location_zone_id: Number(values.prj_location_zone_id),
					prj_location_woreda_id: Number(values.prj_location_woreda_id),
					prj_location_kebele_id: values.prj_location_kebele_id,
					prj_location_description: values.prj_location_description,
					prj_owner_region_id: Number(values.prj_owner_region_id),
					prj_owner_zone_id: Number(values.prj_owner_zone_id),
					prj_owner_woreda_id: Number(values.prj_owner_woreda_id),
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
					prj_owner_id: userType === 2 ? currentActiveTab.selectedCsoId : csoId,
					prj_urban_ben_number: values.prj_urban_ben_number,
					prj_rural_ben_number: values.prj_rural_ben_number,
					prj_admin_cost: values.prj_admin_cost,
					prj_program_cost: values.prj_program_cost,
					prj_male_participant: values.prj_male_participant,
					prj_female_participant: values.prj_female_participant,
					prj_program_id: 1,
					parent_id:
						(isUserType2 && isTab2) || (!isUserType2 && isTab1)
							? 1
							: currentActiveTab?.selectedId,
					object_type_id:
						(isUserType2 && isTab2) || (!isUserType2 && isTab1) ? 1 : 5,
					prj_measurement_unit: values.prj_measurement_unit,
					prj_measured_figure: values.prj_measured_figure,
					// Add new fields to update project
					prj_direct_ben_male: values.prj_direct_ben_male,
					prj_direct_ben_female: values.prj_direct_ben_female,
					prj_indirect_ben_male: values.prj_indirect_ben_male,
					prj_indirect_ben_female: values.prj_indirect_ben_female,
					prj_date_agreement_signed: values.prj_date_agreement_signed,
					prj_agreement_signed_level: values.prj_agreement_signed_level,
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
					prj_cluster_id: values.prj_cluster_id,
					prj_project_budget_source_id: values.prj_project_budget_source_id,
					prj_total_estimate_budget: values.prj_total_estimate_budget,
					prj_total_actual_budget: values.prj_total_actual_budget,
					prj_geo_location: values.prj_geo_location,
					prj_location_region_id: Number(values.prj_location_region_id),
					prj_location_zone_id: Number(values.prj_location_zone_id),
					prj_location_woreda_id: Number(values.prj_location_woreda_id),
					prj_location_kebele_id: values.prj_location_kebele_id,
					prj_location_description: values.prj_location_description,
					prj_owner_region_id: Number(values.prj_owner_region_id),
					prj_owner_zone_id: Number(values.prj_owner_zone_id),
					prj_owner_woreda_id: Number(values.prj_owner_woreda_id),
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
					prj_owner_id: userType === 2 ? currentActiveTab.selectedCsoId : csoId,
					prj_urban_ben_number: values.prj_urban_ben_number,
					prj_rural_ben_number: values.prj_rural_ben_number,
					prj_admin_cost: values.prj_admin_cost,
					prj_program_cost: values.prj_program_cost,
					prj_male_participant: values.prj_male_participant,
					prj_female_participant: values.prj_female_participant,
					//prj_department_id: Number(values.prj_department_id),
					prj_program_id: 1,
					parent_id:
						(isUserType2 && isTab2) || (!isUserType2 && isTab1)
							? 1
							: currentActiveTab?.selectedId,
					object_type_id:
						(isUserType2 && isTab2) || (!isUserType2 && isTab1) ? 1 : 5,
					prj_measurement_unit: values.prj_measurement_unit,
					prj_measured_figure: values.prj_measured_figure,
					// Add new fields to new project
					prj_direct_ben_male: values.prj_direct_ben_male,
					prj_direct_ben_female: values.prj_direct_ben_female,
					prj_indirect_ben_male: values.prj_indirect_ben_male,
					prj_indirect_ben_female: values.prj_indirect_ben_female,
					prj_date_agreement_signed: values.prj_date_agreement_signed,
					prj_agreement_signed_level: values.prj_agreement_signed_level,
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

	const toggleActivity = () => {
		if (modalActivity) {
			setModalActivity(false);
			setProject(null);
		} else {
			setModalActivity(true);
		}
	};

	const getFormType = () => {
		if (userType === 2) {
			return currentActiveTab.tab === 2 ? "project" : "activity";
		}
		return currentActiveTab.tab === 1 ? "project" : "activity";
	};

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
			prj_cluster_id: project.prj_cluster_id,
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
			prj_admin_cost: project.prj_admin_cost,
			prj_program_cost: project.prj_program_cost,
			prj_male_participant: project.prj_male_participant,
			prj_female_participant: project.prj_female_participant,
			prj_measurement_unit: project.prj_measurement_unit,
			prj_measured_figure: project.prj_measured_figure,

			prj_direct_ben_male: project.prj_direct_ben_male,
			prj_direct_ben_female: project.prj_direct_ben_female,
			prj_indirect_ben_male: project.prj_indirect_ben_male,
			prj_indirect_ben_female: project.prj_indirect_ben_female,
			prj_date_agreement_signed: project.prj_date_agreement_signed,
			prj_agreement_signed_level: project.prj_agreement_signed_level,
			is_deletable: project.is_deletable,
			is_editable: project.is_editable,
		});
		setIsEdit(true);
		const isActivity = project.prj_object_type_id === 5;
		if (isActivity) {
			toggleActivity();
		} else {
			toggle();
		}
	};

	const handleProjectsClicks = () => {
		const formType = getFormType();
		validation.resetForm();
		setIsEdit(false);
		setProject("");
		formType === "project" ? toggle() : toggleActivity();
	};

	//delete projects
	const [deleteModal, setDeleteModal] = useState(false);
	const onClickDelete = (project) => {
		setProject(project);
		setDeleteModal(true);
	};

	const activeTabName =
		(isUserType2 && isTab2) || (!isUserType2 && isTab1)
			? "Project"
			: "Activity";
	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}

	return (
		<React.Fragment>
			<ProjectForm
				isOpen={modal}
				toggle={toggle}
				isEdit={isEdit}
				activeTabName={activeTabName}
				validation={validation}
				isPending={addProject.isPending || updateProject.isPending}
			/>
			<ActivityForm
				isOpen={modalActivity}
				toggle={toggleActivity}
				isEdit={isEdit}
				activeTabName={activeTabName}
				validation={validation}
				isPending={addProject.isPending || updateProject.isPending}
				leftBudget={leftBudget}
			/>
			<div className="page-content">
				<div>
					<Breadcrumbs />
					<div className="w-100 d-flex gap-2">
						<>
							<div className="w-100">
								{isLoading ? (
									<Spinners />
								) : userType === 4 ? (
									<RegionProjectTab
										handleAddClick={handleProjectsClicks}
										handleEditClick={handleProjectClick}
										handleTabChange={handleTabChange}
										setLeftBudget={setLeftBudget}
									/>
								) : (
									<ProjectTabs
										program={data}
										handleAddClick={handleProjectsClicks}
										handleEditClick={handleProjectClick}
										handleTabChange={handleTabChange}
										setLeftBudget={setLeftBudget}
									/>
								)}
							</div>
						</>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
ProjectModel.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};
export default ProjectModel;
