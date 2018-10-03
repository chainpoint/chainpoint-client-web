import React, { Component } from 'react'
import classNames from 'classnames'
import SvgInline from 'react-inlinesvg'
import ns from 'utils/ns'

// import Button from 'common/Button/Button'
// import ButtonIcon from 'common/ButtonIcon/ButtonIcon'
// import tickWhite from 'svg/tick-white.svg'
// import notVerified from 'svg/not-verified.svg'
import { ProofAppContext } from 'ProofApp'

import './VerifyStatus.less'
import chpIcon from '../../svg/verify.svg'
import createIcon from '../../svg/create.svg'
import close from '../../svg/close.svg'
import check from '../../svg/ready.svg'
class VerifyStatus extends Component {
  render() {
    const {
      visible,
      verifySuccess,
      analysing,
      inputting,
      file,
      originalData,
      onAddAnotherVerify,
      onBrowseFiles,
      currentProof
      // isMobile
    } = this.props

    const className = classNames('verifyStatus', {
      'verifyStatus--visible': visible,
      'verifyStatus--analysing': analysing,
      'verifyStatus--inputting': inputting,
      'verifyStatus--success': verifySuccess,
      'verifyStatus--fail': !verifySuccess
    })

    // 3 states for footer, add file (default), success, fail
    const iconSrc =
      originalData === null ? createIcon : originalData ? check : close

    const footerClassName = classNames('verifyStatus-footer', {
      'verifyStatus-original--fail': originalData === false,
      'verifyStatus-original--success': originalData === true
    })

    return (
      <div className={ns(className)}>
        <div className={ns('verifyStatus-close')}>
          <button onClick={onAddAnotherVerify}>
            <SvgInline src={close} />
          </button>
        </div>
        <header className={ns('verifyStatus-header')}>
          <img
            src={verifySuccess ? chpIcon : close}
            alt="chainpoint icon"
            className={ns('verifyStatus-icon')}
          />
          <div className={ns('verifyStatus-details')}>
            <h3>
              {verifySuccess
                ? 'PROOF IS VERIFIED'
                : 'ERROR - PROOF NOT VERIFIED'}
            </h3>
            {verifySuccess ? (
              <div>
                <span>ID:</span> {currentProof.hashId}
              </div>
            ) : null}
            <p>
              {verifySuccess ? (
                <React.Fragment>
                  This Chainpoint proof is anchored to the{' '}
                  {currentProof.type === 'btc'
                    ? 'Bitcoin blockchain '
                    : 'Chainpoint calendar '}
                  in <b>block {currentProof.anchorId}.</b>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <b>Error message:</b> could not find a merkle root with enough
                  power for the flux capacitor.
                </React.Fragment>
              )}
            </p>
          </div>
        </header>
        {verifySuccess ? (
          <footer className={ns(footerClassName)}>
            <SvgInline
              src={iconSrc}
              alt="chainpoint icon"
              className={ns('verifyStatus-icon')}
            />
            <div className={ns('verifyStatus-details')}>
              {originalData === null ? (
                <React.Fragment>
                  <h4>
                    <span>Original Data Verification </span>
                    (Optional)
                  </h4>
                  <p>Verify your proof against a copy of the original data.</p>
                  <p>
                    Drag &amp; drop or <a onClick={onBrowseFiles}>browse</a>{' '}
                    your files.{' '}
                  </p>
                  <p>
                    Your file will not be uploaded, just analyzed in the
                    browser.
                  </p>
                </React.Fragment>
              ) : originalData ? (
                <React.Fragment>
                  <h4>SUCCESS!</h4>
                  <p className={ns('verifyStatus-filename')}>
                    File: {file.name}
                  </p>
                  <p>
                    This file matches the original data used to create this
                    Chainpoint proof.
                  </p>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <h4>DOES NOT MATCH!</h4>
                  <p className={ns('verifyStatus-filename')}>
                    File: {file.name}
                  </p>
                  <p>
                    This file does not match the original data used to create
                    this Chainpoint proof.
                    <br />
                    <a onClick={onBrowseFiles}>Try another file.</a>
                  </p>
                </React.Fragment>
              )}
            </div>
          </footer>
        ) : null}
      </div>
    )
  }
}

export default props => (
  <ProofAppContext.Consumer>
    {({ isMobile }) => <VerifyStatus {...props} isMobile={isMobile} />}
  </ProofAppContext.Consumer>
)
