# chainpoint-client-web

[![Build Status](https://travis-ci.com/chainpoint/chainpoint-client-web.svg?branch=master)](https://travis-ci.com/chainpoint/chainpoint-client-web)

## About

This library provides react components for creating and verifying [Chainpoint](https://chainpoint.org) proofs using the [Chainpoint](https://chainpoint.org) Network.

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

**CDN**

The latest javascript and css files are available at https://web-client.chainpoint.org/latest.js and https://web-client.chainpoint.org/latest.css. You can also pin to a specific version by using the short sha1 from that particular release in the format https://web-client.chainpoint.org/chainpoint-client-web.SHORT_SHA1.js.

Three different fonts are being used by this component: 1) Source Sans Pro, 2) PT Mono, 3) Lato. Each of these fonts are available via CDN. Remember to include these Font files in the <head> of your HTML page.

```
<link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700' rel='stylesheet' type='text/css'>
<link href='https://fonts.googleapis.com/css?family=PT+Mono:400' rel='stylesheet' type='text/css'>
<link href='http://fonts.googleapis.com/css?family=Lato:400,700&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
```

### HTML tag

chainpoint-client-web provides two files for use in html pages:

- _node_modules/chainpoint-client-web/dist/bundle.js_
- _node_modules/chainpoint-client-web/dist/bundle.css_

Steps:

- Create _script_ and _link_ tag for bundled css and js files.

- Add a container with id **chainpoint-client-web**.

The Chainpoint client will render application directly in this container.

```js
<html>
    <head>
        <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=PT+Mono:400' rel='stylesheet' type='text/css'>
        <link href='http://fonts.googleapis.com/css?family=Lato:400,700&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
        
        <link rel="stylesheet" href="./node_modules/chainpoint-client-web/dist/bundle.css" />
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
        <script type="text/javascript" src="./node_modules/chainpoint-client-web/dist/bundle.js"></script>
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
