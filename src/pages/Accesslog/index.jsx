import React, {
	useEffect,
	useMemo,
	useState,
	useRef,
	useCallback,
	lazy,
	Suspense,
} from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import * as Yup from "yup";
import { FaEye } from "react-icons/fa";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Button, Col, Row, Card, CardBody } from "reactstrap";
import { useSearchAccessLogs } from "../../queries/accesslog_query";
import { useFetchPagess } from "../../queries/pages_query";
import { createSelectOptions } from "../../utils/commonMethods";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

// Lazy load components
const Breadcrumbs = lazy(() => import("../../components/Common/Breadcrumb"));
const AccessLogModal = lazy(() => import("./AccessLogModal"));
const AdvancedSearch = lazy(
	() => import("../../components/Common/AdvancedSearch2")
);
const AgGridContainer = lazy(
	() => import("../../components/Common/AgGridContainer")
);
const Spinners = lazy(() => import("../../components/Common/Spinner"));

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const AccessLogModel = () => {
	// Meta title
	document.title = "Access Log";
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	const [searchState, setSearchState] = useState({
		searchParams: {},
		additionalParams: {},
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

	const { searchParams, additionalParams, exportSearchParams } = searchState;
	const { currentPage, pageSize, total, totalPages } = paginationState;
	const { showSearchResult } = uiState;

	const [modal1, setModal1] = useState(false);
	const [accessLog, setAccessLog] = useState(null);
	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState(null);
	const [transaction, setTransaction] = useState({});

	const advancedSearchRef = useRef(null);

	const { data, isLoading, error, isError, refetch } = useSearchAccessLogs();
	const { data: pageInfo } = useFetchPagess();

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

	const pagesOptions = useMemo(
		() => createSelectOptions(pageInfo?.data || [], "pag_id", "pag_name"),
		[pageInfo]
	);

	const toggleViewModal = () => setModal1(!modal1);

	const handleSearchResults = useCallback(
		({ data: searchData, error: searchErr }) => {
			setSearchResults(searchData);
			setSearchError(searchErr);
			setUIState({ showSearchResult: true });

			if (searchData?.pagination) {
				// Update pagination state with server data
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

	// Clear search handler
	const handleClear = useCallback(() => {
		setSearchState({
			searchParams: {},
			additionalParams: {},
			exportSearchParams: {},
		});
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
	}, []);

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
				field: "acl_object_action",
				headerName: t("Action"),
				sortable: true,
				filter: "agTextColumnFilter",
				width: 120,
			},
			{
				field: "acl_object_name",
				headerName: t("Object Type"),
				sortable: true,
				filter: "agTextColumnFilter",
				flex: 1,
				minWidth: 180,
				cellRenderer: (params) => {
					return <span>{truncateText(params.value, 40) || "-"}</span>;
				},
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
						return ""; 
					}

					return (
						<Button
							size="sm"
							type="button"
							className="btn-sm"
							onClick={() => {
								toggleViewModal();
								setTransaction(params.data);
							}}
						>
							<FaEye />
						</Button>
					);
				},
			},
		];
		return baseColumnDefs;
	}, [t]);

	const exportColumns = useMemo(
		() => [
			{ header: t("IP Address"), key: "acl_ip", width: 20 },
			{ header: t("User ID"), key: "acl_user_id", width: 15 },
			{ header: t("Action"), key: "acl_object_action", width: 15 },
			{ header: t("Object Type"), key: "acl_object_name", width: 25 },
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
			<Suspense fallback={<div>Loading...</div>}>
				<AccessLogModal
					isOpen={modal1}
					toggle={toggleViewModal}
					transaction={transaction}
				/>

				<div className="page-content">
					<div className="container-fluid">
						<Breadcrumbs
							title={t("access_log")}
							breadcrumbItem={t("access_log")}
						/>

						<AdvancedSearch
							ref={advancedSearchRef}
							searchHook={useSearchAccessLogs}
							textSearchKeys={["acl_user_id"]}
							dateSearchKeys={["log_time"]}
							dropdownSearchKeys={[
								{
									key: "acl_object_action",
									options: [
										{ value: "INSERT", label: "INSERT" },
										{ value: "UPDATE", label: "UPDATE" },
										{ value: "DELETE", label: "DELETE" },
									],
								},
								{
									key: "page_id",
									options: pagesOptions,
								},
							]}
							checkboxSearchKeys={[]}
							additionalParams={additionalParams}
							setAdditionalParams={(params) =>
								setSearchState((prev) => ({
									...prev,
									additionalParams: params,
								}))
							}
							onSearchResult={handleSearchResults}
							onSearchLabels={handleSearchLabels}
							setShowSearchResult={(show) =>
								setUIState((prev) => ({ ...prev, showSearchResult: show }))
							}
							setIsSearchLoading={setIsSearchLoading}
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
												addButtonText={`${t("add")} ${t("access_log")}`}
												isExcelExport={true}
												isPdfExport={true}
												isPrint={true}
												tableName="AccessLog"
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
			</Suspense>
		</React.Fragment>
	);
};

AccessLogModel.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};

export default AccessLogModel;
