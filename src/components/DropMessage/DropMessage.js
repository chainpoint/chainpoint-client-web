import React, { Component } from 'react';
import classNames from 'classnames';
import SvgInline from 'react-inlinesvg';

import drop from 'svg/drop.svg';

import './DropMessage.less';

class DropMessage extends Component {
    render() {
        const { visible, analysing } = this.props;

        const className = classNames('DropMessage', {
            'DropMessage--analysing': analysing,
            'DropMessage--visible': visible
        });

        return (
            <div className={className}>
                <div className="DropMessage-icon">
                    <SvgInline src={drop} />
                </div>
                <div className="DropMessage-title">Release the mouse to drop a file.</div>
                <div className="DropMessage-text">Your file will not be uploaded, just analyzed in the browser.</div>
            </div>
        );
    }
}

DropMessage.defaultProps = {
    visible: false
};

export default DropMessage;
