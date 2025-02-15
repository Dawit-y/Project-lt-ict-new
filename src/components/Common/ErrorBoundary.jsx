import React from "react";
import { FaRedo, FaExclamationCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { Card, CardBody } from "reactstrap"
import { useTranslation } from "react-i18next";

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
    const t = this.props.t
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
          }}>
          <Card>
            <CardBody className="text-center">
              <FaExclamationCircle size={60} className="text-danger mb-3" />
              <>
                <h2 className="h4 text-danger mb-3">{t("Something went wrong")}</h2>
              </>
              <button
                onClick={this.resetErrorBoundary}
                className="btn btn-primary btn-lg"
              >
                <>
                  <FaRedo />
                  <span className="ms-2">{t("try_again")}</span>
                </>
              </button>
            </CardBody>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ErrorBoundaryWrapper(props) {
  const location = useLocation();
  const { t } = useTranslation()
  return <ErrorBoundary {...props} location={location} t={t} />;
}