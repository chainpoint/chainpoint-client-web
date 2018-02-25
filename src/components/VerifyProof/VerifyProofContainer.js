import React, { Component } from 'react';
import VerifyProof from './VerifyProof';
import chainpoint from 'chainpoint-client/bundle';

export default class VerifyProofContainer extends Component {

  state = {
    isVerifying: false,
    error: '',
  };

  onProofVerify(value) {
    this.setState({
      isVerifying: true,
      isValid: null,
      error: '',
    });

    console.log('value to verify', value);
    try {
      chainpoint
        .verifyProofs([value])
        .then(result => {
          console.log('Verified ', value);
          this.setState({
            isVerifying: false,
            isValid: true
          });
        })
        .catch(error => {
          console.error('Cannot verify', error);
          this.setState({
            isVerifying: false,
            error: 'Cannot verify proof'
          });
        })
    } catch(error) {

      this.setState({
        isVerifying: false,
        error: 'Proof is not valid'
      });

      console.error('Cannot verify', error);

    }
  }

  render() {
    return <VerifyProof isValid={this.state.isValid} isVerifying={this.state.isVerifying} error={this.state.error} onSubmit={this.onProofVerify.bind(this)}/>
  }
}
