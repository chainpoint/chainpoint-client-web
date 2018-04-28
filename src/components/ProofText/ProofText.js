import React, { Component } from 'react';
import fecha from 'fecha';
import AnimateHeight from 'react-animate-height';

import Button from 'common/Button/Button';
import { ProofAppContext } from 'ProofApp';

import './ProofText.less';

const DATE_FORMAT = 'MM/DD/YYYY HH:mma';

const ProofTextList = ({ proof }) => {
    return (
        <div>
            <div className="ProofText-row">
                <div className="ProofText-name">Name</div>
                <div className="ProofText-value">{proof.filename}</div>
            </div>

            <div className="ProofText-row">
                <div className="ProofText-name">ID</div>
                <div className="ProofText-value">{proof.id}</div>
            </div>

            <div className="ProofText-row">
                <div className="ProofText-name">HASH</div>
                <div className="ProofText-value">{proof.hash}</div>
            </div>

            <div className="ProofText-row">
                <div className="ProofText-name">Date</div>
                <div className="ProofText-value">{fecha.format(proof.date, DATE_FORMAT)}</div>
            </div>
        </div>
    );
};

class ProofTextDropdown extends Component {
    state = {
        height: 0
    };

    toggle = () => {
        const { height } = this.state;

        this.setState({
            height: height === 0 ? 'auto' : 0
        });
    };

    render() {
        const { proof } = this.props;

        return (
            <div>
                <div className="ProofText-row">
                    <div className="ProofText-name">Name</div>
                    <div className="ProofText-value">{proof.filename}</div>
                </div>

                <AnimateHeight duration={500} height={this.state.height}>
                    <div className="ProofText-dropdown">
                        <div className="ProofText-row">
                            <div className="ProofText-name">ID</div>
                            <div className="ProofText-value">{proof.id}</div>
                        </div>

                        <div className="ProofText-row">
                            <div className="ProofText-name">HASH</div>
                            <div className="ProofText-value">{proof.hash}</div>
                        </div>

                        <div className="ProofText-row">
                            <div className="ProofText-name">Date</div>
                            <div className="ProofText-value">{fecha.format(proof.date, DATE_FORMAT)}</div>
                        </div>
                    </div>
                </AnimateHeight>

                <div className="ProofText-button">
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
        );
    }
}

class ProofText extends Component {
    render() {
        const { proof, isMobile } = this.props;

        return (
            <div className="ProofText">
                {isMobile ? <ProofTextDropdown proof={proof} /> : <ProofTextList proof={proof} />}
            </div>
        );
    }
}

export default props => (
    <ProofAppContext.Consumer>
        {({ isMobile }) => <ProofText {...props} isMobile={isMobile} />}
    </ProofAppContext.Consumer>
);
