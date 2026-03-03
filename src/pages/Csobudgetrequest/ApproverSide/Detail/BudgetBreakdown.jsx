import { useMemo } from "react";
import {
	Row,
	Col,
	Card,
	CardBody,
	CardHeader,
	Badge,
	Table,
	Progress,
} from "reactstrap";
import { FaCheckCircle } from "react-icons/fa";
import Chart from "react-apexcharts";
import { useFetchRequestCategorys } from "../../../../queries/requestcategory_query";
import { useTranslation } from "react-i18next";
import { createMultiLangKeyValueMap } from "../../../../utils/commonMethods";
import { statusColorMap } from ".";

export const calculateProgressPercent = (value, total) => {
	if (value == null || total == null) return null;
	if (isNaN(parseFloat(value)) || isNaN(parseFloat(total))) return null;
	if (parseFloat(total) === 0) return null;
	return (parseFloat(value) / parseFloat(total)) * 100;
};

export const formatMoney = (value, withSymbol = true) => {
	if (value == null || isNaN(parseFloat(value))) return "-";
	const formatted = parseFloat(value).toLocaleString();
	return withSymbol ? `ETB ${formatted}` : formatted;
};

export const formatNumber = (value, unit = "") => {
	if (value == null || isNaN(parseFloat(value))) return "—";
	return `${parseFloat(value).toLocaleString()}${unit ? unit : ""}`;
};

export const getSafeValue = (value, fallback = "—") => {
	return value != null ? value : fallback;
};

export default function BudgetBreakdown({
	request: requestData,
	projectData,
	isActive,
}) {
	const { t, i18n } = useTranslation();

	const { data: requestCategories } = useFetchRequestCategorys();
	const bgCategoryMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			requestCategories?.data || [],
			"rqc_id",
			{
				en: "rqc_name_en",
				am: "rqc_name_am",
				or: "rqc_name_or",
			},
			i18n.language,
		);
	}, [requestCategories, i18n.language]);

	return (
		<>
			<div className="d-flex flex-column gap-4">
				{/* Request Details Card */}
				<Card>
					<CardHeader className="bg-light">
						<div className="d-flex justify-content-between align-items-center">
							<div>
								<h5 className="mb-1">{t("budget_request_information")}</h5>
							</div>
						</div>
					</CardHeader>
					<CardBody>
						<Row>
							<Col md={6}>
								<Table borderless className="mb-0">
									<tbody>
										<tr>
											<td className="fw-bold text-muted">
												{t("request_type")}:
											</td>
											<td>{getSafeValue(requestData?.request_type)}</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">{t("status")}:</td>
											<td>
												<Badge
													color={
														statusColorMap[requestData?.bdr_request_status] ||
														"secondary"
													}
												>
													<FaCheckCircle className="me-1" />
													{getSafeValue(requestData?.status_name, t("unknown"))}
												</Badge>
											</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("request_category")}:
											</td>
											<td>
												{getSafeValue(
													bgCategoryMap[requestData?.bdr_request_category_id],
													t("not_specified"),
												)}
											</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("bdr_additional_days")}:
											</td>
											<td>
												{getSafeValue(
													bgCategoryMap[requestData?.bdr_additional_days],
													0,
												)}
											</td>
										</tr>
									</tbody>
								</Table>
							</Col>
							<Col md={6}>
								<Table borderless className="mb-0">
									<tbody>
										<tr>
											<td className="fw-bold text-muted">
												{t("requested_date")}:
											</td>
											<td>
												{getSafeValue(
													requestData?.bdr_requested_date_gc,
													t("no_date"),
												)}
											</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("Action Date")}:
											</td>
											<td>
												{getSafeValue(
													requestData?.bdr_released_date_gc,
													t("no_date"),
												)}
											</td>
										</tr>
										<tr>
											<td className="fw-bold text-muted">
												{t("action_remark")}:
											</td>
											<td>
												{getSafeValue(
													requestData?.bdr_action_remark,
													t("no_remarks"),
												)}
											</td>
										</tr>
									</tbody>
								</Table>
							</Col>
						</Row>
					</CardBody>
				</Card>
			</div>
		</>
	);
}
