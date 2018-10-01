import React, { Component } from 'react'
import classNames from 'classnames'
import ns from 'utils/ns'

import './Help.less'

class Help extends Component {
  render() {
    const { visible } = this.props

    let className = classNames('help', {
      'help--visible': visible
    })

    return (
      <div className={ns(className)}>
        <h5 className={ns('help-heading')}>CREATE PROOF</h5>
        <ol className={ns('help-list')}>
          <li className={ns('help-item')}>
            Select a file, or used "advanced" to submit a hash.
          </li>
          <li className={ns('help-item')}>
            Creating a complete Chainpoint proof takes approximately 90 minutes.
          </li>
          <li className={ns('help-item')}>
            It's safe to leave and return later to download your complete proof.
          </li>
        </ol>
        <h5 className={ns('help-heading')}>VERIFY PROOF</h5>
        <ol className={ns('help-list')}>
          <li className={ns('help-item')}>
            Select Chainpoint proof file (.CHP) to verify.
          </li>
          <li className={ns('help-item')}>
            This app will analyze the proof and check if it’s anchored to the
            blockchain.
          </li>
          <li className={ns('help-item')}>
            Optional - choose a file to compare
          </li>
        </ol>
      </div>
    )
  }
}

export default Help
