import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { Row } from "reactstrap";

const Paginations = ({ perPageData, data, currentPage, setCurrentPage, isShowingPageLength, paginationDiv, paginationClass }) => {

    //pagination

    const handleClick = (e) => {
        setCurrentPage(Number(e.target.id));
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data?.length / perPageData); i++) {
        pageNumbers.push(i);
    }
    const handleprevPage = () => {
        let prevPage = currentPage - 1;
        setCurrentPage(prevPage);
    };
    const handlenextPage = (event) => {
        event.preventDefault();
        let nextPage = currentPage + 1;
        setCurrentPage(nextPage);
    };

    useEffect(() => {
        if (pageNumbers.length && pageNumbers.length < currentPage) {
            setCurrentPage(pageNumbers.length)
        }
    }, [pageNumbers.length, currentPage, setCurrentPage])

    return (
        <React.Fragment>
            <Row className="justify-content-between align-items-center">
                {isShowingPageLength && <div className="col-sm">
                    <div className="text-muted">Showing <span className="fw-semibold">{perPageData}</span> of <span className="fw-semibold">{data?.length}</span> entries</div>
                </div>}
                <div className={paginationDiv}>
                    <ul className={paginationClass}>
                        <li className={`page-item ${currentPage <= 1 ? "disabled" : ''}`}>
                            <Link className="page-link" to="#" onClick={() => handleprevPage()}>
                                <i className="mdi mdi-chevron-left"></i>
                            </Link>
                        </li>
                        {(pageNumbers || []).map((item, index) => (
                            <li className={currentPage === item ? "page-item active " : "page-item"} key={index}>
                                <Link className="page-link" to="#" id={item} onClick={(e) => handleClick(e)}>
                                    {item}
                                </Link>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage > 1 ? "disabled" : ''}`}>
                            <Link className="page-link" to="#" onClick={(e) => handlenextPage(e)}>
                                <i className="mdi mdi-chevron-right"></i>
                            </Link>
                        </li>
                    </ul>
                </div>
            </Row>
        </React.Fragment>
    );
}

export default Paginations;