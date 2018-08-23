import React, { Component } from 'react'
import classNames from 'classnames'
import ns from 'utils/ns'

import loader from 'img/loader.png'

import Button from 'common/Button/Button'

import './ProofCreation.less'

class ProofCreation extends Component {
  render () {
    const { visible, analysing, inputting, isMobile, onAddAnotherFile } = this.props

    const className = classNames('proofCreation', {
      'proofCreation--visible': visible,
      'proofCreation--analysing': analysing,
      'proofCreation--inputting': inputting
    })

    return (
      <div className={ns(className)}>
        <div className={ns('proofCreation-icon')}>
          <img src={loader} alt='Loader' role='presentation' />
        </div>

        <div className={ns('proofCreation-hint')}>File analyzed</div>
        <div className={ns('proofCreation-title')}>Creating a proof...</div>
        <div className={ns('proofCreation-text')}>
            It takes up to 90 minutes to create a proof. Leave the page open, the proof will be available for
            download when ready.
        </div>

        <div className={ns('proofCreation-button')}>
          <Button type='primary' title='Add another file' grow={isMobile} onClick={onAddAnotherFile} />
        </div>
      </div>
    )
  }
}

export default ProofCreation
