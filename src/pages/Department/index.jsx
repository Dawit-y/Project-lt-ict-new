// import React, { useEffect, useMemo, useState } from "react";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
// import { isEmpty, update } from "lodash";
// import "bootstrap/dist/css/bootstrap.min.css";
// import TableContainer from "../../components/Common/TableContainer";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import { Spinner } from "reactstrap";
// import Spinners from "../../components/Common/Spinner";
// //import components
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import DeleteModal from "../../components/Common/DeleteModal";
// import {
//   alphanumericValidation,
//   amountValidation,
//   numberValidation,
// } from "../../utils/Validation/validation";

// import {
//   useFetchDepartments,
//   useSearchDepartments,
//   useAddDepartment,
//   useDeleteDepartment,
//   useUpdateDepartment,
// } from "../../queries/department_query";

// import DepartmentModal from "./DepartmentModal";
// import { useTranslation } from "react-i18next";

// import {
//   Button,
//   Col,
//   Row,
//   UncontrolledTooltip,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Form,
//   Input,
//   FormFeedback,
//   Label,
//   Card,
//   CardBody,
// } from "reactstrap";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
// import DetailModal from "../../components/Common/DetailModal";

// const truncateText = (text, maxLength) => {
//   if (typeof text !== "string") {
//     return text;
//   }
//   return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
// };

// const DepartmentModel = () => {
//   //meta title
//   document.title = " Department";

//   const { t } = useTranslation();

//   const [modal, setModal] = useState(false);
//   const [modal1, setModal1] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [department, setDepartment] = useState(null);

//   const [searchResults, setSearchResults] = useState(null);
//   const [isSearchLoading, setIsSearchLoading] = useState(false);
//   const [searcherror, setSearchError] = useState(null);
//   const [showSearchResult, setShowSearchResult] = useState(false);

//   const { data, isLoading, error, isError, refetch } = useFetchDepartments();

//   const addDepartment = useAddDepartment();
//   const updateDepartment = useUpdateDepartment();
//   const deleteDepartment = useDeleteDepartment();

//   //START CRUD
//   const handleAddDepartment = async (data) => {
//     try {
//       await addDepartment.mutateAsync(data);
//       toast.success(t("add_success"), {
//         autoClose: 2000,
//       });
//       validation.resetForm();
//     } catch (error) {
//       toast.error(t("add_failure"), {
//         autoClose: 2000,
//       });
//     }
//     toggle();
//   };

//   const handleUpdateDepartment = async (data) => {
//     try {
//       await updateDepartment.mutateAsync(data);
//       toast.success(t("update_success"), {
//         autoClose: 2000,
//       });
//       validation.resetForm();
//     } catch (error) {
//       toast.error(t("update_failure"), {
//         autoClose: 2000,
//       });
//     }
//     toggle();
//   };
//   const handleDeleteDepartment = async () => {
//     if (department && department.cnt_id) {
//       try {
//         const id = department.cnt_id;
//         await deleteDepartment.mutateAsync(id);
//         toast.success(t("delete_success"), {
//           autoClose: 2000,
//         });
//       } catch (error) {
//         toast.error(t("delete_failure"), {
//           autoClose: 2000,
//         });
//       }
//       setDeleteModal(false);
//     }
//   };

//   // validation
//   const validation = useFormik({
//     // enableReinitialize: use this flag when initial values need to be changed
//     enableReinitialize: true,

//     initialValues: {
//       dep_name_or: (department && department.dep_name_or) || "",
//       dep_name_am: (department && department.dep_name_am) || "",
//       dep_name_en: (department && department.dep_name_en) || "",
//       dep_code: (department && department.dep_code) || "",
//       dep_available_at_region:
//         (department && department.dep_available_at_region) || false,
//       dep_available_at_zone:
//         (department && department.dep_available_at_zone) || false,
//       dep_available_at_woreda:
//         (department && department.dep_available_at_woreda) || false,
//       dep_description: (department && department.dep_description) || "",
//       dep_status: department && department.dep_status,

