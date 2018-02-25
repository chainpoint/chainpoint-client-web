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

    if (proof.proofStatus.btc.isReady) {
      classes.push('hash_state_btc');
    }

    if (proof.proofStatus.cal.isReady) {
      classes.push('hash_state_cal');
    }

    return classes.join(' ');
  }

  renderProof(proof) {
    return (
      <li key={proof.hash} className={this.getClasses(proof)}>
        <i className="blockchain-label blockchain-label_name_cal">cal</i>
        <i className="blockchain-label  blockchain-label_name_btc">btc</i>
          {proof.hash}
         {
          proof.proofData &&
          <a className="get-proof" href={`data:application/octet-stream,${proof.proofData}`} download="proof.txt">Get Proof</a>
         }
      </li>
    )
  }

  render() {
    const { proofs } = this.props;
    return (
      <div>
        <h3>My Proofs</h3>
        <ul>
          {proofs.map(proof => this.renderProof(proof))}
        </ul>
      </div>
    );
  }
}