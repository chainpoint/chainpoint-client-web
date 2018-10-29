# chainpoint-client-web

[![Build Status](https://travis-ci.com/chainpoint/chainpoint-client-web.svg?branch=master)](https://travis-ci.com/chainpoint/chainpoint-client-web)

## About

This library provides react components for creating and verifying [Chainpoint](https://chainpoint.org) proofs using the [Tierion](https://tierion.com) Network.

### Overview

There are multiple ways to embed the UI components into the site.

**NPM**

```bash
npm i --save chainpoint-client-web
```

**YARN**

```bash
yarn add chainpoint-client-web
```

### HTML tag

chainpoint-client-web provides two files for use in html pages:

- _node_modules/chainpoint-client-web/dist/bundle.js_
- _node_modules/chainpoint-client-web/dist/bundle.css_

Steps:

- Create _script_ and _link_ tag for bundled css and js files.

- Add a container with id **chainpoint-client-web**.

Chainpoint web client will render application directly in this container.

```js
<html>
    <head>
        <link rel="stylesheet" href="./node_modules/chainpoint-client-web/dist/chainpoint-client-web.css" />
    </head>
    <body>
        <div
            id="chainpoint-client-web"
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
        <script type="text/javascript" src="./node_modules/chainpoint-client-web/dist/chainpoint-client-web.js"></script>
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

chainpoint-client-web provides set of react components for use in react application:

- _node_modules/chainpoint-client-web/dist/react_

```js
import ProofClient from 'chainpoint-client-web/dist/react/index.js'
import 'chainpoint-client-web/dist/react/index.css'

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
