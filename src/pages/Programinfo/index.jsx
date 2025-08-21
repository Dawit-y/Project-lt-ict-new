import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchProgramInfos,
  useSearchProgramInfos,
  useAddProgramInfo,
  useDeleteProgramInfo,
  useUpdateProgramInfo,
} from "../../queries/programinfo_query";
import ProgramInfoModal from "./ProgramInfoModal";
import { useTranslation } from "react-i18next";
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
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
} from "../../utils/Validation/validation";
import { toast } from "react-toastify";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProgramInfoModel = ({ node }) => {
  const { region_id, zone_id, woreda_id, s_id } = node;
  const params = {
    pri_owner_region_id: region_id,
    pri_owner_zone_id: zone_id,
    pri_owner_woreda_id: woreda_id,
    pri_sector_id: s_id,
  };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [programInfo, setProgramInfo] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } = useFetchProgramInfos(
    params,
    Object.keys(params).length > 0,
  );
  const addProgramInfo = useAddProgramInfo();
  const updateProgramInfo = useUpdateProgramInfo();
  const deleteProgramInfo = useDeleteProgramInfo();
  //START CRUD
  const handleAddProgramInfo = async (data) => {
    try {
      await addProgramInfo.mutateAsync(data);
      toast.success(t("add_success"), {
				autoClose: 3000,
			});
      validation.resetForm();
    } catch (error) {
      toast.error(t("add_failure"), {
				autoClose: 3000,
			});
    }
    toggle();
  };
  const handleUpdateProgramInfo = async (data) => {
    try {
      await updateProgramInfo.mutateAsync(data);
      toast.success(t("update_success"), {
				autoClose: 3000,
			});
      validation.resetForm();
    } catch (error) {
      toast.error(t("update_failure"), {
				autoClose: 3000,
			});
    }
    toggle();
  };
  const handleDeleteProgramInfo = async () => {
    if (programInfo && programInfo.pri_id) {
      try {
        const id = programInfo.pri_id;
        await deleteProgramInfo.mutateAsync(id);
        toast.success(t("delete_success"), {
					autoClose: 3000,
				});
      } catch (error) {
        toast.error(t("delete_failure"), {
					autoClose: 3000,
				});
      }
      setDeleteModal(false);
    }
  };

  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,
    initialValues: {
      pri_owner_region_id: (region_id && parseInt(region_id)) || "",
      pri_owner_zone_id: (zone_id && parseInt(zone_id)) || "",
      pri_owner_woreda_id: (woreda_id && parseInt(woreda_id)) || "",
      pri_sector_id: (s_id && parseInt(s_id)) || "",
      pri_name_or: (programInfo && programInfo.pri_name_or) || "",
      pri_name_am: (programInfo && programInfo.pri_name_am) || "",
      pri_name_en: (programInfo && programInfo.pri_name_en) || "",
      pri_program_code: (programInfo && programInfo.pri_program_code) || "",
      pri_description: (programInfo && programInfo.pri_description) || "",
      pri_status: (programInfo && programInfo.pri_status) || "",

      is_deletable: (programInfo && programInfo.is_deletable) || 1,
      is_editable: (programInfo && programInfo.is_editable) || 1,
    },
    validationSchema: Yup.object({
      pri_owner_region_id: Yup.number().required(t("pri_owner_region_id")),
      pri_owner_zone_id: Yup.number().required(t("pri_owner_zone_id")),
      pri_owner_woreda_id: Yup.number().required(t("pri_owner_woreda_id")),
      pri_sector_id: Yup.number().required(t("pri_sector_id")),
      pri_name_or: alphanumericValidation(2, 100, true),
      pri_name_am: alphanumericValidation(2, 100, true),
      pri_name_en: alphanumericValidation(2, 100, true),
      pri_program_code: alphanumericValidation(2, 10, true),
      pri_description: alphanumericValidation(2, 100, false),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProgramInfo = {
          pri_id: programInfo?.pri_id,
          pri_owner_region_id: parseInt(region_id),
          pri_owner_zone_id: parseInt(zone_id),
          pri_owner_woreda_id: parseInt(woreda_id),
          pri_sector_id: parseInt(s_id),
          pri_name_or: values.pri_name_or,
          pri_name_am: values.pri_name_am,
          pri_name_en: values.pri_name_en,
          pri_program_code: values.pri_program_code,
          pri_description: values.pri_description,
          pri_status: values.pri_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProgramInfo
        handleUpdateProgramInfo(updateProgramInfo);
      } else {
        const newProgramInfo = {
          pri_owner_region_id: parseInt(region_id),
          pri_owner_zone_id: parseInt(zone_id),
          pri_owner_woreda_id: parseInt(woreda_id),
          pri_sector_id: parseInt(s_id),
          pri_name_or: values.pri_name_or,
          pri_name_am: values.pri_name_am,
          pri_name_en: values.pri_name_en,
          pri_program_code: values.pri_program_code,
          pri_description: values.pri_description,
          pri_status: values.pri_status,
        };
        // save new ProgramInfo
        handleAddProgramInfo(newProgramInfo);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch ProgramInfo on component mount
  useEffect(() => {
    setProgramInfo(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProgramInfo(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProgramInfo(null);
    } else {
      setModal(true);
    }
  };
  const handleProgramInfoClick = (arg) => {
    const programInfo = arg;
    setProgramInfo({
      pri_id: programInfo.pri_id,
      pri_name_or: programInfo.pri_name_or,
      pri_name_am: programInfo.pri_name_am,
      pri_name_en: programInfo.pri_name_en,
      pri_program_code: programInfo.pri_program_code,
      pri_description: programInfo.pri_description,
      pri_status: programInfo.pri_status,

      is_deletable: programInfo.is_deletable,
      is_editable: programInfo.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (programInfo) => {
    setProgramInfo(programInfo);
    setDeleteModal(true);
  };
  const handleProgramInfoClicks = () => {
    setIsEdit(false);
    setProgramInfo("");
    toggle();
  };
  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };
  //START UNCHANGED
  const columns = useMemo(() => {
    const baseColumns = [
      // {
      //   header: '',
      //   accessorKey: 'pri_owner_region_id',
      //   enableColumnFilter: false,
      //   enableSorting: true,
      //   cell: (cellProps) => {
      //     return (
      //       <span>
      //         {truncateText(cellProps.row.original.pri_owner_region_id, 30) ||
      //           '-'}
      //       </span>
      //     );
      //   },
      // },
      // {
      //   header: '',
      //   accessorKey: 'pri_owner_zone_id',
      //   enableColumnFilter: false,
      //   enableSorting: true,
      //   cell: (cellProps) => {
      //     return (
      //       <span>
      //         {truncateText(cellProps.row.original.pri_owner_zone_id, 30) ||
      //           '-'}
      //       </span>
      //     );
      //   },
      // },
      // {
      //   header: '',
      //   accessorKey: 'pri_owner_woreda_id',
      //   enableColumnFilter: false,
      //   enableSorting: true,
      //   cell: (cellProps) => {
      //     return (
      //       <span>
      //         {truncateText(cellProps.row.original.pri_owner_woreda_id, 30) ||
      //           '-'}
      //       </span>
      //     );
      //   },
      // },
      // {
      //   header: '',
      //   accessorKey: 'pri_sector_id',
      //   enableColumnFilter: false,
      //   enableSorting: true,
      //   cell: (cellProps) => {
      //     return (
      //       <span>
      //         {truncateText(cellProps.row.original.pri_sector_id, 30) ||
      //           '-'}
      //       </span>
      //     );
      //   },
      // },
      {
        header: "",
        accessorKey: "pri_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pri_name_or, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pri_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pri_name_am, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pri_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pri_name_en, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pri_program_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pri_program_code, 30) || "-"}
            </span>
          );
        },
      },
      // {
      //   header: '',
      //   accessorKey: 'pri_description',
      //   enableColumnFilter: false,
      //   enableSorting: true,
      //   cell: (cellProps) => {
      //     return (
      //       <span>
      //         {truncateText(cellProps.row.original.pri_description, 30) ||
      //           '-'}
      //       </span>
      //     );
      //   },
      // },
      // {
      //   header: '',
      //   accessorKey: 'pri_status',
      //   enableColumnFilter: false,
      //   enableSorting: true,
      //   cell: (cellProps) => {
      //     return (
      //       <span>
      //         {truncateText(cellProps.row.original.pri_status, 30) ||
      //           '-'}
      //       </span>
      //     );
      //   },
      // },
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
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleProgramInfoClick(data);
                  }}
                >
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </Link>
              )}
              {cellProps.row.original.is_deletable == 9 && (
                <Link
                  to="#"
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
  }, [handleProgramInfoClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <div className="w-90">
      <ProgramInfoModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProgramInfo}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProgramInfo.isPending}
      />
      <div className="">
        <div className="">
          {isLoading || isSearchLoading ? (
            <Spinners />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={
                        showSearchResult
                          ? searchResults?.data
                          : data?.data || []
                      }
                      isGlobalFilter={true}
                      isAddButton={data?.previledge?.is_role_can_add == 1}
                      isCustomPageSize={true}
                      handleUserClick={handleProgramInfoClicks}
                      isPagination={true}
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add")}
                      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                      theadClass="table-light"
                      pagination="pagination"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          <Modal isOpen={modal} toggle={toggle} className="modal-xl">
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit
                ? t("edit") + " " + t("program_info")
                : t("add") + " " + t("program_info")}
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
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("pri_name_or")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="pri_name_or"
                      type="text"
                      placeholder={t("pri_name_or")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pri_name_or || ""}
                      invalid={
                        validation.touched.pri_name_or &&
                        validation.errors.pri_name_or
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pri_name_or &&
                    validation.errors.pri_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pri_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("pri_name_am")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="pri_name_am"
                      type="text"
                      placeholder={t("pri_name_am")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pri_name_am || ""}
                      invalid={
                        validation.touched.pri_name_am &&
                        validation.errors.pri_name_am
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pri_name_am &&
                    validation.errors.pri_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pri_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("pri_name_en")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="pri_name_en"
                      type="text"
                      placeholder={t("pri_name_en")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pri_name_en || ""}
                      invalid={
                        validation.touched.pri_name_en &&
                        validation.errors.pri_name_en
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pri_name_en &&
                    validation.errors.pri_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pri_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("pri_program_code")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="pri_program_code"
                      type="text"
                      placeholder={t("pri_program_code")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pri_program_code || ""}
                      invalid={
                        validation.touched.pri_program_code &&
                        validation.errors.pri_program_code
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pri_program_code &&
                    validation.errors.pri_program_code ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pri_program_code}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-12 mb-3">
                    <Label>{t("pri_description")}</Label>
                    <Input
                      name="pri_description"
                      type="textarea"
                      rows={4}
                      placeholder={t("pri_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pri_description || ""}
                      invalid={
                        validation.touched.pri_description &&
                        validation.errors.pri_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pri_description &&
                    validation.errors.pri_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pri_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addProgramInfo.isPending ||
                      updateProgramInfo.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addProgramInfo.isPending ||
                            updateProgramInfo.isPending ||
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
                            addProgramInfo.isPending ||
                            updateProgramInfo.isPending ||
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
        </div>
      </div>
    </div>
  );
};
ProgramInfoModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProgramInfoModel;
