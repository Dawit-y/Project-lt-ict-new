import React from "react";
import { Card, CardBody, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { archiveData, categoriesData, popularPosts, tagsData } from "../../../common/data";


const RightBar = () => {
  return (
    <React.Fragment>
      <Col xl={3} lg={4}>
        <Card>
          <CardBody className="p-4">
            <div className="search-box">
              <p className="text-muted">Search</p>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control rounded bg-light border-light"
                  placeholder="Search..."
                />
                <i className="mdi mdi-magnify search-icon"></i>
              </div>
            </div>

            <hr className="my-4" />

            <div>
              <p className="text-muted">Categories</p>

              <ul className="list-unstyled fw-medium">
                {
                  (categoriesData || []).map((item, index) => (
                    <li key={index}>
                      <Link to="#" className="text-muted py-2 d-block">
                        <i className={`${item.icon} me-1`}></i> {item.text}
                        {
                          item.badge && (
                            <span className={`badge ${item.badge.color} rounded-pill float-end ms-1 font-size-12`}>
                              {item.badge.text}
                            </span>
                          )
                        }
                      </Link>
                    </li>
                  ))
                }
              </ul>
            </div>

            <hr className="my-4" />

            <div>
              <p className="text-muted">Archive</p>

              <ul className="list-unstyled fw-medium">
                {(archiveData || []).map((item, index) => (
                  <li key={index}>
                    <Link to="#" className="text-muted py-2 d-block">
                      <i className="mdi mdi-chevron-right me-1"></i> {item.year}{" "}
                      <span className="badge badge-soft-success rounded-pill float-end ms-1 font-size-12">
                        {item.badgeCount}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="my-4" />

            <div>
              <p className="text-muted mb-2">Popular Posts</p>

              <div className="list-group list-group-flush">
                {(popularPosts || []).map((item, index) => (
                  <Link to="#" className="list-group-item text-muted py-3 px-2" key={index}>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <img
                          src={item.imageSrc}
                          alt=""
                          className="avatar-md h-auto d-block rounded"
                        />
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-size-13 text-truncate">{item.title}</h5>
                        <p className="mb-0 text-truncate">{item.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <hr className="my-4" />

            <div>
              <p className="text-muted mb-1">Tags</p>

              <ul className="list-inline widget-tag">
                {
                  (tagsData || []).map((item) => (
                    <li className="list-inline-item" key={item.id}>
                      <Link to="#" className="badge bg-light font-size-12 mt-2">
                        {item.name}
                      </Link>
                    </li>
                  ))
                }
              </ul>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default RightBar
