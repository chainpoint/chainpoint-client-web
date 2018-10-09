import chainPoint from 'chainpoint-client/dist/bundle.web'
import chainBinary from 'chainpoint-binary'
import JSONFormatter from 'json-fmt'

import * as ProofProxyAPI from './ProofProxyAPI'
import { sleep } from './sleep'

const fmt = new JSONFormatter(JSONFormatter.PRETTY)

/**
 * Converts a Chainpoint proof
 * to a binary
 * @param proof
 * @returns {string|void}
 */
const convertsToBinary = proof => {
  const ldJSON = convertToLDJSON(proof)
  if (!ldJSON) {
    return
  }

  try {
    return chainBinary.objectToBinarySync(ldJSON)
  } catch (e) {
    return
  }
}

/**
 * Converts a Chainpoint binary proof
 * to a Javascript Object
 * @param {Object} proof
 * @returns {Object|void}
 */
const convertToLDJSON = proof => {
  try {
    return chainBinary.binaryToObjectSync(proof)
  } catch (e) {
    return
  }
}

/**
 * Stringify and beautifies object
 * @param {Object} obj
 * @returns {string|void}
 */
const getFormattedJSON = obj => {
  try {
    const strJSON = JSON.stringify(obj)
    fmt.append(strJSON)

    const formatted = fmt.flush()
    fmt.reset()

    return formatted
  } catch (e) {
    fmt.reset()
    return
  }
}

/**
 * Verify proofs
 * @param proofs
 * @returns {Array<Object>}
 */
const verifyProofs = proofs => chainPoint.verifyProofs(proofs)

/**
 * Submits hash
 * @param hash
 * @return {Array<{uri: String, hash: String, hashIdNode: String}>}
 */
const submitHash = ({ hash, onSubmitFailed }) =>
  chainPoint
    .submitHashes([hash])
    .then(handles => {
      ProofProxyAPI.storeProofHandles(handles)
      return handles
    })
    .catch(onSubmitFailed)

/**
 * Periodically checking
 * for the proof
 * @param hash
 * @param handles
 * @param tryCount
 * @param triesLimit
 * @param sleepBeforeRetry
 * @param waitFor
 * @param updateProof
 * @param onProofsReceived
 * @returns {void}
 */
const checkProofs = ({
  hash,
  handles,
  tryCount = 0,
  triesLimit = 10,
  sleepBeforeRetry = 1000 * 60,
  waitFor = 'cal',
  updateProof,
  onProofsReceived
}) => {
  chainPoint
    .getProofs(handles)
    // Save proofs into ProofProxy
    .then(proofs => {
      // if proof is gone, don't attempt to restore it
      if (proofs[0].proof) {
        ProofProxyAPI.storeProofs(proofs)
      }
      return proofs
    })
    // if chainPoint client doesn't work as expected
    // fallback to ProofProxy
    .catch(() => {
      ProofProxyAPI.getProofs(handles)
    })
    .then(proofs => {
      onProofsReceived(hash, proofs)
      return proofs.find(proof => proof.anchorsComplete.includes(waitFor))
    })
    .then(proof => {
      const isReady = !!proof
      const proofData = isReady && proof.proof

      updateProof({
        hash,
        proofData,
        waitFor,
        blockchainType: waitFor,
        isReady
      })

      if (!isReady) {
        sleep(sleepBeforeRetry).then(() => {
          checkProofs({
            hash,
            handles,
            tryCount: tryCount + 1,
            triesLimit,
            sleepBeforeRetry,
            waitFor,
            updateProof,
            onProofsReceived
          })
        })
      }
    })
    .catch(() => {})
}

const evaluateProof = ({ proofData }) => {
  return chainPoint.evaluateProofs([proofData])
}

export {
  convertsToBinary,
  getFormattedJSON,
  convertToLDJSON,
  evaluateProof,
  verifyProofs,
  checkProofs,
  submitHash
}
