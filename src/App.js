import React, { Component } from 'react';

import './App.css';
import CreateProof from 'components/CreateProof';
import MyProofs from 'components/MyProofs';
import VerifyProof from './components/VerifyProof';

class App extends Component {

  // restartUpdateTasks(proofs) {
  //
  //   // Runs check
  //   const check = (proof, blockchain) =>
  //     this.checkProofs({
  //       hash: proof.hash,
  //       handles: proof.nodes,
  //       waitFor: blockchain
  //     });
  //
  //   return proofs
  //     // Skip hashes without handles
  //     .filter(proof => !proof.nodes || proof.nodes.length)
  //     .map(proof => {
  //
  //     if (!proof.proofStatus.btc.isReady) {
  //       check(proof, 'btc');
  //     }
  //
  //     if (!proof.proofStatus.cal.isReady) {
  //       check(proof, 'cal');
  //     }
  //
  //     return proof;
  //
  //   });
  // }

  render() {
    return (
        <div className="App">
          <h1>The App</h1>
          <div className="controls">
            <CreateProof />
            <VerifyProof />
          </div>
          <MyProofs />
        </div>
    );
  }
}

export default App;
