import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Using react-icons for icons
const CollapsibleDiv = ({
  leftContent,
  rightContent,
  initialLeftWidth = "18%", // Default initial width
  collapsedWidth = "0", // Width when collapsed
  leftPanelStyle = {}, // Custom styles for the left panel
  rightPanelStyle = {}, // Custom styles for the right panel
  buttonStyle = {}, // Custom styles for the toggle button
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [prevWidth, setPrevWidth] = useState(initialLeftWidth); // Store the previous width

  // Toggle collapse/expand
  const toggleCollapse = () => {
    if (isCollapsed) {
      // Expand to the previous width
      setIsCollapsed(false);
    } else {
      // Collapse to 0 width
      setPrevWidth(leftWidth); // Save the current width
      setIsCollapsed(true);
    }
  };
  // Dynamic width for the left panel
  const leftWidth = isCollapsed ? collapsedWidth : prevWidth;
  return (
    <div class="w-100 d-flex gap-2">
      {/* Left Panel */}
      <div
        style={{
          width: leftWidth,
          height: "100%",
          overflow: "hidden",
          transition: "width 0.3s ease", // Smooth transition
          ...leftPanelStyle, // Apply custom styles
        }}
      >
        {leftContent}
      </div>
      {/* Toggle Button */}
      <button
        className="btn btn-soft-primary"
        onClick={toggleCollapse}
        style={{
          position: "absolute",
          left: isCollapsed ? "0" : `calc(${leftWidth} - 40px)`, // Position the button
          top: "225px",
          transform: "translateY(-50%)",
          border: "none",
          padding: "10px",
          cursor: "pointer",
          zIndex: 1,
          transition: "left 0.3s ease", // Smooth transition for button movement
          ...buttonStyle, // Apply custom styles
        }}
      >
        {isCollapsed ? <FaArrowRight /> : <FaArrowLeft />} {/* Toggle icon */}
      </button>
      {/* Right Panel */}
      <div
        style={{
          flex: 1,
          height: "100%",
          ...rightPanelStyle, // Apply custom styles
        }}
      >
        {rightContent}
      </div>
    </div>
  );
};
export default CollapsibleDiv;
