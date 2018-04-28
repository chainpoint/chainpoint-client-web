import React, { Component } from 'react';
import SvgInline from 'react-inlinesvg';
import {
    getFormattedJSON,
    convertToLDJSON
} from '../../utils/API';

import Button from 'common/Button/Button';
import ProofText from 'components/ProofText/ProofText';
import Spinner from 'components/Spinner/Spinner';
import ready from 'svg/ready.svg';
import arrowBackBig from 'svg/arr-back-big.svg';
import { ProofAppContext } from 'ProofApp';

import './ProofInfo.less';

class ProofInfo extends Component {
    state = {
        topOpacity: 1,
        bottomOpacity: 1,
        height: 0,
        successCopyVisible: false
    };

    onChange = e => {
        const value = e.target.value;

        this.props.onChange(value);
    };

    onCopy = () => {
        const isSuccessfull = this.copy();

        if (!isSuccessfull) {
            return;
        }

        this.setState({
            successCopyVisible: true
        });

        setTimeout(() => {
            this.setState({
                successCopyVisible: false
            });
        }, 2500);
    };

    onScroll = e => {
        const scroll = this.textarea.scrollTop;
        const height = this.textarea.getBoundingClientRect().height;
        const contentHeight = this.textarea.scrollHeight;

        if (contentHeight - (scroll + height) > 40) {
            this.setState({
                bottomOpacity: 0,
                height
            });
        } else {
            this.setState({
                bottomOpacity: 1 - (contentHeight - (scroll + height)) / 40,
                height
            });
        }

        if (scroll > 40) {
            this.setState({
                topOpacity: 0,
                height
            });
        } else {
            this.setState({
                topOpacity: 1 - scroll / 40,
                height
            });
        }
    };

    onShowProofPopup = () => {
        this.props.onShowProofPopup();
    };

    /**
     * Copies proof ld-json to clipboard
     * @returns {boolean}
     */
    copy() {
        const {proof} = this.props;

        if (!proof.proofData) {
            return false;
        }

        const ldJSON = convertToLDJSON(proof.proofData);
        if (!ldJSON) {
            return false;
        }

        const fakeInput = document.createElement('input');

        // hides the input
        fakeInput.id = 'fakeCopy';
        fakeInput.style.position = 'absolute';
        fakeInput.style.bottom = '-1000px';
        fakeInput.style.left = '-1000px';
        fakeInput.value = JSON.stringify(ldJSON);

        document.body.appendChild(fakeInput);

        fakeInput.select();
        document.execCommand('copy');

        document.body.removeChild(fakeInput);
        return true;
    }

    /**
     * Returns formatted ld-json of proof
     * @param {Object} proof
     * @returns {string|void}
     */
    getFormattedProof(proof) {
        const {proofData} = proof;

        if (!proofData) {
            return;
        }

        const ldJSON = convertToLDJSON(proofData);
        if (!ldJSON) {
            return;
        }

        return getFormattedJSON(ldJSON);
    }

    /**
     * Returns title for proof code
     * @param {boolean} isCalReady
     * @param {boolean} isBtcReady
     * @returns {string|void}
     */
    getProofCodeTitle(isCalReady, isBtcReady) {
        if (isBtcReady) {
            return 'Bitcoin proof';
        }

        if (isCalReady) {
            return 'Chainpoint calendar proof';
        }

        return;
    }

    render() {
        const { proof, isMobile, onDownloadProof } = this.props;
        const isCalReady = proof.proofStatus.cal.isReady;
        const isBtcReady = proof.proofStatus.btc.isReady;
        const hasEnoughInfo = isCalReady || isBtcReady;

        const proofLDJson = this.getFormattedProof(proof);
        const codeTitle = this.getProofCodeTitle(isCalReady, isBtcReady);

        return (
            <div className="ProofInfo">
                <div className="ProofInfo-backButton">
                    <Button
                        type="flat"
                        title="All proofs"
                        uppercase={false}
                        prefixIcon="arrowBack"
                        onClick={this.onShowProofPopup}
                    />
                </div>

                <div
                    className="ProofInfo-content"
                    ref={node => (this.textarea = node)}
                    onScroll={this.onScroll}
                    style={{
                        WebkitMask: `linear-gradient(0deg, rgba(255,255,255,${
                            this.state.bottomOpacity
                            }) 0px, rgba(255,255,255,1) 102px, rgba(255,255,255,1) ${this.state.height -
                        109}px, rgba(255,255,255,${this.state.topOpacity}))`,
                        mask: `linear-gradient(0deg, rgba(255,255,255,${
                            this.state.bottomOpacity
                            }) 0px, rgba(255,255,255,1) 102px, rgba(255,255,255,1) ${this.state.height -
                        109}px, rgba(255,255,255,${this.state.topOpacity}))`
                    }}
                >
                    <div className="ProofInfo-info">
                        <div className="ProofInfo-infoText">
                            <ProofText proof={proof} />
                        </div>

                        <div className="ProofInfo-infoStatusList">
                            {!isBtcReady && (
                                <div className="ProofInfo-infoStatus">
                                    <span>
                                        <span className="MyProofs-statusTime">~90 min</span>{' '}
                                        <span className="MyProofs-statusText">left</span>
                                    </span>
                                </div>
                            )}
                            <div className="ProofInfo-infoStatus">
                                {isCalReady ? <SvgInline src={ready} /> : <Spinner />}
                                <span>Chainpoint Calendar Proof</span>
                            </div>
                            <div className="ProofInfo-infoStatus">
                                {isBtcReady ? <SvgInline src={ready} /> : <Spinner />}
                                <span>Bitcoin Proof</span>
                            </div>
                        </div>
                    </div>

                    {hasEnoughInfo && (
                        <React.Fragment>
                            <hr className="ProofInfo-hr" />

                            <div className="ProofInfo-code">
                                <div className="ProofInfo-codeHeader">{codeTitle}</div>

                                {!isMobile && (
                                    <div className="ProofInfo-codeControls">
                                        <Button
                                            type="flat"
                                            title="Copy code"
                                            successTitle="Code copied"
                                            prefixIconSuccess="tick"
                                            successVisible={this.state.successCopyVisible}
                                            onClick={this.onCopy}
                                        />
                                        <Button
                                            type="flat"
                                            title="Download proof"
                                            onClick={(e) => onDownloadProof(e, proof)}
                                        />
                                    </div>
                                )}

                                <div className="ProofInfo-codeBody">{proofLDJson}</div>
                            </div>
                        </React.Fragment>
                    )}

                </div>

                {isMobile && (
                    <div>
                        {hasEnoughInfo && (
                            <div className="ProofInfo-codeControls">
                                <Button
                                    type="solid"
                                    title="Copy code"
                                    successTitle="Code copied"
                                    prefixIconSuccess="tick"
                                    successVisible={this.state.successCopyVisible}
                                    onClick={this.onCopy}
                                />
                                <Button
                                    type="solid"
                                    title="Download"
                                    onClick={(e) => onDownloadProof(e, proof)}
                                />
                            </div>
                        )}

                        <button className="ProofInfo-backButtonIcon" onClick={this.onShowProofPopup}>
                            <SvgInline src={arrowBackBig} />
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default props => (
    <ProofAppContext.Consumer>
        {({ isMobile }) => <ProofInfo {...props} isMobile={isMobile} />}
    </ProofAppContext.Consumer>
);
