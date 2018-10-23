import React, { Component } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import set from 'lodash/set'
import { createPopup, POPUP_ROOT_ID } from 'common/popupUtils'
import VisibilitySensor from 'react-visibility-sensor'
import withSizes from 'react-sizes'
import fileDownload from 'js-file-download'
import ns from 'utils/ns'

import ProofPopup from 'components/ProofPopup/ProofPopup'
import CreateAndVerify from 'components/CreateAndVerify/CreateAndVerify'
import { WIDTH_MOBILE, WIDTH_LAPTOP } from 'common/const'
import { STORAGE_KEY, BLOCKCHAIN } from './constants'
import { convertsToBinary, convertToLDJSON, checkProofs } from './utils/API'
import { sleep } from './utils/sleep'

import './ProofApp.less'

export const ProofAppContext = React.createContext({
  isMobile: false,
  isLaptop: false
})

class ProofApp extends Component {
  /**
   * Returns the inital state of Proof
   * @return {Object}
   */
  getProofInitialState = () => ({
    id: null,
    hash: null,
    nodes: [],
    proofs: [],
    isReady: false,
    filename: null,
    proofData: null,
    date: new Date(),
    proofStatus: {
      cal: {
        isReady: false,
        tryCount: 0,
        lastTry: null
      },
      btc: {
        isReady: false,
        tryCount: 0,
        lastTry: null
      }
    }
  })

  constructor(props) {
    super(props)

    let popupRoot = document.getElementById(POPUP_ROOT_ID)
    if (!popupRoot) {
      createPopup(POPUP_ROOT_ID)
    }

    let proofs = []
    try {
      const savedProofs = localStorage.getItem(STORAGE_KEY)
      if (savedProofs) {
        proofs = this.restoreData(savedProofs)
      }
    } catch (exception) {
      console.log(
        "Please enable your browser's localStorage to enable proof storage and retrieval"
      )
    }

    this.state = {
      proofs,
      popupVisible: false,
      popupProofId: null
    }
    this.initPollingProcess(proofs)
  }

  /**
   * Proof add handler.
   * Save proof in store.
   * @param filename
   * @param hash
   * @param handles
   * @returns {void}
   */
  onAddProof = ({ filename, hash, handles }) => {
    const isDuplicate = this.checkDuplicates(hash)

    if (isDuplicate) {
      return
    }

    const id = handles[0].hashIdNode

    const proof = {
      ...this.getProofInitialState(),
      id,
      hash,
      filename,
      nodes: handles
    }

    this.setState(
      prevState => {
        return {
          proofs: [proof, ...prevState.proofs]
        }
      },
      () => this.save()
    )
    this.startPollingForProof(proof)
  }

  onProofsReceived = (hash, receivedProofs) => {
    const proofs = this.state.proofs.map(proof => {
      if (proof.hash === hash) {
        proof.proofs = receivedProofs
      }

      return proof
    })

    this.setState({ proofs }, () => this.save())
  }

  updateProof = ({ hash, proofData, waitFor, blockchainType, isReady }) => {
    let proofs = cloneDeep(this.state.proofs)
    const proofIndex = proofs.findIndex(proof => proof.hash === hash)

    if (!~proofIndex) {
      return
    }

    const entryStatusPath = `${proofIndex}.proofStatus.${blockchainType}`
    const entryDataPath = `${proofIndex}.proofData`
    const entry = get(proofs, entryStatusPath)
    const hasDone = !!(entry.isReady && get(proofs, entryDataPath))

    if (hasDone) {
      return
    }

    entry.isReady = isReady
    entry.tryCount = entry.tryCount + 1
    entry.lastTry = Date.now()

    set(proofs, entryStatusPath, entry)

    if (proofData) {
      set(proofs, entryDataPath, proofData)
    }

    this.setState({ proofs }, () => this.save())
  }

  onHidePopup = () => {
    this.setState({
      popupVisible: false,
      popupProofId: null
    })
  }

  onShowPopup = id => {
    this.setState({
      popupVisible: true,
      popupProofId: id !== undefined ? id : null
    })
  }

