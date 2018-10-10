import React, { Component } from 'react'
import SvgInline from 'react-inlinesvg'
import ns from 'utils/ns'

import Button from 'common/Button/Button'
import Spinner from 'components/Spinner/Spinner'
import ProofDetails from 'components/ProofDetails/ProofDetails'
import ProofCode from 'components/ProofCode/ProofCode'
import ready from 'svg/ready.svg'
import { ProofAppContext } from 'ProofApp'

import './ProofInfo.less'

class ProofInfo extends Component {
  state = {
    topOpacity: 1,
    bottomOpacity: 1,
    height: 0,
    successCopyVisible: false,
    detailsView: true
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

  toggleView = () => {
    this.setState({
      detailsView: !this.state.detailsView
    })
  }

  render() {
    const { proof, onDownloadProof } = this.props
    const { detailsView } = this.state
    const isCalReady = proof.proofStatus.cal.isReady
    const isBtcReady = proof.proofStatus.btc.isReady

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
            <div className={ns('proofInfo-header')}>
              <div className={ns('proofInfo-buttons')}>
                <Button
                  type="download"
                  title="Download proof"
                  onClick={e => onDownloadProof(e, proof)}
                />
              </div>
              <div className={ns('proofInfo-anchors')}>
                <h3>Anchors:</h3>
                <div className={ns('proofInfo-status-calendar')}>
                  {isCalReady ? <SvgInline src={ready} /> : <Spinner />}
                  <span className={ns('proofInfo-status-label')}>Calendar</span>
                </div>
                <div className={ns('proofInfo-status-bitcoin')}>
                  {isBtcReady ? <SvgInline src={ready} /> : <Spinner />}
                  <span className={ns('proofInfo-status-label')}>Bitcoin</span>
                </div>
              </div>
            </div>

            <div className={ns('proofInfo-toggle')}>
              <span
                className={ns('proofInfo-toggle-button')}
                onClick={this.toggleView}
              >
                {detailsView ? 'View Code' : 'View Details'}
              </span>
            </div>

            {detailsView ? (
              <ProofDetails
                proof={proof}
                isCalReady={isCalReady}
                isBtcReady={isBtcReady}
              />
            ) : (
              <ProofCode proof={proof} />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default props => (
  <ProofAppContext.Consumer>
    {({ isMobile }) => <ProofInfo {...props} isMobile={isMobile} />}
  </ProofAppContext.Consumer>
)
