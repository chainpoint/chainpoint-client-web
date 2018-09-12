import React, { Component } from 'react'
import classNames from 'classnames'
import ns from 'utils/ns'
import SvgInline from 'react-inlinesvg'

import Popup from 'common/Popup/Popup'
// import ButtonIcon from 'common/ButtonIcon/ButtonIcon'
import MyProofs from 'components/MyProofs/MyProofs'
import ProofInfo from 'components/ProofInfo/ProofInfo'
import Header from 'common/Header/Header'

import cross from 'svg/cross.svg'
import back from 'svg/arr-back-big.svg'
import './ProofPopup.less'

class ProofPopup extends Component {
  onShowProofPopup() {
    this.props.onShowProofPopup(null)
  }
  render() {
    const {
      onShowProofPopup,
      onDownloadProof,
      popupProofId,
      onHidePopup,
      proofs
    } = this.props
    let proof = null

    if (popupProofId !== null) {
      proof = proofs.filter(proof => {
        return proof.id === popupProofId
      })[0]

      // const isCalReady = proof.proofStatus.cal.isReady
      // const isBtcReady = proof.proofStatus.btc.isReady
      // const isProofReady = isCalReady && isBtcReady
    }

    const className = classNames('proofPopup', {
      'proofPopup--myProofs': proof === null,
      'proofPopup--proofInfo': proof !== null
    })

    // add a back button if we're on the individual proofs screen
    // TODO: componentize this stuff, popup-back and popup-close refer to
    // styles defined in Popup.less
    const header = (
      <Header>
        {proof ? (
          <button
            onClick={this.onShowProofPopup.bind(this)}
            className={ns('popup-back')}
          >
            <img src={back} alt="back arrow" />
          </button>
        ) : null}
        <span>All Proofs {proof ? null : `(${proofs.length})`}</span>
        <button className={ns('popup-close')} onClick={onHidePopup}>
          <SvgInline src={cross} />
        </button>
      </Header>
    )

    return (
      <Popup
        onHidePopup={onHidePopup}
        header={header}
        className={proof && ns(`popup--proofInfo`)}
      >
        <div className={ns(className)}>
          {proof ? (
            <div className={ns('proofPopup-item')}>
              <ProofInfo
                proof={proof}
                onDownloadProof={onDownloadProof}
                onShowProofPopup={onShowProofPopup}
              />
            </div>
          ) : (
            <div className={ns('proofPopup-list')}>
              <MyProofs
                proofs={proofs}
                onDownloadProof={onDownloadProof}
                onShowProofPopup={onShowProofPopup}
              />
            </div>
          )}
        </div>
      </Popup>
    )
  }
}

export default ProofPopup
