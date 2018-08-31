import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import classnames from 'classnames'
import { sha3_256 as sha256 } from 'js-sha3'

import ns from 'utils/ns'
import { convertToLDJSON, submitHash, verifyProofs } from 'utils/API'

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
    inputState: true,
    analysisState: false,
    creationState: false,
    helpVisible: false,
    verifySuccess: false,
    isVerification: false,
    isCreation: false,
    mode: 0 // 0 == drag and drop, 1 == text input
  }
  createProof = file => {
    const { proofs, onAddProof } = this.props

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
      const hash = sha256(file.data)
      const data = {
        hash,
        filename: file.name
      }

      submitHash(hash).then(handles => {
        this.setState({ creationState: true })
        this.props.onChangeCreateStatus(true)

        data.handles = handles
        onAddProof(data)

        // Timeout to allow ProofAnalysis component do exit animation
        setTimeout(() => {
          this.setState({
            analysisState: false
          })
        }, 600)
      })
    }

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')

    reader.readAsBinaryString(file)
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

    // Timeout to allow DropMessage component do exit animation
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

      try {
        verifyProofs(proof)
          .then(this.onVerifySuccess)
          .catch(this.onVerifyFail)
      } catch (e) {
        this.onVerifyFail()
      }
    }

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')

    if (isJSONFormat) {
      reader.readAsBinaryString(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  }
  onVerifyFail = () => {
    this.setState({
      creationState: true,
      verifySuccess: false,
      analysisState: false
    })
    this.props.onChangeVerifyFailStatus(true)
    this.onVerifyAnalysisEnd()
  }
  onVerifySuccess = () => {
    this.setState({
      creationState: true,
      verifySuccess: true,
      analysisState: false
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
    }, 600)
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
    const file = files[0]
    file.data = null
    if (file.name.indexOf('.chp') > -1) {
      this.verifyProof(file)
    } else {
      this.createProof(file)
    }
  }
  onBrowseFiles = () => {
    this.dropzoneRef.open()
  }
  onCreateText = () => {
    const { text } = this.state
    const file = new Blob([text], { type: 'text/plain' })

    file.data = null
    file.name = text.slice(0, 28)

    this.createProof(file)
  }
  onChangeText = e => {
    this.setState({
      text: e.target.value
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
      mode: 0
    })

    // Timeout to allow ProofCreation component to do exit animation
    setTimeout(() => {
      this.setState({ creationState: false })
    }, 1680)
  }
  noOp = () => {}
  render() {
    const {
      analysisState,
      creationState,
      dropzoneActive,
      file,
      helpVisible,
      inputState,
      isCreation,
      isVerification,
      verifySuccess,
      text,
      mode
    } = this.state

    const { proofs, onDownloadProof, onShowProofPopup, isMobile } = this.props

    const classNames = classnames({
      createAndVerify: true,
      'createAndVerify--dropzoneActive': dropzoneActive,
      'createAndVerify--stateAnalysis': analysisState,
      'createAndVerify--stateCreation': creationState && isCreation,
      'createAndVerify--stateCreated': creationState && isVerification,
      'createAndVerify--helpVisible': helpVisible,
      'createAndVerify--hasProofs': proofs.length !== 0
    })

    const placeholder = !isMobile ? 'Enter your hash' : 'Enter hash'

    return (
      <div>
        <Dropzone
          onDragEnter={mode === 0 ? this.onDragEnter : this.noOp}
          onDragLeave={mode === 0 ? this.onDragLeave : this.noOp}
          onDrop={mode === 0 ? this.onDrop : this.noOp}
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
              <h3>Create Proof</h3>
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
                  disabled={text.length !== 64}
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
          <div className={ns('instructions')}>
            <div className={ns('instruction createProof')}>
              <h3>Create Proof</h3>
              <div className={ns('icon')}>
                <img src={createIcon} alt="create proof icon" />
              </div>
              <div>
                <h5>Drag & Drop</h5>
                <p>
                  or <a onClick={this.onBrowseFiles}>browse</a> your files
                </p>
              </div>
            </div>
            <div className={ns('instruction verifyProof')}>
              <h3>Verify Proof</h3>
              <div className={ns('icon')}>
                <img src={verifyIcon} alt="verify proof icon" />
              </div>
              <div>
                <h5>Choose a .CHP File</h5>
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
            />
          </div>
          <div className={ns('createAndVerify-creation')}>
            <ProofCreation
              isMobile={false}
              visible={creationState && isCreation}
              analysing={analysisState}
              inputting={inputState}
              onAddAnotherFile={this.reset.bind(this)}
            />
          </div>
          {file && (
            <div className={ns('createAndVerify-verifyStatus')}>
              <VerifyStatus
                visible={creationState && isVerification}
                analysing={analysisState}
                inputting={false}
                filename={file.name}
                verifySuccess={verifySuccess}
                onAddAnotherVerify={this.reset.bind(this)}
              />
            </div>
          )}
        </Dropzone>
        <div>
          {proofs.length !== 0 && (
            <section className={ns('createProof-sectionList')}>
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
