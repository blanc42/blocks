import type { RequestHandler } from '@sveltejs/kit';

let tasks: string[] = [];

export const GET: RequestHandler = async () => {
    return new Response(JSON.stringify({ tasks }), {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const POST: RequestHandler = async ({ request }) => {
    const { task } = await request.json();
    tasks.push(task);
    return new Response(JSON.stringify({ message: 'Task added' }), {
        headers: { 'Content-Type': 'application/json' }
    });
};