//       is_deletable: department && department.is_deletable,
//       is_editable: department && department.is_editable,
//     },

//     validationSchema: Yup.object({
//       dep_name_or: alphanumericValidation(2, 100, true).test(
//         "unique-dep_name_or",
//         t("Already exists"),
//         (value) => {
//           return !data?.data.some(
//             (item) =>
//               item.dep_name_or == value && item.dep_id !== department?.dep_id
//           );
//         }
//       ),
//       dep_name_am: Yup.string().test(
//         "unique-dep_name_am",
//         t("Already exists"),
//         (value) => {
//           return !data?.data.some(
//             (item) =>
//               item.dep_name_am == value && item.dep_id !== department?.dep_id
//           );
//         }
//       ),
//       dep_name_en: alphanumericValidation(2, 100, true).test(
//         "unique-dep_name_en",
//         t("Already exists"),
//         (value) => {
//           return !data?.data.some(
//             (item) =>
//               item.dep_name_en == value && item.dep_id !== department?.dep_id
//           );
//         }
//       ),
//       dep_description: alphanumericValidation(3, 425, false),
//     }),
//     validateOnBlur: true,
//     validateOnChange: false,
//     onSubmit: (values) => {
//       if (isEdit) {
//         const updateDepartmentData = {
//           dep_id: department ? department.dep_id : 0,
//           dep_name_or: values.dep_name_or,
//           dep_name_am: values.dep_name_am,
//           dep_name_en: values.dep_name_en,
//           dep_code: values.dep_code,
//           dep_available_at_region: values.dep_available_at_region ? 1 : 0,
//           dep_available_at_zone: values.dep_available_at_zone ? 1 : 0,
//           dep_available_at_woreda: values.dep_available_at_woreda ? 1 : 0,
//           dep_description: values.dep_description,
//           dep_status: values.dep_status,

//           is_deletable: values.is_deletable,
//           is_editable: values.is_editable,
//         };
//         // update Department
//         handleUpdateDepartment(updateDepartmentData);
//       } else {
//         const newDepartmentData = {
//           dep_name_or: values.dep_name_or,
//           dep_name_am: values.dep_name_am,
//           dep_name_en: values.dep_name_en,
//           dep_code: values.dep_code,
//           dep_available_at_region: values.dep_available_at_region ? 1 : 0,
//           dep_available_at_zone: values.dep_available_at_zone ? 1 : 0,
//           dep_available_at_woreda: values.dep_available_at_woreda ? 1 : 0,
//           dep_description: values.dep_description,
//           dep_status: values.dep_status,
//         };
//         // save new Departments
//         handleAddDepartment(newDepartmentData);
//       }
//     },
//   });

//   const [transaction, setTransaction] = useState({});
//   const toggleViewModal = () => setModal1(!modal1);

//   useEffect(() => {
//     setDepartment(data);
//   }, [data]);

//   useEffect(() => {
//     if (!isEmpty(data) && !!isEdit) {
//       setDepartment(data);
//       setIsEdit(false);
//     }
//   }, [data]);

//   const toggle = () => {
//     if (modal) {
//       setModal(false);
//       setDepartment(null);
//     } else {
//       setModal(true);
//     }
//   };

//   const handleDepartmentClick = (arg) => {
//     const department = arg;
//     setDepartment({
//       dep_id: department.dep_id,
//       dep_name_or: department.dep_name_or,
//       dep_name_am: department.dep_name_am,
//       dep_name_en: department.dep_name_en,
//       dep_code: department.dep_code,
//       dep_available_at_region: department.dep_available_at_region === 1,
//       dep_available_at_zone: department.dep_available_at_zone === 1,
//       dep_available_at_woreda: department.dep_available_at_woreda === 1,
//       dep_description: department.dep_description,
//       dep_status: department.dep_status,
//       is_deletable: department.is_deletable,
//       is_editable: department.is_editable,
//     });

//     setIsEdit(true);

//     toggle();
//   };

