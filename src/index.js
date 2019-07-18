import fs 						from 'fs';
import mime						from 'mime/lite';
import { join, resolve, sep }	from 'path';
import parser					from '@polka/url';
import { Readable } 			from 'stream';


// Shortcuts
const readStream 	= fs.createReadStream
const read 			= fs.readFileSync

// Pulsa internal data
const caching 	= {};
const map 		= {}
let   instances = 0;
const instance 	= {};

const serve = function ( config ) {

	if ( typeof config === 'string' )
		config = { dir: config }

	const run = Object.assign({
		base: 			'/',
		dir: 			'.',
		maxFileSize: 	1048576, // 1 MB
		spa: 			false
	}, config );

	run.id 				= ++instances;
	instance[ run.id ] 	= run;
	run.dir 			= resolve( run.dir );
	run.responses 		= {}
	run.base 			= alias( run.base, run )

	cache( run.base, run )

	return async function ( req, res, next ) {
	
		const pathname = decodeURIComponent( req.path || req.pathname || parser( req ).pathname );

		return ( run.responses[ pathname ] || ( run.responses[ pathname ] = await cache( pathname, run ) ) )( req, res, next );

	}
}

const cache = async function ( pathname, run ) {

	let path = join( run.dir, alias( pathname, run ) )

	if ( path.endsWith( sep ) ) path = path.slice( 0, -1 );

	if ( caching[ path ] ) return caching[ path ];

	ensure( path )
	reverse( path, run, pathname )

	const reference 		= map[ path ];
	const { stop, sufix } 	= check_index( path );

	if ( stop ) {
		
		let spa_path = join( run.dir, ( run.base.endsWith( '/' ) ? run.base.slice( 0, -1 ) : run.base ) )

		if ( run.spa ) {
			reverse( spa_path, run, pathname )
			return reference.response = caching[ spa_path ];
		}
		else
			return reference.response = notFound;
	}
	else reverse( path + sufix, run, pathname )

	const sufix_reference = map[ path + sufix ];

	reference.stream = sufix_reference.stream = reference.stream || sufix_reference.stream || cache_stream( path + sufix, run, null, reference );
	reference.response = sufix_reference.response = reference.response || sufix_reference.response || response( path, sufix, reference )

	return caching[ path ] = caching[ path + sufix ] = reference.response;

}


const ensure = path => {
	if ( !map[ path ] ) map[ path ] = { reverses: {} }
}

const reverse = ( path, run, pathname ) => {

	if ( !map[ path ].reverses[ run.id ] ) map[ path ].reverses[ run.id ] = {}

	map[ path ].reverses[ run.id ][ pathname ] = true

}; 

const memory = function ( path, buffer ) {

	path = resolve( path )
	ensure( path )

	if ( !( buffer instanceof Buffer ) ) buffer = Buffer.from( buffer )

	const reference = map[ path ];

	reference.charset = 'utf-8'

	reference.stats = {
		size: 	buffer.length,
		mtime: 	new Date(),
		isDirectory: () => false
	}

	reference.stream = cache_stream( path, null, buffer, reference );
	reference.response = caching[ path ] = response( path, '', reference );

	update_instances( path, reference.response )

	// Directories behind the "index.html"
	if ( path.endsWith( sep + 'index.html' ) )
		clear( path.slice( 0, -11 ), false )

	return true;

}

const update_instances = function ( path, response, remove = false ) {

	if ( !map[ path ] ) return;

	const reference = map[ path ]

	for ( let id in reference.reverses ) {
		
		const paths 	= reference.reverses[ id ]
		const run 		= instance[ id ]

		for ( let pathname in paths ) {
			
			if ( remove )
				delete run.responses[ pathname ]
			else {
				run.responses[ pathname ] = response
			}
		}

	}

}

const check_index = function ( path ) {

	let sufix = '';

	if ( !check( path ) || ( map[ path ].stats.isDirectory() && ( !check( path + ( sufix = sep + 'index.html' ) ) || map[ path + sufix ].stats.isDirectory() ) ) )
		return { stop: true };

	return { stop: false, sufix };

}

const check = function ( path ) {

	ensure( path )

	if ( map[ path ].stats )
		return true;

	try {
		map[ path ].stats = fs.statSync( path );
		return true;
	}
	catch ( e ) {
		return false;
	}

}

const cache_stream = function ( path, run, buffer, reference ) {

	if ( run && reference.stats.size > run.maxFileSize )
		return reference.stream = ( res, opts ) => readStream( path, opts ).pipe( res );

	reference.data = buffer || read( path );

	return reference.stream = ( res, opts ) => {

		const s = new Readable;
		s.push( opts.end ? reference.data.slice( opts.start, opts.end + 1 ) : reference.data )
		s.push( null )

		s.pipe( res )

	}

}

const response = function ( path, sufix, reference ) {

	const name 				= ( path + sufix ).split( '/' ).pop();
	const sufix_reference 	= sufix ? map[ path + sufix ] : reference 

	reference.headers = {
		'Content-Length': sufix_reference.stats.size,
		'Content-Type': mime.getType( name ) + ( reference.charset ? '; charset=' + reference.charset : '' ),
		'Last-Modified': sufix_reference.stats.mtime.toUTCString(),
	};

	return reference.response = sufix_reference.response = function ( req, res ) {

		const opts = {};

		if ( req.headers.range ) {

			let [ x, y ] = req.headers.range.replace( 'bytes=', '' ).split( '-' );
			let end = opts.end = parseInt( y, 10 ) || ( sufix_reference.stats.size - 1 );
			let start = opts.start = parseInt( x, 10 ) || 0;

			if ( start >= sufix_reference.stats.size || end >= sufix_reference.stats.size ) {
				res.setHeader( 'Content-Range', `bytes */${sufix_reference.stats.size}` );
				res.statusCode = 416;
				return res.end();
			}

			const temp_headers = Object.assign( {}, reference.headers )

			temp_headers[ 'Content-Range' ]  = `bytes ${start}-${end}/${map[ path + sufix ].stats.size}`;
			temp_headers[ 'Content-Length' ] = ( end - start + 1 );
			temp_headers[ 'Accept-Ranges' ]  = 'bytes';

			res.writeHead( 206, temp_headers );
		}
		else
			res.writeHead( 200, reference.headers );

		sufix_reference.stream( res, opts )

	}

}

const alias = function ( path, run ) {

	if ( !run.alias || typeof run.alias !== 'object' )
		return path;

	for ( let key in run.alias ) {
		if ( path.startsWith( key ) )
			return path.replace( key, run.alias[ key ] );
	}

	return path;

}

const notFound = function ( req, res, next ) {
	return next ? next() : ( res.statusCode = 404, res.end() );
}

const clear = function ( path, recursive = true ) {

	if ( !path ) return;

	if ( path.length > 1 && path.endsWith( sep ) ) path = path.slice( 0, -1 );

	if ( recursive ) {

		if ( path.endsWith( sep + 'index.html' ) ) {

			clear( path.slice( 0, -11 ), false )

		} else if ( map[ path ] && map[ path ].stats && map[ path ].stats.isDirectory() )
			clear( path + sep + 'index.html', false )

	}

	update_instances( path, null, true )

	delete map[ path ];
	delete caching[ path ];

	return true;

}

export default { serve, memory, clear }