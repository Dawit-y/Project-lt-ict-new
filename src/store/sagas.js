import { all, fork } from "redux-saga/effects";

//public
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import LayoutSaga from "./layout/saga";
import ProjectStatusSaga from "./projects/saga";
import calendarSaga from "./calendar/saga";
// import chatSaga from "./chat/saga";
// import cryptoSaga from "./crypto/saga";
import invoiceSaga from "./invoices/saga";
// import jobsSaga from "./jobs/saga";
// import projectsSaga from "./projects/saga";
import tasksSaga from "./tasks/saga";
import mailsSaga from "./mails/saga";

import watchSearchSaga from "./search/sagas";
import treeSaga from "./tree/saga";

import DocumentTypesaga from "./documenttype/saga";
import Projectsaga from "./project/saga";
import ProjectCategorysaga from "./projectcategory/saga";
import ProjectContractorsaga from "./projectcontractor/saga";
import ProjectDocumentsaga from "./projectdocument/saga";
import ProjectPaymentsaga from "./projectpayment/saga";
import Pagessaga from "./pages/saga";
import Permissionsaga from "./permission/saga";
import ProjectStatussaga from "./projectstatus/saga";
import ProjectStakeholdersaga from "./projectstakeholder/saga";
import Rolessaga from "./roles/saga";
import SectorCategorysaga from "./sectorcategory/saga";
import SectorInformationsaga from "./sectorinformation/saga";
import StakeholderTypesaga from "./stakeholdertype/saga";
import Userssaga from "./users/saga";
import UserRolesaga from "./userrole/saga";

import Departmentsaga from "./department/saga";
import BudgetSourcesaga from "./budgetsource/saga";
import AccessLogsaga from "./accesslog/saga";
import BudgetYearsaga from "./budgetyear/saga";
import ContractTerminationReasonsaga from "./contractterminationreason/saga";
import ContractorTypesaga from "./contractortype/saga";
import BudgetRequestsaga from "./budgetrequest/saga";
import notificationSaga from "./notification/saga";

// import AccessLogsaga from './accesslog/saga';

export default function* rootSaga() {
  yield all([
    //public
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(ProjectStatusSaga),
    fork(calendarSaga),

    fork(mailsSaga),

    fork(invoiceSaga),

    fork(tasksSaga),

    fork(watchSearchSaga),
    fork(treeSaga),
    fork(DocumentTypesaga),
    fork(Projectsaga),
    fork(ProjectCategorysaga),
    fork(ProjectContractorsaga),
    fork(ProjectDocumentsaga),
    fork(ProjectPaymentsaga),
    fork(Pagessaga),
    fork(Permissionsaga),
    fork(ProjectStatussaga),
    fork(ProjectStakeholdersaga),
    fork(Rolessaga),
    fork(SectorCategorysaga),
    fork(SectorInformationsaga),
    fork(StakeholderTypesaga),
    fork(UserRolesaga),
    fork(Userssaga),

    fork(Departmentsaga),
    fork(BudgetSourcesaga),
    fork(AccessLogsaga),
    fork(BudgetYearsaga),
    fork(BudgetRequestsaga),
    fork(ContractTerminationReasonsaga),
    fork(ContractorTypesaga),
    fork(DocumentTypesaga),
    fork(notificationSaga),
  ]);
}
