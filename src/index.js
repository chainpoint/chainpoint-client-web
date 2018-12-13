import React from 'react'
import ReactDOM from 'react-dom'

import {createPopup, POPUP_ROOT_ID} from 'common/popupUtils'
import ProofApp from 'ProofApp'

import {
  AVAILABLE_DATA_ATTRS,
  APP_NAME,
  CHP_INIT_SYNTHETIC_EVENT_CLASSNAME
} from './config'

require('fonts.less')

const extractAttrs = (root) => {
  const stub = () => {}
  return AVAILABLE_DATA_ATTRS.reduce((acc, attr) => {
    let globFn
    const data = root.getAttribute(`data-${attr}`)
    if (data) {
      globFn = window[data]
    }

    acc[attr] = typeof globFn === 'function' ? globFn : stub
    return acc
  }, {})
}

const startApplication = (root, props) => {
  ReactDOM.render(
    <ProofApp {...props} />,
    root
  )
}

const initApplication = () => {
  const root = document.getElementById(APP_NAME)
  if (!root) {
    throw new Error(`Container with id ${APP_NAME} doesn't exists`)
  }

  let popupRoot = document.getElementById(POPUP_ROOT_ID)
  if (!popupRoot) {
    createPopup(POPUP_ROOT_ID)
  }

  if (window.chrome) {
    document.documentElement.classList.add('isChrome')
  }

  const attrs = extractAttrs(root)
  startApplication(root, attrs)
}

// When Chainpoint-client-web bundle is loaded by the browser, invoke this IIFE to determine if
// a Chp-client-web specific syntehtic event should be emitted to bootstrap the client.
(function() {
  const root = document.getElementById(APP_NAME)

  root.addEventListener('@CHPWEB/DOMContentLoaded', initApplication)

  if (!root) {
    throw new Error(`Container with id ${APP_NAME} doesn't exists`)
  }

  const classList = Array.from(root.classList)
  if (classList.includes(CHP_INIT_SYNTHETIC_EVENT_CLASSNAME)) {
    let event = new window.Event('@CHPWEB/DOMContentLoaded')

    root.dispatchEvent(event);
  }
})()

document.addEventListener('DOMContentLoaded', initApplication)