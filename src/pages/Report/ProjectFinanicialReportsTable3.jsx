import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardBody, Input } from "reactstrap";
import { FaSearch } from "react-icons/fa";

const FinancialProjectsTable = ({
  data = [],
  t = (key) => key,
  tableClass = "",
  theadClass = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lowerSearchTerm = searchTerm.toLowerCase();

    return data.filter((project) =>
      (project.sector && project.sector.toLowerCase().includes(lowerSearchTerm)) ||
      (project.prj_name && project.prj_name.toLowerCase().includes(lowerSearchTerm)) ||
      (project.prj_code && project.prj_code.toLowerCase().includes(lowerSearchTerm))
    );
  }, [data, searchTerm]);

  const groupedData = useMemo(() => {
    return filteredData.reduce((acc, project) => {
      const sector = project.sector || "Other Sector";
      const projectName = project.prj_name || "Unnamed Project";

      if (!acc[sector]) acc[sector] = {};
      if (!acc[sector][projectName]) acc[sector][projectName] = [];
      acc[sector][projectName].push(project);
      return acc;
    }, {});
  }, [filteredData]);

  const allRows = useMemo(() => {
    const rows = [];
    let projectCounter = 0;

    Object.entries(groupedData || {}).forEach(([sectorName, projects]) => {
      rows.push({ type: "sector", sectorName });

      Object.entries(projects).forEach(([projectName, projectList]) => {
        projectCounter += 1;
        projectList.forEach((proj, index) => {
          rows.push({
            type: "project",
            ...proj,
            projectSN: index === 0 ? projectCounter : null,
            showProjectName: index === 0,
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
          <div style={{ position: "relative" }}>
            <Input
              type="text"
              placeholder="Search..."
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
        </CardBody>
      </Card>

      <div
        style={{
          overflowX: "auto",
          width: "100%",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}
      >
        <table
          className={`table table-bordered table-hover ${tableClass}`}
          style={{
            width: "100%",
            fontSize: "0.85rem",
            minWidth: "1000px",
          }}
        >
          <thead
            className={theadClass}
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#f8f9fa",
              zIndex: 1,
            }}
          >
            <tr>
              <th rowSpan="2">SN</th>
              <th rowSpan="2">Name of Project</th>
              <th rowSpan="2">Unit</th>
              <th rowSpan="2">Total Weight</th>
              <th colSpan="3">Project location</th>
              <th colSpan="2">Project Duration</th>
              <th rowSpan="2">Implementing agent</th>
              <th>N.o of Beneficiaries </th>
              <th>Hanga Lafa Misoomu</th>
              <th>Karoora Hojii Fizikaalaa</th>
              <th>Raawwii Hojii Fizikaalaa</th>
              <th>Tilmaama Baasii</th>
              <th>Waliigala Baasii</th>
              <th>Kan Deeggarame</th>
            </tr>
            <tr>
              <th>Zone</th>
              <th>Woreda</th>
              <th>Specific site</th>
              <th>Jalqabame</th>
              <th>Xumuramu</th>
              <th colSpan="7"></th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => {
                if (row.type === "sector") {
                  return (
                    <tr
                      key={`sector-${row.sectorName}-${index}`}
                      style={{
                        backgroundColor: "#e8f4f0",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}
                    >
                      <td colSpan="17">{row.sectorName}</td>
                    </tr>
                  );
                }

                return (
                  <tr key={row.id || index} style={{ textAlign: "center" }}>
                    <td>{row.projectSN ? row.projectSN : ""}</td>
                    <td>{row.showProjectName ? row.prj_name : ""}</td>
                    <td>{/* Unit */}</td>
                    <td>{/* Total Weight */}</td>
                    <td>{row.zone || " "}</td>
                    <td>{row.woreda || " "}</td>
                    <td>{row.prj_location_description || " "}</td>
                    <td>{row.start_year || " "}</td>
                    <td>{row.end_year || " "}</td>
                    <td>{row.cni_name || " "}</td>
                    <td>{row.beneficiery || " "}</td>
                    <td>{row.hanga_xumuramu || " "}</td>
                    <td>{row.prp_physical_planned || " "}</td>
                    <td>{row.prp_physical_performance || " "}</td>
                    <td>{row.ppe_amountspecificyear || " "}</td>
                    <td>{row.ppe_amountallyear || " "}</td>
                    <td>{row.bdr_released_amountspecificyear || " "}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="17" style={{ textAlign: "center", padding: "2rem" }}>
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
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted small">
            Showing {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, allRows.length)} of {allRows.length} entries
          </div>

          <div className="d-flex align-items-center ms-auto">
            <nav aria-label="Table pagination">
              <ul className="pagination mb-0" style={{ fontSize: "1.1rem" }}>
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>&laquo;</button>
                </li>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? "active" : ""}`}>
                      <button className="page-link" onClick={() => paginate(pageNum)}>
                        {pageNum}
                      </button>
                    </li>
                  );
                })}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>&raquo;</button>
                </li>
              </ul>
            </nav>

            <div className="ms-3 position-relative" style={{ width: "70px" }}>
              <select
                className="form-control form-control-sm"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[10, 25, 50, 100].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  pointerEvents: "none",
                  transform: "translateY(-50%)",
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
