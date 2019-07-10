<div align="center">
	<img src="https://github.com/alumna/pulsa/raw/master/pulsa.svg?sanitize=true" alt="pulsa" width="480" height="270" />
</div>

<div align="center">
	<a href="https://npmjs.org/package/@alumna/pulsa">
		<img src="https://badgen.now.sh/npm/v/@alumna/pulsa" alt="version" />
	</a>
	<a href="https://npmjs.org/package/@alumna/pulsa">
		<img src="https://badgen.net/bundlephobia/min/@alumna/pulsa" alt="size" />
	</a>
	<a href="https://travis-ci.org/alumna/pulsa">
		<img src="https://travis-ci.org/alumna/pulsa.svg?branch=master" alt="travis" />
	</a>
	<a href="https://codecov.io/gh/alumna/pulsa">
		<img src="https://codecov.io/gh/alumna/pulsa/branch/master/graph/badge.svg" />
	</a>
	<a href="https://npmjs.org/package/@alumna/pulsa">
		<img src="https://badgen.now.sh/npm/dm/@alumna/pulsa" alt="downloads" />
	</a>
</div>

<div align="center">In-memory static file server and middleware in Node</div>

<br/>

## Features

* Production version with **no dependencies**
* Extremely lightweight - 12kB!
* 100% tested and working on Linux, Mac and Windows!

Additionally, this module is delivered as:

* **ES Module**: [`dist/pulsa.es.js`](https://unpkg.com/@alumna/pulsa/dist/pulsa.es.js)
* **CommonJS**: [`dist/pulsa.cjs.js`](https://unpkg.com/@alumna/pulsa/dist/pulsa.cjs.js)


## Install

```
$ npm install @alumna/pulsa
```


## Usage

```js
import http  from 'http';
import pulsa from '@alumna/pulsa';

http.createServer( pulsa({

	// (OPTIONAL)
	// The current project's directory '.' will be used if `dir` isn't passed
	dir: './public_html/',

	// (OPTIONAL)
	// Run as a SPA, mapping non-existent URL's to [base]index.html
	// Default to "false"
	spa: false,

	// (OPTIONAL)
	// Base directory to be considered running as a SPA
	base: '/',

	// (OPTIONAL)
	// Define the max size (in bytes) of a file to be cached
	// Files greater than this limit will be streamed from disk
	// Default to "1048576" (which is 1MB)
	maxFileSize: 1048576
	
});

// Get the stats of all files already served by Pulsa
pulsa.stats

// Clear the cache of a file
// MUST be a full path, not relative.
pulsa.clear( '/var/www/index.html' )
```
