import React, { Component } from 'react';
import classNames from 'classnames';
import SvgInline from 'react-inlinesvg';
import { Link } from 'react-router-dom';

import arrowBack from 'svg/arr-back.svg';
import tick from 'svg/tick-white.svg';

import './Button.less';

const PREFIX_ICONS = {
    arrowBack: arrowBack,
    tick: tick
};

const SUFFIX_ICONS = {
    arrowDown: arrowBack,
    arrowUp: arrowBack
};

class Button extends Component {
    render() {
        const {
            to,
            type,
            title,
            disabled,
            uppercase,
            grow,
            small,
            successVisible,
            successTitle,
            onClick,
            prefixIcon,
            prefixIconSuccess,
            suffixIcon
        } = this.props;

        let ButtonElement = 'button';
        if (to) {
            ButtonElement = Link;
        }

        const className = classNames('Button', `Button--${type}`, {
            'Button--uppercase': uppercase,
            'Button--grow': grow,
            'Button--small': small,
            'Button--successVisible': successVisible,
            [`Button--prefixIcon-${prefixIcon}`]: prefixIcon,
            [`Button--suffixIcon-${suffixIcon}`]: suffixIcon,
            [`Button--prefixIconSuccess-${prefixIconSuccess}`]: prefixIconSuccess
        });

        return (
            // aria-label is for screen readers, to prevent them from reading
            // presentational css pseudo elements
            <ButtonElement className={className} to={to} aria-label={title} disabled={disabled} onClick={onClick}>
                <span className="Button-content">
                    {prefixIcon && (
                        <span className="Button-prefixIcon">
                            <SvgInline src={PREFIX_ICONS[prefixIcon]} />
                        </span>
                    )}
                    <span className="Button-inner">{title}</span>
                    {suffixIcon && (
                        <span className="Button-suffixIcon">
                            <SvgInline src={SUFFIX_ICONS[suffixIcon]} />
                        </span>
                    )}
                </span>

                {successTitle && (
                        <span className="Button-success">
                            {prefixIconSuccess && (
                                <span className="Button-prefixIconSuccess">
                                    <SvgInline src={PREFIX_ICONS[prefixIconSuccess]} />
                                </span>
                            )}
                            <span className="Button-innerSuccess">{successTitle}</span>
                        </span>
                    )}
            </ButtonElement>
        );
    }
}

Button.defaultProps = {
    type: 'solid',
    contrast: false,
    uppercase: true,
    disabled: false,
    grow: false,
    small: false
};

export default Button;
