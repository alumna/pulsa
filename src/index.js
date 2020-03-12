import fs 						from 'fs';
import mime						from 'mime/lite';
import { join, resolve, sep }	from 'path';
import parser					from '@polka/url';
import { Readable } 			from 'stream';


// Shortcuts
const readStream 	= fs.createReadStream;
const read 			= fs.readFileSync;

// Pulsa internal data
const caching 	= {};
const map 		= {};
let   instances = 0;
const instance 	= {};




const ensure = path => {
	if ( !map[ path ] ) map[ path ] = { reverses: {}, ranges: {} };
}

const reverse = ( path, run, pathname ) => {

	if ( !map[ path ].reverses[ run.id ] ) map[ path ].reverses[ run.id ] = {};

	map[ path ].reverses[ run.id ][ pathname ] = true;

};

const update_instances = function ( path, response, remove = false ) {

	if ( !map[ path ] ) return;

	const ref = map[ path ];

	for ( let id in ref.reverses ) {
		
		const paths 	= ref.reverses[ id ];
		const run 		= instance[ id ];

		for ( let pathname in paths ) {
			
			if ( remove )
				delete run.responses[ pathname ];
			else {
				run.responses[ pathname ] = response;
			}
		}

	}

}

const check = function ( path ) {

	ensure( path );

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

const check_index = function ( path ) {

	let sufix = '';

	if ( !check( path ) || ( map[ path ].stats.isDirectory() && ( !check( path + ( sufix = sep + 'index.html' ) ) || map[ path + sufix ].stats.isDirectory() ) ) )
		return { stop: true };

	return { stop: false, sufix };

}

const cache_stream = function ( path, run, buffer, ref ) {

	if ( run && ref.stats.size > run.maxFileSize )
		return ref.stream = ( res, opts ) => readStream( path, opts ).pipe( res );

	ref.data = buffer || read( path );

	return ref.stream = ( res, opts ) => {

		const s = new Readable;
		s.push( opts.end ? ref.data.slice( opts.start, opts.end + 1 ) : ref.data );
		s.push( null );

		s.pipe( res );

	}

}

const cache_range = function ( range, headers, ref ) {

	const opts = {}, size = ref.stats.size;

	let [ x, y ] = range.replace( 'bytes=', '' ).split( '-' );
	let end = opts.end = parseInt( y, 10 ) || ( size - 1 );
	let start = opts.start = parseInt( x, 10 ) || 0;

	if ( start >= size || end >= size ) {
		
		const content_range = `bytes */${size}`;

		return function ( res ) {

			res.setHeader( 'Content-Range', content_range );
			res.statusCode = 416;
			return res.end();

		}
	}

	const range_headers = {
		'Content-Range': 	`bytes ${start}-${end}/${size}`,
		'Content-Length': 	( end - start + 1 ),
		'Accept-Ranges': 	'bytes',
		'Content-Type': 	headers[ 'Content-Type' ],
		'Last-Modified': 	headers[ 'Last-Modified' ]
	}

	return function ( res ) {

		res.writeHead( 206, range_headers );
		ref.stream( res, opts );

	}

}

const response = function ( path, sufix, ref ) {

	const sufix_ref = sufix ? map[ path + sufix ] : ref;

	ref.headers = {
		'Content-Length': sufix_ref.stats.size,
		'Content-Type': mime.getType( path ) + ( ref.charset ? '; charset=' + ref.charset : '' ),
		'Last-Modified': sufix_ref.stats.mtime.toUTCString(),
	};

	return ref.response = sufix_ref.response = function ( req, res ) {

		if ( req.headers.range ) {
			const range = req.headers.range;
			( ref.ranges[ range ] || ( ref.ranges[ range ] = cache_range( range, ref.headers, sufix_ref ) ) )( res );

		}
		else {
			res.writeHead( 200, ref.headers );
			sufix_ref.stream( res, {} );
		}

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

			clear( path.slice( 0, -11 ), false );

		} else if ( map[ path ] && map[ path ].stats && map[ path ].stats.isDirectory() );
			clear( path + sep + 'index.html', false );

	}

	update_instances( path, null, true );

	delete map[ path ];
	delete caching[ path ];

	return true;

}

const memory = function ( path, buffer ) {

	path = resolve( path );
	ensure( path );

	if ( !( buffer instanceof Buffer ) ) buffer = Buffer.from( buffer );

	const ref = map[ path ];

	ref.charset = 'utf-8';

	ref.stats = {
		size: 	buffer.length,
		mtime: 	new Date(),
		isDirectory: () => false
	}

	ref.stream = cache_stream( path, null, buffer, ref );
	ref.response = caching[ path ] = response( path, '', ref );

	update_instances( path, ref.response );

	// Directories behind the "index.html"
	if ( path.endsWith( sep + 'index.html' ) )
		clear( path.slice( 0, -11 ), false );

	return true;

}

const cache = async function ( pathname, run ) {

	let path = join( run.dir, alias( pathname, run ) );

	if ( path.endsWith( sep ) ) path = path.slice( 0, -1 );

	if ( caching[ path ] ) return caching[ path ];

	ensure( path );
	reverse( path, run, pathname );

	const ref 				= map[ path ];
	const { stop, sufix } 	= check_index( path );

	if ( stop ) {
		
		let spa_path = join( run.dir, ( run.base.endsWith( '/' ) ? run.base.slice( 0, -1 ) : run.base ) );

		if ( run.spa ) {
			reverse( spa_path, run, pathname );
			return ref.response = caching[ spa_path ];
		}
		else
			return ref.response = notFound;
	}
	else reverse( path + sufix, run, pathname );

	const sufix_ref = map[ path + sufix ];

	ref.stream = sufix_ref.stream = ref.stream || sufix_ref.stream || cache_stream( path + sufix, run, null, ref );
	ref.response = sufix_ref.response = ref.response || sufix_ref.response || response( path, sufix, ref );

	return caching[ path ] = caching[ path + sufix ] = ref.response;

}

const serve = function ( config ) {

	if ( typeof config === 'string' )
		config = { dir: config };

	const run = Object.assign({
		base: 			'/',
		dir: 			'.',
		maxFileSize: 	1048576, // 1 MB
		spa: 			false
	}, config );

	run.id 				= ++instances;
	instance[ run.id ] 	= run;
	run.dir 			= resolve( run.dir );
	run.responses 		= {};
	run.base 			= alias( run.base, run );

	cache( run.base, run );

	return async function ( req, res, next ) {
	
		const pathname = decodeURIComponent( req.path || req.pathname || parser( req ).pathname );

		return ( run.responses[ pathname ] || ( run.responses[ pathname ] = await cache( pathname, run ) ) )( req, res, next );

	}
}

export default { serve, memory, clear };