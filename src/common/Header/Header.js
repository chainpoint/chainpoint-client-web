import React, { Component } from 'react';

import './Header.less';

class Header extends Component {
    render() {
        return <header className="Header">{this.props.children}</header>;
    }
}

export default Header;
