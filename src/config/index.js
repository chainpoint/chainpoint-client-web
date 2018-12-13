/**
 * ID for root node in which
 * application will renders.
 * @type {string}
 */
export const APP_NAME = 'chainpoint-client-web'

/**
 * Available [data-*] attributes for root container.
 * This attributes reflects ProofApp Components props.
 * @type {string[]}
 */
export const AVAILABLE_DATA_ATTRS = [
  'onAppearCreate',
  'onAppearVerify',
  'onChangeProofCount',
  'onChangeCreateStatus',
  'onChangeVerifyFailStatus',
  'onChangeVerifySuccessStatus',
  'onChangeVerifyAnalysisStatus'
]

export const CSS_PREFIX = 'CCW'

export const CHP_INIT_SYNTHETIC_EVENT_CLASSNAME = 'chainpoint_web_client_init'
