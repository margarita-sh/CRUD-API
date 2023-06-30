import { UserInterface } from '../user.interface';

export function hasAllRequiredFields(user: UserInterface): boolean {
	const requiredFields: Array<keyof UserInterface> = ['username', 'age', 'hobbies'];
	for (const field of requiredFields) {
	  if (!(field in user)) {
		return false;
	  }
	}
	return true;
  }