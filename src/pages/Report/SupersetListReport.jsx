import React, { useEffect, useMemo, useState } from "react";
import {
  Col,
  Row,
  Card,
  CardBody
} from "reactstrap";
const SupersetListReport = (dashboardPath) => {
  const [dashboardUrl, setDashboardUrl] = useState("");
  const storedUser = localStorage.getItem("authUser");
  const User = storedUser ? JSON.parse(storedUser) : null; // Handle null case
  const zoneId = User.user.usr_zone_id;
  const sectorId = User.user.usr_sector_id;
  const departmentId = User.user.departmentId;
  useEffect(() => {
    // Construct the iframe URL with dynamic parameters
    //const baseUrl = "http://196.188.182.83:1110/superset/dashboard/12/?standalone=true";
    //const baseUrl = "https://report.pms.oro.gov.et/superset/dashboard/p/elMJeM8JXQr/";

    //const baseUrl=dashboardPath.dashboardPath;
    const baseUrl = "https://report.pms.oro.gov.et/superset/dashboard/16";
    const url = new URL(baseUrl);
    // Add query parameters
    url.searchParams.set("standalone", "true");
    url.searchParams.set("zone_id", zoneId);
    url.searchParams.set("sector_id", sectorId);
    url.searchParams.set("department_id", departmentId);
    const fullUrl = url.toString();
    // Update the iframe URL
    setDashboardUrl(fullUrl);
  }, [User]);
  return (
    <div className="page-content">
      <div className="container-fluid1">
        <Row>
          <Col xs="12">
            <iframe width="100%" height="1200" seamless=""
              scrolling="no"
              src={dashboardUrl} />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default SupersetListReport;