import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
	Button,
	Modal,
	ModalBody,
	Col,
	Row,
	Card,
	CardBody,
	Badge,
} from "reactstrap";
import {
	FaWindowClose,
	FaMoneyBillWave,
	FaChartLine,
	FaBuilding,
	FaCalendar,
	FaInfoCircle,
} from "react-icons/fa";

const modalStyle = {
	width: "100%",
};

const BudgetRequestModal = ({
	isOpen,
	toggle,
	transaction,
	requestCatagoryMap,
	projectStatusMap,
}) => {
	const { t } = useTranslation();

	if (!transaction) return null;

	// Format currency values
	const formatCurrency = (value) => {
		if (value === null || value === undefined) return "N/A";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "ETB",
			minimumFractionDigits: 2,
		}).format(value);
	};

	return (
		<Modal
			isOpen={isOpen}
			centered
			className="modal-xl"
			toggle={toggle}
			style={modalStyle}
		>
			<div className="p-3 d-flex justify-content-between align-items-center rounded border-bottom">
				<div className="d-flex align-items-center gap-3">
					<FaMoneyBillWave className="fs-3 text-primary" />
					<div>
						<h5 className="modal-title mb-0">
							{t("view_detail") || "Budget Request Details"}
						</h5>
						<small className="text-muted">
							Project Budget Request Information
						</small>
					</div>
				</div>
				<Col className="d-flex align-items-center justify-content-end gap-2">
					<Button
						color="secondary"
						onClick={toggle}
						className="d-flex align-items-center gap-2"
					>
						<FaWindowClose />
						Close
					</Button>
				</Col>
			</div>

			<ModalBody className="bg-light">
				<div className="py-3">
					{/* Project Information Section */}
					<Card className="mb-4 shadow-sm">
						<CardBody>
							<h6 className="card-title d-flex align-items-center gap-2 text-primary mb-3">
								<FaBuilding className="fs-5" />
								Project Information
							</h6>
							<Row>
								<Col md={6} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Project Name
										</small>
										<span className="fs-6">
											{transaction.prj_name || "N/A"}
										</span>
									</div>
								</Col>
								<Col md={6} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">Sector</small>
										<span className="fs-6">
											{transaction.sector_name || "N/A"}
										</span>
									</div>
								</Col>
								<Col md={6} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Budget Year
										</small>
										<span className="fs-6">
											{transaction.bdy_name || "N/A"}
										</span>
									</div>
								</Col>
								<Col md={6} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">Status</small>
										<Badge color="success" className="fs-6">
											{transaction.status_name || "N/A"}
										</Badge>
									</div>
								</Col>
							</Row>
						</CardBody>
					</Card>

					{/* Performance Metrics Section */}
					<Card className="mb-4 shadow-sm">
						<CardBody>
							<h6 className="card-title d-flex align-items-center gap-2 text-primary mb-3">
								<FaChartLine className="fs-5" />
								Performance Metrics
							</h6>
							<Row>
								<Col md={6} lg={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Before Previous Year - Physical
										</small>
										<span className="fs-6">
											{transaction.bdr_before_previous_year_physical || 0}
										</span>
									</div>
								</Col>
								<Col md={6} lg={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Before Previous Year - Financial
										</small>
										<span className="fs-6">
											{formatCurrency(
												transaction.bdr_before_previous_year_financial
											)}
										</span>
									</div>
								</Col>
								<Col md={6} lg={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Previous Year - Physical
										</small>
										<span className="fs-6">
											{transaction.bdr_previous_year_physical || 0}
										</span>
									</div>
								</Col>
								<Col md={6} lg={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Previous Year - Financial
										</small>
										<span className="fs-6">
											{formatCurrency(transaction.bdr_previous_year_financial)}
										</span>
									</div>
								</Col>
								<Col md={6} lg={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Physical Baseline
										</small>
										<span className="fs-6">
											{transaction.bdr_physical_baseline || 0}
										</span>
									</div>
								</Col>
								<Col md={6} lg={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Financial Baseline
										</small>
										<span className="fs-6">
											{formatCurrency(transaction.bdr_financial_baseline)}
										</span>
									</div>
								</Col>
								<Col md={6} lg={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Physical Planned
										</small>
										<span className="fs-6">
											{transaction.bdr_physical_planned || 0}
										</span>
									</div>
								</Col>
								<Col md={6} lg={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Additional Days
										</small>
										<span className="fs-6">
											{transaction.bdr_additional_days || 0}
										</span>
									</div>
								</Col>
							</Row>
						</CardBody>
					</Card>

					{/* Budget Sources Section */}
					<Card className="mb-4 shadow-sm">
						<CardBody>
							<h6 className="card-title d-flex align-items-center gap-2 text-primary mb-3">
								<FaInfoCircle className="fs-5" />
								Budget Sources
							</h6>
							<Row>
								<Col md={6} lg={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Government Requested
										</small>
										<span className="fs-6">
											{formatCurrency(
												transaction.bdr_source_government_requested
											)}
										</span>
									</div>
								</Col>
								<Col md={6} lg={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Internal Requested
										</small>
										<span className="fs-6">
											{formatCurrency(
												transaction.bdr_source_internal_requested
											)}
										</span>
									</div>
								</Col>
								<Col md={6} lg={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Support Requested
										</small>
										<span className="fs-6">
											{formatCurrency(transaction.bdr_source_support_requested)}
										</span>
									</div>
								</Col>
								<Col md={6} lg={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Credit Requested
										</small>
										<span className="fs-6">
											{formatCurrency(transaction.bdr_source_credit_requested)}
										</span>
									</div>
								</Col>
								<Col md={6} lg={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Other Requested
										</small>
										<span className="fs-6">
											{formatCurrency(transaction.bdr_source_other_requested)}
										</span>
									</div>
								</Col>
							</Row>
						</CardBody>
					</Card>

					{/* Financial Summary Section */}
					<Card className="mb-4 shadow-sm">
						<CardBody>
							<h6 className="card-title d-flex align-items-center gap-2 text-primary mb-3">
								<FaMoneyBillWave className="fs-5" />
								Financial Summary
							</h6>
							<Row>
								<Col md={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Requested Amount
										</small>
										<span className="fs-6 text-primary fw-bold">
											{formatCurrency(transaction.bdr_requested_amount)}
										</span>
									</div>
								</Col>
								<Col md={4} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Released Amount
										</small>
										<span className="fs-6 text-success fw-bold">
											{formatCurrency(transaction.bdr_released_amount)}
										</span>
									</div>
								</Col>
							</Row>
						</CardBody>
					</Card>

					{/* Request Details Section */}
					<Card className="mb-4 shadow-sm">
						<CardBody>
							<h6 className="card-title d-flex align-items-center gap-2 text-primary mb-3">
								<FaCalendar className="fs-5" />
								Request Details
							</h6>
							<Row>
								<Col md={6} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Request Type
										</small>
										<span className="fs-6">
											{projectStatusMap[transaction.bdr_request_type] || "N/A"}
										</span>
									</div>
								</Col>
								<Col md={6} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Request Category
										</small>
										<span className="fs-6">
											{requestCatagoryMap[
												transaction.bdr_request_category_id
											] || "N/A"}
										</span>
									</div>
								</Col>
								<Col md={12} className="mb-3">
									<div className="border-bottom pb-2">
										<small className="text-muted fw-bold d-block">
											Description
										</small>
										<span className="fs-6">
											{transaction.bdr_description || "No description provided"}
										</span>
									</div>
								</Col>
							</Row>
						</CardBody>
					</Card>
				</div>
			</ModalBody>
		</Modal>
	);
};

BudgetRequestModal.propTypes = {
	toggle: PropTypes.func,
	isOpen: PropTypes.bool,
	transaction: PropTypes.object,
};

export default BudgetRequestModal;
