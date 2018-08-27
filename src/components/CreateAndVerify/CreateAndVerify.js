import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import classnames from 'classnames'
import { sha3_256 as sha256 } from 'js-sha3'

import ns from 'utils/ns'
import { convertToLDJSON, submitHash, verifyProofs } from 'utils/API'

import DropMessage from '../DropMessage/DropMessage'
import ButtonIcon from '../../common/ButtonIcon/ButtonIcon'
import ProofAnalysis from '../ProofAnalysis/ProofAnalysis'
import ProofCreation from '../ProofCreation/ProofCreation'
import VerifyStatus from '../VerifyStatus/VerifyStatus'
import ProofList from '../ProofList/ProofList'

import createIcon from '../../svg/create.svg'
import verifyIcon from '../../svg/verify.svg'
import './CreateAndVerify.less'

const l = input => console.log(input)

class CreateAndVerify extends Component {
  state = {
    dropzoneActive: false,
    file: '',
    inputState: false,
    analysisState: false,
    creationState: false,
    helpVisible: false,
    verifySuccess: false,
    isVerification: false,
    isCreation: false
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

      // We show creationState only for the first proof
      if (proofs.length === 0) {
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
          }, 1600)
        })
      } else {
        submitHash(hash).then(handles => {
          this.setState({ creationState: true })
          this.props.onChangeCreateStatus(true)

          data.handles = handles

          onAddProof(data)

          // this.setState({ inputState: true, text: '' })

          // Timeout to allow ProofAnalysis component do exit animation
          setTimeout(() => {
            this.setState({ analysisState: false })
          }, 1600)
        })
      }
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
  onAddAnotherFile = () => {
    setTimeout(() => {
      this.setState({ creationState: false })
    }, 1680)
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
  reset() {
    this.setState({
      dropzoneActive: false,
      file: '',
      inputState: false,
      analysisState: false,
      creationState: false,
      helpVisible: false,
      verifySuccess: false,
      isVerification: false,
      isCreation: false
    })
  }
  render() {
    const {
      analysisState,
      creationState,
      dropzoneActive,
      file,
      helpVisible,
      isCreation,
      isVerification,
      verifySuccess
    } = this.state

    const { proofs, onDownloadProof, onShowProofPopup } = this.props

    const classNames = classnames({
      createAndVerify: true,
      'createAndVerify--dropzoneActive': dropzoneActive,
      'createAndVerify--stateAnalysis': analysisState,
      'createAndVerify--stateCreation': creationState && isCreation,
      'createAndVerify--stateCreated': creationState && isVerification,
      'createAndVerify--helpVisible': helpVisible
    })

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
        >
          <div className={ns('createAndVerify-help')}>
            <ButtonIcon icon="help" />
          </div>
          <div className={ns('instructions')}>
            <div className={ns('instruction createProof')}>
              <h3>Create Proof</h3>
              <div className={ns('icon')}>
                <img src={createIcon} alt="create proof icon" />
              </div>
              <div>
                <h5>Drag & Drop</h5>
                <p>or browse your files</p>
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
              <a href="#" onClick={() => alert('Not Yet Implemented!')}>
                advanced
              </a>
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
              // inputting={inputState}
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
