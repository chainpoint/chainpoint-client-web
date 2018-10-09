import React, { Component } from 'react'
import SvgInline from 'react-inlinesvg'
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import { sha3_256 as sha256 } from 'js-sha3'
import { sha256 } from 'js-sha256'
import { submitHash } from '../../utils/API'
import ns from 'utils/ns'

import files from 'svg/files.svg'
import Header from 'common/Header/Header'
import Textarea from 'common/Textarea/Textarea'
import Button from 'common/Button/Button'
import ButtonIcon from 'common/ButtonIcon/ButtonIcon'
import Help from 'components/Help/Help'
import InputBlock from 'components/InputBlock/InputBlock'
import DropMessage from 'components/DropMessage/DropMessage'
import ProofAnalysis from 'components/ProofAnalysis/ProofAnalysis'
import ProofCreation from 'components/ProofCreation/ProofCreation'
import ProofList from 'components/ProofList/ProofList'
import HelpPopup from 'components/HelpPopup/HelpPopup'
import { ProofAppContext } from 'ProofApp'

import './CreateProof.less'

class CreateProof extends Component {
  state = {
    helpVisible: false,
    text: '',
    dropzoneActive: false,
    inputState: true,
    analysisState: false,
    creationState: false
  }

  mouseEnter = () => {
    if (!this.props.isMobile) {
      this.setState({ helpVisible: true })
    }
  }

  mouseLeave = () => {
    if (!this.props.isMobile) {
      this.setState({ helpVisible: false })
    }
  }

  onHideHelp = () => {
    this.setState({ helpVisible: false })
  }

  onShowHelp = e => {
    e.preventDefault()

    this.setState({ helpVisible: true })
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

    this.processFile(file)
  }

  onCreateText = () => {
    const { text } = this.state
    const file = new Blob([text], { type: 'text/plain' })

    file.data = null
    file.name = text.slice(0, 28)

    this.processFile(file)
  }

  processFile = file => {
    const { proofs, onAddProof } = this.props

    this.setState({
      file,
      inputState: false,
      analysisState: true
    })

    // Timeout to allow DropMessage component do exit animation
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
          }, 600)
        })
      } else {
        submitHash(hash).then(handles => {
          this.props.onChangeCreateStatus(true)

          data.handles = handles
          onAddProof(data)

          this.setState({ inputState: true, text: '' })

          // Timeout to allow ProofAnalysis component do exit animation
          setTimeout(() => {
            this.setState({
              analysisState: false
            })
          }, 600)
        })
      }
    }

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')

    reader.readAsBinaryString(file)
  }

  openFileUpload = () => {
    this.dropzoneRef.open()
  }

  onChangeText = value => {
    this.setState({ text: value })
  }

  onAddAnotherFile = () => {
    this.setState({ inputState: true, text: '' })

    // Timeout to allow ProofCreation component to do exit animation
    setTimeout(() => {
      this.setState({ creationState: false })
    }, 1680)
  }

  render() {
    const {
      helpVisible,
      text,
      dropzoneActive,
      inputState,
      analysisState,
      creationState
    } = this.state
    const { proofs, isMobile, onShowProofPopup, onDownloadProof } = this.props

    let className = classNames('createProof', {
      'createProof--helpVisible': helpVisible,
      'createProof--hasContent': text.length !== 0,
      'createProof--hasProofs': proofs.length !== 0,
      'createProof--dropzoneActive': dropzoneActive,
      'createProof--stateAnalysis': analysisState,
      'createProof--stateCreation': creationState
    })

    let placeholder = 'Write text, hash or drop a file here'
    if (isMobile) {
      placeholder = 'Write text or hash'
    }

    const mobileTextareaHeight = proofs.length !== 0 ? 192 : 272

    return (
      <InputBlock>
        <div className={ns(className)}>
          <Dropzone
            style={{}}
            ref={node => {
              this.dropzoneRef = node
            }}
            multiple={false}
            disableClick={true}
            onDrop={this.onDrop}
            onDragEnter={this.onDragEnter}
            onDragLeave={this.onDragLeave}
          >
            {/* Two levels of nesting content to be able to apply filter: blur separately
                            for just content and for content with help */}
            <div className={ns('createProof-contentWithHelp')}>
              <div className={ns('createProof-content')}>
                <section className={ns('createProof-sectionUpload')}>
                  <div className={ns('createProof-header')}>
                    <Header>Create proof</Header>
                  </div>

                  <div className={ns('createProof-input')}>
                    <div className={ns('createProof-inputInner')}>
                      <Textarea
                        grow={true}
                        placeholder={placeholder}
                        value={text}
                        onChange={this.onChangeText}
                        placeholderCentered={isMobile}
                        maxHeight={isMobile ? mobileTextareaHeight : 227}
                      />
                    </div>
                  </div>

                  <div className={ns('createProof-createButton')}>
                    <Button
                      title="Create proof"
                      grow={isMobile}
                      type="primary"
                      onClick={this.onCreateText}
                    />
                  </div>

                  <div className={ns('createProof-icon')}>
                    <SvgInline src={files} />
                  </div>

                  <div className={ns('createProof-inputFile')}>
                    <Button
                      title="Choose file"
                      grow={isMobile ? true : false}
                      type={isMobile ? 'primary' : 'flat'}
                      onClick={this.openFileUpload}
                    />
                  </div>
                </section>

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

              <div
                className={ns('createProof-helpIcon')}
                onMouseEnter={this.mouseEnter}
                onMouseLeave={this.mouseLeave}
              >
                <ButtonIcon icon="help" onClick={this.onShowHelp} />
              </div>

              <div className={ns('createProof-help')}>
                {helpVisible && isMobile ? (
                  <HelpPopup onHidePopup={this.onHideHelp} />
                ) : (
                  <Help visible={helpVisible} />
                )}
              </div>
            </div>

            <div className={ns('createProof-dropMessage')}>
              <DropMessage visible={dropzoneActive} analysing={analysisState} />
            </div>

            <div className={ns('createProof-analysis')}>
              <ProofAnalysis
                visible={analysisState || creationState}
                creating={creationState}
                dropzoneActive={dropzoneActive}
              />
            </div>

            <div className={ns('createProof-creation')}>
              <ProofCreation
                isMobile={isMobile}
                visible={creationState}
                analysing={analysisState}
                inputting={inputState}
                onAddAnotherFile={this.onAddAnotherFile}
              />
            </div>
          </Dropzone>
        </div>
      </InputBlock>
    )
  }
}

export default props => (
  <ProofAppContext.Consumer>
    {({ isMobile }) => <CreateProof {...props} isMobile={isMobile} />}
  </ProofAppContext.Consumer>
)
