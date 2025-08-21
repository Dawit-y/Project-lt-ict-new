import React, { useEffect, useMemo, useState, lazy } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSearchProjectStakeholders } from "../../queries/projectstakeholder_query";
import { useTranslation } from "react-i18next";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import TreeForLists from "../../components/Common/TreeForLists2";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import { projectStakeholderExportColumns } from "../../utils/exportColumnsForLists";

const AgGridContainer = lazy(
  () => import("../../components/Common/AgGridContainer"),
);
const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectStakeholderList = () => {
  //meta title
  document.title = " ProjectStakeholder";
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [include, setInclude] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data, error, isError, refetch } = useState("");

  //START FOREIGN CALLS

  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };
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
  };

  //START UNCHANGED
  const columns = useMemo(() => {
    const baseColumns = [
      {
        headerName: t("S.N"),
        field: "sn",
        valueGetter: (params) => params.node.rowIndex + 1,
        sortable: false,
        filter: false,
        width: 60,
      },
      {
        headerName: t("prj_name"),
        field: "prj_name",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 200,
        width: 150,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_name, 30) || "-";
        },
      },
      {
        headerName: t("prj_code"),
        field: "prj_code",
        sortable: true,
        filter: true,
        width: 150,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_code, 30) || "-";
        },
      },
      {
        headerName: t("psh_name"),
        field: "psh_name",
        sortable: true,
        filter: false,
        flex: 1,
        minWidth: 200,
        width: 150,
        cellRenderer: (params) => {
          return truncateText(params.data.psh_name, 30) || "-";
        },
      },
      {
        headerName: t("psh_stakeholder_type"),
        field: "psh_stakeholder_type",
        sortable: true,
        filter: false,
        width: 150,
        cellRenderer: (params) => {
          return truncateText(params.data.psh_stakeholder_type, 30) || "-";
        },
      },
      {
        headerName: t("psh_representative_name"),
        field: "psh_representative_name",
        sortable: true,
        filter: false,
        flex: 1,
        minWidth: 200,
        width: 150,
        cellRenderer: (params) => {
          return truncateText(params.data.psh_representative_name, 30) || "-";
        },
      },
      {
        headerName: t("psh_representative_phone"),
        field: "psh_representative_phone",
        sortable: true,
        filter: false,
        width: 200,
        cellRenderer: (params) => {
          return truncateText(params.data.psh_representative_phone, 30) || "-";
        },
      },
      {
        headerName: t("psh_role"),
        field: "psh_role",
        sortable: true,
        filter: false,
        width: 150,
        cellRenderer: (params) => {
          return truncateText(params.data.psh_role, 30) || "-";
        },
      },
    ];
    return baseColumns;
  });

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <div>
          <Breadcrumbs
            title={t("project")}
            breadcrumbItem={t("Project Payment List")}
          />
          <div className="w-100 d-flex gap-2">
            <TreeForLists
              onNodeSelect={handleNodeSelect}
              setIsAddressLoading={setIsAddressLoading}
              setInclude={setInclude}
              setIsCollapsed={setIsCollapsed}
              isCollapsed={isCollapsed}
            />

            {/* Main Content */}
            <SearchTableContainer isCollapsed={isCollapsed}>
              <AdvancedSearch
                searchHook={useSearchProjectStakeholders}
                textSearchKeys={["prj_name", "prj_code"]}
                dateSearchKeys={[]}
                dropdownSearchKeys={[]}
                checkboxSearchKeys={[]}
                component_params={{}}
                additionalParams={projectParams}
                setAdditionalParams={setProjectParams}
                onSearchResult={handleSearchResults}
                setIsSearchLoading={setIsSearchLoading}
                setSearchResults={setSearchResults}
                setShowSearchResult={setShowSearchResult}
              >
                <AgGridContainer
                  rowData={
                    showSearchResult ? searchResults?.data : data?.data || []
                  }
                  columnDefs={columns}
                  isLoading={isSearchLoading}
                  isPagination={true}
                  rowHeight={35}
                  paginationPageSize={10}
                  isGlobalFilter={true}
                  isExcelExport={true}
                  isPdfExport={true}
                  isPrint={true}
                  tableName="Project Stakeholder"
                  exportColumns={projectStakeholderExportColumns}
                />
              </AdvancedSearch>
            </SearchTableContainer>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ProjectStakeholderList;
