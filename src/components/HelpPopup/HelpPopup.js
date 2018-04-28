import React, { Component } from 'react';

import Popup from 'common/Popup/Popup';
import Help from 'components/Help/Help';

import './HelpPopup.less';

class HelpPopup extends Component {
    render() {
        const { onHidePopup } = this.props;

        return (
            <Popup onHidePopup={onHidePopup} header="Help: Create a Proof">
                <div className="HelpPopup">
                    <Help visible={true} />
                </div>
            </Popup>
        );
    }
}

export default HelpPopup;
