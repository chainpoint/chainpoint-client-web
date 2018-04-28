import React, { Component } from 'react';
import classNames from 'classnames';
import SvgInline from 'react-inlinesvg';

import Button from 'common/Button/Button';
import tickWhite from 'svg/tick-white.svg';
import notVerified from 'svg/not-verified.svg';
import { ProofAppContext } from 'ProofApp';

import './VerifyStatus.less';

class VerifyStatus extends Component {
    render() {
        const { visible, verifySuccess, analysing, inputting, filename, onAddAnotherVerify, isMobile } = this.props;

        const className = classNames('VerifyStatus', {
            'VerifyStatus--visible': visible,
            'VerifyStatus--analysing': analysing,
            'VerifyStatus--inputting': inputting,
            'VerifyStatus--success': verifySuccess,
            'VerifyStatus--fail': !verifySuccess
        });

        return (
            <div className={className}>
                <header className="VerifyStatus-header">
                    <div className="VerifyStatus-icon">
                        {verifySuccess ? <SvgInline src={tickWhite} /> : <SvgInline src={notVerified} />}
                    </div>
                    <div className="VerifyStatus-title">{verifySuccess ? 'File Verified' : 'File not Verified'}</div>
                    <div className="VerifyStatus-filename">{filename}</div>
                </header>

                <div className="VerifyStatus-text">
                    {verifySuccess ? (
                        <span>
                            Some text explaining that the file has a correct record in the blockchain that proves its
                            timestamp and integrity.
                        </span>
                    ) : (
                        <span>
                            Some text explaining that the file does not have a correct record in the blockchain.
                        </span>
                    )}
                </div>

                <div className="VerifyStatus-button">
                    <Button type="solid" grow={isMobile} title="Verify another file" onClick={onAddAnotherVerify} />
                </div>
            </div>
        );
    }
}

export default props => (
    <ProofAppContext.Consumer>
        {({ isMobile }) => <VerifyStatus {...props} isMobile={isMobile} />}
    </ProofAppContext.Consumer>
);
