import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  lazy,
  Suspense,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Badge } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
const Breadcrumbs = lazy(() => import("../../components/Common/Breadcrumb"));
const ApproverBudgetRequestListModal = lazy(() =>
  import("./ApproverBudgetRequestModal")
);
const BudgetRequestAnalysis = lazy(() => import("./BudgetRequestAnalysis"));
const AdvancedSearch = lazy(() =>
  import("../../components/Common/AdvancedSearch")
);
const FetchErrorHandler = lazy(() =>
  import("../../components/Common/FetchErrorHandler")
);
const TreeForLists = lazy(() => import("../../components/Common/TreeForLists"));
const AttachFileModal = lazy(() =>
  import("../../components/Common/AttachFileModal")
);
const ConvInfoModal = lazy(() =>
  import("../../pages/Conversationinformation/ConvInfoModal")
);
const BudgetRequestModal = lazy(() => import("./BudgetRequestModal"));
const AgGridContainer = lazy(() =>
  import("../../components/Common/AgGridContainer"));

import { budget_request } from "../../settings/printablecolumns";
import { useSearchBudgetRequestforApproval } from "../../queries/budget_request_query";
import { useFetchBudgetYears } from "../../queries/budgetyear_query";
import { useFetchRequestCategorys } from "../../queries/requestcategory_query";
import {
  useSearchRequestFollowups,
  useFetchRequestFollowups,
} from "../../queries/requestfollowup_query";
import { PAGE_ID } from "../../constants/constantFile";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ApproverBudgetRequestList = () => {
  document.title = "Budget Request List";
  const { t } = useTranslation();
  const [modal1, setModal1] = useState(false);
  const [fileModal, setFileModal] = useState(false);
  const [convModal, setConvModal] = useState(false);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [transaction, setTransaction] = useState({});

  const { data: budgetYearData } = useFetchBudgetYears();
  const { data: bgCategoryOptionsData } = useFetchRequestCategorys();
  const { data: projectStatusData } = useFetchProjectStatuss();

  const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [include, setInclude] = useState(0);

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

  const requestCategoryOptions = useMemo(() => {
    return (
      bgCategoryOptionsData?.data?.map((category) => ({
        label: category.rqc_name_en,
        value: category.rqc_id,
      })) || []
    );
  }, [bgCategoryOptionsData]);

  const projectStatusOptions = useMemo(() => {
    return (
      projectStatusData?.data
        ?.filter((type) => type.prs_id === 5 || type.prs_id === 6)
        .map((type) => ({
          label: type.prs_status_name_or,
          value: type.prs_id,
        })) || []
    );
  }, [projectStatusData]);


  const handleSearch = useCallback(({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  }, []);

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
        // flex: 0.5,
      },
      {
        headerName: t("bdr_budget_year_id"),
        field: "bdy_name",
        sortable: true,
        filter: true,
        //flex: 1,
        width: 150,
        cellRenderer: (params) => {
          return truncateText(params.data.bdy_name, 30) || "-";
        },
      },
      {
        headerName: t("bdr_request_category_id"),
        field: "bdr_request_category_id",
        sortable: true,
        filter: true,
        //flex: 1,
        cellRenderer: (params) => {
          const category = requestCategoryOptions.find(
            (option) => option.value === params.data.bdr_request_category_id
          );
          return category ? truncateText(category.label, 30) : "-";
        },
      },

      {
        headerName: t("bdr_request_type"),
        field: "bdr_request_type",
        sortable: true,
        filter: true,

        cellRenderer: (params) => {
          const requestType = projectStatusOptions.find(
            (option) => option.value === params.data.bdr_request_type
          );
          return requestType ? truncateText(requestType.label, 30) : "-";
        },
      },

      {
        headerName: t("prj_name"),
        field: "prj_name",
        sortable: true,
        filter: true,
        //flex: 2,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_name, 30) || "-";
        },
      },
      {
        headerName: t("prj_code"),
        field: "prj_code",
        sortable: true,
        filter: true,
        //flex: 1.5,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_code, 30) || "-";
        },
      },
      {
        headerName: t("bdr_requested_amount"),
        field: "bdr_requested_amount",
        sortable: true,
        filter: true,
        //flex: 1.2,
        valueFormatter: (params) => {
          if (params.value != null) {
            return new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(params.value);
          }
          return "0.00"; // Default value if null or undefined
        },
      },
      {
        headerName: t("bdr_requested_date_gc"),
        field: "bdr_requested_date_gc",
        sortable: true,
        filter: "agDateColumnFilter",
        //flex: 1,
        cellRenderer: (params) => {
          return truncateText(params.data.bdr_requested_date_gc, 30) || "-";
        },
      },
      {
        headerName: t("bdr_released_amount"),
        field: "bdr_released_amount",
        sortable: true,
        filter: true,
        //flex: 1.2,
        valueFormatter: (params) => {
          if (params.value != null) {
            return new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(params.value);
          }
          return "0.00"; // Default value if null or undefined
        },
      },

      {
        headerName: t("bdr_released_date_gc"),
        field: "bdr_released_date_gc",
        sortable: true,
        filter: "agDateColumnFilter",
        //flex: 1,
        cellRenderer: (params) => {
          return truncateText(params.data.bdr_released_date_gc, 30) || "-";
        },
      },
      {
        headerName: t("forwarded"),
        field: "forwarded",
        sortable: true,
        filter: true,
        //flex: 1,
        width: 130,
        cellRenderer: (params) => {
          const isForwarded = params.data.forwarded;
          return (
            <Badge
              className={`font-size-12 badge-soft-${isForwarded ? "danger" : "secondary"
                }`}
            >
              {isForwarded ? t("forwarded") : t("not_forwarded")}
            </Badge>
          );
        },
      },
      {
        headerName: t("bdr_request_status"),
        field: "bdr_request_status",
        sortable: true,
        filter: true,
        //flex: 1,
        width: 120,
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
        headerName: t("take_action"),
        field: "take_action",
        //flex: 1,
        width: 120,
        cellRenderer: (params) => {
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm my-auto"
              onClick={() => {
                const data = params.data;
                toggleViewModal();
                setTransaction(data);
              }}
            >
              {t("take_action")}
            </Button>
          );
        },
      },
      {
        headerName: t("attach_files"),
        field: "attach_files",
        //flex: 1,
        width: 80,
        cellRenderer: (params) => {
          return (
            <Button
              outline
              type="button"
              color="success"
              className="btn-sm"
              onClick={() => {
                toggleFileModal();
                setTransaction(params.data);
              }}
            >
              {t("attach_files")}
            </Button>
          );
        },
      },
      {
        headerName: t("Message"),
        field: "Message",
        //flex: 1,
        width: 100,
        cellRenderer: (params) => {
          return (
            <Button
              outline
              type="button"
              color="primary"
              className="btn-sm"
              onClick={() => {
                toggleConvModal();
                setTransaction(params.data);
              }}
            >
              {t("Message")}
            </Button>
          );
        },
      },
    ];
    return baseColumnDefs;
  }, []);

  return (
    <Suspense fallback={<Spinners />}>
      <React.Fragment>
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
        />
        <ConvInfoModal
          isOpen={convModal}
          toggle={toggleConvModal}
          ownerTypeId={PAGE_ID.PROJ_BUDGET_REQUEST}
          ownerId={transaction?.bdr_id ?? null}
        />
        <div className="page-content">
          <div className="">
            <Breadcrumbs />
            <div className="w-100 d-flex gap-2 flex-nowrap">
              <div style={{ flex: "0 0 25%", minWidth: "250px" }}>
                <TreeForLists
                  onNodeSelect={handleNodeSelect}
                  setIsAddressLoading={setIsAddressLoading}
                  setInclude={setInclude}
                />
              </div>
              <div style={{ flex: "0 0 75%" }}>
                <AdvancedSearch
                  searchHook={useSearchBudgetRequestforApproval}
                  dateSearchKeys={["budget_request_date"]}
                  textSearchKeys={["prj_name"]}
                  dropdownSearchKeys={[
                    {
                      key: "bdr_budget_year_id",
                      options: budgetYearOptions,
                    },
                    {
                      key: "bdr_request_category_id",
                      options: requestCategoryOptions,
                    },
                    {
                      key: "bdr_request_type",
                      options: projectStatusOptions,
                    },
                  ]}
                  additionalParams={projectParams}
                  setAdditionalParams={setProjectParams}
                  onSearchResult={handleSearch}
                  setIsSearchLoading={setIsSearchLoading}
                  setSearchResults={setSearchResults}
                  setShowSearchResult={setShowSearchResult}
                >
                  <TableWrapper columnDefs={columnDefs} showSearchResult={showSearchResult} />
                </AdvancedSearch>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    </Suspense>
  );
};
ApproverBudgetRequestList.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ApproverBudgetRequestList;

const TableWrapper = ({ data, isLoading, columnDefs, showSearchResult }) => {
  const storedUser = JSON.parse(localStorage.getItem("authUser"));
  const user = storedUser?.user;
  const depId =
    user?.usr_officer_id > 0
      ? user.usr_officer_id
      : user?.usr_team_id > 0
        ? user.usr_team_id
        : user?.usr_directorate_id > 0
          ? user.usr_directorate_id
          : user?.usr_department_id > 0
            ? user.usr_department_id
            : null;

  const { data: rqfData, isLoading: rqfLoading } = useFetchRequestFollowups();

  function markForwardedRequests(budgetRequests = [], forwardedRequests = [], depId) {
    const forwardedSet = new Set(
      forwardedRequests
        .filter((req) => req.rqf_forwarding_dep_id === depId)
        .map((req) => req.rqf_request_id)
    );

    return budgetRequests.map((request) => ({
      ...request,
      forwarded: forwardedSet.has(request.bdr_id),
    }));
  }

  let transformedData = data?.data || [];
  if (data?.data && rqfData?.data) {
    transformedData = markForwardedRequests(data.data, rqfData.data, depId);
  }

  return (
    <AgGridContainer
      rowData={showSearchResult ? transformedData : []}
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
