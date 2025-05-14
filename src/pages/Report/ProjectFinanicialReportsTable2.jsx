import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardBody, Input } from "reactstrap";
import { FaSearch } from "react-icons/fa";
import ExportToExcel from "../../components/Common/ExportToExcel";

const FinancialProjectsTable = ({
  data = [],
  isGlobalFilter = false,
  isAddButton = false,
  SearchPlaceholder = "",
  buttonClass = "",
  buttonName = "",
  tableClass = "",
  theadClass = "",
  t = (key) => key,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((project) =>
      (project.sector?.toLowerCase().includes(lowerSearchTerm)) ||
      (project.prj_name?.toLowerCase().includes(lowerSearchTerm)) ||
      (project.zone?.toLowerCase().includes(lowerSearchTerm))
    );
  }, [data, searchTerm]);

  const groupedData = useMemo(() => {
    return filteredData?.reduce((acc, project) => {
      const sector = project.sector || t("Other Sector");
      const projectName = project.prj_name || t("Unnamed Project");
      if (!acc[sector]) acc[sector] = {};
      if (!acc[sector][projectName]) acc[sector][projectName] = { entries: [] };
      acc[sector][projectName].entries.push(project);
      return acc;
    }, {});
  }, [filteredData, t]);

  const allRows = useMemo(() => {
    const rows = [];
    let projectCounter = 1;

    Object.entries(groupedData || {}).forEach(([sectorName, projects]) => {
      rows.push({ type: "sector", sectorName });

      Object.entries(projects || {}).forEach(([projectName, projectData]) => {
        const projectList = Array.isArray(projectData.entries) ? projectData.entries : [projectData];
        const rowSpan = projectList.length;

        const commonValues = {
          start_year: projectList[0]?.start_year || " ",
          zone: projectList[0]?.zone || " ",
          woreda: projectList[0]?.woreda || " ",
          prj_location_description: projectList[0]?.prj_location_description || " ",
          end_year: projectList[0]?.end_year || " ",
          cni_name: projectList[0]?.cni_name || " ",
          beneficiery: projectList[0]?.beneficiery || " ",
          prj_total_estimate_budget: projectList[0]?.prj_total_estimate_budget || " ",
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
          });
        });

        projectCounter++;
      });
    });

    return rows;
  }, [groupedData, t]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = allRows.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(allRows.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Card className="mb-3">
        <CardBody>
          <div style={{ position: 'relative' }}>
            <Input
              type="text"
              placeholder={SearchPlaceholder || t("Search...")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control"
              style={{ paddingLeft: '35px' }}
            />
            <FaSearch
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '1rem'
              }}
            />
          </div>
        </CardBody>
      </Card>

      <div style={{ overflowX: "auto", width: "100%", border: "1px solid #dee2e6", borderRadius: "4px", marginBottom: "1rem" }}>
        <style>{`
          table, thead, tbody, tr, th, td { border: 0.01px solid gray; }
          .sector-row {
            background-color: #e8f4f0;
            font-weight: bold;
            font-size: 0.9rem;
          }
          .no-project-name { 
            background-color: rgba(255, 193, 7, 0.05);
            border-left: 3px solid #ffc107;
            border-right: 3px solid #ffc107;
          }
          .no-project-name td:first-child {
            border-left: 3px solid #ffc107;
          }
          .no-project-name td:last-child {
            border-right: 3px solid #ffc107;
          }
        `}</style>
        <ExportToExcel tableId="financial-projects-table" filename="FinancialProjectsTable2" />

         <table id="financial-projects-table" className={`table table-bordered table-hover ${tableClass}`}
         style={{ width: "100%", fontSize: "0.85rem", minWidth: "1000px" }}>

         <thead className={theadClass} style={{ position: "sticky", top: 0, backgroundColor: "#f8f9fa", zIndex: 1 }}>
            <tr>
              <th rowSpan="2">{t("SN")}</th>
              <th rowSpan="2">{t("prj_name")}</th>
              <th rowSpan="2">{t("prj_measurement_unit")}</th>
              <th rowSpan="2">{t("Weight")}</th>
              <th colSpan="3">{t("prj_location")}</th>
              <th colSpan="2">{t("prj_implementation_year")}</th>
              <th colSpan="11">{t("")}</th> 
            </tr>
            <tr>
              <th>{t("prj_location_zone_id")}</th>
              <th>{t("prj_location_woreda_id")}</th>
              <th>{t("prj_location_description")}</th>
              <th>{t("prj_start_year")}</th>
              <th>{t("prj_end_year")}</th>
              <th>{t("cni_name")}</th>
              <th>{t("prj_ben_number")}</th>
              <th>{t("prp_budget_year_id")}</th>
              <th>{t("prp_physical_performance")}</th>
              <th>{t("prp_physical_planned")}</th>
              <th>{t("prj_total_estimate_budget")}</th>
              <th>{t("prp_budget_baseline")}</th>
              <th>{t("prp_total_budget_used")}</th>
              <th>{t("bdr_requested_amount")}</th>
              <th>{t("bdr_released_amount")}</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => {
                if (row.type === "sector") {
                  return (
                    <tr key={`sector-${row.sectorName}`} className="sector-row" style={{ textAlign: "left" }}>
                      <td colSpan="17" style={{ paddingLeft: "20px" }}>{row.sectorName}</td>
                    </tr>
                  );
                }

                const hasNoProjectName = !row.prj_name || row.prj_name.trim() === "";

                return (
                  <tr 
                    key={row.id || index} 
                    className={hasNoProjectName ? "no-project-name" : ""} 
                    style={{ textAlign: "center" }}
                  >
                    {row.showMergedCells && (
                      <>
                        <td rowSpan={row.commonValues.rowSpan}>{row.projectSN}</td>
                        <td rowSpan={row.commonValues.rowSpan}>
                          <b>
                            {row.prj_name || (
                              <span style={{ color: "#6c757d", fontStyle: "italic" }}>{t("Unnamed Project")}</span>
                            )}
                          </b>
                        </td>
                        <td rowSpan={row.commonValues.rowSpan}>{row.commonValues.prj_measurement_unit}</td>
                        <td rowSpan={row.commonValues.rowSpan}>{row.commonValues.prj_measurement_unit}</td>
                        <td rowSpan={row.commonValues.rowSpan}>{row.commonValues.zone}</td>
                        <td rowSpan={row.commonValues.rowSpan}>{row.commonValues.woreda}</td>
                        <td rowSpan={row.commonValues.rowSpan}>{row.commonValues.prj_location_description}</td>
                        <td rowSpan={row.commonValues.rowSpan}>{row.commonValues.start_year}</td>
                        <td rowSpan={row.commonValues.rowSpan}>{row.commonValues.end_year}</td>
                        <td rowSpan={row.commonValues.rowSpan}>{row.commonValues.cni_name}</td>
                        <td rowSpan={row.commonValues.rowSpan}>{Number(row.commonValues.beneficiery)?.toLocaleString() || ""}</td>
                      </>
                    )}
                    <td>{row.budgetyear}</td>
                    <td>{row.prp_physical_performance || " "}</td>
                    <td>{row.prp_physical_planned || " "}</td>
                    <td>{row.showMergedCells ? Number(row.commonValues.prj_total_estimate_budget)?.toLocaleString() : ""}</td>
                    <td>{Number(row.prp_budget_baseline)?.toLocaleString() || ""}</td>
                    <td>{Number(row.prp_total_budget_used)?.toLocaleString() || ""}</td>
                    <td>{Number(row.bdr_requested_amount)?.toLocaleString() || ""}</td>
                    <td>{Number(row.bdr_released_amount)?.toLocaleString() || ""}</td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="17" style={{ textAlign: "center", padding: "2rem", color: "#6c757d", fontStyle: "italic" }}>
                  {searchTerm
                    ? t("No projects match your search criteria.")
                    : t("No data available. Please select related Address Structure and click Search button.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {allRows.length > 0 && (
        <div className="bg-white p-2 border-top">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted">
              {t("Showing")} {indexOfFirstRow + 1} {t("to")} {Math.min(indexOfLastRow, allRows.length)} {t("of")} {allRows.length} {t("entries")}
            </div>

            <div className="d-flex align-items-center">
              <nav>
                <ul className="pagination mb-0" style={{ fontSize: '1rem' }}>
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => paginate(currentPage - 1)} 
                      disabled={currentPage === 1} 
                      style={{ padding: '0.5rem 0.75rem' }}
                    >
                      &laquo;
                    </button>
                  </li>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => paginate(pageNum)} 
                            style={{ padding: '0.5rem 0.75rem' }}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    }
                    return null;
                  })}

                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => paginate(currentPage + 1)} 
                      disabled={currentPage === totalPages} 
                      style={{ padding: '0.5rem 0.75rem' }}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>

              <div className="ms-3" style={{ position: 'relative', width: '80px' }}>
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
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  fontSize: '1rem'
                }}>
                  ▼
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialProjectsTable;