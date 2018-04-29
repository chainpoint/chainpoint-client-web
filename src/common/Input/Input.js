import React, { Component } from 'react';
import classNames from 'classnames';
import ns from 'utils/ns';

import './Input.less';

class Input extends Component {
    onChange = e => {
        const value = e.target.value;

        this.props.onChange(value);
    };

    render() {
        const { value, placeholder, placeholderCentered, isValid, errorMessage } = this.props;

        const className = classNames('input', {
            'input--isInvalid': !isValid,
            'input--placeholderCentered': placeholderCentered
        });

        return (
            <div className={ns(className)}>
                <input
                    type="text"
                    className={ns("input-input")}
                    placeholder={placeholder}
                    value={value}
                    onChange={this.onChange}
                />
                <div className={ns("input-border")} />
                {errorMessage && <div className={ns("input-error")}>{errorMessage}</div>}
            </div>
        );
    }
}

Input.defaultProps = {
    isValid: true,
    placeholderCentered: false
};

export default Input;
