import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { useAuthUser } from "../../hooks/useAuthUser";

const SupersetDashboard = ({ dashboardPath }) => {
  const { user: authUser } = useAuthUser();
  const [dashboardUrl, setDashboardUrl] = useState("");

  useEffect(() => {
    if (!authUser) return;

    const {
      usr_zone_id: zoneId,
      usr_woreda_id: woredaId,
      usr_user_type: projectType,
      user_sector,
    } = authUser;

    const sectorIds = user_sector?.[0]?.sector_ids;
    //const sectorId =
    //Array.isArray(sectorIds) && sectorIds.length > 0 ? sectorIds : 0;
    const sectorId = sectorIds?.length > 0 ? sectorIds : 0;
    const baseUrl = dashboardPath;
    const url = new URL(baseUrl);

    url.searchParams.set("standalone", "true");
    url.searchParams.set("zone_id", zoneId);
    url.searchParams.set("woreda_id", woredaId);
    url.searchParams.set("sector_id", sectorId);
    url.searchParams.set("project_type", projectType);

    setDashboardUrl(url.toString());
  }, [authUser, dashboardPath]);

  if (!dashboardUrl) return null;

  return (
    <Row>
      <Col xs="12">
        <iframe
          width="100%"
          height="1200"
          scrolling="yes"
          src={dashboardUrl}
          style={{ border: "none" }}
          title="Superset Dashboard"
        />
      </Col>
    </Row>
  );
};

export default SupersetDashboard;
