import React, { Component } from "react";
import {
  Background,
  Navbar,
  TextEditor,
  DisplayOutput,
  TicTacToe
} from "../components/Components";
import {
  Row,
  Col,
  Container,
  Dropdown,
  Button,
  ButtonGroup,
  Spinner,
  Jumbotron
} from "react-bootstrap";
import { Redirect } from "react-router-dom";

class Game extends Component {
  constructor(props) {
    super(props);
    let socket = {};
    let redirectHome = false;
    this.setSquares = this.setSquares.bind(this);
    this.setWinStatus = this.setWinStatus.bind(this);
    this.setGlobalBoardState = this.setGlobalBoardState.bind(this);
    this.decrementCount = this.decrementCount.bind(this);
    if (props.location.socket) {
      socket = props.location.socket;
    } else {
      // NOTE: remember to set this to true
      redirectHome = true;
    }
    // cons;
    this.state = {
      redirectHome: redirectHome,
      playerId: socket.id,
      playerCharacter: props.location.playerCharacter,
      boardSquares: ["", "", "", "", "", "", "", "", ""],
      socket: socket,
      rightDisplay: "Select Display",
      language: "python",
      rightDisplay: "Game Screen",
      buttonStyle: { borderColor: "white", fontSize: "1rem" },
      code: "",
      currentlyDisabled: true,
      output: "",
      gameOver: !true,
      leftStatus: "pickQuestion", //correctAnswer ,wrongAnswer,texteditor,pickQuestion,texteditor,
      moveCounter: 0
    };
    this.setCode = this.setCode.bind(this);
  }
  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    if (!this.state.redirectHome) {
      this.state.socket.on("move", data => {
        this.setState({
          boardSquares: data.move
        });
      });
    }
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
  setGlobalBoardState = boardSquares => {
    this.setState({
      boardSquares: boardSquares
    });
    console.log("this.props", this.props);
    var data = {
      gameId: this.props.location.gameId,
      move: boardSquares
    };
    this.state.socket.emit("move", data);
  };
  uploadCode = async () => {
    this.setState({
      leftStatus: "loading"
    });

    let url = "https://polar-bastion-87772.herokuapp.com/compile";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      input_text: this.state.code,
      language: this.state.language,
      stdin: this.state.problem.input[0]
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };

    let result = await (await fetch(url, requestOptions)).json();
    if (result.error) {
      this.setState({
        response: result,
        leftStatus: "wrongAnswer",
        output: result.error
      });
      return;
    }
    let compare = this.state.problem.output[0];
    let resultTemp = result.stdout.trim().split("\n")[0];

