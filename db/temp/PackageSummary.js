import React, { Component } from "react";

export default class PackageSummary extends Component {

  render() {
    console.log('>>>>PackageSummary', this.props);
    const packageInst = this.props.packageInst;

    return (
      <div>
        <h2>{packageInst.name}</h2>
        <img src={packageInst.imageUrl} alt={packageInst.name} ></img>
        <p>{packageInst.desc}</p>
      </div>
    );
  }
}