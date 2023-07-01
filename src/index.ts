import * as http from 'http';
import * as dotenv from 'dotenv';
import { METHODS } from './methods.enum';
import { UserInterface } from './user.interface';
import { isValidUUID } from './utils/check-uuid';
import { hasAllRequiredFields } from './utils/check-requiredFields';
import { User } from './utils/user';
import { checkJSONvalifity } from './utils/check-JSONvalidity';
import { STATUS_CODE } from './statusCode.enum';

dotenv.config();

const users: UserInterface[] = [];

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
	const { url, method } = req;
	const urlParsing: string[] = url?.split('/')?.filter(item => !!item) || [];
	const uuidPattern = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;
	const userId = url?.match(uuidPattern)?.[0] || '';

	switch (method) {
		case METHODS.GET:
			try {
				if (url?.includes('api/users') && urlParsing.length === 2) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({ message: users }));
				}

				if (url?.includes('api/users') && urlParsing.length === 3) {
					if (isValidUUID(userId)) {
						const foundUser = users.find((user) => user.id === userId);
						if (foundUser) {
							res.statusCode = STATUS_CODE.SUCCESS;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({ message: foundUser }));
						} else {
							res.statusCode = STATUS_CODE.NOT_FOUND;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({ message: 'User is not found' }));
						}
					} else {
						res.statusCode = STATUS_CODE.BAD_REQUEST;
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({ message: 'Invalid user ID' }));
					}
				}
				if (!url?.includes('api/users')) {
					res.statusCode = STATUS_CODE.NOT_FOUND;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({ message: 'Invalid route' }));
				}
			} catch (err) {
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: 'Internal Server Error' }));
			}

			break;

		case METHODS.POST:
			if (url?.includes('api/users')) {
				let body = '';
				req.on('data', chunk => {
					body += chunk;
				});
				req.on('end', () => {
					if (!checkJSONvalifity(body)) {
						res.statusCode = STATUS_CODE.BAD_REQUEST;
						res.writeHead(res.statusCode, { 'Content-Type': 'application/json' });
						res.end(JSON.stringify({ message: 'Invalid JSON' }));
					} else {
						try {
							const newUser: UserInterface = JSON.parse(body);
							if (hasAllRequiredFields(newUser)) {
								const user = new User(newUser);
								users.push(user);
								res.statusCode = STATUS_CODE.CREATED;
								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify({ message: user }));
							} else {
								res.statusCode = STATUS_CODE.BAD_REQUEST;
								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify({ message: 'Invalid user data, specify all required fields' }));
							}
						} catch (error) {
							res.statusCode = STATUS_CODE.SERVER_ERROR;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({ message: 'Internal Server Error' }));
						}
					};
				})
			} else {
				res.statusCode = STATUS_CODE.NOT_FOUND;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({ message: 'Invalid route' }));
			}
			break;

		case METHODS.PUT:
			if (url?.includes('api/users')) {
				let body = '';
				req.on('data', chunk => {
					body += chunk;
				});
				req.on('end', () => {
					if (!checkJSONvalifity(body)) {
						res.statusCode = STATUS_CODE.BAD_REQUEST;
						res.writeHead(res.statusCode, { 'Content-Type': 'application/json' });
						res.end(JSON.stringify({ message: 'Invalid JSON' }));
					} else {
						try {
							const requestedUser: UserInterface = JSON.parse(body);
							if (hasAllRequiredFields(requestedUser) && isValidUUID(userId)) {
								const findIndex = users.findIndex(user => user.id === userId);
								if (findIndex >= 0) {
									requestedUser.id = userId;
									console.log('requestedUser', requestedUser)
									users.splice(findIndex, 1, requestedUser);
									res.statusCode = STATUS_CODE.SUCCESS;
									res.setHeader('Content-Type', 'application/json');
									res.end(JSON.stringify({ message: users[findIndex] }));
								} else {
									res.statusCode = STATUS_CODE.BAD_REQUEST;
									res.setHeader('Content-Type', 'application/json');
									res.end(JSON.stringify({ message: 'User is not found' }));
								}

							} else {
								res.statusCode = STATUS_CODE.BAD_REQUEST;
								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify({ message: 'Invalid user data, specify all required fields' }));
							}
						} catch (error) {
							res.statusCode = STATUS_CODE.SERVER_ERROR;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({ message: 'Internal Server Error' }));
						}
					};
				})
			} else {
				res.statusCode = STATUS_CODE.NOT_FOUND;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({ message: 'Invalid route' }));
			}
			break;

		case METHODS.DELETE:
			if (url?.includes('api/users')) {
				try {
					if (isValidUUID(userId)) {
						const findIndex = users.findIndex(user => user.id === userId);
						if (findIndex >= 0) {
							users.splice(findIndex, 1);
							res.statusCode = 204;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({ message: 'The user was removed' }));
						} else {
							res.statusCode = STATUS_CODE.NOT_FOUND;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({ message: 'User is not found' }));
						}

					} else {
						res.statusCode = STATUS_CODE.BAD_REQUEST;
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({ message: 'Invalid user data' }));
					}
				} catch (error) {
					res.statusCode = STATUS_CODE.SERVER_ERROR;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({ message: 'Internal Server Error' }));
				}
			};
			break;


		default:
			res.statusCode = STATUS_CODE.NOT_FOUND;
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({ message: 'Invalid route' }));
			break;
	}
});

server.listen(process.env.PORT);