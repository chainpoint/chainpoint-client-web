import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class VerifyProof extends Component {
  state = {
    text: ''
  };

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isVerifying: PropTypes.bool,
    isValid: PropTypes.bool,
    error: PropTypes.string
  };

  componentWillReceiveProps(nextProps) {

  }

  render() {
    const { onSubmit, isVerifying, error, isValid } = this.props;
    return (
      <form onSubmit={ event => {event.preventDefault(); onSubmit(this.state.text);  }  }>
        <h2>Verify Proof</h2>
        <textarea style={isValid && {borderColor: 'green'}}
                  disabled={isVerifying}
                  value={this.state.text}
                  onChange={ event => this.setState({text: event.target.value } )}>
        </textarea>

        { error !== '' &&
        <div style={{fontWeight: 'bold'}}>{error}</div>
        }

        { isValid &&
        <div style={{fontWeight: 'bold'}}>Proof is valid!</div>
        }

        <div>
          <button type="submit" disabled={isVerifying}>{ isVerifying ? 'Verifying...' : 'Submit' }</button>
        </div>
      </form>
    )
  }
}
