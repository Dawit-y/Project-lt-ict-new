import React from "react";
import { Card, CardBody, CardHeader, Row, Col, Badge, Table } from "reactstrap";
import {
	FaMoneyBillWave,
	FaUsers,
	FaMapMarkerAlt,
	FaCalendarAlt,
	FaInfoCircle,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const InfoItem = ({ label, value }) => (
	<div className="mb-3">
		<span
			className="text-muted d-block"
			style={{
				fontSize: "0.85rem",
				textTransform: "uppercase",
				fontWeight: "600",
			}}
		>
			{label}
		</span>
		<span className="fw-medium text-dark">{value || "-"}</span>
	</div>
);

const ProjectOverview = ({ data }) => {
	const { t } = useTranslation();
	const projectData = data?.data || {};

	return (
		<div className="project-overview-component space-y-4">
			<Row>
				<Col md={12}>
					<Card className="shadow-sm border-0 mb-4">
						<CardHeader className="bg-light p-3">
							<h5 className="mb-0 d-flex align-items-center gap-2">
								<FaInfoCircle />{" "}
								{t("general_information", "General Information")}
							</h5>
						</CardHeader>
						<CardBody>
							<Row>
								<Col md={4}>
									<InfoItem
										label={t("project_name", "Project Name")}
										value={projectData.prj_name}
									/>
								</Col>
								<Col md={4}>
									<InfoItem
										label={t("funding_agency", "Funding Agency")}
										value={projectData.prj_funding_agency}
									/>
								</Col>
								<Col md={4}>
									<InfoItem
										label={t("project_category", "Category")}
										value={projectData.project_category}
									/>
								</Col>
								<Col md={4}>
									<div className="mb-3">
										<span
											className="text-muted d-block"
											style={{
												fontSize: "0.85rem",
												textTransform: "uppercase",
												fontWeight: "600",
											}}
										>
											{t("status", "Status")}
										</span>
										<Badge color={projectData.color_code || "secondary"}>
											{projectData.status_name || "-"}
										</Badge>
									</div>
								</Col>
								<Col md={4}>
									<InfoItem
										label={t(
											"agreement_signed_level",
											"Agreement Signed Level",
										)}
										value={projectData.prj_agreement_signed_level}
									/>
								</Col>
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col md={6}>
					<Card className="shadow-sm border-0 mb-4 h-100">
						<CardHeader className="bg-light p-3">
							<h5 className="mb-0 d-flex align-items-center gap-2">
								<FaMoneyBillWave />{" "}
								{t("financial_details", "Financial Details")}
							</h5>
						</CardHeader>
						<CardBody>
							<Table borderless size="sm" className="mb-0">
								<tbody>
									<tr>
										<td className="text-muted">
											{t("total_estimate_budget", "Total Estimate Budget")}
										</td>
										<td className="text-end fw-bold text-dark">
											{Number(
												projectData.prj_total_estimate_budget || 0,
											).toLocaleString()}
										</td>
									</tr>
									<tr>
										<td className="text-muted">
											{t("total_actual_budget", "Total Actual Budget")}
										</td>
										<td className="text-end fw-bold text-dark">
											{Number(
												projectData.prj_total_actual_budget || 0,
											).toLocaleString()}
										</td>
									</tr>
									<tr>
										<td className="text-muted">
											{t("program_cost", "Program Cost")}
										</td>
										<td className="text-end fw-bold text-dark">
											{Number(
												projectData.prj_program_cost || 0,
											).toLocaleString()}
										</td>
									</tr>
									<tr>
										<td className="text-muted">
											{t("admin_cost", "Admin Cost")}
										</td>
										<td className="text-end fw-bold text-dark">
											{Number(projectData.prj_admin_cost || 0).toLocaleString()}
										</td>
									</tr>
								</tbody>
							</Table>
						</CardBody>
					</Card>
				</Col>

				<Col md={6}>
					<Card className="shadow-sm border-0 mb-4 h-100">
						<CardHeader className="bg-light text-dark p-3">
							<h5 className="mb-0 d-flex align-items-center gap-2">
								<FaUsers /> {t("beneficiaries", "Beneficiaries")}
							</h5>
						</CardHeader>
						<CardBody>
							<Table bordered size="sm" className="mb-0 text-center">
								<thead className="table-light">
									<tr>
										<th>{t("type", "Type")}</th>
										<th>{t("male", "Male")}</th>
										<th>{t("female", "Female")}</th>
										<th>{t("total", "Total")}</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="text-start text-muted">
											{t("direct_beneficiaries", "Direct")}
										</td>
										<td>
											{Number(
												projectData.prj_direct_ben_male || 0,
											).toLocaleString()}
										</td>
										<td>
											{Number(
												projectData.prj_direct_ben_female || 0,
											).toLocaleString()}
										</td>
										<td className="fw-bold">
											{Number(
												(projectData.prj_direct_ben_male || 0) +
													(projectData.prj_direct_ben_female || 0),
											).toLocaleString()}
										</td>
									</tr>
									<tr>
										<td className="text-start text-muted">
											{t("indirect_beneficiaries", "Indirect")}
										</td>
										<td>
											{Number(
												projectData.prj_indirect_ben_male || 0,
											).toLocaleString()}
										</td>
										<td>
											{Number(
												projectData.prj_indirect_ben_female || 0,
											).toLocaleString()}
										</td>
										<td className="fw-bold">
											{Number(
												(projectData.prj_indirect_ben_male || 0) +
													(projectData.prj_indirect_ben_female || 0),
											).toLocaleString()}
										</td>
									</tr>
								</tbody>
							</Table>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col md={6}>
					<Card className="shadow-sm border-0 mb-4">
						<CardHeader className="bg-light text-dark p-3">
							<h5 className="mb-0 d-flex align-items-center gap-2">
								<FaCalendarAlt /> {t("dates", "Dates")}
							</h5>
						</CardHeader>
						<CardBody>
							<Row>
								<Col sm={6}>
									<InfoItem
										label={t("start_date_plan_gc", "Planned Start Date")}
										value={projectData.prj_start_date_plan_gc}
									/>
								</Col>
								<Col sm={6}>
									<InfoItem
										label={t("agreement_signed_date", "Agreement Signed Date")}
										value={projectData.prj_date_agreement_signed}
									/>
								</Col>
							</Row>
						</CardBody>
					</Card>
				</Col>

				<Col md={6}>
					<Card className="shadow-sm border-0 mb-4">
						<CardHeader className="bg-light text-dark p-3">
							<h5 className="mb-0 d-flex align-items-center gap-2">
								<FaMapMarkerAlt /> {t("location", "Location")}
							</h5>
						</CardHeader>
						<CardBody>
							<Row>
								<Col sm={6}>
									<InfoItem
										label={t("zone_location", "Zone")}
										value={projectData.zone_location}
									/>
								</Col>
								<Col sm={6}>
									<InfoItem
										label={t("location_description", "Location Details")}
										value={projectData.prj_location_description}
									/>
								</Col>
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default ProjectOverview;
