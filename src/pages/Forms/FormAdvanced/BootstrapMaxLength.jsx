import React, { useState } from "react";
import { Card, CardBody, Col, Input, Label } from "reactstrap";

const BootstrapMaxLength = () => {

    const [disBadge, setDisBadge] = useState(true);
    const [disThresh, setDisThresh] = useState(false);
    const [placementBadge, setPlacementBadge] = useState(false);
    const [textCount, setTextCount] = useState(0);
    const [optionCount, setOptionCount] = useState(0);
    const [placementCount, setPlacementCount] = useState(0);
    const [threshHold, setThreshHold] = useState(0);
    const [threshHoldCount, setThreshHoldCount] = useState(0);
    const [disDefault, setDisDefault] = useState(0);
    const [textareaBadge, setTextAreaBadge] = useState(0);

    const max_len = 25;

    const threshHoldChange = (event) => {
        const count = event.target.value.length;
        const remain_val = max_len - 20;

        if (remain_val <= count) {
            setDisThresh(true);
        } else {
            setDisThresh(false);
        }
        setThreshHoldCount(event.target.value.length);
    }

    const threshHoldDefault = (event) => {
        const count = event.target.value.length;
        if (count > 0) {
            setDisDefault(true);
        } else {
            setDisDefault(false);
        }
        setThreshHold(event.target.value.length);
    }

    const optionChange = (event) => {
        const count = event.target.value.length;
        if (count > 0) {
            setDisBadge(true);
        } else {
            setDisBadge(false);
        }
        setOptionCount(event.target.value.length);
    }

    const placementChange = (event) => {
        const count = event.target.value.length;
        if (count > 0) {
            setPlacementBadge(true);
        } else {
            setPlacementBadge(false);
        }
        setPlacementCount(event.target.value.length);
    }

    const textareaChange = (event) => {
        const count = event.target.value.length;
        if (count > 0) {
            setTextAreaBadge(true);
        } else {
            setTextAreaBadge(false);
        }
        setTextCount(event.target.value.length);
    }


    return (
        <React.Fragment>
            <Col xl="6">
                <Card>
                    <CardBody>
                        <h4 className="card-title">Bootstrap MaxLength</h4>
                        <p className="card-title-desc">
                            This plugin integrates by default with Twitter bootstrap
                            using badges to display the maximum lenght of the field
                            where the user is inserting text.{" "}
                        </p>
                        <Label>Default usage</Label>
                        <p className="text-muted m-b-15">
                            The badge will show up by default when the remaining chars
                            are 10 or less:
                        </p>
                        <Input
                            type="text"
                            maxLength="25"
                            name="defaultconfig"
                            onChange={(e) => {
                                threshHoldDefault(e);
                            }}
                            id="defaultconfig"
                        />
                        {disDefault ? (
                            <span className="badgecount badge bg-success">
                                {threshHold} / 25{" "}
                            </span>
                        ) : null}

                        <div className="mt-3">
                            <Label>Threshold value</Label>
                            <p className="text-muted m-b-15">
                                Do you want the badge to show up when there are 20 chars
                                or less? Use the <code>threshold</code> option:
                            </p>
                            <Input
                                type="text"
                                maxLength={max_len}
                                onChange={(e) => {
                                    threshHoldChange(e);
                                }}
                                name="thresholdconfig"
                                id="thresholdconfig"
                            />
                            {disThresh ? (
                                <span className="badgecount badge bg-success">
                                    {threshHoldCount} / 25{" "}
                                </span>
                            ) : null}
                        </div>

                        <div className="mt-3">
                            <Label>All the options</Label>
                            <p className="text-muted m-b-15">
                                Please note: if the <code>alwaysShow</code> option is
                                enabled, the <code>threshold</code> option is ignored.
                            </p>
                            <Input
                                type="text"
                                maxLength="25"
                                // onChange={(e) => {
                                //     optionChange(e);
                                // }}
                                name="alloptions"
                                id="alloptions"
                            />
                        </div>

                        <div className="mt-3">
                            <Label>Position</Label>
                            <p className="text-muted m-b-15">
                                All you need to do is specify the <code>placement</code>{" "}
                                option, with one of those strings. If none is specified,
                                the positioning will be defauted to &apos;bottom&lsquo;.
                            </p>
                            <Input
                                type="text"
                                maxLength="25"
                                onChange={(e) => {
                                    placementChange(e);
                                }}
                                name="placement"
                                id="placement"
                            />
                            {placementBadge ? (
                                <span
                                    style={{ float: "right" }}
                                    className="badgecount badge bg-success"
                                >
                                    {placementCount} / 25{" "}
                                </span>
                            ) : null}
                        </div>

                        <div className="mt-3">
                            <Label>Textarea</Label>
                            <p className="text-muted m-b-15">
                                Bootstrap maxlength supports textarea as well as inputs.
                                Even on old IE.
                            </p>
                            <Input
                                type="textarea"
                                id="textarea"
                                onChange={(e) => {
                                    textareaChange(e);
                                }}
                                maxLength="225"
                                rows="3"
                                placeholder="This textarea has a limit of 225 chars."
                            />
                            {textareaBadge ? (
                                <span className="badgecount badge bg-success">
                                    {" "}
                                    {textCount} / 225{" "}
                                </span>
                            ) : null}
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
}

export default BootstrapMaxLength;