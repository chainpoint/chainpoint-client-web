/**
 * ID for root node in which
 * application will renders.
 * @type {string}
 */
export const APP_NAME = 'proof-app-client';

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
	'onChangeVerifyAnalysisStatus',
	'onChangeVerifySuccessStatus'
];
