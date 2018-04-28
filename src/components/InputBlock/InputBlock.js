import React, { Component } from 'react';

import './InputBlock.less';

class InputBlock extends Component {
    render() {
        return <div className="InputBlock">{this.props.children}</div>;
    }
}

export default InputBlock;
