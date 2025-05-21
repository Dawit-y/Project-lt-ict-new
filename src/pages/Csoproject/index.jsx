import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { before, isEmpty, update } from "lodash";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner, Table } from "reactstrap";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns2";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useFetchProjects, useAddProject, useUpdateProject, useDeleteProject, useSearchProjects, useFindProjects } from "../../queries/cso_project_query";
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../hooks/useAuthUser";
import Spinners from "../../components/Common/Spinner";
import {
  Button,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap";
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
  onlyAmharicValidation
} from "../../utils/Validation/validation";
import { toast } from "react-toastify";
import { createMultiLangKeyValueMap } from "../../utils/commonMethods";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import DatePicker from "../../components/Common/DatePicker";
import ProjectTabs from "./ProjectTabs";
import RegionProjectTab from "./RegionProjectTab"
import FormattedAmountField from "../../components/Common/FormattedAmountField"
import InputField from "../../components/Common/InputField"
import AsyncSelectField from "../../components/Common/AsyncSelectField"

const addMonths = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

const addYears = (date, years) => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
};

const ProjectModel = () => {
  document.title = "CSO Projects";
  const { t, i18n } = useTranslation();
  const lang = i18n.language
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [project, setProject] = useState(null);
  const [currentActiveTab, setCurrentActiveTab] = useState({
    tab: 1,
    selectedId: null,
    selectedCsoId: null
  });

  const handleTabChange = (newTab, selectedId = null, selectedCsoId) => {
    setCurrentActiveTab(prev => ({
      ...prev,
      tab: newTab,
      selectedId: selectedId !== null ? selectedId : prev.selectedId,
      selectedCsoId: selectedCsoId !== null ? selectedCsoId : prev.selectedCsoId,
    }));
  };

  const { user: storedUser, userId } = useAuthUser();
  const userType = storedUser?.user?.usr_user_type
  const csoId = storedUser?.user?.usr_owner_id
  const { data, isLoading, error, isError, refetch } =
    useFindProjects({ object_type_id: 1 }, true, userId);

  const { data: projectCategoryData, isLoading: isPctLoading, isError: isPctError } = useFetchProjectCategorys();
  const projectCategoryMap = useMemo(() => {
    return createMultiLangKeyValueMap(
      projectCategoryData?.data || [],
      "pct_id",
      {
        en: "pct_name_en",
        am: "pct_name_am",
        or: "pct_name_or",
      },
      lang,
    );
  }, [projectCategoryData, lang]);

  const addProject = useAddProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const handleAddProject = async (data) => {
    try {
      await addProject.mutateAsync(data);
      toast.success(t("add_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(t("add_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleUpdateProject = async (data) => {
    try {
      await updateProject.mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(t("update_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleDeleteProject = async () => {
    if (project && project.prj_id) {
      try {
        const id = project.prj_id;
        await deleteProject.mutateAsync(id);
        toast.success(t("delete_success"), {
          autoClose: 2000,
        });
      } catch (error) {
        toast.error(t("delete_success"), {
          autoClose: 2000,
        });
      }
      setDeleteModal(false);
    }
  };

  // validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      prj_name: (project && project.prj_name) || "",
      prj_name_am: (project && project.prj_name_am) || "",
      prj_name_en: (project && project.prj_name_en) || "",
      prj_code: (project && project.prj_code) || "",
      prj_project_status_id: (project && project.prj_project_status_id) || "",
      prj_project_category_id:
        (project && project.prj_project_category_id) || "",
      prj_project_budget_source_id:
        (project && project.prj_project_budget_source_id) || "",
      prj_total_estimate_budget:
        (project && project.prj_total_estimate_budget) || "",
      prj_total_actual_budget:
        (project && project.prj_total_actual_budget) || "",
      prj_geo_location: (project && project.prj_geo_location) || "",
      prj_sector_id: (project && project.prj_sector_id) || "",
      prj_location_region_id: (project && project.prj_location_region_id) || "",
      prj_location_zone_id: (project && project.prj_location_zone_id) || "",
      prj_location_woreda_id: (project && project.prj_location_woreda_id) || "",
      prj_location_kebele_id: (project && project.prj_location_kebele_id) || "",
      prj_location_description:
        (project && project.prj_location_description) || "",
      prj_owner_region_id: (project && project.prj_owner_region_id) || "",
      prj_owner_zone_id: (project && project.prj_owner_zone_id) || "",
      prj_owner_woreda_id: (project && project.prj_owner_woreda_id) || "",
      prj_owner_kebele_id: (project && project.prj_owner_kebele_id) || "",
      prj_owner_description: (project && project.prj_owner_description) || "",
      prj_start_date_et: (project && project.prj_start_date_et) || "",
      prj_start_date_gc: (project && project.prj_start_date_gc) || "",
      prj_start_date_plan_et: (project && project.prj_start_date_plan_et) || "",
      prj_start_date_plan_gc: (project && project.prj_start_date_plan_gc) || "",
      prj_end_date_actual_et: (project && project.prj_end_date_actual_et) || "",
      prj_end_date_actual_gc: (project && project.prj_end_date_actual_gc) || "",
      prj_end_date_plan_gc: (project && project.prj_end_date_plan_gc) || "",
      prj_end_date_plan_et: (project && project.prj_end_date_plan_et) || "",
      prj_outcome: (project && project.prj_outcome) || "",
      prj_deleted: (project && project.prj_deleted) || "",
      prj_remark: (project && project.prj_remark) || "",
      prj_created_date: (project && project.prj_created_date) || "",
      prj_owner_id: (project && project.prj_owner_id) || "",
      prj_urban_ben_number: (project && project.prj_urban_ben_number) || "",
      prj_rural_ben_number: (project && project.prj_rural_ben_number) || "",
      prj_admin_cost: (project && project.prj_admin_cost) || "",
      prj_program_cost: (project && project.prj_program_cost) || "",
      prj_male_participant: (project && project.prj_male_participant) || "",
      prj_female_participant: (project && project.prj_female_participant) || "",

    },

    validationSchema: Yup.object({
      prj_name: alphanumericValidation(3, 200, true),
      prj_name_am: onlyAmharicValidation(3, 200, false),
      prj_name_en: alphanumericValidation(3, 200, true),
      prj_code: alphanumericValidation(3, 20, false),
      //prj_project_status_id: Yup.string().required(t('prj_project_status_id')),
      prj_project_category_id: numberValidation(1, 200, true),
      //prj_project_budget_source_id: Yup.string().required(t('prj_project_budget_source_id')),
      //prj_total_estimate_budget: amountValidation(1000, 1000000000000, true),

      prj_total_actual_budget: amountValidation(1000, 1000000000000, false),
      //prj_geo_location: Yup.string().required(t('prj_geo_location')),
      //prj_sector_id: Yup.string().required(t("prj_sector_id")),
      prj_location_region_id: Yup.string().required(
        t("prj_location_region_id")
      ),
      prj_location_zone_id: Yup.string().required(t("prj_location_zone_id")),
      prj_location_woreda_id: Yup.string().required(
        t("prj_location_woreda_id")
      ),
      //prj_department_id: Yup.string().required(t("prj_department_id")),
      prj_urban_ben_number: numberValidation(0, 1000000000000, false),
      prj_rural_ben_number: numberValidation(0, 1000000000000, false),

      prj_admin_cost: numberValidation(0, 1000000000000, true),
      prj_program_cost: numberValidation(0, 1000000000000, true),
      prj_male_participant: numberValidation(0, 1000000000000, true),
      prj_female_participant: numberValidation(0, 1000000000000, true),
      prj_location_description: alphanumericValidation(3, 425, false),
      //prj_outcome: alphanumericValidation(3, 425, true),
      prj_remark: alphanumericValidation(3, 425, false),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProject = {
          prj_id: project.prj_id,
          prj_name: values.prj_name,
          prj_name_am: values.prj_name_am,
          prj_name_en: values.prj_name_en,
          prj_code: values.prj_code,
          prj_project_status_id: values.prj_project_status_id,
          prj_project_category_id: values.prj_project_category_id,
          prj_project_budget_source_id: values.prj_project_budget_source_id,
          prj_total_estimate_budget: values.prj_total_estimate_budget,
          prj_total_actual_budget: values.prj_total_actual_budget,
          prj_geo_location: values.prj_geo_location,
          prj_location_region_id: Number(values.prj_location_region_id),
          prj_location_zone_id: Number(values.prj_location_zone_id),
          prj_location_woreda_id: Number(values.prj_location_woreda_id),
          prj_location_kebele_id: values.prj_location_kebele_id,
          prj_location_description: values.prj_location_description,
          prj_owner_region_id: Number(values.prj_owner_region_id),
          prj_owner_zone_id: Number(values.prj_owner_zone_id),
          prj_owner_woreda_id: Number(values.prj_owner_woreda_id),
          prj_owner_kebele_id: values.prj_owner_kebele_id,
          prj_owner_description: values.prj_owner_description,
          prj_start_date_et: values.prj_start_date_et,
          prj_start_date_gc: values.prj_start_date_gc,
          prj_start_date_plan_et: values.prj_start_date_plan_et,
          prj_start_date_plan_gc: values.prj_start_date_plan_gc,
          prj_end_date_actual_et: values.prj_end_date_actual_et,
          prj_end_date_actual_gc: values.prj_end_date_actual_gc,
          prj_end_date_plan_gc: values.prj_end_date_plan_gc,
          prj_end_date_plan_et: values.prj_end_date_plan_et,
          prj_outcome: values.prj_outcome,
          prj_deleted: values.prj_deleted,
          prj_remark: values.prj_remark,
          prj_created_date: values.prj_created_date,
          prj_owner_id: userType === 4 ? currentActiveTab.selectedCsoId : csoId,
          prj_urban_ben_number: values.prj_urban_ben_number,
          prj_rural_ben_number: values.prj_rural_ben_number,

          prj_admin_cost: values.prj_admin_cost,
          prj_program_cost: values.prj_program_cost,
          prj_male_participant: values.prj_male_participant,
          prj_female_participant: values.prj_female_participant,
          prj_program_id: 1,
          parent_id: userType === 4 ? currentActiveTab?.tab === 2 ? 1 : currentActiveTab?.selectedId : currentActiveTab?.tab === 1 ? 1 : currentActiveTab?.selectedId,
          object_type_id: userType === 4 ? currentActiveTab?.tab === 2 ? 1 : 5 : currentActiveTab?.tab === 1 ? 1 : 5,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update Project
        handleUpdateProject(updateProject);
      } else {
        const newProject = {
          prj_name: values.prj_name,
          prj_name_am: values.prj_name_am,
          prj_name_en: values.prj_name_en,
          prj_code: values.prj_code,
          prj_project_status_id: values.prj_project_status_id,
          prj_project_category_id: values.prj_project_category_id,
          prj_project_budget_source_id: values.prj_project_budget_source_id,
          prj_total_estimate_budget: values.prj_total_estimate_budget,
          prj_total_actual_budget: values.prj_total_actual_budget,
          prj_geo_location: values.prj_geo_location,
          prj_location_region_id: Number(values.prj_location_region_id),
          prj_location_zone_id: Number(values.prj_location_zone_id),
          prj_location_woreda_id: Number(values.prj_location_woreda_id),
          prj_location_kebele_id: values.prj_location_kebele_id,
          prj_location_description: values.prj_location_description,
          prj_owner_region_id: Number(values.prj_owner_region_id),
          prj_owner_zone_id: Number(values.prj_owner_zone_id),
          prj_owner_woreda_id: Number(values.prj_owner_woreda_id),
          prj_owner_kebele_id: values.prj_owner_kebele_id,
          prj_owner_description: values.prj_owner_description,
          prj_start_date_et: values.prj_start_date_et,
          prj_start_date_gc: values.prj_start_date_gc,
          prj_start_date_plan_et: values.prj_start_date_plan_et,
          prj_start_date_plan_gc: values.prj_start_date_plan_gc,
          prj_end_date_actual_et: values.prj_end_date_actual_et,
          prj_end_date_actual_gc: values.prj_end_date_actual_gc,
          prj_end_date_plan_gc: values.prj_end_date_plan_gc,
          prj_end_date_plan_et: values.prj_end_date_plan_et,
          prj_outcome: values.prj_outcome,
          prj_deleted: values.prj_deleted,
          prj_remark: values.prj_remark,
          prj_created_date: values.prj_created_date,
          prj_owner_id: userType === 4 ? currentActiveTab.selectedCsoId : csoId,
          prj_urban_ben_number: values.prj_urban_ben_number,
          prj_rural_ben_number: values.prj_rural_ben_number,
          prj_admin_cost: values.prj_admin_cost,
          prj_program_cost: values.prj_program_cost,
          prj_male_participant: values.prj_male_participant,
          prj_female_participant: values.prj_female_participant,
          //prj_department_id: Number(values.prj_department_id),
          prj_program_id: 1,
          parent_id: userType === 4 ? currentActiveTab?.tab === 2 ? 1 : currentActiveTab?.selectedId : currentActiveTab?.tab === 1 ? 1 : currentActiveTab?.selectedId,
          object_type_id: userType === 4 ? currentActiveTab?.tab === 2 ? 1 : 5 : currentActiveTab?.tab === 1 ? 1 : 5,
        };
        // save new Project
        handleAddProject(newProject);
      }
    },
  });
  useEffect(() => {
    setProject(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProject(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setProject(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectClick = (arg) => {
    const project = arg;
    setProject({
      prj_id: project.prj_id,
      prj_name: project.prj_name,
      prj_name_am: project.prj_name_am,
      prj_name_en: project.prj_name_en,
      prj_code: project.prj_code,
      prj_project_status_id: project.prj_project_status_id,
      prj_project_category_id: project.prj_project_category_id,
      prj_project_budget_source_id: project.prj_project_budget_source_id,
      prj_total_estimate_budget: project.prj_total_estimate_budget,
      prj_total_actual_budget: project.prj_total_actual_budget,
      prj_geo_location: project.prj_geo_location,
      prj_sector_id: project.prj_sector_id,
      prj_location_region_id: project.prj_location_region_id,
      prj_location_zone_id: project.prj_location_zone_id,
      prj_location_woreda_id: project.prj_location_woreda_id,
      prj_location_kebele_id: project.prj_location_kebele_id,
      prj_location_description: project.prj_location_description,
      prj_owner_region_id: project.prj_owner_region_id,
      prj_owner_zone_id: project.prj_owner_zone_id,
      prj_owner_woreda_id: project.prj_owner_woreda_id,
      prj_owner_kebele_id: project.prj_owner_kebele_id,
      prj_owner_description: project.prj_owner_description,
      prj_start_date_et: project.prj_start_date_et,
      prj_start_date_gc: project.prj_start_date_gc,
      prj_start_date_plan_et: project.prj_start_date_plan_et,
      prj_start_date_plan_gc: project.prj_start_date_plan_gc,
      prj_end_date_actual_et: project.prj_end_date_actual_et,
      prj_end_date_actual_gc: project.prj_end_date_actual_gc,
      prj_end_date_plan_gc: project.prj_end_date_plan_gc,
      prj_end_date_plan_et: project.prj_end_date_plan_et,
      prj_outcome: project.prj_outcome,
      prj_deleted: project.prj_deleted,
      prj_remark: project.prj_remark,
      prj_created_date: project.prj_created_date,
      prj_owner_id: project.prj_owner_id,
      prj_urban_ben_number: project.prj_urban_ben_number,
      prj_rural_ben_number: project.prj_rural_ben_number,
      prj_admin_cost: project.prj_admin_cost,
      prj_program_cost: project.prj_program_cost,
      prj_male_participant: project.prj_male_participant,
      prj_female_participant: project.prj_female_participant,
      //prj_department_id: project.prj_department_id,
      is_deletable: project.is_deletable,
      is_editable: project.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  const handleProjectsClicks = () => {
    validation.resetForm()
    setIsEdit(false);
    setProject("");
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (project) => {
    setProject(project);
    setDeleteModal(true);
  };

  const activeTabName = userType === 4 ? currentActiveTab?.tab === 2 ? "Project" : "Activity" : currentActiveTab?.tab === 1 ? "Project" : "Activity"

  const rawStartDate = validation.values.prj_start_date_plan_gc;
  const startDate = rawStartDate
    ? new Date(rawStartDate.replace(/\//g, "-"))
    : null;

  const minEndDate = startDate ? addMonths(startDate, 1) : null;
  const maxEndDate = startDate ? addYears(startDate, 5) : null;

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div>
          <Breadcrumbs />
          <div className="w-100 d-flex gap-2">
            <>
              <div className="w-100">
                {isLoading ?
                  <Spinners /> :
                  userType === 4 ?
                    <RegionProjectTab
                      handleAddClick={handleProjectsClicks}
                      handleEditClick={handleProjectClick}
                      handleTabChange={handleTabChange}
                    /> :
                    <ProjectTabs
                      program={data}
                      handleAddClick={handleProjectsClicks}
                      handleEditClick={handleProjectClick}
                      handleTabChange={handleTabChange}
                    />
                }
              </div>
            </>
          </div>
        </div>
        <Modal isOpen={modal} toggle={toggle} className="modal-xl">
          <ModalHeader toggle={toggle} tag="h4">
            {!!isEdit
              ? t("edit") + " " + t(activeTabName)
              : t("add") + " " + t(activeTabName)}
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
                <Col className="col-md-12 mb-3">
                  <CascadingDropdowns
                    validation={validation}
                    dropdown1name="prj_location_region_id"
                    dropdown2name="prj_location_zone_id"
                    dropdown3name="prj_location_woreda_id"
                    isEdit={isEdit}
                  />
                </Col>
                <InputField
                  type="textarea"
                  validation={validation}
                  fieldId={"prj_location_description"}
                  isRequired={false}
                  className="col-md-12 mb-3"
                  maxLength={400}
                />
                <Col className="col-md-4 mb-3">
                  <Label>
                    {t("prj_name")}
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    name="prj_name"
                    type="text"
                    placeholder={t("prj_name")}
                    onChange={(e) => {
                      validation.handleChange(e);
                      validation.setFieldValue("prj_name_en", e.target.value);
                    }}
                    onBlur={validation.handleBlur}
                    value={validation.values.prj_name || ""}
                    invalid={
                      validation.touched.prj_name &&
                        validation.errors.prj_name
                        ? true
                        : false
                    }
                    maxLength={200}
                  />
                  {validation.touched.prj_name &&
                    validation.errors.prj_name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.prj_name}
                    </FormFeedback>
                  ) : null}
                </Col>
                <InputField
                  type="text"
                  validation={validation}
                  fieldId={"prj_name_am"}
                  isRequired={false}
                  className="col-md-4 mb-3"
                  maxLength={200}
                />
                <InputField
                  type="text"
                  validation={validation}
                  fieldId={"prj_name_en"}
                  isRequired={true}
                  className="col-md-4 mb-3"
                  maxLength={200}
                />
                <InputField
                  type="text"
                  validation={validation}
                  fieldId={"prj_code"}
                  isRequired={false}
                  className="col-md-4 mb-3"
                  maxLength={20}
                />
                <AsyncSelectField
                  fieldId="prj_project_category_id"
                  validation={validation}
                  isRequired
                  className="col-md-4 mb-3"
                  optionMap={projectCategoryMap}
                  isLoading={isPctLoading}
                  isError={isPctError}
                />
                <FormattedAmountField
                  validation={validation}
                  fieldId={"prj_total_estimate_budget"}
                  isRequired={true}
                  className="col-md-4 mb-3"
                  allowDecimal={true}
                />
                <FormattedAmountField
                  validation={validation}
                  fieldId={"prj_total_actual_budget"}
                  isRequired={true}
                  className="col-md-4 mb-3"
                  allowDecimal={true}
                />
                <Col className="col-md-4 mb-3">
                  <DatePicker
                    isRequired={true}
                    componentId={"prj_start_date_plan_gc"}
                    validation={validation}
                  />
                </Col>
                <Col className="col-md-4 mb-3">
                  <DatePicker
                    isRequired={true}
                    componentId={"prj_end_date_plan_gc"}
                    validation={validation}
                    minDate={minEndDate}
                    maxDate={maxEndDate}

                  />
                </Col>
                <Row>
                  <FormattedAmountField
                    validation={validation}
                    fieldId={"prj_urban_ben_number"}
                    isRequired={true}
                    className="col-md-3 mb-3"
                    allowDecimal={false}
                  />
                  <FormattedAmountField
                    validation={validation}
                    fieldId={"prj_rural_ben_number"}
                    isRequired={true}
                    className="col-md-3 mb-3"
                    allowDecimal={false}
                  />

                  <FormattedAmountField
                    validation={validation}
                    fieldId={"prj_male_participant"}
                    isRequired={true}
                    className="col-md-3 mb-3"
                    allowDecimal={false}
                  />
                  <FormattedAmountField
                    validation={validation}
                    fieldId={"prj_female_participant"}
                    isRequired={true}
                    className="col-md-3 mb-3"
                    allowDecimal={false}
                  />
                </Row>
                <FormattedAmountField
                  validation={validation}
                  fieldId={"prj_admin_cost"}
                  isRequired={true}
                  className="col-md-4 mb-3"
                  allowDecimal={true}
                />
                <FormattedAmountField
                  validation={validation}
                  fieldId={"prj_program_cost"}
                  isRequired={true}
                  className="col-md-4 mb-3"
                  allowDecimal={true}
                />
                <InputField
                  type="textarea"
                  validation={validation}
                  fieldId={"prj_outcome"}
                  isRequired={false}
                  className="col-md-6 mb-3"
                  maxLength={400}
                />
                <InputField
                  type="textarea"
                  validation={validation}
                  fieldId={"prj_remark"}
                  isRequired={false}
                  className="col-md-6 mb-3"
                  maxLength={400}
                />
              </Row>
              <Row>
                <Col>
                  <div className="text-end">
                    <Button
                      color="success"
                      type="submit"
                      className="save-user"
                      disabled={
                        addProject.isPending ||
                        updateProject.isPending ||
                        !validation.dirty
                      }
                    >
                      {(addProject.isPending || updateProject.isPending) && (
                        <Spinner size="sm" color="light" className="me-2" />
                      )}
                      {t("Save")}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    </React.Fragment>
  );
};
ProjectModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProjectModel;
