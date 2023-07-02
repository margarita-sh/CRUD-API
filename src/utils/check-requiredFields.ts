import { IUser } from '../user.interface';

export function hasAllRequiredFields(user: Partial<IUser>): boolean {
	const requiredFields: Array<keyof IUser> = ['username', 'age', 'hobbies'];
	for (const field of requiredFields) {
	  if (!(field in user)) {
		return false;
	  }
	}
	return true;
  }