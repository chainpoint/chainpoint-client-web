import * as ActionTypes from './actionTypes';
import { merge, get, set } from 'lodash';
import { combineReducers } from 'redux';

const proofs = (state = [], action) => {
  switch (action.type) {

    // Add new hash to the state
    case ActionTypes.ADD_PROOF:

      // Do not allow duplicates
      if (state.some(proof => proof.hash === action.hash)) {
        return state;
      }

      return [...state, {
        nodes: [],
        proofs: [],
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
        },
        hash: action.hash
      }];

    // Save received chainproof handles
    case ActionTypes.ADD_HANDLES:
      const proofs = state.map(item => {
        const proof = merge({}, item);

        if (proof.hash === action.hash) {
          proof.nodes = action.handles;
        }

        return proof;
      });

      return proofs;

    // Update proofs data
    case ActionTypes.PROOFS_RECEIVED:

      return state.map(item => {
        const proof = merge({}, item);

        if (proof.hash === action.hash) {
          proof.proofs = action.proofs;
        }

        return proof;
      });


    // Set proof data
    case ActionTypes.UPDATE_PROOF:
      const newState = state.map(item => merge({}, item));

      const hashIndex = newState.findIndex(item => item.hash === action.hash);

      const path = `${hashIndex}.proofStatus.${action.blockchainType}`;
      const entry = get(newState, path);

      entry.isReady = action.isReady;
      entry.tryCount = entry.tryCount + 1;
      entry.lastTry = Date.now();

      set(newState, path, entry);

      if (action.proofData) {
        set(newState, `${hashIndex}.proofData`, action.proofData);
      }

      return newState;

    default:
      return state;
  }
};

const rootReducer = combineReducers({
  proofs,
});

export default rootReducer;
