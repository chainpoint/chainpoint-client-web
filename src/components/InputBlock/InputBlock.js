import React, { Component } from 'react';
import ns from 'utils/ns';

import './InputBlock.less';

class InputBlock extends Component {
    render() {
        return <div className={ns("inputBlock")}>{this.props.children}</div>;
    }
}

export default InputBlock;
