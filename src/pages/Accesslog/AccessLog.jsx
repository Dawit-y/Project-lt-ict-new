import React, {
	useEffect,
	useMemo,
	useState,
	useRef,
	useCallback,
} from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import {
	useSearchAccessLogs,
	useFetchAccessLogsByProps,
} from "../../queries/accesslog_query";
import AccessLogModal from "./AccessLogModal";
import { useTranslation } from "react-i18next";
import { Button, Col, Row, Card, CardBody } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch2";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { useFetchPagess } from "../../queries/pages_query";
import { createSelectOptions } from "../../utils/commonMethods";
import AgGridContainer from "../../components/Common/AgGridContainer";
import Spinners from "../../components/Common/Spinner";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const UserAccessLog = (props) => {
	const { ObjectId, ObjectTypeId, passedId, isActive } = props;

	// Always include the user ID in requests
	const userIdParam = useMemo(() => {
		let param = {};
		if (ObjectTypeId && ObjectId) {
			param = { ObjectTypeId, ObjectId };
		} else if (passedId) {
			param = { user_id: passedId };
		}
		return param;
	}, [ObjectTypeId, ObjectId, passedId]);

	const { data, isLoading, error, isError, refetch } =
		useFetchAccessLogsByProps(userIdParam, isActive);

	const { t } = useTranslation();
	const [modal1, setModal1] = useState(false);
	const [accessLog, setAccessLog] = useState(null);
	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState(null);
	const [transaction, setTransaction] = useState({});

	// Local state management (similar to ProjectList pattern)
	const [searchState, setSearchState] = useState({
		searchParams: {},
		additionalParams: { ...userIdParam }, // Always include user ID in additional params
		exportSearchParams: {},
	});

	const [paginationState, setPaginationState] = useState({
		currentPage: 1,
		pageSize: 10,
		total: 0,
		totalPages: 0,
		hasNext: false,
		hasPrev: false,
	});

	const [uiState, setUIState] = useState({
		showSearchResult: false,
	});

	// Extract state for easier access
	const { searchParams, additionalParams, exportSearchParams } = searchState;
	const { currentPage, pageSize, total, totalPages } = paginationState;
	const { showSearchResult } = uiState;

	// Refs
	const advancedSearchRef = useRef(null);

	// Data hooks
	const { data: pageInfo } = useFetchPagess();
	const pagesOptions = useMemo(
		() => createSelectOptions(pageInfo?.data || [], "pag_id", "pag_name"),
		[pageInfo]
	);

	// Create paginationInfo for table component
	const paginationInfo = useMemo(
		() => ({
			current_page: currentPage,
			per_page: pageSize,
			total: total || 0,
			total_pages: totalPages || 0,
			has_next: paginationState.hasNext,
			has_prev: paginationState.hasPrev,
		}),
		[
			currentPage,
			pageSize,
			total,
			totalPages,
			paginationState.hasNext,
			paginationState.hasPrev,
		]
	);

	// Effects
	useEffect(() => {
		setAccessLog(data);
		// Initialize pagination from initial data
		if (data?.pagination) {
			setPaginationState({
				currentPage: data.pagination.current_page,
				pageSize: data.pagination.per_page,
				total: data.pagination.total,
				totalPages: data.pagination.total_pages,
				hasNext: data.pagination.has_next,
				hasPrev: data.pagination.has_prev,
			});
		}
	}, [data]);

	// Update additionalParams when userIdParam changes
	useEffect(() => {
		setSearchState((prev) => ({
			...prev,
			additionalParams: { ...prev.additionalParams, ...userIdParam },
		}));
	}, [userIdParam]);

	// Modal handlers
	const toggleViewModal = useCallback(() => {
		setModal1(!modal1);
	}, [modal1]);

	// Search handler with pagination
	const handleSearchResults = useCallback(
		({ data: searchData, error: searchErr }) => {
			setSearchResults(searchData);
			setSearchError(searchErr);
			setUIState({ showSearchResult: true });

			if (searchData?.pagination) {
				setPaginationState({
					currentPage: searchData.pagination.current_page,
					pageSize: searchData.pagination.per_page,
					total: searchData.pagination.total,
					totalPages: searchData.pagination.total_pages,
					hasNext: searchData.pagination.has_next,
					hasPrev: searchData.pagination.has_prev,
				});
			}
		},
		[]
	);

	// Pagination handlers
	const handlePageChange = useCallback(
		(newPage) => {
			setPaginationState((prev) => ({ ...prev, currentPage: newPage }));

			// Trigger search refresh with new page
			if (advancedSearchRef.current && uiState.showSearchResult) {
				advancedSearchRef.current.refreshSearch({ page: newPage });
			}
		},
		[uiState.showSearchResult]
	);

	const handlePageSizeChange = useCallback(
		(newSize) => {
			setPaginationState({
				currentPage: 1,
				pageSize: newSize,
				total: 0,
				totalPages: 0,
				hasNext: false,
				hasPrev: false,
			});

			// Trigger search refresh with new page size
			if (advancedSearchRef.current && uiState.showSearchResult) {
				advancedSearchRef.current.refreshSearch({ pageSize: newSize, page: 1 });
			}
		},
		[uiState.showSearchResult]
	);

	// Handle search labels for export
	const handleSearchLabels = useCallback((labels) => {
		setSearchState((prev) => ({ ...prev, exportSearchParams: labels }));
	}, []);

	// Clear search handler (preserves user ID)
	const handleClear = useCallback(() => {
		setSearchState((prev) => ({
			searchParams: {},
			additionalParams: { ...userIdParam }, // Keep user ID on clear
			exportSearchParams: {},
		}));
		setPaginationState({
			currentPage: 1,
			pageSize: 10,
			total: 0,
			totalPages: 0,
			hasNext: false,
			hasPrev: false,
		});
		setUIState({ showSearchResult: false });
		setSearchResults(null);
		setSearchError(null);
	}, [userIdParam]);

	// Custom hook to always include user ID in search
	const useSearchWithUserId = useCallback(
		(searchParams) => {
			return useFetchAccessLogsByProps(
				{ ...searchParams, ...userIdParam },
				isActive
			);
		},
		[userIdParam, isActive]
	);

	// AG Grid column definitions
	const columnDefs = useMemo(() => {
		const baseColumnDefs = [
			{
				headerName: t("S.N"),
				field: "sn",
				valueGetter: (params) => params.node.rowIndex + 1,
				sortable: false,
				filter: false,
				width: 60,
				pinned: "left",
			},
			{
				field: "acl_ip",
				headerName: t("IP Address"),
				sortable: true,
				filter: "agTextColumnFilter",
				flex: 1,
				minWidth: 150,
				cellRenderer: (params) => {
					return <span>{truncateText(params.value, 30) || "-"}</span>;
				},
			},
			{
				field: "acl_user_id",
				headerName: t("User ID"),
				sortable: true,
				filter: "agTextColumnFilter",
				flex: 1,
				minWidth: 120,
				cellRenderer: (params) => {
					return <span>{truncateText(params.value, 30) || "-"}</span>;
				},
			},
			{
				field: "acl_object_name",
				headerName: t("URL/Object"),
				sortable: true,
				filter: "agTextColumnFilter",
				flex: 1,
				minWidth: 200,
				cellRenderer: (params) => {
					return <span>{truncateText(params.value, 40) || "-"}</span>;
				},
			},
			{
				field: "acl_object_action",
				headerName: t("Action"),
				sortable: true,
				filter: "agTextColumnFilter",
				width: 100,
			},
			{
				field: "acl_create_time",
				headerName: t("Time"),
				sortable: true,
				filter: "agTextColumnFilter",
				flex: 1,
				minWidth: 180,
				cellRenderer: (params) => {
					return <span>{truncateText(params.value, 30) || "-"}</span>;
				},
			},
			{
				headerName: t("View Detail"),
				sortable: false,
				filter: false,
				width: 120,
				pinned: "right",
				cellRenderer: (params) => {
					if (params.node.footer) {
						return ""; // Suppress button for footer
					}

					return (
						<Button
							type="button"
							color="primary"
							className="btn-sm"
							onClick={() => {
								setTransaction(params.data);
								setModal1(true);
							}}
						>
							{t("view_detail")}
						</Button>
					);
				},
			},
		];
		return baseColumnDefs;
	}, [t]);

	// Export columns configuration
	const exportColumns = useMemo(
		() => [
			{ header: t("IP Address"), key: "acl_ip", width: 20 },
			{ header: t("User ID"), key: "acl_user_id", width: 15 },
			{ header: t("URL/Object"), key: "acl_object_name", width: 25 },
			{ header: t("Action"), key: "acl_object_action", width: 15 },
			{ header: t("Time"), key: "acl_create_time", width: 20 },
			{ header: t("Description"), key: "acl_description", width: 30 },
		],
		[t]
	);

	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}

	return (
		<React.Fragment>
			<AccessLogModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
			/>

			<div>
				<div>
					<AdvancedSearch
						ref={advancedSearchRef}
						searchHook={useSearchWithUserId}
						textSearchKeys={["acl_user_id"]}
						dateSearchKeys={["log_time"]}
						dropdownSearchKeys={[]}
						checkboxSearchKeys={[]}
						additionalParams={additionalParams}
						setAdditionalParams={(params) =>
							setSearchState((prev) => ({
								...prev,
								additionalParams: { ...params, ...userIdParam },
							}))
						}
						onSearchResult={handleSearchResults}
						onSearchLabels={handleSearchLabels}
						setShowSearchResult={(show) =>
							setUIState((prev) => ({ ...prev, showSearchResult: show }))
						}
						setIsSearchLoading={setIsSearchLoading}
						setSearchResults={setSearchResults}
						searchParams={searchParams}
						getSearchParams={(params) =>
							setSearchState((prev) => ({ ...prev, searchParams: params }))
						}
						setExportSearchParams={(params) =>
							setSearchState((prev) => ({
								...prev,
								exportSearchParams: params,
							}))
						}
						// Pass pagination state
						pagination={paginationState}
						onPaginationChange={setPaginationState}
						onClear={handleClear}
						initialSearchParams={searchParams}
						initialAdditionalParams={additionalParams}
						initialPagination={paginationState}
						// Disable initial auto-search since we have initial data
						autoSearch={false}
					/>

					{isLoading || isSearchLoading ? (
						<Spinners />
					) : (
						<Row>
							<Col xs="12">
								<Card>
									<CardBody>
										<AgGridContainer
											rowData={
												showSearchResult
													? searchResults?.data || []
													: data?.data || []
											}
											columnDefs={columnDefs}
											isLoading={isLoading || isSearchLoading}
											isPagination={false}
											isServerSidePagination={true}
											paginationPageSize={pageSize}
											isGlobalFilter={true}
											isAddButton={false}
											rowHeight={36}
											addButtonText={t("add") + " " + t("access_log")}
											isExcelExport={true}
											isPdfExport={true}
											isPrint={true}
											tableName={`UserAccessLog_${passedId || ObjectId || "unknown"}`}
											exportColumns={exportColumns}
											exportSearchParams={exportSearchParams}
											paginationInfo={paginationInfo}
											onPageChange={handlePageChange}
											onPageSizeChange={handlePageSizeChange}
											customTableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
											customTheadClass="table-light"
										/>
									</CardBody>
								</Card>
							</Col>
						</Row>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

UserAccessLog.propTypes = {
	ObjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	ObjectTypeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	passedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	isActive: PropTypes.bool,
};

UserAccessLog.defaultProps = {
	isActive: true,
};

export default UserAccessLog;
