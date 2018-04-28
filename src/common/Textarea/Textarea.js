import React, { Component } from 'react';
import classNames from 'classnames';
import ContainerDimensions from 'react-container-dimensions';
import TextareaAutosize from 'react-textarea-autosize';

import './Textarea.less';

class Textarea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            topOpacity: 1,
            bottomOpacity: 1
        };
    }

    onChange = e => {
        const value = e.target.value;

        this.props.onChange(value);
    };

    onScroll = e => {
        const scroll = this.textarea.scrollTop;
        const height = this.textarea.getBoundingClientRect().height;
        const contentHeight = this.textarea.scrollHeight;

        if (contentHeight - (scroll + height) > 40) {
            this.setState({
                bottomOpacity: 0
            });
        } else {
            this.setState({
                bottomOpacity: 1 - (contentHeight - (scroll + height)) / 40
            });
        }

        if (scroll > 40) {
            this.setState({
                topOpacity: 0
            });
        } else {
            this.setState({
                topOpacity: 1 - scroll / 40
            });
        }
    };

    // componentDidMount() {
    // this.onScroll();
    // }

    render() {
        const { placeholder, value, placeholderCentered, grow, disabled, maxHeight } = this.props;

        const characterCount = value.length;

        const className = classNames('Textarea', {
            'Textarea--text-large': characterCount < 40,
            'Textarea--text-medium': characterCount >= 40 && characterCount < 200,
            'Textarea--text-small': characterCount >= 200,
            'Textarea--placeholderCentered': placeholderCentered,
            'Textarea--grow': grow
        });

        return (
            <div className={className}>
                <ContainerDimensions>
                    {({ height }) => {
                        return (
                            <TextareaAutosize
                                inputRef={node => (this.textarea = node)}
                                className="Textarea-input"
                                placeholder={placeholder}
                                value={value}
                                onChange={this.onChange}
                                onScroll={this.onScroll}
                                disabled={disabled}
                                style={{
                                    maxHeight,
                                    WebkitMask: `linear-gradient(0deg, rgba(255,255,255,${this.state.bottomOpacity}) 0px, rgba(255,255,255,1) 102px, rgba(255,255,255,1) 109px, rgba(255,255,255,${this.state.topOpacity}))`,
                                    mask: `linear-gradient(0deg, rgba(255,255,255,${this.state.bottomOpacity}) 0px, rgba(255,255,255,1) 102px, rgba(255,255,255,1) 109px, rgba(255,255,255,${this.state.topOpacity}))`
                                }}
                            />
                        );
                    }}
                </ContainerDimensions>
                <div className="Textarea-border" />
            </div>
        );
    }
}

Textarea.defaultProps = {
    disabled: false,
    maxHeight: 200,
    placeholderCentered: false,
    grow: false
};

export default Textarea;
