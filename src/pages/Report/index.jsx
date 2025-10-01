import React, { useState, useEffect, useMemo } from "react";
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
import Greenbook from "./ReportDesign/Greenbook";
import FinancialProjectsTable from "../Report/ProjectFinanicialReportsTable";
import FinancialProjectsTable2 from "../Report/ProjectFinanicialReportsTable2";
import FinancialProjectsTable3 from "../Report/ProjectFinanicialReportsTable3";
import ProjectPhysicalPerformanceReportsTable from "../Report/ProjectPhysicalPerformanceReportsTable";
import ProjectFinancialPerformanceReportsTable from "../Report/ProjectFinancialPerformanceReportsTable";
import ProjectPlanTable from "../Report/ProjectPlanTable";
import ProjectEmployeeReportsTable from "../Report/ProjectEmployeeReportsTable";
import ProjectsBudgetPlanTable from "../Report/ProjectsBudgetPlanTable";
import ProjectsBudgetExpenditureTable from "../Report/ProjectsBudgetExpenditureTable";
import ProjectsBudgetSourceTable from "../Report/ProjectsBudgetSourceTable";
import ProjectsContractorTable from "../Report/ProjectsContractorTable";
import ProjectsPaymentTable from "../Report/ProjectsPaymentTable";
import { useFetchBudgetYears } from "../../queries/budgetyear_query";
import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import { useFetchSectorCategorys } from "../../queries/sectorcategory_query";
import { useFetchContractorTypes } from "../../queries/contractortype_query";
import { createSelectOptions } from "../../utils/commonMethods";
import { useTranslation } from "react-i18next";

const Report = () => {
	const { t } = useTranslation();
	const [exportSearchParams, setExportSearchParams] = useState({});

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

	const sectorInformationOptions = useMemo(
		() =>
			createSelectOptions(
				sectorInformationData?.data || [],
				"sci_id",
				"sci_name_or"
			),
		[sectorInformationData]
	);

	const contractorTypeOptions = useMemo(
		() =>
			createSelectOptions(
				contractorTypeData?.data || [],
				"cnt_id",
				"cnt_type_name_or"
			),
		[contractorTypeData]
	);

	const projectCategoryOptions = useMemo(
		() =>
			createSelectOptions(
				projectCategoryData?.data || [],
				"pct_id",
				"pct_name_or"
			),
		[projectCategoryData]
	);

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

	// Endpoint configurations
	const endpointConfigs = useMemo(
		() => ({
			project_stat: {
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				reportTypeIndex: 1,
			},
			employee_stat: {
				textKeys: ["prj_name", "prj_code"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "prj_sector_id",
						options: sectorInformationOptions,
					},
				],
				reportTypeIndex: 2,
			},
			budget_plan_stat: {
				textKeys: ["prj_name"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{ key: "bdr_budget_year_id", options: budgetYearOptions },
					{ key: "prj_sector_id", options: sectorInformationOptions },
				],
				reportTypeIndex: 3,
			},
			budget_expenditure_stat: {
				textKeys: ["prj_name"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{ key: "pbe_budget_year_id", options: budgetYearOptions },
					{ key: "prj_sector_id", options: sectorInformationOptions },
				],
				reportTypeIndex: 4,
			},
			budget_source_stat: {
				textKeys: ["prj_name"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "prj_sector_id",
						options: sectorInformationOptions,
					},
				],
				reportTypeIndex: 5,
			},
			budget_contractor_stat: {
				textKeys: ["prj_name", "prj_code"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "cni_contractor_type_id",
						options: contractorTypeOptions,
					},
				],
				reportTypeIndex: 6,
			},
			project_payment_stat: {
				dateKeys: ["payment_date"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "bdr_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 7,
			},
			project_financial_report: {
				dateKeys: ["report_date"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{ key: "prp_budget_year_id", options: budgetYearOptions },
					{ key: "prj_sector_id", options: sectorInformationOptions },
				],
				reportTypeIndex: 8,
			},
			project_financial_report2: {
				dateKeys: ["report_date"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{ key: "prp_budget_year_id", options: budgetYearOptions },
					{ key: "prj_sector_id", options: sectorInformationOptions },
				],
				reportTypeIndex: 9,
			},
			project_financial_report3: {
				dateKeys: ["report_date"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{ key: "prp_budget_year_id", options: budgetYearOptions },
					{ key: "prj_sector_id", options: sectorInformationOptions },
				],
				reportTypeIndex: 10,
			},
			project_physical_performance_report: {
				dateKeys: ["report_date"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{ key: "prp_budget_year_id", options: budgetYearOptions },
					{ key: "prj_sector_id", options: sectorInformationOptions },
				],
				reportTypeIndex: 11,
			},
			project_financial_performance_report: {
				dateKeys: ["report_date"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{ key: "prp_budget_year_id", options: budgetYearOptions },
					{ key: "prj_sector_id", options: sectorInformationOptions },
				],
				reportTypeIndex: 12,
			},
			project_plan_report: {
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{ key: "prj_project_category_id", options: projectCategoryOptions },
					{ key: "sector_category", options: sectorCategoryOptions },
					{ key: "prp_budget_year_id", options: budgetYearOptions },
				],
				reportTypeIndex: 13,
			},
		}),
		[
			budgetYearOptions,
			sectorInformationOptions,
			contractorTypeOptions,
			projectCategoryOptions,
			sectorCategoryOptions,
		]
	);

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

		// Table components mapping
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

			return <TableComponent {...commonProps} />;
		};

		// Endpoint options
		const endpointOptions = Object.keys(endpointConfigs).map((key) => ({
			name: key,
		}));

		return (
			<div className="page-content">
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
											dropdownSearchKeys={
												currentConfig?.dropdownSearchKeys || []
											}
											checkboxSearchKeys={[]}
											additionalParams={searchParams}
											onSearchResult={handleSearchResults}
											onSearchLabels={handleSearchLabels}
											setIsSearchLoading={setIsLoading}
											setSearchResults={setSearchResults}
											setShowSearchResult={setShowSearchResult}
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
