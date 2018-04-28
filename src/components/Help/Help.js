import React, { Component } from 'react';
import classNames from 'classnames';

import './Help.less';

class Help extends Component {
    render() {
        const { visible } = this.props;

        let className = classNames('Help', {
            'Help--visible': visible
        });

        return (
            <div className={className}>
                <ol className="Help-list">
                    <li className="Help-item">
                        We won’t upload your file, just create a hash for it and link it to the Bitcoin blockchain.
                    </li>
                    <li className="Help-item">
                        The proof is everlasting & independently verifiable from anywhere in the world.
                    </li>
                    <li className="Help-item">
                        It takes up to 90 minutes to create a proof. Leave the page open or provide your email and we'll
                        followup.
                    </li>
                    <li className="Help-item">We accept all types of files.</li>
                </ol>
            </div>
        );
    }
}

export default Help;
