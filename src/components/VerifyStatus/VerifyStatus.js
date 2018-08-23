import React, { Component } from 'react'
import classNames from 'classnames'
import SvgInline from 'react-inlinesvg'
import ns from 'utils/ns'

import Button from 'common/Button/Button'
import tickWhite from 'svg/tick-white.svg'
import notVerified from 'svg/not-verified.svg'
import { ProofAppContext } from 'ProofApp'

import './VerifyStatus.less'

class VerifyStatus extends Component {
  render () {
    const { visible, verifySuccess, analysing, inputting, filename, onAddAnotherVerify, isMobile } = this.props

    const className = classNames('verifyStatus', {
      'verifyStatus--visible': visible,
      'verifyStatus--analysing': analysing,
      'verifyStatus--inputting': inputting,
      'verifyStatus--success': verifySuccess,
      'verifyStatus--fail': !verifySuccess
    })

    return (
      <div className={ns(className)}>
        <header className={ns('verifyStatus-header')}>
          <div className={ns('verifyStatus-icon')}>
            {verifySuccess ? <SvgInline src={tickWhite} /> : <SvgInline src={notVerified} />}
          </div>
          <div className={ns('verifyStatus-title')}>{verifySuccess ? 'File Verified' : 'File not Verified'}</div>
          <div className={ns('verifyStatus-filename')}>{filename}</div>
        </header>

        <div className={ns('verifyStatus-text')}>
          {verifySuccess ? (
            <span>
                Some text explaining that the file has a correct record in the blockchain that proves its
                timestamp and integrity.
            </span>
          ) : (
            <span>
                Some text explaining that the file does not have a correct record in the blockchain.
            </span>
          )}
        </div>

        <div className={ns('verifyStatus-button')}>
          <Button type='solid' grow={isMobile} title='Verify another file' onClick={onAddAnotherVerify} />
        </div>
      </div>
    )
  }
}

export default props => (
  <ProofAppContext.Consumer>
    {({ isMobile }) => <VerifyStatus {...props} isMobile={isMobile} />}
  </ProofAppContext.Consumer>
)
