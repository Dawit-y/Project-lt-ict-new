// list of proposed requests of a cso user

import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useTranslation } from "react-i18next";
import { Button, UncontrolledTooltip, Badge } from "reactstrap";
import { FaPaperclip, FaPenSquare, FaGavel } from "react-icons/fa";
import AgGridContainer from "../../components/Common/AgGridContainer";
import { useSearchBudgetRequests } from "../../queries/cso_budget_request_query";
import { useFetchRequestCategorys } from "../../queries/requestcategory_query";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import TreeForLists from "../../components/Common/TreeForLists3";
import AttachFileModal from "../../components/Common/AttachFileModal";
import ConvInfoModal from "../Conversationinformation/ConvInfoModal";
import { PAGE_ID } from "../../constants/constantFile";
import { createMultiLangKeyValueMap } from "../../utils/commonMethods";
import { budgetRequestExportColumns } from "../../utils/exportColumnsForLists";
import { Link } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ApproverProposedRequestList = () => {
	document.title = "Proposed Request List";
	const { t, i18n } = useTranslation();
	const [fileModal, setFileModal] = useState(false);
	const [convModal, setConvModal] = useState(false);

	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searcherror, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const { data: requestCategoryData } = useFetchRequestCategorys();
	const { data: projectStatusData } = useFetchProjectStatuss();

	const [projectParams, setProjectParams] = useState({ prj_location_region_id: 1, include: 1 });
	const [prjLocationRegionId, setPrjLocationRegionId] = useState(1);
	const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
	const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
	const [isAddressLoading, setIsAddressLoading] = useState(false);
	const [include, setInclude] = useState(1);

	const [transaction, setTransaction] = useState({});
	const [exportSearchParams, setExportSearchParams] = useState({});

	const { user: storedUser } = useAuthUser();
	const userType = storedUser?.usr_user_type;

	const requestCategoryOptions = useMemo(() => {
		return (
			requestCategoryData?.data?.map((category) => ({
				label: category.rqc_name_en,
				value: category.rqc_id,
			})) || []
		);
	}, [requestCategoryData]);

	const projectStatusOptions = useMemo(() => {
		return (
			projectStatusData?.data?.map((status) => ({
				label: status.prs_status_name_en,
				value: status.prs_id,
			})) || []
		);
	}, [projectStatusData]);

	const requestCategoryMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			requestCategoryData?.data || [],
			"rqc_id",
			{
				en: "rqc_name_en",
				am: "rqc_name_am",
				or: "rqc_name_or",
			},
			i18n.language,
		);
	}, [requestCategoryData, i18n.language]);

	const projectStatusMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			projectStatusData?.data || [],
			"prs_id",
			{
				en: "prs_status_name_en",
				am: "prs_status_name_am",
				or: "prs_status_name_or",
			},
			i18n.language,
		);
	}, [projectStatusData, i18n.language]);

	// Handle search results from AdvancedSearch
	const handleSearchResults = ({ data, error }) => {
		setSearchResults(data);
		setSearchError(error);
		setShowSearchResult(true);
	};

	const handleSearchLabels = (labels) => {
		setExportSearchParams(labels);
	};

	// Toggle modals
	const toggleFileModal = () => setFileModal(!fileModal);
	const toggleConvModal = () => setConvModal(!convModal);

	// Update project params when location filters change
	useEffect(() => {
		setProjectParams({
			...(prjLocationRegionId && {
				prj_location_region_id: prjLocationRegionId,
			}),
			...(prjLocationZoneId && { prj_location_zone_id: prjLocationZoneId }),
			...(prjLocationWoredaId && {
				prj_location_woreda_id: prjLocationWoredaId,
			}),
			...(include === 1 && { include }),
		});
	}, [prjLocationRegionId, prjLocationZoneId, prjLocationWoredaId, include]);

	// Handle location tree node selection
	const handleNodeSelect = (node) => {
		if (node.level === "region") {
			setPrjLocationRegionId(node.id);
			setPrjLocationZoneId(null);
			setPrjLocationWoredaId(null);
		} else if (node.level === "zone") {
			setPrjLocationZoneId(node.id);
			setPrjLocationWoredaId(null);
		} else if (node.level === "woreda") {
			setPrjLocationWoredaId(node.id);
		}
		if (showSearchResult) {
			setShowSearchResult(false);
		}
	};

	// Define AG Grid columns with proper mapping and icons
	const columnDefs = useMemo(() => {
		const baseColumnDefs = [
			{
				headerName: t("S.N"),
				field: "sn",
				valueGetter: (params) => params.node.rowIndex + 1,
				sortable: false,
				filter: false,
				width: 70,
				pinned: "left",
			},
			{
				headerName: t("prj_name"),
				field: "prj_name",
				sortable: true,
				filter: true,
				flex: 1,
				minWidth: 200,
				pinned: "left",
				cellRenderer: (params) => {
					return truncateText(params.data.prj_name, 100) || "-";
				},
			},
			{
				headerName: t("bdr_request_status"),
				field: "bdr_request_status",
				sortable: true,
				filter: true,
				width: 150,
				cellRenderer: (params) => {
					const badgeClass = params.data.color_code || "secondary";
					return (
						<Badge className={`font-size-12 badge-soft-${badgeClass}`}>
							{params.data.status_name || "-"}
						</Badge>
					);
				},
			},
			{
				headerName: t("bdr_request_category_id"),
				field: "bdr_request_category_id",
				sortable: true,
				filter: true,
				width: 180,
				cellRenderer: (params) => {
					if (!params.value || !requestCategoryMap) return "-";
					return requestCategoryMap[params.value] || "-";
				},
			},
			{
				headerName: t("bdr_requested_date_gc"),
				field: "bdr_requested_date_gc",
				sortable: true,
				width: 150,
				filter: "agDateColumnFilter",
				cellRenderer: (params) => {
					return params.data.bdr_requested_date_gc || "-";
				},
			},
			{
				headerName: t("actions"),
				field: "actions",
				width: 250,
				pinned: "right",
				cellRenderer: (params) => {
					const data = params.data;

					return (
						<div className="d-flex gap-1">
							{/* Attach Files Button */}
							<Button
								id={`attach-${data.bdr_id}`}
								color="light"
								size="sm"
								onClick={() => {
									toggleFileModal();
									setTransaction(data);
								}}
							>
								<FaPaperclip />
							</Button>
							<UncontrolledTooltip target={`attach-${data.bdr_id}`}>
								{t("attach_files")}
							</UncontrolledTooltip>

							{/* Notes/Conversation Button */}
							<Button
								id={`notes-${data.bdr_id}`}
								color="light"
								size="sm"
								onClick={() => {
									toggleConvModal();
									setTransaction(data);
								}}
							>
								<FaPenSquare />
							</Button>
							<UncontrolledTooltip target={`notes-${data.bdr_id}`}>
								{t("Notes")}
							</UncontrolledTooltip>
						</div>
					);
				},
			},
		];
		return baseColumnDefs;
	}, [requestCategoryMap, projectStatusMap, t]);

	return (
		<React.Fragment>
			<AttachFileModal
				isOpen={fileModal}
				toggle={toggleFileModal}
				projectId={transaction?.bdr_project_id}
				ownerTypeId={PAGE_ID.PROJ_BUDGET_REQUEST}
				ownerId={transaction?.bdr_id}
			/>
			<ConvInfoModal
				isOpen={convModal}
				toggle={toggleConvModal}
				ownerTypeId={PAGE_ID.PROJ_BUDGET_REQUEST}
				ownerId={transaction?.bdr_id}
			/>

			<div className="page-content">
				<div className="">
					<Breadcrumbs />
					<div className="w-100 d-flex gap-2">
						{/* Location Tree Component */}
						<TreeForLists
							onNodeSelect={handleNodeSelect}
							setIsAddressLoading={setIsAddressLoading}
							setInclude={setInclude}
							isCollapsed={isCollapsed}
							setIsCollapsed={setIsCollapsed}
							initialSelection={{
								id: 1,
								nodeId: 1,
								level: "region",
								add_name_en: "",
								add_name_am: "",
								name: "",
							}}
							initialInclude={1}
						/>

						{/* Main Search and Table Container */}
						<SearchTableContainer isCollapsed={isCollapsed}>
							<AdvancedSearch
								searchHook={useSearchBudgetRequests}
								dateSearchKeys={["bdr_requested_date_gc"]}
								textSearchKeys={["prj_name", "prj_code"]}
								dropdownSearchKeys={[
									{
										key: "bdr_request_category_id",
										options: requestCategoryOptions,
									},
									{
										key: "bdr_request_status",
										options: projectStatusOptions,
									},
								]}
								additionalParams={projectParams}
								setAdditionalParams={setProjectParams}
								onSearchResult={handleSearchResults}
								onSearchLabels={handleSearchLabels}
								setIsSearchLoading={setIsSearchLoading}
								setSearchResults={setSearchResults}
								setShowSearchResult={setShowSearchResult}
								setExportSearchParams={setExportSearchParams}
							>
								{/* AG Grid Container */}
								<AgGridContainer
									rowData={showSearchResult ? searchResults?.data : []}
									columnDefs={columnDefs}
									isLoading={isSearchLoading}
									isPagination={true}
									paginationPageSize={30}
									paginationPageSizeOptions={[10, 20, 30, 40, 50]}
									isGlobalFilter={true}
									isAddButton={false}
									addButtonText={t("Add")}
									isExcelExport={true}
									isPdfExport={true}
									isPrint={true}
									tableName={t("Budget Request")}
									exportSearchParams={exportSearchParams}
									exportColumns={[
										...budgetRequestExportColumns,
										{
											key: "bdr_request_category_id",
											label: t("bdr_request_category_id"),
											format: (val) => {
												return requestCategoryMap[val] || "-";
											},
										},
										{
											key: "bdr_request_status",
											label: t("bdr_request_status"),
											format: (val, row) => {
												return row.status_name || "-";
											},
										},
									]}
								/>
							</AdvancedSearch>
						</SearchTableContainer>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

ApproverProposedRequestList.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};

export default ApproverProposedRequestList;
