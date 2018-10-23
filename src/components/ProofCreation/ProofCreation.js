import React, { Component } from 'react'
import classNames from 'classnames'
import ns from 'utils/ns'

import loader from 'img/loader.png'
import verifyIcon from '../../svg/verify.svg'

import Button from 'common/Button/Button'

import './ProofCreation.less'

class ProofCreation extends Component {
  render() {
    const {
      visible,
      analysing,
      inputting,
      isMobile,
      onAddAnotherFile,
      proof
    } = this.props

    const className = classNames('proofCreation', {
      'proofCreation--visible': visible,
      'proofCreation--analysing': analysing,
      'proofCreation--inputting': inputting
    })

    return (
      <div className={ns(className)}>
        <div className={ns('proofCreation-spinner')}>
          <img src={loader} alt="spinner" />
          Analyzing
        </div>
        <div className={ns('proofCreation-hint')}>
          <img
            src={verifyIcon}
            className={ns('proofCreation-icon')}
            alt="proof icon"
          />
          <div className={ns('proofCreation-details')}>
            <h3>Your Chainpoint proof is being created</h3>
            <p>
              Your proof has been added to the list below. It takes
              approximately 90 minutes to fully anchor your proof to the Bitcoin
              blockchain. It’s safe to leave and return later to download your
              complete proof.
            </p>
          </div>
        </div>
        <div className={ns('proofCreation-stats')}>
          <div className={ns('proofCreation-id')}>
            <span className={ns('proofCreation-stat')}>ID:</span>
            {proof.hashId}
          </div>
          {proof.filename && (
            <div className={ns('proofCreation-file')}>
              <span className={ns('proofCreation-stat')}>File:</span>
              {proof.filename}
            </div>
          )}
          <div className={ns('proofCreation-hash')}>
            <span className={ns('proofCreation-stat')}>Hash:</span>
            {proof.hash}
          </div>
        </div>

        <div className={ns('proofCreation-button')}>
          <Button
            type="primary"
            title="I'M DONE"
            grow={isMobile}
            onClick={onAddAnotherFile}
          />
        </div>
      </div>
    )
  }
}

export default ProofCreation
