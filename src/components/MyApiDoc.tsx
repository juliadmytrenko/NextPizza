import React, { Component } from "react";
import "rapidoc";

export class MyApiDoc extends Component {
  render() {
    return (
      <rapi-doc
        spec-url="/api/rapidoc"
        render-style="read"
        style={{ height: "100vh", width: "100%" }}
      ></rapi-doc>
    );
  }
}
