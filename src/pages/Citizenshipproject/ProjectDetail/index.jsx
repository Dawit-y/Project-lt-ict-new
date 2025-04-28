import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { useParams, useLocation } from "react-router-dom";
import { Col, Container, Row, Card, CardBody, Spinner } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import ProjectDetail from "./ProjectDetail";
import ProjectDetailTabDynamic from "./ProjectDetailTabDynamic";
import { useFetchProject } from "../../../queries/citizenship_project_query";
import { useTranslation } from "react-i18next";
import ProjectSummary from "./ProjectSummary";
import { TabWrapper } from "../../../components/Common/DetailViewWrapper";
// Lazy Load Components
const LazyComponents = {
  ProjectDocument: lazy(() =>
    import("../../../pages/Projectdocument/FileManager/index")
  ),
  ProjectPayment: lazy(() => import("../../../pages/Projectpayment")),
  ProjectStakeholder: lazy(() => import("../../../pages/Projectstakeholder")),
  Projectcontractor: lazy(() => import("../../../pages/Projectcontractor")),
  GeoLocation: lazy(() => import("../../../pages/GeoLocation")),
  ProjectBudgetExpenditureModel: lazy(() =>
    import("../../Projectbudgetexpenditure")
  ),
  ProjectEmployeeModel: lazy(() => import("../../../pages/Projectemployee")),
  ProjectHandoverModel: lazy(() => import("../../Projecthandover")),
  ProjectPerformanceModel: lazy(() => import("../../Projectperformance")),
  ProjectSupplimentaryModel: lazy(() => import("../../Projectsupplimentary")),
  ProjectVariationModel: lazy(() => import("../../Projectvariation")),
  ProposalRequestModel: lazy(() => import("../../../pages/Proposalrequest")),
  Conversation: lazy(() => import("../../Conversationinformation/index1")),
  ProjectMonitoringEvaluationModel: lazy(() => import("../../Projectmonitoringevaluation/index")),
  ProjectKpiResultModel: lazy(() => import("../../Projectkpiresult/index")),
  RequestInformationModel: lazy(() =>
    import("../../../pages/Requestinformation")
  ),
  BudgetRequestModel: lazy(() =>
    import("../../../pages/Budgetrequest/BudgetRequestRegistration")
  ),
  ProjectPlanModel: lazy(() =>
    import("../../../pages/Projectplan/ProjectPlanRegistration")
  ),
  ProcurementInformationModel: lazy(() =>
    import("../../Procurementinformation")
  ),
};

const ProjectsOverview = () => {
  document.title = "Overview | Project";

  const location = useLocation();
  const projectId = Number(location.pathname.split("/")[2].split("#")[0]);

  const storedUser = JSON.parse(localStorage.getItem("authUser"));
  const userId = storedUser?.user.usr_id;

  const { data, isLoading } = useFetchProject(projectId, userId, true);
  const { t } = useTranslation();

  // Memoized project name
  const projectName = useMemo(() => data?.data?.prj_name || "", [data]);
  // Tab configuration
  const tabMapping = useMemo(
    () => ({
      7: {
        label: t("procurement_information"),
        component: LazyComponents.ProcurementInformationModel,
        path: "procurement",
      },
      39: {
        label: t("project_budget_expenditure"),
        component: LazyComponents.ProjectBudgetExpenditureModel,
        path: "project_expenditure",
      },
      54: {
        label: t("project_document"),
        component: LazyComponents.ProjectDocument,
        path: "documents",
      },
      44: {
        label: t("project_contractor"),
        component: LazyComponents.Projectcontractor,
        path: "contractors",
      },
      26: {
        label: t("project_payment"),
        component: LazyComponents.ProjectPayment,
        path: "payments",
      },
      53: {
        label: t("project_stakeholder"),
        component: LazyComponents.ProjectStakeholder,
        path: "stakeholders",
      },
      33: {
        label: t("prj_geo_location"),
        component: LazyComponents.GeoLocation,
        path: "location",
      },
      43: {
        label: t("project_employee"),
        component: LazyComponents.ProjectEmployeeModel,
        path: "employees",
      },
      38: {
        label: t("project_handover"),
        component: LazyComponents.ProjectHandoverModel,
        path: "handover",
      },
      37: {
        label: t("project_performance"),
        component: LazyComponents.ProjectPerformanceModel,
        path: "performance",
      },
      41: {
        label: t("project_supplimentary"),
        component: LazyComponents.ProjectSupplimentaryModel,
        path: "supplimentary",
      },
      40: {
        label: t("project_variation"),
        component: LazyComponents.ProjectVariationModel,
        path: "variation",
      },
      58: {
        label: t("proposal_request"),
        component: LazyComponents.ProposalRequestModel,
        path: "proposal-request",
      },
      57: {
        label: t("conversation_information"),
        component: LazyComponents.Conversation,
        path: "conversations",
      },
      59: {
        label: t("request_information"),
        component: LazyComponents.RequestInformationModel,
        path: "requests",
      },
      34: {
        label: t("budget_request"),
        component: LazyComponents.BudgetRequestModel,
        path: "budget_request",
      },
      61: {
        label: t("project_plan"),
        component: LazyComponents.ProjectPlanModel,
        path: "project_plan",
      },
      72: {
        label: t("project_monitoring_evaluation"),
        component: LazyComponents.ProjectMonitoringEvaluationModel,
        path: "project_monitoring_evaluation",
      },
      77: {
        label: t("kpi_result"),
        component: LazyComponents.ProjectKpiResultModel,
        path: "kpi_result",
      },      
      //39: { label: t("request_information"), component: LazyComponents.RequestInformationModel, path: "information" },
    }),
    [t]
  );

  // Allowed tabs based on project data
  //const allowedTabs = useMemo(() => data?.allowedTabs || [], [data]);
  const [allowedTabs, setAllowedTabs] = useState(data?.allowedTabs || []);
  useEffect(() => {
    if (data?.data?.prj_project_status_id <= 4) {
      setAllowedTabs([34, 54, 37]);
    } else {
      setAllowedTabs(data?.allowedTabs || []);
    }
  }, [data?.data?.prj_project_status_id]);

  // Dynamic components based on allowed tabs
  const dynamicComponents = useMemo(
    () =>
      allowedTabs.reduce((acc, tabIndex) => {
        const tab = tabMapping[tabIndex];
        if (tab) {
          acc[tab.label] = { component: tab.component, path: tab.path };
        }
        return acc;
      }, {}),
    [allowedTabs, tabMapping]
  );

  const tabs = [
    {
      id: "details",
      label: "Details",
      content: <ProjectDetail data={data?.data || {}} />,
    },
    {
      id: "summary",
      label: "Summary",
      content: <ProjectSummary data={data || {}} />,
    },
  ];

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
                <TabWrapper tabs={tabs} />
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <Suspense fallback={<Spinner size="sm" />}>
                      <ProjectDetailTabDynamic
                        canvasWidth={84}
                        name={data?.data.prj_name}
                        id={data?.data.prj_id}
                        status={data?.data.prj_project_status_id}
                        startDate={data?.data.prj_start_date_gc}
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
