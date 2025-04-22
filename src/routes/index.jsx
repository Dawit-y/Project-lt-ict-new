import React, { lazy } from "react";
import { Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard/index";
import Login from "../pages/Authentication/CsoLogin.jsx";
import CsoRegister from "../pages/Authentication/CsoRegister.jsx";
import { components } from "react-select";
import ResetPassword from "../pages/Authentication/ResetPassword.jsx";
import ResetPasswordForm from "../pages/Authentication/ResetPasswordForm.jsx";
import LandingPage from "../pages/Landing/index";
const UsersProfile = lazy(() => import("../pages/Profile"));
const ProjectPaymentList = lazy(() =>
  import("../pages/Projectpayment/ProjectPaymentList")
);
const ProjectsTreeView = lazy(() => import("../pages/ProjectStatusTree/index"));
const Logout = lazy(() => import("../pages/Authentication/Logout"));

const AddressStructure = lazy(() =>
  import("../pages/AddressTreeStructure/index2.jsx")
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
const DateSetting = lazy(() => import("../pages/Datesetting/index"));
const CSOInformation = lazy(() => import("../pages/Csoinfo/index"));
const CSOProject = lazy(() => import("../pages/Csoproject/index.jsx"));
const CSOProjectList = lazy(() => import("../pages/Csoproject/ProjectList"));
const CSOProjectDetail = lazy(() => import("../pages/Csoproject/ProjectDetail/index2.jsx"));
const CSOBudgetRequestListModel = lazy(() =>
  import("../pages/Csobudgetrequest/BudgetRequestList.jsx")
);
const CSOApproverBudgetRequestList = lazy(() =>
  import("../pages/Csobudgetrequest/ApproverBudgetRequestList.jsx")
);
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
const ApproverBudgetRequestList = lazy(() =>
  import("../pages/Budgetrequest/ApproverBudgetRequestList")
);
const BudgetRequest = lazy(() => import("../pages/Budgetrequest/index"));
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
const Notifications = lazy(() => import("../pages/notifications"));
const ProjectDetail = lazy(() => import("../pages/Project/ProjectDetail"));
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
const ProjectList = lazy(() => import("../pages/Project/ProjectList"));

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
const ProjectDocumentList = lazy(() =>
  import("../pages/Projectdocument/ProjectDocumentList")
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
const ProjectPlanList = lazy(() =>
  import("../pages/Projectplan/ProjectPlanList")
);
const BudgetMonth = lazy(() => import("../pages/Budgetmonth/index"));
const ProjectPlan = lazy(() => import("../pages/Projectplan/index"));
const ProjectSupplimentary = lazy(() =>
  import("../pages/Projectsupplimentary/index")
);
const SupersetDashboard = lazy(() =>
  import("../pages/Dashboard/SupersetDashboard")
);
const ProjectVariation = lazy(() => import("../pages/Projectvariation/index"));
const EmailInformation = lazy(() => import("../pages/Emailinformation/index"));
const EmailTemplate = lazy(() => import("../pages/Emailtemplate/index"));
const SmsInformation = lazy(() => import("../pages/Smsinformation/index"));
const SmsTemplate = lazy(() => import("../pages/Smstemplate/index"));
const BudgetRequestAmount = lazy(() =>
  import("../pages/Budgetrequestamount/index")
);
const BudgetRequestTask = lazy(() =>
  import("../pages/Budgetrequesttask/index")
);
const BudgetExSource = lazy(() => import("../pages/Budgetexsource/index"));
const BudgetExipDetail = lazy(() => import("../pages/Budgetexipdetail/index"));
const PaymentCategory = lazy(() => import("../pages/Paymentcategory/index"));

const ConversationInformation = lazy(() =>
  import("../pages/Conversationinformation/index")
);
const RequestInformation = lazy(() =>
  import("../pages/Requestinformation/index")
);
const RequestStatus = lazy(() => import("../pages/Requeststatus/index"));
const ProposalRequest = lazy(() => import("../pages/Proposalrequest/index"));
const RequestCategory = lazy(() => import("../pages/Requestcategory/index"));

const ConversationInformationList = lazy(() =>
  import("../pages/Conversationinformation/ConversationInformationList")
);
const RequestInformationList = lazy(() =>
  import("../pages/Requestinformation/RequestInformationList")
);
const ProposalRequestList = lazy(() =>
  import("../pages/Proposalrequest/ProposalRequestList")
);
const SupersetListReport = lazy(() =>
  import("../pages/Report/SupersetListReport")
);
const CitizenshipProject = lazy(() =>
  import("../pages/Citizenshipproject/index.jsx")
);
const CitizenshipProjectList = lazy(() =>
  import("../pages/Citizenshipproject/ProjectList.jsx")
);
const CitizenshipProjectDetail = lazy(() =>
  import("../pages/Citizenshipproject/ProjectDetail/index.jsx")
);
const ProcurementinformationList = lazy(() => import('../pages/Procurementinformation/ProcurementInformationList'));
const ProcurementInformation = lazy(() => import('../pages/Procurementinformation/index'));
const ProcurementMethod = lazy(() => import('../pages/Procurementmethod/index'));
const ProcurementParticipant = lazy(() => import('../pages/Procurementparticipant/index'));
const ProcurementStage = lazy(() => import('../pages/Procurementstage/index'));
const MonitoringEvaluationType = lazy(() => import('../pages/Monitoringevaluationtype/index'));
const ProjectMonitoringEvaluation = lazy(() => import('../pages/Projectmonitoringevaluation/index'));
const MonitoringEvaluationTypeList = lazy(() => import('../pages/Monitoringevaluationtype/MonitoringEvaluationTypeList'));
const ProjectMonitoringEvaluationList = lazy(() => import('../pages/Projectmonitoringevaluation/ProjectMonitoringEvaluationList'));

const authProtectedRoutes = [
  // { path: '/monitoring_evaluation_type_list', component: <MonitoringEvaluationTypeList/> },
  { path: '/monitoring_evaluation_list', component: <ProjectMonitoringEvaluationList /> },
  { path: '/monitoring_evaluation_type', component: <MonitoringEvaluationType /> },
  { path: '/project_monitoring_evaluation', component: <ProjectMonitoringEvaluation /> },
  { path: "/cso_information", component: <CSOInformation /> },
  { path: "/project_cso", component: <CSOProject /> },
  { path: "/project_cso_list", component: <CSOProjectList /> },
  { path: "/projectdetail_cso/:id", component: <CSOProjectDetail /> },
  { path: "/cso_proposal_request", component: <CSOBudgetRequestListModel /> },
  {
    path: "/cso_proposal_request_approval",
    component: <CSOApproverBudgetRequestList />,
  },
  { path: "/date_setting", component: <DateSetting /> },
  { path: "/conversation_information", component: <ConversationInformation /> },
  { path: "/superset_list_report", component: <SupersetListReport /> },
  { path: "/request_information", component: <RequestInformation /> },
  { path: "/request_status", component: <RequestStatus /> },
  { path: "/proposal_request", component: <ProposalRequest /> },
  { path: "/request_category", component: <RequestCategory /> },
  { path: "/supersetdashboard", component: <SupersetDashboard /> },
  { path: "/expenditure_code", component: <ExpenditureCode /> },
  { path: "/project_employee", component: <ProjectEmployee /> },
  { path: "/project_handover", component: <ProjectHandover /> },
  { path: "/project_performance", component: <ProjectPerformance /> },
  { path: "/project_performance_list", component: <ProjectPerformanceList /> },
  { path: "/project_handover_list", component: <ProjectHandoverList /> },

  {
    path: "/conversation_information_list",
    component: <ConversationInformationList />,
  },
  { path: "/request_information_list", component: <RequestInformationList /> },
  { path: "/proposal_request_list", component: <ProposalRequestList /> },

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
  { path: "/project_document_list", component: <ProjectDocumentList /> },
  { path: "/project_employee_list", component: <ProjectEmployeeList /> },
  { path: "/project_stakeholder_list", component: <ProjectStakeholderList /> },
  { path: "/project_contractor_list", component: <ProjectContractorList /> },
  { path: "/project_budget_plan_list", component: <ProjectBudgetPlanList /> },
  { path: "/project_budget_plan", component: <ProjectBudgetPlan /> },
  { path: "/budget_month", component: <BudgetMonth /> },
  { path: "/project_supplimentary", component: <ProjectSupplimentary /> },
  { path: "/project_variation", component: <ProjectVariation /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/Project-Tree", component: <ProjectsTreeView /> },
  { path: "/address_structure", component: <AddressStructure /> },
  { path: "/department", component: <Department /> },
  { path: "/budget_request", component: <BudgetRequestListModel /> },
  {
    path: "/budget_request_approval",
    component: <ApproverBudgetRequestList />,
  },
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
  { path: "/Project", component: <Project /> },
  { path: "/project_list", component: <ProjectList /> },
  { path: "/projectdetail/:id", component: <ProjectDetail /> },
  { path: "/Project/:id/project_plan", component: <ProjectPlan /> },
  { path: "/Project/:id/budget_request", component: <BudgetRequest /> },
  {
    path: "/Project/:id/budget_expenditure",
    component: <ProjectBudgetExpenditure />,
  },
  { path: "/citizenship_project", component: <CitizenshipProject /> },
  { path: "/citizenship_project_list", component: <CitizenshipProjectList /> },
  {
    path: "/citizenship_project_detail/:id",
    component: <CitizenshipProjectDetail />,
  },
  { path: "/project_plan_list", component: <ProjectPlanList /> },
  { path: "/project_category", component: <ProjectCategory /> },
  { path: "/project_contractor", component: <ProjectContractor /> },
  { path: "/project_document", component: <ProjectDocument /> },
  { path: "/project_payment", component: <ProjectPayment /> },
  { path: "/pages", component: <Pages /> },
  { path: "/permission", component: <Permission /> },
  { path: "/notifications", component: <Notifications /> },
  { path: "/profile", component: <UsersProfile /> },
  { path: "/project_payment_list", component: <ProjectPaymentList /> },
  { path: "/projects_location", component: <ProjectsLocation /> },
  { path: "/statistical_report", component: <StatisticalReport /> },
  { path: "/report", component: <Report /> },
  { path: "/email_information", component: <EmailInformation /> },
  { path: "/email_template", component: <EmailTemplate /> },
  { path: "/sms_information", component: <SmsInformation /> },
  { path: "/sms_template", component: <SmsTemplate /> },
  { path: "/budget_request_amount", component: <BudgetRequestAmount /> },
  { path: "/budget_request_task", component: <BudgetRequestTask /> },
  { path: "/budget_ex_source", component: <BudgetExSource /> },
  { path: "/budget_exip_detail", component: <BudgetExipDetail /> },
  { path: "/payment_category", component: <PaymentCategory /> },
  { path: '/procurement_information', component: <ProcurementInformation /> },
  { path: '/procurement_method', component: <ProcurementMethod /> },
  { path: '/procurement_participant', component: <ProcurementParticipant /> },
  { path: '/procurement_stage', component: <ProcurementStage /> },
  { path: '/procurement_list', component: <ProcurementinformationList /> },
  //   // this route should be at the end of all other routes
  //   // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },

];

const publicRoutes = [
  { path: "/", component: <LandingPage /> },
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/register", component: <CsoRegister /> },
  { path: "/forgot_password", component: <ResetPassword /> },
  { path: "/reset_password", component: <ResetPasswordForm /> },
];

export { authProtectedRoutes, publicRoutes };
