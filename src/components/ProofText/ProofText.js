import React, { Component } from 'react'
import fecha from 'fecha'
import AnimateHeight from 'react-animate-height'
import ns from 'utils/ns'

import Button from 'common/Button/Button'
import { ProofAppContext } from 'ProofApp'

import './ProofText.less'

const DATE_FORMAT = 'MM/DD/YYYY HH:mma'

const ProofTextList = ({ proof }) => {
  const isCalReady = proof.proofStatus.cal.isReady
  const isBtcReady = proof.proofStatus.btc.isReady
  let idText =
    isCalReady && proof.proofs && proof.proofs.length
      ? proof.proofs[0].hashIdNode
      : 'Waiting for chp node to return hash id'

  return (
    <div>
      <div className={ns('proofText-row proofText-id')}>
        <div className={ns('proofText-name')}>ID:</div>
        <div className={ns('proofText-value')}>{idText}</div>
      </div>

      <div className={ns('proofText-row')}>
        <div className={ns('proofText-name')}>File:</div>
        <div className={ns('proofText-value')}>{proof.filename}</div>
      </div>

      <div className={ns('proofText-row')}>
        <div className={ns('proofText-name')}>Hash:</div>
        <div className={ns('proofText-value')}>{proof.hash}</div>
      </div>

      <div className={ns('proofText-row')}>
        <div className={ns('proofText-name')}>Submitted:</div>
        <div className={ns('proofText-value')}>
          {fecha.format(proof.date, DATE_FORMAT)}
        </div>
      </div>

      <div className={ns('proofText-row')}>
        <div className={ns('proofText-name')}>Status:</div>
        <div className={ns('proofText-value')}>
          {isCalReady
            ? isBtcReady
              ? 'Done'
              : 'Creating bitcoin proof'
            : 'Creating calendar proof'}
        </div>
      </div>
    </div>
  )
}

class ProofTextDropdown extends Component {
  state = {
    height: 0
  }

  toggle = () => {
    const { height } = this.state

    this.setState({
      height: height === 0 ? 'auto' : 0
    })
  }

  render() {
    const { proof } = this.props

    return (
      <div>
        <div className={ns('proofText-row')}>
          <div className={ns('proofText-name')}>Name</div>
          <div className={ns('proofText-value')}>{proof.filename}</div>
        </div>

        <AnimateHeight duration={500} height={this.state.height}>
          <div className={ns('proofText-dropdown')}>
            <div className={ns('proofText-row')}>
              <div className={ns('proofText-name')}>ID</div>
              <div className={ns('proofText-value')}>{proof.id}</div>
            </div>

            <div className={ns('proofText-row')}>
              <div className={ns('proofText-name')}>HASH</div>
              <div className={ns('proofText-value')}>{proof.hash}</div>
            </div>

            <div className={ns('proofText-row')}>
              <div className={ns('proofText-name')}>Date</div>
              <div className={ns('proofText-value')}>
                {fecha.format(proof.date, DATE_FORMAT)}
              </div>
            </div>
          </div>
        </AnimateHeight>

        <div className={ns('proofText-button')}>
          {this.state.height === 0 ? (
            <Button
              type="flat"
              small={true}
              uppercase={false}
              title="More details"
              suffixIcon="arrowDown"
              onClick={this.toggle}
            />
          ) : (
            <Button
              type="flat"
              small={true}
              uppercase={false}
              title="Less details"
              suffixIcon="arrowUp"
              onClick={this.toggle}
            />
          )}
        </div>
      </div>
    )
  }
}

class ProofText extends Component {
  render() {
    const { proof, isMobile } = this.props

    return (
      <div className={ns('proofText')}>
        {isMobile ? (
          <ProofTextDropdown proof={proof} />
        ) : (
          <ProofTextList proof={proof} />
        )}
      </div>
    )
  }
}

export default props => (
  <ProofAppContext.Consumer>
    {({ isMobile }) => <ProofText {...props} isMobile={isMobile} />}
  </ProofAppContext.Consumer>
)
