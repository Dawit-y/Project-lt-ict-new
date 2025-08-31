import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
	Button,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Table,
	Badge,
} from "reactstrap";

const ImplementingAreaModal = (props) => {
	const { t } = useTranslation();
	const {
		isOpen,
		toggle,
		transaction,
		regionMap,
		zoneMap,
		woredaMap,
		sectorInformationMap,
	} = props;

	const formatAmount = (amount) => {
		return amount ? parseFloat(amount).toLocaleString() : "-";
	};

	const getMappedValue = (map, value, fallback = "-") => {
		return map && value ? map[value] || value : fallback;
	};

	const modalData = [
		{
			label: t("region"),
			value: getMappedValue(regionMap, transaction?.pia_region_id),
		},
		{
			label: t("zone"),
			value: getMappedValue(zoneMap, transaction?.pia_zone_id_id),
		},
		{
			label: t("woreda"),
			value: getMappedValue(woredaMap, transaction?.pia_woreda_id),
		},
		{
			label: t("sector"),
			value: getMappedValue(sectorInformationMap, transaction?.pia_sector_id),
		},
		{
			label: t("pia_budget_amount"),
			value: formatAmount(transaction?.pia_budget_amount),
		},
		{ label: t("site"), value: transaction?.pia_site || "-" },
		{
			label: t("pia_geo_location"),
			value: transaction?.pia_geo_location || "-",
		},
		{ label: t("pia_description"), value: transaction?.pia_description || "-" },
	];

	return (
		<Modal
			isOpen={isOpen}
			role="dialog"
			autoFocus={true}
			centered={true}
			className="modal-lg"
			tabIndex="-1"
			toggle={toggle}
		>
			<ModalHeader toggle={toggle}>
				<i className="mdi mdi-eye-outline me-2"></i>
				{t("Implementing Area Details")}
			</ModalHeader>
			<ModalBody>
				<div className="table-responsive">
					<Table bordered className="mb-0">
						<tbody>
							{modalData.map((item, index) => (
								<tr key={index}>
									<th
										scope="row"
										className="text-nowrap"
										style={{ width: "200px", backgroundColor: "#f8f9fa" }}
									>
										<strong>{item.label}</strong>
									</th>
									<td className="text-break">{item.value}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			</ModalBody>
			<ModalFooter>
				<Button type="button" color="secondary" onClick={toggle}>
					<i className="mdi mdi-close-circle-outline me-1"></i>
					{t("Close")}
				</Button>
			</ModalFooter>
		</Modal>
	);
};

ImplementingAreaModal.propTypes = {
	toggle: PropTypes.func,
	isOpen: PropTypes.bool,
	transaction: PropTypes.object,
	regionMap: PropTypes.object,
	zoneMap: PropTypes.object,
	woredaMap: PropTypes.object,
	sectorInformationMap: PropTypes.object,
};

ImplementingAreaModal.defaultProps = {
	regionMap: {},
	zoneMap: {},
	woredaMap: {},
	sectorInformationMap: {},
	transaction: {},
};

export default ImplementingAreaModal;
