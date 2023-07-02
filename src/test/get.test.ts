import * as http from 'http'
import { Server } from '../server';
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
describe('GET /api/users', () => {

	it('should return empty array of users', (done: () => {}) => {
		const server = createServerInstance();
		http.get(`http://localhost:${server.port}/api/users`, res => {
			let data = ''

			res.on('data', (chunk: string) => data += chunk)
			res.on('end', () => {
				expect(res.statusCode).toEqual(STATUS_CODE.SUCCESS)
				const parsed = JSON.parse(data)
				expect(parsed).toEqual({ message: [] });
				server.serverInstance.close()
				done()
			})
		})
	});

	it('should answer with status code 400 and corresponding message if userId is invalid (not uuid)', (done: () => {}) => {
		const server = createServerInstance();
		http.get(`http://localhost:${server.port}/api/users/e8e01400-18c4`, res => {
			let data = ''

			res.on('data', (chunk: string) => data += chunk)
			res.on('end', () => {
				expect(res.statusCode).toEqual(STATUS_CODE.BAD_REQUEST)
				const parsed = JSON.parse(data)
				expect(parsed).toEqual({ message: 'Invalid user ID' });
				server.serverInstance.close();
				done()
			})
		})
	});

	it('should answer with status code 404 and corresponding message if record with id === userId doesn`t exist', (done: () => {}) => {
		const server = createServerInstance();
		server.serverInstance.users = [{
			username: "Bob",
			age: 30,
			hobbies: [
				"sport",
				"art"
			],
			id: "e8e01400-18c4-11ee-acd2-abf35613e81d"
		},
		{
			username: "Sam",
			age: 20,
			hobbies: [
				"sport"
			],
			id: "392f3390-18c6-11ee-8a94-a11f2fbaadd6"
		}];
		http.get(`http://localhost:${server.port}/api/users/e8e01400-18c4-11ee-acd2-abf35613e80e`, res => {
			let data = ''

			res.on('data', (chunk: string) => data += chunk)
			res.on('end', () => {

				expect(res.statusCode).toEqual(STATUS_CODE.NOT_FOUND);
				const parsed = JSON.parse(data);
				expect(parsed).toEqual({ message: 'User is not found' });
				server.serverInstance.close();
				done()
			})
		})
	});


	it('Server should answer with status code 200 and record with id === userId if it exists', (done: () => {}) => {
		const server = createServerInstance();
		server.serverInstance.users = [{
			username: "Bob",
			age: 30,
			hobbies: [
				"sport",
				"art"
			],
			id: "e8e01400-18c4-11ee-acd2-abf35613e81d"
		},
		{
			username: "Sam",
			age: 20,
			hobbies: [
				"sport"
			],
			id: "392f3390-18c6-11ee-8a94-a11f2fbaadd6"
		}];
		http.get(`http://localhost:${server.port}/api/users/392f3390-18c6-11ee-8a94-a11f2fbaadd6`, res => {
			let data = ''

			res.on('data', (chunk: string) => data += chunk)
			res.on('end', () => {

				expect(res.statusCode).toEqual(STATUS_CODE.SUCCESS)
				const parsed = JSON.parse(data)
				expect(parsed).toEqual({
					message:
					{
						username: "Sam",
						age: 20,
						hobbies: [
							"sport"
						],
						id: "392f3390-18c6-11ee-8a94-a11f2fbaadd6"
					}
				});
				server.serverInstance.close();
				done()
			})
		});
	});

	it('Server should answer with status code 404 and Invalide route message', (done: () => {}) => {
		const server = createServerInstance();
		server.serverInstance.users = [{
			username: "Bob",
			age: 30,
			hobbies: [
				"sport",
				"art"
			],
			id: "e8e01400-18c4-11ee-acd2-abf35613e81d"
		},
		{
			username: "Sam",
			age: 20,
			hobbies: [
				"sport"
			],
			id: "392f3390-18c6-11ee-8a94-a11f2fbaadd6"
		}];
		http.get(`http://localhost:${server.port}/api/use/392f3390-18c6-11ee-8a94-a11f2fbaadd6`, res => {
			let data = ''

			res.on('data', (chunk: string) => data += chunk)
			res.on('end', () => {

				expect(res.statusCode).toEqual(STATUS_CODE.NOT_FOUND)
				const parsed = JSON.parse(data)
				expect(parsed).toEqual({
					message: 'Invalid route'
				});
				server.serverInstance.close();
				done()
			})
		});
	});
})
