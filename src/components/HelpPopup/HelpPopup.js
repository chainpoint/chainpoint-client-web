import React, { Component } from 'react';
import ns from 'utils/ns';

import Popup from 'common/Popup/Popup';
import Help from 'components/Help/Help';

import './HelpPopup.less';

class HelpPopup extends Component {
    render() {
        const { onHidePopup } = this.props;

        return (
            <Popup onHidePopup={onHidePopup} header="Help: Create a Proof">
                <div className={ns("helpPopup")}>
                    <Help visible={true} />
                </div>
            </Popup>
        );
    }
}

export default HelpPopup;
