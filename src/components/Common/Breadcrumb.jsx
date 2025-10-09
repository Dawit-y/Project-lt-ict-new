import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Row, Col, BreadcrumbItem } from "reactstrap";
import { FaArrowCircleLeft, FaHome } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Breadcrumb = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const generateBreadcrumbs = () => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    if (pathParts.length === 0) {
      return [];
    }

    let accumulatedPath = "";
    for (let i = 0; i < pathParts.length; i++) {
      const label = pathParts[i];

      // Skip numeric parts (e.g., IDs like 23)
      if (!isNaN(label)) {
        accumulatedPath += `/${label}`;
        continue;
      }

      accumulatedPath += `/${label}`;

      // Special case for `/Project/:id` to add "Details"
      if (
        label.toLowerCase() === "project" &&
        i + 1 < pathParts.length &&
        !isNaN(pathParts[i + 1]) && // Ensure the next part is numeric
        i + 2 === pathParts.length // Ensure no further segments
      ) {
        breadcrumbs.push({
          path: accumulatedPath,
          label: "project",
        });
        breadcrumbs.push({
          path: accumulatedPath,
          label: "details",
        });
        break;
      }

      // Special case for `/budget_request_approval/:id` to add "Details"
      if (
        label.toLowerCase() === "budget_request_approval" &&
        i + 1 < pathParts.length &&
        !isNaN(pathParts[i + 1]) && // Ensure the next part is numeric
        i + 2 === pathParts.length // Ensure no further segments
      ) {
        breadcrumbs.push({
          path: accumulatedPath,
          label: "budget_request_approval",
        });
        breadcrumbs.push({
          path: accumulatedPath,
          label: "details",
        });
        break;
      }

      // Add other meaningful parts as breadcrumbs
      breadcrumbs.push({
        path: accumulatedPath,
        label,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <Link
              onClick={() => navigate(-1)}
              className="d-flex align-items-center justify-content-center"
            >
              <FaArrowCircleLeft color="primary" size={25} className="" />
            </Link>
            <h4 className="mb-0 font-size-18 align-middle">
              {t(`${breadcrumbs[breadcrumbs.length - 1]?.label}`) || ""}
            </h4>
          </div>

          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              <BreadcrumbItem active>
                <Link
                  to="/dashboard"
                  className="d-flex align-items-center justify-content-center gap-1 text-decoration-none"
                >
                  <FaHome />
                  <span>{t("home_page")}</span>
                </Link>
              </BreadcrumbItem>
              {breadcrumbs.map((breadcrumb, index) => (
                <BreadcrumbItem
                  key={index}
                  active={index === breadcrumbs.length - 1}
                >
                  {index === breadcrumbs.length - 1 ? (
                    t(`${breadcrumb.label}`)
                  ) : (
                    <Link to={breadcrumb.path}>{t(`${breadcrumb.label}`)}</Link>
                  )}
                </BreadcrumbItem>
              ))}
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Breadcrumb;
