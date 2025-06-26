import { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
	Button,
	Modal,
	ModalBody,
	Col,
	Spinner,
	Alert,
	Table,
} from "reactstrap";
import { DetailsView } from "../../components/Common/DetailViewWrapper";
import { useFetchBudgetRequestAmounts } from "../../queries/budgetrequestamount_query";
import { useFetchBudgetRequestTasks } from "../../queries/budgetrequesttask_query";
import { useFetchExpenditureCodes } from "../../queries/expenditurecode_query";
import { createKeyValueMap } from "../../utils/commonMethods";
import {
	PrintBudgetRequestTables,
	ExportBudgetRequestTablesToExcel,
} from "./Export";
import { FaWindowClose } from "react-icons/fa";

const modalStyle = {
	width: "100%",
};

const BudgetRequestModal = ({ isOpen, toggle, transaction }) => {
	const { t } = useTranslation();
	const id = transaction?.bdr_id;

	const brAmountsQuery = useFetchBudgetRequestAmounts(
		{ budget_request_id: id },
		isOpen
	);
	const brTasksQuery = useFetchBudgetRequestTasks(
		{ budget_request_id: id },
		isOpen
	);

	const {
		data: exCodesData,
		isLoading: exCodesLoading,
		isError: exCodesError,
	} = useFetchExpenditureCodes();

	const expendCodeMap = useMemo(() => {
		return createKeyValueMap(exCodesData?.data || [], "pec_id", "pec_code");
	}, [exCodesData]);

	const isLoading = brAmountsQuery.isLoading || brTasksQuery.isLoading;
	const isError = brAmountsQuery.error || brTasksQuery.error;

	return (
		<Modal
			isOpen={isOpen}
			centered
			className="modal-xl"
			toggle={toggle}
			style={modalStyle}
		>
			<div className="p-3 d-flex justify-content-between align-items-center rounded border-bottom">
				<h5 className="modal-title">{t("view_detail")}</h5>
				<Col className="d-flex align-items-center justify-content-end gap-2">
					{!isLoading && !isError && <PrintBudgetRequestTables />}
					{!isLoading && !isError && (
						<ExportBudgetRequestTablesToExcel
							brAmountsData={brAmountsQuery.data?.data || []}
							brTasksData={brTasksQuery.data?.data || []}
							expendCodeMap={expendCodeMap}
						/>
					)}
					<Button color="secondary" onClick={toggle}>
						<FaWindowClose />
					</Button>
				</Col>
			</div>
			<ModalBody>
				{isLoading ? (
					<div className="text-center">
						<Spinner color="primary" />
						<p>{t("loading")}</p>
					</div>
				) : isError ? (
					<Alert color="danger">{t("failed_to_load")}</Alert>
				) : (
					<>
						<DetailsView
							details={transaction}
							keysToRemove={[
								"bdr_id",
								"bdr_project_id",
								"bdr_released_date_ec",
								"bdr_requested_date_ec",
								"bdr_create_time",
								"bdr_update_time",
								"bdr_delete_time",
								"bdr_action_remark",
								"bdr_status",
								"bdr_created_by",
								"is_editable",
								"is_deletable",
								"color_code",
								"bdr_request_status",
							]}
						/>
						<div id="budget-request-amount-table">
							<h5 className="mt-4 mb-2 text-center">
								{t("budget_request_amounts")}
							</h5>
							<Table striped bordered responsive>
								<thead>
									<tr>
										<th rowSpan={2}>{""}</th>
										<th rowSpan={2}></th>
										<th rowSpan={2}></th>
										<th rowSpan={2}></th>
										<th colSpan={6} className="text-center">
											{t("source_of_finance")}
										</th>
									</tr>
									<tr>
										<th>{""}</th>
										<th>{""}</th>
										<th colSpan={2} className="text-center">
											{t("external_assistance")}
										</th>
										<th colSpan={2} className="text-center">
											{t("foreign_debt")}
										</th>
									</tr>
									<tr>
										<th>{t("s_n")}</th>
										<th>{t("expenditure_code")}</th>
										<th>{t("current_year_expense")}</th>
										<th>{t("requested_amount")}</th>
										<th>{t("gov_requested")}</th>
										<th>{t("internal_requested")}</th>
										<th>{t("support_requested")}</th>
										<th>{t("support_code")}</th>
										<th>{t("credit_requested")}</th>
										<th>{t("credit_code")}</th>
									</tr>
								</thead>
								<tbody>
									{brAmountsQuery?.data?.data.map((row, idx) => (
										<tr key={row.id || idx}>
											<td>{idx + 1}</td>
											<td>{expendCodeMap[row.bra_expenditure_code_id]}</td>
											<td>
												{parseFloat(
													row.bra_current_year_expense
												).toLocaleString() || "-"}
											</td>
											<td>
												{parseFloat(
													row.bra_requested_amount
												).toLocaleString() || "-"}
											</td>
											<td>
												{parseFloat(
													row.bra_source_government_requested
												).toLocaleString() || "-"}
											</td>
											<td>
												{parseFloat(
													row.bra_source_internal_requested
												).toLocaleString() || "-"}
											</td>
											<td>
												{parseFloat(
													row.bra_source_support_requested
												).toLocaleString() || "-"}
											</td>
											<td>{row.bra_source_support_code || "-"}</td>
											<td>
												{parseFloat(
													row.bra_source_credit_requested
												).toLocaleString() || "-"}
											</td>
											<td>{row.bra_source_credit_code || "-"}</td>
										</tr>
									))}
								</tbody>
							</Table>
						</div>
						<div id="budget-request-task-table">
							<h5 className="mt-4 mb-2 text-center">
								{t("budget_request_tasks")}
							</h5>
							<Table bordered responsive>
								<thead>
									<tr>
										<th rowSpan={2}>{t("s_n")}</th>
										<th rowSpan={2}>{t("task_name")}</th>
										<th rowSpan={2}>{t("measurement")}</th>
										<th colSpan={2} className="text-center">
											{t("performance_last_year")}
										</th>
										<th colSpan={2} className="text-center">
											{t("performance_this_year")}
										</th>
										<th colSpan={2} className="text-center">
											{t("plans_coming_year")}
										</th>
									</tr>
									<tr>
										<th>{t("physical")}</th>
										<th>{t("financial")}</th>
										<th>{t("physical")}</th>
										<th>{t("financial")}</th>
										<th>{t("physical")}</th>
										<th>{t("financial")}</th>
									</tr>
								</thead>
								<tbody>
									{brTasksQuery?.data?.data.map((row, index) => (
										<tr key={row.id || index}>
											<td>{index + 1}</td>
											<td>{row.brt_task_name}</td>
											<td>{row.brt_measurement}</td>
											<td>
												{row.brt_previous_year_physical != null
													? `${row.brt_previous_year_physical}%`
													: "-"}
											</td>
											<td>
												{row.brt_previous_year_financial != null
													? parseFloat(
															row.brt_previous_year_financial
													  ).toLocaleString()
													: "-"}
											</td>
											<td>
												{row.brt_current_year_physical != null
													? `${row.brt_current_year_physical}%`
													: "-"}
											</td>
											<td>
												{row.brt_current_year_financial != null
													? parseFloat(
															row.brt_current_year_financial
													  ).toLocaleString()
													: "-"}
											</td>
											<td>
												{row.brt_next_year_physical != null
													? `${row.brt_next_year_physical}%`
													: "-"}
											</td>
											<td>
												{row.brt_next_year_financial != null
													? parseFloat(
															row.brt_next_year_financial
													  ).toLocaleString()
													: "-"}
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</div>
					</>
				)}
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
