import fetch from 'node-fetch'
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

// tip: parse UUID and extract the timestamp to see if older than 24 hours
const storeProofHandles = handles => {
  const data = handles.map(({ hashIdNode, uri }) => [hashIdNode, uri])
  fetch(PROOF_PROXY_BASE_URL.SUBMIT, {
    method: 'POST', 
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }).catch(() => {
    console.log('failed storing proof handles')
  })
}

/**
 * Stores Proofs
 * @param {Object} proofs
 * @returns {void}
 */
const storeProofs = proofs => {
  const data = proofs.map(({ hashIdNode, proof }) => [hashIdNode, proof])
  if (data) {
    fetch(PROOF_PROXY_BASE_URL.SUBMIT, {
      method: 'POST', 
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).catch(err => {
      console.log('failed storing proof')
    })
  }
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
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      hashids: uuids
    }
  }

  return fetch(apiUrl, opts)
    .then(res => res.json())
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
    .catch(() => {
      console.log('failed fetching proof')
    })
}

export { storeProofHandles, storeProofs, getProofs }
