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
import { useAuthUser } from "../../hooks/useAuthUser";
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
import Spinners from "../../components/Common/Spinner";
import { createMultiLangKeyValueMap } from "../../utils/commonMethods";
const TableContainer = lazy(() =>
	import("../../components/Common/TableContainer")
);
const BudgetRequestRegistration = lazy(() =>
	import("../Csobudgetrequest/BudgetRequestRegistration")
);

const ProjectTabs = ({
	program,
	handleAddClick,
	handleEditClick,
	handleTabChange,
	setLeftBudget,
}) => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const [activeTab, setActiveTab] = useState(1);
	const [passedSteps, setPassedSteps] = useState([1]);
	const [selectedProject, setSelectedProject] = useState(null);
	const programName = selectedProject?.prj_name;

	const { userId } = useAuthUser();
	useEffect(() => {
		handleTabChange(activeTab, selectedProject?.prj_id);
	}, [activeTab, selectedProject?.prj_id]);

	// fetch activities
	const param = { object_type_id: 5, parent_id: selectedProject?.prj_id };
	const isValidParam =
		Object.keys(param).length > 0 &&
		Object.values(param).every(
			(value) => value !== null && value !== undefined
		);
	const { data, isLoading, isFetching, isError, error, refetch } =
		useFindProjects(param, isValidParam, userId);

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
				}
			}
		},
		[activeTab]
	);

	const isNextButtonDisabled = useCallback(() => {
		return !selectedProject?.prj_id;
	}, [selectedProject?.prj_id]);

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

	const programColumns = useMemo(() => {
		const baseColumns = [
			{
				header: t("Select"),
				accessorKey: "Select",
				enableSorting: true,
				enableColumnFilter: false,
				cell: ({ row }) => (
					<span>
						<input
							type="radio"
							name="selectedRow"
							checked={selectedProject?.prj_id === row.original.prj_id}
							onChange={() => {
								setSelectedProject(row.original);
							}}
						/>
					</span>
				),
			},
			{
				header: "Project Title",
				accessorKey: "prj_name",
				enableSorting: true,
				enableColumnFilter: false,
				cell: ({ row, getValue }) => (
					<span>{row.original.footer ? t("Total") : getValue()}</span>
				),
			},
			{
				header: t("prj_code"),
				accessorKey: "prj_code",
				enableSorting: true,
				enableColumnFilter: false,
				cell: ({ row, getValue }) => (
					<span>{row.original.footer ? t("Total") : getValue()}</span>
				),
			},
			{
				header: t("prj_project_category_id"),
				accessorKey: "prj_project_category_id",
				enableSorting: true,
				enableColumnFilter: false,
				cell: ({ row, getValue }) => (
					<span>{projectCategoryMap[getValue()]}</span>
				),
			},
			{
				header: t("prj_project_status_id"),
				accessorKey: "prj_project_status_id",
				enableSorting: true,
				enableColumnFilter: false,
				cell: ({ row }) => (
					<Badge
						className={`font-size-12 badge-soft-${row.original.color_code}`}
					>
						{row.original.status_name}
					</Badge>
				),
			},
			{
				header: t("prj_total_actual_budget"),
				accessorKey: "prj_total_actual_budget",
				enableSorting: true,
				enableColumnFilter: false,
				cell: ({ row, getValue }) => {
					const value = getValue();
					return (
						<span>
							{row.original.footer
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
			{
				header: t("view_details"),
				accessorKey: "view_details",
				enableSorting: false,
				enableColumnFilter: false,
				cell: ({ row }) => {
					if (row.original.footer) return "";
					const { prj_id } = row.original || {};
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
			program?.previledge?.is_role_editable === 1 ||
			program?.previledge?.is_role_deletable === 1
		) {
			baseColumns.push({
				header: t("Action"),
				accessorKey: "Action",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ row }) => (
					<div className="d-flex gap-3">
						{program?.previledge?.is_role_editable === 1 &&
							row.original?.is_editable === 1 &&
							row.original.prj_project_status_id === 1 && (
								<Link
									to="#"
									className="text-success"
									onClick={() => handleEditClick(row.original)}
								>
									<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
									<UncontrolledTooltip placement="top" target="edittooltip">
										Edit
									</UncontrolledTooltip>
								</Link>
							)}
					</div>
				),
			});
		}
		return baseColumns;
	}, [program, t, selectedProject?.prj_id]);

	const activitiesColumn = useMemo(() => {
		const baseColumns = [
			{
				header: "Activity Title",
				accessorKey: "prj_name",
				enableSorting: true,
				enableColumnFilter: false,
				cell: ({ row, getValue }) => (
					<span>{row.original.footer ? t("Total") : getValue()}</span>
				),
			},
			{
				header: "Activity Category",
				accessorKey: "prj_project_category_id",
				enableSorting: true,
				enableColumnFilter: false,
				cell: ({ row, getValue }) => (
					<span>{projectCategoryMap[getValue()]}</span>
				),
			},
			{
				header: t("prj_measurement_unit"),
				accessorKey: "prj_measurement_unit",
				enableSorting: true,
				enableColumnFilter: false,
				cell: ({ row, getValue }) => (
					<span>{row.original.footer ? t("Total") : getValue()}</span>
				),
			},
			{
				header: t("prj_measured_figure"),
				accessorKey: "prj_measured_figure",
				enableSorting: true,
				enableColumnFilter: false,
				cell: ({ row, getValue }) => (
					<span>{row.original.footer ? t("Total") : getValue()}</span>
				),
			},
			{
				header: t("prj_total_actual_budget"),
				accessorKey: "prj_total_actual_budget",
				enableSorting: true,
				enableColumnFilter: false,
				cell: ({ row, getValue }) => {
					const value = getValue();
					return (
						<span>
							{row.original.footer
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
			{
				header: t("view_details"),
				accessorKey: "view_details",
				enableSorting: false,
				enableColumnFilter: false,
				cell: ({ row }) => {
					if (row.original.footer) return "";
					const { prj_id } = row.original || {};
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
			baseColumns.push({
				header: t("Action"),
				accessorKey: "Action",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ row }) => (
					<div className="d-flex gap-3">
						{data?.previledge?.is_role_editable === 1 &&
							row.original?.is_editable === 1 &&
							row.original.prj_project_status_id === 1 && (
								<Link
									to="#"
									className="text-success"
									onClick={() => handleEditClick(row.original)}
								>
									<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
									<UncontrolledTooltip placement="top" target="edittooltip">
										Edit
									</UncontrolledTooltip>
								</Link>
							)}
					</div>
				),
			});
		}
		return baseColumns;
	}, [data, t]);

	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}

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
										disabled={isNextButtonDisabled() || activeTab === 3}
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
										onClick={() => setActiveTab(1)}
										disabled={!passedSteps.includes(1)}
									>
										<InfoItem
											number={1}
											title={t("Projects")}
											subtitle={programName}
										/>
									</NavLink>
								</NavItem>
								<NavItem className={classnames({ current: activeTab === 2 })}>
									<NavLink
										className={classnames({ active: activeTab === 2 })}
										onClick={() => setActiveTab(2)}
										disabled={!passedSteps.includes(2)}
									>
										<InfoItem
											number={2}
											title={t("Activities")}
											subtitle={programName && `For Project ${programName}`}
										/>
									</NavLink>
								</NavItem>
								<NavItem className={classnames({ current: activeTab === 3 })}>
									<NavLink
										className={classnames({ active: activeTab === 3 })}
										onClick={() => setActiveTab(3)}
										disabled={!passedSteps.includes(3)}
									>
										<InfoItem
											number={3}
											title={t("Proposed Requests")}
											subtitle={programName && `For Project ${programName}`}
										/>
									</NavLink>
								</NavItem>
							</ul>
						</div>
						<div className="content clearfix">
							<TabContent activeTab={activeTab} className="body">
								<TabPane tabId={1}>
									<>
										<Suspense fallback={<Spinners />}>
											<TableContainer
												columns={programColumns}
												data={program?.data || []}
												isAddButton={true}
												isCustomPageSize
												handleUserClick={handleAddClick}
												isPagination
												SearchPlaceholder={t("filter_placeholder")}
												buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
												buttonName={`${t("add")} ${t("project")}`}
												tableClass="table-sm align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
												pagination="pagination"
												paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
												excludeKey={["is_editable", "is_deletable", "Select"]}
												tableName="Project Data"
												isExcelExport
												isPdfExport
											/>
										</Suspense>
									</>
								</TabPane>
								<TabPane tabId={2}>
									<>
										<Suspense fallback={<Spinners />}>
											<TableContainer
												columns={activitiesColumn}
												data={data?.data || []}
												isLoading={isLoading}
												isAddButton={true}
												isCustomPageSize
												handleUserClick={handleAddClick}
												isPagination
												SearchPlaceholder={t("filter_placeholder")}
												buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
												buttonName={`${t("add")} ${t("Actitvity")}`}
												tableClass="table-sm align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
												pagination="pagination"
												paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
												excludeKey={["is_editable", "is_deletable", "Select"]}
												tableName="Project Data"
												isExcelExport
												isPdfExport
												isFetching={isFetching}
												refetch={refetch}
											/>
										</Suspense>
									</>
								</TabPane>
								<TabPane tabId={3}>
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

export const InfoItem = ({ number, title, subtitle }) => {
	return (
		<div className="d-flex align-items-center justify-content-start">
			<span className="number me-2">{number}.</span>
			<div className="d-flex flex-column align-items-start justify-content-center">
				<h6 className="mb-1" style={{ lineHeight: "1.2" }}>
					{title}
				</h6>
				<p className="mb-0 small" style={{ lineHeight: "1.2" }}>
					{subtitle}
				</p>
			</div>
		</div>
	);
};