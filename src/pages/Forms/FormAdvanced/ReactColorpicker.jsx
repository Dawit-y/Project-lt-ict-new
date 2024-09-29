import React, { useState } from "react";
import { Card, CardBody, Col, Form, FormGroup, Input, Label, InputGroup } from "reactstrap";
import { SketchPicker } from "react-color";
import { ColorPicker } from "@vtaits/react-color-picker";
import "../../../../node_modules/@vtaits/react-color-picker/dist/index.css";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const ReactColorPicker = () => {

    const [simple_color, setSimple_color] = useState(0);
    const [simple_color1, setSimple_color1] = useState(0);
    const [simple_color2, setSimple_color2] = useState(0);
    const [color, setColor] = useState("red");
    const [colorRgb, setColorRgb] = useState("red");
    const [colorCust, setColorCust] = useState("red");
    const [colorHor, setColorHor] = useState("#fffff");
    const [colorRGBA, setColorRGBA] = useState("rgba(0, 194, 255, 0.78)");
    const [display_RGBA, setDisplay_RGBA] = useState(false);

    const onDrag = (c1) => {
        setColor(c1);
    };
    const onDragRgb = (c1) => {
        setColorRgb(c1);
    };
    const onDragCust = (c1) => {
        setColorCust(c1);
    };
    const handleHor = (color) => {
        setColorHor(color.hex);
    };

    const handleRGBA = () => {
        setDisplay_RGBA(!display_RGBA);
    }

    const onSwatchHover_RGBA = (color) => {
        const format =
            "rgba(" +
            color.rgb.r +
            "," +
            color.rgb.g +
            "," +
            color.rgb.b +
            "," +
            color.rgb.a +
            ")";
        setColorRGBA(format);
    };

    return (
        <React.Fragment>
            <Col xl="6">
                <Card>
                    <CardBody>
                        <h4 className="card-title">React Colorpicker</h4>
                        <p className="card-title-desc">
                            Fancy and customizable colorpicker plugin for Twitter
                            Bootstrap.
                        </p>

                        <Form action="#">
                            <div className="mb-3">
                                <Label>Simple input field</Label>
                                <Input
                                    type="text"
                                    className="colorpicker-default"
                                    value={color}
                                    onClick={() => {
                                        setSimple_color(!simple_color);
                                    }}
                                    readOnly
                                />
                                {simple_color ? (
                                    <ColorPicker
                                        saturationHeight={100}
                                        saturationWidth={100}
                                        value={color}
                                        onDrag={onDrag}
                                    />
                                ) : null}
                            </div>

                            <div className="mb-3">
                                <Label>Show Alpha</Label>
                                <Input
                                    type="text"
                                    id="colorpicker-showalpha"
                                    className="colorpicker-rgba form-control"
                                    value={colorRGBA}
                                    onClick={handleRGBA}
                                    readOnly
                                />
                                {display_RGBA ? (
                                    <SketchPicker
                                        color="#fff"
                                        value={colorRGBA}
                                        width="160px"
                                        onChangeComplete={onSwatchHover_RGBA}
                                    />
                                ) : null}
                            </div>
                            <FormGroup className="m-b-0">
                                <Label>As a component</Label>
                                <div
                                    className="input-group colorpicker-default"
                                    title="Using format option"
                                >
                                    <input
                                        readOnly
                                        value={colorRgb}
                                        type="text"
                                        className="form-control input-lg"
                                    />
                                    <span className="input-group-append">
                                        <span
                                            className="input-group-text colorpicker-input-addon"
                                            onClick={() => {
                                                setSimple_color1(!simple_color1);
                                            }}
                                        >
                                            <i
                                                style={{
                                                    height: "16px",
                                                    width: "16px",
                                                    background: colorRgb,
                                                }}
                                            />
                                        </span>
                                    </span>
                                </div>

                                {simple_color1 ? (
                                    <ColorPicker
                                        saturationHeight={100}
                                        saturationWidth={100}
                                        value={colorRgb}
                                        onDrag={onDragRgb}
                                    />
                                ) : null}
                            </FormGroup>
                            <div className="mb-3">
                                <Label>Horizontal mode</Label>
                                <Input
                                    type="text"
                                    onClick={() => {
                                        setSimple_color2(!simple_color2);
                                    }}
                                    value={colorHor}
                                    readOnly
                                />
                                {simple_color2 ? (
                                    <SketchPicker
                                        color="#fff"
                                        value={simple_color2}
                                        width="160px"
                                        onChangeComplete={handleHor}
                                    />
                                ) : null}
                            </div>

                            <FormGroup className="mb-0">
                                <Label>Inline</Label>

                                <ColorPicker
                                    saturationHeight={100}
                                    saturationWidth={100}
                                    value={colorCust}
                                    onDrag={onDragCust}
                                />
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <h4 className="card-title">Timepicker</h4>
                        <p className="card-title-desc">
                            Easily select a time for a text input using your mouse or
                            keyboards arrow keys.
                        </p>

                        <Form action="#">
                            <FormGroup className="mb-3">
                                <Label>Default Time Picker</Label>

                                <InputGroup>
                                    <Flatpickr
                                        className="form-control d-block"
                                        placeholder="Select time"
                                        options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: "H:i",
                                        }}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text">
                                            <i className="mdi mdi-clock-outline" />
                                        </span>
                                    </div>
                                </InputGroup>
                            </FormGroup>
                            <div className="form-group mb-3">
                                <Label>24 Hour Mode Time Picker</Label>

                                <InputGroup>
                                    <Flatpickr
                                        className="form-control d-block"
                                        placeholder="Select time"
                                        options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: "H:i",
                                            time_24hr: true,
                                        }}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text">
                                            <i className="mdi mdi-clock-outline" />
                                        </span>
                                    </div>
                                </InputGroup>
                            </div>

                            <div className="form-group mb-0">
                                <label>Specify a step for the minute field</label>

                                <div className="input-group">
                                    <Flatpickr
                                        className="form-control d-block"
                                        placeholder="Select time"
                                        options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: "H:i",
                                        }}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text">
                                            <i className="mdi mdi-clock-outline" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
}

export default ReactColorPicker;