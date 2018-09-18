import React, { Component } from 'react'
import classNames from 'classnames'
import ns from 'utils/ns'

import loader from 'img/loader.png'
import loaderFailed from 'img/loader-failed.png'

import './ProofAnalysis.less'

class ProofAnalysis extends Component {
  render() {
    const { visible, creating, dropzoneActive, failed, onRetry } = this.props

    const className = classNames('proofAnalysis', {
      'proofAnalysis--visible': visible,
      'proofAnalysis--creating': creating,
      'proofAnalysis--dropzoneActive': dropzoneActive,
      'proofAnalysis--failed': failed
    })

    return (
      <div className={ns(className)}>
        <div className={ns('proofAnalysis-icon')}>
          <img
            src={!failed ? loader : loaderFailed}
            alt="Loader"
            role="presentation"
          />
        </div>

        {!failed ? (
          <div className={ns('proofAnalysis-text')}>Analyzing your file…</div>
        ) : (
          <div className={ns('proofAnalysis-text')}>
            <span>Analysis Failed.</span>
            <span className={ns('proofAnalysis-retry')}>
              <a onClick={onRetry}>Retry</a>
            </span>
          </div>
        )}
      </div>
    )
  }
}

export default ProofAnalysis
