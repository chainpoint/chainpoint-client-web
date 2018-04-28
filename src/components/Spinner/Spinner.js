import React, { Component } from 'react';

import spinner from 'img/spinner.png';

import './Spinner.less';

class Spinner extends Component {
    render() {
        return (
            <div className="Spinner">
                <img src={spinner} alt="Spinner" role="presentation" />
            </div>
        );
    }
}

export default Spinner;
