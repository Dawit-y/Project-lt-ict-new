import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Spinner, Row, Col } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import { useTranslation } from "react-i18next";
import TreeNode from "./TreeNode";
// import { ToastContainer } from 'react-toastify';

import {
  fetchProjectsRequest,
  renameFolderRequest,
  addFolderRequest,
  deleteFolderRequest,
} from "../../store/tree/actions";

const App_tree = () => {
  const dispatch = useDispatch();

  const TreeProperties = createSelector(
    (state) => state.TreeReducer,
    (TreeReducer) => ({
      data: TreeReducer.data,
      loading: TreeReducer.loading,
      fetch_loading: TreeReducer.fetch_loading,
      error: TreeReducer.error,
    })
  );

  const { data, loading, error, fetch_loading } = useSelector(TreeProperties);
  const [selectedNode, setSelectedNode] = useState(null);
  const [newSubFolderName, setNewSubFolderName] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchProjectsRequest());
  }, [dispatch]);

  const handleNodeClick = (node) => {
    const newTreeData = setNodeSelection(data, node.id);
    dispatch({ type: "SET_TREE_DATA", payload: newTreeData });
    setSelectedNode(node);
    setNewSubFolderName(""); // Clear input field when selecting a folder
  };

  const setNodeSelection = (nodes, id) => {
    return nodes.map((node) => {
      node.selected = node.id === id;
      if (node.children) {
        node.children = setNodeSelection(node.children, id);
      }
      return node;
    });
  };

  // Handle adding a new subfolder
  const addSubFolder = () => {
    if (!newSubFolderName) return; // Ensure input is not empty
    const parentId = selectedNode ? selectedNode.id : null; // If node is selected, it will be the parent
    console.log("addSubFolder", parentId, newSubFolderName);
    dispatch(addFolderRequest(parentId, newSubFolderName));
    setNewSubFolderName(""); // Clear the input field
  };

  // Handle renaming the selected folder
  const renameFolder = () => {
    if (!selectedNode || !newSubFolderName) return; // Ensure a folder is selected and input is not empty
    dispatch(
      renameFolderRequest(
        selectedNode.id,
        selectedNode.rootId,
        newSubFolderName
      )
    );
    setNewSubFolderName(""); // Clear the input field
    setSelectedNode(null); // Clear selection after renaming
  };

  const deleteFolder = () => {
    if (!selectedNode) return;
    dispatch(deleteFolderRequest(selectedNode.id));
    setSelectedNode(null);
    setDeleteModal(false);
  };

  if (fetch_loading)
    return (
      <div>
        <Spinner
          color="primary"
          className="position-absolute top-50 start-50"
        />
      </div>
    );
  if (error)
    return (
      <div className="position-absolute top-50 start-50">Error: {error}</div>
    );

  return (
    <>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={deleteFolder}
        onCloseClick={() => setDeleteModal(false)}
        update_loading={loading}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("Address Structure")}
            breadcrumbItem={t("tree")}
          />
          <div className="d-flex vh-100">
            {/* <ToastContainer /> */}
            <div className="w-30 p-3 bg-white border-end overflow-auto shadow-sm">
              <h4 className="mb-2 text-secondary">Address Structures</h4>
              <hr className="text-dark" />
              {data?.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  onNodeClick={handleNodeClick}
                />
              ))}
            </div>
            <div className="p-3 flex-grow-1 bg-light">
              <div className="mb-4 d-flex-col align-items-center w-75 mx-auto mt-5">
                <h5 className="mb-2">
                  Selected Address: {selectedNode ? selectedNode.name : "None"}
                </h5>
                <Row className="mb-2">
                  <input
                    type="text"
                    value={newSubFolderName}
                    onChange={(e) => setNewSubFolderName(e.target.value)}
                    placeholder={
                      selectedNode
                        ? "Enter Address Name"
                        : "Enter New Address Name"
                    }
                    className="form-control me-2"
                  />
                </Row>
                <Row className="mb-2 d-flex align-items-center">
                  <Col>
                   {selectedNode? <button
                      onClick={addSubFolder}
                      className={`btn btn-primary ${loading ? "disabled" : ""}`}
                    >
                     Add New Address
                    </button>:
                     null
                    }
                  </Col>
                  <Col>
                    <button
                      onClick={renameFolder}
                      disabled={!selectedNode}
                      className={`btn ${
                        selectedNode ? "btn-success" : "btn-secondary disabled"
                      } ${loading ? "disabled" : ""} `}
                    >
                      Rename Address Name
                    </button>
                  </Col>

                  <Col>
                    <>
                      {selectedNode && (
                        <div className="">
                          <button
                            onClick={() => setDeleteModal(true)}
                            className={`btn btn-danger ${
                              loading ? "disabled" : ""
                            }`}
                          >
                            Delete Address
                          </button>
                        </div>
                      )}
                    </>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App_tree;
