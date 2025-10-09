import PropTypes from "prop-types";
import React from "react";
import {
	Modal,
	ModalBody,
	ModalHeader,
	Form,
	Label,
	Input,
	Button,
	FormFeedback,
	Row,
	Col,
	Spinner,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import DeleteModal from "../../components/Common/DeleteModal";
import {
	useAddAddressStructures,
	useUpdateAddressStructures,
	useDeleteAddressStructures,
} from "../../queries/address_structure_query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const FormModal = ({
	show,
	toggle,
	action,
	selectedRow,
	data,
	deleteModal,
	toggleDelete,
}) => {
	const { t } = useTranslation();
	const addFolder = useAddAddressStructures();
	const updateFolder = useUpdateAddressStructures();
	const deleteFolder = useDeleteAddressStructures();

	const handleAddFolder = async (values) => {
		const newData = {
			add_parent_id: values.id,
			add_name_or: values.add_name_or,
			add_name_am: values.add_name_am,
			add_name_en: values.add_name_en,
		};
		try {
			await addFolder.mutateAsync(newData);
			toast.success(t("Data added successfully"), { autoClose: 3000 });
			toggle();
			formik.resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("add_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleUpdateFolder = async (values) => {
		try {
			await updateFolder.mutateAsync({
				add_id: values.id,
				add_name_or: values.add_name_or,
				add_name_am: values.add_name_am,
				add_name_en: values.add_name_en,
			});
			toast.success(t("Data updated successfully"), { autoClose: 3000 });
			toggle();
			formik.resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleDeleteFolder = async () => {
		if (!selectedRow) return;
		try {
			await deleteFolder.mutateAsync(selectedRow?.id);
			toast.success(t("Data deleted successfully"), { autoClose: 3000 });
		} catch (error) {
			toast.error(t("Failed to delete data"), { autoClose: 3000 });
		} finally {
			toggleDelete();
		}
	};

	const checkNameExists = (folders, name, idToIgnore = null) => {
		for (const folder of folders) {
			if (
				String(folder.name).trim() === String(name).trim() &&
				folder.id !== idToIgnore
			) {
				return true;
			}
			if (folder.children && folder.children.length > 0) {
				if (checkNameExists(folder.children, name, idToIgnore)) return true;
			}
		}
		return false;
	};

	const validationSchema = Yup.object({
		add_name_or: Yup.string()
			.required(t("Field is required."))
			.test("unique", t("Already exists"), function (value) {
				if (action === "add") {
					return !checkNameExists(data, value);
				} else {
					return !checkNameExists(data, value, selectedRow?.id);
				}
			}),
		add_name_am: Yup.string().required(t("Field is required.")),
		add_name_en: Yup.string().required(t("Field is required.")),
	});
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			id: selectedRow?.id,
			rootId: selectedRow?.rootId,
			add_name_or: action === "edit" ? selectedRow?.name || "" : "",
			add_name_am: action === "edit" ? selectedRow?.add_name_am || "" : "",
			add_name_en: action === "edit" ? selectedRow?.add_name_en || "" : "",
		},

		validationSchema,
		onSubmit: (values) => {
			if (action === "add") {
				handleAddFolder(values);
			} else if (action === "edit") {
				handleUpdateFolder(values);
			}
		},
	});

	let nextLevel;
	const level = String(selectedRow?.level).trim().toLowerCase();
	if (level === "region") {
		nextLevel = "Zone";
	} else if (level === "zone") {
		nextLevel = "Woreda";
	}

	return (
		<>
			<DeleteModal
				show={deleteModal}
				onCloseClick={toggleDelete}
				onDeleteClick={handleDeleteFolder}
				isLoading={deleteFolder.isPending}
			/>
			<Modal size="md" isOpen={show} toggle={toggle} centered>
				<div className="">
					<ModalHeader toggle={toggle}>
						{action === "add"
							? `${t("add")} ${selectedRow?.name ? ` ${nextLevel} under ${selectedRow.name}` : ""}`
							: `${t("edit")} - ${selectedRow?.name || ""}`}
					</ModalHeader>
					<ModalBody className="">
						<Form onSubmit={formik.handleSubmit}>
							<Row>
								<Col md={12} className="mb-3">
									<Label>{t("add_name_or")}</Label>
									<Input
										name="add_name_or"
										type="text"
										value={formik.values.add_name_or}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										invalid={
											formik.touched.add_name_or && !!formik.errors.add_name_or
										}
									/>
									{formik.touched.add_name_or && formik.errors.add_name_or && (
										<FormFeedback>{formik.errors.add_name_or}</FormFeedback>
									)}
								</Col>

								<Col md={12} className="mb-3">
									<Label>{t("add_name_am")}</Label>
									<Input
										name="add_name_am"
										type="text"
										value={formik.values.add_name_am}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										invalid={
											formik.touched.add_name_am && !!formik.errors.add_name_am
										}
									/>
									{formik.touched.add_name_am && formik.errors.add_name_am && (
										<FormFeedback>{formik.errors.add_name_am}</FormFeedback>
									)}
								</Col>

								<Col md={12} className="mb-3">
									<Label>{t("add_name_en")}</Label>
									<Input
										name="add_name_en"
										type="text"
										value={formik.values.add_name_en}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										invalid={
											formik.touched.add_name_en && !!formik.errors.add_name_en
										}
									/>
									{formik.touched.add_name_en && formik.errors.add_name_en && (
										<FormFeedback>{formik.errors.add_name_en}</FormFeedback>
									)}
								</Col>
							</Row>
							<Button
								type="submit"
								color={action === "add" ? "primary" : "success"}
								style={{ width: "120px" }}
								disabled={addFolder.isPending || updateFolder.isPending}
							>
								<div className="d-flex gap-2 align-items-center justify-content-center">
									{addFolder.isPending || updateFolder.isPending ? (
										<Spinner size={"sm"} />
									) : (
										""
									)}
									<span> {action === "add" ? t("add") : t("edit")}</span>
								</div>
							</Button>
						</Form>
					</ModalBody>
				</div>
			</Modal>
		</>
	);
};

FormModal.propTypes = {
	show: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
	action: PropTypes.oneOf(["add", "edit"]),
	selectedRow: PropTypes.object,
};

export default FormModal;
