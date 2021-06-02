import React from "react";
import { Col, Row, Form, Button, Container, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Backend from "../../model/backend.js";
import SearchTable from "./SearchTable";
import "react-datepicker/dist/react-datepicker.css";
import "./SearchForm.css";

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 70);

    this.state = {
      productName: "",
      startDate: null,
      endDate: null,
      location: "",
      search: false,
      document: "",
      showModal: false,
      index: -1,
      noFormsFound: null,
      emptySearch: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.result = null;
  }

  async handleSubmit(event) {
    event.preventDefault();
    let output = JSON.parse(JSON.stringify(this.state));
    if (
      !output.startDate &&
      !output.endDate &&
      !output.productName &&
      !output.location
    ) {
      this.onEmptySearchAlert();
    }
    if (output.startDate) {
      output.startDate = JSON.stringify(output.startDate).slice(1, 11);
    }
    if (output.endDate) {
      output.endDate = JSON.stringify(output.endDate).slice(1, 11);
    }

    await this.fetchData(output);
  }

  async fetchData(search) {
    let backend = new Backend();
    let document;
    if (
      search.startDate &&
      search.endDate &&
      search.productName &&
      search.location
    ) {
      document = await backend.getDateProductLocation(
        search.productName,
        search.location,
        search.startDate,
        search.endDate
      );
    } else if (
      search.startDate &&
      search.endDate &&
      search.productName &&
      !search.location
    ) {
      document = await backend.getDateProduct(
        search.startDate,
        search.endDate,
        search.productName
      );
    } else if (
      !search.productName &&
      search.startDate &&
      search.endDate &&
      search.location
    ) {
      document = await backend.getDateLocation(
        search.startDate,
        search.endDate,
        search.location
      );
    } else if (
      !search.startDate &&
      !search.endDate &&
      search.productName &&
      search.location
    ) {
      document = await backend.getNameLocation(
        search.productName,
        search.location
      );
    } else if (
      search.startDate &&
      search.endDate &&
      !search.productName &&
      !search.location
    ) {
      document = await backend.getDateRange(search.startDate, search.endDate);
    } else if (
      search.productName &&
      !search.startDate &&
      !search.endDate &&
      !search.location
    ) {
      document = await backend.getByName(search.productName);
    } else if (
      search.location &&
      !search.productName &&
      !search.startDate &&
      !search.endDate
    ) {
      document = await backend.getLocation(search.location);
    }
    if (document !== undefined) {
      this.setState({ search: true, document: document });
    } else {
      this.setState({ search: false, noFormsFound: true }, () =>
        this.onShowNoFormsAlert()
      );
    }

    return document;
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleStartDateChange(newDate) {
    if (newDate) {
      this.setState({
        startDate: new Date(newDate.getTime()),
      });
    } else {
      this.setState({
        startDate: null,
      });
    }
  }

  handleEndDateChange(newDate) {
    if (newDate) {
      this.setState({
        endDate: new Date(newDate.getTime()),
      });
    } else {
      this.setState({
        endDate: null,
      });
    }
  }

  onEmptySearchAlert = () => {
    this.setState({ emptySearch: true }, () => {
      window.setTimeout(() => {
        this.setState({ emptySearch: false });
      }, 2500);
    });
  };

  onShowNoFormsAlert = () => {
    this.setState({ noFormsFound: true }, () => {
      window.setTimeout(() => {
        this.setState({ noFormsFound: false });
      }, 2500);
    });
  };

  handleTable = (returned) => {
    this.setState({
      productName: "",
      startDate: null,
      endDate: null,
      location: "",
      search: false,
      document: "",
      showModal: false,
      index: -1,
      noFormsFound: null,
    });
  };

  render() {
    const { search, document, noFormsFound, emptySearch } = this.state;

    if (search) {
      if (document !== undefined) {
        return (
          <SearchTable
            document={document}
            handleTable={this.handleTable.bind(this)}
          />
        );
      }
    }

    return (
      <Container fluid>
        <div className="d-flex justify-content-center">
          <Alert
            variant="secondary"
            hidden={!noFormsFound}
            className="fade-out position-absolute top-70 start-50 w-50 h-10"
          >
            No Forms Found
          </Alert>
          <Alert
            variant="warning"
            hidden={!emptySearch}
            className="fade-out position-absolute top-70 start-50 w-50 h-10"
          >
            Must Search By Atleast One Field
          </Alert>
        </div>
        <Form className="search" onSubmit={this.handleSubmit}>
          <div className="d-flex justify-content-center">
            <h2>Search Criteria</h2>
          </div>
          <Row>
            <Col>
              <Form.Group controlId="productName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="productName"
                  placeholder="Product Name"
                  onChange={this.handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="startDate">
                <Form.Label>Date Range</Form.Label>
                <DatePicker
                  placeholderText="Start Date"
                  selected={this.state.startDate}
                  onChange={this.handleStartDateChange}
                  autoComplete="off"
                  name="startDate"
                  dateFormat="MM/dd/yyyy"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="endDate">
                <Form.Label></Form.Label>
                <DatePicker
                  placeholderText="End Date"
                  selected={this.state.endDate}
                  onChange={this.handleEndDateChange}
                  autoComplete="off"
                  name="endDate"
                  dateFormat="MM/dd/yyyy"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="location">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Location"
                  onChange={this.handleInputChange}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Button type="submit">Search</Button>
          </Row>
        </Form>
      </Container>
    );
  }
}

export default SearchForm;
/*
import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import Alert from "react-bootstrap/Alert";
import "react-datepicker/dist/react-datepicker.css";
import "./SearchForm.css";
import Backend from "../model/backend.js";
import { Container } from "react-bootstrap";
import Modalview from "./Modal";

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 70);
    this.state = {
      productName: "",
      startDate: null,
      //yesterday.getTime() - yesterday.getTimezoneOffset() * 60000)
      endDate: null,
      //today.getTime() - today.getTimezoneOffset() * 60000),
      location: "",
      search: false,
      document: "",
      showModal: false,
      alert: false,
      searchAlert: false,
      submitAlert: false,
      deleteAlert: false,
      index: -1,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearchAlert = this.handleSearchAlert.bind(this);
    this.handleDeleteAlert = this.handleDeleteAlert.bind(this);
    this.displayAlert = this.displayAlert.bind(this);
    this.result = null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { document } = this.state;
    if (!this.state.search) {
    } else if (prevState.search !== this.state.search) {
      this.displayData(document);
    }
  }

  monthDiff(d1, d2) {
    const diff = Math.abs(d2 - d1);
    return diff / (1000 * 60 * 60 * 24 * 30);
  }

  async handleSubmit(event) {
    event.preventDefault();
    let output = JSON.parse(JSON.stringify(this.state));
    if (
      !output.startDate &&
      !output.endDate &&
      !output.productName &&
      !output.location
    ) {
      this.handleSearchAlert(true);
    }
    if (output.startDate) {
      output.startDate = JSON.stringify(output.startDate).slice(1, 11);
    }
    if (output.endDate) {
      output.endDate = JSON.stringify(output.endDate).slice(1, 11);
    }
    //console.log(JSON.stringify(output));

    await this.fetchData(output);
  }

  async fetchData(search) {
    let backend = new Backend();
    //let document = await backend.getByName(search.productName);

    
    let document;
    if (
      !search.startDate &&
      !search.endDate &&
      !search.productName &&
      !search.location
    ) {
      this.handleSearchAlert(true);
    }
    if (
      search.startDate &&
      search.endDate &&
      search.productName &&
      search.location
    ) {
      document = await backend.getDateProductLocation(
        search.productName,
        search.location,
        search.startDate,
        search.endDate
      );
    } else if (
      search.startDate &&
      search.endDate &&
      search.productName &&
      !search.location
    ) {
      document = await backend.getDateProduct(
        search.startDate,
        search.endDate,
        search.productName
      );
    } else if (
      !search.productName &&
      search.startDate &&
      search.endDate &&
      search.location
    ) {
      document = await backend.getDateLocation(
        search.startDate,
        search.endDate,
        search.location
      );
    } else if (
      !search.startDate &&
      !search.endDate &&
      search.productName &&
      search.location
    ) {
      document = await backend.getNameLocation(
        search.productName,
        search.location
      );
    } else if (
      search.startDate &&
      search.endDate &&
      !search.productName &&
      !search.location
    ) {
      document = await backend.getDateRange(search.startDate, search.endDate);
    } else if (
      search.productName &&
      !search.startDate &&
      !search.endDate &&
      !search.location
    ) {
      document = await backend.getByName(search.productName);
    } else if (
      search.location &&
      !search.productName &&
      !search.startDate &&
      !search.endDate
    ) {
      document = await backend.getLocation(search.location);
    }
    if (document) console.log("productName", document);
    //console.log(typeof document);
    //this.displayData(document);
    if (
      search.startDate ||
      search.endDate ||
      search.productName ||
      search.location
    ) {
      this.setState({ search: true, document: document });
    } else {
      this.setState({ search: false, document: null });
    }
    return document;
  }

  displayData(document) {
    return (
      <table border="2">
        <tbody>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Signature</th>
          </tr>
          {document.Items.map((item, i) => (
            <tr key={i}>
              <td>
                <Button onClick={() => this.handleClick(i)}>
                  {item.productName}
                </Button>
              </td>
              <td>{item.date}</td>
              <td>{item.signature}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  displayAlert(variantInput, header, message, outline) {
    const { alert } = this.state;
    return (
      <Col className="alert-card d-flex justify-content-center">
        <Alert className="alert" show={alert} variant={variantInput}>
          <Alert.Heading>{header}</Alert.Heading>
          <p>{message}</p>
          <hr />
          <div className="d-flex justify-content-center">
            <Button
              onClick={() => {
                this.handleSearchAlert(false);
                this.handleSubmitAlert(false);
                this.handleDeleteAlert(false);
              }}
              variant={outline}
            >
              Close Me
            </Button>
          </div>
        </Alert>
      </Col>
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleStartDateChange(newDate) {
    if (newDate) {
      this.setState({
        startDate: new Date(newDate.getTime()),
      });
    } else {
      this.setState({
        startDate: null,
      });
    }
  }

  handleEndDateChange(newDate) {
    if (newDate) {
      this.setState({
        endDate: new Date(newDate.getTime()),
      });
    } else {
      this.setState({
        endDate: null,
      });
    }
  }

  handleModal = (isOpen) => {
    this.setState({ showModal: isOpen });
  };

  handleClick = (index) => {
    this.setState({ showModal: true, index: index });
  };

  handleSearchAlert = (status, statusCode) => {
    this.setState({ searchAlert: status, alert: status });
  };

  handleSubmitAlert = (status) => {
    this.setState({ submitAlert: status, alert: status });
  };

  handleDeleteAlert = (status) => {
    this.setState({ deleteAlert: status, alert: status });
  };

  render() {
    const {
      document,
      showModal,
      index,
      searchAlert,
      submitAlert,
      deleteAlert,
    } = this.state;
    return (
      <>
        <Container className="alertContainer">
          {searchAlert
            ? this.displayAlert(
                "warning",
                "",
                "You must fill in atleast one field to be able to search for Forms",
                "outline-warning"
              )
            : ""}
          {submitAlert
            ? this.displayAlert(
                "success",
                "",
                "Successfully Edited Your Form",
                "outline-success"
              )
            : ""}
          {deleteAlert
            ? this.displayAlert(
                "success",
                "",
                "Successfully Delete Your Form",
                "outline-success"
              )
            : ""}
        </Container>
        <Container fluid>
          <Row className={"header"}>
            <Col>
              <h2>Search Criteria</h2>
            </Col>
            <Col>
              <h2>Search Results</h2>
            </Col>
          </Row>
          <hr className={"line"} />
          <Form className="search-form" onSubmit={this.handleSubmit}>
            <Row>
              <Col>
                <Form.Row>
                  <Col>
                    <Form.Group controlId="productName">
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="productName"
                        placeholder="Product Name"
                        onChange={this.handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Form.Label>Date Range</Form.Label>
                </Form.Row>
                <Form.Row>
                  <Col>
                    <Form.Group controlId="startDate">
                      <DatePicker
                        selected={this.state.startDate}
                        onChange={this.handleStartDateChange}
                        autoComplete="off"
                        name="startDate"
                        dateFormat="MM/dd/yyyy"
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="endDate">
                      <DatePicker
                        selected={this.state.endDate}
                        onChange={this.handleEndDateChange}
                        autoComplete="off"
                        name="endDate"
                        dateFormat="MM/dd/yyyy"
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col>
                    <Form.Group controlId="location">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        placeholder="Location"
                        onChange={this.handleInputChange}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Button type="submit">Search</Button>
                </Form.Row>
                {showModal ? (
                  <Modalview
                    formData={document.Items[index]}
                    handleModal2={this.handleModal.bind(this)}
                    handleSubmitAlert={this.handleSubmitAlert.bind(this)}
                    handleDeleteAlert={this.handleDeleteAlert.bind(this)}
                    isOpen={showModal}
                  ></Modalview>
                ) : (
                  ""
                )}
              </Col>
              <Col className="table">
                {document ? this.displayData(document) : ""}
              </Col>
            </Row>
          </Form>
        </Container>
      </>
    );
  }
}
export default SearchForm;
*/
