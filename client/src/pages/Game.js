import React, { Component } from "react";
import {
  Background,
  Navbar,
  TextEditor,
  DisplayOutput
} from "../components/Components";
import {
  Row,
  Col,
  Container,
  Dropdown,
  Button,
  Spinner
} from "react-bootstrap";
import { Redirect } from "react-router-dom";

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerId: "67094798ad7s097adf9ad0f",
      language: "python",
      rightDisplay: "Problem Statement",
      buttonStyle: { borderColor: "white", fontSize: "1rem" },
      code: "",
      gameOver: true,
      leftStatus: "wrongAnswer" //correctAnswer ,wrongAnswer,texteditor
    };
    this.setCode = this.setCode.bind(this);
  }
  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  };
  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateWindowDimensions);
  };
  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };
  setCode = code => {
    this.setState({ code: code });
  };
  setLanguage = language => {
    this.setState({
      language: language
    });
  };
  setRightDisplay = element => {
    this.setState({
      rightDisplay: element
    });
  };

  uploadCode = () => {
    this.setState({
      leftStatus: "loading"
    });
  };

  textEditor = () => {
    return (
      <Col style={{ overflowY: "scroll" }}>
        <Container>
          <Row>
            <Col>
              <Container>
                <Row style={{ color: "white", height: "40px" }}>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="success"
                      id="dropdown-basic"
                      className="bg-transparent"
                      style={this.state.buttonStyle}
                    >
                      {this.state.language}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {["Python", "Java", "C", "C++"].map((val, index) => {
                        return (
                          <Dropdown.Item
                            key={"language" + index}
                            onClick={() => this.setLanguage(val.toLowerCase())}
                            style={this.state.buttonStyle}
                          >
                            {val}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                </Row>
              </Container>
            </Col>
            <Col>
              <Container>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic"
                    className="bg-transparent"
                    style={this.state.buttonStyle}
                  >
                    {this.state.rightDisplay}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {["Problem Statement", "Game Screen"].map((val, index) => {
                      return (
                        <Dropdown.Item
                          key={"Option" + index}
                          onClick={() => {
                            this.setRightDisplay(val);
                          }}
                        >
                          {val}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </Container>
            </Col>
            <Col>
              <Container>
                <Button
                  style={this.state.buttonStyle}
                  className="bg-transparent"
                  variant="success"
                  onClick={this.uploadCode}
                >
                  Run Code
                </Button>
              </Container>
            </Col>
          </Row>
        </Container>
        {/* <Row style={{ height: this.state.height * 0.05 }} /> */}

        <TextEditor
          mode={this.state.language}
          code={this.state.code}
          setCode={this.setCode}
        />

        <DisplayOutput output={"hello world\naa\naa"} />
      </Col>
    );
  };
  leftLoading = () => {
    return (
      <Col>
        {this.verticalAlignLeft()}
        <Row>
          <Container className="text-center">
            <h4 style={{ color: "white" }}>Running Code:</h4>
          </Container>
        </Row>
        <Row>
          <Container className="text-center">
            <Spinner animation="border" style={{ color: "white" }} />
          </Container>
        </Row>
      </Col>
    );
  };
  successMessage = () => {
    return (
      <Col>
        {this.verticalAlignLeft()}

        <Row>
          <Container className="text-center">
            <h3 style={{ color: "white" }}>Successful submission!</h3>
          </Container>
        </Row>
      </Col>
    );
  };
  convertOutput = string => {
    let temp = string.split(/\n/g);
    let result = [];
    for (let i = 0; i < temp.length; i++) {
      result.push(temp[i]);
      if (temp.length !== i) {
        result.push(<br></br>);
      }
    }
    return result;
  };
  wrongMessage = response => {
    let display = {};
    if (response.stdout) {
      display.title = "Wrong Answer";
      display.message = this.convertOutput(response.stdout);
    } else {
      display.title = "Error in syntax";
      display.message = this.convertOutput(response.error);
    }
    return (
      <Col>
        <Container className="text-center">
          {this.verticalAlignLeft()}
          <Row>
            <Container className="text-center">
              <h3 style={{ color: "white" }}>{display.title}</h3>
            </Container>
          </Row>
          <Row>
            <Col style={{ color: "white" }}>{display.message}</Col>
          </Row>
          <Row style={{ height: this.state.height * 0.1 }} />
          <Row>
            <Container className="text-center">
              <Button
                style={this.state.buttonStyle}
                className="bg-transparent"
                variant="success"
                onClick={() => {
                  this.setState({
                    leftStatus: "texteditor"
                  });
                }}
              >
                Try again{" "}
              </Button>
            </Container>
          </Row>
        </Container>
      </Col>
    );
  };

  verticalAlignLeft = () => {
    if (this.state.leftStatus == "wrongAnswer") {
      return <Row style={{ height: this.state.height * 0.15 }} />;
    }
    if (this.state.leftStatus !== "texteditor") {
      return <Row style={{ height: this.state.height * 0.3 }} />;
    }
    return "";
  };

  decideLeftColumn = () => {
    if (this.state.leftStatus === "texteditor") {
      return this.textEditor();
    }
    if (this.state.leftStatus === "loading") {
      return this.leftLoading();
    }
    if (this.state.leftStatus === "correctAnswer") {
      return this.successMessage();
    }
    if (this.state.leftStatus === "wrongAnswer") {
      return this.wrongMessage({
        error:
          "dfjadjflkajdfljadf\nadfjaldfjlkadflk\nalfjalkdfjlkadf\nalkfdjlkadjf"
      });
    }
  };

  rightColumn = () => {
    return <Col></Col>;
  };
  redirect = () => {
    this.setState({
      redirect: "./findPlayer"
    });
  };

  gameOver = outcome => {
    let displayMessage = "Congratulations, you won!";
    if (outcome == "lose") {
      displayMessage = "Unfortunately, you got out hacked";
    }
    return (
      <Container>
        <Row style={{ height: this.state.height * 0.2 }} />
        <Row>
          <Container className="text-center" style={{ color: "white" }}>
            <h1>Game Over:</h1>
          </Container>
        </Row>
        <Row>
          <Container className="text-center" style={{ color: "white" }}>
            <h3>{displayMessage}</h3>
          </Container>
        </Row>
        <Row style={{ height: this.state.height * 0.1 }} />
        <Row>
          <Container className="text-center">
            <Button
              onClick={this.redirect}
              className="bg-transparent"
              style={this.state.buttonStyle}
            >
              <h4>Play Again</h4>
            </Button>
          </Container>
        </Row>
      </Container>
    );
  };

  mainScreen = () => {
    return (
      <Row>
        {this.decideLeftColumn()}
        <Col />
      </Row>
    );
  };

  render() {
    console.log(this.state.code);
    return (
      <Background overflow="hidden">
        <Navbar playerId={this.state.playerId} />

        {this.state.gameOver ? this.gameOver("win") : this.mainScreen()}
        {this.state.redirect ? <Redirect to={this.state.redirect} /> : ""}
      </Background>
    );
  }
}

export default Game;
