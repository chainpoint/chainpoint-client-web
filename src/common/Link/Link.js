import React, { Component } from 'react';
import classNames from 'classnames';
import ns from 'utils/ns';

import './Link.less';

class Link extends Component {
    render() {
        const { href, contrast, children } = this.props;

        const className = classNames('link', {
            'link--contrast': contrast
        });

        return (
            <a target="_blank" className={ns(className)} href={href}>
                {children}
            </a>
        );
    }
}

export default Link;
