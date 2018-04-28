export const POPUP_ROOT_ID = 'proof-popup-root';

export function createPopup(popupId) {
    let popupEl = document.createElement('div');
    popupEl.setAttribute('id', popupId);
    document.body.appendChild(popupEl);
}
