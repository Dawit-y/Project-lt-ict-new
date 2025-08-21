import React, { useEffect, lazy, useMemo, useState, useRef } from "react";
const AgGridContainer = lazy(
  () => import("../../components/Common/AgGridContainer"),
);
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSearchProjectDocuments } from "../../queries/projectdocument_query";
import { useTranslation } from "react-i18next";
import { Button, Col, Row, Input } from "reactstrap";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import TreeForLists from "../../components/Common/TreeForLists";
import { formatFileSize, getFileIcon } from "./FileManager/FileList";
import ProjectDocumentModal from "./ProjectDocumentModal";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const ProjectDocumentList = () => {
  document.title = "Project Document List";
  const { t } = useTranslation();
  const [modal1, setModal1] = useState(false);
  const [details, setDetails] = useState({});
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
  // Filter by marked rows
  const filterMarked = () => {
    if (gridRef.current) {
      gridRef.current.api.setRowData(selectedRows);
    }
  };
  // Clear the filter and show all rows again
  const clearFilter = () => {
    gridRef.current.api.setRowData(showSearchResults ? results : data);
  };
  const toggleViewModal = () => setModal1(!modal1);
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
        width: 70,
      },
      {
        headerName: t("prj_name"),
        field: "prj_name",
        sortable: true,
        filter: true,
        // flex: 4,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_name, 30) || "-";
        },
      },
      {
        headerName: t("prj_code"),
        field: "prj_code",
        sortable: true,
        filter: true,
        minWidth: 130,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_code, 30) || "-";
        },
      },
      {
        headerName: t("prd_name"),
        field: "prd_name",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          const { icon, color } = getFileIcon(params.data.prd_file_extension);
          return (
            <span>
              {" "}
              <i className={`${icon} ${color} me-1`}></i> {params.data.prd_name}
            </span>
          );
        },
      },
      {
        headerName: t("prd_size"),
        field: "prd_size",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return formatFileSize(params.data.prd_size);
        },
      },
      {
        headerName: t("Uploaded By"),
        field: "created_by",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return params.data?.created_by;
        },
      },
      {
        headerName: t("prd_create_time"),
        field: "prd_create_time",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return new Date(params.data?.prd_create_time)
            .toISOString()
            .split("T")[0];
        },
      },
      // {
      //   headerName: t("view_detail"),
      //   flex: 2,
      //   sortable: true,
      //   filter: false,
      //   cellRenderer: (params) => (
      //     <Button
      //       type="button"
      //       color="primary"
      //       className="btn-sm"
      //       onClick={() => {
      //         setDetails(params.data);
      //         toggleViewModal();
      //       }}
      //     >
      //       {t("view_detail")}
      //     </Button>
      //   ),
      // },
    ];
    return baseColumnDefs;
  });
  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <ProjectDocumentModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={details}
      />
      <div className="page-content">
        <div>
          <Breadcrumbs />
          <div className="w-100 d-flex gap-2">
            <TreeForLists
              onNodeSelect={handleNodeSelect}
              setIsAddressLoading={setIsAddressLoading}
              setInclude={setInclude}
            />
            <div className="w-100">
              <AdvancedSearch
                searchHook={useSearchProjectDocuments}
                textSearchKeys={["prd_name"]}
                dateSearchKeys={[]}
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
                  tableName="Project Document"
                  includeKey={[
                    "prj_name",
                    "prj_code",
                    "prd_name",
                    "prd_size",
                    "prd_create_time",
                  ]}
                  excludeKey={["is_editable", "is_deletable"]}
                />
              </AdvancedSearch>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ProjectDocumentList;
