import React, { Component } from "react";
import { Container, Row, Col, Jumbotron } from "react-bootstrap";

class DisplayOutput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: {
        color: "#149414",
        overflowY: "scroll"
      }
    };
  }
  displayableOutput = () => {
    let temp = this.props.output.split(/\n/g);
    let result = [];
    for (let i = 0; i < temp.length; i++) {
      result.push(temp[i]);
      if (temp.length !== i) {
        result.push(<br></br>);
      }
    }
    return result;
  };

  render() {
    return (
      <Container style={this.state.text}>
        <Row>
          <Col xs={2}>
            <h5>Output:</h5>
          </Col>
          <Col>
            <Jumbotron
              style={{
                background: "none",
                padding: "0",
                overflow: "scroll",
                height: 60,
                width: this.state.width * 0.5
              }}
            >
              <div style={{}}>{this.displayableOutput()}</div>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default DisplayOutput;
