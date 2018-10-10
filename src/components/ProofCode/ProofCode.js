import React, { Component } from 'react'
import ns from 'utils/ns'
import { getFormattedJSON, convertToLDJSON } from '../../utils/API'
import './ProofCode.less'

import Button from 'common/Button/Button'

class ProofCode extends Component {
  onCopy = () => {
    const isSuccessfull = this.copy()

    if (!isSuccessfull) {
      return
    }
  }

  /**
   * Copies proof ld-json to clipboard
   * @returns {boolean}
   */
  copy() {
    const { proof } = this.props

    if (!proof.proofData) {
      return false
    }

    const ldJSON = convertToLDJSON(proof.proofData)
    if (!ldJSON) {
      return false
    }

    const fakeInput = document.createElement('input')

    // hides the input
    fakeInput.id = 'fakeCopy'
    fakeInput.style.position = 'absolute'
    fakeInput.style.bottom = '-1000px'
    fakeInput.style.left = '-1000px'
    fakeInput.value = JSON.stringify(ldJSON)

    document.body.appendChild(fakeInput)

    fakeInput.select()
    document.execCommand('copy')

    document.body.removeChild(fakeInput)
    return true
  }

  /**
   * Returns formatted ld-json of proof
   * @param {Object} proof
   * @returns {string|void}
   */
  getFormattedProof(proof) {
    const { proofData } = proof

    if (!proofData) {
      return
    }

    const ldJSON = convertToLDJSON(proofData)
    if (!ldJSON) {
      return
    }

    return getFormattedJSON(ldJSON)
  }

  render() {
    const { proof } = this.props
    const proofLDJson = this.getFormattedProof(proof)

    return (
      <div className={ns('proofCode-codeBody')}>
        <Button
          type="primary"
          title="Copy code"
          onClick={this.onCopy}
          className={ns('proofCode-copyButton')}
        />
        <span>{proofLDJson}</span>
      </div>
    )
  }
}

export default ProofCode
