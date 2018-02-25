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
    proofs: []
  };

  blockchains = [
    {
      id: 'btc',
      retryInterval: 1000 * 60 * 10,
      sleepBeforeFirstRequest: 1000 * 60 * 90
    },
    {
      id: 'cal',
      retryInterval: 1000 * 60,
      sleepBeforeFirstRequest: 12000
    }
  ];

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
        waitFor: blockchain
      });

    return proofs
      // Skip hashes without handles
      .filter(proof => !proof.nodes || proof.nodes.length)
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

  setProofStatus(hash, proofData, blockchain, isReady, tryCount) {

    console.log(arguments);
    const proofs = [...this.state.proofs];

    const proofIndex = proofs.findIndex(proof => proof.hash === hash);
    const proof = proofs[proofIndex];
    const entry = proof && proof.proofStatus[blockchain];
    if (entry) {
      entry.isReady = isReady;
      entry.tryCount = tryCount;
      entry.lastTry = Date.now();
    }

    // Save proof if wasnt saved before
    if (proofData && !proofs[proofIndex].proofData) {
      proofs[proofIndex].proofData = proofData;
    }

    proofs[proofIndex].proofStatus[blockchain] = entry;


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
      proofData: null,
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

        return proofHandles;
      })
      .then((handles) => {
             const checkPromises = this.blockchains.map(blockchain => {
              return sleep(blockchain.sleepBeforeFirstRequest)
                .then(() => {
                  this.checkProofs({
                    hash,
                    handles,
                    sleepBeforeRetry: blockchain.retryInterval,
                    waitFor: blockchain.id
                  });
                })
            });

             return Promise.all(checkPromises);
      });

    return proof;
  }

  /**
   *
   * @param {string} hash
   * @param {Object[]} handles
   * @param {number} [tryCount=0]
   * @param {number} [triesLimit=10]
   * @param {number} [sleepBeforeRetry]
   * @param {number} [delay]
   * @param {string} [waitFor]
   */
  checkProofs({hash, handles, tryCount = 0, triesLimit = 10, sleepBeforeRetry = 1000 * 60, waitFor = 'cal'}) {

    console.log(`Checking for ${waitFor} proof for ${hash}`);
    console.log(`Try №${tryCount}`);

    return chainpoint.getProofs(handles)
      .then(proofs => {

        this.updateProofs(hash, 'proofs', proofs);

        return proofs.find(proof => proof.anchorsComplete.includes(waitFor));
      })
      .then(proof => {

        const isComplete = !!proof;
        const proofData = isComplete && proof.proof;

        this.setProofStatus(hash, proofData, waitFor, isComplete);

        if(!isComplete) {
          sleep(sleepBeforeRetry)
            .then(() =>
              this.checkProofs({
                hash,
                handles,
                tryCount: tryCount+1,
                triesLimit,
                sleepBeforeRetry,
                waitFor
              })
            );
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
        <div className="controls">
          <CreateProof onSubmit={this.onProofSubmit.bind(this)}/>
          <VerifyProof />
        </div>
        <MyProofs proofs={this.state.proofs} />
      </div>
    );
  }
}

export default App;