//   //delete projects
//   const [deleteModal, setDeleteModal] = useState(false);

//   const onClickDelete = (department) => {
//     setDepartment(department);
//     setDeleteModal(true);
//   };

//   const handleDepartmentClicks = () => {
//     setIsEdit(false);
//     setDepartment("");
//     toggle();
//   };

//   const handleSearchResults = ({ data, error }) => {
//     setSearchResults(data);
//     setSearchError(error);
//     setShowSearchResult(true);
//   };

//   const columns = useMemo(() => {
//     const baseColumns = [
//       {
//         header: "",
//         accessorKey: "dep_name_or",
//         enableColumnFilter: false,
//         enableSorting: true,
//         cell: (cellProps) => {
//           return (
//             <span>
//               {truncateText(cellProps.row.original.dep_name_or, 30) || "-"}
//             </span>
//           );
//         },
//       },
//       {
//         header: "",
//         accessorKey: "dep_name_am",
//         enableColumnFilter: false,
//         enableSorting: true,
//         cell: (cellProps) => {
//           return (
//             <span>
//               {truncateText(cellProps.row.original.dep_name_am, 30) || "-"}
//             </span>
//           );
//         },
//       },
//       {
//         header: "",
//         accessorKey: "dep_name_en",
//         enableColumnFilter: false,
//         enableSorting: true,
//         cell: (cellProps) => {
//           return (
//             <span>
//               {truncateText(cellProps.row.original.dep_name_en, 30) || "-"}
//             </span>
//           );
//         },
//       },
//       {
//         header: "",
//         accessorKey: "dep_code",
//         enableColumnFilter: false,
//         enableSorting: true,
//         cell: (cellProps) => {
//           return (
//             <span>
//               {truncateText(cellProps.row.original.dep_code, 30) || "-"}
//             </span>
//           );
//         },
//       },
//       {
//         header: "",
//         accessorKey: "dep_available_at_region",
//         enableColumnFilter: false,
//         enableSorting: true,
//         cell: (cellProps) => {
//           return (
//             <span>
//               {cellProps.row.original.dep_available_at_region == 1
//                 ? "Yes"
//                 : "No"}
//             </span>
//           );
//         },
//       },
//       {
//         header: "",
//         accessorKey: "dep_available_at_zone",
//         enableColumnFilter: false,
//         enableSorting: true,
//         cell: (cellProps) => {
//           return (
//             <span>
//               {cellProps.row.original.dep_available_at_zone == 1 ? "Yes" : "No"}
//             </span>
//           );
//         },
//       },
//       {
//         header: "",
//         accessorKey: "dep_available_at_woreda",
//         enableColumnFilter: false,
//         enableSorting: true,
//         cell: (cellProps) => {
//           return (
//             <span>
//               {cellProps.row.original.dep_available_at_woreda == 1
//                 ? "Yes"
//                 : "No"}
//             </span>
//           );
//         },
//       },
//       {
//         header: t("view_detail"),
//         enableColumnFilter: false,
//         enableSorting: true,
//         cell: (cellProps) => {
//           return (
//             <Button
//               type="button"
//               color="primary"
//               className="btn-sm"
//               onClick={() => {
//                 const data = cellProps.row.original;
//                 toggleViewModal(data);
//                 setTransaction(cellProps.row.original);
//               }}
//             >
//               {t("view_detail")}
//             </Button>
//           );
//         },
//       },
//     ];
//     if (
//       data?.previledge?.is_role_editable == 1 ||
//       data?.previledge?.is_role_deletable == 1
//     ) {
//       baseColumns.push({
//         header: t("Action"),
//         accessorKey: t("Action"),
//         enableColumnFilter: false,
//         enableSorting: true,
//         cell: (cellProps) => {
//           return (
//             <div className="d-flex gap-3">
//               {cellProps.row.original.is_editable == 1 && (
//                 <Link
//                   to="#"
//                   className="text-success"
//                   onClick={() => {
//                     const data = cellProps.row.original;
//                     handleDepartmentClick(data);
//                   }}
//                 >
//                   <i
//                     className="mdi mdi-pencil fohandleDepartmentClicknt-size-18"
//                     id="edittooltip"
//                   />
//                   <UncontrolledTooltip placement="top" target="edittooltip">
//                     Edit
//                   </UncontrolledTooltip>
//                 </Link>
//               )}

