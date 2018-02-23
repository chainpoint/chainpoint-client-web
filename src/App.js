import React, { Component } from 'react';
import './App.css';
import CreateProof from 'components/CreateProof';
import MyProofs from 'components/MyProofs';
import { sha256 } from 'js-sha256';

class App extends Component {
  state = {
    proofs: []
  };

  onProofSubmit(value) {
    const proofs = [sha256(value), ...this.state.proofs];
    this.setState({proofs});
  }

  render() {
    return (
      <div className="App">
        Hello
        <CreateProof onSubmit={this.onProofSubmit.bind(this)} />
        <MyProofs proofs={this.state.proofs} />
      </div>
    );
  }
}

export default App;
