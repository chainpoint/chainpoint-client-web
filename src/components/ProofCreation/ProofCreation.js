import React, { Component } from 'react';
import classNames from 'classnames';

import loader from 'img/loader.png';

import Button from 'common/Button/Button';

import './ProofCreation.less';

class ProofCreation extends Component {
    render() {
        const { visible, analysing, inputting, isMobile, onAddAnotherFile } = this.props;

        const className = classNames('ProofCreation', {
            'ProofCreation--visible': visible,
            'ProofCreation--analysing': analysing,
            'ProofCreation--inputting': inputting
        });

        return (
            <div className={className}>
                <div className="ProofCreation-icon">
                    <img src={loader} alt="Loader" role="presentation" />
                </div>

                <div className="ProofCreation-hint">File analyzed</div>
                <div className="ProofCreation-title">Creating a proof...</div>
                <div className="ProofCreation-text">
                    It takes up to 90 minutes to create a proof. Leave the page open, the proof will be available for
                    download when ready.
                </div>

                <div className="ProofCreation-button">
                    <Button type="primary" title="Add another file" grow={isMobile} onClick={onAddAnotherFile} />
                </div>
            </div>
        );
    }
}

export default ProofCreation;