//               {cellProps.row.original.is_deletable == 9 && (
//                 <Link
//                   to="#"
//                   className="text-danger"
//                   onClick={() => {
//                     const data = cellProps.row.original;
//                     onClickDelete(data);
//                   }}
//                 >
//                   <i
//                     className="mdi mdi-delete font-size-18"
//                     id="deletetooltip"
//                   />
//                   <UncontrolledTooltip placement="top" target="deletetooltip">
//                     Delete
//                   </UncontrolledTooltip>
//                 </Link>
//               )}
//             </div>
//           );
//         },
//       });
//     }

//     return baseColumns;
//   }, [handleDepartmentClick, toggleViewModal, onClickDelete]);

//   if (isError) {
//     return <FetchErrorHandler error={error} refetch={refetch} />;
//   }

//   return (
//     <React.Fragment>
//       <DetailModal
//         isOpen={modal1}
//         toggle={toggleViewModal}
//         details={transaction}
//         excludeKey={["dep_id", "is_editable", "is_deletable", "dep_create_time", "dep_update_time", "dep_status", "dep_created_by", "dep_delete_time"]}
//       />
//       <DeleteModal
//         show={deleteModal}
//         onDeleteClick={handleDeleteDepartment}
//         onCloseClick={() => setDeleteModal(false)}
//         isLoading={deleteDepartment.isPending}
//       />
//       <div className="page-content">
//         <div className="container-fluid">
//           <Breadcrumbs
//             title={t("department")}
//             breadcrumbItem={t("department")}
//           />
//           {isLoading || isSearchLoading ? (
//             <Spinners />
//           ) : (
//             <Row>
//               <Col xs="12">
//                 <Card>
//                   <CardBody>
//                     <TableContainer
//                       columns={columns}
//                       data={
//                         showSearchResult
//                           ? searchResults?.data
//                           : data?.data || []
//                       }
//                       isGlobalFilter={true}
//                       isAddButton={data?.previledge?.is_role_can_add == 1}
//                       isCustomPageSize={true}
//                       handleUserClick={handleDepartmentClicks}
//                       isPagination={true}
//                       SearchPlaceholder={t("filter_placeholder")}
//                       buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
//                       buttonName={t("add") + " " + t("department")}
//                       tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
//                       theadClass="table-light"
//                       pagination="pagination"
//                       paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
//                       excludeKey={["is_editable", "is_deletable"]} // will be used by export to excel and pdf components
//                       tableName="Department Data" // will be used by export to excel and pdf components
//                     />
//                   </CardBody>
//                 </Card>
//               </Col>
//             </Row>
//           )}
//           <Modal isOpen={modal} toggle={toggle} className="modal-xl">
//             <ModalHeader toggle={toggle} tag="h4">
//               {!!isEdit
//                 ? t("edit") + " " + t("department")
//                 : t("add") + " " + t("department")}
//             </ModalHeader>
//             <ModalBody>
//               <Form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   validation.handleSubmit();
//                   return false;
//                 }}
//               >
//                 <Row>
//                   <Col className="col-md-6 mb-3">
//                     <Label>
//                       {t("dep_name_or")}
//                       <span className="text-danger">*</span>
//                     </Label>
//                     <Input
//                       name="dep_name_or"
//                       type="text"
//                       placeholder={t("dep_name_or")}
//                       onChange={validation.handleChange}
//                       onBlur={validation.handleBlur}
//                       value={validation.values.dep_name_or || ""}
//                       invalid={
//                         validation.touched.dep_name_or &&
//                           validation.errors.dep_name_or
//                           ? true
//                           : false
//                       }
//                       maxLength={100}
//                     />
//                     {validation.touched.dep_name_or &&
//                       validation.errors.dep_name_or ? (
//                       <FormFeedback type="invalid">
//                         {validation.errors.dep_name_or}
//                       </FormFeedback>
//                     ) : null}
//                   </Col>
//                   <Col className="col-md-6 mb-3">
//                     <Label>
//                       {t("dep_name_am")}
//                       <span className="text-danger">*</span>
//                     </Label>
//                     <Input
//                       name="dep_name_am"
//                       type="text"
//                       placeholder={t("dep_name_am")}
//                       onChange={validation.handleChange}
//                       onBlur={validation.handleBlur}
//                       value={validation.values.dep_name_am || ""}
//                       invalid={
//                         validation.touched.dep_name_am &&
//                           validation.errors.dep_name_am
//                           ? true
//                           : false
//                       }
//                       maxLength={100}
//                     />
//                     {validation.touched.dep_name_am &&
//                       validation.errors.dep_name_am ? (
//                       <FormFeedback type="invalid">
//                         {validation.errors.dep_name_am}
//                       </FormFeedback>
//                     ) : null}
//                   </Col>
//                   <Col className="col-md-6 mb-3">
//                     <Label>
//                       {t("dep_name_en")}
//                       <span className="text-danger">*</span>
//                     </Label>
//                     <Input
//                       name="dep_name_en"
//                       type="text"
//                       placeholder={t("dep_name_en")}
//                       onChange={validation.handleChange}
//                       onBlur={validation.handleBlur}
//                       value={validation.values.dep_name_en || ""}
//                       invalid={
//                         validation.touched.dep_name_en &&
//                           validation.errors.dep_name_en
//                           ? true
//                           : false
//                       }
//                       maxLength={100}
//                     />
//                     {validation.touched.dep_name_en &&
//                       validation.errors.dep_name_en ? (
//                       <FormFeedback type="invalid">
//                         {validation.errors.dep_name_en}
//                       </FormFeedback>
//                     ) : null}
//                   </Col>
//                   <Col className="col-md-6 mb-3">
//                     <Label>{t("dep_code")}</Label>
//                     <Input
//                       name="dep_code"
//                       type="text"
//                       placeholder={t("dep_code")}
//                       onChange={validation.handleChange}
//                       onBlur={validation.handleBlur}
//                       value={validation.values.dep_code || ""}
//                       invalid={
//                         validation.touched.dep_code &&
//                           validation.errors.dep_code
//                           ? true
//                           : false
//                       }
//                       maxLength={20}
//                     />
//                     {validation.touched.dep_code &&
//                       validation.errors.dep_code ? (
//                       <FormFeedback type="invalid">
//                         {validation.errors.dep_code}
//                       </FormFeedback>
//                     ) : null}
//                   </Col>
//                   <Row>
//                     <Col className="col-md-6 col-xl-4 mb-3">
//                       <Label for="dep_available_at_region" className="me-1">
//                         {t("dep_available_at_region")}
//                       </Label>
//                       <Input
//                         id="dep_available_at_region"
//                         name="dep_available_at_region"
//                         type="checkbox"
//                         placeholder={t("dep_available_at_region")}
//                         onChange={validation.handleChange}
//                         onBlur={validation.handleBlur}
//                         checked={validation.values.dep_available_at_region}
//                         invalid={
//                           validation.touched.dep_available_at_region &&
//                             validation.errors.dep_available_at_region
//                             ? true
//                             : false
//                         }
//                       />
//                       {validation.touched.dep_available_at_region &&
//                         validation.errors.dep_available_at_region ? (
//                         <FormFeedback type="invalid">
//                           {validation.errors.dep_available_at_region}
//                         </FormFeedback>
//                       ) : null}
//                     </Col>
//                     <Col className="col-md-6 col-xl-4 mb-3">
//                       <Label className="me-1" for="dep_available_at_zone">
//                         {t("dep_available_at_zone")}
//                       </Label>
//                       <Input
//                         id="dep_available_at_zone"
//                         name="dep_available_at_zone"
//                         type="checkbox"
//                         placeholder={t("dep_available_at_zone")}
//                         onChange={validation.handleChange}
//                         onBlur={validation.handleBlur}
//                         checked={validation.values.dep_available_at_zone}
//                         invalid={
//                           validation.touched.dep_available_at_zone &&
//                             validation.errors.dep_available_at_zone
//                             ? true
//                             : false
//                         }
//                       />
//                       {validation.touched.dep_available_at_zone &&
//                         validation.errors.dep_available_at_zone ? (
//                         <FormFeedback type="invalid">
//                           {validation.errors.dep_available_at_zone}
//                         </FormFeedback>
//                       ) : null}
//                     </Col>
//                     <Col className="col-md-6 col-xl-4 mb-3">
//                       <Label className="me-1" for="dep_available_at_woreda">
//                         {t("dep_available_at_woreda")}
//                       </Label>
//                       <Input
//                         id="dep_available_at_woreda"
//                         name="dep_available_at_woreda"
//                         type="checkbox"
//                         placeholder={t("dep_available_at_woreda")}
//                         onChange={validation.handleChange}
//                         onBlur={validation.handleBlur}
//                         checked={validation.values.dep_available_at_woreda}
//                         invalid={
//                           validation.touched.dep_available_at_woreda &&
//                             validation.errors.dep_available_at_woreda
//                             ? true
//                             : false
//                         }
//                       />
//                       {validation.touched.dep_available_at_woreda &&
//                         validation.errors.dep_available_at_woreda ? (
//                         <FormFeedback type="invalid">
//                           {validation.errors.dep_available_at_woreda}
//                         </FormFeedback>
//                       ) : null}
//                     </Col>
//                   </Row>
//                   <Col className="col-md-6 mb-3">
//                     <Label>{t("dep_description")}</Label>
//                     <Input
//                       name="dep_description"
//                       type="textarea"
//                       rows={2}
//                       placeholder={t("dep_description")}
//                       onChange={validation.handleChange}
//                       onBlur={validation.handleBlur}
//                       value={validation.values.dep_description || ""}
//                       invalid={
//                         validation.touched.dep_description &&
//                           validation.errors.dep_description
//                           ? true
//                           : false
//                       }
//                       maxLength={425}
//                     />
//                     {validation.touched.dep_description &&
//                       validation.errors.dep_description ? (
//                       <FormFeedback type="invalid">
//                         {validation.errors.dep_description}
//                       </FormFeedback>
//                     ) : null}
//                   </Col>
//                   {/**/}
//                 </Row>
//                 <Row>
//                   <Col>
//                     <div className="text-end">
//                       {addDepartment.isPending || updateDepartment.isPending ? (
//                         <Button
//                           color="success"
//                           type="submit"
//                           className="save-user"
//                           disabled={
//                             addDepartment.isPending ||
//                             updateDepartment.isPending ||
//                             !validation.dirty
//                           }
//                         >
//                           <Spinner size={"sm"} color="light" className="me-2" />
//                           {t("Save")}
//                         </Button>
//                       ) : (
//                         <Button
//                           color="success"
//                           type="submit"
//                           className="save-user"
//                           disabled={
//                             addDepartment.isPending ||
//                             updateDepartment.isPending ||
//                             !validation.dirty
//                           }
//                         >
//                           {t("Save")}
//                         </Button>
//                       )}
//                     </div>
//                   </Col>
//                 </Row>
//               </Form>
//             </ModalBody>
//           </Modal>
//         </div>
//       </div>
//     </React.Fragment>
//   );
// };
// DepartmentModel.propTypes = {
//   preGlobalFilteredRows: PropTypes.any,
// };

// export default DepartmentModel;

import React from "react";
import DepartmentTree from "./DepartmentTree";

const DepartmentModel = () => {
  return <DepartmentTree />;
};

export default DepartmentModel;
