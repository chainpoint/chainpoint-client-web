import React, { Component } from 'react'
import ns from 'utils/ns'
import * as chainpointParse from 'chainpoint-parse'

import ProofText from 'components/ProofText/ProofText'

import './ProofDetails.less'

class ProofDetails extends Component {
  getProofDetails(proof) {
    const { branches = [] } = chainpointParse.parse(proof.proofData)
    let details = {}
    if (branches.length) {
      const calBranch = branches.find(
        branch => branch.label === 'cal_anchor_branch'
      )

      details.cal =
        (calBranch && calBranch.anchors && calBranch.anchors[0]) || null

      const btcBranch =
        calBranch &&
        calBranch.branches &&
        calBranch.branches.find(branch => branch.label === 'btc_anchor_branch')

      details.btc =
        (btcBranch && btcBranch.anchors && btcBranch.anchors[0]) || null
    }

    return details
  }

  render() {
    const { isBtcReady, isCalReady, proof } = this.props

    const proofDetails =
      isCalReady || isBtcReady ? this.getProofDetails(proof) : {}

    const eta = isBtcReady
      ? 0
      : (Date.now() - (proof.date.getTime() + 90 * 6e4)) / 6e4

    return (
      <div>
        <div className={ns('proofDetails-details')}>
          <ProofText
            proof={proof}
            isCalReady={isCalReady}
            isBtcReady={isBtcReady}
          />
        </div>
        <div
          className={ns(
            `proofDetails-details proofDetails-details-cal ${
              isCalReady ? 'proofDetails-details-complete' : ''
            }`
          )}
        >
          <h3>Calendar Anchor</h3>
          <h5>Anchor Hash:</h5>
          <span className={ns('proofDetails-hash')}>
            {isCalReady ? proofDetails.cal.expected_value : `Pending`}
          </span>
          <h5>Calendar Block:</h5>
          <span className={ns('proofDetails-block')}>
            {isCalReady ? (
              <a href={proofDetails.cal.uris[0]} target="_blank" rel="noopener">
                {proofDetails.cal.anchor_id}
              </a>
            ) : (
              'Pending'
            )}
          </span>
        </div>
        <div
          className={ns(
            `proofDetails-details proofDetails-details-btc ${
              isBtcReady ? 'proofDetails-details-complete' : ''
            }`
          )}
        >
          <h3>Bitcoin Anchor</h3>
          <h5>Merkle Root:</h5>
          <span className={ns('proofDetails-hash')}>
            {isBtcReady
              ? proofDetails.btc.expected_value
              : `Pending ~ ${parseInt(Math.abs(eta), 10)} minutes`}
          </span>
          <h5>Bitcoin Block:</h5>
          <span className={ns('proofDetails-block')}>
            {isBtcReady ? (
              <a
                href={`https://api.blockcypher.com/v1/btc/main/blocks/${
                  proofDetails.btc.anchor_id
                }`}
                target="_blank"
                rel="noopener"
              >
                {proofDetails.btc.anchor_id}
              </a>
            ) : (
              'Pending'
            )}
          </span>
        </div>
      </div>
    )
  }
}

export default ProofDetails
