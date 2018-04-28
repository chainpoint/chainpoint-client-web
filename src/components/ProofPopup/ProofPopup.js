import React, { Component } from 'react';
import classNames from 'classnames';

import Popup from 'common/Popup/Popup';
import MyProofs from 'components/MyProofs/MyProofs';
import ProofInfo from 'components/ProofInfo/ProofInfo';

import './ProofPopup.less';

class ProofPopup extends Component {
    render() {
        const {
            onShowProofPopup,
            onDownloadProof,
            popupProofId,
            onHidePopup,
            proofs
        } = this.props;
        let proof = null;
        let header = 'My proofs';

        if (popupProofId !== null) {
            proof = proofs.filter(proof => {
                return proof.id === popupProofId;
            })[0];

            const isCalReady = proof.proofStatus.cal.isReady;
            const isBtcReady = proof.proofStatus.btc.isReady;
            const isProofReady = isCalReady && isBtcReady;

            header = isProofReady ? 'Proof is ready' : 'Proof is being created';
        }

        const className = classNames('ProofPopup', {
            'ProofPopup--myProofs': proof === null,
            'ProofPopup--proofInfo': proof !== null
        });

        return (
            <Popup onHidePopup={onHidePopup} header={header} className={proof && `Popup--proofInfo`}>
                <div className={className}>
                    {proof ? (
                        <div className="ProofPopup-item">
                            <ProofInfo
                                proof={proof}
                                onDownloadProof={onDownloadProof}
                                onShowProofPopup={onShowProofPopup}
                            />
                        </div>
                    ) : (
                        <div className="ProofPopup-list">
                            <MyProofs
                                proofs={proofs}
                                onDownloadProof={onDownloadProof}
                                onShowProofPopup={onShowProofPopup}
                            />
                        </div>
                    )}
                </div>
            </Popup>
        );
    }
}

export default ProofPopup;