  onDownloadProof = (e, proof) => {
    e.stopPropagation()
    this.downloadProof(proof)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.proofs.length !== prevState.proofs.length) {
      this.props.onChangeProofCount(this.state.proofs.length)
    }
  }

  /**
   * Checks a duplicate proof
   * with provided hash
   * @param hash
   * @returns {boolean}
   */
  checkDuplicates(hash) {
    return this.state.proofs.some(proof => proof.hash === hash)
  }

  /**
   * Starts polling process
   * for all proofs
   * @param {Object[]} proofs
   * @returns {void}
   */
  initPollingProcess(proofs) {
    proofs.forEach(proof => {
      // for btc
      this.checkProofs(proof, BLOCKCHAIN[0])
      // for cal
      this.checkProofs(proof, BLOCKCHAIN[1])
    })
  }

  /**
   * Starts polling process
   * @param proof
   * @returns {void}
   */
  startPollingForProof(proof) {
    BLOCKCHAIN.forEach(blockchain =>
      sleep(blockchain.sleepBeforeFirstRequest).then(() =>
        this.checkProofs(proof, blockchain)
      )
    )
  }

  /**
   * Check proofs in specified blockchain
   * @param proof
   * @param blockchain
   * @returns {void}
   */
  checkProofs(proof, blockchain = {}) {
    const updateProof = this.updateProof
    const onProofsReceived = this.onProofsReceived

    checkProofs({
      updateProof,
      onProofsReceived,
      hash: proof.hash,
      handles: proof.nodes,
      sleepBeforeRetry: blockchain.retryInterval,
      waitFor: blockchain.id
    })
  }

  /**
   * Saves the app store
   * @returns {void}
   */
  save() {
    const { proofs } = this.state

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(proofs))
    } catch (exception) {
      console.log(
        "Please enable your browser's localStorage to enable proof storage and retrieval"
      )
    }
  }

  /**
   * Restores data from string
   * @param savedProofs
   * @returns {Object}
   */
  restoreData(savedProofs) {
    const data = JSON.parse(savedProofs)
    data.forEach(proof => (proof.date = new Date(proof.date)))
    return data
  }

  /**
   * Downloads proof
   * @param {Object} proof
   * @returns {void}
   */
  downloadProof = proof => {
    const { proofData, filename, hash } = proof
    const { isMobile } = this.props

    if (!proofData) {
      return
    }

    !isMobile
      ? this.downloadBinaryFormat(proofData, filename || hash)
      : this.redirectToProof(proofData)
  }

  /**
   * Downloads file in binary format
   * @param {Object} data
   * @param {string} name
   * @returns {void}
   */
  downloadBinaryFormat(data, name) {
    const filename = `${name}.chp`
    const convertedData = convertsToBinary(data)

    fileDownload(convertedData, filename)
  }

  /**
   * Downloads file in json format
   * @param {Object} data
   * @param {string} name
   * @returns {void}
   */
  downloadJSONFormat(data, name) {
    const filename = `${name}.chp.json`
    const convertedData = JSON.stringify(convertToLDJSON(data))

    fileDownload(convertedData, filename)
  }

  /**
   *
   */
  onAppear() {
    this.props.onAppearCreate()
    this.props.onAppearVerify()
  }

  redirectToProof(proof) {
    const { hash_id_node } = convertToLDJSON(proof)
    if (hash_id_node && window && window.open) {
      window.open(`//proofs.chainpoint.org/proofs/${hash_id_node}`)
    }
  }

  render() {
    const { popupVisible, proofs, popupProofId } = this.state
    const {
      isMobile,
      isLaptop,
      onChangeCreateStatus,
      onChangeVerifyAnalysisStatus,
      onChangeVerifySuccessStatus,
      onChangeVerifyFailStatus
    } = this.props

    return (
      <ProofAppContext.Provider value={{ isMobile, isLaptop }}>
        <div className={ns('proofApp')}>
          <div className={ns('proofApp-create-and-verify')}>
            <VisibilitySensor onChange={this.onAppear()}>
              <CreateAndVerify
                proofs={proofs}
                onAddProof={this.onAddProof}
                onShowProofPopup={this.onShowPopup}
                onDownloadProof={this.onDownloadProof}
                onChangeCreateStatus={onChangeCreateStatus}
                onChangeVerifyAnalysisStatus={onChangeVerifyAnalysisStatus}
                onChangeVerifySuccessStatus={onChangeVerifySuccessStatus}
                onChangeVerifyFailStatus={onChangeVerifyFailStatus}
              />
            </VisibilitySensor>
          </div>
          {popupVisible && (
            <ProofPopup
              proofs={proofs}
              popupProofId={popupProofId}
              onHidePopup={this.onHidePopup}
              onShowProofPopup={this.onShowPopup}
              onDownloadProof={this.onDownloadProof}
            />
          )}
        </div>
      </ProofAppContext.Provider>
    )
  }
}

ProofApp.defaultProps = {
  onAppearCreate: () => {},
  onChangeCreateStatus: () => {},
  onChangeProofCount: () => {},
  uris: []
}

const mapSizesToProps = ({ width }) => ({
  isMobile: width <= WIDTH_MOBILE,
  isLaptop: width > WIDTH_MOBILE && width <= WIDTH_LAPTOP
})

export default withSizes(mapSizesToProps)(ProofApp)
