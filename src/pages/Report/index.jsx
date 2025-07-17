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
import TreeForLists from "../../components/Common/TreeForLists";
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

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") return text;
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const Report = () => {
	const { t } = useTranslation();

	const [endpoints] = useState([
		{ name: "project_stat", url: "uuuu" },
		{ name: "employee_stat", url: "uuuu" },
		{ name: "budget_plan_stat", url: "uuuu" },
		{ name: "budget_expenditure_stat", url: "uuuu" },
		{ name: "budget_source_stat", url: "uuuu" },
		{ name: "budget_contractor_stat", url: "uuuu" },
		{ name: "project_payment_stat", url: "uuuu" },
		{ name: "project_financial_report", url: "uuuu" },
		{ name: "project_financial_report2", url: "uuuu" },
		{ name: "project_financial_report3", url: "uuuu" },
		{ name: "project_physical_performance_report", url: "uuuu" },
		{ name: "project_financial_performance_report", url: "uuuu" },
		{ name: "project_plan_report", url: "uuuu" },
	]);

	const [searchResults, setSearchResults] = useState([]);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searcherror, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(true);
	const [reportType, setReportType] = useState({});
	const [projectParams, setProjectParams] = useState({});
	const [locationParams, setLocationParams] = useState({});
	const [ReportTypeId, setReportTypeId] = useState(null);
	const [LocationRegionId, setLocationRegionId] = useState(null);
	const [LocationZoneId, setLocationZoneId] = useState(null);
	const [LocationWoredaId, setLocationWoredaId] = useState(null);
	const [isAddressLoading, setIsAddressLoading] = useState(false);
	const [searchHook, setSearchHook] = useState(null);
	const [textSearchKeys, setTextSearchKeys] = useState([]);
	const [dateSearchKeys, setDateSearchKeys] = useState([]);
	const [selectedEndpoint, setSelectedEndpoint] = useState("");
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [dropdownSearchKeys, setDropdownSearchKeys] = useState([]);

	const { data: budgetYearData } = useFetchBudgetYears();
	const budgetYearOptions = createSelectOptions(
		budgetYearData?.data || [],
		"bdy_id",
		"bdy_name"
	);
	const { data: sectorInformationData } = useFetchSectorInformations();
	const sectorInformationOptions = createSelectOptions(
		sectorInformationData?.data || [],
		"sci_id",
		"sci_name_or"
	);
	const { data: contractorTypeData } = useFetchContractorTypes();
	const contractorTypeOptions = createSelectOptions(
		contractorTypeData?.data || [],
		"cnt_id",
		"cnt_type_name_or"
	);

	const { data: projectCategoryData } = useFetchProjectCategorys();
	const projectCategoryOptions = createSelectOptions(
		projectCategoryData?.data || [],
		"pct_id",
		"pct_name_or"
	);

	const { data: sectorCategoryData } = useFetchSectorCategorys();
	const sectorCategoryOptions = createSelectOptions(
		sectorCategoryData?.data || [],
		"psc_id",
		"psc_name"
	);

	const endpointConfigs = {
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
				{
					key: "bdr_budget_year_id",
					options: budgetYearOptions,
				},
				{
					key: "prj_sector_id",
					options: sectorInformationOptions,
				},
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
				{
					key: "pbe_budget_year_id",
					options: budgetYearOptions,
				},
				{
					key: "prj_sector_id",
					options: sectorInformationOptions,
				},
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
				{
					key: "prp_budget_year_id",
					options: budgetYearOptions,
				},
				{
					key: "prj_sector_id",
					options: sectorInformationOptions,
				},
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
				{
					key: "prp_budget_year_id",
					options: budgetYearOptions,
				},
				{
					key: "prj_sector_id",
					options: sectorInformationOptions,
				},
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
				{
					key: "prp_budget_year_id",
					options: budgetYearOptions,
				},

				{
					key: "prj_sector_id",
					options: sectorInformationOptions,
				},
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
				{
					key: "prp_budget_year_id",
					options: budgetYearOptions,
				},
				{
					key: "prj_sector_id",
					options: sectorInformationOptions,
				},
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
				{
					key: "prp_budget_year_id",
					options: budgetYearOptions,
				},
				{
					key: "prj_sector_id",
					options: sectorInformationOptions,
				},
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
				{
					key: "prj_project_category_id",
					options: projectCategoryOptions,
				},

				{
					key: "sector_category",
					options: sectorCategoryOptions,
				},
				{
					key: "prp_budget_year_id",
					options: budgetYearOptions,
				},
			],
			reportTypeIndex: 13,
		},
	};

	const handleSelectionChange = (event) => {
		const selectedValue = event.target.value;
		setSelectedEndpoint(selectedValue);
		const config = endpointConfigs[selectedValue];
		if (config) {
			setSearchHook(() => useSearchReport);
			setTextSearchKeys(config.textKeys || []);
			setDropdownSearchKeys(config.dropdownSearchKeys);
			setDateSearchKeys(config.dateKeys || []);
			setReportTypeId(config.reportTypeIndex);
		}
	};

	const handleSearchResults = ({ data, error }) => {
		setLoading(true);
		setSearchResults(data?.data);
		setSearchError(error);
		setShowSearchResult(true);
		setLoading(false);
	};

	useEffect(() => {
		const updatedParams = {};
		if (LocationRegionId && locationParams.region) {
			updatedParams[locationParams.region] = LocationRegionId;
		}
		if (LocationZoneId && locationParams.zone) {
			updatedParams[locationParams.zone] = LocationZoneId;
		}
		if (LocationWoredaId && locationParams.woreda) {
			updatedParams[locationParams.woreda] = LocationWoredaId;
		}
		if (ReportTypeId) {
			updatedParams["report_type"] = ReportTypeId;
		}
		setProjectParams(updatedParams);
	}, [
		LocationRegionId,
		LocationZoneId,
		LocationWoredaId,
		ReportTypeId,
		locationParams,
	]);

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

		if (showSearchResult) setShowSearchResult(false);
	};

	useEffect(() => {
		if (selectedEndpoint && endpointConfigs[selectedEndpoint]) {
			const config = endpointConfigs[selectedEndpoint];
			setLocationParams(config.locationParams || {});
		} else {
			setLocationParams({});
		}
	}, [selectedEndpoint]);

	useEffect(() => {
		setData([]);
	}, [selectedEndpoint]);

	const columns = useMemo(() => {
		return [
			{
				header: "",
				accessorKey: "prj_name",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ row }) => (
					<span>{truncateText(row.original.prj_name, 30) || "-"}</span>
				),
			},
			{
				header: "",
				accessorKey: "prj_code",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ row }) => (
					<span>{truncateText(row.original.prj_code, 30) || "-"}</span>
				),
			},
			{
				header: "",
				accessorKey: "sector_category",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ row }) => (
					<span>{truncateText(row.original.sector_category, 30) || "-"}</span>
				),
			},
			{
				header: "",
				accessorKey: "bdr_requested_amount",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ row }) => (
					<span>
						{truncateText(row.original.bdr_requested_amount, 30) || "-"}
					</span>
				),
			},
		];
	}, []);

	return (
		<div className="page-content">
			<Breadcrumbs
				title={t("Report")}
				breadcrumbItem={t("Statistical Report")}
			/>
			<div className="d-flex" style={{ gap: "20px" }}>
				{/* TreeForLists with fixed width */}
				<div style={{ width: "250px", flexShrink: 0 }}>
					<TreeForLists
						onNodeSelect={handleNodeSelect}
						setIsAddressLoading={setIsAddressLoading}
					/>
				</div>

				{/* Main content area */}
				<div style={{ flex: 1, minWidth: 0 }}>
					<Row className="">
						<Col xs="2">
							<Card className="p-0 m-0 mb-3 shadow-none">
								<CardBody className="p-2">
									<>
										<Input
											type="select"
											name="endpoint"
											id="api-endpoints"
											value={selectedEndpoint}
											onChange={handleSelectionChange}
											className="mb-2"
										>
											<option value="">{t("select_stat")}</option>
											{endpoints.map((endpoint, index) => (
												<option key={index} value={endpoint.name}>
													{t(endpoint.name)}
												</option>
											))}
										</Input>
									</>
								</CardBody>
							</Card>
						</Col>
						<Col xs="10">
							<AdvancedSearch
								searchHook={useSearchReport}
								textSearchKeys={textSearchKeys}
								dateSearchKeys={dateSearchKeys}
								dropdownSearchKeys={dropdownSearchKeys}
								checkboxSearchKeys={[]}
								additionalParams={projectParams}
								setAdditionalParams={setProjectParams}
								onSearchResult={handleSearchResults}
								setIsSearchLoading={setIsSearchLoading}
								setSearchResults={setSearchResults}
								setShowSearchResult={setShowSearchResult}
							/>
						</Col>
					</Row>

					<Col xs="12">
						{loading || isSearchLoading ? (
							<div className="d-flex justify-content-center">
								<Spinner color="primary" />
							</div>
						) : (
							<>
								{searchResults?.length > 0 && showSearchResult && (
									<Card>
										<CardBody style={{ padding: "10px" }}>
											{ReportTypeId === 1 && (
												<Greenbook
													columns={columns}
													data={searchResults}
													isGlobalFilter
													isAddButton
													isCustomPageSize
													isPagination
													SearchPlaceholder={t("filter_placeholder")}
													buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
													buttonName={`${t("add")} ${t("budget_source")}`}
													tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
													theadClass="table-info"
													pagination="pagination"
													paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
												/>
											)}
											{ReportTypeId === 2 && (
												<ProjectEmployeeReportsTable
													data={searchResults}
													isGlobalFilter
													SearchPlaceholder={t("filter_placeholder")}
													buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
													tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
													theadClass="table-light"
													t={t}
												/>
											)}
											{ReportTypeId === 3 && (
												<ProjectsBudgetPlanTable
													data={searchResults}
													isGlobalFilter
													SearchPlaceholder={t("filter_placeholder")}
													buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
													tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
													theadClass="table-light"
													t={t}
												/>
											)}

											{ReportTypeId === 4 && (
												<ProjectsBudgetExpenditureTable
													data={searchResults}
													isGlobalFilter
													SearchPlaceholder={t("filter_placeholder")}
													buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
													tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
													theadClass="table-light"
													t={t}
												/>
											)}

											{ReportTypeId === 5 && (
												<ProjectsBudgetSourceTable
													data={searchResults}
													isGlobalFilter
													SearchPlaceholder={t("filter_placeholder")}
													buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
													tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
													theadClass="table-light"
													t={t}
												/>
											)}

											{ReportTypeId === 6 && (
												<ProjectsContractorTable
													data={searchResults}
													isGlobalFilter
													SearchPlaceholder={t("filter_placeholder")}
													buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
													tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
													theadClass="table-light"
													t={t}
												/>
											)}
											{ReportTypeId === 7 && (
												<ProjectsPaymentTable
													data={searchResults}
													isGlobalFilter
													SearchPlaceholder={t("filter_placeholder")}
													buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
													tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
													theadClass="table-light"
													t={t}
												/>
											)}
											{ReportTypeId === 8 && (
												<FinancialProjectsTable
													data={searchResults}
													isGlobalFilter
													SearchPlaceholder={t("filter_placeholder")}
													buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
													tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
													theadClass="table-light"
													t={t}
												/>
											)}
											{ReportTypeId === 9 && (
												<FinancialProjectsTable2
													data={searchResults}
													isGlobalFilter
													SearchPlaceholder={t("filter_placeholder")}
													buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
													tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
													theadClass="table-light"
													t={t}
												/>
											)}
											{ReportTypeId === 10 && (
												<FinancialProjectsTable3
													data={searchResults}
													isGlobalFilter
													SearchPlaceholder={t("filter_placeholder")}
													buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
													tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
													theadClass="table-light"
													t={t}
												/>
											)}

											{ReportTypeId === 11 && (
												<ProjectPhysicalPerformanceReportsTable
													data={searchResults}
													isGlobalFilter
													SearchPlaceholder={t("filter_placeholder")}
													buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
													tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
													theadClass="table-light"
													t={t}
												/>
											)}

											{ReportTypeId === 12 && (
												<ProjectFinancialPerformanceReportsTable
													data={searchResults}
													isGlobalFilter
													SearchPlaceholder={t("filter_placeholder")}
													buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
													tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
													theadClass="table-light"
													t={t}
												/>
											)}

											{ReportTypeId === 13 && (
												<ProjectPlanTable
													data={searchResults}
													isGlobalFilter
													SearchPlaceholder={t("filter_placeholder")}
													buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
													tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
													theadClass="table-light"
													t={t}
												/>
											)}
										</CardBody>
									</Card>
								)}
								{searchResults?.length === 0 && (
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
	);
};
export default Report;