import React, { lazy } from "react";
import { Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard/index";
import Login from "../pages/Authentication/Login";
import Unauthorized from "../components/Common/NotFound";
import UsersProfile from "../pages/Profile";
import ProjectProvider from "../context/ProjectContext";

const ProjectPaymentList = lazy(() =>
  import("../pages/Projectpayment/ProjectPaymentList")
);
const ProjectsTreeView = lazy(() => import("../pages/ProjectStatusTree/index"));
const Logout = lazy(() => import("../pages/Authentication/Logout"));
const Register = lazy(() => import("../pages/Authentication/Register"));
const ForgetPwd = lazy(() => import("../pages/Authentication/ForgetPassword"));

const AddressStructure = lazy(() =>
  import("../pages/AddressTreeStructure/index.jsx")
);
const DocumentType = lazy(() => import("../pages/Documenttype/index"));
const Project = lazy(() => import("../pages/Project/index"));
const ProjectCategory = lazy(() => import("../pages/Projectcategory/index"));
const ProjectContractor = lazy(() =>
  import("../pages/Projectcontractor/index")
);
const ProjectDocument = lazy(() => import("../pages/Projectdocument/index"));
const ProjectPayment = lazy(() => import("../pages/Projectpayment/index"));
const Pages = lazy(() => import("../pages/Pages/index"));
const Permission = lazy(() => import("../pages/Permission/index"));
const ProjectStatus = lazy(() => import("../pages/Projectstatus/index"));
const SectorCategory = lazy(() => import("../pages/Sectorcategory/index"));
const Users = lazy(() => import("../pages/Users/index"));
const UserRole = lazy(() => import("../pages/Userrole/index"));
const Roles = lazy(() => import("../pages/Roles/index"));
const SectorInformation = lazy(() =>
  import("../pages/Sectorinformation/index")
);
const ProjectStakeholder = lazy(() =>
  import("../pages/Projectstakeholder/index")
);
const StakeholderType = lazy(() => import("../pages/Stakeholdertype/index"));
const Department = lazy(() => import("../pages/Department/index"));
const BudgetRequestListModel = lazy(() =>
  import("../pages/Budgetrequest/BudgetRequestList")
);
const BudgetSource = lazy(() => import("../pages/Budgetsource/index"));
const BudgetYear = lazy(() => import("../pages/Budgetyear/index"));
const ContractTerminationReason = lazy(() =>
  import("../pages/Contractterminationreason/index")
);
const ContractorType = lazy(() => import("../pages/Contractortype/index"));
const AccessLog = lazy(() => import("../pages/Accesslog/index"));
const CascadingDropdowns = lazy(() =>
  import("../components/Common/CascadingDropdowns")
);
const Dashboardcard = lazy(() => import("../Dashboards/Pie"));
const Notifications = lazy(() => import("../pages/notifications"));

const ProjectOverview = lazy(() => import("../pages/Project/ProjectOverview"));
const ProjectsLocation = lazy(() => import("../pages/ProjectsLocation"));
const Gantty = lazy(() => import("../pages/GanttChart/index"));
const StatisticalReport = lazy(() => import("../pages/StatisticalReport"));
const Report = lazy(() => import("../pages/Report/index"));
const ExpenditureCode = lazy(() => import("../pages/Expenditurecode/index"));
const ProjectBudgetExpenditure = lazy(() =>
  import("../pages/Projectbudgetexpenditure/index")
);
const ProjectEmployee = lazy(() => import("../pages/Projectemployee/index"));
const ProjectHandover = lazy(() => import("../pages/Projecthandover/index"));
const ProjectPerformance = lazy(() =>
  import("../pages/Projectperformance/index")
);
const ProjectPerformanceList = lazy(() =>
  import("../pages/Projectperformance/ProjectPerformanceList")
);
const ProjectHandoverList = lazy(() =>
  import("../pages/Projecthandover/ProjectHandoverList")
);
const ProjectBudgetExpenditureList = lazy(() =>
  import("../pages/Projectbudgetexpenditure/ProjectBudgetExpenditureList")
);
const ProjectBudgetSourceList = lazy(() =>
  import("../pages/Projectbudgetsource/ProjectBudgetSourceList")
);
const ProjectVariationList = lazy(() =>
  import("../pages/Projectvariation/ProjectVariationList")
);
const ProjectSupplimentaryList = lazy(() =>
  import("../pages/Projectsupplimentary/ProjectSupplimentaryList")
);
const ProjectEmployeeList = lazy(() =>
  import("../pages/Projectemployee/ProjectEmployeeList")
);
const ProjectStakeholderList = lazy(() =>
  import("../pages/Projectstakeholder/ProjectStakeholderList")
);
const ProjectContractorList = lazy(() =>
  import("../pages/Projectcontractor/ProjectContractorList")
);
const ProjectBudgetPlanList = lazy(() =>
  import("../pages/Projectbudgetplan/ProjectBudgetPlanList")
);
const ProjectBudgetPlan = lazy(() =>
  import("../pages/Projectbudgetplan/index")
);
const BudgetMonth = lazy(() => import("../pages/Budgetmonth/index"));
const ProjectPlan = lazy(() => import("../pages/Projectplan/index"));
const ProjectSupplimentary = lazy(() =>
  import("../pages/Projectsupplimentary/index")
);
const ProjectVariation = lazy(() => import("../pages/Projectvariation/index"));

const authProtectedRoutes = [
  { path: "/expenditure_code", component: <ExpenditureCode /> },
  {
    path: "/project_budget_expenditure",
    component: <ProjectBudgetExpenditure />,
  },
  { path: "/project_employee", component: <ProjectEmployee /> },
  { path: "/project_handover", component: <ProjectHandover /> },
  { path: "/project_performance", component: <ProjectPerformance /> },
  { path: "/project_performance_list", component: <ProjectPerformanceList /> },
  { path: "/project_handover_list", component: <ProjectHandoverList /> },
  {
    path: "/project_budget_expenditure_list",
    component: <ProjectBudgetExpenditureList />,
  },
  {
    path: "/project_budget_source_list",
    component: <ProjectBudgetSourceList />,
  },
  { path: "/project_variation_list", component: <ProjectVariationList /> },
  {
    path: "/project_supplimentary_list",
    component: <ProjectSupplimentaryList />,
  },
  { path: "/project_employee_list", component: <ProjectEmployeeList /> },

  { path: "/project_stakeholder_list", component: <ProjectStakeholderList /> },
  { path: "/project_contractor_list", component: <ProjectContractorList /> },
  { path: "/project_budget_plan_list", component: <ProjectBudgetPlanList /> },
  { path: "/project_budget_plan", component: <ProjectBudgetPlan /> },
  { path: "/budget_month", component: <BudgetMonth /> },
  { path: "/project_supplimentary", component: <ProjectSupplimentary /> },
  { path: "/project_variation", component: <ProjectVariation /> },
  { path: "/dash", components: <Dashboardcard /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/Project-Tree", component: <ProjectsTreeView /> },
  { path: "/address_structure", component: <AddressStructure /> },
  { path: "/department", component: <Department /> },
  { path: "/budget_request", component: <BudgetRequestListModel /> },
  { path: "/budget_source", component: <BudgetSource /> },
  { path: "/budget_year", component: <BudgetYear /> },
  {
    path: "/contract_termination_reason",
    component: <ContractTerminationReason />,
  },
  { path: "/contractor_type", component: <ContractorType /> },
  { path: "/document_type", component: <DocumentType /> },
  { path: "/access_log", component: <AccessLog /> },
  { path: "/project_status", component: <ProjectStatus /> },
  { path: "/sector_category", component: <SectorCategory /> },
  { path: "/users", component: <Users /> },
  { path: "/user_role", component: <UserRole /> },
  { path: "/roles", component: <Roles /> },
  { path: "/sector_information", component: <SectorInformation /> },
  { path: "/project_stakeholder", component: <ProjectStakeholder /> },
  { path: "/stakeholder_type", component: <StakeholderType /> },
  { path: "/document_type", component: <DocumentType /> },
  {
    path: "/Project",
    component: (
      <ProjectProvider>
        <Project />
      </ProjectProvider>
    ),
  },
  {
    path: "/Project/:id",
    component: (
      <ProjectProvider>
        <ProjectOverview />
      </ProjectProvider>
    ),
  },
  {
    path: "/Project/:id/project_plan",
    component: (
      <ProjectProvider>
        <ProjectPlan />
      </ProjectProvider>
    ),
  },
  { path: "/project_category", component: <ProjectCategory /> },
  { path: "/project_contractor", component: <ProjectContractor /> },
  { path: "/project_document", component: <ProjectDocument /> },
  { path: "/project_payment", component: <ProjectPayment /> },
  { path: "/pages", component: <Pages /> },
  { path: "/permission", component: <Permission /> },
  { path: "/dropdowns", component: <CascadingDropdowns /> },
  { path: "/notifications", component: <Notifications /> },
  { path: "/profile", component: <UsersProfile /> },
  { path: "/project_payment_list", component: <ProjectPaymentList /> },
  { path: "/projects_location", component: <ProjectsLocation /> },
  { path: "/statistical_report", component: <StatisticalReport /> },
  { path: "/report", component: <Report /> },
  //   // this route should be at the end of all other routes
  //   // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  { path: "/gantt", component: <Gantty /> },
  { path: "/Unauthorized", components: <Unauthorized /> },
];

export { authProtectedRoutes, publicRoutes };
