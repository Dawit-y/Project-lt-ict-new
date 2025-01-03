import React from "react";
import { useTranslation } from "react-i18next";
import { LiaRedoAltSolid } from "react-icons/lia";
import { toast } from "react-toastify";

const FetchErrorHandler = ({ error, refetch }) => {
  const { t } = useTranslation();
  const handleRefetch = () => {
    if (!navigator.onLine) {
      toast.error(
        t("You are offline. Please check your internet connection."),
        {
          autoClose: 2000,
        }
      );
      return;
    }
    refetch();
  };

  if (!error) return null;

  return (
    <div
      style={{
        width: "100wh",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="d-flex flex-column">
        <h6 className="text-danger mb-1">
          {t("Error occurred while fetching")}
        </h6>
        <button onClick={handleRefetch} className="btn btn-secondary">
          <LiaRedoAltSolid />
          <span className="ms-2">{t("Retry")}</span>
        </button>
      </div>
    </div>
  );
};

export default FetchErrorHandler;
