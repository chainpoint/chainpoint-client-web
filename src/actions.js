import { sha3_256 as sha256 } from 'js-sha3';
import * as config from './config';
import sleep from './utils/sleep';

import { ADD_PROOF, ADD_HANDLES, PROOFS_RECEIVED, UPDATE_PROOF } from './actionTypes'
import * as api  from './api';
import chainpoint from 'chainpoint-client/dist/bundle.web';

export const addProof = hash => ({ type: ADD_PROOF, hash: hash });

export const addHandles = ({hash, handles} ) => ({ type: ADD_HANDLES, hash, handles });

export const setProofs = ({hash, proofs} ) => ({ type: PROOFS_RECEIVED, hash, proofs });

export const updateProof = ({hash, proofData, blockchainType, isReady}) => ({ type: UPDATE_PROOF, hash, proofData, blockchainType, isReady });

// Checks if proof is available for given hash
export const checkProofs = ({hash, handles, tryCount = 0, triesLimit = 10, sleepBeforeRetry = 1000 * 60, waitFor = 'cal'}) => {

  return dispatch => {

    console.log(`Checking for ${waitFor} proof for ${hash}`);
    console.log(`Try №${tryCount}`);

    return chainpoint.getProofs(handles)
      .then(proofs => {

        dispatch(setProofs({ hash, proofs }));

        return proofs.find(proof => proof.anchorsComplete.includes(waitFor));
      })
      .then(proof => {

        const isReady = !!proof;

        const proofData = isReady && proof.proof;

        dispatch(updateProof({hash, proofData, waitFor, blockchainType: waitFor, isReady}));

        if(!isReady) {
          sleep(sleepBeforeRetry)
            .then(() =>
              dispatch(checkProofs({
                hash,
                handles,
                tryCount: tryCount+1,
                triesLimit,
                sleepBeforeRetry,
                waitFor
              }))
            );
        }
      });

  }
};

export const addAndSubmitHash = content => {
  return dispatch => {

    return Promise.resolve(sha256(content))
      .then(hash => {
        dispatch(addProof(hash));
        return api.submitHash(hash).then(handles => ({ hash, handles}));
      })
      .then(
        ({ handles, hash}) => {
          dispatch(addHandles({ hash, handles }));
          return {hash, handles};
        }
      )
      .then(({hash, handles}) => {
        const checkPromises = config.blockchains.map(blockchain => {
          return sleep(blockchain.sleepBeforeFirstRequest)
            .then(() => {
              dispatch(checkProofs({
                hash,
                handles,
                sleepBeforeRetry: blockchain.retryInterval,
                waitFor: blockchain.id
              }));
            })
        });

        return Promise.all(checkPromises);
      })
  }
};