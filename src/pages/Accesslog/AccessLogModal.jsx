import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
	Button,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Badge,
} from "reactstrap";

const DiffRow = ({ field, changes }) => {
	const { t } = useTranslation();
	return (
		<div className="mb-3">
			<h6 className="font-weight-bold">{t(field)}</h6>
			<div className="border rounded p-2 bg-light">
				{changes.old !== undefined && (
					<div className="text-danger mb-1">
						<span className="badge bg-danger me-2">-</span>
						<del>{JSON.stringify(changes.old)}</del>
					</div>
				)}
				{changes.new !== undefined && (
					<div className="text-success">
						<span className="badge bg-success me-2">+</span>
						<ins>{JSON.stringify(changes.new)}</ins>
					</div>
				)}
			</div>
		</div>
	);
};

const AccessLogModal = (props) => {
	const { t } = useTranslation();
	const { isOpen, toggle, transaction } = props;
	const isUpdateAction = transaction?.acl_object_action === "UPDATE";
	let descriptionContent = null;

	try {
		if (transaction.acl_description) {
			const changes = JSON.parse(transaction.acl_description);
			descriptionContent = (
				<div className="mt-3 p-3 bg-white rounded border">
					<h5 className="mb-3 text-primary">
						<i className="bx bx-git-compare me-2"></i>
						{t("Field Changes")}
					</h5>
					{Object.entries(changes).map(([field, changes]) => (
						<DiffRow key={field} field={field} changes={changes} />
					))}
				</div>
			);
		}
	} catch (e) {
		descriptionContent = (
			<pre className="p-3 bg-light rounded">{transaction.acl_description}</pre>
		);
	}

	return (
		<Modal
			isOpen={isOpen}
			role="dialog"
			autoFocus={true}
			centered={true}
			className="modal-lg"
			tabIndex="-1"
			toggle={toggle}
			contentClassName="border-0 shadow"
		>
			<ModalHeader
				toggle={toggle}
				className="bg-primary text-white"
				close={
					<button
						type="button"
						className="btn-close btn-close-white"
						onClick={toggle}
					/>
				}
			>
				<i className="bx bx-detail me-2"></i>
				{t("Access Log Details")}
			</ModalHeader>
			<ModalBody className="p-4">
				<div className="mb-4">
					<h5 className="text-muted mb-3">
						<i className="bx bx-info-circle me-2"></i>
						{t("Basic Information")}
					</h5>
					<div className="table-responsive">
						<table className="table table-striped table-bordered">
							<tbody>
								<tr>
									<th className="w-25 bg-light">{t("IP Address")}</th>
									<td>
										{transaction.acl_ip || (
											<span className="text-muted">N/A</span>
										)}
									</td>
								</tr>
								<tr>
									<th className="bg-light">{t("User ID")}</th>
									<td>
										{transaction.acl_user_id || (
											<span className="text-muted">N/A</span>
										)}
									</td>
								</tr>
								<tr>
									<th className="bg-light">{t("Action")}</th>
									<td>
										<Badge
											color={
												transaction.acl_object_action === `"INSERT`
													? "success"
													: transaction.acl_object_action === `"UPDATE`
													? "warning"
													: transaction.acl_object_action === `"DELETE`
													? "danger"
													: "info"
											}
											pill
											className="px-2 py-1"
										>
											{transaction.acl_object_action}
										</Badge>
									</td>
								</tr>
								<tr>
									<th className="bg-light">{t("Object")}</th>
									<td>
										{transaction.acl_object_name || (
											<span className="text-muted">N/A</span>
										)}
									</td>
								</tr>
								<tr>
									<th className="bg-light">{t("Object ID")}</th>
									<td>
										{transaction.acl_object_id || (
											<span className="text-muted">N/A</span>
										)}
									</td>
								</tr>
								<tr>
									<th className="bg-light">{t("Timestamp")}</th>
									<td>
										{transaction.acl_create_time || (
											<span className="text-muted">N/A</span>
										)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div>
					<h5 className="text-muted mb-3">
						<i className="bx bx-notepad me-2"></i>
						{t("Details")}
					</h5>
					{descriptionContent || (
						<div className="alert alert-info">
							{t("No additional details available")}
						</div>
					)}
				</div>
			</ModalBody>
			<ModalFooter className="bg-light">
				<Button color="secondary" onClick={toggle} className="px-4">
					<i className="bx bx-x me-1"></i>
					{t("Close")}
				</Button>
			</ModalFooter>
		</Modal>
	);
};

AccessLogModal.propTypes = {
	toggle: PropTypes.func,
	isOpen: PropTypes.bool,
	transaction: PropTypes.object,
};

export default AccessLogModal;
