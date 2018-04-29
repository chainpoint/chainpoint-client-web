import React, { Component } from 'react';
import ns from 'utils/ns';

import spinner from 'img/spinner.png';

import './Spinner.less';

class Spinner extends Component {
    render() {
        return (
            <div className={ns("spinner")}>
                <img src={spinner} alt="Spinner" role="presentation" />
            </div>
        );
    }
}

export default Spinner;
