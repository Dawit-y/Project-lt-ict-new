import React, {
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle,
	useMemo,
} from "react";
import {
	Card,
	CardBody,
	Col,
	Row,
	Collapse,
	Label,
	Input,
	InputGroup,
	UncontrolledTooltip,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import FetchErrorHandler from "./FetchErrorHandler";
import { formatDate } from "./DatePicker";
import { parseDateString } from "../../utils/commonMethods";
import { EtCalendar } from "react-ethiopian-calendar";
import "react-ethiopian-calendar/dist/index.css";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useFetchAddressStructures } from "../../queries/address_structure_query";

const AdvancedSearch = forwardRef(
	(
		{
			searchHook,
			textSearchKeys,
			dropdownSearchKeys,
			checkboxSearchKeys,
			dateSearchKeys,
			Component,
			component_params = {},
			additionalParams,
			setAdditionalParams,
			onSearchResult,
			onSearchLabels,
			setIsSearchLoading,
			setSearchResults,
			setShowSearchResult,
			getSearchParams,
			setExportSearchParams,
			onPaginationChange,
			pagination = { currentPage: 1, pageSize: 10 },
			setPaginationInfo,
			onClear,
			children,

			initialSearchParams = {},
			initialAdditionalParams = {},
			initialPagination = { currentPage: 1, pageSize: 10 },
		},
		ref
	) => {
		const { t } = useTranslation();
		const [isOpen, setIsOpen] = useState(false);
		const toggle = () => setIsOpen(!isOpen);

		const [params, setParams] = useState(initialSearchParams ?? {});
		const [searchParams, setSearchParams] = useState({});
		const [paramsWithLabels, setParamsWithLabels] = useState({});

		const [initialized, setInitialized] = useState(false);

		const { userId } = useAuthUser();
		const { regions, zones, woredas } = useFetchAddressStructures(userId);

		const {
			data = [],
			isLoading,
			isFetching,
			refetch,
			isError,
			error,
		} = searchHook(searchParams);

		// Create initial values for ALL search fields including component fields
		const createInitialValues = () => {
			const values = {};

			// Add component field values
			if (component_params) {
				Object.values(component_params).forEach((fieldName) => {
					values[fieldName] = "";
				});
			}

			// Add text search fields
			if (textSearchKeys) {
				textSearchKeys.forEach((key) => {
					values[key] = initialSearchParams[key] || "";
				});
			}

			// Add dropdown search fields
			if (dropdownSearchKeys) {
				dropdownSearchKeys.forEach(({ key }) => {
					values[key] = initialSearchParams[key] || "";
				});
			}

			// Add date search fields
			if (dateSearchKeys) {
				dateSearchKeys.forEach((key) => {
					values[`${key}_start`] = initialSearchParams[`${key}_start`] || "";
					values[`${key}_end`] = initialSearchParams[`${key}_end`] || "";
				});
			}

			return values;
		};

		const validation = useFormik({
			initialValues: createInitialValues(),
			onSubmit: (values) => {
				// Handle form submission if needed
			},
		});

		// Handle updates for all input types
		const handleSearchKey = (key, value, type = "text", label = "") => {
			validation.setFieldValue(key, value);

			// Update params (values)
			setParams((prevParams) => {
				if (type === "checkbox") {
					const currentValues = prevParams[key] || [];
					const updatedValues = Array.isArray(currentValues)
						? currentValues.includes(value)
							? currentValues.filter((v) => v !== value)
							: [...currentValues, value]
						: [value];

					return { ...prevParams, [key]: updatedValues };
				}

				if (value === "") {
					const updatedParams = { ...prevParams };
					delete updatedParams[key];
					return updatedParams;
				}

				return { ...prevParams, [key]: value };
			});

			// Update labels in a separate state
			setParamsWithLabels((prevLabels) => {
				if (value === "") {
					const updatedLabels = { ...prevLabels };
					delete updatedLabels[key];
					return updatedLabels;
				}
				return { ...prevLabels, [key]: label };
			});
		};

		const handleSearch = (resetToPageOne = false) => {
			const allValues = validation.values;

			// Filter out empty values and convert numbers
			const transformedValues = Object.fromEntries(
				Object.entries(allValues)
					.filter(([key, value]) => value !== "" && value != null)
					.map(([key, value]) => [
						key,
						/^\d+$/.test(value) ? parseInt(value, 10) : value,
					])
			);

			// Use current pagination from Redux, unless we're resetting to page 1
			const currentPage = resetToPageOne ? 1 : pagination.currentPage;
			const pageSize = pagination.pageSize;

			// Combine values (IDs)
			const combinedParams = {
				...params,
				...transformedValues,
				...(additionalParams || {}),
				page: currentPage,
				per_page: pageSize,
			};

			// Map helper
			const findLabel = (list, id) => {
				const match = list?.find((item) => String(item.id) === String(id));
				return match ? match.name : id;
			};

			// Build labels
			const combinedParamsLabels = {
				...paramsWithLabels,
				...(additionalParams?.prj_location_region_id && {
					prj_location_region_id: findLabel(
						regions,
						additionalParams.prj_location_region_id
					),
				}),
				...(additionalParams?.prj_location_zone_id && {
					prj_location_zone_id: findLabel(
						zones,
						additionalParams.prj_location_zone_id
					),
				}),
				...(additionalParams?.prj_location_woreda_id && {
					prj_location_woreda_id: findLabel(
						woredas,
						additionalParams.prj_location_woreda_id
					),
				}),
			};

			// Update states
			setSearchParams(combinedParams);
			if (onSearchLabels) {
				onSearchLabels(combinedParamsLabels);
			}
			if (getSearchParams) {
				getSearchParams(combinedParams);
			}

			// Only reset to page 1 if explicitly requested (for new searches)
			if (resetToPageOne && onPaginationChange) {
				onPaginationChange({
					...pagination,
					currentPage: 1,
				});
			}
		};

		// Refetch whenever searchParams changes
		useEffect(() => {
			const fetchData = async () => {
				try {
					setIsSearchLoading(true);
					const result = await refetch();
					const { data, error } = result;
					onSearchResult({ data, error });
				} catch (error) {
					console.error("Error during search:", error);
				} finally {
					setIsSearchLoading(false);
				}
			};

			if (Object.keys(searchParams).length > 0) {
				fetchData();
			}
		}, [searchParams]);

		// Initialize with existing search params and pagination
		useEffect(() => {
			if (
				!initialized &&
				(Object.keys(initialSearchParams).length > 0 ||
					Object.keys(initialAdditionalParams).length > 0)
			) {
				// Set form values from initial search params
				Object.entries(initialSearchParams).forEach(([key, value]) => {
					if (value !== "" && value != null) {
						validation.setFieldValue(key, value);
					}
				});

				// Set params state
				setParams(initialSearchParams);

				// Trigger search with current pagination
				const searchParamsToSet = {
					...initialSearchParams,
					...initialAdditionalParams,
					page: initialPagination.currentPage,
					per_page: initialPagination.pageSize,
				};

				setSearchParams(searchParamsToSet);
				setInitialized(true);
			}
		}, [initialSearchParams, initialAdditionalParams, initialized]);

		const handleClear = () => {
			setParams({});
			setSearchParams({});
			setParamsWithLabels({});
			setSearchResults(null);
			setShowSearchResult(false);
			validation.resetForm();

			// Clear date range parameters
			if (dateSearchKeys) {
				dateSearchKeys.forEach((key) => {
					handleSearchKey(`${key}_start`, "");
					handleSearchKey(`${key}_end`, "");
				});
			}
			if (setAdditionalParams) {
				setAdditionalParams({});
			}
			if (setExportSearchParams) {
				setExportSearchParams({});
			}

			if (setPaginationInfo) {
				setPaginationInfo({
					current_page: 1,
					per_page: 10,
					total: 0,
					total_pages: 0,
					has_next: false,
					has_prev: false,
				});
			}
			if (onClear) {
				onClear();
			}
		};

		const isButtonDisabled = useMemo(() => {
			const hasAnyValue = Object.entries({
				...params,
				...validation.values,
				...additionalParams,
			}).some(([key, value]) => {
				if (key === "include") {
					return false;
				}

				if (Array.isArray(value)) {
					return value.length > 0;
				}
				return value != null && value !== "";
			});

			return !hasAnyValue;
		}, [params, validation.values, additionalParams]);

		// Expose method to get search values
		useImperativeHandle(ref, () => ({
			refreshSearch: async () => refetch(),
			searchWithCurrentPagination: () => handleSearch(false),
		}));

		// Refetch when pagination changes - use current pagination
		useEffect(() => {
			if (Object.keys(searchParams).length > 0 && initialized) {
				const updatedSearchParams = {
					...searchParams,
					page: pagination.currentPage,
					per_page: pagination.pageSize,
				};
				setSearchParams(updatedSearchParams);
			}
		}, [pagination.currentPage, pagination.pageSize]);

		const inputStyles = { width: "100%", maxWidth: "100%" };

		if (isError) {
			return <FetchErrorHandler error={error} refetch={refetch} />;
		}

		return (
			<React.Fragment>
				<Card className="p-0 m-0 mb-3">
					<CardBody className="p-1">
						<form action="#">
							<Row
								xxl={12}
								lg={12}
								className="pt-2 d-flex flex-row flex-wrap justify-content-center align-items-center gap-1"
							>
								<Row xxl={12} lg={12}>
									<Col xxl={10} lg={10}>
										<div
											className="d-grid gap-2 mb-1"
											style={{
												display: "grid",
												gridTemplateColumns:
													"repeat(auto-fill, minmax(220px, 1fr))",
												gap: "1rem",
											}}
										>
											{/* Text Inputs */}
											{dateSearchKeys &&
												dateSearchKeys.map((key) => (
													<div key={key}>
														<div className="">
															<InputGroup
																style={inputStyles}
																className="rounded"
															>
																<EtCalendar
																	calendarType={true}
																	lang="en"
																	dateRange={true}
																	placeholder={t(key)}
																	onChange={(dateRange) => {
																		if (
																			dateRange &&
																			dateRange.startDate &&
																			dateRange.endDate
																		) {
																			const start = formatDate(
																				dateRange.startDate
																			);
																			const end = formatDate(dateRange.endDate);
																			handleSearchKey(
																				`${key}_start`,
																				start,
																				"date",
																				start
																			);
																			handleSearchKey(
																				`${key}_end`,
																				end,
																				"date",
																				end
																			);
																		} else {
																			handleSearchKey(
																				`${key}_start`,
																				"",
																				"date",
																				""
																			);
																			handleSearchKey(
																				`${key}_end`,
																				"",
																				"date",
																				""
																			);
																		}
																	}}
																	value={
																		params[`${key}_start`] &&
																		params[`${key}_end`]
																			? {
																					startDate: parseDateString(
																						params[`${key}_start`]
																					),
																					endDate: parseDateString(
																						params[`${key}_end`]
																					),
																				}
																			: null
																	}
																	style={inputStyles}
																/>
															</InputGroup>
														</div>
													</div>
												))}

											{textSearchKeys &&
												textSearchKeys.map((key) => (
													<div key={key}>
														<div className="">
															<Input
																type="text"
																id={key}
																name={key}
																autoComplete="off"
																placeholder={t(key)}
																value={params[key] || ""}
																onChange={(e) => {
																	handleSearchKey(
																		key,
																		e.target.value,
																		"text",
																		e.target.value
																	);
																}}
																style={inputStyles}
															/>
														</div>
													</div>
												))}
											{/* Dropdown Inputs */}
											{dropdownSearchKeys &&
												dropdownSearchKeys.map(({ key, options }) => (
													<div key={key}>
														<div className="">
															<Input
																name={key}
																id={key}
																type="select"
																className="form-select"
																onChange={(event) => {
																	const value = event.target.value;
																	const label =
																		event.target.options[
																			event.target.selectedIndex
																		].text;
																	handleSearchKey(key, value, "text", label);
																}}
																value={params[key] || ""}
																style={inputStyles}
															>
																<option value={""}>
																	{t("Select") + " " + t(`${key}`)}
																</option>
																{options.map((option) => (
																	<option
																		key={`${option.value}-${key}`}
																		value={option.value}
																	>
																		{t(`${option.label}`)}
																	</option>
																))}
															</Input>
														</div>
													</div>
												))}
										</div>
									</Col>
									<Col
										xxl={2}
										lg={2}
										md={2}
										sm={12}
										className="d-flex flex-row flex-wrap justify-content-center align-items-start gap-1"
									>
										<div
											id="search-icon-wrapper"
											className=" flex-grow-1 mb-2"
											style={{ display: "flex" }}
										>
											<button
												id="search-icon"
												type="button"
												className="btn btn-primary h-100 w-100 p-2"
												onClick={() => handleSearch(true)} // Reset to page 1 for new searches
												disabled={isButtonDisabled}
											>
												<i className="bx bx-search-alt align-middle"></i>
											</button>
											<UncontrolledTooltip
												placement="top"
												target={"search-icon-wrapper"}
											>
												{t("srch_search")}
											</UncontrolledTooltip>
										</div>
										<div className=" flex-grow-1 mb-2">
											<button
												type="button"
												className="btn btn-outline-danger align-middle h-100 w-100 p-2"
												onClick={handleClear}
												id="clear-button"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="12"
													height="12"
													fill="currentColor"
													className="bi bi-x-square"
													viewBox="0 0 16 16"
												>
													<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
													<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
												</svg>
											</button>
											<UncontrolledTooltip
												placement="top"
												target={"clear-button"}
											>
												{t("srch_clear")}
											</UncontrolledTooltip>
										</div>

										{(checkboxSearchKeys?.length > 0 || Component) && (
											<div className=" flex-grow-1 mb-2">
												<button
													type="button"
													id="more-filter-icon"
													onClick={toggle}
													className="btn btn-secondary h-100 w-100 p-2"
												>
													<i className="bx bx-filter-alt align-middle"></i>
												</button>
												<UncontrolledTooltip
													placement="top"
													target={"more-filter-icon"}
												>
													{t("srch_more")}
												</UncontrolledTooltip>
											</div>
										)}
									</Col>
								</Row>

								<Collapse isOpen={isOpen} id="collapseExample">
									<div>
										<Row className="">
											<Col>
												{Component && validation && (
													<Component
														{...component_params}
														validation={validation}
														isEdit={false}
													/>
												)}
											</Col>
										</Row>
										<Row className="g-3">
											{checkboxSearchKeys &&
												checkboxSearchKeys.map(({ key, options }) => (
													<Col key={key} xxl={4} lg={6}>
														<div>
															<Label
																htmlFor={key}
																className="form-label fw-semibold"
															>
																{key}
															</Label>
														</div>
														{(options || []).map((item, index) => (
															<div
																className="form-check form-check-inline"
																key={index}
															>
																<Input
																	className="form-check-input"
																	type="checkbox"
																	id={`inlineCheckbox${index}`}
																	value={item.value}
																	checked={(params[key] || []).includes(
																		item.value
																	)}
																	onChange={(e) =>
																		handleSearchKey(
																			key,
																			e.target.checked ? item.value : null,
																			"checkbox",
																			item.label
																		)
																	}
																/>
																<Label
																	className="form-check-label"
																	htmlFor={`inlineCheckbox${index}`}
																>
																	{item.label}
																</Label>
															</div>
														))}
													</Col>
												))}
										</Row>
									</div>
								</Collapse>
							</Row>
						</form>
					</CardBody>
				</Card>
				<div>
					{children &&
						React.cloneElement(children, { data, isLoading: isFetching })}
				</div>
			</React.Fragment>
		);
	}
);

export default AdvancedSearch;
