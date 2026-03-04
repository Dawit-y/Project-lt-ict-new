import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody, Row, Col, Table } from "reactstrap";
import { useTranslation } from "react-i18next";

const CsoReportDetailModal = ({ isOpen, toggle, report, reportTypes }) => {
	const { t } = useTranslation();

	if (!report) return null;

	const reportType = reportTypes[report.rpt_type_id] || { name: "-" };

	return (
		<Modal isOpen={isOpen} toggle={toggle} className="modal-lg" centered>
			<ModalHeader toggle={toggle}>{t("report_details")}</ModalHeader>
			<ModalBody>
				<Table bordered responsive className="mb-0">
					<tbody>
						<tr>
							<th className="bg-light" style={{ width: "40%" }}>
								{t("report_name")}
							</th>
							<td>{report.rpt_name || "-"}</td>
						</tr>
						<tr>
							<th className="bg-light">{t("report_type")}</th>
							<td>{reportType.name}</td>
						</tr>
						<tr>
							<th className="bg-light">{t("report_date")}</th>
							<td>{report.rpt_report_date || "-"}</td>
						</tr>
						<tr>
							<th className="bg-light">{t("description")}</th>
							<td style={{ whiteSpace: "pre-wrap" }}>
								{report.rpt_description || "-"}
							</td>
						</tr>
					</tbody>
				</Table>
			</ModalBody>
		</Modal>
	);
};

CsoReportDetailModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
	report: PropTypes.object,
	reportTypes: PropTypes.object.isRequired,
};

export default CsoReportDetailModal;
