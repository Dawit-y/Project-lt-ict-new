import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Spinner,
} from "reactstrap";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaDollarSign,
  FaCalendarAlt,
  FaPaperPlane,
} from "react-icons/fa";
import classnames from "classnames";

import ProjectOverview from "../../../Project/ProjectDetail/ProjectSummary";
import BudgetBreakdown from "./BudgetBreakdown";
import ForwardRequest from "../../../Requestfollowup";
import AttachedFiles from "./AttachedFiles";
import TextNotes from "./AttachedNotes";

import { useFetchBudgetRequest } from "../../../../queries/budget_request_query";
import { useFetchProject } from "../../../../queries/project_query";
import { useAuthUser } from "../../../../hooks/useAuthUser";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import Spinners from "../../../../components/Common/Spinner";
import ApproveModal from "./ApproveModal";

export default function BudgetApprovalPage() {
  const [activeTab, setActiveTab] = useState("budget");
  const [approvalStatus, setApprovalStatus] = useState("pending");
  const [approveModal, setApproveModal] = useState(false);
  const [action, setAction] = useState("approve");

  const toggleApproveModal = () => setApproveModal(!approveModal);

  const { departmentType } = useAuthUser();

  const { id } = useParams();
  const { userId } = useAuthUser();
  const { data, isLoading } = useFetchBudgetRequest(id, userId, true);
  const projectId = data?.data?.bdr_project_id;

  const { data: project, isLoading: isProjectLoading } = useFetchProject(
    projectId,
    userId,
    !!projectId,
  );

  const isDirector = departmentType === "directorate";
  const isDepartment = departmentType === "department";
  const isDepartmentLevel =
    departmentType === "department" || departmentType === "directorate";
  const isOfficerLevel =
    departmentType === "officer" || departmentType === "team";

  const isApproved = parseInt(data?.data?.bdr_request_status) === 3;
  const isRejected = parseInt(data?.data?.bdr_request_status) === 4;
  const isRequested = parseInt(data?.data?.bdr_request_status) === 1;

  const handleApproval = (event) => {
    setAction(event.target.name);
    toggleApproveModal();
  };

  return (
		<>
			<ApproveModal
				isOpen={approveModal}
				toggle={toggleApproveModal}
				action={action}
				request={data?.data ?? {}}
			/>
			<div className="page-content card">
				<Breadcrumb />
				<div className="min-h-screen p-4 card-body">
					{isLoading || isProjectLoading ? (
						<div className="w-full h-full d-flex align-items-center justify-content-center">
							<Spinner color="primary" />
						</div>
					) : (
						<div className="space-y-4">
							{/* Header Section */}
							<div className="d-flex justify-content-between align-items-center">
								<div>
									<h1 className="h3 fw-bold text-dark">
										{project?.data?.prj_name || ""}
									</h1>
									<p className="text-muted">
										{project?.data?.description || "No description provided."}
									</p>
								</div>
								<div className="d-flex gap-2">
									<Badge color={project?.data?.color_code}>
										{project?.data?.status_name.toUpperCase()}
									</Badge>
									<Badge color="info">{project?.data?.prj_code}</Badge>
								</div>
							</div>
							{/* Quick Actions Bar */}
							<Card
								className={`border-start border-${data?.data?.color_code} shadow-md`}
							>
								<CardBody className="d-flex justify-content-between align-items-center">
									<div className="d-flex align-items-center gap-3">
										<div className="d-flex align-items-center gap-2">
											<FaDollarSign className="text-success" />
											<span className="fw-semibold">
												{parseFloat(
													data?.data.bdr_requested_amount
												).toLocaleString()}
											</span>
										</div>
										<div className="vr" />
										<div className="d-flex align-items-center gap-2">
											<FaCalendarAlt className="text-primary" />
											<span>Budget Year {data?.data?.budget_year}</span>
										</div>
										<div className="vr" />
										<div className="d-flex align-items-center gap-2">
											<FaClock className="text-warning" />
											<span>
												Requested: {data?.data?.bdr_requested_date_gc}
											</span>
										</div>
									</div>
									{isDepartmentLevel && !isApproved && !isRejected ? (
										<div className="d-flex gap-2">
											{!isDepartment && (
												<Button
													color="success"
													onClick={handleApproval}
													name="recommend"
												>
													<FaCheckCircle className="me-1" />
													Recommend
												</Button>
											)}
											{!isDirector && (
												<Button
													color="success"
													onClick={handleApproval}
													name="approve"
												>
													<FaCheckCircle className="me-1" />
													Approve
												</Button>
											)}

											<Button
												color="danger"
												onClick={handleApproval}
												name="reject"
											>
												<FaTimesCircle className="me-1" />
												Reject
											</Button>
											<Button
												color="secondary"
												onClick={() => setActiveTab("forward")}
											>
												<FaPaperPlane className="me-1" />
												Forward
											</Button>
										</div>
									) : (
										<Badge color={data?.data?.color_code} pill>
											{isRejected ? (
												<FaTimesCircle className="me-1" />
											) : (
												<FaCheckCircle className="me-1" />
											)}
											{data?.data?.status_name}
										</Badge>
									)}
								</CardBody>
							</Card>

							{/* Main Content Tabs */}
							<div>
								<Nav tabs className="nav-tabs-custom">
									{["budget", "overview", "forward", "files", "notes"].map(
										(tab) => (
											<NavItem key={tab}>
												<NavLink
													className={classnames({ active: activeTab === tab })}
													onClick={() => setActiveTab(tab)}
													style={{ cursor: "pointer" }}
												>
													{tab === "budget" && "Budget Details"}
													{tab === "overview" && "Project Overview"}
													{tab === "forward" && "Forward Request"}
													{tab === "files" && "Attached Files"}
													{tab === "notes" && "Attached Notes"}
												</NavLink>
											</NavItem>
										)
									)}
								</Nav>
								<TabContent activeTab={activeTab} className="mt-3">
									<TabPane tabId="budget">
										<BudgetBreakdown
											request={data?.data ?? {}}
											isActive={!isLoading}
										/>
									</TabPane>
									<TabPane tabId="overview">
										<ProjectOverview data={project} />
									</TabPane>
									<TabPane tabId="forward">
										<ForwardRequest
											request={data?.data ?? {}}
											isActive={activeTab === "forward"}
										/>
									</TabPane>
									<TabPane tabId={"files"}>
										<AttachedFiles
											requestData={data?.data ?? {}}
											isActive={activeTab === "files"}
										/>
									</TabPane>
									<TabPane tabId={"notes"}>
										<TextNotes
											requestData={data?.data ?? {}}
											isActive={activeTab === "notes"}
										/>
									</TabPane>
								</TabContent>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
