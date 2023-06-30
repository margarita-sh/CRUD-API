import * as http from 'http';
import * as dotenv from 'dotenv';
import { METHODS } from './methods.enum';
import { UserInterface } from './user.interface';
import { isValidUUID } from './utils/check-uuid';

dotenv.config();
const users: UserInterface[] = [];
const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {

	const { url, method } = req;
	const urlParsing: string[] = url?.split('/');
	const userId = urlParsing[urlParsing.length - 1]
	switch (method) {
		case METHODS.GET:
			if (url === 'api/users') {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({ message: [] }));
			}

			if (url?.includes('api/users') && urlParsing.length === 3) {
				if (isValidUUID(userId)) {
					const foundUser = users.find(user => user.id === userId);
					if (foundUser) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({ message: foundUser }));
					} else {
						res.statusCode = 404;
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({ message: 'user ID  is not found' }));
					}
				} else {
					res.statusCode = 400;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({ message: 'user ID  is not invalid' }));
				}
				break;
				case METHODS.POST:
					if (url === 'api/users') {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({ message: [] }));
					}
					break;

			}

	});

server.listen(process.env.PORT);