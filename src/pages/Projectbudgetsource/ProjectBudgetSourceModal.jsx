import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const modalStyle = {
	width: "100%",
};

const ProjectBudgetSourceModal = ({
	isOpen,
	toggle,
	transaction,
	budgetSourceMap,
}) => {
	const { t } = useTranslation();

	const detailItems = [
		{ label: t("bsr_name"), value: transaction?.bsr_name },
		{
			label: t("bsr_budget_source_id"),
			value: budgetSourceMap[transaction?.bsr_budget_source_id] ?? "-",
		},
		{ label: t("bsr_amount"), value: transaction?.bsr_amount },
		{ label: t("bsr_description"), value: transaction?.bsr_description },
	];

	return (
		<Modal
			isOpen={isOpen}
			role="dialog"
			autoFocus
			centered
			className="modal-xl"
			tabIndex="-1"
			toggle={toggle}
			style={modalStyle}
		>
			<ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
			<ModalBody>
				<div className="p-3">
					<div className="table-responsive">
						<table className="table table-borderless align-middle mb-0">
							<tbody>
								{detailItems.map((item, index) => (
									<tr key={index}>
										<th className="text-muted fw-semibold w-25">
											{item.label}:
										</th>
										<td className="text-primary">{item.value || "-"}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</ModalBody>
			<ModalFooter>
				<Button type="button" color="secondary" onClick={toggle}>
					{t("Close")}
				</Button>
			</ModalFooter>
		</Modal>
	);
};

ProjectBudgetSourceModal.propTypes = {
	toggle: PropTypes.func,
	isOpen: PropTypes.bool,
	transaction: PropTypes.object,
};

export default ProjectBudgetSourceModal;
