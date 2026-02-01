import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import {
	useAddUserSector,
	useFetchUserSectors,
	useUpdateUserSector,
} from "../../queries/usersector_query";
import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
import {
	Button,
	Row,
	Form,
	Input,
	Label,
	FormGroup,
	Spinner,
	Container,
	Col,
	Card,
	CardBody,
} from "reactstrap";
import { toast } from "react-toastify";
import { createMultiSelectOptions } from "../../utils/commonMethods";
import Spinners from "../../components/Common/Spinner";

const UserSectorModel = ({ passedId, isActive }) => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	const { data: sectorData, isLoading: sectorLoading } =
		useFetchSectorInformations();
	const { data: userSectorsData, isLoading: userSectorsLoading } =
		useFetchUserSectors({ usc_user_id: passedId }, isActive);
	const addUserSector = useAddUserSector();
	const updateUserSector = useUpdateUserSector();

	const sectorOptions = useMemo(() => {
		return createMultiSelectOptions(sectorData?.data || [], "sci_id", [
			"sci_name_en",
			"sci_name_or",
			"sci_name_am",
		]);
	}, [sectorData]);

	const getOptionsByLanguage = () => {
		switch (lang) {
			case "en":
				return sectorOptions.sci_name_en;
			case "am":
				return sectorOptions.sci_name_am;
			case "or":
				return sectorOptions.sci_name_or;
			default:
				return sectorOptions.sci_name_en;
		}
	};

	const [filterInput, setFilterInput] = useState("");
	const [selectAll, setSelectAll] = useState(false);
	const [initialSectors, setInitialSectors] = useState({});

	const filteredOptions = useMemo(() => {
		return getOptionsByLanguage().filter((option) =>
			option.label.toLowerCase().includes(filterInput.toLowerCase())
		);
	}, [filterInput, lang, sectorOptions]);
	const shouldSplit = filteredOptions.length > 26;
	const midIndex = Math.ceil(filteredOptions.length / 2);
	const getUserSectorMap = () => {
		return (
			userSectorsData?.data?.reduce((acc, sector) => {
				acc[sector.usc_sector_id] = sector.usc_status === 1;
				return acc;
			}, {}) || {}
		);
	};

	useEffect(() => {
		if (userSectorsData?.data) {
			setInitialSectors(getUserSectorMap());
		}
	}, [userSectorsData]);

	const validation = useFormik({
		enableReinitialize: true,
		initialValues: { sectors: initialSectors },
		validationSchema: Yup.object({
			sectors: Yup.object().required(),
		}),
		onSubmit: async (values) => {
			try {
				const payload = Object.entries(values.sectors).map(([id, checked]) => ({
					usc_sector_id: Number(id),
					usc_user_id: Number(passedId),
					usc_status: checked ? 1 : 0,
				}));

				const userSectorMap =
					userSectorsData?.data?.reduce((acc, sector) => {
						acc[sector.usc_sector_id] = sector;
						return acc;
					}, {}) || {};

				const allSectorIds = new Set([
					...Object.keys(values.sectors),
					...Object.keys(initialSectors),
				]);

				const allPayloads = [];

				Array.from(allSectorIds).forEach((sectorId) => {
					const id = Number(sectorId);
					const currentStatus = values.sectors[sectorId] ? 1 : 0;
					const initialStatus = initialSectors[sectorId] ? 1 : 0;
					const existingSector = userSectorMap[id];

					if (
						currentStatus !== initialStatus ||
						(!existingSector && currentStatus === 1)
					) {
						const payload = {
							usc_sector_id: id,
							usc_user_id: Number(passedId),
							usc_status: currentStatus,
							usc_id: existingSector?.usc_id || 0,
						};
						allPayloads.push(payload);
					}
				});

				if (allPayloads.length > 0) {
					await updateUserSector.mutateAsync(allPayloads);
					toast.success(t("update_success"), { autoClose: 3000 });
				} else {
					toast.info(t("no_changes_detected"), { autoClose: 3000 });
				}
			} catch (error) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		},
	});

	const handleSelectAll = (e) => {
		setSelectAll(e.target.checked);
		validation.setFieldValue(
			"sectors",
			e.target.checked
				? Object.fromEntries(filteredOptions.map(({ value }) => [value, true]))
				: initialSectors
		);
	};

	return (
		<Card>
			<CardBody>
				<Form onSubmit={validation.handleSubmit}>
					<Row
						className="d-flex flex-column align-items-center"
						style={{ minHeight: "300px" }}
					>
						{sectorLoading || userSectorsLoading ? (
							<Spinners />
						) : (
							<>
								<Row
									xl={12}
									className="mb-2 d-flex align-items-center justify-content-between"
								>
									<Col className="d-flex align-items-center gap-3 mb-3">
										<FormGroup
											check
											className="d-flex align-items-center gap-2 mb-0"
										>
											<Input
												type="checkbox"
												id="select-all"
												checked={selectAll}
												onChange={handleSelectAll}
												style={{ width: "15px", height: "15px" }}
											/>
											<Label for="select-all" className="mb-0">
												<strong>{t("Select All")}</strong>
											</Label>
										</FormGroup>

										<Button
											color="secondary"
											outline
											size="sm"
											onClick={() => {
												setSelectAll(false);
												validation.setFieldValue("sectors", {});
											}}
										>
											{t("Clear All")}
										</Button>
									</Col>
									<Col xl={6}>
										<Input
											name="filter"
											value={filterInput}
											onChange={(e) => setFilterInput(e.target.value)}
											placeholder={t("filter_placeholder")}
										/>
									</Col>
								</Row>
								<hr />
								<Col className="">
									<Row className="g-2">
										{filteredOptions.map(({ value, label }) => (
											<Col md={4} key={value}>
												{" "}
												{/* Each column takes 4/12 = 3 columns per row */}
												<FormGroup className="d-flex align-items-center gap-2">
													<Input
														id={`checkbox-${value}`}
														type="checkbox"
														className="form-check-input form-check-input-lg"
														checked={validation.values.sectors[value] || false}
														onChange={(e) =>
															validation.setFieldValue("sectors", {
																...validation.values.sectors,
																[value]: e.target.checked,
															})
														}
														style={{ width: "15px", height: "15px" }}
													/>
													<Label
														for={`checkbox-${value}`}
														style={{ fontSize: ".8rem" }}
														className="me-2 my-auto"
													>
														{label}
													</Label>
												</FormGroup>
											</Col>
										))}
									</Row>
								</Col>
							</>
						)}
					</Row>
					<div className="text-center mt-3">
						<Button
							className="w-50"
							type="submit"
							color="success"
							disabled={addUserSector.isPending || updateUserSector.isPending}
						>
							{(addUserSector.isPending || updateUserSector.isPending) && (
								<Spinner size="sm" className="me-2" />
							)}
							Submit
						</Button>
					</div>
				</Form>
			</CardBody>
		</Card>
	);
};

UserSectorModel.propTypes = {
	passedId: PropTypes.number.isRequired,
	isActive: PropTypes.bool,
};

export default UserSectorModel;
