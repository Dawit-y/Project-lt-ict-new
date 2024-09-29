import React, { useState } from "react";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
import Select from "react-select";

const Select2 = () => {

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedMulti, setSelectedMulti] = useState(null);
    const [selectedMulti1, setSelectedMulti1] = useState(null);
    const [selectedMulti2, setSelectedMulti2] = useState(null);
    const [selectedMulti3, setSelectedMulti3] = useState(null);

    const handleSelectGroup = (selectedGroup) => {
        setSelectedGroup(selectedGroup);
    }

    const handleMulti = (selectedMulti) => {
        setSelectedMulti(selectedMulti);
    }

    const handleMulti1 = (selectedMulti1) => {
        setSelectedMulti1(selectedMulti1);
    }

    const handleMulti2 = (selectedMulti2) => {
        setSelectedMulti2(selectedMulti2);
    }

    const handleMulti3 = (selectedMulti3) => {
        setSelectedMulti3(selectedMulti3);
    }


    const optionGroup = [
        {
            label: "Picnic",
            options: [
                { label: "Mustard", value: "Mustard" },
                { label: "Ketchup", value: "Ketchup" },
                { label: "Relish", value: "Relish" },
            ],
        },
        {
            label: "Camping",
            options: [
                { label: "Tent", value: "Tent" },
                { label: "Flashlight", value: "Flashlight" },
                { label: "Toilet Paper", value: "Toilet Paper" },
            ],
        },
    ];



    const optionGroup1 = [
        {
            label: "Picnic",
            options: [
                { label: "Mustard", value: "Mustard" },
                { label: "Ketchup", value: "Ketchup" },
                { label: "Relish", value: "Relish" },
            ],
        },
        {
            label: "Camping",
            options: [
                { label: "Tent", value: "Tent" },
                { label: "Flashlight", value: "Flashlight" },
                { label: "Toilet Paper", value: "Toilet Paper" },
            ],
        },
    ];

    const optionGroup2 = [
        {
            label: "Picnic",
            options: [
                { label: "Mustard", value: "Mustard" },
                { label: "Ketchup", value: "Ketchup" },
                { label: "Relish", value: "Relish" },
            ],
        },
        {
            label: "Camping",
            options: [
                { label: "Tent", value: "Tent" },
                { label: "Flashlight", value: "Flashlight" },
                { label: "Toilet Paper", value: "Toilet Paper" },
            ],
        },
    ];

    return (
        <React.Fragment>
            <Row>
                <Col lg="12">
                    <Card>
                        <CardBody>
                            <h4 className="card-title">Select2</h4>
                            <p className="card-title-desc">
                                A mobile and touch friendly input spinner component for
                                Bootstrap
                            </p>

                            <form>
                                <Row>
                                    <Col lg="6">
                                        <div className="mb-3">
                                            <Label>Single Select</Label>
                                            <Select
                                                value={selectedGroup}
                                                onChange={() => {
                                                    handleSelectGroup();
                                                }}
                                                options={optionGroup}
                                                className="select2-selection"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="control-label">
                                                Multiple Select
                                            </label>
                                            <Select
                                                value={selectedMulti}
                                                isMulti={true}
                                                onChange={() => {
                                                    handleMulti();
                                                }}
                                                options={optionGroup}
                                                className="select2-selection"
                                            />
                                        </div>

                                        <div>
                                            <Label>Search Disable</Label>
                                            <Select
                                                value={selectedMulti1}
                                                isMulti={true}
                                                onChange={() => {
                                                    handleMulti1();
                                                }}
                                                options={optionGroup}
                                                className="select2-selection"
                                            // isDisabled={true}
                                            />
                                        </div>
                                    </Col>

                                    <Col lg="6">
                                        <div className="mb-3 ajax-select mt-3 mt-lg-0 select2-container">
                                            <Label>Ajax (remote data)</Label>
                                            <Select
                                                value={selectedMulti2}
                                                onChange={() => {
                                                    handleMulti2();
                                                }}
                                                options={optionGroup1}
                                                className="select2-selection"
                                                isLoading={true}
                                            />
                                        </div>
                                        <div className="mb-3 templating-select select2-container">
                                            <label className="control-label">Templating</label>
                                            <Select
                                                value={selectedMulti3}
                                                onChange={() => {
                                                    handleMulti3();
                                                }}
                                                options={optionGroup2}
                                                className="select2-selection"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

        </React.Fragment>
    );
}

export default Select2;