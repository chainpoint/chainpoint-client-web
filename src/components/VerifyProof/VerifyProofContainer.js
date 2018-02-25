import React, { Component } from 'react';
import VerifyProof from './VerifyProof';
import chainpoint from 'chainpoint-client/bundle';

export default class VerifyProofContainer extends Component {

  state = {
    isVerifying: false,
    errors: [],
  };

  onProofVerify(value) {
    this.setState({
      isVerifying: true
    });

    console.log('value to verify', value);
    try {
      chainpoint
        .verifyProofs([value])
        .then(result => {
          console.log('Verified ', value);
          this.setState({
            isVerifying: false
          });
        })
        .catch(error => {
          console.error('Cannot verify', error);
          this.setState({
            isVerifying: false
          });
        })
    } catch(error) {

      this.setState({
        isVerifying: false
      });

      console.error('Cannot verify', error);

    }
  }

  render() {
    return <VerifyProof isVerifying={this.state.isVerifying} onSubmit={this.onProofVerify.bind(this)}/>
  }
}
