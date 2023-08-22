import React, { Component } from "react";

class Label extends Component {
  state = {
    name: "",
  };
  render() {
    return (
      <div>
        <p>Profile Name:Hi</p>
        <p>Updated name: {this.state.name}</p>
        <p>Change name:</p>
        <input
          type="text"
          onChange={(e) => {
            this.setState({
              name: e.target.value,
            });
          }}
        />
      </div>
    );
  }
}

export default Label;
