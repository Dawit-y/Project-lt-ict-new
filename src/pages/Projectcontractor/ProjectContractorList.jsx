import React, { useEffect, useMemo, useState, useRef } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSearchProjectContractors } from "../../queries/projectcontractor_query";
import { useTranslation } from "react-i18next";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import TreeForLists from "../../components/Common/TreeForLists2";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import AgGridContainer from "../../components/Common/AgGridContainer";
import { projectContractorExportColumns } from "../../utils/exportColumnsForLists";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectContractorList = () => {
  //meta title
  document.title = "Project Contractors List";
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
  const { data, isLoading, error, isError, refetch } = useState("");
  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);

  // When selection changes, update selectedRows
  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

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

  const columnDefs = useMemo(() => {
    const baseColumnDefs = [
      {
        headerName: t("S.N"),
        field: "sn",
        valueGetter: (params) => params.node.rowIndex + 1,
        sortable: false,
        filter: false,
        width: 70,
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
          return truncateText(params.data.prj_name, 35) || "-";
        },
      },
      {
        headerName: t("prj_code"),
        field: "prj_code",
        sortable: true,
        filter: true,
        hide: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_code, 35) || "-";
        },
      },
      {
        headerName: t("cni_name"),
        field: "cni_name",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 200,
        width: 150,
        cellRenderer: (params) => {
          return truncateText(params.data.cni_name, 35) || "-";
        },
      },

      {
        headerName: t("cni_contractor_type"),
        field: "cni_contractor_type",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 200,
        width: 150,
        cellRenderer: (params) => {
          return truncateText(params.data.cni_contractor_type, 35) || "-";
        },
      },
      {
        headerName: t("cni_tin_num"),
        field: "cni_tin_num",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 200,
        width: 150,
        cellRenderer: (params) => {
          return truncateText(params.data.cni_tin_num, 35) || "-";
        },
      },
      {
        headerName: t("cni_vat_num"),
        field: "cni_vat_num",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 200,
        width: 150,
        cellRenderer: (params) => {
          return truncateText(params.data.cni_vat_num, 35) || "-";
        },
      },
      {
        headerName: t("cni_total_contract_price"),
        field: "cni_total_contract_price",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 200,
        width: 150,
        cellRenderer: (params) => {
          return truncateText(params.data.cni_total_contract_price, 35) || "-";
        },
      },

      {
        headerName: t("cni_contract_start_date_gc"),
        field: "cni_contract_start_date_gc",
        sortable: true,
        filter: true,
        width: 220,
        cellRenderer: (params) => {
          return (
            truncateText(params.data.cni_contract_start_date_gc, 35) || "-"
          );
        },
      },

      {
        headerName: t("cni_contract_end_date_gc"),
        field: "cni_contract_end_date_gc",
        sortable: true,
        filter: true,
        width: 200,
        cellRenderer: (params) => {
          return truncateText(params.data.cni_contract_end_date_gc, 35) || "-";
        },
      },

      {
        headerName: t("cni_contact_person"),
        field: "cni_contact_person",
        sortable: true,
        filter: true,
        width: 200,
        cellRenderer: (params) => {
          return truncateText(params.data.cni_contact_person, 35) || "-";
        },
      },

      {
        headerName: t("cni_phone_number"),
        field: "cni_phone_number",
        sortable: true,
        filter: true,
        width: 200,
        cellRenderer: (params) => {
          return truncateText(params.data.cni_phone_number, 35) || "-";
        },
      },
    ];
    return baseColumnDefs;
  });

  //START UNCHANGED

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <div>
          <Breadcrumbs
            title={t("project")}
            breadcrumbItem={t("project_contract_list")}
          />
          <div className="w-100 d-flex gap-2">
            <TreeForLists
              onNodeSelect={handleNodeSelect}
              setIsAddressLoading={setIsAddressLoading}
              setInclude={setInclude}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
            <SearchTableContainer isCollapsed={isCollapsed}>
              <AdvancedSearch
                searchHook={useSearchProjectContractors}
                textSearchKeys={["prj_name", "prj_code"]}
                dateSearchKeys={["contractsign_date"]}
                dropdownSearchKeys={[]}
                checkboxSearchKeys={[]}
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
                  columnDefs={columnDefs}
                  isLoading={isSearchLoading}
                  isPagination={true}
                  rowHeight={35}
                  paginationPageSize={10}
                  isGlobalFilter={true}
                  isExcelExport={true}
                  isPdfExport={true}
                  isPrint={true}
                  tableName="Project Contract/Contractor"
                  exportColumns={projectContractorExportColumns}
                />
              </AdvancedSearch>
            </SearchTableContainer>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProjectContractorList;
