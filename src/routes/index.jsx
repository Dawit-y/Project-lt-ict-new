import React, { lazy } from "react";
import { Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard/index";
import Login from "../pages/Authentication/Login";
// add Unauthorized page
import Unauthorized from "../components/Common/NotFound";
import { components } from "react-select";
import UsersProfile from "../pages/Profile";
import ProjectPaymentList from "../pages/Projectpayment/ProjectPaymentList";

const Calendar = lazy(() => import("../pages/Calendar/index"));
const ProjectLists = lazy(() =>
  import("../pages/Projects/ProjectStatusLists/index")
);
const ProjectsTreeView = lazy(() => import("../pages/ProjectStatusTree/index"));
const Logout = lazy(() => import("../pages/Authentication/Logout"));
const Register = lazy(() => import("../pages/Authentication/Register"));
const ForgetPwd = lazy(() => import("../pages/Authentication/ForgetPassword"));

const AddressStructure = lazy(() =>
  import("../pages/AddressTreeStructure/index")
);
const ViewProjectPage = lazy(() =>
  import("../pages/Projects/ProjectStatusLists/ViewProjectPage")
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
import ProjectOverview from "../pages/Project/ProjectOverview";
import ProjectsLocation from "../pages/ProjectsLocation";

import Gantty from "../pages/GanttChart/index";
import StatisticalReport from "../pages/StatistaicalReport";
//Newly added
import ExpenditureCode from '../pages/Expenditurecode/index';
import ProjectBudgetExpenditure from '../pages/Projectbudgetexpenditure/index';
import ProjectEmployee from '../pages/Projectemployee/index';
import ProjectHandover from '../pages/Projecthandover/index';
import ProjectPerformance from '../pages/Projectperformance/index';
import ProjectPerformanceList from '../pages/Projectperformance/ProjectperformanceList';
import ProjectHandoverList from '../pages/Projecthandover/ProjectHandoverList';
import ProjectBudgetExpenditureList from '../pages/Projectbudgetexpenditure/ProjectBudgetExpenditureList';
import ProjectBudgetSourceList from '../pages/Projectbudgetsource/ProjectBudgetSourceList';
import ProjectVariationList from '../pages/Projectvariation/ProjectVariationList';
import ProjectSupplimentaryList from '../pages/Projectsupplimentary/ProjectSupplimentaryList';

import ProjectPlan from '../pages/Projectplan/index';
import ProjectSupplimentary from '../pages/Projectsupplimentary/index';
import ProjectVariation from '../pages/Projectvariation/index';

const authProtectedRoutes = [
  {path: '/expenditure_code', component: <ExpenditureCode/> },
  {path: '/project_budget_expenditure', component: <ProjectBudgetExpenditure/> },
   {path: '/project_employee', component: <ProjectEmployee/> },
  {path: '/project_handover', component: <ProjectHandover/> },
  {path: '/project_performance', component: <ProjectPerformance/> },
  {path: '/project_performance_list', component: <ProjectPerformanceList/> },
  {path: '/project_handover_list', component: <ProjectHandoverList/> },
  {path: '/project_budget_expenditure_list', component: <ProjectBudgetExpenditureList/> },
  {path: '/project_budget_source_list', component: <ProjectBudgetSourceList/> },
  {path: '/project_variation_list', component: <ProjectVariationList/> },
  {path: '/project_supplimentary_list', component: <ProjectSupplimentaryList/> },
  
//  {path: '/project_plan', component: <ProjectPlan/> },
  {
    path: '/project/:prj_code/project_plan',
    component: <ProjectPlan />,
  },
  {path: '/project_supplimentary', component: <ProjectSupplimentary/> },
 {path: '/project_variation', component: <ProjectVariation/> },
  { path: "/dash", components: <Dashboardcard /> },
  { path: "/dashboard", component: <Dashboard /> },
  //File Manager
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

  // //calendar
  { path: "/calendar", component: <Calendar /> },

  { path: "/projects-status", component: <ProjectLists /> },
  { path: "/view-project", component: <ViewProjectPage /> },

  { path: "/project_status", component: <ProjectStatus /> },
  { path: "/sector_category", component: <SectorCategory /> },
  { path: "/users", component: <Users /> },
  { path: "/user_role", component: <UserRole /> },
  { path: "/roles", component: <Roles /> },
  { path: "/sector_information", component: <SectorInformation /> },
  { path: "/project_stakeholder", component: <ProjectStakeholder /> },
  { path: "/stakeholder_type", component: <StakeholderType /> },
  { path: "/document_type", component: <DocumentType /> },
  { path: "/project", component: <Project /> },
  { path: "/Project/:id", component: <ProjectOverview /> },
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
  { path: "/project_overview", component: <ProjectOverview /> },
  { path: "/projects_location", component: <ProjectsLocation /> },
  { path: "/statistaical_report", component: <StatisticalReport /> },

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

// export { authProtectedRoutes, publicRoutes };
export { authProtectedRoutes, publicRoutes };
