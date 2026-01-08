import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import {
	Row,
	Col,
	FormGroup,
	Input,
	Card,
	CardBody,
	Spinner,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import TreeForLists from "../../components/Common/TreeForLists2";
import { useSearchReport } from "../../queries/report_query";
import { useFetchBudgetYears } from "../../queries/budgetyear_query";
import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import { useFetchSectorCategorys } from "../../queries/sectorcategory_query";
import { useFetchContractorTypes } from "../../queries/contractortype_query";
import {
	createSelectOptions,
	createMultiSelectOptions,
} from "../../utils/commonMethods";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../hooks/useAuthUser";

// Lazy loaded components
const Greenbook = lazy(() => import("./ReportDesign/Greenbook"));
const FinancialProjectsTable = lazy(
	() => import("../Report/ProjectFinanicialReportsTable")
);
const FinancialProjectsTable2 = lazy(
	() => import("../Report/ProjectFinanicialReportsTable2")
);
const FinancialProjectsTable3 = lazy(
	() => import("../Report/ProjectFinanicialReportsTable3")
);
const ProjectPhysicalPerformanceReportsTable = lazy(
	() => import("../Report/ProjectPhysicalPerformanceReportsTable")
);
const ProjectFinancialPerformanceReportsTable = lazy(
	() => import("../Report/ProjectFinancialPerformanceReportsTable")
);
const ProjectActualPhysicalPerformanceReportsTable = lazy(
	() => import("../Report/ProjectActualPhysicalPerformanceReportsTable")
);
const ProjectActualFinancialPerformanceReportsTable = lazy(
	() => import("../Report/ProjectActualFinancialPerformanceReportsTable")
);
const ProjectPlanTable = lazy(() => import("../Report/ProjectPlanTable"));
const ProjectEmployeeReportsTable = lazy(
	() => import("../Report/ProjectEmployeeReportsTable")
);
const ProjectsBudgetPlanTable = lazy(
	() => import("../Report/ProjectsBudgetPlanTable")
);
const ProjectsBudgetExpenditureTable = lazy(
	() => import("../Report/ProjectsBudgetExpenditureTable")
);
const ProjectsBudgetSourceTable = lazy(
	() => import("../Report/ProjectsBudgetSourceTable")
);
const ProjectsContractorTable = lazy(
	() => import("../Report/ProjectsContractorTable")
);
const ProjectsPaymentTable = lazy(
	() => import("../Report/ProjectsPaymentTable")
);
const ProgramsReport = lazy(() => import("./ProgramsReport"));
const BudgetAllocationByZone = lazy(() => import("./BudgetAllocationByZone"));
const ProjectFinanceBySource = lazy(() => import("./ProjectFinanceBySource"));
const ProjectFinanceByStatus = lazy(() => import("./ProjectFinanceByStatus"));
const ProjectFinanceByYear = lazy(() => import("./ProjectFinanceByYear"));
const ZoneFinanceByCluster = lazy(() => import("./ZoneFinanceByCluster"));
const ZoneFinanceByYear = lazy(() => import("./ZoneFinanceByYear"));

const CsoProjectsReport = lazy(() => import("./CsoProjectsReport"));

// Loading component for lazy loading
const TableLoading = () => (
	<div className="d-flex justify-content-center p-4">
		<Spinner color="primary" />
	</div>
);

const Report = () => {
	document.title = "Reports";
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const [exportSearchParams, setExportSearchParams] = useState({});
	const { user } = useAuthUser();
	const userType = user?.usr_user_type || null;

	// Data hooks
	const { data: budgetYearData } = useFetchBudgetYears();
	const { data: sectorInformationData } = useFetchSectorInformations();
	const { data: contractorTypeData } = useFetchContractorTypes();
	const { data: projectCategoryData } = useFetchProjectCategorys();
	const { data: sectorCategoryData } = useFetchSectorCategorys();

	// Memoized options
	const budgetYearOptions = useMemo(
		() => createSelectOptions(budgetYearData?.data || [], "bdy_id", "bdy_name"),
		[budgetYearData]
	);

	const {
		sci_name_en: sectorInformationOptionsEn,
		sci_name_or: sectorInformationOptionsOr,
		sci_name_am: sectorInformationOptionsAm,
	} = createMultiSelectOptions(sectorInformationData?.data || [], "sci_id", [
		"sci_name_en",
		"sci_name_or",
		"sci_name_am",
	]);

	const {
		cnt_type_name_en: contractorTypeOptionsEn,
		cnt_type_name_or: contractorTypeOptionsOr,
		cnt_type_name_am: contractorTypeOptionsAm,
	} = createMultiSelectOptions(contractorTypeData?.data || [], "cnt_id", [
		"cnt_type_name_en",
		"cnt_type_name_or",
		"cnt_type_name_am",
	]);

	const {
		pct_name_en: projectCategoryOptionsEn,
		pct_name_or: projectCategoryOptionsOr,
		pct_name_am: projectCategoryOptionsAm,
	} = createMultiSelectOptions(projectCategoryData?.data || [], "pct_id", [
		"pct_name_en",
		"pct_name_or",
		"pct_name_am",
	]);

	const sectorCategoryOptions = useMemo(
		() =>
			createSelectOptions(sectorCategoryData?.data || [], "psc_id", "psc_name"),
		[sectorCategoryData]
	);

	// State
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [searchResults, setSearchResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchError, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [selectedEndpoint, setSelectedEndpoint] = useState("");
	const [locationRegionId, setLocationRegionId] = useState(null);
	const [locationZoneId, setLocationZoneId] = useState(null);
	const [locationWoredaId, setLocationWoredaId] = useState(null);

	// User type based endpoint filtering
	const getUserEndpoints = useMemo(() => {
		const allEndpoints = {
			// Governmental endpoints (1-100)
			/*project_stat: { reportTypeIndex: 1, userTypes: [1, 5] },
			employee_stat: { reportTypeIndex: 2, userTypes: [1, 5] },
			budget_plan_stat: { reportTypeIndex: 3, userTypes: [1, 5] },
			budget_expenditure_stat: { reportTypeIndex: 4, userTypes: [1, 5] },
			budget_source_stat: { reportTypeIndex: 5, userTypes: [1, 5] },
			budget_contractor_stat: { reportTypeIndex: 6, userTypes: [1, 5] },
			project_payment_stat: { reportTypeIndex: 7, userTypes: [1, 5] },*/
			project_financial_report: { reportTypeIndex: 8, userTypes: [1, 5] },
			/*project_financial_report2: { reportTypeIndex: 9, userTypes: [1, 5] },
			project_financial_report3: { reportTypeIndex: 10, userTypes: [1, 5] },*/
			project_physical_performance_report: {
				reportTypeIndex: 11,
				userTypes: [1, 5],
			},
			project_financial_performance_report: {
				reportTypeIndex: 12,
				userTypes: [1, 5],
			},
			project_actual_physical_performance_report: {
				reportTypeIndex: 22,
				userTypes: [1, 5],
			},
			project_actual_financial_performance_report: {
				reportTypeIndex: 23,
				userTypes: [1, 5],
			},
			/*project_plan_report: { reportTypeIndex: 13, userTypes: [1, 5] },*/
			programs_report: { reportTypeIndex: 14, userTypes: [1, 5] },

			project_finance_by_source: { reportTypeIndex: 16, userTypes: [1, 5] },
			project_finance_by_status: { reportTypeIndex: 17, userTypes: [1, 5] },
			budget_by_zone: { reportTypeIndex: 15, userTypes: [1, 5] },
			project_finance_by_year: { reportTypeIndex: 18, userTypes: [1, 5] },
			zone_finance_by_cluster: { reportTypeIndex: 19, userTypes: [1, 5] },
			zone_finance_by_year: { reportTypeIndex: 20, userTypes: [1, 5] },

			// CSO endpoints (101-200) - Add CSO specific endpoints here
			cso_projects_report: { reportTypeIndex: 101, userTypes: [2, 4, 5] },
			// cso_report_2: { reportTypeIndex: 102, userTypes: [2, 4, 5] },

			// Citizenship endpoints (201-300) - Add citizenship specific endpoints here
			// citizen_report_1: { reportTypeIndex: 201, userTypes: [3, 5] },
			// citizen_report_2: { reportTypeIndex: 202, userTypes: [3, 5] },
		};

		if (!userType) return {};

		const filteredEndpoints = {};
		Object.keys(allEndpoints).forEach((key) => {
			const endpoint = allEndpoints[key];
			if (endpoint.userTypes.includes(parseInt(userType))) {
				filteredEndpoints[key] = endpoint;
			}
		});

		return filteredEndpoints;
	}, [userType]);

	// Endpoint configurations
	const endpointConfigs = useMemo(() => {
		const configs = {};

		Object.keys(getUserEndpoints).forEach((key) => {
			const baseConfig = {
				// Common configuration for all endpoints
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				reportTypeIndex: getUserEndpoints[key].reportTypeIndex,
			};

			// Add endpoint-specific configurations
			switch (key) {
				case "project_stat":
					configs[key] = baseConfig;
					break;
				case "employee_stat":
					configs[key] = {
						...baseConfig,
						textKeys: ["prj_name", "prj_code"],
						dropdownSearchKeys: [
							{
								key: "prj_sector_id",
								options:
									lang === "en"
										? sectorInformationOptionsEn
										: lang === "am"
											? sectorInformationOptionsAm
											: sectorInformationOptionsOr,
							},
						],
					};
					break;
				case "budget_plan_stat":
					configs[key] = {
						...baseConfig,
						textKeys: ["prj_name"],
						dropdownSearchKeys: [
							{ key: "bdr_budget_year_id", options: budgetYearOptions },
							{
								key: "prj_sector_id",
								options:
									lang === "en"
										? sectorInformationOptionsEn
										: lang === "am"
											? sectorInformationOptionsAm
											: sectorInformationOptionsOr,
							},
						],
					};
					break;
				case "budget_expenditure_stat":
					configs[key] = {
						...baseConfig,
						textKeys: ["prj_name"],
						dropdownSearchKeys: [
							{ key: "pbe_budget_year_id", options: budgetYearOptions },
							{
								key: "prj_sector_id",
								options:
									lang === "en"
										? sectorInformationOptionsEn
										: lang === "am"
											? sectorInformationOptionsAm
											: sectorInformationOptionsOr,
							},
						],
					};
					break;
				case "budget_source_stat":
					configs[key] = {
						...baseConfig,
						textKeys: ["prj_name"],
						dropdownSearchKeys: [
							{
								key: "prj_sector_id",
								options:
									lang === "en"
										? sectorInformationOptionsEn
										: lang === "am"
											? sectorInformationOptionsAm
											: sectorInformationOptionsOr,
							},
						],
					};
					break;
				case "budget_contractor_stat":
					configs[key] = {
						...baseConfig,
						textKeys: ["prj_name", "prj_code"],
						dropdownSearchKeys: [
							{
								key: "cni_contractor_type_id",
								options:
									lang === "en"
										? contractorTypeOptionsEn
										: lang === "am"
											? contractorTypeOptionsAm
											: contractorTypeOptionsOr,
							},
						],
					};
					break;
				case "project_payment_stat":
					configs[key] = {
						...baseConfig,
						dateKeys: ["payment_date"],
						dropdownSearchKeys: [
							{ key: "bdr_budget_year_id", options: budgetYearOptions },
						],
					};
					break;
				case "project_financial_report":
					configs[key] = {
						...baseConfig,
						dropdownSearchKeys: [
							{ key: "prp_budget_year_id", options: budgetYearOptions },
							{ key: "sector_category", options: sectorCategoryOptions },
							{
								key: "prj_sector_id",
								options:
									lang === "en"
										? sectorInformationOptionsEn
										: lang === "am"
											? sectorInformationOptionsAm
											: sectorInformationOptionsOr,
							},
						],
					};
					break;
				case "project_financial_report2":
					configs[key] = {
						...baseConfig,
						dateKeys: ["report_date"],
						dropdownSearchKeys: [
							{ key: "prp_budget_year_id", options: budgetYearOptions },
							{
								key: "prj_sector_id",
								options:
									lang === "en"
										? sectorInformationOptionsEn
										: lang === "am"
											? sectorInformationOptionsAm
											: sectorInformationOptionsOr,
							},
						],
					};
					break;
				case "project_financial_report3":
					configs[key] = {
						...baseConfig,
						dateKeys: ["report_date"],
						dropdownSearchKeys: [
							{ key: "prp_budget_year_id", options: budgetYearOptions },
							{
								key: "prj_sector_id",
								options:
									lang === "en"
										? sectorInformationOptionsEn
										: lang === "am"
											? sectorInformationOptionsAm
											: sectorInformationOptionsOr,
							},
						],
					};
					break;
				case "project_physical_performance_report":
					configs[key] = {
						...baseConfig,
						dateKeys: ["report_date"],
						dropdownSearchKeys: [
							{ key: "prp_budget_year_id", options: budgetYearOptions },
							{
								key: "prj_sector_id",
								options:
									lang === "en"
										? sectorInformationOptionsEn
										: lang === "am"
											? sectorInformationOptionsAm
											: sectorInformationOptionsOr,
							},
						],
					};
					break;
				case "project_financial_performance_report":
					configs[key] = {
						...baseConfig,
						dateKeys: ["report_date"],
						dropdownSearchKeys: [
							{ key: "prp_budget_year_id", options: budgetYearOptions },
							{
								key: "prj_sector_id",
								options:
									lang === "en"
										? sectorInformationOptionsEn
										: lang === "am"
											? sectorInformationOptionsAm
											: sectorInformationOptionsOr,
							},
						],
					};
					break;
				case "project_actual_physical_performance_report":
					configs[key] = {
						...baseConfig,
						dateKeys: ["report_date"],
						dropdownSearchKeys: [
							{ key: "prp_budget_year_id", options: budgetYearOptions },
							{
								key: "prj_sector_id",
								options:
									lang === "en"
										? sectorInformationOptionsEn
										: lang === "am"
											? sectorInformationOptionsAm
											: sectorInformationOptionsOr,
							},
						],
					};
					break;
				case "project_actual_financial_performance_report":
					configs[key] = {
						...baseConfig,
						dateKeys: ["report_date"],
						dropdownSearchKeys: [
							{ key: "prp_budget_year_id", options: budgetYearOptions },
							{
								key: "prj_sector_id",
								options:
									lang === "en"
										? sectorInformationOptionsEn
										: lang === "am"
											? sectorInformationOptionsAm
											: sectorInformationOptionsOr,
							},
						],
					};
					break;
				case "project_plan_report":
					configs[key] = {
						...baseConfig,
						dropdownSearchKeys: [
							{
								key: "prj_project_category_id",
								options:
									lang === "en"
										? projectCategoryOptionsEn
										: lang === "am"
											? projectCategoryOptionsAm
											: projectCategoryOptionsOr,
							},
							{ key: "sector_category", options: sectorCategoryOptions },
							{ key: "prp_budget_year_id", options: budgetYearOptions },
						],
					};
					break;
				case "programs_report":
					configs[key] = {
						...baseConfig,
						dropdownSearchKeys: [
							{
								key: "pri_sector_id",
								options:
									lang === "en"
										? sectorInformationOptionsEn
										: lang === "am"
											? sectorInformationOptionsAm
											: sectorInformationOptionsOr,
							},
						],
					};
					break;
				case "budget_by_zone":
					configs[key] = {
						...baseConfig,
						dropdownSearchKeys: [
							{ key: "bdr_budget_year_id", options: budgetYearOptions },
							{ key: "sector_category", options: sectorCategoryOptions },
						],
					};
					break;
				case "project_finance_by_source":
					configs[key] = {
						...baseConfig,
						dropdownSearchKeys: [
							{ key: "bdr_budget_year_id", options: budgetYearOptions },
							{ key: "sector_category", options: sectorCategoryOptions },
						],
					};
					break;
				case "project_finance_by_status":
					configs[key] = {
						...baseConfig,
						dropdownSearchKeys: [
							{ key: "bdr_budget_year_id", options: budgetYearOptions },
							{ key: "sector_category", options: sectorCategoryOptions },
						],
					};
					break;
				case "project_finance_by_year":
					configs[key] = {
						...baseConfig,
						dropdownSearchKeys: [
							{ key: "bdr_budget_year_id", options: budgetYearOptions },
							{ key: "sector_category", options: sectorCategoryOptions },
						],
					};
					break;
				case "zone_finance_by_cluster":
					configs[key] = {
						...baseConfig,
						dropdownSearchKeys: [
							{ key: "bdr_budget_year_id", options: budgetYearOptions },
						],
					};
					break;
				case "zone_finance_by_year":
					configs[key] = {
						...baseConfig,
						dropdownSearchKeys: [
							{ key: "bdr_budget_year_id", options: budgetYearOptions },
						],
					};
					break;
				case "cso_projects_report":
					configs[key] = {
						...baseConfig,
						dropdownSearchKeys: [
							{
								key: "cso_type",
								options: [
									{ label: "Local", value: 1 },
									{ label: "International", value: 2 },
								],
							},
						],
					};
					break;
				default:
					configs[key] = baseConfig;
			}
		});

		return configs;
	}, [
		getUserEndpoints,
		budgetYearOptions,
		sectorInformationOptionsAm,
		sectorInformationOptionsEn,
		sectorInformationOptionsOr,
		contractorTypeOptionsAm,
		contractorTypeOptionsEn,
		contractorTypeOptionsOr,
		projectCategoryOptionsAm,
		projectCategoryOptionsEn,
		projectCategoryOptionsOr,
		sectorCategoryOptions,
		lang,
	]);

	// Current endpoint configuration
	const currentConfig = useMemo(
		() => (selectedEndpoint ? endpointConfigs[selectedEndpoint] : null),
		[selectedEndpoint, endpointConfigs]
	);

	// Search parameters
	const searchParams = useMemo(() => {
		const params = {};

		if (locationRegionId && currentConfig?.locationParams?.region) {
			params[currentConfig.locationParams.region] = locationRegionId;
		}
		if (locationZoneId && currentConfig?.locationParams?.zone) {
			params[currentConfig.locationParams.zone] = locationZoneId;
		}
		if (locationWoredaId && currentConfig?.locationParams?.woreda) {
			params[currentConfig.locationParams.woreda] = locationWoredaId;
		}
		if (currentConfig?.reportTypeIndex) {
			params.report_type = currentConfig.reportTypeIndex;
		}

		return params;
	}, [locationRegionId, locationZoneId, locationWoredaId, currentConfig]);

	// Handlers
	const handleSelectionChange = (event) => {
		const selectedValue = event.target.value;
		setSelectedEndpoint(selectedValue);
		setSearchResults([]);
		setShowSearchResult(false);
	};

	const handleSearchResults = ({ data, error }) => {
		setIsLoading(true);
		setSearchResults(data?.data || []);
		setSearchError(error);
		setShowSearchResult(true);
		setIsLoading(false);
	};

	const handleSearchLabels = (labels) => {
		setExportSearchParams(labels);
	};

	const handleNodeSelect = (node) => {
		if (node.level === "region") {
			setLocationRegionId(node.id);
			setLocationZoneId(null);
			setLocationWoredaId(null);
		} else if (node.level === "zone") {
			setLocationZoneId(node.id);
			setLocationWoredaId(null);
		} else if (node.level === "woreda") {
			setLocationWoredaId(node.id);
		}
		setShowSearchResult(false);
	};

	// Table components mapping with lazy loading
	const tableComponents = {
		1: Greenbook,
		2: ProjectEmployeeReportsTable,
		3: ProjectsBudgetPlanTable,
		4: ProjectsBudgetExpenditureTable,
		5: ProjectsBudgetSourceTable,
		6: ProjectsContractorTable,
		7: ProjectsPaymentTable,
		8: FinancialProjectsTable,
		9: FinancialProjectsTable2,
		10: FinancialProjectsTable3,
		11: ProjectPhysicalPerformanceReportsTable,
		12: ProjectFinancialPerformanceReportsTable,
		13: ProjectPlanTable,
		14: ProgramsReport,
		15: BudgetAllocationByZone,
		16: ProjectFinanceBySource,
		17: ProjectFinanceByStatus,
		18: ProjectFinanceByYear,
		19: ZoneFinanceByCluster,
		20: ZoneFinanceByYear,
		22: ProjectActualPhysicalPerformanceReportsTable,
		23: ProjectActualFinancialPerformanceReportsTable,

		101: CsoProjectsReport,
	};

	// Render appropriate table based on report type
	const renderTable = () => {
		if (!currentConfig || !showSearchResult || searchResults.length === 0) {
			return null;
		}

		const TableComponent = tableComponents[currentConfig.reportTypeIndex];
		if (!TableComponent) return null;

		const commonProps = {
			data: searchResults,
			exportSearchParams,
			isGlobalFilter: true,
			SearchPlaceholder: t("filter_placeholder"),
			buttonClass:
				"btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal",
			tableClass:
				"align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline",
			theadClass: "table-light",
			t,
		};

		return (
			<Suspense fallback={<TableLoading />}>
				<TableComponent {...commonProps} />
			</Suspense>
		);
	};

	// Filtered endpoint options based on user type
	const endpointOptions = useMemo(
		() =>
			Object.keys(getUserEndpoints).map((key) => ({
				name: key,
			})),
		[getUserEndpoints]
	);

	return (
		<div className="page-content">
		<style>
        {`
          td {
            padding: 2px !important;
            border: 1px solid #000;
          }
        `}
      </style>
			<Breadcrumbs
				title={t("Report")}
				breadcrumbItem={t("Statistical Report")}
			/>
			<div className="w-100 d-flex gap-2">
				<TreeForLists
					onNodeSelect={handleNodeSelect}
					isCollapsed={isCollapsed}
					setIsCollapsed={setIsCollapsed}
					widthInPercent={15}
				/>
				<div
					style={{
						flex: "1 1 0",
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
					}}
				>
					<div
						style={{
							flex: isCollapsed ? "1 1 auto" : `0 0 85%`,
							transition: "all 0.3s ease",
						}}
					>
						<Row className="">
							<Col xs={2} sm={2} md={2} lg={2} xl={2}>
								<Card className="p-0 m-0 mb-3 shadow-none">
									<CardBody className="p-2">
										<Input
											type="select"
											name="endpoint"
											id="api-endpoints"
											value={selectedEndpoint}
											onChange={handleSelectionChange}
											className="mb-2 mt-1"
										>
											<option value="">{t("select_stat")}</option>
											{endpointOptions.map((endpoint, index) => (
												<option key={index} value={endpoint.name}>
													{t(endpoint.name)}
												</option>
											))}
										</Input>
									</CardBody>
								</Card>
							</Col>
							<Col xs={10} sm={10} md={10} lg={10} xl={10}>
								{selectedEndpoint && (
									<AdvancedSearch
										key={selectedEndpoint}
										searchHook={useSearchReport}
										textSearchKeys={currentConfig?.textKeys || []}
										dateSearchKeys={currentConfig?.dateKeys || []}
										dropdownSearchKeys={currentConfig?.dropdownSearchKeys || []}
										checkboxSearchKeys={[]}
										additionalParams={searchParams}
										onSearchResult={handleSearchResults}
										onSearchLabels={handleSearchLabels}
										setIsSearchLoading={setIsLoading}
										setSearchResults={setSearchResults}
										setShowSearchResult={setShowSearchResult}
										setExportSearchParams={setExportSearchParams}
									/>
								)}
							</Col>
						</Row>
						<Col xs="12">
							{isLoading ? (
								<div className="d-flex justify-content-center">
									<Spinner color="primary" />
								</div>
							) : (
								<>
									{showSearchResult && searchResults.length > 0 && (
										<Card>
											<CardBody style={{ padding: "10px" }}>
												{renderTable()}
											</CardBody>
										</Card>
									)}
									{showSearchResult && searchResults.length === 0 && (
										<div className="w-100 text-center">
											<p className="mt-5">
												{t(
													"No data available for the selected endpoint please select related Address Structure and click Search button."
												)}
											</p>
										</div>
									)}
								</>
							)}
						</Col>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Report;
