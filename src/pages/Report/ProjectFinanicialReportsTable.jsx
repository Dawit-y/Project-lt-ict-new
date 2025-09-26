import React, { useState, useMemo, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Card,
  CardBody,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import {
  FaSearch,
  FaEye,
  FaEyeSlash,
  FaColumns,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import ExportToExcel from "../../components/Common/ExportToExcel";

const FinancialProjectsTable = ({
  data = [],
  t = (key) => key,
  tableClass = "",
  theadClass = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [columnWidths, setColumnWidths] = useState({});
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumn, setResizingColumn] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [expandedSectors, setExpandedSectors] = useState({});

  const tableRef = useRef(null);
  const headerRowRef = useRef(null);

  const columnsConfig = useMemo(
    () => [
      {
        id: "projectSN",
        label: t("SN"),
        visible: false,
        minWidth: 50,
        sticky: true,
      },
      {
        id: "prj_code",
        label: t("Project Code"),
        visible: true,
        minWidth: 50,
        sticky: true,
      },
      {
        id: "prj_name",
        label: t("Project Name"),
        visible: true,
        minWidth: 100,
        sticky: true,
      },
      {
        id: "prj_measurement_unit",
        label: t("Unit"),
        visible: true,
        minWidth: 30,
      },
      { id: "weight", label: t("Weight"), visible: true, minWidth: 30 },
      { id: "zone", label: t("Location Zone"), visible: true, minWidth: 100 },
      {
        id: "woreda",
        label: t("Location Woreda"),
        visible: true,
        minWidth: 100,
      },
      {
        id: "prj_location_description",
        label: t("Specific Site"),
        visible: true,
        minWidth: 150,
      },
      { id: "start_year", label: t("Start Year"), visible: true, minWidth: 50 },
      { id: "end_year", label: t("End Year"), visible: true, minWidth: 50 },
      { id: "cni_name", label: t("Contractor"), visible: true, minWidth: 100 },
      {
        id: "beneficiery",
        label: t("Beneficiaries"),
        visible: true,
        minWidth: 50,
      },
      {
        id: "prj_measured_figure",
        label: t("Measured Figure"),
        visible: true,
        minWidth: 50,
      },
      {
        id: "budgetyear",
        label: t("Budget Year"),
        visible: true,
        minWidth: 50,
      },
      {
        id: "prp_physical_performance",
        label: t("Physical Performance"),
        visible: true,
        minWidth: 100,
      },
      {
        id: "prp_physical_planned",
        label: t("Physical Planned"),
        visible: true,
        minWidth: 100,
      },
      {
        id: "prj_total_estimate_budget",
        label: t("Total Budget"),
        visible: true,
        minWidth: 100,
      },
      {
        id: "prp_budget_baseline",
        label: t("Budget Baseline"),
        visible: true,
        minWidth: 100,
      },
      {
        id: "bdr_released_amount",
        label: t("Released Amount"),
        visible: true,
        minWidth: 100,
      },
    ],
    [t],
  );

  useEffect(() => {
    const initialWidths = {};
    columnsConfig.forEach((col) => {
      initialWidths[col.id] = col.minWidth;
    });
    setColumnWidths(initialWidths);
  }, [columnsConfig]);

  const toggleColumn = (columnId) => {
    setHiddenColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId],
    );
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter(
      (project) =>
        (project.sector &&
          project.sector.toLowerCase().includes(lowerSearchTerm)) ||
        (project.prj_name &&
          project.prj_name.toLowerCase().includes(lowerSearchTerm)) ||
        (project.prj_code &&
          project.prj_code.toLowerCase().includes(lowerSearchTerm)),
    );
  }, [data, searchTerm]);

  const groupedData = useMemo(() => {
    if (!filteredData) return {};
    return filteredData.reduce((acc, project) => {
      const sector = project.sector || t("Other Sector");
      const projectName = project.prj_name || t("Unnamed Project");
      if (!acc[sector]) acc[sector] = {};
      if (!acc[sector][projectName]) acc[sector][projectName] = { entries: [] };
      acc[sector][projectName].entries.push(project);
      return acc;
    }, {});
  }, [filteredData, t]);

  const toggleSector = (sectorName) => {
    setExpandedSectors((prev) => ({
      ...prev,
      [sectorName]: !prev[sectorName],
    }));
  };

  const allRows = useMemo(() => {
    const rows = [];
    let projectCounter = 1;

    Object.entries(groupedData || {}).forEach(([sectorName, projects]) => {
      const isExpanded = expandedSectors[sectorName] !== false;

      rows.push({
        type: "sector",
        sectorName,
        projectCount: Object.keys(projects).length,
        isExpanded,
      });

      if (isExpanded) {
        Object.entries(projects || {}).forEach(([projectName, projectData]) => {
          const projectList = Array.isArray(projectData.entries)
            ? projectData.entries
            : [projectData];
          const rowSpan = projectList.length;

          const commonValues = {
            start_year: projectList[0]?.start_year || " ",
            zone: projectList[0]?.zone || " ",
            woreda: projectList[0]?.woreda || " ",
            prj_location_description:
              projectList[0]?.prj_location_description || " ",
            end_year: projectList[0]?.end_year || " ",
            cni_name: projectList[0]?.cni_name || " ",
            beneficiery: projectList[0]?.beneficiery || " ",
            prj_total_estimate_budget:
              projectList[0]?.prj_total_estimate_budget || " ",
            prj_measured_figure: projectList[0]?.prj_measured_figure || " ",
            prj_measurement_unit: projectList[0]?.prj_measurement_unit || " ",
            rowSpan,
          };

          projectList.forEach((proj, index) => {
            rows.push({
              type: "project",
              ...proj,
              projectSN: index === 0 ? projectCounter : null,
              showMergedCells: index === 0,
              commonValues,
              sectorName,
              projectName,
            });
          });

          projectCounter++;
        });
      }
    });

    return rows;
  }, [groupedData, expandedSectors, t]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = allRows.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(allRows.length / rowsPerPage);

  const uniqueProjectNamesCount = useMemo(() => {
    const projectNames = new Set();
    currentRows.forEach((row) => {
      if (row.type === "project" && row.showMergedCells) {
        projectNames.add(row.projectName);
      }
    });
    return projectNames.size;
  }, [currentRows]);

  const totalUniqueProjectNames = useMemo(() => {
    const projectNames = new Set();
    Object.values(groupedData || {}).forEach((projects) => {
      Object.keys(projects || {}).forEach((projectName) => {
        projectNames.add(projectName);
      });
    });
    return projectNames.size;
  }, [groupedData]);

  const exportData = useMemo(() => {
    const exportRows = [];
    let projectCounter = 1;

    // Filter columns to include only visible ones for export
    const visibleColumns = columnsConfig.filter(
      (col) => !hiddenColumns.includes(col.id),
    );
    const headerMapping = visibleColumns.reduce((acc, col) => {
      acc[col.id] = col.label;
      return acc;
    }, {});

    Object.entries(groupedData || {}).forEach(([sectorName, projects]) => {
      Object.entries(projects || {}).forEach(([projectName, projectData]) => {
        const projectList = Array.isArray(projectData.entries)
          ? projectData.entries
          : [projectData];

        projectList.forEach((proj, index) => {
          const rowToExport = {};
          visibleColumns.forEach((col) => {
            let value;
            if (col.id === "projectSN") {
              value = index === 0 ? projectCounter : "";
            } else if (col.id === "sector") {
              value = sectorName;
            } else if (col.id === "prj_name") {
              value = projectName || t("Unnamed Project");
            } else if (
              [
                "beneficiery",
                "prj_total_estimate_budget",
                "prp_budget_baseline",
                "bdr_released_amount",
              ].includes(col.id)
            ) {
              value = Number(proj[col.id])?.toLocaleString() || "";
            } else {
              value = proj[col.id] || "";
            }
            rowToExport[headerMapping[col.id]] = value; // Use the label as the key for export
          });
          exportRows.push(rowToExport);
        });

        projectCounter++;
      });
    });

    return exportRows;
  }, [groupedData, t, hiddenColumns, columnsConfig]); // Added hiddenColumns and columnsConfig as dependencies

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (tableRef.current) {
      columnsConfig.forEach((col) => {
        const cells = tableRef.current.querySelectorAll(
          `th[data-column="${col.id}"], td[data-column="${col.id}"]`,
        );
        cells.forEach((cell) => {
          cell.style.display = hiddenColumns.includes(col.id) ? "none" : "";
          if (columnWidths[col.id]) {
            cell.style.minWidth = `${columnWidths[col.id]}px`;
            cell.style.width = `${columnWidths[col.id]}px`;
          }
        });
      });
    }
  }, [hiddenColumns, columnsConfig, columnWidths]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const startResizing = (columnId, e) => {
    setIsResizing(true);
    setResizingColumn(columnId);
    setStartX(e.clientX);

    const headerCells = headerRowRef.current.querySelectorAll("th");
    let currentWidth = 0;
    headerCells.forEach((cell) => {
      if (cell.dataset.column === columnId) {
        currentWidth = cell.offsetWidth;
      }
    });
    setStartWidth(currentWidth);

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const resizeColumn = (e) => {
    if (isResizing && resizingColumn) {
      const width = startWidth + (e.clientX - startX);
      const minWidth =
        columnsConfig.find((col) => col.id === resizingColumn)?.minWidth || 50;

      if (width >= minWidth) {
        setColumnWidths((prev) => ({
          ...prev,
          [resizingColumn]: width,
        }));
      }
    }
  };

  const stopResizing = () => {
    if (isResizing) {
      setIsResizing(false);
      setResizingColumn(null);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", resizeColumn);
    document.addEventListener("mouseup", stopResizing);

    return () => {
      document.removeEventListener("mousemove", resizeColumn);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resizingColumn, startX, startWidth]);

  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <li
            key={i}
            className={`page-item ${currentPage === i ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => paginate(i)}>
              {i}
            </button>
          </li>,
        );
      }
    } else {
      let startPage, endPage;

      if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + Math.floor(maxVisiblePages / 2) >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - Math.floor(maxVisiblePages / 2);
        endPage = currentPage + Math.floor(maxVisiblePages / 2);
      }

      if (startPage > 1) {
        items.push(
          <li key={1} className="page-item">
            <button className="page-link" onClick={() => paginate(1)}>
              1
            </button>
          </li>,
        );
        if (startPage > 2) {
          items.push(
            <li key="ellipsis-start" className="page-item disabled">
              <span className="page-link">...</span>
            </li>,
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <li
            key={i}
            className={`page-item ${currentPage === i ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => paginate(i)}>
              {i}
            </button>
          </li>,
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          items.push(
            <li key="ellipsis-end" className="page-item disabled">
              <span className="page-link">...</span>
            </li>,
          );
        }
        items.push(
          <li key={totalPages} className="page-item">
            <button className="page-link" onClick={() => paginate(totalPages)}>
              {totalPages}
            </button>
          </li>,
        );
      }
    }

    return items;
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Card className="mb-3">
        <CardBody className="d-flex justify-content-between align-items-center">
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <Input
              type="text"
              placeholder={t("Search...")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control"
              style={{ paddingLeft: "35px" }}
            />
            <FaSearch
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6c757d",
                fontSize: "1rem",
              }}
            />
          </div>

          <div className="d-flex align-items-center">
            <ExportToExcel
              tableData={exportData}
              tableName="FinancialProjectsTable"
            />
            <Dropdown
              isOpen={dropdownOpen}
              toggle={toggleDropdown}
              className="ms-2"
            >
              <DropdownToggle
                tag={Button}
                color="secondary"
                className="btn btn-soft-primary mb-2"
                style={{
                  padding: "0.375rem 0.75rem",
                  fontSize: "0.875rem",
                }}
              >
                <FaColumns className="me-1" />
                {t("Columns")}
              </DropdownToggle>
              <DropdownMenu
                end
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                <DropdownItem header>{t("Toggle Columns")}</DropdownItem>
                {columnsConfig.map((col) => (
                  <DropdownItem
                    key={col.id}
                    onClick={() => toggleColumn(col.id)}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span>{col.label}</span>
                    {hiddenColumns.includes(col.id) ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardBody>
      </Card>

      <div
        style={{
          overflowX: "auto",
          width: "100%",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}
      >
        <style>{`
          table {
            border-collapse: collapse !important;
            border: 1px solid #000 !important;
          }

          thead, tbody, tr, th, td {
            border: 2px solid #000 !important;
          }

          .no-project-name {
            background-color: rgba(255, 193, 7, 0.05);
            border-left: 1px solid #ffc107 !important;
            border-right: 1px solid #ffc107 !important;
          }
          .no-project-name td:first-child {
            border-left: 1px solid #ffc107 !important;
          }
          .no-project-name td:last-child {
            border-right: 1px solid #ffc107 !important;
          }
          .resize-handle {
            position: absolute;
            top: 0;
            right: 0;
            width: 2px;
            height: 100%;
            background: rgba(0, 0, 0, 0.1);
            cursor: col-resize;
          }
          .resize-handle:hover {
            background: rgba(0, 0, 0, 0.3);
          }
          th {
            position: relative;
            background-color: #f8f9fa !important;
          }
          .sticky-column {
            position: sticky;
            left: 0;
            z-index: 1;
            background-color: white !important;
          }
          .sticky-header {
            position: sticky;
            left: 0;
            z-index: 2;
            background-color: #f8f9fa !important;
          }
          .sector-row {
            background-color: #e8f4f0 !important;
            cursor: pointer;
            font-weight: bold;
            position: sticky;
            left: 0;
            z-index: 1;
          }
          .sector-row td {
            position: sticky;
            left: 0;
            background-color: #e8f4f0 !important;
          }
          .sector-row:hover {
            background-color: #d4e8e0 !important;
          }
          .sector-toggle {
            margin-right: 8px;
            transition: transform 0.2s;
          }
          .sector-collapsed .sector-toggle {
            transform: rotate(-90deg);
          }
          .sticky-column:nth-child(1) { left: 0; }
          .sticky-column:nth-child(2) { left: 50px; }
          .sticky-column:nth-child(3) { left: 150px; }
          .sticky-header:nth-child(1) { left: 0; }
          .sticky-header:nth-child(2) { left: 50px; }
          .sticky-header:nth-child(3) { left: 150px; }
        `}</style>

        <table
          id="financial-projects-table"
          ref={tableRef}
          className={`table ${tableClass}`}
          style={{ width: "100%", fontSize: "0.85rem", minWidth: "1000px" }}
        >
          <thead
            className={theadClass}
            style={{ position: "sticky", top: 0, zIndex: 3 }}
          >
            <tr ref={headerRowRef}>
              <th
                data-column="projectSN"
                rowSpan="2"
                className="sticky-header"
                style={{ left: 0 }}
              >
                {t("SN")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("projectSN", e)}
                ></div>
              </th>
              <th
                data-column="prj_code"
                rowSpan="2"
                className="sticky-header"
                style={{ left: 50 }}
              >
                {t("Project Code")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("prj_code", e)}
                ></div>
              </th>
              <th
                data-column="prj_name"
                rowSpan="2"
                className="sticky-header"
                style={{ left: 150 }}
              >
                {t("Project Name")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("prj_name", e)}
                ></div>
              </th>
              <th data-column="prj_measurement_unit" rowSpan="2">
                {t("Unit")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("prj_measurement_unit", e)}
                ></div>
              </th>
              <th data-column="weight" rowSpan="2">
                {t("Weight")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("weight", e)}
                ></div>
              </th>
              <th data-column="zone" colSpan="3">
                {t("prj_location")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("zone", e)}
                ></div>
              </th>
              <th data-column="start_year" colSpan="2">
                {t("prj_implementation_year")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("start_year", e)}
                ></div>
              </th>
              <th data-column="budgetyear" colSpan="9">
                {t("")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("budgetyear", e)}
                ></div>
              </th>
            </tr>
            <tr>
              <th data-column="zone">
                {t("Location Zone")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("zone", e)}
                ></div>
              </th>
              <th data-column="woreda">
                {t("Location Woreda")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("woreda", e)}
                ></div>
              </th>
              <th data-column="prj_location_description">
                {t("Specific Site")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) =>
                    startResizing("prj_location_description", e)
                  }
                ></div>
              </th>
              <th data-column="start_year">
                {t("Start Year")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("start_year", e)}
                ></div>
              </th>
              <th data-column="end_year">
                {t("End Year")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("end_year", e)}
                ></div>
              </th>
              <th data-column="cni_name">
                {t("Contractor")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("cni_name", e)}
                ></div>
              </th>
              <th data-column="beneficiery">
                {t("Beneficiaries")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("beneficiery", e)}
                ></div>
              </th>
              <th data-column="prj_measured_figure">
                {t("Measured Figure")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("prj_measured_figure", e)}
                ></div>
              </th>
              <th data-column="budgetyear">
                {t("Budget Year")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("budgetyear", e)}
                ></div>
              </th>
              <th data-column="prp_physical_performance">
                {t("Physical Performance")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) =>
                    startResizing("prp_physical_performance", e)
                  }
                ></div>
              </th>
              <th data-column="prp_physical_planned">
                {t("Physical Planned")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("prp_physical_planned", e)}
                ></div>
              </th>
              <th data-column="prj_total_estimate_budget">
                {t("Total Budget")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) =>
                    startResizing("prj_total_estimate_budget", e)
                  }
                ></div>
              </th>
              <th data-column="prp_budget_baseline">
                {t("Budget Baseline")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("prp_budget_baseline", e)}
                ></div>
              </th>
              <th data-column="bdr_released_amount">
                {t("Released Amount")}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => startResizing("bdr_released_amount", e)}
                ></div>
              </th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => {
                if (row.type === "sector") {
                  const isExpanded = row.isExpanded;
                  return (
                    <tr
                      key={`sector-${row.sectorName}`}
                      className={`sector-row ${isExpanded ? "" : "sector-collapsed"}`}
                      onClick={() => toggleSector(row.sectorName)}
                    >
                      <td
                        colSpan={columnsConfig.length}
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          background: "#e8f4f0",
                        }}
                      >
                        <span className="sector-toggle">
                          {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                        </span>
                        {row.sectorName} ({row.projectCount} {t("projects")})
                      </td>
                    </tr>
                  );
                }

                const hasNoProjectName =
                  !row.prj_name || row.prj_name.trim() === "";

                return (
                  <tr
                    key={row.id || index}
                    className={hasNoProjectName ? "no-project-name" : ""}
                    style={{ textAlign: "center" }}
                  >
                    {row.showMergedCells && (
                      <>
                        <td
                          data-column="projectSN"
                          rowSpan={row.commonValues.rowSpan}
                          className="sticky-column"
                          style={{ left: 0 }}
                        >
                          {row.projectSN}
                        </td>
                        <td
                          data-column="prj_code"
                          rowSpan={row.commonValues.rowSpan}
                          className="sticky-column"
                          style={{ left: 50 }}
                        >
                          <b>{row.prj_code}</b>
                        </td>
                        <td
                          data-column="prj_name"
                          rowSpan={row.commonValues.rowSpan}
                          className="sticky-column"
                          style={{ left: 150 }}
                        >
                          <b>
                            {row.prj_name || (
                              <span
                                style={{
                                  color: "#6c757d",
                                  fontStyle: "italic",
                                }}
                              >
                                {t("Unnamed Project")}
                              </span>
                            )}
                          </b>
                        </td>
                        <td
                          data-column="prj_measurement_unit"
                          rowSpan={row.commonValues.rowSpan}
                        >
                          {row.commonValues.prj_measurement_unit}
                        </td>
                        <td
                          data-column="weight"
                          rowSpan={row.commonValues.rowSpan}
                        ></td>
                        <td
                          data-column="zone"
                          rowSpan={row.commonValues.rowSpan}
                        >
                          {row.commonValues.zone}
                        </td>
                        <td
                          data-column="woreda"
                          rowSpan={row.commonValues.rowSpan}
                        >
                          {row.commonValues.woreda}
                        </td>
                        <td
                          data-column="prj_location_description"
                          rowSpan={row.commonValues.rowSpan}
                        >
                          {row.commonValues.prj_location_description}
                        </td>
                        <td
                          data-column="start_year"
                          rowSpan={row.commonValues.rowSpan}
                        >
                          {row.commonValues.start_year}
                        </td>
                        <td
                          data-column="end_year"
                          rowSpan={row.commonValues.rowSpan}
                        >
                          {row.commonValues.end_year}
                        </td>
                        <td
                          data-column="cni_name"
                          rowSpan={row.commonValues.rowSpan}
                        >
                          {row.commonValues.cni_name}
                        </td>
                        <td
                          data-column="beneficiery"
                          rowSpan={row.commonValues.rowSpan}
                        >
                          {Number(
                            row.commonValues.beneficiery,
                          )?.toLocaleString() || ""}
                        </td>
                        <td
                          data-column="prj_measured_figure"
                          rowSpan={row.commonValues.rowSpan}
                        >
                          {row.commonValues.prj_measured_figure}
                        </td>
                      </>
                    )}
                    <td data-column="budgetyear">{row.budgetyear}</td>
                    <td data-column="prp_physical_performance">
                      {row.prp_physical_performance}
                    </td>
                    <td data-column="prp_physical_planned">
                      {row.prp_physical_planned}
                    </td>
                    <td data-column="prj_total_estimate_budget">
                      {row.showMergedCells
                        ? Number(
                            row.commonValues.prj_total_estimate_budget,
                          )?.toLocaleString()
                        : ""}
                    </td>
                    <td data-column="prp_budget_baseline">
                      {Number(row.prp_budget_baseline)?.toLocaleString() || ""}
                    </td>
                    <td data-column="bdr_released_amount">
                      {Number(row.bdr_released_amount)?.toLocaleString() || ""}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columnsConfig.length}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  {searchTerm
                    ? t("No projects match your search criteria.")
                    : t("No projects available.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalUniqueProjectNames > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted small">
            <h6>
              {t("Showing")} {uniqueProjectNamesCount} {t("of")}{" "}
              {totalUniqueProjectNames} {t("projects")}
            </h6>
          </div>

          <div className="d-flex align-items-center ms-auto">
            <nav aria-label="Table pagination">
              <ul className="pagination mb-0" style={{ fontSize: "1rem" }}>
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                    style={{ padding: "0.5rem 0.75rem" }}
                  >
                    &laquo;
                  </button>
                </li>
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ padding: "0.5rem 0.75rem" }}
                  >
                    &lsaquo;
                  </button>
                </li>

                {getPaginationItems()}

                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ padding: "0.5rem 0.75rem" }}
                  >
                    &rsaquo;
                  </button>
                </li>
                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                    style={{ padding: "0.5rem 0.75rem" }}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>

            <div className="ms-3 position-relative" style={{ width: "80px" }}>
              <select
                className="form-control form-control-sm"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  appearance: "none",
                  background: "transparent",
                  paddingRight: "25px",
                  width: "100%",
                }}
              >
                {[50, 100, 200, 300, 500].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                <option value={-1}>{t("All")}</option>
              </select>
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  pointerEvents: "none",
                  transform: "translateY(-50%)",
                  fontSize: "1rem",
                }}
              >
                ▼
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialProjectsTable;
