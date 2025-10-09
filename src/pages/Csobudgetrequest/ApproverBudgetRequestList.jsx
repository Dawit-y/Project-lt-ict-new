import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  lazy,
  Suspense,
} from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  Col,
  Row,
  UncontrolledTooltip,
  Input,
  Badge,
  Spinner,
} from "reactstrap";
import { FaPaperclip, FaPenSquare, FaGavel, FaCog } from "react-icons/fa";
import AgGridContainer from "../../components/Common/AgGridContainer";
import { useSearchBudgetRequestforApproval } from "../../queries/cso_budget_request_query";
import { useFetchBudgetYears } from "../../queries/budgetyear_query";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useFetchRequestStatuss } from "../../queries/requeststatus_query";
import { useFetchRequestFollowups } from "../../queries/requestfollowup_query";
import { PAGE_ID } from "../../constants/constantFile";
import {
  createSelectOptions,
  createMultiSelectOptions,
} from "../../utils/commonMethods";

// Lazy load components
const Breadcrumbs = lazy(() => import("../../components/Common/Breadcrumb"));
const AdvancedSearch = lazy(
  () => import("../../components/Common/AdvancedSearch"),
);
const FetchErrorHandler = lazy(
  () => import("../../components/Common/FetchErrorHandler"),
);
const TreeForLists = lazy(
  () => import("../../components/Common/TreeForLists2"),
);
const AttachFileModal = lazy(
  () => import("../../components/Common/AttachFileModal"),
);
const ConvInfoModal = lazy(
  () => import("../../pages/Conversationinformation/ConvInfoModal"),
);
const BudgetRequestModal = lazy(() => import("./BudgetRequestModal"));
const ApproverBudgetRequestListModal = lazy(
  () => import("./ApproverBudgetRequestModal"),
);
import SearchTableContainer from "../../components/Common/SearchTableContainer";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
// Loader Component for Suspense
const LazyLoader = ({ children }) => (
  <Suspense fallback={<Spinner color="primary" />}>{children}</Suspense>
);
const ApproverBudgetRequestList = () => {
  document.title = "Proposed Request List";
  const { t, i18n } = useTranslation();
  const [modal1, setModal1] = useState(false);

  const [budgetRequestMetaData, setBudgetRequestMetaData] = useState({});
  const [detailModal, setDetailModal] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [fileModal, setFileModal] = useState(false);
  const [convModal, setConvModal] = useState(false);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data, isLoading, error, isError, refetch } = useState(null);
  const { data: budgetYearData } = useFetchBudgetYears();

  const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [include, setInclude] = useState(0);

  const isMutable = ![3, 4].includes(parseInt(transaction?.bdr_request_status));

  const budgetYearMap = useMemo(() => {
    return (
      budgetYearData?.data?.reduce((acc, year) => {
        acc[year.bdy_id] = year.bdy_name;
        return acc;
      }, {}) || {}
    );
  }, [budgetYearData]);

  const budgetYearOptions = useMemo(() => {
    return (
      budgetYearData?.data?.map((year) => ({
        label: year.bdy_name,
        value: year.bdy_id,
      })) || []
    );
  }, [budgetYearData]);

  const { data: requestStatus } = useFetchRequestStatuss();
  const {
    rqs_name_en: requestStatusOptionsEn,
    rqs_name_or: requestStatusOptionsOr,
    rqs_name_am: requestStatusOptionsAm,
  } = createMultiSelectOptions(requestStatus?.data || [], "rqs_id", [
    "rqs_name_en",
    "rqs_name_or",
    "rqs_name_am",
  ]);

  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };

  const handleEyeClick = (data) => {
    setShowCanvas(!showCanvas);
    setBudgetRequestMetaData(data);
  };

  const toggleDetailModal = () => setDetailModal(!detailModal);
  const toggleViewModal = () => setModal1(!modal1);
  const toggleFileModal = () => setFileModal(!fileModal);
  const toggleConvModal = () => setConvModal(!convModal);

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

  const handleNodeSelect = (node) => {
    if (node.level === "region") {
      setPrjLocationRegionId(node.id);
      setPrjLocationZoneId(null); // Clear dependent states
      setPrjLocationWoredaId(null);
    } else if (node.level === "zone") {
      setPrjLocationZoneId(node.id);
      setPrjLocationWoredaId(null); // Clear dependent state
    } else if (node.level === "woreda") {
      setPrjLocationWoredaId(node.id);
    }
    if (showSearchResult) {
      setShowSearchResult(false);
    }
  };

  const columnDefs = useMemo(() => {
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
        headerName: t("cso_name"),
        field: "cso_name",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 220,
        cellRenderer: (params) => {
          return truncateText(params.data.cso_name, 30) || "-";
        },
      },
      {
        headerName: t("prj_name"),
        field: "prj_name",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 220,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_name, 100) || "-";
        },
      },
      {
        headerName: t("Year"),
        field: "bdy_name",
        sortable: true,
        filter: true,
        width: 120,
        cellRenderer: (params) => {
          return truncateText(params.data.bdy_name, 30) || "-";
        },
      },
      {
        headerName: t("prj_code"),
        field: "prj_code",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_code, 30) || "-";
        },
      },
      {
        headerName: t("bdr_requested_date_gc"),
        field: "bdr_requested_date_gc",
        sortable: true,
        filter: "agDateColumnFilter",
        cellRenderer: (params) => {
          return truncateText(params.data.bdr_requested_date_gc, 30) || "-";
        },
      },
      {
        headerName: t("bdr_request_status"),
        field: "bdr_request_status",
        sortable: true,
        filter: true,
        width: 140,
        cellRenderer: (params) => {
          const badgeClass = params.data.color_code;
          return (
            <Badge className={`font-size-12 badge-soft-${badgeClass}`}>
              {params.data.status_name}
            </Badge>
          );
        },
      },
      // {
      //   headerName: t("view_detail"),
      //   field: "view_detail",
      //   flex: 1,
      //   cellRenderer: (params) => {
      //     return (
      //       <Button
      //         type="button"
      //         color="primary"
      //         className="btn-sm"
      //         onClick={() => {
      //           toggleDetailModal();
      //           setTransaction(params.data);
      //         }}
      //       >
      //         {t("view_detail")}
      //       </Button>
      //     );
      //   },
      // },
      {
        headerName: t("actions"),
        field: "actions",
        width: 170,
        cellRenderer: (params) => {
          const data = params.data;

          return (
            <div className="d-flex gap-1">
              <Button
                id={`cso-takeAction-${data.bdr_id}`}
                color="light"
                size="sm"
                onClick={() => {
                  toggleViewModal();
                  setTransaction(data);
                }}
              >
                <FaGavel />
              </Button>
              <UncontrolledTooltip target={`cso-takeAction-${data.bdr_id}`}>
                {t("take_action")}
              </UncontrolledTooltip>
              <Button
                id={`attachFiles-${data.bdr_id}`}
                color="light"
                size="sm"
                onClick={() => {
                  toggleFileModal();
                  setTransaction(data);
                }}
              >
                <FaPaperclip />
              </Button>
              <UncontrolledTooltip target={`attachFiles-${data.bdr_id}`}>
                {t("attach_files")}
              </UncontrolledTooltip>

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

    if (
      data?.previledge?.is_role_editable &&
      data?.previledge?.is_role_deletable
    ) {
      baseColumnDefs.push({
        headerName: t("view_detail"),
        field: "view_detail",
        width: 120,
        cellRenderer: (params) => (
          <div className="d-flex gap-3">
            {params.data.is_editable ? (
              <Link
                to="#"
                className="text-secondary"
                onClick={() => handleEyeClick(params.data)}
              >
                <i className="mdi mdi-eye font-size-18 ms-2" id="viewtooltip" />
                <UncontrolledTooltip placement="top" target="viewtooltip">
                  View
                </UncontrolledTooltip>
              </Link>
            ) : (
              ""
            )}
          </div>
        ),
      });
    }

    return baseColumnDefs;
  }, []);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <LazyLoader>
        <BudgetRequestModal
          isOpen={detailModal}
          toggle={toggleDetailModal}
          transaction={transaction}
        />
        <ApproverBudgetRequestListModal
          isOpen={modal1}
          toggle={toggleViewModal}
          transaction={transaction}
          budgetYearMap={budgetYearMap}
        />
        <AttachFileModal
          isOpen={fileModal}
          toggle={toggleFileModal}
          projectId={transaction?.bdr_project_id}
          ownerTypeId={PAGE_ID.PROJ_BUDGET_REQUEST}
          ownerId={transaction?.bdr_id}
          accept={{
            "application/pdf": [],
            "application/msword": [],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              [],
          }}
          title={t("Proposed Request File")}
          canAdd={isMutable}
          canEdit={isMutable}
          canDelete={isMutable}
        />
        <ConvInfoModal
          isOpen={convModal}
          toggle={toggleConvModal}
          ownerTypeId={PAGE_ID.PROJ_BUDGET_REQUEST}
          ownerId={transaction?.bdr_id ?? null}
          canAdd={isMutable}
          canEdit={isMutable}
          canDelete={isMutable}
        />
      </LazyLoader>
      <div className="page-content">
        <div className="">
          <Breadcrumbs />
          <div className="w-100 d-flex gap-2 flex-nowrap">
            <TreeForLists
              onNodeSelect={handleNodeSelect}
              setIsAddressLoading={setIsAddressLoading}
              setInclude={setInclude}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
            <SearchTableContainer isCollapsed={isCollapsed}>
              <AdvancedSearch
                searchHook={useSearchBudgetRequestforApproval}
                textSearchKeys={["prj_name", "prj_code"]}
                dropdownSearchKeys={[
                  {
                    key: "bdr_budget_year_id",
                    options: budgetYearOptions,
                  },
                  {
                    key: "bdr_request_status",
                    options:
                      i18n.language === "en"
                        ? requestStatusOptionsEn
                        : i18n.language === "am"
                          ? requestStatusOptionsAm
                          : requestStatusOptionsOr,
                  },
                ]}
                additionalParams={projectParams}
                setAdditionalParams={setProjectParams}
                onSearchResult={handleSearchResults}
                setIsSearchLoading={setIsSearchLoading}
                setSearchResults={setSearchResults}
                setShowSearchResult={setShowSearchResult}
              >
                <TableWrapper
                  columnDefs={columnDefs}
                  showSearchResult={showSearchResult}
                />
              </AdvancedSearch>
            </SearchTableContainer>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
ApproverBudgetRequestList.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ApproverBudgetRequestList;

const TableWrapper = ({ data, isLoading, columnDefs, showSearchResult }) => {
  return (
    <AgGridContainer
      rowData={showSearchResult ? data?.data : []}
      columnDefs={columnDefs}
      isLoading={isLoading}
      isPagination={true}
      paginationPageSize={20}
      isGlobalFilter={true}
      isAddButton={false}
      rowHeight={35}
      addButtonText="Add"
      isExcelExport={true}
      isPdfExport={true}
      isPrint={true}
      tableName="budget_request"
      includeKey={[
        "bdy_name",
        "prj_name",
        "prj_code",
        "bdr_request_status",
        "bdr_requested_amount",
        "bdr_released_amount",
        "bdr_requested_date_gc",
        "bdr_released_date_gc",
        "bdr_description",
      ]}
      excludeKey={["is_editable", "is_deletable"]}
    />
  );
};
