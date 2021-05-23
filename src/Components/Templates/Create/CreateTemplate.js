import React from "react";
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import "../Templates.css";

class CreateTemplate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productName: "",
            supplier: "",
            flowable: false,
            granular: false,
            wettable: false,
            emulsified: false,
            other: false,
            otherVal: "",
            caution: false,
            warning: false,
            danger: false,
            regNum: "",
            estNum: "",
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        // if (name === "productName") {
        //     this.setState({ validation: true });
        // } else {
        //     this.setState({ validation: false });
        // }

        this.setState({
            [name]: value,
        });
    }

    handleSubmit = (event) => {
        // Copy the state, so we can format the individual fields before sending to backend
        let output = JSON.parse(JSON.stringify(this.state));

        // Logging the output, this will go to backend later
        console.log(JSON.stringify(output));

        event.preventDefault();

        // Call database and save template. Make sure to check that the product name is there before saving. 
        // in other words, DO NOT save the template without a product name. Otherwise we'll have templates floating out
        // in the DB that we couldn't retrieve
    }

    render() {
        const { other, productName } = this.state;

        return (
        <Container>
            <Row className='justify-content-center align-self-center'>
                <Form className="templateForm" preventDefault onSubmit={this.handleSubmit}>
                    <div className='d-flex justify-content-center'>
                        <h3>Create Template Form</h3>
                    </div>
                    <Row>
                        <Col>
                            <Form.Group hasValidation controlId="productName">
                                <Form.Label>Product Name<span> (Required) </span></Form.Label>
                                <Form.Control
                                type="text"
                                required
                                name="productName"
                                isInvalid={productName ? "" : "true"}
                                isValid={productName ? "true" : ""}
                                placeholder="Product Name"
                                onChange={this.handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="supplier">
                                <Form.Label>Supplier</Form.Label>
                                <Form.Control
                                type="text"
                                name="supplier"
                                placeholder="Supplier"
                                onChange={this.handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formulation">
                                <Form.Label className="formulationLabel">Formulation:</Form.Label>
                                <div className="d-flex justify-content-center">
                                    <Form.Check
                                        name="flow"
                                        inline
                                        label="Flowable"
                                        type="checkbox"
                                        className="options"
                                        onChange={this.handleInputChange}
                                    />
                                    <Form.Check
                                        name="granular"
                                        inline
                                        label="Granular"
                                        type="checkbox"
                                        className="options"
                                        onChange={this.handleInputChange}
                                    />
                                    <Form.Check
                                        name="wettable"
                                        inline
                                        label="Wettable Powder"
                                        type="checkbox"
                                        className="options"
                                        onChange={this.handleInputChange}
                                    />
                                    <Form.Check
                                        name="emulsified"
                                        inline
                                        label="Emulsified Concrete"
                                        type="checkbox"
                                        className="options"
                                        onChange={this.handleInputChange}
                                    />
                                    <Form.Check
                                        name="other"
                                        inline
                                        label="Other"
                                        type="checkbox"
                                        className="options"
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <Form.Control
                                    type="text"
                                    name="otherVal"
                                    placeholder="Other Formulation"
                                    hidden={!other}
                                    onChange={this.handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="signalWord">
                                <Form.Label className="signalLabel">Signal Word: </Form.Label>
                                <div className="d-flex justify-content-center">
                                    <Form.Check
                                        name="caution"
                                        inline
                                        label="Caution"
                                        type="checkbox"
                                        className="options"
                                    />
                                    <Form.Check
                                        name="warning"
                                        inline
                                        label="Warning"
                                        type="checkbox"
                                        className="options"
                                    />
                                    <Form.Check
                                        name="danger"
                                        inline
                                        label="Danger"
                                        type="checkbox"
                                        className="options"
                                    />
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="regNum">
                                <Form.Label>EPA Registration #</Form.Label>
                                <Form.Control
                                type="text"
                                name="regNum"
                                placeholder="EPA Registration #"
                                onChange={this.handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="estNum">
                                <Form.Label>EPA Est. #</Form.Label>
                                <Form.Control
                                type="text"
                                name="estNum"
                                placeholder="EPA Est. #"
                                onChange={this.handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <a href="/Templates">
                                <Button variant='secondary' className='btn-block'>Cancel</Button>
                            </a>
                        </Col>
                        <Col>
                            <Button type='submit' variant='primary' className='btn-block'>Create Template</Button>
                        </Col>

                    </Row>
                </Form>
            </Row>
        </Container>
        )
    }
}

export default CreateTemplate;