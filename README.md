# Proof-web-client

## About

This library provides react components for creating and verifying [Chainpoint](https://chainpoint.org) proofs using the [Tierion](https://tierion.com) Network.

### Overview

There are two ways to embed the UI components into the site.

**NPM**

```bash
npm i git+ssh://git@github.com/Tierion/proof-web-client.git -S
```

**YARN**

```bash
yarn add git+ssh://git@github.com/Tierion/proof-web-client.git
```

### HTML tag

Proof-web-client provides two files for use in html pages:

- _node_modules/proof-web-client/dist/bundle.js_
- _node_modules/proof-web-client/dist/bundle.css_

Steps:

- Create _script_ and _link_ tag for bundled css and js files.

- Add a container with id **proof-app-client**.

Proof-web-client will render application directly in this container.

```js
<html>
    <head>
        <link rel="stylesheet" href="./node_modules/proof-web-client/dist/bundle.css" />
    </head>
    <body>

        <div
            id="proof-app-client"
            data-onAppearCreate="onAppearCreate"
            data-onAppearVerify="onAppearVerify"
            data-onChangeProofCount="onChangeProofCount"
            data-onChangeCreateStatus="onChangeCreateStatus"
            data-onChangeVerifyFailStatus="onChangeVerifyFailStatus"
            data-onChangeVerifySuccessStatus="onChangeVerifySuccessStatus"
            data-onChangeVerifyAnalysisStatus="onChangeVerifyAnalysisStatus"
        ></div>

        <script type="text/javascript">
            function onAppearCreate() {
                console.log('onAppearCreate');
            }
            function onAppearVerify() {
                console.log('onAppearVerify');
            }
            function onChangeProofCount() {
                console.log('onChangeProofCount');
            }
            function onChangeCreateStatus() {
                console.log('onChangeCreateStatus');
            }
            function onChangeVerifyFailStatus() {
                console.log('onChangeVerifyFailStatus');
            }
            function onChangeVerifySuccessStatus() {
                console.log('onChangeVerifySuccessStatus');
            }
            function onChangeVerifyAnalysisStatus() {
                console.log('onChangeVerifyAnalysisStatus');
            }
        </script>
        <script type="text/javascript" src="./node_modules/proof-web-client/dist/bundle.js"></script>
    </body>
</html>
```

### Attrs

- data-onAppearCreate
- data-onAppearVerify
- data-onChangeProofCount
- data-onChangeCreateStatus
- data-onChangeVerifyFailStatus
- data-onChangeVerifySuccessStatus
- data-onChangeVerifyAnalysisStatus

### React Components

Proof-web-client provides set of react components for use in react application:

- _node_modules/proof-web-client/dist/react_

```js
import ProofClient from 'proof-web-client/dist/react/index.js'
import 'proof-web-client/dist/react/index.css'

export default props => (
  <ProofClient
    onAppearCreate={() => {}}
    onAppearVerify={() => {}}
    onChangeProofCount={() => {}}
    onChangeCreateStatus={() => {}}
    onChangeVerifyAnalysisStatus={() => {}}
    onChangeVerifySuccessStatus={() => {}}
    onChangeVerifyFailStatus={() => {}}
  />
)
```

#### Props:

- onAppearCreate
- onAppearVerify
- onChangeProofCount
- onChangeCreateStatus
- onChangeVerifyFailStatus
- onChangeVerifySuccessStatus
- onChangeVerifyAnalysisStatus

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/chainpoint/chainpoint-client-web/tree/refactor/combine-create-verify)
