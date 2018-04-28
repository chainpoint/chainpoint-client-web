import React, { Component } from 'react';
import classNames from 'classnames';

import './Input.less';

class Input extends Component {
    onChange = e => {
        const value = e.target.value;

        this.props.onChange(value);
    };

    render() {
        const { value, placeholder, placeholderCentered, isValid, errorMessage } = this.props;

        const className = classNames('Input', {
            'Input--isInvalid': !isValid,
            'Input--placeholderCentered': placeholderCentered
        });

        return (
            <div className={className}>
                <input
                    type="text"
                    className="Input-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={this.onChange}
                />
                <div className="Input-border" />
                {errorMessage && <div className="Input-error">{errorMessage}</div>}
            </div>
        );
    }
}

Input.defaultProps = {
    isValid: true,
    placeholderCentered: false
};

export default Input;
