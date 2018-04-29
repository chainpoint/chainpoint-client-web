import React, { Component } from 'react';
import fecha from 'fecha';
import ns from 'utils/ns';

import Button from 'common/Button/Button';
import ButtonIcon from 'common/ButtonIcon/ButtonIcon';
import Spinner from 'components/Spinner/Spinner';

import './ProofList.less';
import { ProofAppContext } from 'ProofApp';

const DATE_FORMAT = 'MM/DD/YYYY HH:mma';
const PROOFS_TO_SHOW = 3;

class ProofList extends Component {
    onShowProofPopup = () => {
        this.props.onShowProofPopup();
    };

    onShowProofItemPopup = e => {
        let id = parseInt(e.currentTarget.getAttribute('data-id'), 10);

        this.props.onShowProofPopup(id);
    };

    render() {
        const { proofs, isMobile, onDownloadProof } = this.props;

        let height = 0;
        if (this.innerNode && proofs.length !== 0) {
            const rowHeight = isMobile ? 80 : 48;
            const showPopupHeight = isMobile ? 56 : 48;
            const innerStyle = window.getComputedStyle(this.innerNode);

            height =
                Math.min(proofs.length, PROOFS_TO_SHOW) * rowHeight +
                parseInt(innerStyle.paddingTop, 10) +
                parseInt(innerStyle.paddingBottom, 10);

            if (proofs.length > 3) {
                height += showPopupHeight;
            }
        }

        return (
            <div className={ns("proofList")} style={{ height }}>
                <div className={ns("proofList-inner")} ref={node => (this.innerNode = node)}>
                    <ul className={ns("proofList-list")}>
                        {proofs.slice(0, PROOFS_TO_SHOW).map(proof => {
                            const isBtcReady = proof.proofStatus.btc.isReady;

                            return (
                                <li className={ns("proofList-item")} key={proof.id}>
                                    <div
                                        className={ns("proofList-itemButton")}
                                        onClick={this.onShowProofItemPopup}
                                        data-id={proof.id}
                                    >
                                        <div className={ns("proofList-itemTitle")}>{proof.filename}</div>
                                        <div className={ns("proofList-itemDate")}>
                                            {fecha.format(proof.date, DATE_FORMAT)}
                                        </div>
                                        <div className={ns("proofList-itemStatus")}>
                                            {isBtcReady ? (
                                                isMobile ? (
                                                    <ButtonIcon
                                                        icon="arrowDown"
                                                        onClick={(e) => onDownloadProof(e, proof)}
                                                    />
                                                ) : (
                                                    <Button
                                                        title="Download"
                                                        type="flat"
                                                        onClick={(e) => onDownloadProof(e, proof)}
                                                    />
                                                )
                                            ) : (
                                                <span>
                                                    <div className={ns("proofList-statusSpinner")}>
                                                        <Spinner />
                                                    </div>
                                                    <span className={ns("proofList-statusText")}>result within</span>{' '}
                                                    <span className={ns("proofList-statusTime")}>~90 min</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {proofs.length > PROOFS_TO_SHOW && (
                        <div className={ns("proofList-showPopup")}>
                            <Button
                                title={`${proofs.length - PROOFS_TO_SHOW} more proof${proofs.length > 4 ? 's' : ''}`}
                                type="flat"
                                uppercase={false}
                                onClick={this.onShowProofPopup}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default props => (
    <ProofAppContext.Consumer>
        {({ isMobile }) => <ProofList {...props} isMobile={isMobile} />}
    </ProofAppContext.Consumer>
);
