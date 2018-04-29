import React, { Component } from 'react';
import classNames from 'classnames';
import SvgInline from 'react-inlinesvg';
import ns from 'utils/ns';

import drop from 'svg/drop.svg';

import './DropMessage.less';

class DropMessage extends Component {
    render() {
        const { visible, analysing } = this.props;

        const className = classNames('dropMessage', {
            'dropMessage--analysing': analysing,
            'dropMessage--visible': visible
        });

        return (
            <div className={ns(className)}>
                <div className={ns("dropMessage-icon")}>
                    <SvgInline src={drop} />
                </div>
                <div className={ns("dropMessage-title")}>Release the mouse to drop a file.</div>
                <div className={ns("dropMessage-text")}>Your file will not be uploaded, just analyzed in the browser.</div>
            </div>
        );
    }
}

DropMessage.defaultProps = {
    visible: false
};

export default DropMessage;
