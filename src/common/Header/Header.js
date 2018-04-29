import React, { Component } from 'react';
import ns from 'utils/ns';

import './Header.less';

class Header extends Component {
    render() {
        return <header className={ns("header")}>{this.props.children}</header>;
    }
}

export default Header;
