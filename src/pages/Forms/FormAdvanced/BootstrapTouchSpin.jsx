import React, { useState } from "react";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, InputGroup, Label } from "reactstrap";

const BootstrapTouchSpin = () => {

    const [data_attr, setData_attr] = useState(56);
    const [postfix, setPostfix] = useState(20);
    const [withPostfix, setWithPostfix] = useState(20);
    const [empty_val, setEmpty_val] = useState(0);
    const [not_attr, setNot_attr] = useState(15);
    const [explicit_val, setExplicit_val] = useState(33);

    return (
        <React.Fragment>
            <Col xl="6">
                <Card>
                    <CardBody>
                        <h4 className="card-title">Bootstrap TouchSpin</h4>
                        <p className="card-title-desc">
                            A mobile and touch friendly input spinner component for
                            Bootstrap
                        </p>
                        <Form>
                            <div className="mb-3">
                                <Label>Using data attributes</Label>
                                <InputGroup>
                                    <div
                                        className="input-group-append"
                                        onClick={() => {
                                            setData_attr(data_attr - 1);
                                        }}
                                    >
                                        <Button type="button" color="primary">
                                            <i className="mdi mdi-minus" />
                                        </Button>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={data_attr}
                                        placeholder="number"
                                        readOnly
                                    />
                                    <div
                                        className="input-group-append"
                                        onClick={() => {
                                            setData_attr(data_attr + 1);
                                        }}
                                    >
                                        <Button type="button" color="primary">
                                            <i className="mdi mdi-plus" />
                                        </Button>
                                    </div>
                                </InputGroup>
                            </div>
                            <div className="mb-3">
                                <Label>Example with postfix (large)</Label>
                                <InputGroup>
                                    <span
                                        className="input-group-btn input-group-prepend"
                                        onClick={() => {
                                            setPostfix(postfix - 1);
                                        }}
                                    >
                                        <Button type="button" color="primary">
                                            <i className="mdi mdi-minus" />
                                        </Button>
                                    </span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={postfix}
                                        placeholder="number"
                                        readOnly
                                    />
                                    <span className="input-group-append">
                                        <span className="input-group-text">%</span>
                                    </span>
                                    <span className="input-group-append">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setPostfix(postfix + 1);
                                            }}
                                            color="primary"
                                        >
                                            <i className="mdi mdi-plus" />
                                        </Button>
                                    </span>
                                </InputGroup>
                            </div>

                            <div className="mb-3">
                                <Label>With prefix</Label>
                                <InputGroup>
                                    <span
                                        className="input-group-btn input-group-prepend"
                                        onClick={() => {
                                            setWithPostfix(withPostfix - 1);
                                        }}
                                    >
                                        <Button type="button" color="primary">
                                            <i className="mdi mdi-minus" />
                                        </Button>
                                    </span>
                                    <span className="input-group-append">
                                        <span className="input-group-text">$</span>
                                    </span>
                                    <Input
                                        type="number"
                                        className="form-control"
                                        value={withPostfix}
                                        placeholder="number"
                                        readOnly
                                    />
                                    <span className="input-group-append"></span>
                                    <span className="input-group-append">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setWithPostfix(withPostfix + 1);
                                            }}
                                            color="primary"
                                        >
                                            <i className="mdi mdi-plus" />
                                        </Button>
                                    </span>
                                </InputGroup>
                            </div>

                            <div className="mb-3">
                                <Label>Init with empty value:</Label>
                                <InputGroup>
                                    <div
                                        className="input-group-append"
                                        onClick={() => {
                                            setEmpty_val(empty_val - 1);
                                        }}
                                    >
                                        <Button type="button" color="primary">
                                            <i className="mdi mdi-minus" />
                                        </Button>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={empty_val}
                                        placeholder="number"
                                        readOnly
                                    />
                                    <div
                                        className="input-group-append"
                                        onClick={() => {
                                            setEmpty_val(empty_val + 1);
                                        }}
                                    >
                                        <Button type="button" color="primary">
                                            <i className="mdi mdi-plus" />
                                        </Button>
                                    </div>
                                </InputGroup>
                            </div>
                            <div className="mb-3">
                                <Label>
                                    Value attribute is not set (applying settings.initval)
                                </Label>
                                <InputGroup>
                                    <div
                                        className="input-group-append"
                                        onClick={() => {
                                            setNot_attr(not_attr - 1);
                                        }}
                                    >
                                        <Button type="button" color="primary">
                                            <i className="mdi mdi-minus" />
                                        </Button>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={not_attr}
                                        placeholder="number"
                                        readOnly
                                    />
                                    <div
                                        className="input-group-append"
                                        onClick={() => {
                                            setNot_attr(not_attr + 1);
                                        }}
                                    >
                                        <Button type="button" color="primary">
                                            <i className="mdi mdi-plus" />
                                        </Button>
                                    </div>
                                </InputGroup>
                            </div>
                            <FormGroup className="mb-0">
                                <Label>
                                    Value is set explicitly to 33 (skipping
                                    settings.initval){" "}
                                </Label>
                                <InputGroup>
                                    <div
                                        className="input-group-append"
                                        onClick={() => {
                                            setExplicit_val(explicit_val - 1);
                                        }}
                                    >
                                        <Button type="button" color="primary">
                                            <i className="mdi mdi-minus" />
                                        </Button>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={explicit_val}
                                        placeholder="number"
                                        readOnly
                                    />
                                    <div
                                        className="input-group-append"
                                        onClick={() => {
                                            setExplicit_val(explicit_val + 1);
                                        }}
                                    >
                                        <Button type="button" color="primary">
                                            <i className="mdi mdi-plus" />
                                        </Button>
                                    </div>
                                </InputGroup>
                            </FormGroup>
                        </Form>{" "}
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
}

export default BootstrapTouchSpin;