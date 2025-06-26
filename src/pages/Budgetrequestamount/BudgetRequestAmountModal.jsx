import React, { useTransition } from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap"

const BudgetRequestAmountModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;

  return (
		<Modal
			isOpen={isOpen}
			role="dialog"
			autoFocus={true}
			centered={true}
			className="modal-xl"
			tabIndex="-1"
			toggle={toggle}
		>
			<div className="modal-xl">
				<ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>
				<ModalBody>
					<table className="table table-bordered">
						<tbody>
							<tr>
								<td>{t("bra_expenditure_code_id")}</td>
								<td className="text-primary">
									{transaction.bra_expenditure_code_id}
								</td>
								<td>{t("bra_current_year_expense")}</td>
								<td className="text-primary">
									{transaction.bra_current_year_expense}
								</td>
							</tr>
							<tr>
								<td>{t("bra_requested_amount")}</td>
								<td className="text-primary">
									{transaction.bra_requested_amount}
								</td>
								<td>{t("bra_approved_amount")}</td>
								<td className="text-primary">
									{transaction.bra_approved_amount}
								</td>
							</tr>
							<tr>
								<td>{t("bra_source_government_requested")}</td>
								<td className="text-primary">
									{transaction.bra_source_government_requested}
								</td>
								<td>{t("bra_source_government_approved")}</td>
								<td className="text-primary">
									{transaction.bra_source_government_approved}
								</td>
							</tr>
							<tr>
								<td>{t("bra_source_internal_requested")}</td>
								<td className="text-primary">
									{transaction.bra_source_internal_requested}
								</td>
								<td>{t("bra_source_internal_approved")}</td>
								<td className="text-primary">
									{transaction.bra_source_internal_approved}
								</td>
							</tr>
							<tr>
								<td>{t("bra_source_support_requested")}</td>
								<td className="text-primary">
									{transaction.bra_source_support_requested}
								</td>
								<td>{t("bra_source_support_approved")}</td>
								<td className="text-primary">
									{transaction.bra_source_support_approved}
								</td>
							</tr>
							<tr>
								<td>{t("bra_source_support_code")}</td>
								<td className="text-primary">
									{transaction.bra_source_support_code}
								</td>
								<td>{t("bra_source_credit_requested")}</td>
								<td className="text-primary">
									{transaction.bra_source_credit_requested}
								</td>
							</tr>
							<tr>
								<td>{t("bra_source_credit_approved")}</td>
								<td className="text-primary">
									{transaction.bra_source_credit_approved}
								</td>
								<td>{t("bra_source_credit_code")}</td>
								<td className="text-primary">
									{transaction.bra_source_credit_code}
								</td>
							</tr>
							<tr>
								<td>{t("bra_source_other_requested")}</td>
								<td className="text-primary">
									{transaction.bra_source_other_requested}
								</td>
								<td>{t("bra_source_other_approved")}</td>
								<td className="text-primary">
									{transaction.bra_source_other_approved}
								</td>
							</tr>
							<tr>
								<td>{t("bra_source_other_code")}</td>
								<td className="text-primary">
									{transaction.bra_source_other_code}
								</td>
								<td>{t("bra_requested_date")}</td>
								<td className="text-primary">
									{transaction.bra_requested_date}
								</td>
							</tr>
							<tr>
								<td>{t("bra_approved_date")}</td>
								<td className="text-primary">
									{transaction.bra_approved_date}
								</td>
								<td>{t("bra_description")}</td>
								<td className="text-primary">{transaction.bra_description}</td>
							</tr>
						</tbody>
					</table>
				</ModalBody>
				<ModalFooter>
					<Button type="button" color="secondary" onClick={toggle}>
						{t("Close")}
					</Button>
				</ModalFooter>
			</div>
		</Modal>
	);
};
BudgetRequestAmountModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default BudgetRequestAmountModal;
