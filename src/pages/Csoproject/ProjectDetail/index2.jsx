import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { useParams, useLocation } from "react-router-dom";
import { Col, Container, Row, Card, CardBody, Spinner } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import ProjectDetail from "./ProjectDetail2";
import ProjectDetailTabDynamic from "./ProjectDetailTabDynamic";
import { useFetchProgramInfo } from "../../../queries/programinfo_cso_query";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../../hooks/useAuthUser";

// Lazy Load Components
const LazyComponents = {
  ProjectDocument: lazy(() => import("../../../pages/Projectdocument/FileManager/index")),
  ProjectPayment: lazy(() => import("../../../pages/Projectpayment")),
  ProjectStakeholder: lazy(() => import("../../../pages/Projectstakeholder")),
  Projectcontractor: lazy(() => import("../../../pages/Projectcontractor")),
  GeoLocation: lazy(() => import("../../../pages/GeoLocation")),
  ProjectBudgetExpenditureModel: lazy(() => import("../../Projectbudgetexpenditure")),
  ProjectEmployeeModel: lazy(() => import("../../../pages/Projectemployee")),
  ProjectHandoverModel: lazy(() => import("../../Projecthandover")),
  ProjectPerformanceModel: lazy(() => import("../../Projectperformance")),
  ProjectSupplimentaryModel: lazy(() => import("../../Projectsupplimentary")),
  ProjectVariationModel: lazy(() => import("../../Projectvariation")),
  ProposalRequestModel: lazy(() => import("../../../pages/Proposalrequest")),
  Conversation: lazy(() => import("../../Conversationinformation/index1")),
  RequestInformationModel: lazy(() => import("../../../pages/Requestinformation")),
  BudgetRequestModel: lazy(() => import("../../../pages/Budgetrequest/BudgetRequestRegistration")),
  ProjectPlanModel: lazy(() => import("../../../pages/Projectplan/ProjectPlanRegistration")),
};

const ProjectsOverview = () => {
  document.title = "Overview | Program";

  const location = useLocation()
  const programId = Number(location.pathname.split("/")[2].split("#")[0]);

  const { user: storedUser, isLoading: authLoading, userId } = useAuthUser();

  const { data, isLoading } = useFetchProgramInfo(programId, programId !== null);
  const { t } = useTranslation();

  // Memoized project name
  const projectName = useMemo(() => data?.data?.pri_name_en || "", [data]);
  // Tab configuration
  const tabMapping = useMemo(() => ({
    54: { label: t("project_document"), component: LazyComponents.ProjectDocument, path: "documents" },
    44: { label: t("project_contractor"), component: LazyComponents.Projectcontractor, path: "contractors" },
    26: { label: t("project_payment"), component: LazyComponents.ProjectPayment, path: "payments" },
    53: { label: t("project_stakeholder"), component: LazyComponents.ProjectStakeholder, path: "stakeholders" },
    33: { label: t("prj_geo_location"), component: LazyComponents.GeoLocation, path: "location" },
    43: { label: t("project_employee"), component: LazyComponents.ProjectEmployeeModel, path: "employees" },
    38: { label: t("project_handover"), component: LazyComponents.ProjectHandoverModel, path: "handover" },
    37: { label: t("project_performance"), component: LazyComponents.ProjectPerformanceModel, path: "performance" },
    41: { label: t("project_supplimentary"), component: LazyComponents.ProjectSupplimentaryModel, path: "supplimentary" },
    40: { label: t("project_variation"), component: LazyComponents.ProjectVariationModel, path: "variation" },
    58: { label: t("proposal_request"), component: LazyComponents.ProposalRequestModel, path: "proposal-request" },
    57: { label: t("conversation_information"), component: LazyComponents.Conversation, path: "conversations" },
    59: { label: t("request_information"), component: LazyComponents.RequestInformationModel, path: "requests" },
    //70: { label: t("proposal_request"), component: LazyComponents.BudgetRequestModel, path: "proposal_request" },
    61: { label: t("project_plan"), component: LazyComponents.ProjectPlanModel, path: "project_plan" },
    59: { label: t("request_information"), component: LazyComponents.RequestInformationModel, path: "information" },
  }), [t]);

  // Allowed tabs based on project data
  const allowedTabs = useMemo(() => {
    if (!data?.allowedTabs) return [];
    let tabs = [...data.allowedTabs];
    if (data?.data?.status_id < 5 || data?.data?.status_id > 7) {
      tabs = tabs.filter(tab => tab !== 59);
    }
    return tabs;
  }, [data]);


  // Dynamic components based on allowed tabs
  const dynamicComponents = useMemo(() => (
    allowedTabs.reduce((acc, tabIndex) => {
      const tab = tabMapping[tabIndex];
      if (tab) {
        acc[tab.label] = { component: tab.component, path: tab.path };
      }
      return acc;
    }, {})
  ), [allowedTabs, tabMapping]);

  return (
    <div className="page-content" style={{ zoom: "90%" }}>
      <Container fluid>
        <Breadcrumbs title="Projects" breadcrumbItem="Project Overview" />
        {isLoading ? (
          <Spinner className="position-absolute top-50 start-50" size="md" />
        ) : (
          <>
            <Row>
              <Col lg="12">
                <ProjectDetail data={data?.data || {}} />
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <Suspense fallback={<Spinner size="sm" />}>
                      <ProjectDetailTabDynamic
                        name={data?.data.pri_name_en}
                        id={data?.data.pri_id}
                        status={1}
                        startDate={1}
                        components={dynamicComponents}
                      />
                    </Suspense>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

ProjectsOverview.propTypes = {
  match: PropTypes.object,
};

export default ProjectsOverview;