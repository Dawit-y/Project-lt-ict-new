import React, {
	useMemo,
	useState,
	useCallback,
	lazy,
	Suspense,
	useEffect,
} from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	Button,
	Col,
	Row,
	UncontrolledTooltip,
	Badge,
	Card,
	CardBody,
	NavItem,
	NavLink,
	TabContent,
	TabPane,
	Alert,
} from "reactstrap";
import classnames from "classnames";
import {
	useSearchProjects,
	useFindProjects,
} from "../../queries/cso_project_query";
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { createMultiLangKeyValueMap } from "../../utils/commonMethods";
const AgGridContainer = lazy(
	() => import("../../components/Common/AgGridContainer")
);
const BudgetRequestRegistration = lazy(
	() => import("../Csobudgetrequest/BudgetRequestRegistration")
);
import { useFetchCsoInfos } from "../../queries/csoinfo_query";
import { InfoItem } from "./ProjectTabs";
import Spinners from "../../components/Common/Spinner";
import { useAuthUser } from "../../hooks/useAuthUser";
import {
	useCsoExportColumns,
	useCsoProjectExportColumns,
	useCsoActivityExportColumns,
} from "../../utils/exportColumnsForLists";

const ProjectTabs = ({
	handleAddClick,
	handleEditClick,
	handleTabChange,
	setLeftBudget,
}) => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const [activeTab, setActiveTab] = useState(1);
	const [passedSteps, setPassedSteps] = useState([1]);
	const [selectedCsoId, setSelectedCsoId] = useState(null);
	const [selectedCsoName, setSelectedCsoName] = useState(null);
	const [selectedProject, setSelectedProject] = useState(null);

	const csoExportColumns = useCsoExportColumns();
	const csoProjectExportColumns = useCsoProjectExportColumns();
	const csoActivityExportColumns = useCsoActivityExportColumns()

	const programName = selectedProject?.prj_name;
	useEffect(() => {
		if (!selectedProject?.prj_id || activeTab !== 2) {
			handleTabChange(activeTab, selectedProject?.prj_id, selectedCsoId);
		}
	}, [activeTab, selectedProject?.prj_id]);

	const { userId } = useAuthUser();

	const {
		data: csoData,
		isLoading: isCsoLoading,
		error: csoError,
		isError: isCsoError,
		refetch: csoRefetch,
	} = useFetchCsoInfos();

	//fetch projects
	const projectParam = { object_type_id: 1, prj_owner_id: selectedCsoId };
	const isValidProjectParam =
		Object.keys(projectParam).length > 0 &&
		Object.values(projectParam).every(
			(value) => value !== null && value !== undefined
		);
	const {
		data: projects,
		isLoading: isProjectLoading,
		isError: isProjectError,
		error: projectError,
		refetch: projectRefetch,
	} = useFindProjects(projectParam, isValidProjectParam, userId);

	// fetch activities
	const param = { object_type_id: 5, parent_id: selectedProject?.prj_id };
	const isValidParam =
		Object.keys(param).length > 0 &&
		Object.values(param).every(
			(value) => value !== null && value !== undefined
		);
	const { data, isLoading, isError, error, refetch } = useFindProjects(
		param,
		isValidParam,
		userId
	);

	useEffect(() => {
		const totalActivitiesBudget = data?.data.reduce((sum, activity) => {
			return sum + (parseFloat(activity?.prj_total_actual_budget) || 0);
		}, 0);

		const leftBudget =
			selectedProject?.prj_total_actual_budget - totalActivitiesBudget;
		setLeftBudget(leftBudget);
	}, [data, selectedProject]);

	const toggleTab = useCallback(
		(tab) => {
			if (activeTab !== tab) {
				setPassedSteps((prevSteps) => [...prevSteps, tab]);
				if (tab >= 1 && tab <= 4) {
					setActiveTab(tab);
					handleTabChange(tab, selectedProject?.prj_id, selectedCsoId);
				}
			}
		},
		[activeTab, selectedProject?.prj_id, selectedCsoId, handleTabChange]
	);

	const isNextDisabled =
		(activeTab === 1 && !selectedCsoId) ||
		(activeTab === 2 && !selectedProject?.prj_id) ||
		activeTab >= 4;

	const {
		data: projectCategoryData,
		isLoading: isPctLoading,
		isError: isPctError,
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
			lang
		);
	}, [projectCategoryData, lang]);

	const csoColumnDefs = useMemo(() => {
		const baseColumnDefs = [
			{
				headerName: t("S.N"),
				field: "sn",
				valueGetter: (params) => params.node.rowIndex + 1,
				sortable: false,
				filter: false,
				width: 60,
			},
			{
				headerName: t("Select"),
				field: "Select",
				sortable: true,
				filter: false,
				width: 100,
				cellRenderer: (params) => {
					if (params.node.footer) return "";

					const isChecked = selectedCsoId === params.data.cso_id;
					const onChangeHandler = () => {
						setSelectedCsoId(params.data.cso_id);
						setSelectedCsoName(params.data.cso_name);
						setSelectedProject(null);
					};

					return (
						<span>
							<input
								type="radio"
								name="select_cso"
								checked={isChecked}
								onChange={onChangeHandler}
							/>
						</span>
					);
				},
			},
			{
				headerName: "CSO Name",
				field: "cso_name",
				sortable: true,
				filter: true,
				flex: 1,
				minWidth: 150,
				cellRenderer: (params) => {
					return params.node.footer ? t("Total") : params.value;
				},
			},
			{
				headerName: t("cso_code"),
				field: "cso_code",
				sortable: true,
				filter: true,
				minWidth: 120,
				cellRenderer: (params) => {
					return params.node.footer ? t("Total") : params.value;
				},
			},
			{
				headerName: t("cso_phone"),
				field: "cso_phone",
				sortable: true,
				filter: true,
				minWidth: 120,
				cellRenderer: (params) => {
					return params.node.footer ? t("Total") : params.value;
				},
			},
			{
				headerName: t("cso_email"),
				field: "cso_email",
				sortable: true,
				filter: true,
				minWidth: 180,
				cellRenderer: (params) => {
					return params.node.footer ? t("Total") : params.value;
				},
			},
		];

		return baseColumnDefs;
	}, [t, selectedCsoId]);

	const projectsColumnDefs = useMemo(() => {
		const baseColumnDefs = [
			{
				headerName: t("S.N"),
				field: "sn",
				valueGetter: (params) => params.node.rowIndex + 1,
				sortable: false,
				filter: false,
				width: 60,
			},
			{
				headerName: t("Select"),
				field: "Select",
				sortable: true,
				filter: false,
				width: 100,
				cellRenderer: (params) => {
					if (params.node.footer) return "";

					const isChecked = selectedProject?.prj_id === params.data.prj_id;
					const onChangeHandler = () => {
						setSelectedProject(params.data);
					};

					return (
						<span>
							<input
								type="radio"
								name="selectedRow"
								checked={isChecked}
								onChange={onChangeHandler}
							/>
						</span>
					);
				},
			},
			{
				headerName: t("cso_prj_name"),
				field: "prj_name",
				sortable: true,
				filter: true,
				flex: 1,
				minWidth: 150,
				cellRenderer: (params) => {
					return params.node.footer ? t("Total") : params.value;
				},
			},
			{
				headerName: t("cso_prj_code"),
				field: "prj_code",
				sortable: true,
				filter: true,
				minWidth: 120,
				cellRenderer: (params) => {
					return params.node.footer ? t("Total") : params.value;
				},
			},
			{
				headerName: t("prj_project_category_id"),
				field: "prj_project_category_id",
				sortable: true,
				filter: true,
				minWidth: 150,
				cellRenderer: (params) => {
					return projectCategoryMap[params.value];
				},
			},
			{
				headerName: t("prj_project_status_id"),
				field: "prj_project_status_id",
				sortable: true,
				filter: true,
				width: 150,
				cellRenderer: (params) => {
					const badgeClass = params.data.color_code;
					return (
						<Badge className={`font-size-12 badge-soft-${badgeClass}`}>
							{params.data.status_name}
						</Badge>
					);
				},
			},
			{
				headerName: t("cso_prj_total_actual_budget"),
				field: "prj_total_actual_budget",
				sortable: true,
				filter: true,
				minWidth: 180,
				valueFormatter: (params) => {
					const value = params.value;
					if (!value) return "";

					if (params.node.footer) {
						return `$${value.toLocaleString()}`;
					}
					return `${value.toLocaleString()}`;
				},
			},
			{
				headerName: t("view_details"),
				field: "view_details",
				sortable: false,
				filter: false,
				width: 100,
				cellRenderer: (params) => {
					if (params.node.footer) {
						return "";
					}
					const { prj_id } = params.data || {};
					return (
						<Link to={`/projectdetail_cso/${prj_id}`} target="_blank">
							<Button type="button" className="btn-sm mb-1 default" outline>
								<i className="fa fa-eye"></i>
							</Button>
						</Link>
					);
				},
			},
		];

		if (
			projects?.previledge?.is_role_editable === 1 ||
			projects?.previledge?.is_role_deletable === 1
		) {
			baseColumnDefs.push({
				headerName: t("Action"),
				field: "Action",
				filter: false,
				sortable: true,
				width: 80,
				cellRenderer: (params) => {
					const rowData = params.data;
					if (params.node.footer) return "";
					return (
						<div className="d-flex gap-3">
							{projects?.previledge?.is_role_editable === 1 &&
								rowData?.is_editable === 1 &&
								rowData.prj_project_status_id >= 1 && (
									<Link
										to="#"
										className="text-success"
										onClick={() => handleEditClick(rowData)}
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

		return baseColumnDefs;
	}, [projects, t, selectedProject, projectCategoryMap]);

	const activitiesColumnDefs = useMemo(() => {
		const baseColumnDefs = [
			{
				headerName: t("S.N"),
				field: "sn",
				valueGetter: (params) => params.node.rowIndex + 1,
				sortable: false,
				filter: false,
				width: 60,
			},
			{
				headerName: "Activity",
				field: "prj_name",
				sortable: true,
				filter: true,
				flex: 1,
				minWidth: 130,
				cellRenderer: (params) => {
					return params.node.footer ? t("Total") : params.value;
				},
			},
			{
				headerName: "Activity Category",
				field: "prj_project_category_id",
				sortable: true,
				filter: true,
				minWidth: 80,
				cellRenderer: (params) => {
					return projectCategoryMap[params.value];
				},
			},
			{
				headerName: t("cso_prj_measurement_unit"),
				field: "prj_measurement_unit",
				sortable: true,
				filter: true,
				minWidth: 80,
				cellRenderer: (params) => {
					return params.node.footer ? t("Total") : params.value;
				},
			},
			{
				headerName: t("cso_prj_measured_figure"),
				field: "prj_measured_figure",
				sortable: true,
				filter: true,
				minWidth: 80,
				cellRenderer: (params) => {
					return params.node.footer ? t("Total") : params.value;
				},
			},
			{
				headerName: t("cso_prj_total_actual_budget"),
				field: "prj_total_actual_budget",
				sortable: true,
				filter: true,
				minWidth: 80,
				valueFormatter: (params) => {
					const value = params.value;
					if (!value) return "";

					if (params.node.footer) {
						return `$${value.toLocaleString()}`;
					}
					return `${value.toLocaleString()}`;
				},
			},
			{
				headerName: t("view_details"),
				field: "view_details",
				sortable: false,
				filter: false,
				width: 80,
				cellRenderer: (params) => {
					if (params.node.footer) {
						return "";
					}
					const { prj_id } = params.data || {};
					return (
						<Link to={`/projectdetail_cso/${prj_id}`} target="_blank">
							<Button type="button" className="btn-sm mb-1 default" outline>
								<i className="fa fa-eye"></i>
							</Button>
						</Link>
					);
				},
			},
		];

		if (
			data?.previledge?.is_role_editable === 1 ||
			data?.previledge?.is_role_deletable === 1
		) {
			baseColumnDefs.push({
				headerName: t("Action"),
				field: "Action",
				filter: false,
				sortable: true,
				width: 80,
				cellRenderer: (params) => {
					const rowData = params.data;
					if (params.node.footer) return "";
					return (
						<div className="d-flex gap-3">
							{data?.previledge?.is_role_editable === 1 &&
								rowData?.is_editable === 1 &&
								rowData.prj_project_status_id === 1 && (
									<Link
										to="#"
										className="text-success"
										onClick={() => handleEditClick(rowData)}
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

		return baseColumnDefs;
	}, [data, t, projectCategoryMap]);

	return (
		<Col lg="12">
			<Card>
				<CardBody>
					<h4 className="card-title mb-4"></h4>
					<div className="wizard clearfix">
						<div className="actions clearfix">
							<ul>
								<li>
									<Button
										color="primary"
										onClick={() => toggleTab(activeTab - 1)}
										disabled={activeTab === 1}
									>
										Previous
									</Button>
								</li>
								<li>
									<Button
										color="primary"
										onClick={() => toggleTab(activeTab + 1)}
										disabled={isNextDisabled || activeTab === 4}
									>
										Next
									</Button>
								</li>
							</ul>
						</div>
						<div className="steps clearfix">
							<ul>
								<NavItem className={classnames({ current: activeTab === 1 })}>
									<NavLink
										className={classnames({ current: activeTab === 1 })}
										onClick={() => toggleTab(1)}
										disabled={!passedSteps.includes(1)}
									>
										<InfoItem
											number={1}
											title={"CSO List"}
											subtitle={selectedCsoName}
										/>
									</NavLink>
								</NavItem>
								<NavItem className={classnames({ current: activeTab === 2 })}>
									<NavLink
										className={classnames({ current: activeTab === 2 })}
										onClick={() => toggleTab(2)}
										disabled={!passedSteps.includes(2)}
									>
										<InfoItem
											number={2}
											title={"Projects"}
											subtitle={selectedCsoName && `For CSO ${selectedCsoName}`}
										/>
									</NavLink>
								</NavItem>
								<NavItem className={classnames({ current: activeTab === 3 })}>
									<NavLink
										className={classnames({ active: activeTab === 3 })}
										onClick={() => toggleTab(3)}
										disabled={!passedSteps.includes(3) || !programName}
									>
										<InfoItem
											number={3}
											title={"Activities"}
											subtitle={programName && `For Project ${programName}`}
										/>
									</NavLink>
								</NavItem>
								<NavItem className={classnames({ current: activeTab === 4 })}>
									<NavLink
										className={classnames({ active: activeTab === 4 })}
										onClick={() => toggleTab(4)}
										disabled={!passedSteps.includes(4) || !programName}
									>
										<InfoItem
											number={4}
											title={"Proposed Requests"}
											subtitle={programName && `For Project ${programName}`}
										/>
									</NavLink>
								</NavItem>
							</ul>
						</div>

						<div className="content clearfix">
							<TabContent activeTab={activeTab} className="body">
								<TabPane tabId={1}>
									{isCsoError ? (
										<FetchErrorHandler error={csoError} refetch={csoRefetch} />
									) : (
										<>
											<Suspense fallback={<Spinners />}>
												<AgGridContainer
													rowData={csoData?.data || []}
													columnDefs={csoColumnDefs}
													isLoading={isCsoLoading}
													isPagination={true}
													paginationPageSize={10}
													isGlobalFilter={true}
													isAddButton={false}
													rowHeight={36}
													addButtonText="Add"
													isExcelExport={true}
													isPdfExport={true}
													isPrint={true}
													tableName="CSO List"
													exportColumns={csoExportColumns}
												/>
											</Suspense>
										</>
									)}
								</TabPane>
								<TabPane tabId={2}>
									{isProjectError ? (
										<FetchErrorHandler
											error={projectError}
											refetch={projectRefetch}
										/>
									) : (
										<>
											<Suspense fallback={<Spinners />}>
												<AgGridContainer
													rowData={projects?.data || []}
													columnDefs={projectsColumnDefs}
													isLoading={isProjectLoading}
													isPagination={true}
													paginationPageSize={10}
													isGlobalFilter={true}
													isAddButton={
														projects?.previledge?.is_role_can_add === 1
													}
													onAddClick={handleAddClick}
													rowHeight={36}
													addButtonText="Add"
													isExcelExport={true}
													isPdfExport={true}
													isPrint={true}
													tableName="Projects"
													exportColumns={csoProjectExportColumns}
												/>
											</Suspense>
										</>
									)}
								</TabPane>
								<TabPane tabId={3}>
									{isError ? (
										<FetchErrorHandler error={error} refetch={refetch} />
									) : (
										<>
											<Suspense fallback={<Spinners />}>
												<AgGridContainer
													rowData={data?.data || []}
													columnDefs={activitiesColumnDefs}
													isLoading={isLoading}
													isPagination={true}
													paginationPageSize={10}
													isGlobalFilter={true}
													isAddButton={data?.previledge?.is_role_can_add === 1}
													onAddClick={handleAddClick}
													rowHeight={36}
													addButtonText="Add"
													isExcelExport={true}
													isPdfExport={true}
													isPrint={true}
													tableName="Activities"
													exportColumns={csoActivityExportColumns}
												/>
											</Suspense>
										</>
									)}
								</TabPane>
								<TabPane tabId={4}>
									<Suspense fallback={<Spinners />}>
										<BudgetRequestRegistration
											projectStatus={selectedProject?.prj_project_status_id}
											projectId={selectedProject?.prj_id}
											isActive={activeTab === 3}
										/>
									</Suspense>
								</TabPane>
							</TabContent>
						</div>
					</div>
				</CardBody>
			</Card>
		</Col>
	);
};

export default ProjectTabs;
