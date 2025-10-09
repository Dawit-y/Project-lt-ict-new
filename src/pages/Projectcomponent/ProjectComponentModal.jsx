import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const modalStyle = {
	width: "100%",
};

const ProjectComponentModal = ({ isOpen, toggle, transaction }) => {
	const { t } = useTranslation();

	const detailItems = [
		{ label: t("pcm_component_name"), value: transaction?.pcm_component_name },
		{
			label: t("pcm_unit_measurement"),
			value: transaction?.pcm_unit_measurement,
		},
		{ label: t("pcm_amount"), value: transaction?.pcm_amount },
		{ label: t("pcm_description"), value: transaction?.pcm_description },
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

ProjectComponentModal.propTypes = {
	toggle: PropTypes.func,
	isOpen: PropTypes.bool,
	transaction: PropTypes.object,
};

export default ProjectComponentModal;
