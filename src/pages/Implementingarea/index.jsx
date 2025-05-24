import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import DeleteModal from "../../components/Common/DeleteModal";
import { useQuery } from "@tanstack/react-query";
import { post } from "../../helpers/api_Lists";
import {
  useFetchImplementingAreas,
  useSearchImplementingAreas,
  useAddImplementingArea,
  useDeleteImplementingArea,
  useUpdateImplementingArea,
} from "../../queries/implementingarea_query";
import ImplementingAreaModal from "./ImplementingAreaModal";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import {
  Button,
  Col,
  Row,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Label,
  Card,
  CardBody,
  FormGroup,
  Badge,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns1";
import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
import { createMultiSelectOptions } from "../../utils/commonMethods";
import InputField from "../../components/Common/InputField";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ImplementingAreaModel = (props) => {
  //meta title
  document.title = " ImplementingArea";
  const { passedId, isActive, totalActualBudget } = props;
  const param = {
    pia_project_id: passedId,
    request_type: "single",
    prj_total_actual_budget: totalActualBudget,
  };
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [implementingArea, setImplementingArea] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [addressMaps, setAddressMaps] = useState({
    zones: {},
    woredas: {},
  });

  const { data, isLoading, isFetching, error, isError, refetch } =
    useFetchImplementingAreas(param, isActive);
  const addImplementingArea = useAddImplementingArea();
  const updateImplementingArea = useUpdateImplementingArea();
  const deleteImplementingArea = useDeleteImplementingArea();

  // Fetch sector data
  const { data: sectorData } = useFetchSectorInformations();
  const sectorOptions = createMultiSelectOptions(
    sectorData?.data || [],
    "sci_id",
    ["sci_name_en", "sci_name_or", "sci_name_am"]
  );

  const sectorsMap = useMemo(() => {
    const map = {};
    sectorData?.data?.forEach((sector) => {
      map[sector.sci_id] = sector[`sci_name_${lang}`];
    });
    return map;
  }, [sectorData, lang]);

  // START CRUD operations
  const handleAddImplementingArea = async (data) => {
    try {
      await addImplementingArea.mutateAsync(data);
      toast.success(t("add_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("add_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleUpdateImplementingArea = async (data) => {
    try {
      await updateImplementingArea.mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("update_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleDeleteImplementingArea = async () => {
    if (implementingArea && implementingArea.pia_id) {
      try {
        const id = implementingArea.pia_id;
        await deleteImplementingArea.mutateAsync(id);
        toast.success(t("delete_success"), {
          autoClose: 2000,
        });
      } catch (error) {
        toast.success(t("delete_failure"), {
          autoClose: 2000,
        });
      }
      setDeleteModal(false);
    }
  };
  // END CRUD operations

  const calculateCurrentTotal = (
    currentData,
    editingId = null,
    newAmount = 0
  ) => {
    if (!currentData || !currentData.data) return 0;

    return currentData.data.reduce((total, item) => {
      // If editing, exclude the item being edited from the total
      if (editingId && item.pia_id === editingId) {
        return total + Number(newAmount || 0);
      }
      return total + Number(item.pia_budget_amount || 0);
    }, 0);
  };

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      pia_project_id: passedId,
      pia_region_id: (implementingArea && implementingArea.pia_region_id) || "",
      pia_zone_id_id:
        (implementingArea && implementingArea.pia_zone_id_id) || "",
      pia_woreda_id: (implementingArea && implementingArea.pia_woreda_id) || "",
      pia_sector_id: (implementingArea && implementingArea.pia_sector_id) || "",
      pia_budget_amount:
        (implementingArea && implementingArea.pia_budget_amount) || "",
      pia_site: (implementingArea && implementingArea.pia_site) || "",
      pia_geo_location:
        (implementingArea && implementingArea.pia_geo_location) || "",
      pia_description:
        (implementingArea && implementingArea.pia_description) || "",
      pia_status: (implementingArea && implementingArea.pia_status) || "",
      is_deletable: (implementingArea && implementingArea.is_deletable) || 1,
      is_editable: (implementingArea && implementingArea.is_editable) || 1,
    },
    validationSchema: Yup.object({
      pia_region_id: Yup.string().required(t("pia_region_id")),
      pia_zone_id_id: Yup.string().required(t("pia_zone_id_id")),
      pia_woreda_id: Yup.string().required(t("pia_woreda_id")),
      pia_sector_id: Yup.string().required(t("pia_sector_id")),
      pia_site: Yup.string().required(t("pia_site")),
      pia_geo_location: Yup.string().required(t("pia_geo_location")),

      pia_budget_amount: Yup.number()
        .required(t("pia_budget_amount"))
        .positive("Amount must be positive")
        .test(
          "total-budget",
          "Amount exceeds remaining project budget",
          function (value) {
            if (!value || isNaN(value)) return true;

            const currentData = showSearchResult ? searchResults : data;
            const editingId = isEdit ? implementingArea?.pia_id : null;

            // Calculate total without the current edited item
            const currentTotalWithoutThis =
              currentData?.data?.reduce((total, item) => {
                if (editingId && item.pia_id === editingId) return total;
                return total + Number(item.pia_budget_amount || 0);
              }, 0) || 0;

            // Calculate new total if this amount is added/updated
            const newTotal = currentTotalWithoutThis + Number(value);

            return newTotal <= totalActualBudget;
          }
        ),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateImplementingArea = {
          pia_id: implementingArea?.pia_id,
          pia_project_id: passedId,
          pia_region_id: values.pia_region_id,
          pia_zone_id_id: values.pia_zone_id_id,
          pia_woreda_id: values.pia_woreda_id,
          pia_sector_id: values.pia_sector_id,
          pia_budget_amount: values.pia_budget_amount,
          pia_site: values.pia_site,
          pia_geo_location: values.pia_geo_location,
          pia_description: values.pia_description,
          pia_status: values.pia_status,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        handleUpdateImplementingArea(updateImplementingArea);
      } else {
        const newImplementingArea = {
          pia_project_id: passedId,
          pia_region_id: values.pia_region_id,
          pia_zone_id_id: values.pia_zone_id_id,
          pia_woreda_id: values.pia_woreda_id,
          pia_sector_id: values.pia_sector_id,
          pia_budget_amount: values.pia_budget_amount,
          pia_site: values.pia_site,
          pia_geo_location: values.pia_geo_location,
          pia_description: values.pia_description,
          pia_status: values.pia_status,
        };
        handleAddImplementingArea(newImplementingArea);
      }
    },
  });

  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  useEffect(() => {
    setImplementingArea(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setImplementingArea(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setImplementingArea(null);
    } else {
      setModal(true);
    }
  };

  const handleImplementingAreaClick = (arg) => {
    const implementingArea = arg;
    setImplementingArea({
      pia_id: implementingArea.pia_id,
      pia_project_id: implementingArea.pia_project_id,
      pia_region_id: implementingArea.pia_region_id,
      pia_zone_id_id: implementingArea.pia_zone_id_id,
      pia_woreda_id: implementingArea.pia_woreda_id,
      pia_sector_id: implementingArea.pia_sector_id,
      pia_budget_amount: implementingArea.pia_budget_amount,
      pia_site: implementingArea.pia_site,
      pia_geo_location: implementingArea.pia_geo_location,
      pia_description: implementingArea.pia_description,
      pia_status: implementingArea.pia_status,
      is_deletable: implementingArea.is_deletable,
      is_editable: implementingArea.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (implementingArea) => {
    setImplementingArea(implementingArea);
    setDeleteModal(true);
  };

  const handleImplementingAreaClicks = () => {
    setIsEdit(false);
    setImplementingArea("");
    toggle();
  };

  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };

  // 2. Fetch all zones and woredas when component mounts
  const { data: allZones = [] } = useQuery({
    queryKey: ["allZones"],
    queryFn: async () => {
      const response = await post("addressbyparent?parent_id=1"); // Oromia's ID
      return response?.data || [];
    },
  });

  // 3. Fetch all woredas when zones are loaded
  const { data: allWoredas = [] } = useQuery({
    queryKey: ["allWoredas"],
    queryFn: async () => {
      if (!allZones.length) return [];

      const woredaPromises = allZones.map((zone) =>
        post(`addressbyparent?parent_id=${zone.id}`)
      );

      const woredaResponses = await Promise.all(woredaPromises);
      return woredaResponses.flatMap((res) => res?.data || []);
    },
    enabled: !!allZones.length,
  });

  // 4. Update address maps when data loads
  useEffect(() => {
    const newMaps = { zones: {}, woredas: {} };

    // Build zones map
    allZones.forEach((zone) => {
      newMaps.zones[zone.id] = zone.name;
    });

    // Build woredas map
    allWoredas.forEach((woreda) => {
      newMaps.woredas[woreda.id] = woreda.name;
    });

    setAddressMaps(newMaps);
  }, [allZones, allWoredas]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: t("region"),
        accessorKey: "pia_region_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.pia_region_id == 1 && "Oromia",
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: t("zone"),
        accessorKey: "pia_zone_id_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                addressMaps.zones[cellProps.row.original.pia_zone_id_id],
                30
              ) || `Zone ID: ${cellProps.row.original.pia_zone_id_id}`}
            </span>
          );
        },
      },
      {
        header: t("woreda"),
        accessorKey: "pia_woreda_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const woredaId = cellProps.row.original.pia_woreda_id;
          return (
            <span>
              {truncateText(
                addressMaps.woredas[woredaId] || `Woreda ID: ${woredaId}`,
                30
              )}{" "}
            </span>
          );
        },
      },
      {
        header: t("sector"),
        accessorKey: "pia_sector_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                sectorsMap[cellProps.row.original.pia_sector_id],
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: t("pia_budget_amount"),
        accessorKey: "pia_budget_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.pia_budget_amount.toLocaleString(),
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: t("site"),
        accessorKey: "pia_site",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pia_site, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: t("pia_geo_location"),
        accessorKey: "pia_geo_location",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pia_geo_location, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: t("description"),
        accessorKey: "pia_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pia_description, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: t("view_detail"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm"
              onClick={() => {
                const data = cellProps.row.original;
                toggleViewModal(data);
                setTransaction(cellProps.row.original);
              }}
            >
              {t("view_detail")}
            </Button>
          );
        },
      },
    ];

    if (
      data?.previledge?.is_role_editable == 1 ||
      data?.previledge?.is_role_deletable == 1
    ) {
      baseColumns.push({
        header: t("Action"),
        accessorKey: t("Action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              {cellProps.row.original.is_editable == 1 && (
                <Link
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleImplementingAreaClick(data);
                  }}
                >
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </Link>
              )}
              {cellProps.row.original.is_deletable == 1 && (
                <Link
                  className="text-danger"
                  onClick={() => {
                    const data = cellProps.row.original;
                    onClickDelete(data);
                  }}
                >
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                  />
                  <UncontrolledTooltip placement="top" target="deletetooltip">
                    Delete
                  </UncontrolledTooltip>
                </Link>
              )}
            </div>
          );
        },
      });
    }
    return baseColumns;
  }, [handleImplementingAreaClick, toggleViewModal, onClickDelete, t]);

  return (
    <React.Fragment>
      <ImplementingAreaModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteImplementingArea}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteImplementingArea.isPending}
      />

      {isLoading || isSearchLoading ? (
        <Spinners />
      ) : (
        <Row>
          <Col xs="12">
            <TableContainer
              columns={columns}
              data={showSearchResult ? searchResults?.data : data?.data || []}
              isGlobalFilter={true}
              isAddButton={data?.previledge?.is_role_can_add == 1}
              isCustomPageSize={true}
              handleUserClick={handleImplementingAreaClicks}
              isPagination={true}
              SearchPlaceholder={26 + " " + t("Results") + "..."}
              buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
              buttonName={t("add")}
              tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
              theadClass="table-light"
              pagination="pagination"
              paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
              refetch={refetch}
              isFetching={isFetching}
            />
          </Col>
        </Row>
      )}
      <Modal isOpen={modal} toggle={toggle} className="modal-xl">
        <ModalHeader toggle={toggle} tag="h4">
          {!!isEdit
            ? t("edit") + " " + t("implementing_area")
            : t("add") + " " + t("implementing_area")}
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
              <Col className="col-12 mb-3">
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>{t("Total_Project_Budget")} : </strong>{" "}
                        {totalActualBudget
                          ? totalActualBudget.toLocaleString()
                          : "0"}
                      </div>
                      <div>
                        <strong>{t("Allocated")} : </strong>{" "}
                        {calculateCurrentTotal(data)
                          ? calculateCurrentTotal(data).toLocaleString()
                          : "0"}
                      </div>
                      <div
                        className={
                          calculateCurrentTotal(data) > (totalActualBudget || 0)
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        <strong>{t("Remaining")} : </strong>{" "}
                        {(
                          (totalActualBudget || 0) -
                          (calculateCurrentTotal(data) || 0)
                        ).toLocaleString()}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xl={12} className="mb-3">
                <CascadingDropdowns
                  validation={validation}
                  dropdown1name="pia_region_id"
                  dropdown2name="pia_zone_id_id"
                  dropdown3name="pia_woreda_id"
                  required={true}
                  layout="horizontal"
                  colSizes={{ md: 6, sm: 12, lg: 4 }}
                />
              </Col>
              <Col xl={4} className="mb-3">
                <Label>
                  {t("pia_sector_id")} <span className="text-danger">*</span>
                </Label>
                <Input
                  name="pia_sector_id"
                  type="select"
                  className="form-select"
                  {...validation.getFieldProps("pia_sector_id")}
                  invalid={
                    validation.touched.pia_sector_id &&
                    !!validation.errors.pia_sector_id
                  }
                >
                  <option value="">{t("prj_select_category")}</option>
                  {sectorOptions[`sci_name_${lang}`]?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.label)}
                    </option>
                  ))}
                </Input>
                {validation.touched.pia_sector_id &&
                  validation.errors.pia_sector_id && (
                    <FormFeedback>
                      {validation.errors.pia_sector_id}
                    </FormFeedback>
                  )}
              </Col>
              <Col className="col-md-4 mb-3">
                <FormattedAmountField
                  validation={validation}
                  fieldId="pia_budget_amount"
                  label={t("pia_budget_amount")}
                  isRequired={true}
                  max={totalActualBudget}
                />

                <small className="text-muted">
                  Available budget:{" "}
                  {(
                    (totalActualBudget || 0) -
                    (calculateCurrentTotal(
                      data,
                      isEdit ? implementingArea?.pia_id : null
                    ) || 0)
                  ).toLocaleString()}
                </small>
              </Col>

              <InputField
                validation={validation}
                fieldId={"pia_site"}
                isRequired={true}
                className="col-md-4 mb-3"
                maxLength={400}
              />

              <InputField
                validation={validation}
                fieldId={"pia_geo_location"}
                isRequired={true}
                className="col-md-4 mb-3"
                maxLength={400}
              />
              <InputField
                type="textarea"
                validation={validation}
                fieldId={"pia_description"}
                isRequired={true}
                className="col-md-8 mb-3"
                maxLength={1000}
              />
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  {addImplementingArea.isPending ||
                  updateImplementingArea.isPending ? (
                    <Button
                      color="success"
                      type="submit"
                      className="save-user"
                      disabled={
                        addImplementingArea.isPending ||
                        updateImplementingArea.isPending ||
                        !validation.dirty
                      }
                    >
                      <Spinner size={"sm"} color="light" className="me-2" />
                      {t("Save")}
                    </Button>
                  ) : (
                    <Button
                      color="success"
                      type="submit"
                      className="save-user"
                      disabled={
                        addImplementingArea.isPending ||
                        updateImplementingArea.isPending ||
                        !validation.dirty
                      }
                    >
                      {t("Save")}
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>

      <ToastContainer />
    </React.Fragment>
  );
};

ImplementingAreaModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ImplementingAreaModel;
