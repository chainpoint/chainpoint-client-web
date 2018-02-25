import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class VerifyProof extends Component {
  state = {
    text: ''
  };

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isVerifying: PropTypes.bool
  };

  componentWillReceiveProps(nextProps) {

  }

  render() {
    const { onSubmit, isVerifying } = this.props;
    return (
      <form onSubmit={ event => {event.preventDefault(); onSubmit(this.state.text);  }  }>
        <h2>Verify Proof</h2>
        <textarea disabled={isVerifying} value={this.state.text} onChange={ event => this.setState({text: event.target.value } )}>
        </textarea><br />
        <button type="submit" disabled={isVerifying}>{ isVerifying ? 'Verifying...' : 'Submit' }</button>
      </form>
    )
  }
}
