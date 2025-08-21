import React, { useEffect, useMemo, useState } from "react";
import { Col, Row, Card, CardBody } from "reactstrap";
import { useAuthUser } from "../../hooks/useAuthUser";

const SupersetListReport = () => {
  const [dashboardUrl, setDashboardUrl] = useState("");
  const { user: authUser } = useAuthUser();
  const zoneId = authUser.usr_zone_id;
  const sectorId = authUser.usr_sector_id;
  //const departmentId = authUser.departmentId;
  useEffect(() => {
    // Construct the iframe URL with dynamic parameters
    //const baseUrl = "http://196.188.182.83:1110/superset/dashboard/12/?standalone=true";
    //const baseUrl = "https://report.pms.oro.gov.et/superset/dashboard/p/elMJeM8JXQr/";

    //const baseUrl=dashboardPath.dashboardPath;
    let baseUrl = "https://report.pms.oro.gov.et/superset/dashboard/16";
    // Force HTTPS if somehow HTTP sneaks in
    if (baseUrl.startsWith("http://")) {
      baseUrl = baseUrl.replace("http://", "https://");
    }

    const url = new URL(baseUrl);
    // Add query parameters
    url.searchParams.set("standalone", "true");
    url.searchParams.set("zone_id", zoneId);
    url.searchParams.set("sector_id", sectorId);
    //url.searchParams.set("department_id", departmentId);
    const fullUrl = url.toString();
    // Update the iframe URL
    setDashboardUrl(fullUrl);
  }, [authUser]);

  return (
    <div className="page-content">
      <div className="container-fluid1">
        <Row>
          <Col xs="12">
            <iframe
              width="100%"
              height="1200"
              seamless=""
              scrolling="yes"
              src={dashboardUrl}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default SupersetListReport;