    console.log("compare", compare);
    console.log("result temp", resultTemp);
    if (compare != resultTemp) {
      console.log("output", result.stdout);
      this.setState({
        response: result,
        leftStatus: "wrongAnswer",
        output: result.stdout
      });
      return;
    }
    if (this.state.difficulty == "easy") {
      this.setState({
        count: 1
      });
    } else if (this.state.difficulty == "medium") {
      this.setState({
        count: 2
      });
    }
    if (this.state.difficulty == "hard") {
      this.setState({
        count: 3
      });
    }
    this.setState({
      response: result,
      leftStatus: "correctAnswer",
      output: result.stdout,
      currentlyDisabled: false
    });
  };

  decrementCount = () => {
    if (this.state.count == 1) {
      this.setState({
        currentlyDisabled: true
      });
    }
    this.setState({
      count: this.state.count - 1
    });
  };

  leftHeader = () => {
    return (
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
    );
  };

  textEditor = () => {
    return (
      <Col style={{ overflowY: "scroll" }}>
        {this.leftHeader()}
        {/* <Row style={{ height: this.state.height * 0.05 }} /> */}

        <TextEditor
          mode={this.state.language}
          code={this.state.code}
          setCode={this.setCode}
        />

        <DisplayOutput output={this.state.output} />
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
        {this.leftHeader()}
        {this.verticalAlignLeft()}

        <Row>
          <Container className="text-center">
            <Row>
              <Container className="text-center">
                <h3 style={{ color: "white" }}>Successful submission!</h3>
              </Container>
            </Row>
            <Row>
              <Container className="text-center">
                <Button
                  style={this.state.buttonStyle}
                  className="bg-transparent"
                  variant="success"
                  onClick={() => {
                    this.setState({
                      leftStatus: "pickQuestion"
                    });
                  }}
                >
                  Pick Next Question{" "}
                </Button>
              </Container>
            </Row>
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
  selectDifficulty = difficulty => {
    this.setState({
      difficulty: difficulty
    });
    this.state.socket.emit("problem_request", { difficulty: difficulty });

    this.state.socket.on("problem_response", problem => {
      this.setState({
        problem: problem,
        leftStatus: "texteditor",
        rightDisplay: "Problem Statement"
      });
    });
  };
  pickDifficulty = () => {
    return (
      <Col>
        {this.verticalAlignLeft()}
        <Row>
          <Container className="text-center">
            <h2 style={{ color: "white" }}>Select difficulty of problem</h2>
          </Container>
        </Row>
        <Row>
          <Container className="text-center">
            <ButtonGroup className="mt-3">
              <Button
                variant="success"
                className="bg-transparent"
                style={this.buttonStyle}
                onClick={() => this.selectDifficulty("easy")}
                style={{ fontSize: "1.5rem" }}
              >
                Easy
              </Button>
              <Button
                variant="success"
                className="bg-transparent"
                style={this.buttonStyle}
                onClick={() => this.selectDifficulty("medium")}
                style={{ fontSize: "1.5rem" }}
              >
                Medium
              </Button>
              <Button
                variant="success"
                className="bg-transparent"
                style={this.buttonStyle}
                onClick={() => this.selectDifficulty("hard")}
                style={{ fontSize: "1.5rem" }}
              >
                Hard
              </Button>
            </ButtonGroup>
          </Container>
        </Row>
      </Col>
    );
  };
  wrongMessage = response => {
    let display = {};
    if (response.stdout) {
      display.title = "Wrong Answer";
      display.message = response.stdout;
    } else {
      display.title = "Error in syntax";
      display.message = response.error;
    }
    return (
      <Col>
        <Jumbotron
          style={{
            background: "none",
            padding: "0",
            overflow: "scroll",
            height: this.state.height * 0.8,
            width: this.state.width * 0.5,
            color: "white"
          }}
        >
          <Container className="text-center">
            {this.verticalAlignLeft()}
            <Row>
              <Container className="text-center">
                <h3 style={{ color: "white" }}>{display.title}</h3>
              </Container>
            </Row>
            <Row>
              <Jumbotron style={{ background: "none" }} className="text-left">
                <Row style={{ color: "white" }}>
                  <Col>Input:</Col>
                  <Col>{this.state.problem.input}</Col>
                </Row>
                <Row style={{ color: "white" }}>
                  <Col>Output:</Col>
                  <Col>{this.convertOutput(display.message)}</Col>
                </Row>
              </Jumbotron>
            </Row>
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
        </Jumbotron>
      </Col>
    );
  };

  verticalAlignLeft = () => {
    if (this.state.leftStatus === "wrongAnswer") {
      return <Row style={{ height: this.state.height * 0.15 }} />;
    }
    if (this.state.leftStatus !== "texteditor") {
      return <Row style={{ height: this.state.height * 0.3 }} />;
    }
    return "";
  };

  decideLeftColumn = () => {
    if (this.state.leftStatus === "pickQuestion") {
      return this.pickDifficulty();
    }
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
      return this.wrongMessage(this.state.response);
    }
  };
  problemStatementTile = () => {
    return (
      <Col>
        <Container>
          <Jumbotron
            style={{
              background: "none",
              padding: "0",
              overflow: "scroll",
              height: this.state.height * 0.8,
              width: this.state.width * 0.5,
              color: "white"
            }}
          >
            <h2>Problem Statement</h2>
            {this.convertOutput(this.state.problem.statement)}
          </Jumbotron>
        </Container>
      </Col>
    );
  };
  setWinStatus = outcome => {
    this.setState({
      outcome: outcome,
      gameOver: true
    });
  };

  gameDisplay = () => {
    return (
      <Col>
        <Container>
          <Jumbotron
            style={{
              background: "none",
              padding: "0",
              overflow: "scroll",
              height: this.state.height * 0.8,
              width: this.state.width * 0.5,
              color: "white"
            }}
          >
            <Container>
              <Row>
                <Container className="text-center">
                  <h2>Game:</h2>
                </Container>
              </Row>
              <Row>
                <Container className="text-center">
                  <TicTacToe
                    squares={this.state.boardSquares}
                    setSquares={this.setSquares}
                    setWinStatus={this.setWinStatus}
                    player={this.state.playerCharacter}
                    setGlobalBoardState={this.setGlobalBoardState}
                    disabled={this.state.currentlyDisabled}
                    decrementCount={this.decrementCount}
                  />
                </Container>
              </Row>
            </Container>
          </Jumbotron>
        </Container>
      </Col>
    );
  };

  decideRightColumn = () => {
    if (this.state.rightDisplay == "Problem Statement") {
      return this.problemStatementTile();
    }
    if (this.state.rightDisplay == "Game Screen") {
      return this.gameDisplay();
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
    if (outcome === "lose") {
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

  setSquares = (player, index, reset = false) => {
    if (reset) {
      this.setState({
        boardSquares: ["", "", "", "", "", "", "", "", ""]
      });
    }
    let tempSquares = this.state.boardSquares;
    tempSquares[index] = player;
    this.setState({
      boardSquares: tempSquares
    });
  };

  mainScreen = () => {
    return (
      <Row>
        {this.decideLeftColumn()}
        {this.decideRightColumn()}
      </Row>
    );
  };

  render() {
    console.log("to be shared", this.state.boardSquares);
    return (
      <Background overflow="hidden">
        {this.state.redirectHome ? <Redirect to="/" /> : ""}
        <Navbar playerId={this.state.playerId} />

        {this.state.gameOver
          ? this.gameOver(this.state.outcome)
          : this.mainScreen()}
        {this.state.redirect ? <Redirect to={this.state.redirect} /> : ""}
      </Background>
    );
  }
}

export default Game;
