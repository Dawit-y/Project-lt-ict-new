import React from "react";
import { LiaRedoAltSolid } from "react-icons/lia";
import { useLocation } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      this.resetErrorBoundary();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className=""
          style={{
            width: "100wh",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="d-flex flex-column">
            <h6 className="text-danger mb-1">{"Something went wrong"}</h6>
            <button
              onClick={this.resetErrorBoundary}
              className="btn btn-secondary"
            >
              <LiaRedoAltSolid />
              <span className="ms-2">{"Try again"}</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ErrorBoundaryWrapper(props) {
  const location = useLocation();
  return <ErrorBoundary {...props} location={location} />;
}
