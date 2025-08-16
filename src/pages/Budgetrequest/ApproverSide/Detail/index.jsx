import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "reactstrap";
import { TabWrapper } from "../../../../components/Common/DetailViewWrapper";
import RequestFollowupModel from "../../../Requestfollowup";
import ApproveDecline from "./ApproveDecline";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import { useFetchBudgetRequest } from "../../../../queries/budget_request_query";
import { useAuthUser } from "../../../../hooks/useAuthUser";
import Spinners from "../../../../components/Common/Spinner";

const ApproverBudgetRequestDetail = () => {
	const { id } = useParams();
	const { t } = useTranslation();
	const { userId } = useAuthUser();
	const { data, isLoading } = useFetchBudgetRequest(id, userId, true);

	const tabs = [
		{
			id: "approve/reject",
			label: `Actions`,
			content: <ApproveDecline request={data?.data || {}} />,
		},
		{
			id: "request_followup",
			label: `Forward Request`,
			content: <RequestFollowupModel request={data?.data || {}} />,
		},
	];

	return (
		<div className="page-content">
			<div className="container-fluid">
				<Breadcrumb />
				{isLoading ? (
					<Spinners />
				) : (
					<Card>
						<CardBody>
							<TabWrapper tabs={tabs} />
						</CardBody>
					</Card>
				)}
			</div>
		</div>
	);
};

export default ApproverBudgetRequestDetail;
