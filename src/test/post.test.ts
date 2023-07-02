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
describe('POST /api/users', () => {
	it('should answer with status code 201 and newly created record', (done: () => {}) => {
		const server = createServerInstance();
		server.serverInstance.users = [];
		const data = JSON.stringify({
			username: 'Sara',
			age: 18,
			hobbies: ['art']
		});

		const options = {
			hostname: 'localhost',
			port: server.port,
			path: '/api/users',
			method: METHODS.POST,
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
				expect(res.statusCode).toEqual(STATUS_CODE.CREATED);
				const parsed = JSON.parse(body);
				expect(parsed).toEqual({ message: server.serverInstance.users[0] });
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

	it('should answer with status code 400 and corresponding message if request body does not contain required fields', (done: () => {}) => {
		const server = createServerInstance();
		server.serverInstance.users = [];
		const data = JSON.stringify({
			username: 'Sara',
			hobbies: ['art']
		});

		const options = {
			hostname: 'localhost',
			port: server.port,
			path: '/api/users',
			method: METHODS.POST,
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
				expect(parsed).toEqual({ message: 'Invalid user data, specify all required fields' });
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

	it('should answer with status code 400 and corresponding message if route is invalid', (done: () => {}) => {
		const server = createServerInstance();
		server.serverInstance.users = [];
		const data = JSON.stringify({
			username: 'Sara',
			age: 18,
			hobbies: []
		});

		const options = {
			hostname: 'localhost',
			port: server.port,
			path: '/api/user',
			method: METHODS.POST,
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
