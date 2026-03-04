import { useState } from "react";
import {
	Row,
	Col,
	Card,
	CardBody,
	CardHeader,
	Button,
	InputGroup,
	Input,
	InputGroupText,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Spinner,
	Alert,
	Form,
	Label,
	FormFeedback,
	Badge,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FaRedoAlt } from "react-icons/fa";
import { UncontrolledTooltip } from "reactstrap";
import {
	useFetchConversationInformations,
	useAddConversationInformation,
} from "../../../../queries/conversationinformation_query";
import { PAGE_ID } from "../../../../constants/constantFile";
import FetchErrorHandler from "../../../../components/Common/FetchErrorHandler";

export default function TextNotes({ requestData, isActive }) {
	const { t } = useTranslation();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedNote, setSelectedNote] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [showAddForm, setShowAddForm] = useState(false);

	const param = {
		cvi_object_type_id: PAGE_ID.PROJ_BUDGET_REQUEST,
		cvi_object_id: requestData?.bdr_id,
	};

	const { data, isFetching, isLoading, isError, error, refetch } =
		useFetchConversationInformations(param, isActive);

	const addConversationInformation = useAddConversationInformation();

	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			cvi_title: "",
			cvi_description: "",
		},
		validationSchema: Yup.object({
			cvi_title: Yup.string().required(t("Subject is required")),
			cvi_description: Yup.string().required(t("Message is required")),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			const newConversationInformation = {
				cvi_title: values.cvi_title,
				cvi_object_id: requestData?.bdr_id,
				cvi_object_type_id: PAGE_ID.PROJ_BUDGET_REQUEST,
				cvi_request_date_et: "1",
				cvi_request_date_gc: "1",
				cvi_description: values.cvi_description,
			};
			handleAddConversationInformation(newConversationInformation);
		},
	});

	const handleAddConversationInformation = async (data) => {
		try {
			await addConversationInformation.mutateAsync(data);
			toast.success(t("Note added successfully"), { autoClose: 3000 });
			validation.resetForm();
			setShowAddForm(false);
			refetch();
		} catch (error) {
			toast.error(t("Failed to add note"), { autoClose: 3000 });
		}
	};

	const formatUtcDate = (timestamp) => {
		const date = new Date(timestamp).toUTCString();
		return date.split(" ").slice(1, 4).join(" ");
	};

	const openNoteModal = (note) => {
		setSelectedNote(note);
		setModalOpen(true);
	};

	const closeNoteModal = () => {
		setSelectedNote(null);
		setModalOpen(false);
	};

	const toggleAddForm = () => {
		setShowAddForm(!showAddForm);
		if (showAddForm) {
			validation.resetForm();
		}
	};

	const textNotes = data?.data || [];

	const filteredNotes = textNotes.filter(
		(note) =>
			note.cvi_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			note.cvi_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			note.created_by.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (isError) return <FetchErrorHandler error={error} refetch={refetch} />;

	return (
		<div>
			{isLoading ? (
				<div className="w-full h-full d-flex align-items-center justify-content-center">
					<Spinner color="primary" />
				</div>
			) : (
				<>
					{/* Header with Add Button and Search */}
					<Row className="mb-4 align-items-center">
						<Col md={6}>
							<div className="d-flex align-items-center">
								<h5 className="mb-0 me-3">{t("Notes")}</h5>
								<Button
									id="refresh_btn_message"
									color="primary"
									onClick={refetch}
									outline
									className="rounded-circle p-0 d-flex align-items-center justify-content-center me-2"
									style={{
										width: "30px",
										height: "30px",
										fontSize: "12px",
									}}
								>
									{isFetching ? (
										<Spinner color="light" size="sm" />
									) : (
										<FaRedoAlt />
									)}
								</Button>
								<UncontrolledTooltip
									placement="top"
									target="refresh_btn_message"
								>
									{t("Refresh")}
								</UncontrolledTooltip>
							</div>
						</Col>
						<Col md={6} className="text-end">
							<Button color="success" onClick={toggleAddForm} className="me-2">
								<i className="bi bi-plus-circle me-1"></i>
								{t("Add Note")}
							</Button>
						</Col>
					</Row>

					{/* Add Note Form */}
					{showAddForm && (
						<Card className="mb-4">
							<CardBody>
								<Alert color="warning" className="mb-3">
									{t(
										"This note is visible to anyone with access to this data."
									)}
								</Alert>
								<Form
									onSubmit={(e) => {
										e.preventDefault();
										validation.handleSubmit();
									}}
								>
									<div className="mb-3">
										<Label>{t("Subject")}</Label>
										<Input
											name="cvi_title"
											type="text"
											placeholder={t("Enter subject")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.cvi_title || ""}
											invalid={
												validation.touched.cvi_title &&
												validation.errors.cvi_title
											}
										/>
										{validation.touched.cvi_title &&
											validation.errors.cvi_title && (
												<FormFeedback>
													{validation.errors.cvi_title}
												</FormFeedback>
											)}
									</div>
									<div className="mb-3">
										<Label>{t("Message")}</Label>
										<Input
											name="cvi_description"
											type="textarea"
											rows="4"
											placeholder={t("Enter your message")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.cvi_description || ""}
											invalid={
												validation.touched.cvi_description &&
												validation.errors.cvi_description
											}
											maxLength={425}
										/>
										{validation.touched.cvi_description &&
											validation.errors.cvi_description && (
												<FormFeedback>
													{validation.errors.cvi_description}
												</FormFeedback>
											)}
									</div>
									<div className="text-end">
										<Button
											type="button"
											color="secondary"
											onClick={toggleAddForm}
											className="me-2"
										>
											{t("Cancel")}
										</Button>
										<Button
											color="success"
											type="submit"
											disabled={
												addConversationInformation.isPending ||
												!validation.dirty
											}
										>
											{addConversationInformation.isPending && (
												<Spinner size="sm" color="light" className="me-2" />
											)}
											{t("Submit")}
										</Button>
									</div>
								</Form>
							</CardBody>
						</Card>
					)}

					{/* Search Bar */}
					<Row className="mb-3">
						<Col md={6}>
							<InputGroup>
								<InputGroupText>
									<i className="bi bi-search"></i>
								</InputGroupText>
								<Input
									type="text"
									placeholder={t(
										"Search notes by subject, content, or author..."
									)}
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</InputGroup>
						</Col>
					</Row>

					{/* Notes List */}
					<Row>
						{filteredNotes.map((note) => (
							<Col md={12} key={note.cvi_id} className="mb-3">
								<Card className="h-100 shadow-sm">
									<CardHeader className="bg-light">
										<Row className="align-items-center">
											<Col md={8}>
												<h6 className="mb-0 fw-bold">{note.cvi_title}</h6>
											</Col>
											<Col md={4} className="text-end">
												<Badge color="light" className="text-muted">
													{formatUtcDate(note.cvi_create_time)}
												</Badge>
											</Col>
										</Row>
									</CardHeader>
									<CardBody>
										<p className="text-muted mb-3">
											{note.cvi_description.length > 150
												? `${note.cvi_description.substring(0, 150)}...`
												: note.cvi_description}
										</p>
										<div className="d-flex justify-content-between align-items-center">
											<div>
												<small className="text-muted">
													<i className="bi bi-person me-1"></i>
													{note.created_by}
												</small>
											</div>
											<Button
												color="primary"
												size="sm"
												outline
												onClick={() => openNoteModal(note)}
											>
												<i className="bi bi-eye me-1"></i>
												{t("View Full Note")}
											</Button>
										</div>
									</CardBody>
								</Card>
							</Col>
						))}
					</Row>

					{/* Empty State */}
					{filteredNotes.length === 0 && !isLoading && (
						<div className="text-center py-5">
							<i className="bi bi-journal-x fs-1 text-muted"></i>
							<p className="text-muted mt-2">
								{searchTerm
									? t("No notes found matching your search.")
									: t("No notes available.")}
							</p>
						</div>
					)}
				</>
			)}

			{/* Note Detail Modal */}
			<Modal isOpen={modalOpen} toggle={closeNoteModal} size="lg">
				<ModalHeader toggle={closeNoteModal}>
					{selectedNote?.cvi_title}
				</ModalHeader>
				<ModalBody>
					{selectedNote && (
						<div>
							<div className="mb-3">
								<small className="text-muted">
									<i className="bi bi-person me-1"></i>
									{t("Attached by:")} <strong>{selectedNote.created_by}</strong>
								</small>
								<small className="text-muted ms-3">
									<i className="bi bi-clock me-1"></i>
									{t("Date:")}{" "}
									<strong>{formatUtcDate(selectedNote.cvi_create_time)}</strong>
								</small>
							</div>
							<hr />
							<div className="mt-3">
								<h6>{t("Content:")}</h6>
								<p className="text-justify">{selectedNote.cvi_description}</p>
							</div>
						</div>
					)}
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={closeNoteModal}>
						{t("Close")}
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}
