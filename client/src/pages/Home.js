import React, { Component } from "react";
// import "../../Main.css";
import { Row, Container, Button, Spinner } from "react-bootstrap";
import { Background } from "../components/Components";
import { Redirect } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.state = {
      playerId: "67094798ad7s097adf9ad0f",
      redirect: false,
      idStyle: {
        color: "white",
        fontSize: "2rem"
      },
      findPlayer: {
        color: "white",
        fontSize: "2rem",
        borderColor: "white"
      },
      loading: false,
      heading: {
        color: "white",
        fontSize: "8rem",
        "font-family": '"Hacked", monospace'
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
  buttonRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  render() {
    console.log("width", this.state.width);
    return (
      <Background>
        <Container>
          <Row style={{ height: this.state.height * 0.1 }} />
          <Row>
            <Container className="text-center">
              <h1 style={this.state.heading}>HACK OFF</h1>
            </Container>
          </Row>
          <Row style={{ height: this.state.height * 0.025 }} />
          {!this.state.loading
            ? [
                <Row>
                  <Container className="text-center" style={this.state.idStyle}>
                    PlayerId: {this.state.playerId}
                  </Container>
                </Row>,

                <Row style={{ height: this.state.height * 0.28 }} />,
                <Row>
                  <Container className="text-center">
                    <Button
                      className="bg-transparent"
                      style={this.state.findPlayer}
                      onClick={this.buttonRedirect}
                    >
                      Find Player
                    </Button>
                  </Container>
                </Row>
              ]
            : [
                <Row style={{ height: this.state.height * 0.2 }} />,
                <Row>
                  <Container className="text-center">
                    <Spinner
                      animation="border"
                      style={{
                        color: "white",
                        height: this.state.height * 0.1,
                        width: this.state.height * 0.1
                      }}
                    />
                  </Container>
                </Row>
              ]}
        </Container>
        {this.state.redirect ? <Redirect to="./findPlayer" /> : ""}
      </Background>
    );
  }
}

export default Home;
