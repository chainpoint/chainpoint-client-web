import React, { Component } from 'react';
import SvgInline from 'react-inlinesvg';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import ns from 'utils/ns';
import {
    convertToLDJSON,
    verifyProofs
} from '../../utils/API';

import chpFile from 'svg/chp-file.svg';
import Header from 'common/Header/Header';
import Button from 'common/Button/Button';
import ButtonIcon from 'common/ButtonIcon/ButtonIcon';
import Help from 'components/Help/Help';
import InputBlock from 'components/InputBlock/InputBlock';
import DropMessage from 'components/DropMessage/DropMessage';
import ProofAnalysis from 'components/ProofAnalysis/ProofAnalysis';
import VerifyStatus from 'components/VerifyStatus/VerifyStatus';
import HelpPopup from 'components/HelpPopup/HelpPopup';
import { ProofAppContext } from 'ProofApp';

import './VerifyProof.less';

class VerifyProof extends Component {
    state = {
        helpVisible: false,
        dropzoneActive: false,
        inputState: true,
        analysisState: false,
        creationState: false,
        verifySuccess: false
    };

    mouseEnter = () => {
        if (!this.props.isMobile) {
            this.setState({ helpVisible: true });
        }
    };

    mouseLeave = () => {
        if (!this.props.isMobile) {
            this.setState({ helpVisible: false });
        }
    };

    onHideHelp = () => {
        this.setState({ helpVisible: false });
    };

    onShowHelp = e => {
        e.preventDefault();

        this.setState({ helpVisible: true });
    };

    onDragEnter = () => {
        this.setState({
            dropzoneActive: true
        });
    };

    onDragLeave = () => {
        this.setState({
            dropzoneActive: false
        });
    };

    onDrop = files => {
        const file = files[0];

        file.data = null;

        this.processFile(file);
    };

    processFile = file => {
        this.setState({
            file,
            inputState: false,
            analysisState: true
        });
        const fileType = file.type;
        const isJSONFormat = fileType === 'application/json';

        this.props.onChangeVerifyAnalysisStatus(true);

        // Timeout to allow DropMessage component do exit animation
        setTimeout(() => {
            this.setState({
                dropzoneActive: false
            });
        }, 1200);

        const reader = new FileReader();
        reader.onload = () => {
            let proof = [reader.result];

            if (!isJSONFormat) {
                const fileAsArrayBuffer = new Uint8Array(reader.result);
                const ldJSON = convertToLDJSON(fileAsArrayBuffer);
                proof = [ldJSON];
            }

            try {
                verifyProofs(proof)
                    .then(this.onVerifySuccess)
                    .catch(this.onVerifyFail);
            } catch (e) {
                this.onVerifyFail();
            }
        };

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');

        if (isJSONFormat) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    };

    openFileUpload = () => {
        this.dropzoneRef.open();
    };

    onAddAnotherVerify = () => {
        this.setState({ inputState: true });

        this.props.onChangeVerifySuccessStatus(false);
        this.props.onChangeVerifyFailStatus(false);

        // Timeout to allow ProofCreation component to do exit animation
        setTimeout(() => {
            this.setState({ creationState: false });
        }, 1680);
    };

    onVerifyFail = () => {
        this.setState({
            creationState: true,
            verifySuccess: false
        });

        this.props.onChangeVerifyFailStatus(true);
        this.onVerifyAnalysisEnd();
    };

    onVerifySuccess = () => {
        this.setState({
            creationState: true,
            verifySuccess: true
        });

        this.props.onChangeVerifySuccessStatus(true);
        this.onVerifyAnalysisEnd();
    };

    onVerifyAnalysisEnd = () => {
        // Timeout to allow ProofAnalysis component do exit animation
        setTimeout(() => {
            this.setState({
                analysisState: false
            });

            this.props.onChangeVerifyAnalysisStatus(false);
        }, 600);
    };

    render() {
        const {
            helpVisible,
            dropzoneActive,
            inputState,
            analysisState,
            creationState,
            verifySuccess,
            file
        } = this.state;

        const { isMobile } = this.props;

        let className = classNames('verifyProof', {
            'verifyProof--helpVisible': helpVisible,
            'verifyProof--dropzoneActive': dropzoneActive,
            'verifyProof--stateAnalysis': analysisState,
            'verifyProof--stateCreated': creationState
        });

        return (
            <InputBlock>
                <div className={ns(className)}>
                    <Dropzone
                        // keep empty styles, to prevent Dropzone to insert it's own styles
                        style={{}}
                        ref={node => {
                            this.dropzoneRef = node;
                        }}
                        multiple={false}
                        disableClick={true}
                        onDrop={this.onDrop}
                        onDragEnter={this.onDragEnter}
                        onDragLeave={this.onDragLeave}
                    >
                        {/* Two levels of nesting content to be able to apply filter: blur separately
                            for just content and for content with help */}
                        <div className={ns("verifyProof-contentWithHelp")}>
                            <div className={ns("verifyProof-content")}>
                                <section className={ns("verifyProof-sectionUpload")}>
                                    <div className={ns("verifyProof-header")}>
                                        <Header>Verify proof</Header>
                                    </div>

                                    {isMobile ? (
                                        <div className={ns("verifyProof-label")}>Add a .chp file here</div>
                                    ) : (
                                        <div className={ns("verifyProof-label")}>Drop a .chp file here</div>
                                    )}

                                    <div className={ns("verifyProof-icon")}>
                                        <SvgInline src={chpFile} />
                                    </div>

                                    <div className={ns("verifyProof-inputFile")}>
                                        <Button
                                            title="Choose file"
                                            grow={isMobile}
                                            type={isMobile ? 'primary' : 'flat'}
                                            onClick={this.openFileUpload}
                                        />
                                    </div>
                                </section>
                            </div>

                            <div
                                className={ns("verifyProof-helpIcon")}
                                onMouseEnter={this.mouseEnter}
                                onMouseLeave={this.mouseLeave}
                            >
                                <ButtonIcon icon="help" onClick={this.onShowHelp} />
                            </div>

                            <div className={ns("verifyProof-help")}>
                                {helpVisible && isMobile ? (
                                    <HelpPopup onHidePopup={this.onHideHelp} />
                                ) : (
                                    <Help visible={helpVisible} />
                                )}
                            </div>
                        </div>

                        <div className={ns("verifyProof-dropMessage")}>
                            <DropMessage visible={dropzoneActive} analysing={analysisState} />
                        </div>

                        <div className={ns("verifyProof-analysis")}>
                            <ProofAnalysis
                                visible={analysisState || creationState}
                                dropzoneActive={dropzoneActive}
                                creating={creationState}
                            />
                        </div>

                        {file && (
                            <div className={ns("verifyProof-verifyStatus")}>
                                <VerifyStatus
                                    visible={creationState}
                                    analysing={analysisState}
                                    inputting={inputState}
                                    filename={file.name}
                                    verifySuccess={verifySuccess}
                                    onAddAnotherVerify={this.onAddAnotherVerify}
                                />
                            </div>
                        )}
                    </Dropzone>
                </div>
            </InputBlock>
        );
    }
}

export default props => (
    <ProofAppContext.Consumer>
        {({ isMobile }) => <VerifyProof {...props} isMobile={isMobile} />}
    </ProofAppContext.Consumer>
);
