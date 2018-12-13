import React from 'react';
import ReactDOM from 'react-dom';

import {createPopup, POPUP_ROOT_ID} from 'common/popupUtils';
import ProofApp from 'ProofApp';

require('index.css');
require('fonts.less');

const extractAttrs = () => {
    return {
        onAppearCreate: () => {},
        onAppearVerify: () => {},
        onChangeProofCount: () => {},
        onChangeCreateStatus: () => {},
        onChangeVerifyFailStatus: () => {},
        onChangeVerifyAnalysisStatus: () => {},
        onChangeVerifySuccessStatus: () => {}
    };
};

const startApplication = (root, props) => {
    ReactDOM.render(
        <ProofApp {...props} />,
        root
    );
};

const initApplication = () => {
    const root = document.getElementById('root');
    let popupRoot = document.getElementById(POPUP_ROOT_ID);

    if (!popupRoot) {
        createPopup(POPUP_ROOT_ID);
    }

    if (window.chrome) {
        document.documentElement.classList.add('isChrome');
    }

    const attrs = extractAttrs();
    startApplication(root, attrs);
};

/**
 * Expose init method to window; used if render needs to occur after DOM load
 */
window.$ChainpointClient = {
  init: function() {
    initApplication();
  }
};

document.addEventListener('DOMContentLoaded', initApplication);
