import React, { useRef, useState } from "react";
import { Card, CardBody, Col, Input, InputGroup, Row } from "reactstrap";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const DatePicker = () => {

    const [date, setDate] = useState("");
    const [formate_date, setFormatDate] = useState("");
    const [current_month, setMonth] = useState("");
    const [current_month_short, setMonthShort] = useState("");
    const [current_day, setDay] = useState("");
    const [current_day_short, setDayShort] = useState("");
    const [current_day_min, setDayMin] = useState("");
    const [pick_date, setPickDate] = useState("");


    const getDateMethod = () => {
        setDate(new Date());
    };
    const getDateFormateMethod = () => {
        let today = new Date();
        const dd = today.getDate().toString();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();
        const formate_date = (today = dd + "/" + mm + "/" + yyyy);
        setFormatDate(formate_date);
    };
    const getMonthMethod = () => {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        const d = new Date();
        const current_month = months[d.getMonth()];
        setMonth(current_month);
    };

    const getMonthShortMethod = () => {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const d = new Date();
        const current_month_short = months[d.getMonth()];
        setMonthShort(current_month_short);
    };

    const getDayMethod = () => {
        const day = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        const d = new Date();
        const current_day = day[d.getDay()];
        setDay(current_day);
    };

    const getDayShort = () => {
        const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const d = new Date();
        const current_day_short = day[d.getDay()];
        setDayShort(current_day_short);
    };

    const getDayMin = () => {
        const day = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        const d = new Date();
        const current_day_min = day[d.getDay()];
        setDayMin(current_day_min);
    };

    const picks = () => {
        setPickDate(new Date());
    };

    const resentValue = () => {
        setPickDate(" ");
    };

    const flatpickrRef = useRef(null);

    const showValue = () => {
        if (flatpickrRef.current) {
            flatpickrRef.current.flatpickr.open();
        }
    }

    const closeValue = () => {
        if (flatpickrRef.current) {
            flatpickrRef.current.flatpickr.close();
        }
    }

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <Card>
                        <CardBody>
                            <h4 className="card-title mb-4">Datepicker</h4>
                            <Row>
                                <Col xl={3}>
                                    <div>
                                        <h4 className="font-size-14 mb-3">Demo</h4>
                                        <div className="docs-datepicker">
                                            <InputGroup>
                                                <Flatpickr
                                                    ref={flatpickrRef}
                                                    id="DataPicker"
                                                    value={Date.parse(pick_date)}
                                                    className="form-control d-block"
                                                    placeholder="Pick a date"
                                                    options={{
                                                        altInput: true,
                                                        dateFormat: "d-m-y"
                                                    }}
                                                />
                                                <div className="input-group-append">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary docs-datepicker-trigger"
                                                        disabled
                                                    >
                                                        <i
                                                            className="fa fa-calendar"
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                </div>
                                            </InputGroup>
                                            <div className="docs-datepicker-container" />
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={3}>
                                    <div className="mt-4 mt-xl-0">
                                        <h4 className="font-size-14 mb-3">Options</h4>
                                        <div className="docs-options">
                                            <div className="input-group mb-3">
                                                <span className="input-group-text" id="option-date">date</span>
                                                <Input type="text" name="date" defaultValue="" aria-describedby="option-date" placeholder="null" />
                                            </div>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text" id="option-format">format</span>
                                                <Input type="text" name="format" defaultValue="mm/dd/yyyy" aria-describedby="option-format" placeholder="mm/dd/yyyy" />
                                            </div>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text" id="option-startDate">startDate</span>
                                                <Input type="text" name="startDate" aria-describedby="option-startDate" placeholder="null" />
                                            </div>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text" id="option-endDate">endDate</span>
                                                <Input type="text" name="endDate" aria-describedby="option-endDate" placeholder="null" />
                                            </div>

                                            <div className="input-group mb-3">
                                                <span className="input-group-text" id="option-startView">startView</span>
                                                <select className="form-control" id="option-startView" name="startView">
                                                    <option defaultValue="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                </select>
                                            </div>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text" id="option-weekStart">weekStart</span>
                                                <select className="form-control" id="option-weekStart" name="weekStart">
                                                    <option defaultValue="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                </select>
                                            </div>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text" id="option-offset">offset</span>
                                                <Input type="number" name="offset" defaultValue="10" aria-describedby="option-offset" placeholder="offset" />
                                            </div>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text" id="option-zIndex">zIndex</span>
                                                <Input type="number" name="zIndex" defaultValue="1000" aria-describedby="option-zIndex" placeholder="zIndex" />
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                <Col xl={3} sm={6}>
                                    <div className="mt-4 mt-xl-0">
                                        <h4 className="font-size-14 mb-3">Toggles</h4>
                                        <div className="docs-toggles">
                                            <ul className="list-group">
                                                <li className="list-group-item">
                                                    <div className="form-check">
                                                        <input className="form-check-input" id="container" type="checkbox" name="container" />
                                                        <label className="form-check-label" htmlFor="container">container</label>
                                                    </div>
                                                </li>
                                                <li className="list-group-item">
                                                    <div className="form-check">
                                                        <input className="form-check-input" id="trigger" type="checkbox" name="trigger" />
                                                        <label className="form-check-label" htmlFor="trigger">trigger</label>
                                                    </div>
                                                </li>
                                                <li className="list-group-item">
                                                    <div className="form-check">
                                                        <input className="form-check-input" id="inline" type="checkbox" name="inline" />
                                                        <label className="form-check-label" htmlFor="inline">inline</label>
                                                    </div>
                                                </li>
                                                <li className="list-group-item">
                                                    <div className="form-check">
                                                        <input className="form-check-input" id="autoShow" type="checkbox" name="autoShow" />
                                                        <label className="form-check-label" htmlFor="autoShow">autoShow</label>
                                                    </div>
                                                </li>
                                                <li className="list-group-item">
                                                    <div className="form-check">
                                                        <input className="form-check-input" id="autoHide" type="checkbox" name="autoHide" />
                                                        <label className="form-check-label" htmlFor="autoHide">autoHide</label>
                                                    </div>
                                                </li>
                                                <li className="list-group-item">
                                                    <div className="form-check">
                                                        <input className="form-check-input" id="autoPick" type="checkbox" name="autoPick" />
                                                        <label className="form-check-label" htmlFor="autoPick">autoPick</label>
                                                    </div>
                                                </li>
                                                <li className="list-group-item">
                                                    <div className="form-check">
                                                        <input className="form-check-input" id="yearFirst" type="checkbox" name="yearFirst" />
                                                        <label className="form-check-label" htmlFor="yearFirst">yearFirst</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </Col>

                                <Col xl={3} sm={6}>
                                    <div className="mt-4 mt-xl-0">
                                        <h4 className="font-size-14 mb-3">Methods</h4>
                                        <div className="docs-actions">
                                            <InputGroup className="mb-3">
                                                <div className="input-group-prepend">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={getDateMethod}
                                                    >
                                                        Get Date
                                                    </button>
                                                </div>
                                                <Input
                                                    defaultValue={date}
                                                    className="form-control"
                                                />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <div className="input-group-prepend">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={getDateFormateMethod}
                                                    >
                                                        Get Date (formatted)
                                                    </button>
                                                </div>
                                                <Input
                                                    defaultValue={formate_date}
                                                    className="form-control"
                                                />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <div className="input-group-prepend">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={getMonthMethod}
                                                    >
                                                        Get Month Name
                                                    </button>
                                                </div>
                                                <Input
                                                    defaultValue={current_month || ""}
                                                    type="text"
                                                    className="form-control"
                                                    id="putMonthName"
                                                />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <div className="input-group-prepend">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={getMonthShortMethod}
                                                    >
                                                        Get Month Name (short)
                                                    </button>
                                                </div>
                                                <Input
                                                    defaultValue={current_month_short || ""}
                                                    type="text"
                                                    className="form-control"
                                                    id="putMonthNameShort"
                                                />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <div className="input-group-prepend">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={getDayMethod}
                                                    >
                                                        Get Day Name
                                                    </button>
                                                </div>
                                                <Input
                                                    defaultValue={current_day || ""}
                                                    type="text"
                                                    className="form-control"
                                                    id="putDayName"
                                                />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <div className="input-group-prepend">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={getDayShort}
                                                    >
                                                        Get Day Name (short)
                                                    </button>
                                                </div>
                                                <Input
                                                    defaultValue={current_day_short || ""}
                                                    type="text"
                                                    className="form-control"
                                                    id="putDayNameShort"
                                                />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <div className="input-group-prepend">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={getDayMin}
                                                    >
                                                        Get Day Name (min)
                                                    </button>
                                                </div>
                                                <Input
                                                    defaultValue={current_day_min || ""}
                                                    type="text"
                                                    className="form-control"
                                                    id="putDayNameMin"
                                                />
                                            </InputGroup>
                                            <div className="btn-group mb-3 d-flex" role="group">
                                                <button type="button" className="btn btn-primary" onClick={showValue}>Show</button>
                                                <button type="button" className="btn btn-primary" onClick={closeValue}>Hide</button>
                                            </div>
                                            <div className="btn-group mb-3 d-flex" role="group">
                                                <button type="button" className="btn btn-primary" onClick={picks}>Pick</button>
                                                <button type="button" className="btn btn-primary" onClick={showValue}>Update</button>
                                            </div>
                                            <div className="btn-group mb-3 d-flex" role="group">
                                                <button type="button" className="btn btn-primary" onClick={resentValue}>Reset</button>
                                                <button type="button" className="btn btn-primary" data-method="destroy">Destroy</button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default DatePicker