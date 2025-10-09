import React, { useEffect, useState } from "react";
import {
  Spinner,
  Row,
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Form,
  Input,
  FormFeedback,
  Label,
  Button,
} from "reactstrap";
import classnames from "classnames";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../hooks/useAuthUser";
import DepartmentTreeNode from "./DepartmentTreeNode";
import { FaHandPointRight } from "react-icons/fa";
import {
  useFetchDepartmentStructures,
  useAddDepartmentStructures,
  useDeleteDepartmentStructures,
  useUpdateDepartmentStructures,
} from "../../queries/department_structure_query";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { toast } from "react-toastify";

const DepartmentTree = () => {
  document.title = "Department Structure";

  const [selectedNode, setSelectedNode] = useState(null);
  const [formInputs, setFormInputs] = useState({
    dep_name_or: "",
    dep_name_am: "",
    dep_name_en: "",
  });
  const [errors, setErrors] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [renameValue, setRenameValue] = useState({
    dep_name_or: "",
    dep_name_am: "",
    dep_name_en: "",
  });
  const [descendants, setDescendants] = useState([]);
  const { t, i18n } = useTranslation();
  const { user: storedUser, isLoading: authLoading, userId } = useAuthUser();
  const { data, isLoading, isError, error, refetch } =
    useFetchDepartmentStructures(userId);
  const addFolder = useAddDepartmentStructures();
  const updateFolder = useUpdateDepartmentStructures();
  const deleteFolder = useDeleteDepartmentStructures();

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const getDescendants = (node) => {
    let allDescendants = [];
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        allDescendants.push(child?.name);
        allDescendants = allDescendants.concat(getDescendants(child));
      });
    }
    return allDescendants;
  };

  const resetForm = () => {
    setFormInputs({ dep_name_or: "", dep_name_am: "", dep_name_en: "" });
    setErrors({});
  };

  useEffect(() => {
    if (selectedNode) {
      setDescendants(getDescendants(selectedNode));
      setRenameValue({
        dep_name_or: selectedNode?.name ?? "",
        dep_name_am: selectedNode?.dep_name_am ?? "",
        dep_name_en: selectedNode?.dep_name_en ?? "",
      });

      resetForm();
    }
  }, [selectedNode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRenameChange = (e) => {
    const { name, value } = e.target;
    setRenameValue((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const checkNameExistsAdd = (folders, name) => {
    for (const folder of folders) {
      if (folder.name.trim() == name.trim()) return true;
      if (folder.children && folder.children.length > 0) {
        if (checkNameExistsAdd(folder.children, name)) return true;
      }
    }
    return false;
  };
  const checkNameExistsUpdate = (folders, name) => {
    for (const folder of folders) {
      if (
        String(folder?.name).trim() == String(name).trim() &&
        folder.id != selectedNode?.id
      )
        return true;
      if (folder.children && folder.children.length > 0) {
        if (checkNameExistsUpdate(folder.children, name)) return true;
      }
    }
    return false;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formInputs.dep_name_or)
      newErrors.dep_name_or = t("Field is required.");
    if (!formInputs.dep_name_am)
      newErrors.dep_name_am = t("Field is required.");
    if (!formInputs.dep_name_en)
      newErrors.dep_name_en = t("Field is required.");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFolder = async () => {
		if (!validateForm()) return;

		if (checkNameExistsAdd(data, formInputs.dep_name_or)) {
			setErrors((prev) => ({
				...prev,
				dep_name_or: t("Already exists"),
			}));
			return;
		}

		const rootId = selectedNode ? selectedNode.id : null;
		try {
			await addFolder.mutateAsync({ dep_parent_id: rootId, ...formInputs });
			toast.success(t("Data added successfully"), { autoClose: 3000 });
			resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("add_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleUpdateFolder = async () => {
		// if (!validateForm()) return;

		if (checkNameExistsUpdate(data, renameValue)) {
			setErrors((prev) => ({
				...prev,
				dep_name_or: t("Already exists"),
			}));
			return;
		}
		try {
			await updateFolder.mutateAsync({
				dep_id: selectedNode.id,
				dep_name_or: renameValue.dep_name_or,
				dep_name_am: renameValue.dep_name_am,
				dep_name_en: renameValue.dep_name_en,
			});
			toast.success(t("Data updated successfully"), { autoClose: 3000 });
			resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};

  const handleDeleteFolder = async () => {
    if (!selectedNode) return;
    try {
      await deleteFolder.mutateAsync(selectedNode.id);
      toast.success(t("Data deleted successfully"), { autoClose: 3000 });
      setSelectedNode(null);
      setDeleteModal(false);
    } catch (error) {
      toast.error(t("Failed to delete data"), { autoClose: 3000 });
    }
  };

  const isDisabled =
    addFolder.isPending ||
    updateFolder.isPending ||
    deleteFolder.isPending ||
    !selectedNode;
  if (isLoading)
    return (
      <div>
        <Spinner
          color="primary"
          className="position-absolute top-50 start-50"
        />
      </div>
    );
  if (isError) return <FetchErrorHandler error={error} refetch={refetch} />;
  return (
    <>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteFolder}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteFolder.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title={t("department")} />
          <div className="d-flex vh-100">
            <div
              className="w-30 p-3 border-end overflow-auto shadow-sm"
              style={{ minWidth: "700px" }}
            >
              <h5 className="mb-1">{t("department")}</h5>
              <hr className="text-dark" />
              {data?.map((node) => (
                <DepartmentTreeNode
                  key={node.id}
                  node={node}
                  onNodeClick={setSelectedNode}
                />
              ))}
            </div>
            <div className="p-3 flex-grow-1 bg-light">
              <div className="mb-4 d-flex-col align-items-center w-100 mx-auto">
                <Card className="w-full p-3">
                  <div className="d-flex gap-1 align-items-center">
                    <span className="me-3">
                      <FaHandPointRight
                        size={20}
                        style={{
                          transform: "rotate(90deg)",
                        }}
                      />
                    </span>
                    {selectedNode ? (
                      <h5 className="my-auto">
                        <strong>{selectedNode.name}</strong>
                      </h5>
                    ) : (
                      <span className="my-auto">
                        <h6 className="my-auto"></h6>
                      </span>
                    )}
                  </div>
                </Card>
                <Card>
                  <CardBody>
                    <Nav tabs className="d-flex justify-content-between">
                      <NavItem className="flex-grow-1 text-center">
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({ active: activeTab === "1" })}
                          onClick={() => {
                            toggle("1");
                          }}
                        >
                          <span className="me-2">
                            <i className="mdi mdi-plus"></i>
                          </span>
                          <span className="">{t("add")}</span>
                        </NavLink>
                      </NavItem>
                      <NavItem className="flex-grow-1 text-center">
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({ active: activeTab === "2" })}
                          onClick={() => {
                            toggle("2");
                          }}
                        >
                          <span className="me-2">
                            <i className="mdi mdi-pencil"></i>
                          </span>
                          <span className="">{t("edit")}</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent
                      activeTab={activeTab}
                      className="p-3 text-muted"
                    >
                      <TabPane tabId="1">
                        <Row>
                          <Col sm="12">
                            <Form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleAddFolder();
                                return false;
                              }}
                            >
                              <Row>
                                <Col className="col-md-12 mb-3">
                                  <Label>{t("dep_name_or")}</Label>
                                  <Input
                                    name="dep_name_or"
                                    type="text"
                                    value={formInputs.dep_name_or}
                                    onChange={handleInputChange}
                                    invalid={!!errors.dep_name_or}
                                  />
                                  {errors.dep_name_or && (
                                    <FormFeedback>
                                      {errors.dep_name_or}
                                    </FormFeedback>
                                  )}
                                </Col>
                                <Col className="col-md-12 mb-3">
                                  <Label>{t("dep_name_am")}</Label>
                                  <Input
                                    name="dep_name_am"
                                    type="text"
                                    value={formInputs.dep_name_am}
                                    onChange={handleInputChange}
                                    invalid={!!errors.dep_name_am}
                                  />
                                  {errors.dep_name_am && (
                                    <FormFeedback>
                                      {errors.dep_name_am}
                                    </FormFeedback>
                                  )}
                                </Col>
                                <Col className="col-md-12 mb-3">
                                  <Label>{t("dep_name_en")}</Label>
                                  <Input
                                    name="dep_name_en"
                                    type="text"
                                    value={formInputs.dep_name_en}
                                    onChange={handleInputChange}
                                    invalid={!!errors.dep_name_en}
                                  />
                                  {errors.dep_name_en && (
                                    <FormFeedback>
                                      {errors.dep_name_en}
                                    </FormFeedback>
                                  )}
                                </Col>
                              </Row>
                              <Button
                                className="mb-2"
                                type="submit"
                                color="success"
                                style={{ width: "120px" }}
                                disabled={
                                  isDisabled ||
                                  selectedNode?.level === "Officer"
                                }
                              >
                                <span>
                                  <i className="mdi mdi-plus me-1" />
                                  {t("Add")}
                                </span>
                              </Button>
                            </Form>
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane tabId="2">
                        <Row>
                          <Col sm="12">
                            <Form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateFolder();
                                return false;
                              }}
                            >
                              <Row>
                                <Col className="col-md-12 mb-3">
                                  <Label>{t("dep_name_or")}</Label>
                                  <Input
                                    name="dep_name_or"
                                    type="text"
                                    value={renameValue.dep_name_or}
                                    onChange={handleRenameChange}
                                  />
                                </Col>
                                <Col className="col-md-12 mb-3">
                                  <Label>{t("dep_name_am")}</Label>
                                  <Input
                                    name="dep_name_am"
                                    type="text"
                                    value={renameValue.dep_name_am}
                                    onChange={handleRenameChange}
                                  />
                                </Col>
                                <Col className="col-md-12 mb-3">
                                  <Label>{t("dep_name_en")}</Label>
                                  <Input
                                    name="dep_name_en"
                                    type="text"
                                    value={renameValue.dep_name_en}
                                    onChange={handleRenameChange}
                                  />
                                </Col>
                              </Row>
                              <Button
                                className="mb-2"
                                type="submit"
                                color="secondary"
                                style={{ width: "120px" }}
                                disabled={isDisabled}
                              >
                                <span>
                                  <i className="mdi mdi-pencil me-2" />
                                  {t("edit")}
                                </span>
                              </Button>
                            </Form>
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane tabId="3">
                        <Row>
                          <Col sm="12">
                            <div
                              style={{
                                width: "100%",
                                height: "280px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {selectedNode?.children.length > 0 && (
                                <div
                                  style={{ height: "200px" }}
                                  className="d-flex flex-column justify-content-center align-items-center"
                                >
                                  <ul
                                    style={{
                                      height: "200px",
                                      overflowY: "auto",
                                      width: "100%",
                                      padding: "10px",
                                      border: "1px solid #ccc",
                                      borderRadius: "4px",
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    {descendants.map((descendant, index) => (
                                      <li key={index}>{descendant}</li>
                                    ))}
                                  </ul>
                                  <p>
                                    {t(
                                      "All the departments listed above will also be deleted.",
                                    )}
                                  </p>
                                </div>
                              )}
                              <Button
                                className="mb-2"
                                type="submit"
                                color="danger"
                                outline
                                style={{ width: "120px" }}
                                disabled={isDisabled}
                                onClick={() => setDeleteModal(true)}
                              >
                                <span>
                                  <i className="mdi mdi-delete me-2" />
                                  {t("Delete")}
                                </span>
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DepartmentTree;
