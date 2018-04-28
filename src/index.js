import React from 'react';
import ReactDOM from 'react-dom';

import {createPopup, POPUP_ROOT_ID} from 'common/popup';
import ProofApp from 'ProofApp';

import {
    AVAILABLE_DATA_ATTRS,
    APP_NAME
} from './config';

require('fonts.less');

const extractAttrs = (root) => {
    const stub = () => {};
    return AVAILABLE_DATA_ATTRS.reduce((acc, attr) => {
        const data = root.getAttribute(`data-${attr}`);

        acc[attr] = data || stub;
        return acc;
    }, {});
};

const startApplication = (root, props) => {
    ReactDOM.render(
        <ProofApp {...props} />,
        root
    );
};

const initApplication = () => {
    const root = document.getElementById(APP_NAME);
    if (!root) {
        throw new Error(`Container with id ${APP_NAME} doesn't exists`);
    }

    let popupRoot = document.getElementById(POPUP_ROOT_ID);
    if (!popupRoot) {
        createPopup(POPUP_ROOT_ID);
    }

    if (window.chrome) {
        document.documentElement.classList.add('isChrome');
    }

    const attrs = extractAttrs(root);
    startApplication(root, attrs);
};

document.addEventListener('DOMContentLoaded', initApplication);
