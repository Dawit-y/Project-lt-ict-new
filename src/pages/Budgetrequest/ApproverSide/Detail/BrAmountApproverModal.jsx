import * as Yup from "yup";
import { useFormik } from "formik";
import { useUpdateBudgetRequestAmount } from "../../../../queries/budgetrequestamount_query";
import { toast } from "react-toastify";
import { formattedAmountValidation } from "../../../../utils/Validation/validation";
import {
	Button,
	Col,
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	Card,
	CardBody,
	CardTitle,
	Spinner,
} from "reactstrap";
import FormattedAmountField from "../../../../components/Common/FormattedAmountField";
import { useTranslation } from "react-i18next";

const BrAmountApproverModal = ({ isOpen, toggle, budgetRequestAmount }) => {
	const { t } = useTranslation();

	const updateBudgetRequestAmount = useUpdateBudgetRequestAmount();
	const handleUpdateBudgetRequestAmount = async (data) => {
		try {
			await updateBudgetRequestAmount.mutateAsync(data);
			toast.success(t("update_success"), {
				autoClose: 2000,
			});
			validation.resetForm();
		} catch (error) {
			toast.error(t("update_failure"), {
				autoClose: 2000,
			});
		}
		toggle();
	};
	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			bra_approved_amount:
				(budgetRequestAmount && budgetRequestAmount.bra_approved_amount) || "",
			bra_source_government_approved:
				(budgetRequestAmount &&
					budgetRequestAmount.bra_source_government_approved) ||
				"",
			bra_source_internal_approved:
				(budgetRequestAmount &&
					budgetRequestAmount.bra_source_internal_approved) ||
				"",
			bra_source_support_approved:
				(budgetRequestAmount &&
					budgetRequestAmount.bra_source_support_approved) ||
				"",
			bra_source_credit_approved:
				(budgetRequestAmount &&
					budgetRequestAmount.bra_source_credit_approved) ||
				"",
		},
		validationSchema: Yup.object({
			bra_approved_amount: formattedAmountValidation(
				0,
				budgetRequestAmount?.bra_requested_amount,
				true
			),
			bra_source_government_approved: formattedAmountValidation(
				0,
				budgetRequestAmount?.bra_source_government_requested,
				true
			),
			bra_source_internal_approved: formattedAmountValidation(
				0,
				budgetRequestAmount?.bra_source_internal_requested,
				true
			),
			bra_source_support_approved: formattedAmountValidation(
				0,
				budgetRequestAmount?.bra_source_support_requested,
				true
			),
			bra_source_credit_approved: formattedAmountValidation(
				0,
				budgetRequestAmount?.bra_source_credit_requested,
				true
			),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			const updateBudgetRequestAmount = {
				bra_id: budgetRequestAmount.bra_id,
				bra_approved_amount: values.bra_approved_amount,
				bra_source_government_approved: values.bra_source_government_approved,
				bra_source_internal_approved: values.bra_source_internal_approved,
				bra_source_support_approved: values.bra_source_support_approved,
				bra_source_credit_approved: values.bra_source_credit_approved,
			};
			handleUpdateBudgetRequestAmount(updateBudgetRequestAmount);
		},
	});
	return (
		<div>
			<Modal isOpen={isOpen} toggle={toggle} className="modal-xl">
				<ModalHeader toggle={toggle} tag="h4">
					{t("Approve") + " " + t("budget_request_amount")}
				</ModalHeader>
				<ModalBody>
					<Form
						onSubmit={(e) => {
							e.preventDefault();
							validation.handleSubmit();
							return false;
						}}
					>
						<Row>
							<FormattedAmountField
								validation={validation}
								fieldId={"bra_approved_amount"}
								isRequired={true}
								className="col-md-4 mb-3"
								allowDecimal={true}
								infoText={`Requested Amount: ${parseFloat(
									budgetRequestAmount?.bra_requested_amount
								).toLocaleString()}`}
							/>
							<div className="my-3 p-3">
								<CardTitle className="mb-3 bg-light p-2">
									<h5 className="text-center">
										Budget Requested by Financing Source
									</h5>
								</CardTitle>
								<CardBody>
									<Row className="gy-4">
										<Col md={6} lg={3}>
											<Card body className="shadow-sm border">
												<FormattedAmountField
													validation={validation}
													fieldId={"bra_source_government_approved"}
													isRequired={true}
													className="mb-3"
													allowDecimal={true}
													infoText={`Requested Amount: ${parseFloat(
														budgetRequestAmount?.bra_source_government_requested
													).toLocaleString()}`}
												/>
											</Card>
										</Col>
										<Col md={6} lg={3}>
											<Card body className="shadow-sm border">
												<FormattedAmountField
													validation={validation}
													fieldId={"bra_source_internal_approved"}
													isRequired={true}
													className="mb-3"
													allowDecimal={true}
													infoText={`Requested Amount: ${parseFloat(
														budgetRequestAmount?.bra_source_internal_requested
													).toLocaleString()}`}
												/>
											</Card>
										</Col>
										<Col md={6} lg={3}>
											<Card body className="shadow-sm border">
												<FormattedAmountField
													validation={validation}
													fieldId={"bra_source_support_approved"}
													isRequired={true}
													className="col-md-12 mb-3"
													allowDecimal={true}
													infoText={`Requested Amount: 
                            ${parseFloat(
															budgetRequestAmount?.bra_source_support_requested
														).toLocaleString()}
                            , Code: ${
															budgetRequestAmount?.bra_source_support_code
														}
                            `}
												/>
											</Card>
										</Col>
										<Col md={6} lg={3}>
											<Card body className="shadow-sm border">
												<FormattedAmountField
													validation={validation}
													fieldId={"bra_source_credit_approved"}
													isRequired={true}
													className="col-md-12 mb-3"
													allowDecimal={true}
													infoText={`Requested Amount:
                             ${parseFloat(
																budgetRequestAmount?.bra_source_credit_requested
															).toLocaleString()}
                             , Code: ${
																budgetRequestAmount?.bra_source_credit_code
															}
                            `}
												/>
											</Card>
										</Col>
									</Row>
								</CardBody>
							</div>
						</Row>
						<Row>
							<Col>
								<div className="text-end">
									<Button
										color="success"
										type="submit"
										className="save-user"
										disabled={
											updateBudgetRequestAmount.isPending ||
											!validation.dirty ||
											!validation.isValid
										}
									>
										{updateBudgetRequestAmount.isPending && (
											<Spinner size={"sm"} color="light" className="me-2" />
										)}
										{t("Approve")}
									</Button>
								</div>
							</Col>
						</Row>
					</Form>
				</ModalBody>
			</Modal>
		</div>
	);
};

export default BrAmountApproverModal;
