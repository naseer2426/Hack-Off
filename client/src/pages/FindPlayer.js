import React, { Component, createRef } from "react";
import { Background, Navbar } from "../components/Components";
import { Row, Col, Container, Button, Spinner } from "react-bootstrap";
import { Redirect } from "react-router-dom";

class FindPlayer extends Component {
  constructor(props) {
    super(props);
    let socket = "";
    var redirectHome = false;
    if (props.location.socket) {
      socket = props.location.socket;
    } else {
      redirectHome = true;
    }

    this.state = {
      error: false,
      playerId: socket.id,
      redirectHome: redirectHome,
      socket: socket,
      findContainer: {
        color: "white",
        fontSize: "2rem"
      },
      redirectNext: false,
      loading: false,
      inputTag: {
        color: "white",
        background: "transparent",
        border: "none"
      },
      findPlayer: {
        color: "white",
        fontSize: "1.5rem",
        borderColor: "white"
      },
      errorStyle: {
        color: "white",
        fontSize: "1.5rem"
      }
    };
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

  inputRef = createRef();

  findPlayerActivate = () => {
    this.setState({
      error: false
    });
    let player2 = this.inputRef.current.value;
    let valid = true;
    if (player2.length !== 20) {
      valid = false;
      this.setState({
        error: "User id not long enough"
      });
    }
    if (valid) {
      this.setState({
        loading: true
      });
      this.state.socket.emit("join_request", {
        requested: player2,
        requester: this.state.socket.id
      });
      this.state.socket.on("join_request_response", data => {
        if (data.status === "Ready") {
          this.setState({
            redirectNext: true,
            playerCharacter: data.move,
            gameId: data.gameId
          });
        }
      });
    }
  };
  cancelFinding = () => {
    this.state.socket.emit("cancel_wait", "");
    this.state.socket.on("cancel_wait_response", data => {
      this.setState({
        loading: false
      });
    });
  };
  render() {
    return (
      <Background>
        {this.state.redirectHome ? <Redirect to="./" /> : ""}
        <Navbar playerId={this.state.playerId} />
        <Container>
          <Row style={{ height: this.state.height * 0.2 }} />
          <Row className="text-center">
            <Container className="text-center" style={this.state.findContainer}>
              <Col>
                <input
                  onKeyPress={event => {
                    if (event.key === "Enter") {
                      this.findPlayerActivate();
                    }
                  }}
                  disabled={this.state.loading ? "disabled" : ""}
                  ref={this.inputRef}
                  placeholder="Friend's id..."
                  style={this.state.inputTag}
                  maxlength="20"
                />
              </Col>
            </Container>
          </Row>
          <Row style={{ height: this.state.height * 0.1 }} />
          <Row>
            <Container className="text-center">
              {this.state.loading ? (
                <div>
                  <Row>
                    <Container className="text-center">
                      <Row>
                        <Container
                          style={{ color: "white" }}
                          className="text-center"
                        >
                          Waiting for your friend to join
                        </Container>
                      </Row>
                      <Row>
                        <Container
                          style={{ color: "white" }}
                          className="text-center"
                        >
                          <h6>Tips:</h6>
                          {
                            [
                              "Hard questions give more moves but easy questions, can be solved quicker",
                              "One hard question and you win",
                              "Find me at github.com/ABHINAV112",
                              "You will only be able to play if you solve a problem",
                              "Easy questions give you 1 move, hard questions give 3 and medium 2",
                              "While solving the questions there is only one input test case, read it in using stdin methods across each language"
                            ][Math.floor(Math.random() * 6)]
                          }
                        </Container>
                      </Row>
                    </Container>
                  </Row>
                  <Row>
                    <Container className="text-center">
                      <Spinner animation="border" style={{ color: "white" }} />
                    </Container>
                  </Row>
                  <Row style={{ height: this.state.height * 0.05 }} />
                  <Row>
                    <Container className="text-center">
                      <Button
                        className="bg-transparent"
                        style={this.state.findPlayer}
                        onClick={this.cancelFinding}
                      >
                        Cancel
                      </Button>
                    </Container>
                  </Row>
                </div>
              ) : (
                <Button
                  className="bg-transparent"
                  style={this.state.findPlayer}
                  onClick={this.findPlayerActivate}
                >
                  Find Player
                </Button>
              )}
            </Container>
          </Row>
          <Row style={{ height: this.state.height * 0.1 }} />
          <Row>
            <Container className="text-center" style={this.state.errorStyle}>
              {this.state.error ? `Error: ${this.state.error}` : ""}
            </Container>
          </Row>
        </Container>
        {this.state.redirectNext ? (
          <Redirect
            to={{
              pathname: "/game",
              socket: this.state.socket,
              gameId: this.state.gameId,
              playerCharacter: this.state.playerCharacter
            }}
          />
        ) : (
          ""
        )}
      </Background>
    );
  }
}

export default FindPlayer;
