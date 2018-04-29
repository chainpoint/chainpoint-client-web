'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');
const glob = require('glob');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

const getComponents = (relativePath) => {
	const path = resolveApp(relativePath);
	const all = glob.sync(`${path}/**/*`);

	return all.reduce((entries, path) => {
		const entry = path.slice(path.lastIndexOf('/') + 1);
		const isJS = /\.js$/ig.test(entry);
		if (!isJS) {
			return entries;
		}

		const entryName = entry.slice(0, entry.lastIndexOf('.'));
		entries[`common/${entryName}`] = path;
		return entries;
	}, {});
};

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appBuild: resolveApp('dist'),
  appReactBuild: resolveApp('dist/react'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appIndexJsDev: resolveApp('src/standalone.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appCommonSrc: getComponents('src/common'),
  appReactSrc: resolveApp('src/ProofApp.js'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
};
