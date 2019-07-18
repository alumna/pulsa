import pulsa 		from './../src/index';
import fs 			from 'fs';
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
		http.createServer( pulsa.serve( { dir: './test/public_spa', spa: true, base: '/spa' } ) ).listen( 9002 )
		http.createServer( pulsa.serve( { dir: './test/public_max', maxFileSize: 5 } ) ).listen( 9003 )
		http.createServer( function ( req, res ) { pulsa.serve( './test/public_html' )( req, res, next( res ) ) } ).listen( 9004 )

		http.createServer( pulsa.serve( {
			dir: './test/public_alias',
			alias: {
				'/components' : '/compiled'
			}
		})).listen( 9005 )

		http.createServer( pulsa.serve( { dir: './test/public_changing', spa: true } ) ).listen( 9006 )
		http.createServer( pulsa.serve( { dir: './test/public_spa_memory', spa: true } ) ).listen( 9007 )
		http.createServer( pulsa.serve( { dir: './test/public_memory', spa: false } ) ).listen( 9008 )
		http.createServer( pulsa.serve( { dir: './test/public_overwriting', spa: false } ) ).listen( 9009 )

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

		request( '/spa/', 'Hello SPA!' )
		request( '/spa/without_index', 'Hello SPA!' )
		request( '/spa/non_existent_dir', 'Hello SPA!' )
		request( '/spa/non_existent_file.txt', 'Hello SPA!' )
		request( '/spa/with_index_as_folder', 'Hello SPA!' )
		request( '/spa/with_index', 'Hello index inside a SPA!', true )

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

			})

		})

		//

		options.headers[ 'Range' ] = 'bytes=6-'

		http.get( 'http://127.0.0.1:9000', options, response => {

			expect( response.statusCode ).toBe( 206 );
			expect( response.headers[ 'content-range' ] ).toBe( 'bytes 6-11/12' );

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

	test('12. Serving memory generated files', async done => {

		const request = ( path = '', expected, end = false ) => {

			return new Promise ( promise_resolve => {

				http.get( 'http://127.0.0.1:9000' + path, response => {

					expect( response.statusCode ).toBe( 200 );

					let data = '';

					response.on( 'data', chunk => { data += chunk } )

					response.on( 'end', () => {

						expect( data ).toBe( expected );

						promise_resolve();
						
						if ( end ) done();

					})

				})

			})

		}

		pulsa.memory( './test/public_html/memory_buffer.txt', Buffer.from( 'This buffer only exists in memory!' ) )
		pulsa.memory( './test/public_html/memory_file.txt', 'This file only exists in memory!' )

		await request( '/memory_buffer.txt', 'This buffer only exists in memory!' )
		await request( '/memory_file.txt', 'This file only exists in memory!' )

		pulsa.memory( './test/public_html/memory_file.txt', 'And we can update it!' )
		request( '/memory_file.txt', 'And we can update it!', true )

	});

	test('13. Ensuring that "clear" really clears the cache', async done => {

		const request = ( path = '', expected, end = false ) => {

			return new Promise ( promise_resolve => {

				http.get( 'http://127.0.0.1:9006' + path, response => {

					expect( response.statusCode ).toBe( 200 );

					let data = '';

					response.on( 'data', chunk => { data += chunk } )

					response.on( 'end', () => {

						expect( data ).toBe( expected );

						promise_resolve();
						
						if ( end ) done();

					})

				})

			})

		}

		// If this test failed previously, lets guarantee that
		// everything is correct again before we begin
		fs.writeFileSync( 'test/public_changing/index.html', 'Unchanged index.' );
		fs.writeFileSync( 'test/public_changing/other.html', 'Unchanged other HTML file.' );

		await request( '/', 'Unchanged index.' )
		await request( '/other.html', 'Unchanged other HTML file.' )
		await request( '/inexistent/route', 'Unchanged index.' )

		fs.writeFileSync( 'test/public_changing/index.html', 'Changed index!' );
		fs.writeFileSync( 'test/public_changing/other.html', 'Changed the other HTML file as well!' );

		pulsa.clear( resolve( 'test/public_changing/index.html' ) )
		pulsa.clear( resolve( 'test/public_changing/other.html' ) )

		await request( '/', 'Changed index!' )
		await request( '/other.html', 'Changed the other HTML file as well!' )
		await request( '/inexistent/route', 'Changed index!' )

		// Undo the changes
		fs.writeFileSync( 'test/public_changing/index.html', 'Unchanged index.' );
		fs.writeFileSync( 'test/public_changing/other.html', 'Unchanged other HTML file.' );

		done();

	});

	test('14. SPA working with on-memory indexes!', async done => {

		const request = ( path = '', expected, end = false ) => {

			return new Promise ( promise_resolve => {

				http.get( 'http://127.0.0.1:9007' + path, response => {

					expect( response.statusCode ).toBe( 200 );

					let data = '';

					response.on( 'data', chunk => { data += chunk } )

					response.on( 'end', () => {

						expect( data ).toBe( expected );

						promise_resolve();
						
						if ( end ) done();

					})

				})

			})

		}

		pulsa.memory( './test/public_spa_memory/index.html', 'This SPA is serverd from memory!' )

		await request( '/', 'This SPA is serverd from memory!' )
		await request( '/inexistent/route', 'This SPA is serverd from memory!' )

		pulsa.memory( './test/public_spa_memory/index.html', 'This SPA is UPDATED from memory!' )

		await request( '/', 'This SPA is UPDATED from memory!' )
		request( '/inexistent/route', 'This SPA is UPDATED from memory!', true )

	});

	test('15. Memory files overwriting 404 files', async done => {

		const request = ( path = '', expected, non_existent = false, end = false ) => {

			return new Promise ( promise_resolve => {

				http.get( 'http://127.0.0.1:9000' + path, response => {

					expect( response.statusCode ).toBe( non_existent ? 404 : 200 );

					if ( non_existent ) {

						promise_resolve();

						if ( end ) done();

					} else {

						let data = '';

						response.on( 'data', chunk => { data += chunk } )

						response.on( 'end', () => {

							expect( data ).toBe( expected );

							promise_resolve();
							
							if ( end ) done();

						})

					}

				})

			})

		}

		await request( '/non_existen_to_be_overwrited.txt', null, true )

		pulsa.memory( './test/public_html/non_existen_to_be_overwrited.txt', 'Now this non-existent file exists! No more 404s!' )

		request( '/non_existen_to_be_overwrited.txt', 'Now this non-existent file exists! No more 404s!', false, true )

	});

	test('16. Memory files overwriting 404 index-files', async done => {

		const request = ( path = '', expected, non_existent = false, end = false ) => {

			return new Promise ( promise_resolve => {

				http.get( 'http://127.0.0.1:9008' + path, response => {

					expect( response.statusCode ).toBe( non_existent ? 404 : 200 );

					if ( non_existent ) {

						promise_resolve();

						if ( end ) done();

					} else {

						let data = '';

						response.on( 'data', chunk => { data += chunk } )

						response.on( 'end', () => {

							expect( data ).toBe( expected );

							promise_resolve();
							
							if ( end ) done();

						})

					}

				})

			})

		}

		await request( '/', null, true )
		await request( '/dir', null, true )

		pulsa.memory( './test/public_memory/index.html', 'Now this non-existent INDEX exists! No more 404s!' )
		pulsa.memory( './test/public_memory/dir/index.html', 'Now this non-existent INDEX inside "dir" exists! No more 404s!' )

		await request( '/', 'Now this non-existent INDEX exists! No more 404s!', false )
		request( '/dir', 'Now this non-existent INDEX inside "dir" exists! No more 404s!', false, true )

	});

	test('17. Memory files overwriting existing files from disk', async done => {

		const request = ( path = '', expected, end = false ) => {

			return new Promise ( promise_resolve => {

				http.get( 'http://127.0.0.1:9009' + path, response => {

					expect( response.statusCode ).toBe( 200 );

					let data = '';

					response.on( 'data', chunk => { data += chunk } )

					response.on( 'end', () => {

						expect( data ).toBe( expected );

						promise_resolve();
						
						if ( end ) done();

					})

				})

			})

		}

		await request( '/', 'This content needs to be overwrited!' )
		await request( '/other.html', 'This other content needs to be overwrited!' )

		pulsa.memory( './test/public_overwriting/index.html', 'Index overwrited, even existing. Nicely done!' )
		pulsa.memory( './test/public_overwriting/other.html', 'Other overwrited, even existing. Nicely done!' )

		await request( '/', 'Index overwrited, even existing. Nicely done!' )
		await request( '/other.html', 'Other overwrited, even existing. Nicely done!' )

		done();

	});

	test('Final: Clearing caches test', done => {

		// With a path

		pulsa.clear( resolve( './test/public_html/index.html' ) )
		pulsa.clear( resolve( './test/public_spa/without_index/' ) + '/' )
		pulsa.clear( resolve( './test/public_spa/spa/without_index/' ) )

		// Without a path (ignored)
		pulsa.clear()

		// Done
		done();

	});

});