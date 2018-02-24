import  React, { Component } from 'react';

export default class MyProofs extends Component {
  getClasses(proof) {
    const classes = ['hash'];
    if (proof.nodes.length !== 0) {
      classes.push('hash_state_submitted');
    }
    if (proof.proofs.length !== 0) {
      classes.push('hash_state_has-proofs');
    }

    return classes.join(' ');
  }

  getBlockchains(proof) {
    const anchors = proof.proofs.map(proof => proof.anchorsComplete);
    const uniqueAnchors = [...(new Set(Array.prototype.concat(...anchors)))];
    return (
      uniqueAnchors.length > 0 ?
        <div><b>Submitted to:</b> {uniqueAnchors.join(', ')}</div>
        : ''
    );
  }

  render() {
    const { proofs } = this.props;
    return (
      <div>
        <h3>My Proofs</h3>
        <ul>
          { proofs.map(proof => (<li key={proof.hash} className={this.getClasses(proof)}>{proof.hash} {this.getBlockchains(proof)}</li>) )}
        </ul>
      </div>
    );
  }
}