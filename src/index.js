import fs 				from 'fs';
import mime				from 'mime/lite';
import { resolve }		from 'path';
import parser			from '@polka/url';
import { promisify } 	from 'util';
import { Readable } 	from 'stream';


const read	  	= promisify( fs.readFile );
const caching 	= {};
const data		= {};
const headers	= {};
const responses	= {};
const stats 	= {};
const streams 	= {};


const serve = function ( config ) {

	if ( typeof config === 'string' )
		config = { dir: config }

	const instance = Object.assign({
		base: 			'/',
		dir: 			'.',
		maxFileSize: 	1048576, // 1 MB
		spa: 			false
	}, config );

	instance.dir 		= resolve( instance.dir );
	instance.responses 	= {}

	cache( instance.dir + instance.base, instance )

	return async function ( req, res, next ) {
	
		const pathname = decodeURIComponent( req.path || req.pathname || parser( req ).pathname );

		return ( instance.responses[ pathname ] || ( instance.responses[ pathname ] = await cache( instance.dir + alias( pathname, instance ), instance ) ) )( req, res, next );

	}
}

const cache = async function ( fullpath, instance ) {

	if ( caching[ fullpath ] ) return caching[ fullpath ];

	let sufix = '';

	if ( !check( fullpath ) || ( stats[ fullpath ].isDirectory() && ( !check( fullpath + ( sufix = ( fullpath.slice( -1 ) != '/' ? '/' : '' ) + 'index.html' ) ) || stats[ fullpath + sufix ].isDirectory() ) ) )
		return ( responses[ fullpath ] = ( instance.spa && responses[ instance.dir + instance.base ] ) ? responses[ instance.dir + instance.base ] : notFound );

	await cache_stream( fullpath + sufix, instance );

	return caching[ fullpath ] = response( fullpath, sufix )

}

const check = function ( fullpath ) {

	if ( stats[ fullpath ] ) {
		return true;
	}

	try {
		stats[ fullpath ] = fs.statSync( fullpath );
		return true;
	}
	catch ( e ) {
		return false;
	}

}

const cache_stream = async function ( fullpath, instance ) {

	if ( stats[ fullpath ].size > instance.maxFileSize )
		return streams[ fullpath ] = ( res, opts ) => fs.createReadStream( fullpath, opts ).pipe( res );

	data[ fullpath ] = await read( fullpath );

	return streams[ fullpath ] = ( res, opts ) => {

		const s = new Readable;
		s.push( ( opts.start && opts.end ) ? data[ fullpath ].slice( opts.start, opts.end ) : data[ fullpath ] )
		s.push( null )

		s.pipe( res )

	}

}

const response = function ( fullpath, sufix ) {

	const name = ( fullpath + sufix ).split( '/' ).pop();

	headers[ fullpath ] = {
		'Content-Length': stats[ fullpath + sufix ].size,
		'Content-Type': mime.getType( name ),
		'Last-Modified': stats[ fullpath + sufix ].mtime.toUTCString(),
	};

	return responses[ fullpath ] = responses[ fullpath + sufix ] = function ( req, res ) {

		const opts = {};

		if ( req.headers.range ) {

			let [ x, y ] = req.headers.range.replace( 'bytes=', '' ).split( '-' );
			let end = opts.end = parseInt( y, 10 ) || stats[ fullpath + sufix ].size;
			let start = opts.start = parseInt( x, 10 ) || 0;

			if ( start >= stats[ fullpath + sufix ].size || end > stats[ fullpath + sufix ].size ) {
				res.setHeader( 'Content-Range', `bytes */${stats[ fullpath + sufix ].size}` );
				res.statusCode = 416;
				return res.end();
			}

			const temp_headers = Object.assign({}, headers[ fullpath ])

			temp_headers[ 'Content-Range' ]  = `bytes ${start}-${end}/${stats[ fullpath + sufix ].size}`;
			temp_headers[ 'Content-Length' ] = ( end - start + 1 );
			temp_headers[ 'Accept-Ranges' ]  = 'bytes';

			res.writeHead( 206, temp_headers );
		}
		else
			res.writeHead( 200, headers[ fullpath ] );

		streams[ fullpath + sufix ]( res, opts )

	}

}

const alias = function ( path, instance ) {

	if ( !instance.alias || typeof instance.alias !== 'object' )
		return path;

	for ( let key in instance.alias ) {
		if ( path.startsWith( key ) )
			return path.replace( key, instance.alias[ key ] );
	}

	return path;

}

const notFound = function ( req, res, next ) {
	return next ? next() : ( res.statusCode = 404, res.end() );
}

const clear = function ( path ) {

	if ( !path ) return;

	delete stats[ path ];
	delete data[ path ];
	delete headers[ path ];
	delete streams[ path ];
	delete responses[ path ];
	delete caching[ path ];

}

export default { serve, stats, clear }