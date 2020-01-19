import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";

var globalStyles = {
  customButton: {
    color: "white",
    fontSize: "4rem",
    height: "100px",
    width: "100px"
  },
  resetButton: {
    color: "white",
    fontSize: "2rem"
  }
};
function Square(props) {
  return (
    <Button
      variant="success"
      className="square bg-transparent"
      style={globalStyles.customButton}
      onClick={props.onClick}
    >
      {props.value}
    </Button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class TicTacToe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      currPlayer: "X"
    };
  }
  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        if (squares[a] == this.props.player) {
          this.props.setWinStatus("win");
        } else if (squares[a] != this.props.player) {
          this.props.setWinStatus("lose");
        }

        return squares[a];
      }
    }
    return null;
  }

  handleClick(i) {
    const squares = this.props.squares;
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    let temp = this.props.squares;
    temp[i] = this.props.player;
    this.props.setSquares(this.props.player, i);
    this.setState({
      stepNumber: this.state.stepNumber + 1
    });
    this.props.decrementCount();
    this.props.setGlobalBoardState(temp);
  }
  selectOnClick = () => {
    if (!this.props.disabled) {
      return i => this.handleClick(i);
    } else {
      return () => {};
    }
  };

  render() {
    const winner = this.calculateWinner(this.props.squares);

    return (
      <Container>
        <Row>
          <Container className="text-center">
            <Board
              squares={this.props.squares}
              onClick={this.selectOnClick()}
            />
          </Container>
        </Row>
        <Row style={{ height: "50px" }}>
          <Container className="test-center">{winner}</Container>
        </Row>
      </Container>
    );
  }
}

export default TicTacToe;
