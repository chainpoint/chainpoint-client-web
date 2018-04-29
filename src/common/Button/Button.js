import React from 'react';
import classNames from 'classnames';
import SvgInline from 'react-inlinesvg';
import { Link } from 'react-router-dom';

import arrowBack from 'svg/arr-back.svg';
import tick from 'svg/tick-white.svg';
import ns from 'utils/ns';

import './Button.less';

const PREFIX_ICONS = {
    arrowBack: arrowBack,
    tick: tick
};

const SUFFIX_ICONS = {
    arrowDown: arrowBack,
    arrowUp: arrowBack
};

class Button extends React.Component {
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

        const className = classNames('button', `button--${type}`, {
            'button--uppercase': uppercase,
            'button--grow': grow,
            'button--small': small,
            'button--successVisible': successVisible,
            [`button--prefixIcon-${prefixIcon}`]: prefixIcon,
            [`button--suffixIcon-${suffixIcon}`]: suffixIcon,
            [`button--prefixIconSuccess-${prefixIconSuccess}`]: prefixIconSuccess
        });

        return (
            // aria-label is for screen readers, to prevent them from reading
            // presentational css pseudo elements
            <ButtonElement className={ns(className)} to={to} aria-label={title} disabled={disabled} onClick={onClick}>
                <span className={ns("button-content")}>
                    {prefixIcon && (
                        <span className={ns("button-prefixIcon")}>
                            <SvgInline src={PREFIX_ICONS[prefixIcon]} />
                        </span>
                    )}
                    <span className={ns("button-inner")}>{title}</span>
                    {suffixIcon && (
                        <span className={ns("button-suffixIcon")}>
                            <SvgInline src={SUFFIX_ICONS[suffixIcon]} />
                        </span>
                    )}
                </span>

                {successTitle && (
                        <span className={ns("button-success")}>
                            {prefixIconSuccess && (
                                <span className={ns("button-prefixIconSuccess")}>
                                    <SvgInline src={PREFIX_ICONS[prefixIconSuccess]} />
                                </span>
                            )}
                            <span className={ns("button-innerSuccess")}>{successTitle}</span>
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
