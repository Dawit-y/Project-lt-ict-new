import React, { useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import Switch from "react-switch";

const OffSymbol = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: 12,
                color: "#fff",
                paddingRight: 2,
            }}
        >
            {" "}
            No
        </div>
    );
};

const OnSymbol = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: 12,
                color: "#fff",
                paddingRight: 2,
            }}
        >
            {" "}
            Yes
        </div>
    );
};

const CssSwitch = () => {

    const [switch1, setSwitch1] = useState(true);
    const [switch2, setSwitch2] = useState(true);
    const [switch3, setSwitch3] = useState(true);
    const [switch4, setSwitch4] = useState(true);
    const [switch5, setSwitch5] = useState(true);
    const [switch6, setSwitch6] = useState(true);
    const [switch7, setSwitch7] = useState(true);
    const [switch8, setSwitch8] = useState(true);
    const [switch9, setSwitch9] = useState(true);

    const [sq1, setSq1] = useState(true);
    const [sq2, setSq2] = useState(true);
    const [sq3, setSq3] = useState(true)

    return (
        <React.Fragment>
            <Row>
                <Col lg="12">
                    <Card>
                        <CardBody>
                            <h4 className="card-title">Css Switch</h4>
                            <p className="card-title-desc">
                                Here are a few types of switches.{" "}
                            </p>

                            <Row>
                                <Col lg="6">
                                    <h5 className="font-size-14 mb-3">Example switch</h5>
                                    <div>
                                        <Switch
                                            uncheckedIcon={<OffSymbol />}
                                            checkedIcon={<OnSymbol />}
                                            className="me-1 mb-sm-8 mb-2"
                                            onColor="#626ed4"
                                            onChange={() => {
                                                setSwitch1(!switch1);
                                            }}
                                            checked={switch1}
                                        />
                                        <Switch
                                            uncheckedIcon={<OffSymbol />}
                                            checkedIcon={<OnSymbol />}
                                            className="me-1 mb-sm-8 mb-2"
                                            onColor="#a2a2a2"
                                            onChange={() => {
                                                setSwitch2(!switch2);
                                            }}
                                            checked={switch2}
                                        />
                                        <Switch
                                            uncheckedIcon={<OffSymbol />}
                                            checkedIcon={<OnSymbol />}
                                            className="me-1 mb-sm-8 mb-2"
                                            onColor="#02a499"
                                            onChange={() => {
                                                setSwitch3(!switch3);
                                            }}
                                            checked={switch3}
                                        />
                                        <Switch
                                            uncheckedIcon={<OffSymbol />}
                                            checkedIcon={<OnSymbol />}
                                            className="me-1 mb-sm-8 mb-2"
                                            onColor="#626ed4"
                                            onChange={() => {
                                                setSwitch4(!switch4);
                                            }}
                                            checked={switch4}
                                        />

                                        <Switch
                                            uncheckedIcon={<OffSymbol />}
                                            checkedIcon={<OnSymbol />}
                                            className="me-1 mb-sm-8 mb-2"
                                            onColor="#02a499"
                                            onChange={() => {
                                                setSwitch5(!switch5);
                                            }}
                                            checked={switch5}
                                        />

                                        <Switch
                                            uncheckedIcon={<OffSymbol />}
                                            checkedIcon={<OnSymbol />}
                                            className="me-1 mb-sm-8 mb-2"
                                            onColor="#38a4f8"
                                            onChange={() => {
                                                setSwitch6(!switch6);
                                            }}
                                            checked={switch6}
                                        />

                                        <Switch
                                            uncheckedIcon={<OffSymbol />}
                                            checkedIcon={<OnSymbol />}
                                            className="me-1 mb-sm-8 mb-2"
                                            onColor="#f8b425"
                                            onChange={() => {
                                                setSwitch7(!switch7);
                                            }}
                                            checked={switch7}
                                        />

                                        <Switch
                                            uncheckedIcon={<OffSymbol />}
                                            checkedIcon={<OnSymbol />}
                                            className="me-1 mb-sm-8 mb-2"
                                            onColor="#ec4561"
                                            onChange={() => {
                                                setSwitch8(!switch8);
                                            }}
                                            checked={switch8}
                                        />

                                        <Switch
                                            uncheckedIcon={<OffSymbol />}
                                            checkedIcon={<OnSymbol />}
                                            className="me-1 mb-sm-8 mb-2"
                                            onColor="#2a3142"
                                            onChange={() => {
                                                setSwitch9(!switch9);
                                            }}
                                            checked={switch9}
                                        />
                                    </div>
                                </Col>

                                <Col lg="6">
                                    <div className="mt-4 mt-lg-0">
                                        <h5 className="font-size-14 mb-3">Square switch</h5>
                                        <div className="d-flex">
                                            <div className="square-switch">
                                                <input
                                                    type="checkbox"
                                                    id="square-switch1"
                                                    className="switch"
                                                    defaultChecked={sq1}
                                                    onChange={() =>
                                                        setSq1(!sq1)
                                                    }
                                                />
                                                <label
                                                    htmlFor="square-switch1"
                                                    data-on-label="On"
                                                    data-off-label="Off"
                                                />
                                            </div>
                                            <div className="square-switch">
                                                <input
                                                    type="checkbox"
                                                    id="square-switch2"
                                                    className="switch switch-info"
                                                    defaultChecked={sq2}
                                                    onChange={() =>
                                                        setSq2(!sq2)
                                                    }
                                                />
                                                <label
                                                    htmlFor="square-switch2"
                                                    data-on-label="Yes"
                                                    data-off-label="No"
                                                />
                                            </div>
                                            <div className="square-switch">
                                                <input
                                                    type="checkbox"
                                                    id="square-switch3"
                                                    className="switch switch-bool"
                                                    defaultChecked={sq3}
                                                    onChange={() =>
                                                        setSq3(!sq3)
                                                    }
                                                />
                                                <label
                                                    htmlFor="square-switch3"
                                                    data-on-label="Yes"
                                                    data-off-label="No"
                                                />
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

export default CssSwitch;