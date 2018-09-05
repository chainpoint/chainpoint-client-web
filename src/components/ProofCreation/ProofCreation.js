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
      onAddAnotherFile
    } = this.props

    const className = classNames('proofCreation', {
      'proofCreation--visible': visible,
      'proofCreation--analysing': analysing,
      'proofCreation--inputting': inputting
    })

    return (
      <div className={ns(className)}>
        <div className={ns('proofCreation-spinner')}>
          <img src={loader} />
          Analyzing
        </div>
        <div className={ns('proofCreation-hint')}>
          <img src={verifyIcon} className={ns('proofCreation-icon')} />
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
            5cf0a860-0f52-11e7-947d-7fde4e7ca024
          </div>
          <div className={ns('proofCreation-file')}>
            <span className={ns('proofCreation-stat')}>File:</span>
            big-long-file-name-here.jpg
          </div>
          <div className={ns('proofCreation-hash')}>
            <span className={ns('proofCreation-stat')}>Hash:</span>
            5c57db50d4ef8b1f4c63b952d884c461711228fc2c27e4f866c583efecdc1826
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
