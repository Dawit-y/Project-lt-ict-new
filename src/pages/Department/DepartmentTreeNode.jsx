import { useState, useRef, memo } from "react";
import { Collapse } from "reactstrap";
import { FaChevronDown, FaChevronRight, FaFolder } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const DepartmentTreeNode = ({
  node,
  onNodeClick,
  level = 0,
  onNodeExpand = () => {},
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const nodeRef = useRef();

  const handleClick = () => {
    document.querySelectorAll(".tree-node").forEach((el) => {
      el.classList.remove("bg-info-subtle");
    });
    nodeRef.current.classList.add("bg-info-subtle");
    onNodeClick(node);
    onNodeExpand(node);
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
              <FaChevronDown onClick={handleClick} />
            ) : (
              <FaChevronRight onClick={handleClick} />
            )}
          </span>
        ) : (
          <span className={`${node.level === "officer"}`}></span>
        )}
        {/* <span className="text-danger my-auto px-1" style={{ fontWeight: 900 }}>
          {node.level.charAt(0).toUpperCase()}
        </span> */}
        <FaFolder
          className="text-warning mx-1"
          style={{
            flexShrink: 0,
            width: "15px",
            height: "15px",
          }}
        />
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "250px",
            display: "inline-block",
            verticalAlign: "middle",
          }}
        >
          {lang === "en" && node.dep_name_en
            ? node.dep_name_en
            : lang === "am" && node.dep_name_am
            ? node.dep_name_am
            : node.name}
        </span>
      </div>

      {/* Collapse for child nodes */}
      <Collapse isOpen={isExpanded} className={`ms-2`}>
        {node.children &&
          node.children.map((childNode) => (
            <DepartmentTreeNode
              key={childNode.id}
              node={childNode}
              onNodeClick={onNodeClick}
              level={level + 1}
              onNodeExpand={onNodeExpand}
            />
          ))}
      </Collapse>
    </div>
  );
};

export default memo(DepartmentTreeNode);
