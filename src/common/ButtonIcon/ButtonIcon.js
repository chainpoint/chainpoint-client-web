import React, { Component } from 'react';
import classNames from 'classnames';
import SvgInline from 'react-inlinesvg';

import arrowDown from 'svg/arrow-down.svg';
import help from 'svg/help.svg';

import './ButtonIcon.less';

const ICONS = {
    help: help,
    arrowDown: arrowDown
};

class ButtonIcon extends Component {
    render() {
        const { icon, onClick } = this.props;

        const className = classNames('ButtonIcon', `ButtonIcon--${icon}`);

        return (
            <button className={className} onClick={onClick}>
                <span className="ButtonIcon-icon">
                    <SvgInline src={ICONS[icon]} />
                </span>
            </button>
        );
    }
}

export default ButtonIcon;
