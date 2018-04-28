import React, { Component } from 'react';
import classNames from 'classnames';

import loader from 'img/loader.png';

import './ProofAnalysis.less';

class ProofAnalysis extends Component {
    render() {
        const { visible, creating, dropzoneActive } = this.props;

        const className = classNames('ProofAnalysis', {
            'ProofAnalysis--visible': visible,
            'ProofAnalysis--creating': creating,
            'ProofAnalysis--dropzoneActive': dropzoneActive
        });

        return (
            <div className={className}>
                <div className="ProofAnalysis-icon">
                    <img src={loader} alt="Loader" role="presentation" />
                </div>

                <div className="ProofAnalysis-text">Analyzing your file…</div>
            </div>
        );
    }
}

export default ProofAnalysis;
