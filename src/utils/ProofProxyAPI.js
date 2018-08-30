import axois from 'axios'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import get from 'lodash/get'

import { convertToLDJSON } from './API'
import { PROOF_PROXY_BASE_URL } from '../constants'

/**
 * Stores proofHandles
 * @param {Object} handles
 * @returns {void}
 */
const storeProofHandles = handles => {
  const data = handles.map(({ hashIdNode, uri }) => [hashIdNode, uri])
  axois.post(PROOF_PROXY_BASE_URL.SUBMIT, data).catch(() => {})
}

/**
 * Stores Proofs
 * @param {Object} proofs
 * @returns {void}
 */
const storeProofs = proofs => {
  const data = proofs.map(({ hashIdNode, proof }) => [hashIdNode, proof])
  axois.post(PROOF_PROXY_BASE_URL.SUBMIT, data).catch(() => {})
}

/**
 * Retrieve a Proofs by UUIDs
 * @param {Object} handles
 * @returns {Promise<Object>}
 */
const getProofs = handles => {
  const uuids = handles.reduce(
    (acc, { hashIdNode }) => [...acc, hashIdNode],
    []
  )

  const apiUrl = `${PROOF_PROXY_BASE_URL.GET}`
  const opts = {
    headers: {
      hashids: uuids
    }
  }

  return axois
    .get(apiUrl, opts)
    .then(({ data }) => {
      if (isEmpty(data)) {
        return
      }

      return data.map(({ proof, hash_id }) => {
        let anchorsComplete = []
        const ldJSON = convertToLDJSON(proof)
        const branches = get(ldJSON, 'branches')

        const calBranch = find(branches, { label: 'cal_anchor_branch' })
        if (!isEmpty(calBranch)) {
          anchorsComplete.push('cal')

          const btcBranch = find(calBranch.branches, {
            label: 'btc_anchor_branch'
          })
          if (!isEmpty(btcBranch)) {
            anchorsComplete.push('btc')
          }
        }

        return {
          proof,
          anchorsComplete,
          hashIdNode: hash_id
        }
      })
    })
    .catch(() => {})
}

export { storeProofHandles, storeProofs, getProofs }
