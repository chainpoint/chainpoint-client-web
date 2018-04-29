import React, { Component } from 'react';
import classNames from 'classnames';
import ns from 'utils/ns';

import './Help.less';

class Help extends Component {
    render() {
        const { visible } = this.props;

        let className = classNames('help', {
            'help--visible': visible
        });

        return (
            <div className={ns(className)}>
                <ol className={ns("help-list")}>
                    <li className={ns("help-item")}>
                        We won’t upload your file, just create a hash for it and link it to the Bitcoin blockchain.
                    </li>
                    <li className={ns("help-item")}>
                        The proof is everlasting & independently verifiable from anywhere in the world.
                    </li>
                    <li className={ns("help-item")}>
                        It takes up to 90 minutes to create a proof. Leave the page open or provide your email and we'll
                        followup.
                    </li>
                    <li className={ns("help-item")}>We accept all types of files.</li>
                </ol>
            </div>
        );
    }
}

export default Help;
