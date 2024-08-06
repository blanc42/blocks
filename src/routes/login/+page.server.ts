import { loginUser, createJWT, setAuthCookie } from '$lib/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const user = await loginUser(email, password);

        if (user) {
            const token = createJWT(user.id);
            setAuthCookie(cookies, token);
            throw redirect(303, '/');
        } else {
            return fail(400, { email, incorrect: true });
        }
    }
};