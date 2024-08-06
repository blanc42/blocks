import { createUser } from '$lib/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({request} ) => {
		const {username, email, password} = Object.fromEntries(await request.formData()) as {
			username: string;
			email: string;
			password: string;
		};
		console.log('Received form data:', username, email, password);
		const user = await createUser(username, email, password);
		return { success: true, user };
	}
};