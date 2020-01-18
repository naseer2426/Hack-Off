import React, { Component } from "react";
import { Navbar, Container, Col, Row } from "react-bootstrap";

class Navbar_ extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heading: {
        color: "white",
        fontSize: "4rem",

        fontFamily: '"Hacked", monospace'
      },
      idStyle: {
        color: "white",
        fontSize: "1.3rem"
      }
    };
  }

  render() {
    return (
      <Navbar style={{ color: "red" }}>
        <Container>
          <Col>
            <Navbar.Brand style={this.state.heading}>HACK OFF</Navbar.Brand>
          </Col>
          <Col xs={6} />
          <Col style={this.state.idStyle}>
            <Row>PlayerId:</Row>
            <Row>{this.props.playerId}</Row>
          </Col>
        </Container>
      </Navbar>
    );
  }
}

export default Navbar_;
