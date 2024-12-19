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
  const [deleteModal, setDeleteModal] = useState(false);
  const [action, setAction] = useState(null);
  const { t } = useTranslation();

  const { data, isLoading, isError, error, refetch } = useFetchFolders();
  console.log("data", data);
  const addFolder = useAddFolder();
  const updateFolder = useRenameFolder();
  const deleteFolder = useDeleteFolder();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormInputs({ add_name_or: "", add_name_am: "", add_name_en: "" });
  };

  const handleAddFolder = async () => {
    const rootId = selectedNode ? selectedNode.id : null;
    try {
      await addFolder.mutateAsync({ rootId, ...formInputs });
      toast.success("Data added successfully", { autoClose: 2000 });
      resetForm();
    } catch (error) {
      toast.error("Failed to add data", { autoClose: 2000 });
    }
  };

  const handleUpdateFolder = async () => {
    try {
      await updateFolder.mutateAsync({
        id: selectedNode.id,
        name: formInputs.add_name_or,
      });
      toast.success("Data updated successfully", { autoClose: 2000 });
      resetForm();
      setSelectedNode(null);
    } catch (error) {
      toast.error("Failed to update data", { autoClose: 2000 });
    }
  };

  const handleDeleteFolder = async () => {
    if (!selectedNode) return;
    try {
      await deleteFolder.mutateAsync(selectedNode.id);
      toast.success("Data deleted successfully", { autoClose: 2000 });
      setSelectedNode(null);
      setDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete data", { autoClose: 2000 });
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
              <h4 className="mb-2 text-secondary">Address Structures</h4>
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
                  Selected Address: {selectedNode ? selectedNode.name : "None"}
                </h5>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault(); // Prevent the default form submission behavior
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
                        placeholder={t("insert_address_name_or")}
                        // invalid={!formInputs.add_name_or}
                      />
                      {/* {!formInputs.add_name_or && (
                        <FormFeedback type="invalid">
                          {t("Field is required.")}
                        </FormFeedback>
                      )} */}
                    </Col>
                    <Col className="col-md-12 mb-3">
                      <Label>{t("add_name_am")}</Label>
                      <Input
                        name="add_name_am"
                        type="text"
                        value={formInputs.add_name_am}
                        onChange={handleInputChange}
                        placeholder={t("insert_address_name_am")}
                      />
                    </Col>
                    <Col className="col-md-12 mb-3">
                      <Label>{t("add_name_en")}</Label>
                      <Input
                        name="add_name_en"
                        type="text"
                        value={formInputs.add_name_en}
                        onChange={handleInputChange}
                        placeholder={t("insert_address_name_en")}
                      />
                    </Col>
                  </Row>
                  {selectedNode && (
                    <div className="mb-2 mt-2 d-flex flex-row align-items-center justify-content-around">
                      <Button
                        className="mb-2"
                        type="submit"
                        color="success"
                        style={{ width: "120px" }}
                        disabled={isDisabled}
                        onClick={() => setAction("add")}
                      >
                        <span>
                          <i className="mdi mdi-plus me-1" />
                          {"Add"}
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
                          {"Rename"}
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
                          {"Delete"}
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
