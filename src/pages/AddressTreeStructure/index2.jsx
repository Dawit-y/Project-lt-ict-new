import React, { useEffect, useState } from "react";
import {
  Spinner,
  Row,
  Col,
  Form,
  Input,
  FormFeedback,
  Label,
  Button,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import { useTranslation } from "react-i18next";
import TreeNode from "./TreeNode";

import {
  useFetchFolders,
  useAddFolder,
  useDeleteFolder,
  useRenameFolder,
} from "../../queries/address_structure_query";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { toast } from "react-toastify";

const App_tree = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [formInputs, setFormInputs] = useState({
    add_name_or: "",
    add_name_am: "",
    add_name_en: "",
  });
  const [errors, setErrors] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [action, setAction] = useState(null);
  const { t } = useTranslation();

  const { data, isLoading, isError, error, refetch } = useFetchFolders();
  const addFolder = useAddFolder();
  const updateFolder = useRenameFolder();
  const deleteFolder = useDeleteFolder();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const resetForm = () => {
    setFormInputs({ add_name_or: "", add_name_am: "", add_name_en: "" });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formInputs.add_name_or)
      newErrors.add_name_or = t("Field is required.");
    if (!formInputs.add_name_am)
      newErrors.add_name_am = t("Field is required.");
    if (!formInputs.add_name_en)
      newErrors.add_name_en = t("Field is required.");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFolder = async () => {
    if (!validateForm()) return;

    const rootId = selectedNode ? selectedNode.id : null;
    try {
      await addFolder.mutateAsync({ add_parent_id: rootId, ...formInputs });
      toast.success(t("Data added successfully"), { autoClose: 2000 });
      resetForm();
    } catch (error) {
      toast.error(t("Failed to add data"), { autoClose: 2000 });
    }
  };

  const handleUpdateFolder = async () => {
    if (!validateForm()) return;

    try {
      await updateFolder.mutateAsync({
        add_id: selectedNode.id,
        ...formInputs,
      });
      toast.success(t("Data updated successfully"), { autoClose: 2000 });
      resetForm();
      setSelectedNode(null);
    } catch (error) {
      toast.error(t("Failed to update data"), { autoClose: 2000 });
    }
  };

  const handleDeleteFolder = async () => {
    if (!selectedNode) return;
    try {
      await deleteFolder.mutateAsync(selectedNode.id);
      toast.success(t("Data deleted successfully"), { autoClose: 2000 });
      setSelectedNode(null);
      setDeleteModal(false);
    } catch (error) {
      toast.error(t("Failed to delete data"), { autoClose: 2000 });
    }
  };

  const isDisabled =
    addFolder.isPending || updateFolder.isPending || deleteFolder.isPending;

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
          <Breadcrumbs
            title={t("Address Structure")}
            breadcrumbItem={t("tree")}
          />
          <div className="d-flex vh-100">
            <div className="w-30 p-3 bg-white border-end overflow-auto shadow-sm">
              <h4 className="mb-2 text-secondary">{t("Address Structures")}</h4>
              <hr className="text-dark" />
              {data?.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  onNodeClick={setSelectedNode}
                />
              ))}
            </div>
            <div className="p-3 flex-grow-1 bg-light">
              <div className="mb-4 d-flex-col align-items-center w-75 mx-auto mt-5">
                <h5 className="mb-2">
                  <span>{t("Selected Address: ")}</span>
                  <strong>
                    {selectedNode ? selectedNode.name : t("None")}
                  </strong>
                </h5>
                <hr style={{ color: "black" }} />
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (action === "edit") {
                      handleUpdateFolder();
                    } else if (action === "add") {
                      handleAddFolder();
                    } else {
                      setDeleteModal(true);
                    }
                  }}
                >
                  <Row>
                    <Col className="col-md-12 mb-3">
                      <Label>{t("add_name_or")}</Label>
                      <Input
                        name="add_name_or"
                        type="text"
                        value={formInputs.add_name_or}
                        onChange={handleInputChange}
                        invalid={!!errors.add_name_or}
                      />
                      {errors.add_name_or && (
                        <FormFeedback>{errors.add_name_or}</FormFeedback>
                      )}
                    </Col>
                    <Col className="col-md-12 mb-3">
                      <Label>{t("add_name_am")}</Label>
                      <Input
                        name="add_name_am"
                        type="text"
                        value={formInputs.add_name_am}
                        onChange={handleInputChange}
                        invalid={!!errors.add_name_am}
                      />
                      {errors.add_name_am && (
                        <FormFeedback>{errors.add_name_am}</FormFeedback>
                      )}
                    </Col>
                    <Col className="col-md-12 mb-3">
                      <Label>{t("add_name_en")}</Label>
                      <Input
                        name="add_name_en"
                        type="text"
                        value={formInputs.add_name_en}
                        onChange={handleInputChange}
                        invalid={!!errors.add_name_en}
                      />
                      {errors.add_name_en && (
                        <FormFeedback>{errors.add_name_en}</FormFeedback>
                      )}
                    </Col>
                  </Row>
                  {selectedNode && (
                    <div className="mb-2 mt-2 d-flex flex-row align-items-center justify-content-around">
                      <Button
                        className="mb-2"
                        type="submit"
                        color="success"
                        style={{ width: "120px" }}
                        disabled={
                          isDisabled || selectedNode?.level === "woreda"
                        }
                        onClick={() => setAction("add")}
                      >
                        <span>
                          <i className="mdi mdi-plus me-1" />
                          {t("Add")}
                        </span>
                      </Button>
                      <Button
                        className="mb-2"
                        type="submit"
                        color="secondary"
                        onClick={() => setAction("edit")}
                        style={{ width: "120px" }}
                        disabled={isDisabled}
                      >
                        <span>
                          <i className="mdi mdi-pencil me-2" />
                          {t("Rename")}
                        </span>
                      </Button>
                      <Button
                        className="mb-2"
                        type="submit"
                        color="danger"
                        outline
                        style={{ width: "120px" }}
                        disabled={isDisabled}
                        onClick={() => setAction("delete")}
                      >
                        <span>
                          <i className="mdi mdi-delete me-2" />
                          {t("Delete")}
                        </span>
                      </Button>
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App_tree;
