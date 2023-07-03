import * as http from 'http'
import { Server } from '../server';
import { METHODS } from '../methods.enum';
import { STATUS_CODE } from '../statusCode.enum';

function createServerInstance(): { serverInstance: any, port: number } {
	const port = Math.floor(Math.random() * (65535 - 1024)) + 1024;
	const serverInstance = new Server();
	serverInstance.server.listen(port);

	return {
		serverInstance,
		port
	}
}
describe('PUT /api/users', () => {
	it('should answer with status code 200 and updated record', (done: () => {}) => {
		const server = createServerInstance();
		server.serverInstance.users = [
			{
				username: "Sam",
				age: 20,
				hobbies: [
					"sport"
				],
				id: "392f3390-18c6-11ee-8a94-a11f2fbaadd6"
			},
			{
				username: "Max",
				age: 28,
				hobbies: [
					"sport"
				],
				id: "392f3390-18c6-11ee-8a94-a11f2fbaadd5"
			},
		];
		const data = JSON.stringify({
			username: "Aron",
			age: 30,
			hobbies: [
				"sport"
			],
		},
		);

		const options = {
			hostname: 'localhost',
			port: server.port,
			path: '/api/users/392f3390-18c6-11ee-8a94-a11f2fbaadd6',
			method: METHODS.PUT,
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': data.length
			}
		};

		const req = http.request(options, (res) => {
			let body = '';

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				expect(res.statusCode).toEqual(STATUS_CODE.SUCCESS);
				const parsed = JSON.parse(body);
				expect(parsed).toEqual({
					message: {

						username: "Aron",
						age: 30,
						hobbies: [
							"sport"
						],
						id: "392f3390-18c6-11ee-8a94-a11f2fbaadd6"
					}
				});
				server.serverInstance.close()
				done()
			});
		});

		req.on('error', (error) => {
			console.error(error);
		});

		req.write(data);
		req.end();
	});

	it('should answer with status code 400 and corresponding message if userId is invalid (not uuid)', (done: () => {}) => {
		const server = createServerInstance();
		server.serverInstance.users = [
			{
				username: "Sam",
				age: 20,
				hobbies: [
					"sport"
				],
				id: "392f3390-18c6-11ee-8a94-a11f2fbaadd6"
			},
			{
				username: "Max",
				age: 28,
				hobbies: [
					"sport"
				],
				id: "392f3390-18c6-11ee-8a94-a11f2fbaadd5"
			},
		];
		const data = JSON.stringify({
			username: "Aron",
			age: 30,
			hobbies: [
				"sport"
			],
		},
		);

		const options = {
			hostname: 'localhost',
			port: server.port,
			path: '/api/users/392f3390-18c6-11ee-8a94-a11f2fbaad',
			method: METHODS.PUT,
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': data.length
			}
		};

		const req = http.request(options, (res) => {
			let body = '';

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				expect(res.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
				const parsed = JSON.parse(body);
				expect(parsed).toEqual({
					message: 'Invalid user data, specify all required fields'});
				server.serverInstance.close()
				done()
			});
		});

		req.on('error', (error) => {
			console.error(error);
		});

		req.write(data);
		req.end();
	});

	it('should answer with status code 404 and corresponding message if record with id === userId doesn`t exist', (done: () => {}) => {
		const server = createServerInstance();
		server.serverInstance.users = [
			{
				username: "Sam",
				age: 20,
				hobbies: [
					"sport"
				],
				id: "392f3390-18c6-11ee-8a94-a11f2fbaadd6"
			},
			{
				username: "Max",
				age: 28,
				hobbies: [
					"sport"
				],
				id: "392f3390-18c6-11ee-8a94-a11f2fbaadd5"
			},
		];
		const data = JSON.stringify({
			username: "Aron",
			age: 30,
			hobbies: [
				"sport"
			],
		},
		);

		const options = {
			hostname: 'localhost',
			port: server.port,
			path: '/api/users/392f3390-18c6-11ee-8a94-a11f2fbaadd4',
			method: METHODS.PUT,
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': data.length
			}
		};

		const req = http.request(options, (res) => {
			let body = '';

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				expect(res.statusCode).toEqual(STATUS_CODE.NOT_FOUND);
				const parsed = JSON.parse(body);
				expect(parsed).toEqual({
					message: 'User is not found'});
				server.serverInstance.close()
				done()
			});
		});

		req.on('error', (error) => {
			console.error(error);
		});

		req.write(data);
		req.end();
	});


	it('should answer with status code 404 and corresponding message wrong route', (done: () => {}) => {
		const server = createServerInstance();
		server.serverInstance.users = [
			{
				username: "Max",
				age: 28,
				hobbies: [
					"sport"
				],
				id: "392f3390-18c6-11ee-8a94-a11f2fbaadd5"
			},
		];
		const data = JSON.stringify({});

		const options = {
			hostname: 'localhost',
			port: server.port,
			path: '/api/us/392f3390-18c6-11ee-8a94-a11f2fbaadd7',
			method: METHODS.PUT,
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': data.length
			}
		};

		const req = http.request(options, (res) => {
			let body = '';

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				expect(res.statusCode).toEqual(STATUS_CODE.NOT_FOUND);
				const parsed = JSON.parse(body);
				expect(parsed).toEqual({ message: 'Invalid route' });
				server.serverInstance.close()
				done()
			});
		});

		req.on('error', (error) => {
			console.error(error);
		});

		req.write(data);
		req.end();
	});
})
