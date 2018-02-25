import React, { Component } from 'react';
import './App.css';
import CreateProof from 'components/CreateProof';
import MyProofs from 'components/MyProofs';
import { sha256 } from 'js-sha256';
import chainpoint from 'chainpoint-client/bundle';
import sleep from './utils/sleep';
import VerifyProof from './components/VerifyProof';

class App extends Component {
  state = {
    proofs: [],
    isVerifying: false
  };

  componentWillMount() {
    let cachedState = JSON.parse(window.localStorage.getItem('proofs-state')) || [];

    if (cachedState.length > 0) {
      cachedState = this.restartUpdateTasks(cachedState);
    }

    this.setState({
      proofs: cachedState
    });
  }

  componentWillUpdate(nextProps, nextState) {
    window.localStorage.setItem('proofs-state', JSON.stringify(nextState.proofs));
  }

  restartUpdateTasks(proofs) {

    // Runs check
    const check = (proof, blockchain) =>
      this.checkProofs({
        hash: proof.hash,
        handles: proof.nodes,
        delay: 0,
        waitFor: blockchain
      });

    return proofs
      // Skip hashes without handles
      .filter(proof => proof !== null)
      .map(proof => {

      if (!proof.proofStatus.btc.isReady) {
        check(proof, 'btc');
      }

      if (!proof.proofStatus.cal.isReady) {
        check(proof, 'cal');
      }

      return proof;

    });
  }
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

  setProofStatus(hash, blockchain, isReady, tryCount) {

    const proofs = [...this.state.proofs];

    const proofIndex = proofs.findIndex(proof => proof.hash === hash);
    const proof = proofs[proofIndex];
    const entry = proof && proof.proofStatus[blockchain];
    if (entry) {
      entry.isReady = isReady;
      entry.tryCount = tryCount;
      entry.lastTry = Date.now();
    }

    proof.proofStatus[blockchain] = entry;


    this.setState({ proofs });
  }

  /**
   *
   * @param {string} value
   * @returns {*}
   */
  createProof(value) {
    const hash = sha256(value);

    // Do not allow duplicates
    if (this.state.proofs.some(proof => proof.hash === hash)) {
      return false;
    }

    const proof = {
      hash,
      proofs: [],
      nodes: [],
      proofStatus: {
        cal: {
          isReady: false,
          tryCount: 0,
          lastTry: null
        },
        btc: {
          isReady: false,
          tryCount: 0,
          lastTry: null
        }
      }
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
      .then((handles) => {
        this.checkProofs({hash, handles });
        return handles;
      });

    return proof;
  }

  /**
   *
   * @param {string} hash
   * @param {Object[]} handles
   * @param {number} timeout
   * @param {number} delay
   * @param {string} waitFor[cal]
   */
  checkProofs({hash, handles, timeout = 0, delay = 12000, waitFor = 'cal'}) {
    console.log(`Checking for ${waitFor} proof for ${hash} in ${delay}ms`);

    return sleep(delay)
      .then(() => chainpoint.getProofs(handles))
      .then(proofs => {

        this.updateProofs(hash, 'proofs', proofs);

        return proofs.some(proof => proof.anchorsComplete.includes(waitFor));
      })
      .then(isComplete => {

        this.setProofStatus(hash, waitFor, isComplete);

        if(!isComplete) {
        }
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
        <VerifyProof />
        <MyProofs proofs={this.state.proofs} />
      </div>
    );
  }
}

export default App;
