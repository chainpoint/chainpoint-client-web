import React, { Component } from 'react'
import fecha from 'fecha'
import SvgInline from 'react-inlinesvg'
import ns from 'utils/ns'

import Spinner from 'components/Spinner/Spinner'
import Button from 'common/Button/Button'
import ButtonIcon from 'common/ButtonIcon/ButtonIcon'

import ready from 'svg/ready.svg'
import { ProofAppContext } from 'ProofApp'

import './MyProofs.less'

const DATE_FORMAT = 'MM/DD/YYYY HH:mma'

class MyProofs extends Component {
  constructor(props) {
    super(props)

    this.state = {
      topOpacity: 1,
      bottomOpacity: 1,
      height: 0
    }
  }

  onScroll = e => {
    const scroll = this.scrollNode.scrollTop
    const height = this.scrollNode.getBoundingClientRect().height
    const contentHeight = this.scrollNode.scrollHeight

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

  onShowProofItemPopup = e => {
    let id = parseInt(e.currentTarget.getAttribute('data-id'), 10)

    this.props.onShowProofPopup(id)
  }

  render() {
    const { proofs, isMobile, isLaptop, onDownloadProof } = this.props

    return (
      <div
        className={ns('myProofs')}
        ref={node => (this.scrollNode = node)}
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
        <ul className={ns('myProofs-list')}>
          {proofs.map(proof => {
            const isCalReady = proof.proofStatus.cal.isReady
            const isBtcReady = proof.proofStatus.btc.isReady

            return (
              <li className={ns('myProofs-item')} key={proof.id}>
                <div
                  className={ns('myProofs-itemButton')}
                  onClick={this.onShowProofItemPopup}
                  data-id={proof.id}
                >
                  <div className={ns('myProofs-itemTitle')}>
                    {proof.filename}
                  </div>
                  <div className={ns('myProofs-itemCalendarStatus')}>
                    {isCalReady ? <SvgInline src={ready} /> : <Spinner />}
                    <span>Chainpoint Calendar</span>
                  </div>
                  <div className={ns('myProofs-itemBtcStatus')}>
                    {isBtcReady ? <SvgInline src={ready} /> : <Spinner />}
                    <span>BTC</span>
                  </div>
                  <div className={ns('myProofs-itemDate')}>
                    {fecha.format(proof.date, DATE_FORMAT)}
                  </div>
                  <div className={ns('myProofs-itemStatus')}>
                    {isBtcReady ? (
                      <ButtonIcon
                        icon="arrowDown"
                        onClick={e => onDownloadProof(e, proof)}
                      />
                    ) : (
                      <span>
                        <div className={ns('myProofs-statusSpinner')}>
                          <Spinner />
                        </div>
                        <span className={ns('myProofs-statusText')}>
                          result within
                        </span>{' '}
                        <span className={ns('myProofs-statusTime')}>
                          ~90 min
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default props => (
  <ProofAppContext.Consumer>
    {({ isMobile, isLaptop }) => (
      <MyProofs {...props} isMobile={isMobile} isLaptop={isLaptop} />
    )}
  </ProofAppContext.Consumer>
)
