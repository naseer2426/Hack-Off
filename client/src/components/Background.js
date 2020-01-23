import React, { Component } from "react";
import Sky from "react-sky";

class Background extends Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.state = {
      width: 0,
      height: 0,

      main: {
        height: 0,
        width: 0,
        backgroundColor: "black"
      },
      heading: { color: "#149414", fontSize: "5rem" }
    };
  }
  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateStyles = (width, height) => {
    this.setState({
      main: {
        height: height,
        width: width,
        backgroundColor: "black"
      }
    });
  };
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    this.updateStyles(window.innerWidth, window.innerHeight);
  }

  render() {
    return (
      <div
        style={{
          overflow: this.props.overflow,
          height: this.state.height,
          width: this.state.width
        }}
      >
        <div
          style={{
            overflow: this.props.overflow,
            height: this.state.height,
            width: this.state.width
          }}
        >
          {this.props.children ? this.props.children : ""}
        </div>
        <Sky
          images={{
            0: `https://vwoccasion.co.uk/wp-content/uploads/2017/01/bright-green-square.jpg`
          }}
          how={
            100
          } /* Pass the number of images Sky will render chosing randomly */
          time={40} /* time of animation */
          size={"20px"} /* size of the rendered images */
          background={"black"} /* color of background */
          style={{ height: this.state.height, width: this.state.width }}
        />
      </div>
    );
  }
}

export default Background;
