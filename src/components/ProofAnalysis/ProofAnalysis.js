import React, { Component } from 'react';
import classNames from 'classnames';
import ns from 'utils/ns';

import loader from 'img/loader.png';

import './ProofAnalysis.less';

class ProofAnalysis extends Component {
    render() {
        const { visible, creating, dropzoneActive } = this.props;

        const className = classNames('proofAnalysis', {
            'proofAnalysis--visible': visible,
            'proofAnalysis--creating': creating,
            'proofAnalysis--dropzoneActive': dropzoneActive
        });

        return (
            <div className={ns(className)}>
                <div className={ns("proofAnalysis-icon")}>
                    <img src={loader} alt="Loader" role="presentation" />
                </div>

                <div className={ns("proofAnalysis-text")}>Analyzing your file…</div>
            </div>
        );
    }
}

export default ProofAnalysis;
