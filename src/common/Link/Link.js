import React, { Component } from 'react';
import classNames from 'classnames';

import './Link.less';

class Link extends Component {
    render() {
        const { href, contrast, children } = this.props;

        const className = classNames('Link', {
            'Link--contrast': contrast
        });

        return (
            <a target="_blank" className={className} href={href}>
                {children}
            </a>
        );
    }
}

export default Link;
