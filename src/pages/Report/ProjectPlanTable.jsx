import React, { useState, useMemo, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardBody, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from "reactstrap";
import { FaSearch, FaEye, FaEyeSlash, FaColumns, FaChevronDown, FaChevronRight } from "react-icons/fa";
import ExportToExcel from "../../components/Common/ExportToExcel";

const ProjectFinancialPerformanceTable = ({
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

  const columnsConfig = useMemo(() => [
    { id: "projectSN", label: t("SN"), visible: true, minWidth: 100, sticky: true },
    { id: "prj_name", label: t("prj_name"), visible: true, minWidth: 150, sticky: true },
    { id: "pct_name_or", label: t("Action"), visible: true, minWidth: 150, sticky: true },
    { id: "kpi_unit_measurement", label: t("prj_measurement_unit"), visible: true, minWidth: 120 },
    { id: "kpi_name_or", label: t("KPI"), visible: true, minWidth: 120 },
    { id: "budgetyear", label: t("prp_budget_year_id"), visible: true, minWidth: 40 },
    { id: "totalplan", label: t("Plan"), visible: true, minWidth: 80 },
    { id: "kpr_planned_month_1", label: t("Sep"), visible: true, minWidth: 60 },
    { id: "kpr_planned_month_2", label: t("Oct"), visible: true, minWidth: 60 },
    { id: "kpr_planned_month_3", label: t("Nov"), visible: true, minWidth: 60 },
    { id: "quarter1total", label: t("Sum"), visible: true, minWidth: 60 },
    { id: "kpr_planned_month_4", label: t("Dec"), visible: true, minWidth: 60 },
    { id: "kpr_planned_month_5", label: t("Jan"), visible: true, minWidth: 60 },
    { id: "kpr_planned_month_6", label: t("Feb"), visible: true, minWidth: 60 },
    { id: "quarter2total", label: t("Sum"), visible: true, minWidth: 60 },
    { id: "kpr_planned_month_7", label: t("Mar"), visible: true, minWidth: 60 },
    { id: "kpr_planned_month_8", label: t("Apr"), visible: true, minWidth: 60 },
    { id: "kpr_planned_month_9", label: t("May"), visible: true, minWidth: 60 },
    { id: "quarter3total", label: t("Sum"), visible: true, minWidth: 60 },
    { id: "kpr_planned_month_10", label: t("Jun"), visible: true, minWidth: 60 },
    { id: "kpr_planned_month_11", label: t("Jul"), visible: true, minWidth: 60 },
    { id: "kpr_planned_month_12", label: t("Aug"), visible: true, minWidth: 60 },
    { id: "quarter4total", label: t("Sum"), visible: true, minWidth: 60 },
    { id: "kpr_description", label: t("kpr_description"), visible: true, minWidth: 150 },
  ], [t]);

  useEffect(() => {
    const initialWidths = {};
    columnsConfig.forEach(col => {
      initialWidths[col.id] = col.minWidth;
    });
    setColumnWidths(initialWidths);
  }, [columnsConfig]);

  const toggleColumn = (columnId) => {
    setHiddenColumns(prev =>
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const toggleSector = (sectorName) => {
    setExpandedSectors(prev => ({
      ...prev,
      [sectorName]: !prev[sectorName]
    }));
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((project) =>
      (project.sectorcategory && project.sectorcategory.toLowerCase().includes(lowerSearchTerm)) ||
      (project.prj_name && project.prj_name.toLowerCase().includes(lowerSearchTerm)) ||
      (project.pct_name_or && project.pct_name_or.toLowerCase().includes(lowerSearchTerm))
    );
  }, [data, searchTerm]);

  const groupedData = useMemo(() => {
    if (!filteredData) return {};
    return filteredData.reduce((acc, project) => {
      const sectorcategory = project.sectorcategory || t("---");
      const projectKey = `${project.prj_name}`;
      const pctKey = `${project.pct_name_or}`;
      
      if (!acc[sectorcategory]) acc[sectorcategory] = {};
      if (!acc[sectorcategory][projectKey]) acc[sectorcategory][projectKey] = {};
      if (!acc[sectorcategory][projectKey][pctKey]) acc[sectorcategory][projectKey][pctKey] = { entries: [] };
      
      acc[sectorcategory][projectKey][pctKey].entries.push(project);
      return acc;
    }, {});
  }, [filteredData, t]);

  const allRows = useMemo(() => {
    const rows = [];
    let projectCounter = 1;
    let pctCounter = 1;

    Object.entries(groupedData || {}).forEach(([sectorcategoryName, projects]) => {
      const isExpanded = expandedSectors[sectorcategoryName] !== false;

      rows.push({
        type: "sectorcategory",
        sectorcategoryName,
        isExpanded
      });

      if (isExpanded) {
        Object.entries(projects || {}).forEach(([projectKey, pcts]) => {
          const projectEntries = Object.values(pcts).flatMap(pct => pct.entries);
          const projectRowSpan = projectEntries.length;

          const projectCommonValues = {
            prj_name: projectEntries[0]?.prj_name || " ",
            rowSpan: projectRowSpan,
          };

          Object.entries(pcts || {}).forEach(([pctKey, pctData]) => {
            const pctList = Array.isArray(pctData.entries) ? pctData.entries : [pctData];
            const pctRowSpan = pctList.length;

            const pctCommonValues = {
              pct_name_or: pctList[0]?.pct_name_or || " ",
              rowSpan: pctRowSpan,
            };

            pctList.forEach((proj, index) => {
              rows.push({
                type: "project",
                ...proj,
                projectSN: index === 0 ? projectCounter : null,
                pctSN: index === 0 ? pctCounter : null,
                showProjectCells: index === 0,
                showPctCells: index === 0,
                projectCommonValues,
                pctCommonValues,
                sectorcategoryName,
              });
            });

            pctCounter++;
          });

          projectCounter++;
        });
      }
    });

    return rows;
  }, [groupedData, expandedSectors, t]);

  const getPaginatedRows = () => {
     if (rowsPerPage === -1) {
    return allRows;
      }
    const rows = [];
    let currentIndex = 0;
    let pageStart = (currentPage - 1) * rowsPerPage;
    let pageEnd = pageStart + rowsPerPage;
    let count = 0;

    const addSectorcategoryRow = (row) => {
      if (count >= pageStart && count < pageEnd) {
        rows.push({ ...row, isSectorcategory: true });
      }
      count++;
    };

    const addProjectRows = (projectRows) => {
      let added = 0;
      for (const row of projectRows) {
        if (count >= pageStart && count < pageEnd) {
          rows.push(row);
          added++;
        }
        count++;
      }
      return added;
    };

    const groupedBySector = {};
    allRows.forEach(row => {
      if (row.type === "sectorcategory") {
        groupedBySector[row.sectorcategoryName] = [];
      } else {
        const sector = row.sectorcategoryName;
        if (!groupedBySector[sector]) groupedBySector[sector] = [];
        groupedBySector[sector].push(row);
      }
    });

    for (const [sector, projectRows] of Object.entries(groupedBySector)) {
      addSectorcategoryRow({
        type: "sectorcategory",
        sectorcategoryName: sector,
      });

      const added = addProjectRows(projectRows);

      if (added === 0 && rows.length > 0 && rows[rows.length - 1].isSectorcategory) {
        rows.pop();
        count--;
      }
    }

    return rows;
  };

  const currentRows = getPaginatedRows();
  const totalPages = Math.ceil(allRows.length / rowsPerPage);

  const uniqueProjectNamesCount = useMemo(() => {
    const projectNames = new Set();
    currentRows.forEach(row => {
      if (row.type === "project" && row.showProjectCells) {
        projectNames.add(row.projectCommonValues.prj_name);
      }
    });
    return projectNames.size;
  }, [currentRows]);

  const totalUniqueProjectNames = useMemo(() => {
    const projectNames = new Set();
    Object.values(groupedData || {}).forEach(projects => {
      Object.keys(projects || {}).forEach(projectKey => {
        projectNames.add(projectKey);
      });
    });
    return projectNames.size;
  }, [groupedData]);

  const exportData = useMemo(() => {
    const exportRows = [];
    let projectCounter = 1;
    let pctCounter = 1;

    const visibleColumns = columnsConfig.filter(col => !hiddenColumns.includes(col.id));
    const headerMapping = visibleColumns.reduce((acc, col) => {
      acc[col.id] = col.label;
      return acc;
    }, {});

    Object.entries(groupedData || {}).forEach(([sectorcategoryName, projects]) => {
      Object.entries(projects || {}).forEach(([projectKey, pcts]) => {
        Object.entries(pcts || {}).forEach(([pctKey, pctData]) => {
          const pctList = Array.isArray(pctData.entries) ? pctData.entries : [pctData];

          pctList.forEach((proj, index) => {
            const rowToExport = {};
            visibleColumns.forEach(col => {
              let value;
              if (col.id === "projectSN") {
                value = index === 0 ? projectCounter : '';
              } else if (col.id === "sectorcategory") {
                value = sectorcategoryName;
              } else if (col.id === "prj_name") {
                value = proj.prj_name || t("Unnamed Project");
              } else if (col.id === "pct_name_or") {
                value = proj.pct_name_or || t("Unnamed PCT");
              } else if (["totalplan", "quarter1total", "quarter2total", "quarter3total", "quarter4total"].includes(col.id) || 
                         col.id.startsWith("kpr_planned_month_")) {
                value = Number(proj[col.id])?.toLocaleString() || '';
              } else {
                value = proj[col.id] || '';
              }
              rowToExport[headerMapping[col.id]] = value;
            });
            exportRows.push(rowToExport);
          });

          pctCounter++;
        });
        projectCounter++;
      });
    });

    return exportRows;
  }, [groupedData, t, hiddenColumns, columnsConfig]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (tableRef.current) {
      columnsConfig.forEach(col => {
        const cells = tableRef.current.querySelectorAll(`th[data-column="${col.id}"], td[data-column="${col.id}"]`);
        cells.forEach(cell => {
          cell.style.display = hiddenColumns.includes(col.id) ? 'none' : '';
          if (columnWidths[col.id]) {
            cell.style.minWidth = `${columnWidths[col.id]}px`;
            cell.style.width = `${columnWidths[col.id]}px`;
          }
        });
      });
    }
  }, [hiddenColumns, columnsConfig, columnWidths]);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const startResizing = (columnId, e) => {
    setIsResizing(true);
    setResizingColumn(columnId);
    setStartX(e.clientX);

    const headerCells = headerRowRef.current.querySelectorAll('th');
    let currentWidth = 0;
    headerCells.forEach(cell => {
      if (cell.dataset.column === columnId) {
        currentWidth = cell.offsetWidth;
      }
    });
    setStartWidth(currentWidth);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const resizeColumn = (e) => {
    if (isResizing && resizingColumn) {
      const width = startWidth + (e.clientX - startX);
      const minWidth = columnsConfig.find(col => col.id === resizingColumn)?.minWidth || 50;

      if (width >= minWidth) {
        setColumnWidths(prev => ({
          ...prev,
          [resizingColumn]: width
        }));
      }
    }
  };

  const stopResizing = () => {
    if (isResizing) {
      setIsResizing(false);
      setResizingColumn(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', resizeColumn);
    document.addEventListener('mouseup', stopResizing);

    return () => {
      document.removeEventListener('mousemove', resizeColumn);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resizingColumn, startX, startWidth]);

  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
            <button className="page-link" onClick={() => paginate(i)}>{i}</button>
          </li>
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
            <button className="page-link" onClick={() => paginate(1)}>1</button>
          </li>
        );
        if (startPage > 2) {
          items.push(
            <li key="ellipsis-start" className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
            <button className="page-link" onClick={() => paginate(i)}>{i}</button>
          </li>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          items.push(
            <li key="ellipsis-end" className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          );
        }
        items.push(
          <li key={totalPages} className="page-item">
            <button className="page-link" onClick={() => paginate(totalPages)}>{totalPages}</button>
          </li>
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
              data={exportData}
              tableId="project-plan-table"
              filename="ProjectFinancialPerformanceTable"
              buttonText={t("Export to Excel")}
              buttonClassName="btn btn-soft-primary mb-2 me-2"
            />

            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="ms-2">
              <DropdownToggle
                tag={Button}
                color="secondary"
                className="btn btn-soft-primary mb-2"
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.875rem',
                }}
              >
                <FaColumns className="me-1" />
                {t("Columns")}
              </DropdownToggle>
              <DropdownMenu end style={{ maxHeight: "300px", overflowY: "auto" }}>
                <DropdownItem header>{t("Toggle Columns")}</DropdownItem>
                {columnsConfig.map(col => (
                  <DropdownItem
                    key={col.id}
                    onClick={() => toggleColumn(col.id)}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span>{col.label}</span>
                    {hiddenColumns.includes(col.id) ? <FaEyeSlash /> : <FaEye />}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardBody>
      </Card>

      <div style={{ overflowX: "auto", width: "100%", borderRadius: "4px", marginBottom: "1rem" }}>
        <style>{`
          table {
            border-collapse: collapse !important;
            border: 1px solid #000 !important;
          }

          thead, tbody, tr, th, td {
            border: 1px solid #000 !important;
          }
          td, th {
            padding: 8px 12px !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
          .sticky-column:nth-child(3) { left: 250; }

          .sticky-header:nth-child(1) { left: 0; }
          .sticky-header:nth-child(2) { left: 50px; }
          .sticky-header:nth-child(3) { left: 200px; }
        `}</style>

        <table
          id="project-plan-table"
          ref={tableRef}
          className={`table ${tableClass}`}
          style={{ width: "100%", fontSize: "0.85rem", minWidth: "1000px" }}
        >
         <thead className={theadClass} style={{ position: "sticky", top: 0, zIndex: 3 }}>
  <tr ref={headerRowRef}>
    <th colSpan="7"></th>
    <th colSpan="16">{t("Plan")}</th>
    <th colSpan="1"></th>
  </tr>
  <tr>
    <th
      data-column="projectSN"
      rowSpan="2"
      className="sticky-header"
      style={{ left: 0 }}
    >
      {t("SN")}
      <div className="resize-handle" onMouseDown={(e) => startResizing("projectSN", e)}></div>
    </th>
    <th
      data-column="prj_name"
      rowSpan="2"
      className="sticky-header"
      style={{ left: 50 }}
    >
      {t("prj_name")}
      <div className="resize-handle" onMouseDown={(e) => startResizing("prj_name", e)}></div>
    </th>
    <th
      data-column="pct_name_or"
      rowSpan="2"
      className="sticky-header"
      style={{ left: 200 }}
    >
      {t("Action")}
      <div className="resize-handle" onMouseDown={(e) => startResizing("pct_name_or", e)}></div>
    </th>
    <th data-column="kpi_unit_measurement" rowSpan="2">
      {t("prj_measurement_unit")}
      <div className="resize-handle" onMouseDown={(e) => startResizing("kpi_unit_measurement", e)}></div>
    </th>
    <th data-column="kpi_name_or" rowSpan="2">
      {t("KPI")}
      <div className="resize-handle" onMouseDown={(e) => startResizing("kpi_name_or", e)}></div>
    </th>
    <th data-column="budgetyear" rowSpan="2">
      {t("prp_budget_year_id")}
      <div className="resize-handle" onMouseDown={(e) => startResizing("budgetyear", e)}></div>
    </th>
    <th data-column="totalplan" rowSpan="2">
      {t("Plan")}
      <div className="resize-handle" onMouseDown={(e) => startResizing("totalplan", e)}></div>
    </th>
    <th data-column="kpr_planned_month_1" colSpan="4">
      {t("Q1")}
      <div className="resize-handle" onMouseDown={(e) => startResizing("kpr_planned_month_1", e)}></div>
    </th>
    <th data-column="kpr_planned_month_4" colSpan="4">
      {t("Q2")}
      <div className="resize-handle" onMouseDown={(e) => startResizing("kpr_planned_month_4", e)}></div>
    </th>
    <th data-column="kpr_planned_month_7" colSpan="4">
      {t("Q3")}
      <div className="resize-handle" onMouseDown={(e) => startResizing("kpr_planned_month_7", e)}></div>
    </th>
    <th data-column="kpr_planned_month_10" colSpan="4">
      {t("Q4")}
      <div className="resize-handle" onMouseDown={(e) => startResizing("kpr_planned_month_10", e)}></div>
    </th>
    <th data-column="kpr_description" rowSpan="2">
      {t("kpr_description")}
      <div className="resize-handle" onMouseDown={(e) => startResizing("kpr_description", e)}></div>
    </th>
  </tr>
  <tr>
    <th data-column="kpr_planned_month_1">{t("Sep")}</th>
    <th data-column="kpr_planned_month_2">{t("Oct")}</th>
    <th data-column="kpr_planned_month_3">{t("Nov")}</th>
    <th data-column="quarter1total">{t("Sum")}</th>
    <th data-column="kpr_planned_month_4">{t("Dec")}</th>
    <th data-column="kpr_planned_month_5">{t("Jan")}</th>
    <th data-column="kpr_planned_month_6">{t("Feb")}</th>
    <th data-column="quarter2total">{t("Sum")}</th>
    <th data-column="kpr_planned_month_7">{t("Mar")}</th>
    <th data-column="kpr_planned_month_8">{t("Apr")}</th>
    <th data-column="kpr_planned_month_9">{t("May")}</th>
    <th data-column="quarter3total">{t("Sum")}</th>
    <th data-column="kpr_planned_month_10">{t("Jun")}</th>
    <th data-column="kpr_planned_month_11">{t("Jul")}</th>
    <th data-column="kpr_planned_month_12">{t("Aug")}</th>
    <th data-column="quarter4total">{t("Sum")}</th>
  </tr>
</thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => {
                if (row.type === "sectorcategory") {
                  const isExpanded = row.isExpanded;
                  return (
                    <tr
                      key={`sectorcategory-${row.sectorcategoryName}-${index}`}
                      className={`sector-row ${isExpanded ? '' : 'sector-collapsed'}`}
                      onClick={() => toggleSector(row.sectorcategoryName)}
                    >
                      <td
                        colSpan={columnsConfig.length}
                        style={{
                          position: 'sticky',
                          left: 0,
                          zIndex: 1,
                          background: '#e8f4f0'
                        }}
                      >
                        <span className="sector-toggle">
                          {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                        </span>
                        {row.sectorcategoryName}
                      </td>
                    </tr>
                  );
                }

                const hasNoProjectName = !row.prj_name || row.prj_name.trim() === "";
                const hasNoPctName = !row.pct_name_or || row.pct_name_or.trim() === "";

                return (
                  <tr 
                    key={row.id || index} 
                    className={`${hasNoProjectName ? "no-project-name" : ""} ${hasNoPctName ? "no-pct-name" : ""}`} 
                    style={{ textAlign: "center" }}
                  >
                    {row.showProjectCells && (
                      <>
                        <td
                          data-column="projectSN"
                          rowSpan={row.projectCommonValues.rowSpan}
                          className="sticky-column"
                          style={{ left: 0 }}
                        >
                          {row.projectSN}
                        </td>
                        <td
                          data-column="prj_name"
                          rowSpan={row.projectCommonValues.rowSpan}
                          className="sticky-column"
                          style={{ left: 50 }}
                        >
                          <b>
                            {row.projectCommonValues.prj_name || (
                              <span style={{ color: "#6c757d", fontStyle: "italic" }}>{t("Unnamed Project")}</span>
                            )}
                          </b>
                        </td>
                      </>
                    )}
                    {row.showPctCells && (
                      <td
                        data-column="pct_name_or"
                        rowSpan={row.pctCommonValues.rowSpan}
                        className="sticky-column"
                        style={{ left: 200 }}
                      >
                        <b>
                          {row.pctCommonValues.pct_name_or || (
                            <span style={{ color: "#6c757d", fontStyle: "italic" }}>{t("Unnamed PCT")}</span>
                          )}
                        </b>
                      </td>
                    )}
                    <td data-column="kpi_unit_measurement">{row.kpi_unit_measurement}</td>
                    <td data-column="kpi_name_or">{row.kpi_name_or}</td>
                    <td data-column="budgetyear">{row.budgetyear}</td>
                    <td data-column="totalplan"><strong>{Number(row.totalplan)?.toLocaleString() || " "}</strong></td>
                    <td data-column="kpr_planned_month_1">{Number(row.kpr_planned_month_1)?.toLocaleString() || " "}</td>
                    <td data-column="kpr_planned_month_2">{Number(row.kpr_planned_month_2)?.toLocaleString() || " "}</td>
                    <td data-column="kpr_planned_month_3">{Number(row.kpr_planned_month_3)?.toLocaleString() || " "}</td>
                    <td data-column="quarter1total"><strong>{Number(row.quarter1total)?.toLocaleString() || " "}</strong></td>
                    <td data-column="kpr_planned_month_4">{Number(row.kpr_planned_month_4)?.toLocaleString() || " "}</td>
                    <td data-column="kpr_planned_month_5">{Number(row.kpr_planned_month_5)?.toLocaleString() || " "}</td>
                    <td data-column="kpr_planned_month_6">{Number(row.kpr_planned_month_6)?.toLocaleString() || " "}</td>
                    <td data-column="quarter2total"><strong>{Number(row.quarter2total)?.toLocaleString() || " "}</strong></td>
                    <td data-column="kpr_planned_month_7">{Number(row.kpr_planned_month_7)?.toLocaleString() || " "}</td>
                    <td data-column="kpr_planned_month_8">{Number(row.kpr_planned_month_8)?.toLocaleString() || " "}</td>
                    <td data-column="kpr_planned_month_9">{Number(row.kpr_planned_month_9)?.toLocaleString() || " "}</td>
                    <td data-column="quarter3total"><strong>{Number(row.quarter3total)?.toLocaleString() || " "}</strong></td>
                    <td data-column="kpr_planned_month_10">{Number(row.kpr_planned_month_10)?.toLocaleString() || " "}</td>
                    <td data-column="kpr_planned_month_11">{Number(row.kpr_planned_month_11)?.toLocaleString() || " "}</td>
                    <td data-column="kpr_planned_month_12">{Number(row.kpr_planned_month_12)?.toLocaleString() || " "}</td>
                    <td data-column="quarter4total"><strong>{Number(row.quarter4total)?.toLocaleString() || " "}</strong></td>
                    <td data-column="kpr_description">{row.kpr_description}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columnsConfig.length} style={{ textAlign: "center", padding: "2rem", color: "#6c757d", fontStyle: "italic" }}>
                  {searchTerm
                    ? t("No projects match your search criteria.")
                    : t("No data available. Please select related Address Structure and click Search button.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

       {totalUniqueProjectNames > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted small">
            <h6>{t("Showing")} {uniqueProjectNamesCount} {t("of")} {totalUniqueProjectNames} {t("projects")}</h6>
          </div>

          <div className="d-flex align-items-center ms-auto">
            <nav aria-label="Table pagination">
              <ul className="pagination mb-0" style={{ fontSize: "1rem" }}>
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(1)} disabled={currentPage === 1} style={{ padding: '0.5rem 0.75rem' }}>
                    &laquo;
                  </button>
                </li>
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} style={{ padding: '0.5rem 0.75rem' }}>
                    &lsaquo;
                  </button>
                </li>

                {getPaginationItems()}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: '0.5rem 0.75rem' }}>
                    &rsaquo;
                  </button>
                </li>
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} style={{ padding: '0.5rem 0.75rem' }}>
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
                  appearance: 'none',
                  background: 'transparent',
                  paddingRight: '25px',
                  width: '100%'
                }}
              >
                {[ 50,100,200,300,500].map(option => (
                  <option key={option} value={option}>{option}</option>
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
                  fontSize: "1rem"
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

export default ProjectFinancialPerformanceTable;