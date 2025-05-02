import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardBody, Input } from "reactstrap";
import { FaSearch } from "react-icons/fa";

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
      const sector = project.sector || "Other Sector";
      const projectName = project.prj_name || "Unnamed Project";
      if (!acc[sector]) acc[sector] = {};
      if (!acc[sector][projectName]) acc[sector][projectName] = { entries: [] };
      acc[sector][projectName].entries.push(project);
      return acc;
    }, {});
  }, [filteredData]);

  // Calculate project count for serial numbers before pagination
  const allRows = useMemo(() => {
    const rows = [];
    let projectSerial = 1;

    Object.entries(groupedData || {}).forEach(([sectorName, projects]) => {
      rows.push({ type: "sector", sectorName });

      Object.entries(projects || {}).forEach(([projectName, proj]) => {
        // Ensure we have an array to iterate over
        const entries = Array.isArray(proj.entries) ? proj.entries : [proj];
        
        entries.forEach((entry, i) => {
          rows.push({
            type: "project",
            ...entry,
            prj_code: i === 0 ? entry.prj_code : "",
            prj_name: i === 0 ? projectName : "",
            projectSerial: i === 0 ? projectSerial++ : null,
          });
        });
      });
    });
    return rows;
  }, [groupedData]);

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
              placeholder="Search..."
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

      <div style={{
        overflowX: "auto",
        width: "100%",
        border: "1px solid #dee2e6",
        borderRadius: "4px",
        marginBottom: "1rem"
      }}>
        <table className={`table table-bordered table-hover ${tableClass}`} style={{
          width: "100%",
          marginBottom: 0,
          fontSize: "0.85rem",
          minWidth: "1400px"
        }}>
          <thead className={theadClass} style={{
            position: "sticky",
            top: 0,
            backgroundColor: "#f8f9fa",
            zIndex: 1,
          }}>
            <tr>
              <th rowSpan="2">Lak</th>
              <th rowSpan="2">Maqaa Pirojektii</th>
              <th rowSpan="2">{t("Unit")}</th>
              <th rowSpan="2">{t("Waligala Hojii")}</th>
              <th colSpan="3">Bakka Itti hojjatamu</th>
              <th colSpan="2">Bara raawwii</th>
              <th>Raawwii Hojii</th>
              <th>Raawwii Hojii Fizikaalaa</th>
              <th>Gatii waliigala Ijaarsaa</th>
              <th>Baasii Piroojektii hanga Wax 30</th>
              <th>Baasii</th>
              <th>Kan Gaafatame</th>
              <th>Kan Deeggarame</th>
            </tr>
            <tr>
              <th>Godina</th>
              <th>Aanaa</th>
              <th>Ganda</th>
              <th>Bara Jalqabame</th>
              <th>Bara Xumura</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length > 0 ? (() => {
              let lastProjectName = "";
              return currentRows.map((row, index) => {
                if (row.type === "sector") {
                  lastProjectName = "";
                  return (
                    <tr key={`sector-${row.sectorName}`} style={{
                      backgroundColor: "#e8f4f0",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      textAlign: "left",
                    }}>
                      <td colSpan="17" style={{ paddingLeft: "20px" }}>{row.sectorName}</td>
                    </tr>
                  );
                }

                const actualIndex = indexOfFirstRow + index - currentRows.slice(0, index).filter(r => r.type === "sector").length;
                const showProjectName = row.prj_name !== lastProjectName;

                lastProjectName = row.prj_name;

                return (
                  <tr key={row.id || index} style={{ textAlign: "center" }}>
                    <td>{row.projectSerial || ""}</td>
                    <td>{showProjectName ? row.prj_name : ""}</td>
                    <td>{" %"}</td>
                    <td>{}</td>
                    <td>{row.zone || " "}</td>
                    <td>{row.woreda || " "}</td>
                    <td>{row.prj_location_description || " "}</td>
                    <td>{row.start_year || " "}</td>
                    <td>{row.end_year || " "}</td>
                    <td>{row.prp_physical_performance || " "}</td>
                    <td>{row.prp_physical_performance || " "}</td>
                    <td>{row.prj_total_estimate_budget || " "}</td>
                    <td>{row.prp_budget_baseline || " "}</td>
                    <td>{row.prp_total_budget_used || " "}</td>
                    <td>{row.bdr_requested_amountspecificyear || " "}</td>
                    <td>{row.bdr_released_amountspecificyear || " "}</td>
                  </tr>
                );
              });
            })() : (
              <tr>
                <td colSpan="17" style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#6c757d",
                  fontStyle: "italic"
                }}>
                  {searchTerm
                    ? "No projects match your search criteria."
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
              Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, allRows.length)} of {allRows.length} entries
            </div>

            <div className="d-flex align-items-center">
              <nav>
                <ul className="pagination mb-0" style={{ fontSize: '1rem' }}>
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} style={{ padding: '0.5rem 0.75rem' }}>
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
                          <button className="page-link" onClick={() => paginate(pageNum)} style={{ padding: '0.5rem 0.75rem' }}>
                            {pageNum}
                          </button>
                        </li>
                      );
                    }
                    return null;
                  })}

                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: '0.5rem 0.75rem' }}>
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
