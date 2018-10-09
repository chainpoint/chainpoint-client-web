import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import classnames from 'classnames'
import { sha256 } from 'js-sha256'

import ns from 'utils/ns'
import { convertToLDJSON, submitHash, verifyProofs } from 'utils/API'
import { validateSha256 as validateHash } from 'utils/validation'

import Help from '../Help/Help'
import HelpPopup from '../HelpPopup/HelpPopup'
import DropMessage from '../DropMessage/DropMessage'
import ProofAnalysis from '../ProofAnalysis/ProofAnalysis'
import ProofCreation from '../ProofCreation/ProofCreation'
import VerifyStatus from '../VerifyStatus/VerifyStatus'
import ProofList from '../ProofList/ProofList'

// Common
import ButtonIcon from '../../common/ButtonIcon/ButtonIcon'
import Button from '../../common/Button/Button'

import createIcon from '../../svg/create.svg'
import verifyIcon from '../../svg/verify.svg'
import './CreateAndVerify.less'

class CreateAndVerify extends Component {
  state = {
    dropzoneActive: false,
    file: '',
    text: '',
    currentProof: {
      hash: null,
      hashId: null,
      filename: null,
      anchorId: null,
      type: null
    },
    inputState: true,
    analysisState: false,
    failedAnalysis: false,
    creationState: false,
    helpVisible: false,
    verifySuccess: false,
    isVerification: false,
    isCreation: false,
    originalData: null,
    mode: 0 // 0 == drag and drop, 1 == text input
  }
  createProof = file => {
    const { onAddProof } = this.props

    this.setState({
      file,
      analysisState: true,
      isCreation: true,
      inputState: false
    })

    setTimeout(() => {
      this.setState({
        dropzoneActive: false
      })
    }, 1200)

    const reader = new FileReader()

    reader.onload = () => {
      const fileAsBinaryString = reader.result
      file.data = fileAsBinaryString

      const hash = validateHash(file.data) ? file.data : sha256(file.data)

      const data = {
        hash,
        filename: file.name
      }

      submitHash({ hash, onSubmitFailed: this.onSubmitFailed }).then(
        handles => {
          if (handles) {
            const currentProof = {
              hashId: handles && handles.length ? handles[0].hashIdNode : null,
              hash: hash,
              filename: data.filename,
              anchorId: handles[0].anchorId,
              type: 'cal'
            }

            this.setState({
              creationState: true,
              currentProof
            })

            data.handles = handles

            this.props.onChangeCreateStatus(true)

            onAddProof(data)

            setTimeout(() => {
              this.setState({
                analysisState: false
              })
            }, 600)
          }
        }
      )
    }

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')

    reader.readAsArrayBuffer(file)
  }
  verifyData = (file, proofHash) => {
    const reader = new FileReader()

    reader.onload = () => {
      const fileAsArrayBuffer = reader.result
      file.data = fileAsArrayBuffer

      const fileHash = validateHash(file.data) ? file.data : sha256(file.data)
      this.setState({
        originalData: fileHash === proofHash,
        file
      })
    }

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')

    reader.readAsArrayBuffer(file)
  }
  verifyProof = file => {
    this.setState({
      file,
      inputState: false,
      analysisState: true,
      isVerification: true
    })

    const fileType = file.type
    const isJSONFormat = fileType === 'application/json'

    this.props.onChangeVerifyAnalysisStatus(true)

    setTimeout(() => {
      this.setState({
        dropzoneActive: false
      })
    }, 1200)

    const reader = new FileReader()
    reader.onload = () => {
      let proof = [reader.result]

      if (!isJSONFormat) {
        const fileAsArrayBuffer = new Uint8Array(reader.result)
        const ldJSON = convertToLDJSON(fileAsArrayBuffer)
        proof = [ldJSON]
      }

      setTimeout(() => {
        try {
          verifyProofs(proof)
            .then(this.onVerifySuccess)
            .catch(this.onVerifyFail)
        } catch (e) {
          this.onVerifyFail()
        }
      }, 1680)
    }

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')

    if (isJSONFormat) {
      reader.readAsBinaryString(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  }
  onSubmitFailed = () => {
    this.setState({
      creationState: false,
      verifySuccess: false,
      analysisState: true,
      failedAnalysis: true
    })
  }
  onVerifyFail = data => {
    this.setState({
      creationState: true,
      verifySuccess: false,
      analysisState: false
    })
    this.props.onChangeVerifyFailStatus(true)
    this.onVerifyAnalysisEnd()
  }
  onVerifySuccess = data => {
    const hasBtcProof = data.findIndex(d => d.type === 'btc') > -1
    const dataIndex = hasBtcProof
      ? data.findIndex(d => d.type === 'btc')
      : data.findIndex(d => d.type === 'cal')

    const type = hasBtcProof ? 'btc' : 'cal'

    const { hashIdNode, anchorId, hash } = data[dataIndex]

    const currentProof = {
      filename: null,
      hashId: hashIdNode,
      anchorId: anchorId,
      hash,
      type
    }

    this.setState({
      creationState: true,
      verifySuccess: true,
      analysisState: false,
      currentProof
    })

    this.props.onChangeVerifySuccessStatus(true)
    this.onVerifyAnalysisEnd()
  }
  onVerifyAnalysisEnd = () => {
    setTimeout(() => {
      this.setState({
        analysisState: false
      })

      this.props.onChangeVerifyAnalysisStatus(false)
    }, 1200)
  }
  onDragEnter = () => {
    this.setState({
      dropzoneActive: true
    })
  }
  onDragLeave = () => {
    this.setState({
      dropzoneActive: false
    })
  }
  onDrop = files => {
    // check if verification is active
    this.setState({
      dropzoneActive: false
    })

    const { isVerification, verifySuccess, currentProof } = this.state
    const file = files[0]
    file.data = null

    if (isVerification && verifySuccess) {
      this.verifyData(file, currentProof.hash)
    } else {
      if (file.name.indexOf('.chp') > -1) {
        this.verifyProof(file)
      } else {
        this.createProof(file)
      }
    }
  }
  onBrowseFiles = e => {
    e.preventDefault()
    // e.stopPropagation()
    this.dropzoneRef.open()
  }
  onCreateText = () => {
    const { text } = this.state
    const file = new Blob([text], { type: 'text/plain' })

    file.data = null
    file.name = text

    this.createProof(file)
  }
  onChangeText = e => {
    this.setState({
      text: e.target.value.trim()
    })
  }
  onMouseEnter = () => {
    if (!this.props.isMobile) {
      this.setState({ helpVisible: true })
    }
  }
  onMouseLeave = () => {
    if (!this.props.isMobile) {
      this.setState({ helpVisible: false })
    }
  }
  onShowHelp = e => {
    e.preventDefault()
    this.setState({
      helpVisible: true
    })
  }
  onShowTextInput = e => {
    e.preventDefault()
    this.setState({
      mode: 1
    })
  }
  onHideTextInput = e => {
    e.preventDefault()
    this.setState({
      mode: 0
    })
  }
  reset() {
    this.setState({
      inputState: true,
      text: '',
      file: '',
      analysisState: false,
      failedAnalysis: false,
      mode: 0,
      creationState: false,
      isCreation: false,
      isVerification: false,
      currentProof: {
        hash: null,
        hashId: null,
        filename: null,
        anchorId: null,
        type: null
      },
      originalData: null
    })
  }

  retry() {
    this.setState({
      failedAnalysis: false
    })

    const { file } = this.state
    if (file.name.indexOf('.chp') > -1) {
      this.verifyProof(file)
    } else {
      this.createProof(file)
    }
  }
  noOp = () => {}
  render() {
    const {
      analysisState,
      creationState,
      dropzoneActive,
      failedAnalysis,
      file,
      helpVisible,
      inputState,
      isCreation,
      isVerification,
      originalData,
      currentProof,
      verifySuccess,
      text,
      mode
    } = this.state

    const { proofs, onDownloadProof, onShowProofPopup, isMobile } = this.props

    const classNames = classnames('createAndVerify', {
      'createAndVerify--dropzoneActive': dropzoneActive,
      'createAndVerify--stateAnalysis': analysisState,
      'createAndVerify--stateCreation': creationState && isCreation,
      'createAndVerify--stateCreated': creationState && isVerification,
      'createAndVerify--helpVisible': helpVisible,
      'createAndVerify--hasProofs': proofs.length !== 0,
      'createAndVerify--advanced': mode === 1
    })

    const placeholder = !isMobile
      ? 'Enter your SHA-256 hash'
      : 'Enter your SHA-256 hash'

    return (
      <div>
        <Dropzone
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
          disableClick={true}
          multiple={false}
          className={ns(classNames)}
          style={{}}
          ref={node => {
            this.dropzoneRef = node
          }}
        >
          {mode === 0 ? (
            <div
              className={ns('createAndVerify-help-icon')}
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
            >
              <ButtonIcon icon="help" onClick={this.onShowHelp} />
            </div>
          ) : (
            <div className={ns('createAndVerify-close-icon')}>
              <ButtonIcon icon="close" onClick={this.onHideTextInput} />
            </div>
          )}

          {mode !== 0 ? (
            <div className={ns('createAndVerify-input')}>
              <h3 className={ns('createAndVerify-heading')}>CREATE PROOF</h3>
              <div className={ns('createAndVerify-inputInner')}>
                <input
                  type="text"
                  value={text}
                  onChange={this.onChangeText}
                  placeholder={placeholder}
                />
              </div>
              <div className={ns('createProof-createButton')}>
                <Button
                  title="Create proof"
                  onClick={this.onCreateText}
                  disabled={!validateHash(text)}
                  type="secondary"
                />
              </div>
            </div>
          ) : null}

          <div className={ns('createAndVerify-help')}>
            {helpVisible && isMobile ? (
              <HelpPopup onHidePopup={this.onHideHelp} />
            ) : (
              <Help visible={helpVisible} />
            )}
          </div>
          <div className={ns('instructions')} onClick={this.onBrowseFiles}>
            <div className={ns('instruction createProof')}>
              <h3 className={ns('createAndVerify-heading')}>CREATE PROOF</h3>
              <div className={ns('icon')}>
                <img src={createIcon} alt="create proof icon" />
              </div>
              <div>
                <h5>Drag & Drop</h5>
                <p>
                  or <a className={ns('link')}>browse</a> your files
                </p>
              </div>
            </div>
            <div className={ns('instruction verifyProof')}>
              <h3 className={ns('createAndVerify-heading')}>VERIFY PROOF</h3>
              <div className={ns('icon')}>
                <img src={verifyIcon} alt="verify proof icon" />
              </div>
              <div>
                <h5>
                  Choose a <span>.CHP</span> File
                </h5>
                <p>to verify a chainpoint proof</p>
              </div>
            </div>
          </div>
          <div className={ns('notice')}>
            <div className={ns('notice-text')}>
              Your file will not be uploaded, just analyzed in the browser
            </div>
            <div className={ns('advanced-text')}>
              <a onClick={this.onShowTextInput}>advanced</a>
            </div>
          </div>
          <div className={ns('createAndVerify-dropMessage')}>
            <DropMessage visible={dropzoneActive} analysing={analysisState} />
          </div>
          <div className={ns('createAndVerify-analysis')}>
            <ProofAnalysis
              visible={analysisState || creationState}
              creating={creationState}
              dropzoneActive={dropzoneActive}
              failed={failedAnalysis}
              onRetry={this.retry.bind(this)}
            />
          </div>
          {currentProof && (
            <div className={ns('createAndVerify-creation')}>
              <ProofCreation
                isMobile={false}
                visible={creationState && isCreation}
                analysing={analysisState}
                inputting={inputState}
                onAddAnotherFile={this.reset.bind(this)}
                proof={currentProof}
              />
            </div>
          )}
          {isVerification && (
            <div className={ns('createAndVerify-verifyStatus')}>
              <VerifyStatus
                visible={creationState && isVerification}
                analysing={analysisState}
                inputting={false}
                file={file}
                verifySuccess={verifySuccess}
                onAddAnotherVerify={this.reset.bind(this)}
                onBrowseFiles={this.onBrowseFiles}
                currentProof={currentProof}
                originalData={originalData}
              />
            </div>
          )}
        </Dropzone>
        <div>
          {proofs.length !== 0 && (
            <section className={ns('createAndVerify-sectionList')}>
              <ProofList
                proofs={proofs}
                onDownloadProof={onDownloadProof}
                onShowProofPopup={onShowProofPopup}
              />
            </section>
          )}
        </div>
      </div>
    )
  }
}

export default CreateAndVerify
