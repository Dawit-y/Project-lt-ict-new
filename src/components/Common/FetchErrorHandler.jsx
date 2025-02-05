import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaRedo,
  FaExclamationCircle,
  FaNetworkWired,
  FaServer,
  FaLock,
} from "react-icons/fa";
import { Card, CardBody } from "reactstrap";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const RETRYABLE_STATUS_CODES = [408, 502, 503, 504];

const FetchErrorHandler = ({
  error,
  refetch,
  retryButtonText = "Retry",
  retryButtonIcon = <FaRedo />,
  showErrorDetails = false,
  logError = false,
}) => {
  const { t } = useTranslation();
  const [isRefetching, setIsRefetching] = useState(false);

  const handleRefetch = async () => {
    if (!navigator.onLine) {
      toast.error(
        t("You are offline. Please check your internet connection."),
        { autoClose: 2000 }
      );
      return;
    }

    setIsRefetching(true);
    try {
      await refetch();
    } catch (err) {
      if (logError) {
        console.error("Error during refetch:", err);
      }
    } finally {
      setIsRefetching(false);
    }
  };

  if (!error) return null;

  const renderErrorDetails = () => {
    if (!showErrorDetails) return null;
    return (
      <div className="mt-3 text-muted">
        <p className="mb-1">
          <strong>{t("Error Message")}:</strong> {error.message}
        </p>
        {error.response && (
          <p className="mb-0">
            <strong>{t("Status Code")}:</strong> {error.response.status}
          </p>
        )}
      </div>
    );
  };

  const shouldAllowRetry =
    !error.response || RETRYABLE_STATUS_CODES.includes(error.response.status);

  const renderFallbackUI = () => {
    let errorIcon = (
      <FaExclamationCircle size={60} className="text-danger mb-3" />
    );
    let errorTitle = t("An error occurred");
    let errorMessage = t("Something went wrong. Please try again later.");

    if (error.request && !error.response) {
      // Network error (no response from server)
      errorIcon = <FaNetworkWired size={60} className="text-danger mb-3" />;
      errorTitle = t("Network Error");
      errorMessage = t("Please check your internet connection and try again.");
    } else if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 400:
          errorTitle = t("Bad Request");
          errorMessage = t("The request could not be processed.");
          break;
        case 401:
          errorIcon = <FaLock size={60} className="text-warning mb-3" />;
          errorTitle = t("Unauthorized");
          errorMessage = t("You must be authenticated.");
          break;
        case 403:
          errorIcon = <FaLock size={60} className="text-warning mb-3" />;
          errorTitle = t("Forbidden");
          errorMessage = t("You don't have permission.");
          break;
        case 404:
          errorTitle = t("Not Found");
          errorMessage = t("The requested resource was not found.");
          break;
        case 429:
          errorTitle = t("Too Many Requests");
          errorMessage = t("You've made too many requests. Try again later.");
          break;
        case 500:
          errorIcon = <FaServer size={60} className="text-danger mb-3" />;
          errorTitle = t("Server Error");
          errorMessage = t("Something went wrong on our end.");
          break;
        case 502:
          errorTitle = t("Bad Gateway");
          errorMessage = t("Server received an invalid response.");
          break;
        case 503:
          errorTitle = t("Service Unavailable");
          errorMessage = t("Server is temporarily unavailable.");
          break;
        case 504:
          errorTitle = t("Gateway Timeout");
          errorMessage = t("Server did not respond in time.");
          break;
        default:
          break;
      }
    }

    return (
      <Card>
        <CardBody className="text-center">
          {errorIcon}
          <h2 className="h3 text-danger mb-3">{errorTitle}</h2>
          <p className="lead text-muted mb-4">{errorMessage}</p>

          {shouldAllowRetry && (
            <button
              onClick={handleRefetch}
              className="btn btn-primary btn-lg"
              disabled={isRefetching}
            >
              {isRefetching ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <>
                  {retryButtonIcon}
                  <span className="ms-2">{t(retryButtonText)}</span>
                </>
              )}
            </button>
          )}

          {renderErrorDetails()}
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      {renderFallbackUI()}
    </div>
  );
};

FetchErrorHandler.propTypes = {
  error: PropTypes.object,
  refetch: PropTypes.func.isRequired,
  retryButtonText: PropTypes.string,
  retryButtonIcon: PropTypes.element,
  showErrorDetails: PropTypes.bool,
  logError: PropTypes.bool,
};

export default FetchErrorHandler;
