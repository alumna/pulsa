import pulsa 		from './../src/index';
import http 		from 'http';
import { resolve }	from 'path';

const next = ( res ) => {

	return function () {
		res.statusCode = 200;
		res.write( 'External middlewares are being called on 404' );
		res.end();
	}

}



describe('Pulsa Server tests', () => {

	beforeAll(() => {
		http.createServer( pulsa.serve( { dir: './test/public_html' } ) ).listen( 9000 )
		http.createServer( pulsa.serve( './test/public_html' ) ).listen( 9001 )
		http.createServer( pulsa.serve( { dir: './test/public_spa', spa: true } ) ).listen( 9002 )
		http.createServer( pulsa.serve( { dir: './test/public_max', maxFileSize: 5 } ) ).listen( 9003 )
		http.createServer( function ( req, res ) { pulsa.serve( './test/public_html' )( req, res, next( res ) ) } ).listen( 9004 )

		http.createServer( pulsa.serve( {
			dir: './test/public_alias',
			alias: {
				'/components' : '/compiled'
			}
		})).listen( 9005 )

		return;
	});

	test('1. Serving a HTML file with "Hello world!"', done => {

		http.get( 'http://127.0.0.1:9000', response => {

			expect( response.statusCode ).toBe( 200 );

			let data = '';

			response.on( 'data', chunk => { data += chunk } )

			response.on( 'end', () => {

				expect( data ).toBe( 'Hello world!' );
				done();

			})

		})

	});

	test('2. 404 on non-existent files"', done => {

		http.get( 'http://127.0.0.1:9000/this_doesnt_exist.txt', response => {

			expect( response.statusCode ).toBe( 404 );
			done();

		})

	});

	test('3. 404 on directories without files"', done => {

		http.get( 'http://127.0.0.1:9000/without_index', response => {

			expect( response.statusCode ).toBe( 404 );
			done();

		})

	});

	test('4. Automatically serving index.html inside a directory"', done => {

		const request = ( path = '', end = false ) => {

			http.get( 'http://127.0.0.1:9000' + path, response => {

				expect( response.statusCode ).toBe( 200 );

				let data = '';

				response.on( 'data', chunk => { data += chunk } )

				response.on( 'end', () => {

					expect( data ).toBe( 'Hello index!' );
					
					if ( end ) done();

				})

			})

		}

		// One request to '/with_index/index.html' to cover the line
		// that check the cache of this index.html on "stats"
		request( '/with_index/index.html' )

		// And one request to '/', to trigger the stats cache
		request( '/with_index/', true )

	});

	test('5. Serving a SPA', done => {

		const request = ( path = '', expected, end = false ) => {

			http.get( 'http://127.0.0.1:9002' + path, response => {

				expect( response.statusCode ).toBe( 200 );

				let data = '';

				response.on( 'data', chunk => { data += chunk } )

				response.on( 'end', () => {

					expect( data ).toBe( expected );
					
					if ( end ) done();

				})

			})

		}

		request( '/', 'Hello SPA!' )
		request( '/without_index', 'Hello SPA!' )
		request( '/non_existent_dir', 'Hello SPA!' )
		request( '/non_existent_file.txt', 'Hello SPA!' )
		request( '/with_index', 'Hello index inside a SPA!', true )

	});

	test('6. Serving range requests', done => {

		const options = {
			headers: { 'Range': 'bytes=0-4' },
		} 

		http.get( 'http://127.0.0.1:9000', options, response => {

			expect( response.statusCode ).toBe( 206 );
			expect( response.headers[ 'content-range' ] ).toBe( 'bytes 0-4/12' );

			let data = '';

			response.on( 'data', chunk => { data += chunk } )

			response.on( 'end', () => {

				expect( data ).toBe( 'Hello' );
				done();

			})

		})

		//

		options.headers[ 'Range' ] = 'bytes=6-'

		http.get( 'http://127.0.0.1:9000', options, response => {

			expect( response.statusCode ).toBe( 206 );
			expect( response.headers[ 'content-range' ] ).toBe( 'bytes 6-12/12' );

			let data = '';

			response.on( 'data', chunk => { data += chunk } )

			response.on( 'end', () => {

				expect( data ).toBe( 'world!' );
				done();

			})

		})

	});

	test('7. Out of range requests - 416', done => {

		const options = {
			headers: { 'Range': 'bytes=0-14' },
		} 

		http.get( 'http://127.0.0.1:9000', options, response => {

			expect( response.statusCode ).toBe( 416 );
			expect( response.headers[ 'content-range' ] ).toBe( 'bytes */12' );
			done();

		})

	});

	test('8. Testing maxFileSize', done => {

		http.get( 'http://127.0.0.1:9003', response => {

			expect( response.statusCode ).toBe( 200 );

			let data = '';

			response.on( 'data', chunk => { data += chunk } )

			response.on( 'end', () => {

				expect( data ).toBe( 'File served through "fs.createReadStream"' );
				done();

			})

		})

	});

	test('9. Calling external middlewares"', done => {

		http.get( 'http://127.0.0.1:9004/this_doesnt_exist.txt', response => {

			expect( response.statusCode ).toBe( 200 );

			let data = '';

			response.on( 'data', chunk => { data += chunk } )

			response.on( 'end', () => {

				expect( data ).toBe( 'External middlewares are being called on 404' );
				done();

			})

		})

	});

	test('10. Generate config when receiving just a string with a dir', done => {

		http.get( 'http://127.0.0.1:9001', response => {

			expect( response.statusCode ).toBe( 200 );

			let data = '';

			response.on( 'data', chunk => { data += chunk } )

			response.on( 'end', () => {

				expect( data ).toBe( 'Hello world!' );
				done();

			})

		})

	});

	test('11. Alias', done => {

		// Aliased request

		http.get( 'http://127.0.0.1:9005/components/component.html', response => {

			expect( response.statusCode ).toBe( 200 );

			let data = '';

			response.on( 'data', chunk => { data += chunk } )

			response.on( 'end', () => {

				expect( data ).toBe( 'Compiled! Yes!' );

			})

		})

		// Non-aliased request

		http.get( 'http://127.0.0.1:9005', response => {

			expect( response.statusCode ).toBe( 200 );

			let data = '';

			response.on( 'data', chunk => { data += chunk } )

			response.on( 'end', () => {

				expect( data ).toBe( 'Hello aliased world!' );
				done();

			})

		})

	});

	test('12. Clearing caches', done => {

		// With a path

		pulsa.clear( resolve( './test/public_html/index.html' ) )

		// Without a path (ignored)
		pulsa.clear()

		// Done
		done();

	});

});