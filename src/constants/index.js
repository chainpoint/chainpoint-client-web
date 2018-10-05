export const PROOF_PROXY_BASE_URI = 'https://proofs.chainpoint.org'
export const PROOF_PROXY_BASE_URL = {
  SUBMIT: `${PROOF_PROXY_BASE_URI}/proofs`,
  GET: `${PROOF_PROXY_BASE_URI}/proofs`
}
export const STORAGE_KEY = 'proof-app-state'
export const BLOCKCHAIN = [
  {
    id: 'btc',
    retryInterval: 1000 * 60 * 10,
    sleepBeforeFirstRequest: 1000 * 60 * 90
  },
  {
    id: 'cal',
    retryInterval: 1000 * 60,
    sleepBeforeFirstRequest: 12000
  }
]
