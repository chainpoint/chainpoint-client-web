import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SvgInline from 'react-inlinesvg';

import Header from 'common/Header/Header';
import { POPUP_ROOT_ID } from 'common/popupUtils';
import cross from 'svg/cross.svg';
import ns from 'utils/ns';

import './Popup.less';

const ESCAPE_CODE = 27;

class Popup extends Component {
    constructor(props) {
        super(props);

        // Create a div that we'll render the modal into. Because each
        // Popup component has its own element, we can render multiple
        // modal components into the modal container.
        this.el = document.createElement('div');
        this.popupRoot = document.getElementById(POPUP_ROOT_ID);

        this.state = {
            mounted: false
        };
    }

    componentDidMount() {
        // Append the element into the DOM on mount.
        this.popupRoot.appendChild(this.el);

        this.setState({
            mounted: true
        });

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this.escFunction, false);
    }

    componentDidUpdate() {
        // this.popupNode.style.position = 'absolute';
        // this.popupNode.style.top = '0px';
        // this.popupNode.style.height = '100vh';
    }

    componentWillUnmount() {
        // Remove the element from the DOM when we unmount
        if (this.el) {
            this.popupRoot.removeChild(this.el);
        }

        document.body.style.overflow = 'visible';
        document.removeEventListener('keydown', this.escFunction, false);
    }

    escFunction = e => {
        if (e.keyCode === ESCAPE_CODE) {
            this.props.onHidePopup();
        }
    };

    render() {
        const { header, onHidePopup, className } = this.props;

        // Use a portal to render the children into the element
        return ReactDOM.createPortal(
            // Any valid React child: JSX, strings, arrays, etc.
            this.state.mounted ? (
                <div className={ns(`popup ${className}`)} ref={node => (this.popupNode = node)}>
                    <div className={ns("popup-inner")}>
                        <div className={ns("popup-overlay")} onClick={onHidePopup} />

                        <div className={ns("popup-content")}>
                            <button className={ns("popup-close")} onClick={onHidePopup}>
                                <SvgInline src={cross} />
                            </button>

                            {header && (
                                <div className={ns("popup-header")}>
                                    <Header>{header}</Header>
                                </div>
                            )}

                            <div className={ns("popup-body")}>{this.props.children}</div>
                        </div>
                    </div>
                </div>
            ) : null,
            // A DOM element
            this.el
        );
    }
}

export default Popup;
