import * as uuid from 'uuid';
import { IUser } from '../user.interface';

export class User {
	public username: string;
	public age: number;
	public hobbies: string[];
	public id: string;

	constructor(data: Partial<IUser>) {
		this.username = data.username || '';
		this.age = data.age || 0;
		this.hobbies = data.hobbies || [];
		this.id  = data.id ?? uuid.v1();
	}

}
