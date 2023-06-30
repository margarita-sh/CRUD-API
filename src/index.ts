import * as http from 'http';
import * as dotenv from 'dotenv';
import { METHODS } from './methods.enum';
import { UserInterface } from './user.interface';
import { isValidUUID } from './utils/check-uuid';
import { hasAllRequiredFields } from './utils/check-requiredFields';
import { User } from './utils/user';

dotenv.config();

const users: UserInterface[] = [];

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
	const { url, method } = req;
	const urlParsing: string[] = url?.split('/') || [];
	const userId = urlParsing[urlParsing.length - 1];

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
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({ message: foundUser }));
						} else {
							res.statusCode = 404;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({ message: 'User ID is not found' }));
						}
					} else {
						res.statusCode = 400;
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({ message: 'Invalid user ID' }));
					}
				}
			} catch (err) {
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: 'Internal Server Error' }));
			}

			break;

		case METHODS.POST:
			if (url?.includes('api/users')) {
				let body = '';
				req.on('data', (chunk) => {
					body += chunk.toString();
				});
				req.on('end', () => {
					try {
						const newUser: UserInterface = JSON.parse(body);
						if (hasAllRequiredFields(newUser)) {
							newUser.id = userId;
							users.push(newUser);
							res.statusCode = 201;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({ message: newUser }));
						} else {
							res.statusCode = 400;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({ message: 'Invalid user data' }));
						}
					} catch (error) {
						res.statusCode = 500;
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({ message: 'Internal Server Error' }));
					}
				});
			}
			break;

		default:
			res.statusCode = 404;
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({ message: 'Invalid route' }));
			break;
	}
});

server.listen(process.env.PORT);