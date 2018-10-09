import React, { Component } from 'react'
import fecha from 'fecha'
import ns from 'utils/ns'

import Button from 'common/Button/Button'
import ButtonIcon from 'common/ButtonIcon/ButtonIcon'
import Spinner from 'components/Spinner/Spinner'

import './ProofList.less'
import { ProofAppContext } from 'ProofApp'
import { validateSha256 as validateHash } from 'utils/validation'

const DATE_FORMAT = 'MM/DD/YYYY HH:mma'
const PROOFS_TO_SHOW = 3

class ProofList extends Component {
  onShowProofPopup = () => {
    this.props.onShowProofPopup()
  }

  onShowProofItemPopup = e => {
    let id = e.currentTarget.getAttribute('data-id')
    this.props.onShowProofPopup(id)
  }

  componentDidMount () => {
    alert()
  }

  render() {
    const { proofs, isMobile, onDownloadProof } = this.props

    return (
      <div className={ns('proofList')}>
        <div
          className={ns('proofList-inner')}
          ref={node => (this.innerNode = node)}
        >
          <ul className={ns('proofList-list')}>
            <li className={ns('proofList-items-header')}>
              <div className={ns('proofList-header')}>
                <div className={ns('proofList-headerTitle')}>ID</div>
                {!isMobile && (
                  <div className={ns('proofList-headerDate')}>Submitted</div>
                )}
                <div className={ns('proofList-headerStatus')}>Status</div>
              </div>
            </li>
            {proofs.slice(0, PROOFS_TO_SHOW).map(proof => {
              const isBtcReady = proof.proofStatus.btc.isReady
              const idText =
                proof.proofStatus.cal.isReady &&
                proof.proofs &&
                proof.proofs.length
                  ? proof.proofs[0].hashIdNode
                  : 'Waiting for chp node to return hash id'

              const eta = isBtcReady
                ? 0
                : (Date.now() - (proof.date.getTime() + 90 * 6e4)) / 6e4

              const isHash = validateHash(proof.filename)

              return (
                <li className={ns('proofList-item')} key={proof.id}>
                  <div
                    className={ns('proofList-itemButton')}
                    onClick={this.onShowProofItemPopup}
                    data-id={proof.id}
                  >
                    <div className={ns('proofList-itemTitle')}>
                      <div className={ns('proofList-itemId')}>{idText}</div>
                      <div className={ns('proofList-itemName')}>
                        {`${isHash ? 'hash:' : 'file:'} ${proof.filename}`}
                      </div>
                    </div>

                    {!isMobile && (
                      <div className={ns('proofList-itemDate')}>
                        {fecha.format(proof.date, DATE_FORMAT)}
                      </div>
                    )}

                    <div className={ns('proofList-itemStatus')}>
                      {isBtcReady ? (
                        <ButtonIcon
                          icon="arrowDown"
                          onClick={e => onDownloadProof(e, proof)}
                        />
                      ) : (
                        <span>
                          <div className={ns('proofList-statusSpinner')}>
                            <Spinner />
                          </div>
                          <span className={ns('proofList-statusText')} />{' '}
                          <span className={ns('proofList-statusTime')}>
                            ~ {parseInt(Math.abs(eta), 10)} min
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {proofs.length > PROOFS_TO_SHOW && (
            <div
              className={ns('proofList-showPopup')}
              onClick={this.onShowProofPopup}
            >
              <Button
                title={`View All Proofs`}
                type="link"
                uppercase={false}
                onClick={this.onShowProofPopup}
              />
              <span>({proofs.length})</span>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default props => (
  <ProofAppContext.Consumer>
    {({ isMobile }) => <ProofList {...props} isMobile={isMobile} />}
  </ProofAppContext.Consumer>
)
