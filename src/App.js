import React, { Component } from 'react';
import './App.css';
import CreateProof from 'components/CreateProof';
import MyProofs from 'components/MyProofs';
import { sha256 } from 'js-sha256';
import chainpoint from 'chainpoint-client/bundle';
import sleep from './utils/sleep';

class App extends Component {
  state = {
    proofs: []
  };

  /**
   *
   * @param {string} hash
   * @param {string} property
   * @param {any} value
   */
  updateProofs(hash, property, value) {
    const proofs = this.state.proofs.map(proof => {
      if (proof.hash === hash) {
        proof[property] = value;
      }
      return proof;
    });

    this.setState({ proofs });
  }

  createProof(value) {
    const hash = sha256(value);

    // Do not allow duplicates
    if (this.state.proofs.some(proof => proof.hash === hash)) {
      return false;
    }

    const proof = {
      hash,
      proofs: [],
      nodes: []
    };

    // Submit each hash to three randomly selected Nodes

    chainpoint.submitHashes([hash])
      .then(proofHandles => {
        console.log("Submitted Proof Objects: Expand objects below to inspect.");
        console.log(proofHandles);

        this.updateProofs(hash, 'nodes', proofHandles);

        console.log("Sleeping 12 seconds to wait for proofs to generate...");
        return proofHandles;
      })
      .then((proofHandles) => sleep(12000, proofHandles))
      .then((proofHandles) => chainpoint.getProofs(proofHandles))
      .then((proofs) => {
        console.log("Proof Objects: Expand objects below to inspect.");
        console.log(proofs);

        this.updateProofs(hash, 'proofs', proofs);
        return proofs;
      });

    return proof;
  }

  checkProofs({handles, timeout, delay = 12000, waitFor = 'cal'}) {
    return sleep(delay)
      .then(() => chainpoint.getProofs(handles))
      .then(proofs => {
        return proofs.some(proof => {
          proof.anchorsComplete.contains(waitFor);
        });
      })
      .then(isComplete => {

      });
  }

  onProofSubmit(value) {
    const proof = this.createProof(value);
    if (!proof) {
      alert('Hash already added!');
      return;
    }
    const proofs = [proof, ...this.state.proofs];

    this.setState({proofs});
  }

  render() {
    return (
      <div className="App">
        <h1>The App</h1>
        <CreateProof onSubmit={this.onProofSubmit.bind(this)} />
        <MyProofs proofs={this.state.proofs} />
      </div>
    );
  }
}

export default App;
