import React, { useState, useTransition } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
	Button,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Table,
	Row,
	Col,
	Container,
	Spinner,
} from "reactstrap";
import { PAGE_ID } from "../../constants/constantFile";
import { useFetchProjectDocuments } from "../../queries/projectdocument_query";
import { useUpdateCsoInfo } from "../../queries/csoinfo_query";
import FileList from "../Projectdocument/FileManager/FileList";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import Spinners from "../../components/Common/Spinner";
import { toast } from "react-toastify";

const FileModal = (props) => {
	const { t } = useTranslation();
	const { isOpen, toggle, transaction } = props;

	const param = {
		prd_owner_type_id: PAGE_ID.CSO,
		prd_owner_id: transaction?.cso_id,
	};
	const isQueryEnabled = Object.values(param).every(
		(value) => value !== null && value !== undefined
	);
	const { data, isLoading, isError, error, refetch } = useFetchProjectDocuments(
		param,
		isQueryEnabled
	);

	const updateCsoInfo = useUpdateCsoInfo();
	const [clickedButton, setClickedButton] = useState(null);

	const handleUpdateCsoInfo = async (data) => {
		try {
			await updateCsoInfo.mutateAsync(data);
			toast.success(t("update_success"), { autoClose: 3000 });
			setClickedButton(null);
			toggle();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleClick = (event) => {
		const name = event.target.name;
		setClickedButton(name);

		const data = {
			cso_id: transaction?.cso_id,
			cso_status: name === "approve" ? 1 : 0,
		};

		handleUpdateCsoInfo(data);
	};

	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}

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
				<ModalHeader toggle={toggle}>{t("Files")}</ModalHeader>
				<ModalBody>
					<Row className="w-50 mx-auto p-2 mb-3">
						<Col className="d-flex align-items-center justify-content-center">
							<Button
								color="success"
								className="w-100"
								name="approve"
								onClick={handleClick}
								disabled={data?.data?.length === 0 || updateCsoInfo.isPending}
							>
								{updateCsoInfo.isPending && clickedButton === "approve" ? (
									<>
										<Spinner size={"sm"} color="light" className="me-2" />{" "}
										{"Approve"}
									</>
								) : (
									"Approve"
								)}
							</Button>
						</Col>
						<Col className="d-flex align-items-center justify-content-center">
							<Button
								color="danger"
								className="w-100"
								name="reject"
								onClick={handleClick}
								disabled={data?.data?.length === 0 || updateCsoInfo.isPending}
							>
								{updateCsoInfo.isPending && clickedButton === "reject" ? (
									<>
										<Spinner size={"sm"} color="light" className="me-2" />{" "}
										{"Reject"}
									</>
								) : (
									"Reject"
								)}
							</Button>
						</Col>
					</Row>
					<hr />
					<Container>
						{isLoading ? (
							<Spinners />
						) : (
							<FileList files={data?.data || []} actions={false} />
						)}
					</Container>
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
FileModal.propTypes = {
	toggle: PropTypes.func,
	isOpen: PropTypes.bool,
	transaction: PropTypes.object,
};
export default FileModal;
