const apiUrl = import.meta.env.VITE_BASE_API_URL;
import React, { useState, useEffect } from "react";
import TreeNode from "./TreeNode"; // Import the updated TreeNode component
import { Container, Row, Col, Button, Input, Spinner, Alert } from "reactstrap"; // Import components from reactstrap

const Index = () => {
  const [treeDataState, setTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [newSubFolderName, setNewSubFolderName] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [error, setError] = useState(null); // Error state
  const [operationInProgress, setOperationInProgress] = useState(false); // Loading state for operations

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}address_structure/listgrid`, {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setTreeData(buildTree(data["data"]));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Converts flat data into a hierarchical tree structure
  const buildTree = (data) => {
    const idMapping = data.reduce((acc, node) => {
      acc[node.id] = { ...node, children: [] };
      return acc;
    }, {});

    const tree = [];
    data.forEach((node) => {
      if (node.rootId === null) {
        tree.push(idMapping[node.id]);
      } else if (idMapping[node.rootId]) {
        idMapping[node.rootId].children.push(idMapping[node.id]);
      }
    });

    return tree;
  };

  const handleNodeClick = (node) => {
    const newTreeData = setNodeSelection(treeDataState, node.id);
    setTreeData(newTreeData);
    setSelectedNode(node);
  };

  const setNodeSelection = (nodes, id) => {
    return nodes.map((node) => {
      if (node.id === id) {
        node.selected = !node.selected;
      } else {
        node.selected = false;
      }
      if (node.children) {
        node.children = setNodeSelection(node.children, id);
      }
      return node;
    });
  };

  const addSubFolder = async () => {
    if (!selectedNode || !newSubFolderName) return;

    setOperationInProgress(true); // Show spinner

    try {
      const response = await fetch(
        `${apiUrl}address_structure/insertgrid?rootId=${encodeURIComponent(
          selectedNode.id
        )}&name=${encodeURIComponent(newSubFolderName)}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add subfolder");
      }

      const data = await response.json();
      const newSubFolder = {
        id: data.id,
        name: newSubFolderName,
        children: [],
        selected: false,
      };

      const addChild = (nodes) => {
        return nodes.map((node) => {
          if (node.id === selectedNode.id) {
            node.children = [...(node.children || []), newSubFolder];
          } else if (node.children) {
            node.children = addChild(node.children);
          }
          return node;
        });
      };

      setTreeData(addChild(treeDataState));
      setNewSubFolderName(""); // Clear the input field after adding
    } catch (error) {
      setError(error.message);
    } finally {
      setOperationInProgress(false); // Hide spinner
    }
  };

  const renameFolder = async (selectedNode) => {
    if (!selectedNode) return;

    const newName = prompt("Enter new name:", selectedNode.name);
    if (newName) {
      setOperationInProgress(true); // Show spinner

      try {
        const response = await fetch(
          `${apiUrl}address_structure/updategrid?rootId=${encodeURIComponent(
            selectedNode.rootId
          )}&name=${encodeURIComponent(newName)}&id=${encodeURIComponent(
            selectedNode.id
          )}&selected=${encodeURIComponent(selectedNode.selected ? 1 : 0)}`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to rename folder");
        }

        const renameChild = (nodes) => {
          return nodes.map((node) => {
            if (node.id === selectedNode.id) {
              node.name = newName;
            } else if (node.children) {
              node.children = renameChild(node.children);
            }
            return node;
          });
        };

        setTreeData(renameChild(treeDataState));
      } catch (error) {
        setError(error.message);
      } finally {
        setOperationInProgress(false); // Hide spinner
      }
    }
  };

  const deleteFolder = async (node) => {
    if (!node) return;

    setOperationInProgress(true); // Show spinner

    try {
      const response = await fetch(
        `${apiUrl}address_structure/deletegrid?id=${node.id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete folder");
      }

      const removeChild = (nodes, idToDelete) => {
        return nodes
          .filter((node) => node.id !== idToDelete)
          .map((node) => {
            if (node.children) {
              node.children = removeChild(node.children, idToDelete);
            }
            return node;
          });
      };

      setTreeData(removeChild(treeDataState, node.id));
      setSelectedNode(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setOperationInProgress(false); // Hide spinner
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }

  return (
    <Container fluid className="vh-100 bg-white mt-3">
      <Row className="h-100">
        <Col
          md={4}
          className="p-3 bg-white border-right overflow-auto shadow-sm"
          style={{ maxHeight: "80vh" }}
        >
          <h2 className="mb-4 text-dark">Project LT ICT Projects</h2>
          {treeDataState.map((node) => (
            <TreeNode key={node.id} node={node} onNodeClick={handleNodeClick} />
          ))}
        </Col>
        <Col md={8} className="p-4 bg-light">
          <h3 className="mb-4">Selected Node</h3>
          <p>{selectedNode ? selectedNode.name : "None"}</p>
          <div className="mb-4 d-flex align-items-center">
            <Input
              type="text"
              value={newSubFolderName}
              onChange={(e) => setNewSubFolderName(e.target.value)}
              placeholder="Enter new sub-folder name"
              className="mr-2"
            />
          </div>
          <div className="d-flex gap-2">
            <Button
              onClick={() => renameFolder(selectedNode)}
              disabled={!selectedNode || operationInProgress}
              color="warning"
            >
              Rename Folder
            </Button>
            <Button
              onClick={() => deleteFolder(selectedNode)}
              disabled={!selectedNode || operationInProgress}
              color="danger"
            >
              Delete Folder
            </Button>
            <Button
              onClick={addSubFolder}
              disabled={!selectedNode || operationInProgress}
              color="success"
            >
              Add Sub-Folder
            </Button>
          </div>
          {operationInProgress && (
            <div className="text-center mt-3">
              <Spinner color="primary" />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Index;
