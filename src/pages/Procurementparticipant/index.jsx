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
//import components
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchProcurementParticipants,
  useSearchProcurementParticipants,
  useAddProcurementParticipant,
  useDeleteProcurementParticipant,
  useUpdateProcurementParticipant,
} from "../../queries/procurementparticipant_query";
import ProcurementParticipantModal from "./ProcurementParticipantModal";
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
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
  emailValidation,
  phoneValidation,
  tinValidation,
  onlyAmharicValidation
} from "../../utils/Validation/validation";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const ProcurementParticipantModel = (props ) => {
  //meta title
  document.title = " ProcurementParticipant";
    const { passedId,isActive,startDate} = props;
  const param = { ppp_procurement_id: passedId };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [procurementParticipant, setProcurementParticipant] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, isFetching, error, isError, refetch } =
    useFetchProcurementParticipants(param,isActive);
  const addProcurementParticipant = useAddProcurementParticipant();
  const updateProcurementParticipant = useUpdateProcurementParticipant();
  const deleteProcurementParticipant = useDeleteProcurementParticipant();
//START CRUD
  const handleAddProcurementParticipant = async (data) => {
    try {
      await addProcurementParticipant.mutateAsync(data);
      toast.success(t('add_success'), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(t('add_failure'), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleUpdateProcurementParticipant = async (data) => {
    try {
      await updateProcurementParticipant.mutateAsync(data);
      toast.success(t('update_success'), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(t('update_failure'), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleDeleteProcurementParticipant = async () => {
    if (procurementParticipant && procurementParticipant.ppp_id) {
      try {
        const id = procurementParticipant.ppp_id;
        await deleteProcurementParticipant.mutateAsync(id);
        toast.success(t('delete_success'), {
          autoClose: 2000,
        });
      } catch (error) {
        toast.error(t('delete_failure'), {
          autoClose: 2000,
        });
      }
      setDeleteModal(false);
    }
  };
  //END CRUD
  //START FOREIGN CALLS
  
  
  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,
    initialValues: {
     ppp_name_or:(procurementParticipant && procurementParticipant.ppp_name_or) || "", 
      ppp_name_en:(procurementParticipant && procurementParticipant.ppp_name_en) || "", 
      ppp_name_am:(procurementParticipant && procurementParticipant.ppp_name_am) || "", 
      ppp_tin_number:(procurementParticipant && procurementParticipant.ppp_tin_number) || "", 
      ppp_participant_phone_number:(procurementParticipant && procurementParticipant.ppp_participant_phone_number) || "", 
      ppp_participant_email:(procurementParticipant && procurementParticipant.ppp_participant_email) || "", 
      ppp_participant_address:(procurementParticipant && procurementParticipant.ppp_participant_address) || "", 
      ppp_description:(procurementParticipant && procurementParticipant.ppp_description) || "", 
      ppp_status:(procurementParticipant && procurementParticipant.ppp_status) || "", 
      ppp_procurement_id:(procurementParticipant && procurementParticipant.ppp_procurement_id) || "", 

     is_deletable: (procurementParticipant && procurementParticipant.is_deletable) || 1,
     is_editable: (procurementParticipant && procurementParticipant.is_editable) || 1
   },
   validationSchema: Yup.object({

   ppp_name_or: alphanumericValidation(2, 100, true).test(
        "unique-ppp_name_or",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) =>
              item.ppp_name_or == value &&
              item.ppp_id !== procurementParticipant?.ppp_id
          );
        }
      ),
      ppp_name_am: onlyAmharicValidation(2, 100, true),
      ppp_name_en: alphanumericValidation(2, 100, true),
      ppp_tin_number: tinValidation(4, 20, false),
      ppp_participant_phone_number: phoneValidation(false),
      ppp_participant_email: emailValidation(false),
      ppp_participant_address: alphanumericValidation(2, 100, false),
      ppp_description: alphanumericValidation(3, 425, false),

  }),
   validateOnBlur: true,
   validateOnChange: false,
   onSubmit: (values) => {
    if (isEdit) {
      const updateProcurementParticipant = {
        ppp_id: procurementParticipant ? procurementParticipant.ppp_id : 0,
        ppp_name_or:values.ppp_name_or, 
        ppp_name_en:values.ppp_name_en, 
        ppp_name_am:values.ppp_name_am, 
        ppp_tin_number:values.ppp_tin_number, 
        ppp_procurement_id:values.ppp_procurement_id, 
        ppp_participant_phone_number:values.ppp_participant_phone_number, 
        ppp_participant_email:values.ppp_participant_email, 
        ppp_participant_address:values.ppp_participant_address, 
        ppp_description:values.ppp_description, 
        ppp_status:values.ppp_status, 

        is_deletable: values.is_deletable,
        is_editable: values.is_editable,
      };
        // update ProcurementParticipant
      handleUpdateProcurementParticipant(updateProcurementParticipant);
    } else {
      const newProcurementParticipant = {
        ppp_name_or:values.ppp_name_or, 
        ppp_name_en:values.ppp_name_en, 
        ppp_name_am:values.ppp_name_am, 
        ppp_tin_number:values.ppp_tin_number, 
        ppp_procurement_id:passedId, 
        ppp_participant_phone_number:values.ppp_participant_phone_number, 
        ppp_participant_email:values.ppp_participant_email, 
        ppp_participant_address:values.ppp_participant_address, 
        ppp_description:values.ppp_description, 
        ppp_status:values.ppp_status, 

      };
        // save new ProcurementParticipant
      handleAddProcurementParticipant(newProcurementParticipant);
    }
  },
});
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch ProcurementParticipant on component mount
  useEffect(() => {
    setProcurementParticipant(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProcurementParticipant(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProcurementParticipant(null);
    } else {
      setModal(true);
    }
  };
  const handleProcurementParticipantClick = (arg) => {
    const procurementParticipant = arg;
    // console.log("handleProcurementParticipantClick", procurementParticipant);
    setProcurementParticipant({
      ppp_id:procurementParticipant.ppp_id, 
      ppp_name_or:procurementParticipant.ppp_name_or, 
      ppp_name_en:procurementParticipant.ppp_name_en, 
      ppp_name_am:procurementParticipant.ppp_name_am, 
      ppp_tin_number:procurementParticipant.ppp_tin_number, 
      ppp_procurement_id:procurementParticipant.ppp_procurement_id, 
      ppp_participant_phone_number:procurementParticipant.ppp_participant_phone_number, 
      ppp_participant_email:procurementParticipant.ppp_participant_email, 
      ppp_participant_address:procurementParticipant.ppp_participant_address, 
      ppp_description:procurementParticipant.ppp_description, 
      ppp_status:procurementParticipant.ppp_status, 

      is_deletable: procurementParticipant.is_deletable,
      is_editable: procurementParticipant.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (procurementParticipant) => {
    setProcurementParticipant(procurementParticipant);
    setDeleteModal(true);
  };
  const handleProcurementParticipantClicks = () => {
    setIsEdit(false);
    setProcurementParticipant("");
    toggle();
  }
  ;  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };
  //START UNCHANGED
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: '',
        accessorKey: 'ppp_name_or',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.ppp_name_or, 30) ||
                '-'}
            </span>
          );
        },
      }, 
      {
              header: '',
              accessorKey: 'ppp_name_en',
              enableColumnFilter: false,
              enableSorting: true,
              cell: (cellProps) => {
                return (
                  <span>
                    {truncateText(cellProps.row.original.ppp_name_en, 30) ||
                      '-'}
                  </span>
                );
              },
            }, 
      {
        header: '',
        accessorKey: 'ppp_name_am',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.ppp_name_am, 30) ||
                '-'}
            </span>
          );
        },
      }, 
     {
        header: '',
        accessorKey: 'ppp_tin_number',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.ppp_tin_number, 30) ||
                '-'}
            </span>
          );
        },
      }, 
     {
        header: '',
        accessorKey: 'ppp_participant_phone_number',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.ppp_participant_phone_number, 30) ||
                '-'}
            </span>
          );
        },
      }, 
      {
              header: '',
              accessorKey: 'ppp_participant_email',
              enableColumnFilter: false,
              enableSorting: true,
              cell: (cellProps) => {
                return (
                  <span>
                    {truncateText(cellProps.row.original.ppp_participant_email, 30) ||
                      '-'}
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
      data?.previledge?.is_role_editable==1 ||
      data?.previledge?.is_role_deletable==1
      ) {
      baseColumns.push({
        header: t("Action"),
        accessorKey: t("Action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
            {cellProps.row.original.is_editable==1 && (
              <Link
              to="#"
              className="text-success"
              onClick={() => {
                const data = cellProps.row.original;                    
                handleProcurementParticipantClick(data);
              }}
              >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
              <UncontrolledTooltip placement="top" target="edittooltip">
              Edit
              </UncontrolledTooltip>
              </Link>
              )}
            {cellProps.row.original.is_deletable==1 && (
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
}, [handleProcurementParticipantClick, toggleViewModal, onClickDelete]);
  return (
		<React.Fragment>
			<ProcurementParticipantModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
			/>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteProcurementParticipant}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteProcurementParticipant.isPending}
			/>
			{isLoading || isSearchLoading ? (
				<Spinners />
			) : (
				<TableContainer
					columns={columns}
					data={showSearchResult ? searchResults?.data : data?.data || []}
					isGlobalFilter={true}
					isAddButton={data?.previledge?.is_role_can_add == 1}
					isCustomPageSize={true}
					handleUserClick={handleProcurementParticipantClicks}
					isPagination={true}
					SearchPlaceholder={t("Results") + "..."}
					buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
					buttonName={t("add")}
					tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
					theadClass="table-light"
					pagination="pagination"
					paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
					refetch={refetch}
					isFetching={isFetching}
				/>
			)}
			<Modal isOpen={modal} toggle={toggle} className="modal-xl">
				<ModalHeader toggle={toggle} tag="h4">
					{!!isEdit
						? t("edit") + " " + t("procurement_participant")
						: t("add") + " " + t("procurement_participant")}
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
									{t("ppp_name_or")}
									<span className="text-danger">*</span>
								</Label>
								<Input
									name="ppp_name_or"
									type="text"
									placeholder={t("ppp_name_or")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.ppp_name_or || ""}
									invalid={
										validation.touched.ppp_name_or &&
										validation.errors.ppp_name_or
											? true
											: false
									}
									maxLength={50}
								/>
								{validation.touched.ppp_name_or &&
								validation.errors.ppp_name_or ? (
									<FormFeedback type="invalid">
										{validation.errors.ppp_name_or}
									</FormFeedback>
								) : null}
							</Col>
							<Col className="col-md-6 mb-3">
								<Label>
									{t("ppp_name_en")}
									<span className="text-danger">*</span>
								</Label>
								<Input
									name="ppp_name_en"
									type="text"
									placeholder={t("ppp_name_en")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.ppp_name_en || ""}
									invalid={
										validation.touched.ppp_name_en &&
										validation.errors.ppp_name_en
											? true
											: false
									}
									maxLength={50}
								/>
								{validation.touched.ppp_name_en &&
								validation.errors.ppp_name_en ? (
									<FormFeedback type="invalid">
										{validation.errors.ppp_name_en}
									</FormFeedback>
								) : null}
							</Col>
							<Col className="col-md-6 mb-3">
								<Label>
									{t("ppp_name_am")}
									<span className="text-danger">*</span>
								</Label>
								<Input
									name="ppp_name_am"
									type="text"
									placeholder={t("ppp_name_am")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.ppp_name_am || ""}
									invalid={
										validation.touched.ppp_name_am &&
										validation.errors.ppp_name_am
											? true
											: false
									}
									maxLength={50}
								/>
								{validation.touched.ppp_name_am &&
								validation.errors.ppp_name_am ? (
									<FormFeedback type="invalid">
										{validation.errors.ppp_name_am}
									</FormFeedback>
								) : null}
							</Col>
							<Col className="col-md-6 mb-3">
								<Label>{t("ppp_tin_number")}</Label>
								<Input
									name="ppp_tin_number"
									type="text"
									placeholder={t("ppp_tin_number")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.ppp_tin_number || ""}
									invalid={
										validation.touched.ppp_tin_number &&
										validation.errors.ppp_tin_number
											? true
											: false
									}
									maxLength={20}
								/>
								{validation.touched.ppp_tin_number &&
								validation.errors.ppp_tin_number ? (
									<FormFeedback type="invalid">
										{validation.errors.ppp_tin_number}
									</FormFeedback>
								) : null}
							</Col>
							<Col className="col-md-6 mb-3">
								<Label>{t("ppp_participant_phone_number")}</Label>
								<Input
									name="ppp_participant_phone_number"
									type="text"
									placeholder={t("ppp_participant_phone_number")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.ppp_participant_phone_number || ""}
									invalid={
										validation.touched.ppp_participant_phone_number &&
										validation.errors.ppp_participant_phone_number
											? true
											: false
									}
									maxLength={15}
								/>
								{validation.touched.ppp_participant_phone_number &&
								validation.errors.ppp_participant_phone_number ? (
									<FormFeedback type="invalid">
										{validation.errors.ppp_participant_phone_number}
									</FormFeedback>
								) : null}
							</Col>
							<Col className="col-md-6 mb-3">
								<Label>{t("ppp_participant_email")}</Label>
								<Input
									name="ppp_participant_email"
									type="text"
									placeholder={t("ppp_participant_email")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.ppp_participant_email || ""}
									invalid={
										validation.touched.ppp_participant_email &&
										validation.errors.ppp_participant_email
											? true
											: false
									}
									maxLength={50}
								/>
								{validation.touched.ppp_participant_email &&
								validation.errors.ppp_participant_email ? (
									<FormFeedback type="invalid">
										{validation.errors.ppp_participant_email}
									</FormFeedback>
								) : null}
							</Col>
							<Col className="col-md-6 mb-3">
								<Label>{t("ppp_participant_address")}</Label>
								<Input
									name="ppp_participant_address"
									type="text"
									placeholder={t("ppp_participant_address")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.ppp_participant_address || ""}
									invalid={
										validation.touched.ppp_participant_address &&
										validation.errors.ppp_participant_address
											? true
											: false
									}
									maxLength={100}
								/>
								{validation.touched.ppp_participant_address &&
								validation.errors.ppp_participant_address ? (
									<FormFeedback type="invalid">
										{validation.errors.ppp_participant_address}
									</FormFeedback>
								) : null}
							</Col>
							<Col className="col-md-6 mb-3">
								<Label>{t("ppp_description")}</Label>
								<Input
									name="ppp_description"
									type="textarea"
									placeholder={t("ppp_description")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.ppp_description || ""}
									invalid={
										validation.touched.ppp_description &&
										validation.errors.ppp_description
											? true
											: false
									}
									maxLength={425}
								/>
								{validation.touched.ppp_description &&
								validation.errors.ppp_description ? (
									<FormFeedback type="invalid">
										{validation.errors.ppp_description}
									</FormFeedback>
								) : null}
							</Col>
							<Col className="col-md-6 mb-3" style={{ display: "none" }}>
								<Label>{t("ppp_status")}</Label>
								<Input
									name="ppp_status"
									type="text"
									placeholder={t("ppp_status")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.ppp_status || ""}
									invalid={
										validation.touched.ppp_status &&
										validation.errors.ppp_status
											? true
											: false
									}
									maxLength={20}
								/>
								{validation.touched.ppp_status &&
								validation.errors.ppp_status ? (
									<FormFeedback type="invalid">
										{validation.errors.ppp_status}
									</FormFeedback>
								) : null}
							</Col>
						</Row>
						<Row>
							<Col>
								<div className="text-end">
									{addProcurementParticipant.isPending ||
									updateProcurementParticipant.isPending ? (
										<Button
											color="success"
											type="submit"
											className="save-user"
											disabled={
												addProcurementParticipant.isPending ||
												updateProcurementParticipant.isPending ||
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
												addProcurementParticipant.isPending ||
												updateProcurementParticipant.isPending ||
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
		</React.Fragment>
	);
};
ProcurementParticipantModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProcurementParticipantModel;