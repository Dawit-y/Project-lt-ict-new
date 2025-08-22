import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchCsoInfos,
  useSearchCsoInfos,
  useAddCsoInfo,
  useDeleteCsoInfo,
  useUpdateCsoInfo,
} from "../../queries/csoinfo_query";
import CsoInfoModal from "./CsoInfoModal";
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
  InputGroup,
  InputGroupText,
} from "reactstrap";
import {
  FaPaperclip,
  FaPenSquare,
  FaEye,
  FaCog,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import {
  numberValidation,
  phoneValidation,
  alphanumericValidation,
  websiteUrlValidation,
} from "../../utils/Validation/validation";
import FileModal from "./FileModal";
import Conversation from "../Conversationinformation/ConvInfoModal";
import { PAGE_ID } from "../../constants/constantFile";
import AgGridContainer from "../../components/Common/AgGridContainer";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const csoTypes = [
  { value: 1, label: "Local" },
  { value: 2, label: "International" },
];
const csoTypesMap = Object.fromEntries(
  csoTypes.map(({ value, label }) => [value, label]),
);
const CsoInfoModel = () => {
  document.title = " CSO Lists";

  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [fileModal, setFileModal] = useState(false);
  const [convModal, setConvModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [csoInfo, setCsoInfo] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } = useFetchCsoInfos();
  const addCsoInfo = useAddCsoInfo();
  const updateCsoInfo = useUpdateCsoInfo();
  const deleteCsoInfo = useDeleteCsoInfo();
  //START CRUD
  const handleAddCsoInfo = async (data) => {
		try {
			await addCsoInfo.mutateAsync(data);
			toast.success(t("add_success"), {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("add_failure"), { autoClose: 3000 });
			}
		}
	};
	const handleUpdateCsoInfo = async (data) => {
		try {
			await updateCsoInfo.mutateAsync(data);
			toast.success(t("update_success"), {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};
  const handleDeleteCsoInfo = async () => {
    if (csoInfo && csoInfo.cso_id) {
      try {
        const id = csoInfo.cso_id;
        await deleteCsoInfo.mutateAsync(id);
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
    enableReinitialize: true,
    initialValues: {
      cso_name: (csoInfo && csoInfo.cso_name) || "",
      cso_code: (csoInfo && csoInfo.cso_code) || "",
      cso_address: (csoInfo && csoInfo.cso_address) || "",
      cso_phone: (csoInfo && csoInfo.cso_phone) || "",
      cso_email: (csoInfo && csoInfo.cso_email) || "",
      cso_website: (csoInfo && csoInfo.cso_website) || "",
      cso_description: (csoInfo && csoInfo.cso_description) || "",
      cso_contact_person: (csoInfo && csoInfo.cso_contact_person) || "",
      cso_type: (csoInfo && csoInfo.cso_type) || "",
      is_deletable: (csoInfo && csoInfo.is_deletable) || 1,
      is_editable: (csoInfo && csoInfo.is_editable) || 1,
    },
    validationSchema: Yup.object({
      cso_name: alphanumericValidation(3, 150, true),
      cso_code: alphanumericValidation(2, 20, true).test(
        "unique-cso_code",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) => item.cso_code == value && item.cso_id !== csoInfo?.cso_id,
          );
        },
      ),
      cso_address: alphanumericValidation(3, 150, true),
      cso_phone: phoneValidation(true),
      cso_email: Yup.string()
        .required(t("cso_email"))
        .email(t("Invalid email format"))
        .test("unique-cso_email", t("Already exists"), (value) => {
          return !data?.data.some(
            (item) =>
              item.cso_email === value && item.cso_id !== csoInfo?.cso_id,
          );
        }),
      cso_website: websiteUrlValidation(false),
      cso_description: alphanumericValidation(3, 450, false),
      cso_type: numberValidation(1, 2, true),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateCsoInfo = {
          cso_id: csoInfo?.cso_id,
          cso_name: values.cso_name,
          cso_code: values.cso_code,
          cso_address: values.cso_address,
          cso_phone: values.cso_phone,
          cso_email: values.cso_email,
          cso_website: values.cso_website,
          cso_contact_person: values.cso_contact_person,
          cso_type: values.cso_type,
          cso_description: values.cso_description,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update CsoInfo
        handleUpdateCsoInfo(updateCsoInfo);
      } else {
        const newCsoInfo = {
          cso_name: values.cso_name,
          cso_code: values.cso_code,
          cso_address: values.cso_address,
          cso_phone: `+251${values.cso_phone}`,
          cso_email: values.cso_email,
          cso_website: values.cso_website,
          cso_contact_person: values.cso_contact_person,
          cso_type: values.cso_type,
          cso_description: values.cso_description,
        };
        // save new CsoInfo
        handleAddCsoInfo(newCsoInfo);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const toggleFileModal = () => setFileModal(!fileModal);
  const toggleConvModal = () => setConvModal(!convModal);
  // Fetch CsoInfo on component mount
  useEffect(() => {
    setCsoInfo(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setCsoInfo(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setCsoInfo(null);
    } else {
      setModal(true);
    }
  };
  const handleCsoInfoClick = (arg) => {
    const csoInfo = arg;
    setCsoInfo({
      cso_id: csoInfo.cso_id,
      cso_name: csoInfo.cso_name,
      cso_code: csoInfo.cso_code,
      cso_address: csoInfo.cso_address,
      cso_phone: Number(csoInfo.cso_phone.toString().replace(/^(\+?251)/, "")),
      cso_email: csoInfo.cso_email,
      cso_website: csoInfo.cso_website,
      cso_description: csoInfo.cso_description,
      cso_contact_person: csoInfo.cso_contact_person,
      cso_type: csoInfo.cso_type,
      is_deletable: csoInfo.is_deletable,
      is_editable: csoInfo.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (csoInfo) => {
    setCsoInfo(csoInfo);
    setDeleteModal(true);
  };
  const handleCsoInfoClicks = () => {
    setIsEdit(false);
    setCsoInfo("");
    toggle();
  };
  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };

  const columnDefs = useMemo(() => {
    const ActionButtons = ({ data }) => {
      return (
        <div className="d-flex gap-3">
          {data.is_editable == 1 && (
            <Link
              to="#"
              className="text-success"
              onClick={() => handleCsoInfoClick(data)}
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
              <UncontrolledTooltip placement="top" target="edittooltip">
                {t("Edit")}
              </UncontrolledTooltip>
            </Link>
          )}
        </div>
      );
    };

    const StatusBadge = ({ status }) => {
      return (
        <Badge color={status === 1 ? "success" : "danger"}>
          {status === 1 ? t("Approved") : t("Requested")}
        </Badge>
      );
    };

    const baseColumnDefs = [
      {
        headerName: t("S.N"),
        field: "sn",
        valueGetter: (params) => params.node.rowIndex + 1,
        sortable: false,
        filter: false,
        width: 60,
      },
      {
        headerName: t("cso_type"),
        field: "cso_type",
        filter: false,
        sortable: true,
        minWidth: 100,
        flex: 1,
        cellRenderer: ({ data }) => csoTypesMap[data.cso_type],
      },
      {
        headerName: t("Name"),
        field: "cso_name",
        filter: false,
        sortable: true,
        minWidth: 200,
        flex: 1,
        cellRenderer: ({ data }) => truncateText(data.cso_name, 30) || "-",
      },
      {
        headerName: t("cso_contact_person"),
        field: "cso_contact_person",
        filter: false,
        sortable: true,
        minWidth: 150,
        flex: 1,
        cellRenderer: ({ data }) =>
          truncateText(data.cso_contact_person, 30) || "-",
      },
      {
        headerName: t("Code"),
        field: "cso_code",
        filter: false,
        sortable: true,
        cellRenderer: ({ data }) => truncateText(data.cso_code, 30) || "-",
      },
      {
        headerName: t("Address"),
        field: "cso_address",
        filter: false,
        sortable: true,
        cellRenderer: ({ data }) => truncateText(data.cso_address, 30) || "-",
      },
      {
        headerName: t("Phone"),
        field: "cso_phone",
        filter: false,
        sortable: true,
        cellRenderer: ({ data }) => truncateText(data.cso_phone, 30) || "-",
      },
      {
        headerName: t("Email"),
        field: "cso_email",
        filter: false,
        sortable: true,
        cellRenderer: ({ data }) => truncateText(data.cso_email, 30) || "-",
      },
      {
        headerName: t("Status"),
        field: "cso_status",
        filter: false,
        sortable: true,
        width: 120,
        cellRenderer: ({ data }) => <StatusBadge status={data.cso_status} />,
      },

      {
        headerName: t("actions"),
        field: "actions",
        width: 200,
        cellRenderer: (params) => {
          const rowData = params.data;

          return (
            <div className="d-flex gap-1">
              <Button
                id={`cso-view-detail-${rowData.cso_id}`}
                color="light"
                size="sm"
                onClick={() => {
                  toggleViewModal();
                  setTransaction(rowData);
                }}
              >
                <FaEye />
              </Button>
              <UncontrolledTooltip target={`cso-view-detail-${rowData.cso_id}`}>
                {t("view_detail")}
              </UncontrolledTooltip>

              <Button
                id={`attachFiles-${rowData.cso_id}`}
                color="light"
                size="sm"
                onClick={() => {
                  setTransaction(rowData);
                  toggleFileModal();
                }}
              >
                <FaPaperclip />
              </Button>
              <UncontrolledTooltip target={`attachFiles-${rowData.cso_id}`}>
                {t("attach_files")}
              </UncontrolledTooltip>

              <Button
                id={`notes-${rowData.cso_id}`}
                color="light"
                size="sm"
                onClick={() => {
                  setTransaction(rowData);
                  toggleConvModal();
                }}
              >
                <FaPenSquare />
              </Button>
              <UncontrolledTooltip target={`notes-${rowData.cso_id}`}>
                {t("Notes")}
              </UncontrolledTooltip>

              {data.previledge?.is_role_editable == 1 &&
                rowData?.is_editable == 1 && (
                  <>
                    <Button
                      id={`edit-${rowData.cso_id}`}
                      color="success"
                      size="sm"
                      onClick={() => handleCsoInfoClick(rowData)}
                      outline
                    >
                      <FaPen />
                    </Button>
                    <UncontrolledTooltip target={`edit-${rowData.cso_id}`}>
                      {t("edit")}
                    </UncontrolledTooltip>
                  </>
                )}
              {/* {data.previledge?.is_role_deletable == 1 &&
								rowData?.is_deletable == 1 && (
									<>
										<Button
											id={`delete-${rowData.cso_id}`}
											color="danger"
											size="sm"
											onClick={() => onClickDelete(rowData)}
											outline
										>
											<FaTrash />
										</Button>
										<UncontrolledTooltip target={`delete-${rowData.cso_id}`}>
											{t("delete")}
										</UncontrolledTooltip>
									</>
								)} */}
            </div>
          );
        },
      },
    ];

    return baseColumnDefs;
  }, [
    handleCsoInfoClick,
    toggleViewModal,
    toggleFileModal,
    toggleConvModal,
    t,
  ]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <CsoInfoModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCsoInfo}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteCsoInfo.isPending}
      />
      <FileModal
        isOpen={fileModal}
        toggle={toggleFileModal}
        transaction={transaction}
      />
      <Conversation
        isOpen={convModal}
        toggle={toggleConvModal}
        ownerId={transaction?.cso_id}
        ownerTypeId={PAGE_ID.CSO}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title={t("cso_info")} breadcrumbItem={t("cso_info")} />
          {isLoading || isSearchLoading ? (
            <Spinners />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <AgGridContainer
                      rowData={
                        showSearchResult
                          ? searchResults?.data
                          : data?.data || []
                      }
                      columnDefs={columnDefs}
                      isPagination={true}
                      paginationPageSize={20}
                      isGlobalFilter={true}
                      isAddButton={data?.previledge?.is_role_can_add == 1}
                      addButtonText="Add"
                      onAddClick={handleCsoInfoClicks}
                      isExcelExport={true}
                      isPdfExport={true}
                      isPrint={true}
                      tableName="CSO List"
                      includeKey={[
                        "cso_name",
                        "cso_code",
                        "cso_email",
                        "cso_phone",
                        "cso_website",
                        "cso_address",
                        "cso_status",
                      ]}
                      excludeKey={["is_editable", "is_deletable"]}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          <Modal isOpen={modal} toggle={toggle} className="modal-xl">
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit
                ? t("edit") + " " + t("cso_info")
                : t("add") + " " + t("cso_info")}
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
                    <Label>{t("cso_type")}</Label>
                    <span className="text-danger ms-1">*</span>
                    <Input
                      name="cso_type"
                      type="select"
                      placeholder={t("cso_type")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.cso_type || ""}
                      invalid={
                        validation.touched.cso_type &&
                        validation.errors.cso_type
                          ? true
                          : false
                      }
                    >
                      <option value="">{t("cso_type")}</option>
                      {csoTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {t(type.label)}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.cso_type &&
                    validation.errors.cso_type ? (
                      <FormFeedback type="invalid">
                        {validation.errors.cso_type}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("cso_name")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="cso_name"
                      type="text"
                      placeholder={t("cso_name")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.cso_name || ""}
                      invalid={
                        validation.touched.cso_name &&
                        validation.errors.cso_name
                          ? true
                          : false
                      }
                    />
                    {validation.touched.cso_name &&
                    validation.errors.cso_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.cso_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("cso_contact_person")}</Label>
                    <Input
                      name="cso_contact_person"
                      type="text"
                      placeholder={t("cso_contact_person")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.cso_contact_person || ""}
                      invalid={
                        validation.touched.cso_contact_person &&
                        validation.errors.cso_contact_person
                          ? true
                          : false
                      }
                    />
                    {validation.touched.cso_contact_person &&
                    validation.errors.cso_contact_person ? (
                      <FormFeedback type="invalid">
                        {validation.errors.cso_contact_person}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  <Col className="col-md-6 mb-3">
                    <Label>{t("cso_code")}</Label>
                    <span className="text-danger">*</span>
                    <Input
                      name="cso_code"
                      type="text"
                      placeholder={t("cso_code")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.cso_code || ""}
                      invalid={
                        validation.touched.cso_code &&
                        validation.errors.cso_code
                          ? true
                          : false
                      }
                    />
                    {validation.touched.cso_code &&
                    validation.errors.cso_code ? (
                      <FormFeedback type="invalid">
                        {validation.errors.cso_code}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("cso_address")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="cso_address"
                      type="text"
                      placeholder={t("cso_address")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.cso_address || ""}
                      invalid={
                        validation.touched.cso_address &&
                        validation.errors.cso_address
                          ? true
                          : false
                      }
                    />
                    {validation.touched.cso_address &&
                    validation.errors.cso_address ? (
                      <FormFeedback type="invalid">
                        {validation.errors.cso_address}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      Phone Number <span className="text-danger">*</span>
                    </Label>
                    <InputGroup>
                      <InputGroupText>{"+251"}</InputGroupText>
                      <Input
                        name="cso_phone"
                        type="text"
                        placeholder="Enter phone number"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          let formattedValue = inputValue.replace(/^0/, "");
                          formattedValue = formattedValue.replace(/[^\d]/g, "");
                          formattedValue = formattedValue.substring(0, 9);
                          validation.setFieldValue("cso_phone", formattedValue);
                        }}
                        onBlur={validation.handleBlur}
                        value={validation.values.cso_phone}
                        invalid={
                          validation.touched.cso_phone &&
                          !!validation.errors.cso_phone
                        }
                      />
                      {validation.touched.cso_phone &&
                      validation.errors.cso_phone ? (
                        <FormFeedback type="invalid">
                          {validation.errors.cso_phone}
                        </FormFeedback>
                      ) : null}
                    </InputGroup>
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("cso_email")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="cso_email"
                      type="text"
                      placeholder={t("cso_email")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.cso_email || ""}
                      invalid={
                        validation.touched.cso_email &&
                        validation.errors.cso_email
                          ? true
                          : false
                      }
                    />
                    {validation.touched.cso_email &&
                    validation.errors.cso_email ? (
                      <FormFeedback type="invalid">
                        {validation.errors.cso_email}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("cso_website")}</Label>
                    <Input
                      name="cso_website"
                      type="text"
                      placeholder={t("www.example.com")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.cso_website || ""}
                      invalid={
                        validation.touched.cso_website &&
                        validation.errors.cso_website
                          ? true
                          : false
                      }
                    />
                    {validation.touched.cso_website &&
                    validation.errors.cso_website ? (
                      <FormFeedback type="invalid">
                        {validation.errors.cso_website}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-12 mb-3">
                    <Label>{t("cso_description")}</Label>
                    <Input
                      name="cso_description"
                      type="textarea"
                      rows={4}
                      placeholder={t("cso_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.cso_description || ""}
                      invalid={
                        validation.touched.cso_description &&
                        validation.errors.cso_description
                          ? true
                          : false
                      }
                      maxLength={200}
                    />
                    {validation.touched.cso_description &&
                    validation.errors.cso_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.cso_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addCsoInfo.isPending || updateCsoInfo.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addCsoInfo.isPending ||
                            updateCsoInfo.isPending ||
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
                            addCsoInfo.isPending ||
                            updateCsoInfo.isPending ||
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
    </React.Fragment>
  );
};
CsoInfoModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default CsoInfoModel;
