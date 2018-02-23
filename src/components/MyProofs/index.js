import  React, { Component } from 'react';

export default class MyProofs extends Component {
  render() {
    const { proofs } = this.props;
    return (
      <div>
        <h3>My Proofs</h3>
        <ul>
          { proofs.map((proof, i) => (<li key={i}>{proof}</li>) )}
        </ul>
      </div>
    );
  }
}