import React, { useState, useEffect } from "react";

const ResizableLayout = () => {
  const [leftWidth, setLeftWidth] = useState(30); // Initial width in percentage
  const [isDragging, setIsDragging] = useState(false);

  // Handle mouse down event to start dragging
  const handleMouseDown = () => {
    setIsDragging(true);
    document.body.style.userSelect = "none"; // Prevent text selection during dragging
  };

  // Handle mouse move event to update widths
  const handleMouseMove = (e) => {
    if (isDragging) {
      const containerWidth = e.currentTarget.parentElement.offsetWidth;
      const newLeftWidth = (e.clientX / containerWidth) * 100;
      setLeftWidth(Math.min(newLeftWidth)); // Clamp width between 20% and 80%
    }
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = "auto"; // Re-enable text selection
  };

  // Add event listeners for mouse move and mouse up
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        const container = document.querySelector(".resizable-container");
        const containerWidth = container.offsetWidth;
        const newLeftWidth = (e.clientX / containerWidth) * 100;
        setLeftWidth(Math.min(newLeftWidth)); // Clamp width between 20% and 80%
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.userSelect = "auto"; // Re-enable text selection
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="resizable-container d-flex"
      style={{ height: "100vh", position: "relative" }}
    >
      {/* Left Panel */}
      <div
        className="left-panel"
        style={{
          width: `${leftWidth}%`,
          height: "100%",
          backgroundColor: "#f0f0f0",
          overflow: "auto",
        }}
      >
        <h2>Left Panel</h2>
        <p>Resizable content goes here.</p>
      </div>

      {/* Divider */}
      <div
        className="divider"
        style={{
          width: "10px",
          height: "100%",
          backgroundColor: isDragging ? "#aaa" : "#ccc", // Change color when dragging
          cursor: "col-resize",
          transition: "background-color 0.2s", // Smooth transition for hover effect
        }}
        onMouseDown={handleMouseDown}
      />

      {/* Right Panel */}
      <div
        className="right-panel"
        style={{
          width: `${100 - leftWidth}%`,
          height: "100%",
          backgroundColor: "#e0e0e0",
          overflow: "auto",
        }}
      >
        <h2>Right Panel</h2>
        <p>Resizable content goes here.</p>
      </div>
    </div>
  );
};

export default ResizableLayout;