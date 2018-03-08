import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

export default class CreateProof extends Component {
  initialState = {
    text: '',
    file: null,
    dropzoneActive: false,
    canSubmit: true
  };

  state = this.initialState;

  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  onDrop(files) {

    const file = files[0];

    file.data = null;

    this.setState({
      canSubmit: false,
      file,
      dropzoneActive: false
    });

    const reader = new FileReader();
    reader.onload = () => {
      const fileAsBinaryString = reader.result;
      file.data = fileAsBinaryString;
      this.setState({
        canSubmit: true,
        file
      });
      
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsBinaryString(file);
  }

  onSubmit(event) {
    event.preventDefault();
    const value = this.state.file ? this.state.file.data : this.state.text;
    this.props.onSubmit(value);
    this.setState(this.initialState);
  }

  render() {
    const height = 150;
    const width = 350;
    const border = '1px solid black';
    return (
      <form onSubmit={ this.onSubmit.bind(this) }>
        <h2>Create Proof</h2>

        <div style={{
          height: `${height}px`,
          width: `${width}px`,
        }}>
          <Dropzone style={{
                      height: `${height}px`,
                      width: `${width}px`,
                      border
                    }}
                    activeStyle={{
                      borderColor: '#00ff15'
                    }}
                    multiple={false}
                    disableClick={true}
                    onDrop={this.onDrop.bind(this)}
                    onDragEnter={this.onDragEnter.bind(this)}
                    onDragLeave={this.onDragLeave.bind(this)}
          >
            <div>
                {
                  this.state.file && this.state.file.name
                }
            </div>
            { (!this.state.dropzoneActive && !this.state.file ) && <textarea
              placeholder="Type/Paste text or drop a file here"
              style={{
                height: `${height+2}px`,
                width: `${width+2}px`,
                margin: '-1px 0 0 -1px',
                border,
                boxSizing: 'border-box'
              }}
              value={this.state.text}
              onChange={ event => this.setState({text: event.target.value } )}>

            </textarea> }
          </Dropzone>
          <button disabled={!this.state.canSubmit} type="submit">Submit</button>
        </div>
      </form>
    );
  }
}
