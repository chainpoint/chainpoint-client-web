import React, { Component } from 'react'
import SvgInline from 'react-inlinesvg'
import { getFormattedJSON, convertToLDJSON } from '../../utils/API'
import ns from 'utils/ns'

import Button from 'common/Button/Button'
import ProofText from 'components/ProofText/ProofText'
import Spinner from 'components/Spinner/Spinner'
import ready from 'svg/ready.svg'
import { ProofAppContext } from 'ProofApp'

import './ProofInfo.less'

class ProofInfo extends Component {
  state = {
    topOpacity: 1,
    bottomOpacity: 1,
    height: 0,
    successCopyVisible: false
  }

  onChange = e => {
    const value = e.target.value

    this.props.onChange(value)
  }

  onCopy = () => {
    const isSuccessfull = this.copy()

    if (!isSuccessfull) {
      return
    }

    this.setState({
      successCopyVisible: true
    })

    setTimeout(() => {
      this.setState({
        successCopyVisible: false
      })
    }, 2500)
  }

  onScroll = e => {
    const scroll = this.textarea.scrollTop
    const height = this.textarea.getBoundingClientRect().height
    const contentHeight = this.textarea.scrollHeight

    if (contentHeight - (scroll + height) > 40) {
      this.setState({
        bottomOpacity: 0,
        height
      })
    } else {
      this.setState({
        bottomOpacity: 1 - (contentHeight - (scroll + height)) / 40,
        height
      })
    }

    if (scroll > 40) {
      this.setState({
        topOpacity: 0,
        height
      })
    } else {
      this.setState({
        topOpacity: 1 - scroll / 40,
        height
      })
    }
  }

  onShowProofPopup = () => {
    this.props.onShowProofPopup()
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

  getAnchorsFromFormattedProof(ldJson) {
    const proofJson = JSON.parse(ldJson)
    let anchors = {}

    if (proofJson && proofJson.branches) {
      const calBranch = proofJson.branches.find(
        branch => branch.label === 'cal_anchor_branch'
      )
      const calAnchorOp = calBranch && calBranch.ops.find(op => op.anchors)

      anchors.cal =
        (calAnchorOp && calAnchorOp.anchors && calAnchorOp.anchors[0]) || null

      const btcBranch =
        calBranch &&
        calBranch.branches &&
        calBranch.branches.find(branch => branch.label === 'btc_anchor_branch')

      const btcAnchorOp = btcBranch && btcBranch.ops.find(op => op.anchors)
      anchors.btc =
        (btcAnchorOp && btcAnchorOp.anchors && btcAnchorOp.anchors[0]) || null
    }
    return anchors
  }

  render() {
    const { proof, isMobile, onDownloadProof } = this.props
    const isCalReady = proof.proofStatus.cal.isReady
    const isBtcReady = proof.proofStatus.btc.isReady
    const hasEnoughInfo = isCalReady || isBtcReady

    const proofLDJson = this.getFormattedProof(proof)
    const anchors = hasEnoughInfo
      ? this.getAnchorsFromFormattedProof(proofLDJson)
      : {}

    return (
      <div className={ns('proofInfo')}>
        <div
          className={ns('proofInfo-content')}
          ref={node => (this.textarea = node)}
          onScroll={this.onScroll}
          style={{
            WebkitMask: `linear-gradient(0deg, rgba(255,255,255,${
              this.state.bottomOpacity
            }) 0px, rgba(255,255,255,1) 102px, rgba(255,255,255,1) ${this.state
              .height - 109}px, rgba(255,255,255,${this.state.topOpacity}))`,
            mask: `linear-gradient(0deg, rgba(255,255,255,${
              this.state.bottomOpacity
            }) 0px, rgba(255,255,255,1) 102px, rgba(255,255,255,1) ${this.state
              .height - 109}px, rgba(255,255,255,${this.state.topOpacity}))`
          }}
        >
          <div className={ns('proofInfo-info')}>
            <div className={ns('proofInfo-infoText')}>
              <ProofText
                proof={proof}
                isCalReady={isCalReady}
                isBtcReady={isBtcReady}
              />
            </div>

            <div className={ns('proofInfo-infoStatusList')}>
              <h3>Anchors</h3>
              <div className={ns('proofInfo-infoStatus')}>
                {isCalReady ? <SvgInline src={ready} /> : <Spinner />}
                <span className={ns('proofInfo-infoStatusLink')}>
                  Calendar
                  {isCalReady ? (
                    <span>
                      &nbsp;|{' '}
                      <a target="_blank" href={anchors.cal.uris[0]}>
                        block {anchors.cal.anchor_id}
                      </a>
                    </span>
                  ) : null}
                </span>
              </div>
              <div className={ns('proofInfo-infoStatus')}>
                {isBtcReady ? <SvgInline src={ready} /> : <Spinner />}
                <span className={ns('proofInfo-infoStatusLink')}>
                  Bitcoin
                  {isBtcReady ? (
                    <span>
                      &nbsp;|{' '}
                      <a
                        target="_blank"
                        rel="noopener"
                        href={`https://api.blockcypher.com/v1/btc/main/blocks/${
                          anchors.btc.anchor_id
                        }`}
                      >
                        block {anchors.btc.anchor_id}
                      </a>
                    </span>
                  ) : null}
                </span>
              </div>
            </div>
          </div>

          {hasEnoughInfo && (
            <React.Fragment>
              <div className={ns('proofInfo-code')}>
                {!isMobile && (
                  <div className={ns('proofInfo-codeControls')}>
                    <Button
                      type="primary"
                      title="Copy code"
                      successTitle="Code copied"
                      prefixIconSuccess="tick"
                      successVisible={this.state.successCopyVisible}
                      onClick={this.onCopy}
                      className={ns('proofInfo-copyButton')}
                    />
                    <Button
                      type="download"
                      title="Download proof"
                      onClick={e => onDownloadProof(e, proof)}
                    />
                  </div>
                )}

                <div className={ns('proofInfo-codeBody')}>{proofLDJson}</div>
              </div>
            </React.Fragment>
          )}
        </div>

        {isMobile && (
          <div>
            {hasEnoughInfo && (
              <div className={ns('proofInfo-codeControls')}>
                <Button
                  type="primary"
                  title="Copy code"
                  successTitle="Code copied"
                  prefixIconSuccess="tick"
                  successVisible={this.state.successCopyVisible}
                  onClick={this.onCopy}
                />
                <Button
                  type="download"
                  title="Download"
                  onClick={e => onDownloadProof(e, proof)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default props => (
  <ProofAppContext.Consumer>
    {({ isMobile }) => <ProofInfo {...props} isMobile={isMobile} />}
  </ProofAppContext.Consumer>
)
