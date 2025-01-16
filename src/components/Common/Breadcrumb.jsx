import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Row, Col, BreadcrumbItem } from "reactstrap";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const Breadcrumb = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Function to generate breadcrumb items based on pathname
  const generateBreadcrumbs = () => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    if (pathParts.length === 0) {
      return [];
    }

    let accumulatedPath = "";
    for (let i = 0; i < pathParts.length; i++) {
      accumulatedPath += `/${pathParts[i]}`;

      let label = pathParts[i];
      if (label.toLowerCase() === "project" && i + 1 < pathParts.length) {
        breadcrumbs.push({
          path: accumulatedPath,
          label: "Project",
        });
        accumulatedPath += `/${pathParts[++i]}`;
        breadcrumbs.push({
          path: accumulatedPath,
          label: "Details",
        });
        continue;
      } else if (label.includes("_")) {
        label = label
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      } else {
        label = label.charAt(0).toUpperCase() + label.slice(1);
      }

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
              style={{ color: "#556ee6" }}
            >
              <IoArrowBackCircleOutline size={30} className="" />
            </Link>
            <h4 className="mb-0 font-size-18 align-middle">
              {breadcrumbs[breadcrumbs.length - 1]?.label || ""}
            </h4>
          </div>

          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              <BreadcrumbItem active>
                <Link
                  to="/dashboard"
                  className="d-flex align-items-center justify-content-center gap-1 text-decoration-none"
                >
                  <AiOutlineHome />
                  <span>{"Home"}</span>
                </Link>
              </BreadcrumbItem>
              {breadcrumbs.map((breadcrumb, index) => (
                <BreadcrumbItem
                  key={index}
                  active={index === breadcrumbs.length - 1}
                >
                  {index === breadcrumbs.length - 1 ? (
                    `${t(breadcrumb.label)}`
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
