import { Row, Col, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormattedAmountField from "../../../../components/Common/FormattedAmountField";
import { toast } from "react-toastify";
import { useUpdateBudgetRequest } from "../../../../queries/budget_request_query";

const BudgetSourceApprovalModal = ({ isOpen, toggle, requestData }) => {
	const { t } = useTranslation();
	const { mutateAsync, isPending } = useUpdateBudgetRequest();

	const validationSchema = Yup.object().shape({
		bdr_source_government_approved: Yup.number()
			.min(0, t("amount_cannot_be_negative"))
			.max(
				requestData?.bdr_source_government_requested || 0,
				t("approved_amount_cannot_exceed_requested")
			)
			.required(t("val_required")),
		bdr_source_support_approved: Yup.number()
			.min(0, t("amount_cannot_be_negative"))
			.max(
				requestData?.bdr_source_support_requested || 0,
				t("approved_amount_cannot_exceed_requested")
			)
			.required(t("val_required")),
		bdr_source_credit_approved: Yup.number()
			.min(0, t("amount_cannot_be_negative"))
			.max(
				requestData?.bdr_source_credit_requested || 0,
				t("approved_amount_cannot_exceed_requested")
			)
			.required(t("val_required")),
		bdr_source_other_approved: Yup.number()
			.min(0, t("amount_cannot_be_negative"))
			.max(
				requestData?.bdr_source_other_requested || 0,
				t("approved_amount_cannot_exceed_requested")
			)
			.required(t("val_required")),
	});

	const initialValues = {
		bdr_source_government_approved:
			requestData?.bdr_source_government_approved || null,
		bdr_source_support_approved:
			requestData?.bdr_source_support_approved || null,
		bdr_source_credit_approved: requestData?.bdr_source_credit_approved || null,
		bdr_source_other_approved: requestData?.bdr_source_other_approved || null,
	};

	const handleSubmit = async (values) => {
		try {
			await mutateAsync({ bdr_id: requestData.bdr_id, ...values });
			toast.success(t("update_success"), { autoClose: 3000 });
			toggle();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};

	return (
		<Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
			<ModalHeader toggle={toggle}>{t("approve_budget_sources")}</ModalHeader>
			<ModalBody>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
					enableReinitialize
				>
					{(formik) => (
						<Form>
							<Row>
								<Col md={6}>
									<FormattedAmountField
										validation={formik}
										fieldId={"bdr_source_government_approved"}
										label={t("bdr_source_government_approved")}
										isRequired={false}
										className="mb-3"
										allowDecimal={true}
									/>
									<FormattedAmountField
										validation={formik}
										fieldId={"bdr_source_support_approved"}
										label={t("bdr_source_support_approved")}
										isRequired={false}
										className="mb-3"
										allowDecimal={true}
									/>
								</Col>
								<Col md={6}>
									<FormattedAmountField
										validation={formik}
										fieldId={"bdr_source_credit_approved"}
										label={t("bdr_source_credit_approved")}
										isRequired={false}
										className="mb-3"
										allowDecimal={true}
									/>
									<FormattedAmountField
										validation={formik}
										fieldId={"bdr_source_other_approved"}
										label={t("bdr_source_other_approved")}
										isRequired={false}
										className="mb-3"
										allowDecimal={true}
									/>
								</Col>
							</Row>
							<div className="d-flex justify-content-end gap-2 mt-4">
								<Button color="secondary" onClick={toggle}>
									{t("cancel")}
								</Button>
								<Button color="success" type="submit" disabled={isPending}>
									<FaCheck className="me-1" />
									{t("approve")}
								</Button>
							</div>
						</Form>
					)}
				</Formik>
			</ModalBody>
		</Modal>
	);
};

export default BudgetSourceApprovalModal;
