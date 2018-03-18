import React, { Component } from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import './App.css';
import CreateProof from 'components/CreateProof';
import MyProofs from 'components/MyProofs';
import chainpoint from 'chainpoint-client/dist/bundle.web';
import sleep from './utils/sleep';
import VerifyProof from './components/VerifyProof';
import reducers from './reducers';

const initialState = {
  proofs: []
};

const store = createStore(
  reducers,
  initialState,
  compose(applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
      latency: 0
    })
  )
);


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

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <h1>The App</h1>
          <div className="controls">
            <CreateProof />
            <VerifyProof />
          </div>
          <MyProofs />
        </div>
      </Provider>
    );
  }
}

export default App;
