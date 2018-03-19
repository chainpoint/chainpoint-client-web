import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import './index.css';
import App from './App';
import reducers from './reducers';
import { checkProofs } from './actions';

const localStorageKey = 'proof-app-state';

// Restore app's state from local storage
const storedState = JSON.parse(localStorage.getItem(localStorageKey)) || {};

if (storedState.proofs) {
  // Skip hashes without defined chainpoint nodes
  storedState.proofs = storedState.proofs.filter(proof => !proof.nodes || proof.nodes.length);
}

const initialState = storedState || {
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


store.subscribe(() =>
  localStorage.setItem(localStorageKey, JSON.stringify(store.getState()))
);

restartUpdateTasks(store.getState().proofs);

function restartUpdateTasks(proofs) {

  // Runs check
  const check = (proof, blockchain) =>

    store.dispatch(checkProofs({
      hash: proof.hash,
      handles: proof.nodes,
      waitFor: blockchain
    }));

   proofs.forEach(proof => {

      if (!proof.proofStatus.btc.isReady) {
        check(proof, 'btc');
      }

      if (!proof.proofStatus.cal.isReady) {
        check(proof, 'cal');
      }


    });
}



ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>), document.getElementById('root'));
