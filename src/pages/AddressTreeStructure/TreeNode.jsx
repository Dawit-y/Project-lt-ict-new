import { useState, useRef } from "react";
import { Collapse } from "reactstrap";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { HiOutlineFolder } from "react-icons/hi";

const TreeNode = ({ node, onNodeClick, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const nodeRef = useRef();

  const handleClick = () => {
    document.querySelectorAll(".tree-node").forEach((el) => {
      el.classList.remove("bg-info-subtle");
    });
    nodeRef.current.classList.add("bg-info-subtle");
    onNodeClick(node);
  };
  return (
    <div
      className="position-relative ms-3 py-1"
      style={{ marginLeft: level * 20 }}
    >
      {/* Draw lines to show hierarchy */}
      {level > 0 && (
        <>
          <div
            className="position-absolute"
            style={{
              top: 0,
              left: "-10px",
              height: "100%",
              borderLeft: "1px solid #74788d",
              zIndex: 0,
            }}
          ></div>
          <div
            className="position-absolute"
            style={{
              top: "50%",
              left: "-10px",
              width: "10px",
              borderTop: "1px solid #74788d",
              zIndex: 0,
            }}
          ></div>
        </>
      )}

      {/* Tree node display */}
      <div
        ref={nodeRef}
        onClick={() => {
          toggleExpand();
          onNodeClick(node);
          handleClick();
        }}
        onDoubleClick={toggleExpand}
        className={`tree-node d-flex align-items-center position-relative p-2 rounded`}
        style={{
          cursor: "pointer",
          transition: "background-color 0.2s ease-out, box-shadow 0.3s",
          zIndex: 1,
        }}
      >
        {node.children && node.children.length > 0 ? (
          <span onClick={toggleExpand} className="me-1">
            {isExpanded ? (
              <FaChevronDown onClick={() => onNodeClick(node)} />
            ) : (
              <FaChevronRight onClick={() => onNodeClick(node)} />
            )}
          </span>
        ) : (
          <span className="me-3"></span>
        )}
        <HiOutlineFolder className="text-warning mx-1" />
        <span>{node.name}</span>
      </div>

      {/* Collapse for child nodes */}
      <Collapse isOpen={isExpanded} className="ms-2">
        {node.children &&
          node.children.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              onNodeClick={onNodeClick}
              level={level + 1}
            />
          ))}
      </Collapse>
    </div>
  );
};

export default TreeNode;
