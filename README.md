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
	<a href='https://coveralls.io/github/alumna/pulsa?branch=master'>
		<img src='https://coveralls.io/repos/github/alumna/pulsa/badge.svg?branch=master' alt='Coverage Status' />
	</a>
	<a href="https://npmjs.org/package/@alumna/pulsa">
		<img src="https://badgen.now.sh/npm/dm/@alumna/pulsa" alt="downloads" />
	</a>
</div>

<div align="center">In-memory static file server and middleware in Node</div>

<br/>

## Features

* Production version with **no dependencies**
* Extremely lightweight - 13kB!
* Works on any Express compatible framework, including [Polka](https://github.com/lukeed/polka)
* 100% tested and working on Linux, Mac and Windows!

This module is delivered as ES Module:

* **ES Module**: [`dist/pulsa.js`](https://unpkg.com/@alumna/pulsa/dist/pulsa.js)



## Install

```
$ npm install @alumna/pulsa
```


## Usage

```js
import http       from 'http';
import * as pulsa from '@alumna/pulsa';

http.createServer( pulsa({

	// (OPTIONAL)
	// The current project's directory '.' will be used if `dir` isn't passed
	dir: './public_html/',

	// (OPTIONAL)
	// Mask paths to a different directory when requested
	alias: {
		'/old': '/new'
	},

	// (OPTIONAL)
	// Run as a SPA, mapping non-existent URL's to [base]index.html
	// Default to "false"
	spa: false,

	// (OPTIONAL)
	// Base directory to be considered running as a SPA
	// Default to '/'
	base: '/',

	// (OPTIONAL)
	// Define the max size (in bytes) of a file to be cached
	// Files greater than this limit will be streamed from disk
	// Default to "1048576" (which is 1MB)
	maxFileSize: 1048576
	
});

// Create a memory-file on the server
// "content" can be a string or a buffer
// -
// It will be instantly available to all instances where the path matches
// Works with SPA, index.html files served on dirs, updates 404 caches, etc
pulsa.memory( fullpath, content )

// Clear the cache of a file
// MUST be a full path, not relative.
// -
// It will instantly reflect the operation on all instances
pulsa.clear( '/var/www/index.html' )
```
